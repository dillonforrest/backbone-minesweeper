/*global test, Minesweeper, module, ok*/

$(document).on('ready', function () {

	module("Views.StartGame", {
		setup: function () {
			this.view = new Minesweeper.Views.StartGame();

			this.originalHtml = $.prototype.html;
		},
		teardown: function () {
			$.prototype.html = this.originalHtml;
		}
	});

	test("`render` injects template into dom", 1, function () {
		$.prototype.html = function () {
			ok(true);
		};

		this.view.render();
	});
});
