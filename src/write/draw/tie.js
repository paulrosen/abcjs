var sprintf = require('./sprintf');
var roundNumber = require("./round-number");

function drawTie(renderer, params, linestartx, lineendx, selectables) {
	layout(params, linestartx, lineendx);

	var klass = '';
	if (params.anchor1) {
		klass += 'abcjs-start-m' + params.anchor1.parent.counters.measure + '-n' + params.anchor1.parent.counters.note;
	} else
		klass += 'abcjs-start-edge';
	if (params.anchor2) {
		klass += ' abcjs-end-m' + params.anchor2.parent.counters.measure + '-n' + params.anchor2.parent.counters.note;
	} else
		klass += ' abcjs-end-edge';
	if (params.hint)
		klass = "abcjs-hint";
	var fudgeY = params.fixedY ? 1.5 : 0; // TODO-PER: This just compensates for drawArc, which contains too much knowledge of ties and slurs.
	var el = drawArc(renderer, params.startX, params.endX, params.startY + fudgeY, params.endY + fudgeY, params.above, klass, params.isTie, params.dotted);
	selectables.wrapSvgEl({ el_type: "slur", startChar: -1, endChar: -1 }, el);
	return [el];
}

// TODO-PER: I think params part should have been done earlier in the layout pass.
var layout = function (params, lineStartX, lineEndX) {
	// We now have all of the input variables set, so we can figure out the start and ending x,y coordinates, and finalize the direction of the arc.

	// Ties and slurs are handled a little differently, so do calculations for them separately.
	if (!params.anchor1 || !params.anchor2)
		params.isTie = true; // if the slur goes off the end of the line, then draw it like a tie
	else if (params.anchor1.pitch === params.anchor2.pitch && params.internalNotes.length === 0)
		params.isTie = true;
	else
		params.isTie = false;

	if (params.isTie) {
		params.calcTieDirection();
		params.calcX(lineStartX, lineEndX);
		params.calcTieY();

	} else {
		params.calcSlurDirection();
		params.calcX(lineStartX, lineEndX);
		params.calcSlurY();
	}
	params.avoidCollisionAbove();
};

var drawArc = function (renderer, x1, x2, pitch1, pitch2, above, klass, isTie, dotted) {
	// If it is a tie vs. a slur, draw it shallower.
	var spacing = isTie ? 1.2 : 1.5;

	x1 = roundNumber(x1 + 6);
	x2 = roundNumber(x2 + 4);
	pitch1 = pitch1 + ((above) ? spacing : -spacing);
	pitch2 = pitch2 + ((above) ? spacing : -spacing);
	var y1 = roundNumber(renderer.calcY(pitch1));
	var y2 = roundNumber(renderer.calcY(pitch2));

	//unit direction vector
	var dx = x2 - x1;
	var dy = y2 - y1;
	var norm = Math.sqrt(dx * dx + dy * dy);
	var ux = dx / norm;
	var uy = dy / norm;

	var flatten = norm / 3.5;
	var maxFlatten = isTie ? 10 : 25;  // If it is a tie vs. a slur, draw it shallower.
	var curve = ((above) ? -1 : 1) * Math.min(maxFlatten, Math.max(4, flatten));

	var controlx1 = roundNumber(x1 + flatten * ux - curve * uy);
	var controly1 = roundNumber(y1 + flatten * uy + curve * ux);
	var controlx2 = roundNumber(x2 - flatten * ux - curve * uy);
	var controly2 = roundNumber(y2 - flatten * uy + curve * ux);
	var thickness = 2;
	if (klass)
		klass += ' slur';
	else
		klass = 'slur';
	klass += isTie ? ' tie' : ' legato';
	var ret;
	if (dotted) {
		klass += ' dotted';
		var pathString2 = sprintf("M %f %f C %f %f %f %f %f %f", x1, y1,
			controlx1, controly1, controlx2, controly2, x2, y2);
		ret = renderer.paper.path({ path: pathString2, stroke: renderer.foregroundColor, fill: "none", 'stroke-dasharray': "5 5", 'class': renderer.controller.classes.generate(klass), "data-name": isTie ? "tie" : "slur" });
	} else {
		var pathString = sprintf("M %f %f C %f %f %f %f %f %f C %f %f %f %f %f %f z", x1, y1,
			controlx1, controly1, controlx2, controly2, x2, y2,
			roundNumber(controlx2 - thickness * uy), roundNumber(controly2 + thickness * ux), roundNumber(controlx1 - thickness * uy), roundNumber(controly1 + thickness * ux), x1, y1);
		ret = renderer.paper.path({ path: pathString, stroke: "none", fill: renderer.foregroundColor, 'class': renderer.controller.classes.generate(klass), "data-name": isTie ? "tie" : "slur" });
	}

	return ret;
};

module.exports = drawTie;
