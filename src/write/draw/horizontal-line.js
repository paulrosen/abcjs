// For debugging, it is sometimes useful to know where you are vertically.
var sprintf = require("./sprintf");

function printHorizontalLine(renderer, width, vertical, comment) {
	var dy = 0.35;
	var fill = "rgba(0,0,255,.4)";
	var y = renderer.y;
	if (vertical) y = vertical;
	y = Math.round(y);
	renderer.paper.text("" + Math.round(y), { x: 10, y: y, "text-anchor": "start", "font-size": "18px", fill: fill, stroke: fill });
	var x1 = 50;
	var x2 = width;
	var pathString = sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y - dy, x1 + x2, y - dy,
		x2, y + dy, x1, y + dy);
	renderer.paper.pathToBack({ path: pathString, stroke: "none", fill: fill, 'class': renderer.controller.classes.generate('staff') });
	for (var i = 1; i < width / 100; i++) {
		pathString = sprintf("M %f %f L %f %f L %f %f L %f %f z", i * 100 - dy, y - 5, i * 100 - dy, y + 5,
			i * 100 + dy, y - 5, i * 100 + dy, y + 5);
		renderer.paper.pathToBack({ path: pathString, stroke: "none", fill: fill, 'class': renderer.controller.classes.generate('staff') });
	}
	if (comment)
		renderer.paper.text(comment, { x: width + 70, y: y, "text-anchor": "start", "font-size": "18px", fill: fill, stroke: fill });
}

module.exports = printHorizontalLine;
