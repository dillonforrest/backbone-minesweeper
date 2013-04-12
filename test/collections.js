/*global module, test, equal, Minesweeper, ok, _*/

$(document).on('ready', function () {

	var Mines = Minesweeper.Collections.Mines,
		MinesFn = Mines.prototype;
	
	function createCollections (env) {
		function createMines (level) {
			return new Mines(false, {level: level});
		}

		env.easy         = createMines('easy');
		env.intermediate = createMines('intermediate');
		env.hard         = createMines('hard');
	}

	function deleteCollections (env) {
		delete env.easy;
		delete env.intermediate;
		delete env.hard;
	}

	////////////////////////////////////////////////
	////////////////////////////////////////////////

	module("Collections.Mines", {
		setup: function () {
			this.originalCreateField = MinesFn.createField;
		},
		teardown: function () {
			MinesFn.createField = this.originalCreateField;
		}
	});

	test("Mines collection exists", 1, function () { ok(Mines); });

	test("`initialize` passes game level to createField", 1, function () {
		var gameLevel = 'lolcops',
			col;

		MinesFn.createField = function (level) {
			equal(level, gameLevel);
		};

		col = new Mines([], {level: gameLevel});
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
		this.easy.setMines = function (level) {
			ok(true);
			equal(level, 'easy');
			return [];
		};

		this.easy.createField('easy');

		this.intermediate.setMines = function (level) {
			ok(true);
			equal(level, 'intermediate');
			return [];
		};

		this.intermediate.createField('intermediate');

		this.hard.setMines = function (level) {
			ok(true);
			equal(level, 'hard');
			return [];
		};

		this.hard.createField('hard');
	});

	////////////////////////////////////////////////
	////////////////////////////////////////////////

	module("`setMines` method", {
		setup    : function () {
			createCollections(this);
			this.originalShuffle = _.shuffle;
			this.getMines = function (squares) {
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
		var squares = this.easy.setMines('easy'),
			mines = this.getMines(squares);

		ok(squares);
		equal(squares.length, 64);
		ok(mines);
		equal(mines.length, 10);
	});

	test("intermediate levels have 40 mines", 1, function () {
		var squares = this.intermediate.setMines('intermediate'),
			mines = this.getMines(squares);

		equal(mines.length, 40);
	});

	test("hard levels have 99 mines", 1, function () {
		var squares = this.hard.setMines('hard'),
			mines = this.getMines(squares);

		equal(mines.length, 99);
	});

	test("mines are randomly placed in the field", 2, function () {
		_.shuffle = function (list) {
			ok(true);
			ok( _.isArray(list) );
		};

		this.easy.setMines('easy');
	});
});
