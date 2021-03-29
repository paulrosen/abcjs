var elementGroup = require('./group-elements');
var roundNumber = require("./round-number");

function printStem(renderer, x, dx, y1, y2) {
	if (dx<0 || y1<y2) { // correct path "handedness" for intersection with other elements
		var tmp = roundNumber(y2);
		y2 = roundNumber(y1);
		y1 = tmp;
	} else {
		y1 = roundNumber(y1);
		y2 = roundNumber(y2);
	}
	x = roundNumber(x);
	var x2 = roundNumber(x+dx);
	var fill = renderer.foregroundColor;
	var pathArray = [["M",x,y1],["L", x, y2],["L", x2, y2],["L",x2,y1],["z"]];
	if (elementGroup.isInGroup()) {
		elementGroup.addPath(pathArray);
	} else {
		var path = "";
		for (var i = 0; i < pathArray.length; i++)
			path += pathArray[i].join(" ");
		var ret = renderer.paper.pathToBack({path:path, stroke:"none", fill:fill, 'class': renderer.controller.classes.generate('stem')});

		return ret;
	}
}

module.exports = printStem;
