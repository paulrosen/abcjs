var elementGroup = require('./group-elements');

function printStem(renderer, x, dx, y1, y2) {
	if (dx<0 || y1<y2) { // correct path "handedness" for intersection with other elements
		var tmp = y2;
		y2 = y1;
		y1 = tmp;
	}
	var isIE=/*@cc_on!@*/false;//IE detector
	var fill = "#000000";
	if (isIE && dx<1) {
		dx = 1;
		fill = "#666666";
	}
	if (~~x === x) x+=0.05; // raphael does weird rounding (for VML)
	var pathArray = [["M",x,y1],["L", x, y2],["L", x+dx, y2],["L",x+dx,y1],["z"]];
	if (!isIE && elementGroup.isInGroup()) {
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
