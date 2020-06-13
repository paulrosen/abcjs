var sprintf = require('./sprintf');

function printStaffLine(renderer, x1,x2, pitch, klass) {
	var isIE=/*@cc_on!@*/false;//IE detector
	var dy = 0.35;
	var fill = "#000000";
	if (isIE) {
		dy = 1;
		fill = "#666666";
	}
	var y = renderer.calcY(pitch);
	var pathString = sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y-dy, x2, y-dy,
		x2, y+dy, x1, y+dy);
	var options = {path:pathString, stroke:"none", fill:fill};
	if (klass)
		options['class'] = klass;
	var ret = renderer.paper.pathToBack(options);

	return ret;
}

module.exports = printStaffLine;

