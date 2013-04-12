/*global test, Minesweeper, module, ok, equal, deepEqual*/

$(document).on('ready', function () {

	var Squares = Minesweeper.Collections.Squares;

	////////////////////////////////////////////////
	////////////////////////////////////////////////

	module("Views.StartGame", {
		setup: function () {
			this.view = new Minesweeper.Views.StartGame();
			this.originalMustache = $.prototype.mustache;
			this.originalGame = Minesweeper.Views.Game;
		},
		teardown: function () {
			$.prototype.mustache = this.originalMustache;
			delete this.view;
			Minesweeper.Views.Game = this.originalGame;
		}
	});

	test("`initialize` calls `render`", 1, function () {
		this.view.render = function () {
			ok(true);
		};

		this.view.initialize();
	});

	test("clicking on a difficulty button creates a game of that level", 3,
	function () {
		var events = this.view.events;
		equal( events['click .easy']         , 'getEasyLevel' );
		equal( events['click .intermediate'] , 'getIntermediateLevel' );
		equal( events['click .hard']         , 'getHardLevel' );
	});

	test("`render` injects template into dom", 4, function () {
		$.prototype.mustache = function (templateId, data) {
			ok(true);
			equal(templateId, 'start-screen');
			deepEqual(data, {});
		};

		deepEqual( this.view, this.view.render(), "return `this`" );
	});

	test("`render` sets the element to $('#app')", 1, function () {
		this.view.setElement = function () {
			ok(true);
		};

		this.view.render();
	});

	test("`getEasyLevel` creates easy minesweeper game", 3, function () {
		var click = {
				preventDefault: function () {
					ok(true, "`preventDefault` called on event");
				}
			};

		Minesweeper.Views.Game = function (opts) {
			ok(true);
			equal(opts.level, 'easy');
		};

		this.view.getEasyLevel(click);
	});

	test("`getIntermediateLevel` creates intermediate minesweeper game", 3,
	function () {
		var click = {
				preventDefault: function () {
					ok(true, "`preventDefault` called on event");
				}
			};

		Minesweeper.Views.Game = function (opts) {
			ok(true);
			equal(opts.level, 'intermediate');
		};

		this.view.getIntermediateLevel(click);
	});

	test("`getHardLevel` creates hard minesweeper game", 3,
	function () {
		var click = {
				preventDefault: function () {
					ok(true, "`preventDefault` called on event");
				}
			};

		Minesweeper.Views.Game = function (opts) {
			ok(true);
			equal(opts.level, 'hard');
		};

		this.view.getHardLevel(click);
	});

	test("`getGame` removes the view from the dom", 1, function () {
		var click = {preventDefault: $.noop};

		this.view.remove = function () {
			ok(true);
		};

		this.view.getGame('easy', click);
	});

	////////////////////////////////////////////////
	////////////////////////////////////////////////

	module("Views.Game", {
		setup: function () {
			this.view = new Minesweeper.Views.Game({level: 'easy'});
			this.originalInitialize = Squares.prototype.initialize;
		},
		teardown: function () {
			delete this.view;
			Squares.prototype.initialize = this.originalInitialize;
		}
	});

	test("`initialize` calls `render`", 1, function () {
		this.view.render = function () {
			ok(true);
		};

		this.view.initialize([], {level: 'easy'});
	});

	test("`initialize` passes game level to collection", 1,
	function () {
		Squares.prototype.initialize = function (_, opts) {
			equal(opts.level, 'easy');
		};

		this.view.initialize({level: 'easy'});
	});
});
