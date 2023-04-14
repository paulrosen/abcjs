var sprintf = require('./sprintf');
var roundNumber = require("./round-number");

function printLine(renderer, x1, x2, y, klass, name, dy) {
	var fill = renderer.foregroundColor;
	x1 = roundNumber(x1);
	x2 = roundNumber(x2);
	var y1 = roundNumber(y - dy);
	var y2 = roundNumber(y + dy);
	// TODO-PER: This fixes a firefox bug where a path needs to go over the 0.5 mark or it isn't displayed
	if (renderer.firefox112 && dy < 1) {
		var int = Math.floor(y2)
		var distToHalf = 0.52 - (y2 - int)
		if (distToHalf > 0) {
			y1 += distToHalf
			y2 += distToHalf
		}
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

