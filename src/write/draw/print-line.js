var sprintf = require('./sprintf');
var roundNumber = require("./round-number");

function printLine(renderer, x1, x2, y, klass, name, dy) {
	var fill = renderer.foregroundColor;
	x1 = roundNumber(x1);
	x2 = roundNumber(x2);
	var y1 = roundNumber(y - dy);
	var y2 = roundNumber(y + dy);
	// TODO-PER: This fixes a firefox bug where it isn't displayed
	if (renderer.firefox112) {
		y += dy / 2; // Because the y coordinate is the edge of where the line goes but the width widens from the middle.
		var attr = {
			x1: x1,
			x2: x2,
			y1: y,
			y2: y,
			stroke: renderer.foregroundColor,
			'stroke-width': Math.abs(dy*2)
		}
		if (klass)
			attr['class'] = klass;
		if (name)
			attr['data-name'] = name;
		
		return renderer.paper.lineToBack(attr);
	}

	var pathString = sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y1, x2, y1,
		x2, y2, x1, y2);
	var options = { path: pathString, stroke: "none", fill: fill };
	if (name)
		options['data-name'] = name;
	if (klass)
		options['class'] = klass;
	var ret = renderer.paper.pathToBack(options);

	return ret;
}

module.exports = printLine;

