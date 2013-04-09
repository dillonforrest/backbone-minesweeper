/*global module, test, equal, Minesweeper, ok*/

$(document).on('ready', function () {

	var Mines = Minesweeper.Collections.Mines,
		MinesFn = Mines.prototype;

	module("Collections.Mines", {
		setup: function () {
			this.originalCreateField = MinesFn.createField;
		},
		teardown: function () {
			MinesFn.createField = this.originalCreateField;
		}
	});

	test("Mines collection exists", 1, function () {
		ok(Mines);
	});

	test("`initialize` sets length to 64 if level is easy", 1, function () {
		var col;

		MinesFn.createField = function (mineCount) {
			equal(mineCount, 64);
		};

		col = new Mines([], {level: 'easy'});
	});

	test("`initialize` sets length to 256 if intermediate", 1, function () {
		var col;

		MinesFn.createField = function (mineCount) {
			equal(mineCount, 256);
		};

		col = new Mines([], {level: 'intermediate'});
	});

	test("`initialize` sets length to 480 if hard", 1, function () {
		var col;

		MinesFn.createField = function (mineCount) {
			equal(mineCount, 480);
		};

		col = new Mines([], {level: 'hard'});
	});
});
