/*global test, ok, Minesweeper*/

$(document).on('ready', function () {
	test('Views.StartGame', 1, function () {
		ok(Minesweeper.Views.StartGame);
	});
});
