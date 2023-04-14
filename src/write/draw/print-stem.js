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
	// TODO-PER: This fixes a firefox bug where a path needs to go over the 0.5 mark or it isn't displayed
	if (renderer.firefox112 && Math.abs(dx) < 1) {
		var higher = Math.max(x,x2)
		var int = Math.floor(higher)
		var distToHalf = 0.52 - (higher - int)
		if (distToHalf > 0) {
			x += distToHalf
			x2 += distToHalf
		}
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
