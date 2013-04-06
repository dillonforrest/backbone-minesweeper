
(function () {
	var Backbone = this.Backbone,
		self = this,
		$app;

	this.Minesweeper = (function () {
		var Views, Collections;

		Collections = {
		};

		Views = {
			Game: Backbone.View.extend({
				initialize: function () {
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
			Collections: Collections,
			Views: Views
		};
	})();

	$(document).on('ready', function () {
		$app = $('#app');
		self.Minesweeper.initialize();
	});
}).call(this);
