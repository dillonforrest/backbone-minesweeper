/*global Minesweeper, module, test, equal*/

$(document).on('ready', function () {
	
	var Square = Minesweeper.Models.Square;

	module("Square", {
		setup: function () {
			this.square = new Square({ name: 'empty', numMines: 5 });
		},
		teardown: function () {
			delete this.square;
		}
	});

	test("the square's name is replaced with the number of mines", 2,
	function () {
		equal( this.square.get('name'), '5' );

		this.square.set({numMines: 0, name: 'empty'});
		this.square.initialize();
		equal( this.square.get('name'), 'empty');
	});
});
