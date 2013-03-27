/*global test, ok, Minesweeper, equal*/

// app.js is NOT related to node.js

$(document).on('ready', function () {
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
});
