var sprintf = require('./sprintf');
var printPath = require('./print-path');
var roundNumber = require("./round-number");

function drawCrescendo(renderer, params, selectables) {
	if (params.pitch === undefined)
		window.console.error("Crescendo Element y-coordinate not set.");
	var y = renderer.calcY(params.pitch) + 4; // This is the top pixel to use (it is offset a little so that it looks good with the volume marks.)
	var height = 8;

	// TODO-PER: This is just a quick hack to make the dynamic marks not crash if they are mismatched. See the slur treatment for the way to get the beginning and end.
	var left = params.anchor1 ? params.anchor1.x : 0;
	var right = params.anchor2 ? params.anchor2.x : 800;

	var el;
	if (params.dir === "<") {
		el = drawLine(renderer, y + height / 2, y, y + height / 2, y + height, left, right);
	} else {
		el = drawLine(renderer, y, y + height / 2, y + height, y + height / 2, left, right);
	}
	selectables.wrapSvgEl({ el_type: "dynamicDecoration", startChar: -1, endChar: -1 }, el);
	return [el];
}

var drawLine = function (renderer, y1, y2, y3, y4, left, right) {
	y1 = roundNumber(y1);
	y2 = roundNumber(y2);
	y3 = roundNumber(y3);
	y4 = roundNumber(y4);
	left = roundNumber(left);
	right = roundNumber(right);

	var pathString = sprintf("M %f %f L %f %f M %f %f L %f %f",
		left, y1, right, y2, left, y3, right, y4);
	return printPath(renderer, { path: pathString, highlight: "stroke", stroke: renderer.foregroundColor, 'class': renderer.controller.classes.generate('dynamics decoration'), "data-name": "dynamics" });
};

module.exports = drawCrescendo;
