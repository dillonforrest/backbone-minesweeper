
(function () {
	var Backbone = this.Backbone,
		self = this,
		$app;

	this.Minesweeper = (function () {
		var Views;

		Views = {
			StartGame: Backbone.View.extend({
				events: {
					'click .easy': 'getEasyLevel',
					'click .intermediate': 'getIntermediateLevel',
					'click .hard': 'getHardLevel'
				},

				initialize: function () {
					this.render();
				},

				getEasyLevel: function () {
					return;
				},

				getIntermediateLevel: function () {
					return;
				},

				getHardLevel: function () {
					return;
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
			Views: Views
		};
	})();

	$(document).on('ready', function () {
		$app = $('#app');
		self.Minesweeper.initialize();
	});
}).call(this);
