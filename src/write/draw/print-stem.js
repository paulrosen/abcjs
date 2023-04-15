var elementGroup = require('./group-elements');
var roundNumber = require("./round-number");

function printStem(renderer, x, dx, y1, y2, klass, name) {
	if (dx < 0 || y1 < y2) { // correct path "handedness" for intersection with other elements
		var tmp = roundNumber(y2);
		y2 = roundNumber(y1);
		y1 = tmp;
	} else {
		y1 = roundNumber(y1);
		y2 = roundNumber(y2);
	}
	x = roundNumber(x);
	var x2 = roundNumber(x + dx);
	// TODO-PER: This fixes a firefox bug where it isn't displayed
	if (renderer.firefox112) {
		x += dx / 2; // Because the x coordinate is the edge of where the line goes but the width widens from the middle.
		var attr = {
			x1: x,
			x2: x,
			y1: y1,
			y2: y2,
			stroke: renderer.foregroundColor,
			'stroke-width': Math.abs(dx)
		}
		if (klass)
			attr['class'] = klass;
		if (name)
			attr['data-name'] = name;
		
		return renderer.paper.lineToBack(attr);
	}
	var pathArray = [["M", x, y1], ["L", x, y2], ["L", x2, y2], ["L", x2, y1], ["z"]];
	var attr = { path: "" };
	for (var i = 0; i < pathArray.length; i++)
		attr.path += pathArray[i].join(" ");
	if (klass)
		attr['class'] = klass;
	if (name)
		attr['data-name'] = name;
	if (!elementGroup.isInGroup()) {
		attr.stroke = "none";
		attr.fill = renderer.foregroundColor;
	}
	return renderer.paper.pathToBack(attr);
}

module.exports = printStem;
