/*global module, test, equal, Minesweeper, ok, _, deepEqual*/

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

	test("the backup mine's index is cached as a collection attribute", 2,
	function () {
		ok( this.easy.backupIndex );
		equal(typeof this.easy.backupIndex, 'number');
	});

	////////////////////////////////////////////////
	////////////////////////////////////////////////

	module("`setSquares` method", {
		setup    : function () {
			createCollections(this);
			this.originalShuffle = _.shuffle;
			this.originalFind = _.find;
			this.getSquares = function (squares) {
				return _.filter(squares, function (sq) {
					return ( sq.name === 'mine' );
				});
			};
		},
		teardown : function () {
			deleteCollections(this);
			_.shuffle = this.originalShuffle;
			_.find = this.originalFind;
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
			return list;
		};

		this.easy.setSquares('easy');
	});

	test("`setSquares` sets model ids by order of insertion to col", 3,
	function () {
		equal( this.easy.at(5).id          , 5   );
		equal( this.intermediate.at(72).id , 72  );
		equal( this.hard.at(303).id        , 303 );
	});

	test("one empty sq is flagged. this ensures user doesn't click on " +
	"a mine first", 2, function () {
		var squares = this.easy.setSquares('easy'),
			groups = _.groupBy(squares, function (sq) {
				return ( sq.isBackup ? 'isBackup' : 'notBackup' );
			});

		equal(groups.isBackup.length, 1);
		equal(groups.isBackup[0].name, 'empty', "backup is not a mine");

		/*
		About `isBackupMine` attribute:
		When a user first clicks on a square in minesweeper, the first
		square is guaranteed to not be a mine. In my implementation of
		minesweeper, all the mines are assigned to squares before the first
		click. If a user first clicks on a mine, the game will swap that
		square for this empty square, with `isBackupMine` set to true.
		*/
	});

	test("neighbors for each square are determined", 192, function () {
		this.easy.getNeighbors = function (id, level) {
			ok(true);
			equal(typeof id, 'number');
			equal(level, 'easy');
		};
		this.easy.setSquares('easy');
	});

	////////////////////////////////////////////////
	////////////////////////////////////////////////

	module("`getNeighbors` method", {
		setup    : function () { createCollections(this); },
		teardown : function () { deleteCollections(this); }
	});

	test("squares in the grid's corners have 3 neighbors", 8, function () {
		var topLeft = this.easy.getNeighbors(0, 'easy'),
			topRight = this.easy.getNeighbors(7, 'easy'),
			bottomLeft = this.easy.getNeighbors(56, 'easy'),
			bottomRight = this.easy.getNeighbors(63, 'easy');

		equal(topLeft.length, 3);
		deepEqual(topLeft, [1, 8, 9]);
		equal(topRight.length, 3);
		deepEqual(topRight, [6, 14, 15]);
		equal(bottomLeft.length, 3);
		deepEqual(bottomLeft, [48, 49, 57]);
		equal(bottomRight.length, 3);
		deepEqual(bottomRight, [54, 55, 62]);
	});

	test("squares along the edge have 5 neighbors", 8, function () {
		var topRow = this.easy.getNeighbors(5, 'easy'),
			leftCol = this.easy.getNeighbors(24, 'easy'),
			rightCol = this.easy.getNeighbors(47, 'easy'),
			bottomCol = this.easy.getNeighbors(58, 'easy');

		equal(topRow.length, 5);
		deepEqual(topRow, [4, 6, 12, 13, 14]);
		equal(leftCol.length, 5);
		deepEqual(leftCol, [16, 17, 25, 32, 33]);
		equal(rightCol.length, 5);
		deepEqual(rightCol, [38, 39, 46, 54, 55]);
		equal(bottomCol.length, 5);
		deepEqual(bottomCol, [49, 50, 51, 57, 59]);
	});

	test("squares in middle have 8 neighbors", 2, function () {
		var middle = this.easy.getNeighbors(35, 'easy');
		equal(middle.length, 8);
		deepEqual(middle, [26, 27, 28, 34, 36, 42, 43, 44]);
	});

	////////////////////////////////////////////////
	////////////////////////////////////////////////

	module("`revealSquare` method", {
		setup    : function () { createCollections(this); },
		teardown : function () { deleteCollections(this); }
	});

});
