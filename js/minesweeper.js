(function () {
	var Backbone = this.Backbone,
		_ = this._,
		self = this,
		$app;

	this.Minesweeper = (function () {
		var Views, Collections, Models;

		Models = {
			Square: Backbone.Model.extend({
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
						i, name, shuffled;

					for (i = 0; i < numSquares; i++) {
						name = ( i < numMines ? 'mine' : 'empty' );
						allSquares.push({ name: name });
						if (i === numMines) { allSquares[i].isBackup = true; }
					}

					shuffled = _.shuffle(allSquares);

					for (i = 0; i < numSquares; i++) {
						shuffled[i].id = i;
						shuffled[i].neighbors = this.getNeighbors(i, level);
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
					} else if (id % 8 === 0) { // is along left edge
						neighbors = [id - width, id - width + 1,
							id + 1, id + width, id + width + 1];
					} else if (id % 8 === 7) { // is along right edge
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

				revealSquare: function (id) {
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
						id = $target.data('sq');

					evt.preventDefault();

					$target.removeClass('covered');
					this.collection.revealSquare(id);
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
