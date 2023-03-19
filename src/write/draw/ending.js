var sprintf = require('./sprintf');
var renderText = require('./text');
var printPath = require('./print-path');
var roundNumber = require("./round-number");

function drawEnding(renderer, params, linestartx, lineendx, selectables) {
	if (params.pitch === undefined)
		window.console.error("Ending Element y-coordinate not set.");
	var y = roundNumber(renderer.calcY(params.pitch));
	var height = 20;
	var pathString = '';

	if (params.anchor1) {
		linestartx = roundNumber(params.anchor1.x + params.anchor1.w);
		pathString += sprintf("M %f %f L %f %f ",
			linestartx, y, linestartx, roundNumber(y + height));
	}

	if (params.anchor2) {
		lineendx = roundNumber(params.anchor2.x);
		pathString += sprintf("M %f %f L %f %f ",
			lineendx, y, lineendx, roundNumber(y + height));
	}

	pathString += sprintf("M %f %f L %f %f ",
		linestartx, y, lineendx, y);

	renderer.paper.openGroup({ klass: renderer.controller.classes.generate("ending"), "data-name": "ending" });
	printPath(renderer, { path: pathString, stroke: renderer.foregroundColor, fill: renderer.foregroundColor, "data-name": "line" });
	if (params.anchor1)
		renderText(renderer, {
			x: roundNumber(linestartx + 5),
			y: roundNumber(renderer.calcY(params.pitch - 0.5)),
			text: params.text,
			type: 'repeatfont',
			klass: 'ending',
			anchor: "start",
			noClass: true,
			name: params.text
		});
	var g = renderer.paper.closeGroup();
	selectables.wrapSvgEl({ el_type: "ending", startChar: -1, endChar: -1 }, g);
	return [g];
}

module.exports = drawEnding;
