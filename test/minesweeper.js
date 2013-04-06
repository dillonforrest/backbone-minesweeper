/*global test, ok, Minesweeper, equal, module*/

// app.js is NOT related to node.js

$(document).on('ready', function () {

	var StartGameFn = Minesweeper.Views.StartGame.prototype;

	module("Minesweeper initialization", {
		setup: function () {
			this.originalAdd = $.Mustache.addFromDom;
			this.originalInit = StartGameFn.initialize;
		},
		teardown: function () {
			$.Mustache.addFromDom = this.originalAdd;
			StartGameFn.initialize = this.originalInit;
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

	test("`initialize` adds templates", 1, function () {
		$.Mustache.addFromDom = function () {
			ok(true);
		};

		Minesweeper.initialize();
	});

	test("`initialize` renders StartGame view instance", 1, function () {
		StartGameFn.initialize = function () {
			ok(true);
		};

		Minesweeper.initialize();
	});

	test("Minesweeper.Collections", 1, function () {
		ok(Minesweeper);
	});
});
