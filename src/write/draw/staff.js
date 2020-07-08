var printStaffLine = require('./staff-line');

function printStaff(renderer, startx, endx, numLines) {
	var klass = "abcjs-top-line";
	renderer.paper.openGroup({ prepend: true, klass: renderer.controller.classes.generate("abcjs-staff") });
	// If there is one line, it is the B line. Otherwise, the bottom line is the E line.
	if (numLines === 1) {
		printStaffLine(renderer, startx,endx,6, klass);
	} else {
		for (var i = numLines - 1; i >= 0; i--) {
			printStaffLine(renderer, startx, endx, (i + 1) * 2, klass);
			klass = undefined;
		}
	}
	renderer.paper.closeGroup();
}

module.exports = printStaff;
