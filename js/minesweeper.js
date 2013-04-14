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
				initialize: function (opts) {
					if (opts.level) {
						this.collection = new Collections.Squares(false, {
							level: opts.level
						});
					}

					this.render();
				},

				render: function () {
				}
			}),

			StartGame: Backbone.View.extend({
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
					$app.mustache('start-screen', {});
					this.setElement($app);
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
