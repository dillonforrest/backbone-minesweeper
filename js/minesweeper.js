(function () {
	var Backbone = this.Backbone,
		_ = this._,
		self = this,
		$app;

	this.Minesweeper = (function () {
		var Views, Collections, Models;

		Models = {
			Square: Backbone.Model.extend({
				initialize: function () {
					var name = this.get('name'),
						numMines = this.get('numMines');
					if (name !== 'mine' && numMines > 0) {
						this.set({name: numMines});
					}
				}
			})
		};

		Collections = {
			Squares: Backbone.Collection.extend({
				model: Models.Square,

				initialize: function (models, opts) {
					this.createField(opts.level);
				},

				createField: function (level) {
					var squares = this.setSquares(level),
						len = squares.length,
						i, square;

					for (i = 0; i < len; i++) {
						square = squares[i];
						this.add(square);
						if (square.isBackup) { this.backupIndex = i; }
					}
				},

				setSquares: function (level) {
					var numMines = {
							easy         : 10,
							intermediate : 40,
							hard         : 99
						}[level],
						numSquares = {
							easy         : 64,
							intermediate : 256,
							hard         : 480
						}[level],
						allSquares = [],
						i, name, shuffled, sq, neighbors;

					for (i = 0; i < numSquares; i++) {
						name = ( i < numMines ? 'mine' : 'empty' );
						allSquares.push({ name: name });
						if (i === numMines) { allSquares[i].isBackup = true; }
					}

					shuffled = _.shuffle(allSquares);

					for (i = 0; i < numSquares; i++) {
						sq = shuffled[i];
						sq.id = i;
						neighbors = this.getNeighbors(i, level);
						sq.neighbors = neighbors;
						sq.numMines = this.findNearbyMines(neighbors, shuffled);
					}

					return shuffled;
				},

				getNeighbors: function (id, level) { // sexiest function eva!!
					var pos = {
							easy         : [8, 8],
							intermediate : [16, 16],
							hard         : [30, 16]
						}[level],
						width = pos[0], height = pos[1], total = width * height,
						neighbors;

					// CORNERS OF GRID
					if (id === 0) { // is top-left corner
						neighbors = [1, width, width + 1];
					} else if (id === width - 1) { // is top-right corner
						neighbors = [width - 2, width * 2 - 2, width * 2 - 1];
					} else if (id === total - width) { // is bottom-left
						neighbors = [total - width * 2,
							total - width * 2 + 1, total - width + 1];
					} else if (id === total - 1) { // is bottom-right
						neighbors = [total - width - 2, total - width - 1,
							total - 2];
					}

					// EDGES OF GRID
					else if (id < width) { // is along top edge
						neighbors = [id - 1, id + 1,
							id + width - 1, id + width, id + width + 1];
					} else if (id % width === 0) { // is along left edge
						neighbors = [id - width, id - width + 1,
							id + 1, id + width, id + width + 1];
					} else if (id % width === width - 1) { // is along right edge
						neighbors = [id - width - 1, id - width,
							id - 1, id + width - 1, id + width];
					} else if (id >= total - width) { // is along bottom edge
						neighbors = [id - width - 1, id - width,
							id - width + 1, id - 1, id + 1];
					}

					// IN THE MIDDLE OF GRID
					else {
						neighbors = [id - width - 1, id - width, id - width + 1,
							id - 1, id + 1, id + width - 1, id + width,
							id + width + 1];
					}

					return neighbors;
				},

				findNearbyMines: function (indexes, squares) {
					return  _.reduce(indexes, function (memo, index) {
						var neighbor = squares[index], mine;
						mine = ( neighbor.name === 'mine' ? 1 : 0 );
						return memo + mine;
					}, 0);
				},

				revealSquare: function (id) {
					var clicked = this.get(id),
						name = clicked.get('name'),
						numMines = Number(name),
						cssSelector;

					if (numMines) {
						cssSelector = {
							'1': 'one',
							'2': 'two',
							'3': 'three',
							'4': 'four',
							'5': 'five',
							'6': 'six',
							'7': 'seven',
							'8': 'eight'
						}[name.toString()];
					}

					return {
						html: ( name === 'empty' ? '' : name ),
						css: cssSelector
					};
				}
			})
		};

		Views = {
			Game: Backbone.View.extend({
				attributes: { id: 'game-view' },

				events: {
					'click .button.go-back'  : 'goToStartScreen',
					'click .grid td.covered' : 'uncoverSquare',
				},

				initialize: function (opts) {
					if (opts.level) {
						this.collection = new Collections.Squares(false, {
							level: opts.level
						});
					}

					this.render(opts.level);
				},

				goToStartScreen: function (evt) {
					evt.preventDefault();
					this.remove();
					return new Views.StartGame();
				},

				uncoverSquare: function (evt) {
					var $target = $(evt.currentTarget),
						id = $target.data('sq'),
						revealed;

					evt.preventDefault();

					$target.removeClass('covered');
					revealed = this.collection.revealSquare(id);
					$target.html(revealed.html).addClass(revealed.css);
				},

				createGrid: function (level) {
					var html = '<table>',
						numRows = ( level === 'easy' ? 8 : 16 ),
						numColumns = {
							easy         : 8,
							intermediate : 16,
							hard         : 30
						}[level],
						x, y;

					function getSquareNumber (x, y) {
						return (y * numColumns) + x;
					}

					for (y = 0; y < numRows; y++) {
						html += '<tr>';
						for (x = 0; x < numColumns; x++) {
							html += '<td data-sq="'
								+ getSquareNumber(x, y)
								+ '" class="covered" />';
						}
						html += '</tr>';
					}

					return html += '</table>';
				},

				render: function (level) {
					this.$el.mustache('game', {});
					this.$el.find('.grid').html(this.createGrid(level));
					$app.html(this.el);
					return this;
				}
			}),

			StartGame: Backbone.View.extend({
				attributes: { id: 'start-game-view' },

				events: {
					'click .easy'         : 'getEasyLevel',
					'click .intermediate' : 'getIntermediateLevel',
					'click .hard'         : 'getHardLevel'
				},

				initialize: function () {
					this.render();
				},

				getEasyLevel: function (evt) {
					return this.getGame('easy', evt);
				},

				getIntermediateLevel: function (evt) {
					return this.getGame('intermediate', evt);
				},

				getHardLevel: function (evt) {
					return this.getGame('hard', evt);
				},

				getGame: function (level, evt) {
					evt.preventDefault();
					this.remove();
					return new Views.Game({level: level});
				},

				render: function () {
					this.$el.mustache('start-screen', {});
					$app.html(this.el);
					return this;
				}
			})
		};

		return {
			initialize: function () {
				var game;
				$.Mustache.addFromDom();
				game = new Views.StartGame();
			},
			Models: Models,
			Collections: Collections,
			Views: Views
		};
	})();

	$(document).on('ready', function () {
		$app = $('#app');
		self.Minesweeper.initialize();
	});
}).call(this);
