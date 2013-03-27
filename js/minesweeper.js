
(function () {
	var Backbone = this.Backbone,
		self = this,
		$app;

	this.Minesweeper = (function () {
		var Views;

		Views = {
			StartGame: Backbone.View.extend({
				render: function () {
					return $('#start-screen').html();
				}
			})
		};

		return {
			initialize: function () {
				var game = new Views.StartGame();
				$app.append(game.render());
			},
			Views: Views
		};
	})();

	$(document).on('ready', function () {
		$app = $('#app');
		self.Minesweeper.initialize();
	});
}).call(this);
