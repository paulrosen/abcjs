var sprintf = require('./sprintf');
var spacing = require('../helpers/spacing');
var renderText = require('./text');

function drawBrace(renderer, params, selectables) {
	// The absoluteY number is the spot where the note on the first ledger line is drawn (i.e. middle C if treble clef)
	// The STEP offset here moves it to the top and bottom lines
	var startY = params.startVoice.staff.absoluteY - spacing.STEP * 10;
	if (params.endVoice && params.endVoice.staff)
		params.endY = params.endVoice.staff.absoluteY - spacing.STEP * 2;
	else if (params.lastContinuedVoice && params.lastContinuedVoice.staff)
		params.endY = params.lastContinuedVoice.staff.absoluteY - spacing.STEP * 2;
	else
		params.endY = params.startVoice.staff.absoluteY - spacing.STEP * 2;
	return draw(renderer, params.x, startY, params.endY, params.type, params.header, selectables);
}

function straightPath(renderer, xLeft, yTop, yBottom, type) {
	xLeft += spacing.STEP;
	var xLineWidth = spacing.STEP * 0.75;
	var yOverlap = spacing.STEP * 0.75;
	var height = yBottom - yTop;
	// Straight line
	var pathString = sprintf("M %f %f l %f %f l %f %f l %f %f z",
		xLeft, yTop - yOverlap, // top left line
		0, height + yOverlap * 2, // bottom left line
		xLineWidth, 0, // bottom right line
		0, - (height + yOverlap * 2) // top right line
	);
	// Top arm
	var wCurve = spacing.STEP * 2;
	var hCurve = spacing.STEP;
	pathString += sprintf("M %f %f q %f %f %f %f q %f %f %f %f z",
		xLeft + xLineWidth, yTop - yOverlap, // top left arm
		wCurve * 0.6, hCurve * 0.2,
		wCurve, -hCurve, // right point
		-wCurve * 0.1, hCurve * 0.3,
		-wCurve, hCurve + spacing.STEP // left bottom
	);
	// Bottom arm
	pathString += sprintf("M %f %f q %f %f %f %f q %f %f %f %f z",
		xLeft + xLineWidth, yTop + yOverlap + height, // bottom left arm
		wCurve * 0.6, -hCurve * 0.2,
		wCurve, hCurve, // right point
		-wCurve * 0.1, -hCurve * 0.3,
		-wCurve, -hCurve - spacing.STEP // left bottom
	);
	return renderer.paper.path({ path: pathString, stroke: renderer.foregroundColor, fill: renderer.foregroundColor, 'class': renderer.controller.classes.generate(type), "data-name": type });
}

function curvyPath(renderer, xLeft, yTop, yBottom, type) {
	var yHeight = yBottom - yTop;

	var pathString = curve(xLeft,
		yTop,
		[7.5, -8, 21, 0, 18.5, -10.5, 7.5],
		[0, yHeight / 5.5, yHeight / 3.14, yHeight / 2, yHeight / 2.93, yHeight / 4.88, 0]);

	pathString += curve(xLeft,
		yTop,
		[0, 17.5, -7.5, 6.6, -5, 20, 0],
		[yHeight / 2, yHeight / 1.46, yHeight / 1.22, yHeight, yHeight / 1.19, yHeight / 1.42, yHeight / 2]);

	return renderer.paper.path({ path: pathString, stroke: renderer.foregroundColor, fill: renderer.foregroundColor, 'class': renderer.controller.classes.generate(type), "data-name": type });
}

function curve(xLeft, yTop, xCurve, yCurve) {
	return sprintf("M %f %f C %f %f %f %f %f %f C %f %f %f %f %f %f z",
		xLeft + xCurve[0], yTop + yCurve[0],
		xLeft + xCurve[1], yTop + yCurve[1],
		xLeft + xCurve[2], yTop + yCurve[2],
		xLeft + xCurve[3], yTop + yCurve[3],
		xLeft + xCurve[4], yTop + yCurve[4],
		xLeft + xCurve[5], yTop + yCurve[5],
		xLeft + xCurve[6], yTop + yCurve[6]);
}

var draw = function (renderer, xLeft, yTop, yBottom, type, header, selectables) {//Tony
	var ret;
	if (header) {
		renderer.paper.openGroup({ klass: renderer.controller.classes.generate("staff-extra voice-name"), "data-name": type });
		var position = yTop + (yBottom - yTop) / 2;
		position = position - renderer.controller.getTextSize.baselineToCenter(header, "voicefont", 'staff-extra voice-name', 0, 1);

		renderText(renderer, {
			x: renderer.padding.left,
			y: position,
			text: header,
			type: 'voicefont',
			klass: 'staff-extra voice-name',
			anchor: 'start',
			centerVertically: true
		});
	}
	if (type === "brace")
		ret = curvyPath(renderer, xLeft, yTop, yBottom, type);
	else if (type === "bracket")
		ret = straightPath(renderer, xLeft, yTop, yBottom, type);
	if (header) {
		ret = renderer.paper.closeGroup();
	}
	selectables.wrapSvgEl({ el_type: type, startChar: -1, endChar: -1 }, ret);

	return ret;
};
module.exports = drawBrace;
