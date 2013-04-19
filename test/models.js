/*global Minesweeper, module*/

$(document).on('ready', function () {
	
	var Square = Minesweeper.Models.Square;

	module("`initialize` method", {
		setup: function () {
			this.square = new Square({name: 'empty'});
		},
		teardown: function () {
			delete this.square;
		}
	});

});
