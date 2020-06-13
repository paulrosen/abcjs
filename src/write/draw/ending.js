var sprintf = require('./sprintf');
var renderText = require('./text');
var printPath = require('./print-path');

function drawEnding(renderer, params, linestartx, lineendx) {
	if (params.pitch === undefined)
		window.console.error("Ending Element y-coordinate not set.");
	var y = renderer.calcY(params.pitch);
	var height = 20;
	var pathString = '';

	if (params.anchor1) {
		linestartx = params.anchor1.x+params.anchor1.w;
		pathString += sprintf("M %f %f L %f %f ",
			linestartx, y, linestartx, y+height);
	}

	if (params.anchor2) {
		lineendx = params.anchor2.x;
		pathString += sprintf("M %f %f L %f %f ",
			lineendx, y, lineendx, y+height);
	}

	pathString += sprintf("M %f %f L %f %f ",
		linestartx, y, lineendx, y);

	var g = renderer.wrapInAbsElem({el_type: "ending", startChar: -1, endChar: -1}, 'abcjs-ending', function () {

		renderer.paper.openGroup({klass: renderer.controller.classes.generate("ending")});
		printPath(renderer, {path: pathString, stroke: "#000000", fill: "#000000"}, { history: 'ignore'});
		if (params.anchor1)
			renderText(renderer, {x: linestartx + 5, y: renderer.calcY(params.pitch - 0.5), text: params.text, type: 'repeatfont', klass: 'ending', anchor: "start", noClass: true, history: 'ignore'});
		var g = renderer.paper.closeGroup();
		renderer.controller.recordHistory(g, false);
		return g;
	});
	return [g];
}

module.exports = drawEnding;
