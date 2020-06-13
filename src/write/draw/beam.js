var printPath = require('./print-path');

function drawBeam(renderer, params) {
	if (params.beams.length === 0) return;

	var klass = 'beam-elem';
	if (params.hint)
		klass += " abcjs-hint";

	var pathString = "";
	for (var i = 0; i < params.beams.length; i++) {
		var beam = params.beams[i];
		pathString += draw(renderer, beam.startX, beam.startY, beam.endX, beam.endY, beam.dy);
	}
	var durationClass = ("abcjs-d"+params.duration).replace(/\./g,"-");
	var klasses = renderer.controller.classes.generate('beam-elem '+durationClass);
	renderer.controller.currentAbsEl = { tuneNumber: renderer.controller.engraver.tuneNumber, elemset: [], abcelem: { el_type: "beam", startChar: -1, endChar: -1 }};
	var el = printPath(renderer, {
		path: pathString,
		stroke: "none",
		fill: "#000000",
		'class': klasses
	}, {history: 'not-selectable'});
	renderer.controller.currentAbsEl.elemset.push(el);
	return [el];
}

function draw(renderer, startX, startY, endX, endY, dy) {
	// the X coordinates are actual coordinates, but the Y coordinates are in pitches.
	startY = renderer.calcY(startY);
	endY = renderer.calcY(endY);
	return "M" + startX + " " + startY + " L" + endX + " " + endY +
		"L" + endX + " " + (endY + dy) + " L" + startX + " " + (startY + dy) + "z";
}

module.exports = drawBeam;
