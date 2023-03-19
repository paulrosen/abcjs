var sprintf = require('./sprintf');
var renderText = require('./text');
var printPath = require('./print-path');
var roundNumber = require("./round-number");

function drawTriplet(renderer, params, selectables) {
	renderer.paper.openGroup({ klass: renderer.controller.classes.generate('triplet ' + params.durationClass), "data-name": "triplet" });
	if (!params.hasBeam) {
		drawBracket(renderer, params.anchor1.x, params.startNote, params.anchor2.x + params.anchor2.w, params.endNote);
	}
	// HACK: adjust the position of "3". It is too high in all cases so we fudge it by subtracting 1 here.
	renderText(renderer, { x: params.xTextPos, y: renderer.calcY(params.yTextPos - 1), text: "" + params.number, type: 'tripletfont', anchor: "middle", centerVertically: true, noClass: true, name: "" + params.number }, true);
	var g = renderer.paper.closeGroup();
	selectables.wrapSvgEl({ el_type: "triplet", startChar: -1, endChar: -1 }, g);
	return g;
}

function drawLine(l, t, r, b) {
	return sprintf("M %f %f L %f %f", roundNumber(l), roundNumber(t), roundNumber(r), roundNumber(b));
}

function drawBracket(renderer, x1, y1, x2, y2) {
	y1 = renderer.calcY(y1);
	y2 = renderer.calcY(y2);
	var bracketHeight = 5;

	// Draw vertical lines at the beginning and end
	var pathString = "";
	pathString += drawLine(x1, y1, x1, y1 + bracketHeight);
	pathString += drawLine(x2, y2, x2, y2 + bracketHeight);

	// figure out midpoints to draw the broken line.
	var midX = x1 + (x2 - x1) / 2;
	//var midY = y1 + (y2-y1)/2;
	var gapWidth = 8;
	var slope = (y2 - y1) / (x2 - x1);
	var leftEndX = midX - gapWidth;
	var leftEndY = y1 + (leftEndX - x1) * slope;
	pathString += drawLine(x1, y1, leftEndX, leftEndY);
	var rightStartX = midX + gapWidth;
	var rightStartY = y1 + (rightStartX - x1) * slope;
	pathString += drawLine(rightStartX, rightStartY, x2, y2);
	printPath(renderer, { path: pathString, stroke: renderer.foregroundColor, "data-name": "triplet-bracket" });
}

module.exports = drawTriplet;
