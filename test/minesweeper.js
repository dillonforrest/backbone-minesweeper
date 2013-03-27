/*global test, ok, Minesweeper, equal, module*/

// app.js is NOT related to node.js

$(document).on('ready', function () {

	var StartGame = Minesweeper.Views.StartGame;

	module("Minesweeper initialization", {
		setup: function () {
			this.originalRender = StartGame.prototype.render;
		},
		teardown: function () {
			StartGame.prototype.render = this.originalRender;
		}
	});

	test("Minesweeper app exists", 1, function () {
		ok(Minesweeper);
	});

	test("Minesweeper.initialize", 2, function () {
		ok(Minesweeper.initialize);
		equal(typeof Minesweeper.initialize, 'function');
	});

	test("Minesweeper.Views", 1, function () {
		ok(Minesweeper.Views);
	});

	test("`initialize` calls `render` on `StartGame` view", 1, function () {
		StartGame.prototype.render = function () {
			ok(true, "`render` called");
		};

		Minesweeper.initialize();
	});
});
