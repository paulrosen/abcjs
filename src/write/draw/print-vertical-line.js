var sprintf = require("./sprintf");

function printVerticalLine(renderer, x, y1, y2) {
	var dy = 0.35;
	var fill = "#00aaaa";
	var pathString = sprintf("M %f %f L %f %f L %f %f L %f %f z", x - dy, y1, x - dy, y2,
		x + dy, y1, x + dy, y2);
	renderer.paper.pathToBack({ path: pathString, stroke: "none", fill: fill, 'class': renderer.controller.classes.generate('staff') });
	pathString = sprintf("M %f %f L %f %f L %f %f L %f %f z", x - 20, y1, x - 20, y1 + 3,
		x, y1, x, y1 + 3);
	renderer.paper.pathToBack({ path: pathString, stroke: "none", fill: fill, 'class': renderer.controller.classes.generate('staff') });
	pathString = sprintf("M %f %f L %f %f L %f %f L %f %f z", x + 20, y2, x + 20, y2 + 3,
		x, y2, x, y2 + 3);
	renderer.paper.pathToBack({ path: pathString, stroke: "none", fill: fill, 'class': renderer.controller.classes.generate('staff') });

}

module.exports = printVerticalLine;
