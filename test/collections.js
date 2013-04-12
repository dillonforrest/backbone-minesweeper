/*global module, test, equal, Minesweeper, ok, _*/

$(document).on('ready', function () {

	var Squares = Minesweeper.Collections.Squares,
		SquaresFn = Squares.prototype;
	
	function createCollections (env) {
		function createSquares (level) {
			return new Squares(false, {level: level});
		}

		env.easy         = createSquares('easy');
		env.intermediate = createSquares('intermediate');
		env.hard         = createSquares('hard');
	}

	function deleteCollections (env) {
		delete env.easy;
		delete env.intermediate;
		delete env.hard;
	}

	////////////////////////////////////////////////
	////////////////////////////////////////////////

	module("Collections.Squares", {
		setup: function () {
			this.originalCreateField = SquaresFn.createField;
		},
		teardown: function () {
			SquaresFn.createField = this.originalCreateField;
		}
	});

	test("Squares collection exists", 1, function () { ok(Squares); });

	test("`initialize` passes game level to createField", 1, function () {
		var gameLevel = 'lolcops',
			col;

		SquaresFn.createField = function (level) {
			equal(level, gameLevel);
		};

		col = new Squares([], {level: gameLevel});
	});

	////////////////////////////////////////////////
	////////////////////////////////////////////////

	module("`createField` method", {
		setup    : function () { createCollections(this); },
		teardown : function () { deleteCollections(this); }
	});

	test("`createField` sets length according to level", 3, function () {
		equal(this.easy.length         , 64);
		equal(this.intermediate.length , 256);
		equal(this.hard.length         , 480);
	});

	test("`createField` sets the mines in the field", 6, function () {
		this.easy.setSquares = function (level) {
			ok(true);
			equal(level, 'easy');
			return [];
		};

		this.easy.createField('easy');

		this.intermediate.setSquares = function (level) {
			ok(true);
			equal(level, 'intermediate');
			return [];
		};

		this.intermediate.createField('intermediate');

		this.hard.setSquares = function (level) {
			ok(true);
			equal(level, 'hard');
			return [];
		};

		this.hard.createField('hard');
	});

	////////////////////////////////////////////////
	////////////////////////////////////////////////

	module("`setSquares` method", {
		setup    : function () {
			createCollections(this);
			this.originalShuffle = _.shuffle;
			this.getSquares = function (squares) {
				return _.filter(squares, function (sq) {
					return ( sq.name === 'mine' );
				});
			};
		},
		teardown : function () {
			deleteCollections(this);
			_.shuffle = this.originalShuffle;
		}
	});

	test("easy levels have 10 mines", 4, function () {
		var squares = this.easy.setSquares('easy'),
			mines = this.getSquares(squares);

		ok(squares);
		equal(squares.length, 64);
		ok(mines);
		equal(mines.length, 10);
	});

	test("intermediate levels have 40 mines", 1, function () {
		var squares = this.intermediate.setSquares('intermediate'),
			mines = this.getSquares(squares);

		equal(mines.length, 40);
	});

	test("hard levels have 99 mines", 1, function () {
		var squares = this.hard.setSquares('hard'),
			mines = this.getSquares(squares);

		equal(mines.length, 99);
	});

	test("mines are randomly placed in the field", 2, function () {
		_.shuffle = function (list) {
			ok(true);
			ok( _.isArray(list) );
		};

		this.easy.setSquares('easy');
	});
});
