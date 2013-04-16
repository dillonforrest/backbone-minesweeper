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
					}

					return shuffled;
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
					var id = $(evt.currentTarget).data('sq');
					evt.preventDefault();
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
