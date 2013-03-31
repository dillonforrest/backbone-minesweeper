/*global test, Minesweeper, module, ok, equal, deepEqual*/

$(document).on('ready', function () {

	module("Views.StartGame", {
		setup: function () {
			this.view = new Minesweeper.Views.StartGame();

			this.originalMustache = $.prototype.mustache;
		},
		teardown: function () {
			$.prototype.mustache = this.originalMustache;

			delete this.view;
		}
	});

	test("`initialize` calls `render`", 1, function () {
		this.view.render = function () {
			ok(true);
		};

		this.view.initialize();
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
});
