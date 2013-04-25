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

	test("el is set to an id of `start-game-view`", 1, function () {
		var attributes = this.view.attributes;
		equal( attributes.id, "start-game-view" );
	});

	test("`render` injects template into dom", 4, function () {
		$.prototype.mustache = function (templateId, data) {
			ok(true);
			equal(templateId, 'start-screen');
			deepEqual(data, {});
		};

		deepEqual( this.view, this.view.render(), "return `this`" );
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
			this.originalMustache = $.prototype.mustache;
			this.originalHtml = $.prototype.html;
		},
		teardown: function () {
			delete this.view;
			Squares.prototype.initialize = this.originalInitialize;
			$.prototype.mustache = this.originalMustache;
			$.prototype.html = this.originalHtml;
		}
	});

	test("`attributes` sets the id to `#game-view`", 1, function () {
		var attributes = this.view.attributes;
		equal( attributes.id, 'game-view' );
	});

	test("`events` hash", 1, function () {
		var events = this.view.events;
		equal( events['click .button.go-back'], 'goToStartScreen' );
	});

	test("`initialize` calls `render`", 2, function () {
		this.view.render = function (level) {
			ok(true);
			equal(level, 'easy');
		};

		this.view.initialize({level: 'easy'});
	});

	test("`initialize` passes game level to collection", 2,
	function () {
		Squares.prototype.initialize = function (models, opts) {
			deepEqual(models, false);
			equal(opts.level, 'easy');
		};

		this.view.initialize({level: 'easy'});
	});

	test("`render` fills $app with the Game template", 5, function () {
		$.prototype.mustache = function (templateId, data) {
			ok(true);
			equal( this.attr('id'), 'game-view' );
			equal(templateId, 'game');
			deepEqual(data, {});
		};

		deepEqual( this.view, this.view.render('easy'), "return `this`" );
	});

	test("`render` creates a grid depending on the level", 5, function () {
		this.view.createGrid = function (level) {
			ok(true);
			equal(level, 'easy');
			return 'grid html';
		};

		$.prototype.html = function (arg) {
			var isCorrectHtmlCall = ( $(this).selector !== '#app' );
			if (isCorrectHtmlCall) {
				ok(true);
				equal( $(this).selector, '.grid' ); 
				equal(arg, 'grid html');
			}
		};

		this.view.render('easy');
	});

	test("`render` will let view listen to collection", 2, function () {
		this.view.listenTo = function () {
			ok(true, "this should run twice");
		};

		this.view.render();
	});

	test("`createGrid` makes an 8x8 table for easy levels", 2, function () {
		var table = this.view.createGrid('easy'),
			$rows = $(table).find('tr');
		equal( $rows.length, 8, "8 rows" );
		equal( $rows.first().find('td').length, 8, "8 columns" );
	});

	test("`createGrid` makes an 16x16 table for easy levels", 2, function () {
		var table = this.view.createGrid('intermediate'),
			$rows = $(table).find('tr');
		equal( $rows.length, 16, "16 rows" );
		equal( $rows.first().find('td').length, 16, "16 columns" );
	});

	test("`createGrid` makes an 16x30 table for easy levels", 2, function () {
		var table = this.view.createGrid('hard'),
			$rows = $(table).find('tr');
		equal( $rows.length, 16, "16 rows" );
		equal( $rows.first().find('td').length, 30, "30 columns" );
	});

	test("`goToStartScreen` removes the view and goes back", 1, function () {
		var click = { preventDefault: $.noop };

		this.view.remove = function () {
			ok(true);
		};

		this.view.goToStartScreen(click);
	});

	test("`uncoverSquare` exposes a square", 3, function () {
		var $div = $('<div data-sq="11" class="covered" />'),
			clickEvent = {
				currentTarget: $div,
				preventDefault: function () { ok(true); }
			};

		this.view.collection.revealSquare = function () {
			ok(true);
			return { html: 'html', css: 'css' };
		};

		this.view.uncoverSquare( clickEvent );

		ok( ! $div.hasClass('covered') );
	});

	test("pass `''` to `toggleFlag` returns `!`", 1, function () {
		var html = this.view.toggleFlag('');
		equal(html, '!');
	});

	test("pass `!` to `toggleFlag` returns `?`", 1, function () {
		var html = this.view.toggleFlag('!');
		equal(html, '?');
	});

	test("pass `?` to `toggleFlag` returns `''`", 1, function () {
		var html = this.view.toggleFlag('?');
		equal(html, '');
	});
});
