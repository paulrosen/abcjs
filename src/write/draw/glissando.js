var sprintf = require('./sprintf');
var printPath = require('./print-path');
var roundNumber = require("./round-number");

function drawGlissando(renderer, params, selectables) {
	if (!params.anchor1 || !params.anchor2 || !params.anchor1.heads || !params.anchor2.heads || params.anchor1.heads.length === 0 || params.anchor2.heads.length === 0)
		window.console.error("Glissando Element not set.");

	var margin = 4;
	var leftY = renderer.calcY(params.anchor1.heads[0].pitch)
	var rightY = renderer.calcY(params.anchor2.heads[0].pitch)
	var leftX = params.anchor1.x + params.anchor1.w / 2
	var rightX = params.anchor2.x + params.anchor2.w / 2
	var len = lineLength(leftX, leftY, rightX, rightY)
	var marginLeft = params.anchor1.w / 2 + margin
	var marginRight = params.anchor2.w / 2 + margin
	var s = slope(leftX, leftY, rightX, rightY)
	var leftYAdj = getY(leftY, s, marginLeft)
	var rightYAdj = getY(rightY, s, -marginRight)
	var num = numSquigglies(len - marginLeft - marginRight)

	var el = drawSquiggly(renderer, leftX + marginLeft, leftYAdj, num, s)
	selectables.wrapSvgEl({ el_type: "glissando", startChar: -1, endChar: -1 }, el);
	return [el];
}

function lineLength(leftX, leftY, rightX, rightY) {
	// The length from notehead center to notehead center.
	var w = rightX - leftX
	var h = rightY - leftY
	return Math.sqrt(w * w + h * h)
}

function slope(leftX, leftY, rightX, rightY) {
	return (rightY - leftY) / (rightX - leftX)
}

function getY(y, slope, xOfs) {
	return roundNumber(y + (xOfs) * slope);
}

function numSquigglies(length) {
	var endLen = 5; // The width of the end - that is, the non repeating part
	return Math.max(2, Math.floor((length - endLen * 2) / 6));
}

var leftStart = [[3.5, -4.8]]
var right = [[1.5, -1], [.3, -.3], [-3.5, 3.8]]
var leftEnd = [[-1.5, 2]]
var top = [[3, 4], [3, -4]]
var bottom = [[-3, 4], [-3, -4]]

function segment(arr, slope) {
	var ret = "";
	for (var i = 0; i < arr.length; i++) {
		ret += 'l' + arr[i][0] + ' ' + getY(arr[i][1], slope, arr[i][0])
	}
	return ret
}

var drawSquiggly = function (renderer, x, y, num, slope) {
	var p = sprintf("M %f %f", x, y);
	p += segment(leftStart, slope)
	var i
	for (i = 0; i < num; i++) {
		p += segment(top, slope)
	}
	p += segment(right, slope)
	for (i = 0; i < num; i++)
		p += segment(bottom, slope)
	p += segment(leftEnd, slope) + 'z'
	return printPath(renderer, { path: p, highlight: "stroke", stroke: renderer.foregroundColor, 'class': renderer.controller.classes.generate('decoration'), "data-name": "glissando" });
}

module.exports = drawGlissando;
