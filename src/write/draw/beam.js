var printPath = require('./print-path');

function drawBeam(renderer, params) {
	if (params.beams.length === 0) return;

	var klass = 'beam-elem';
	if (params.hint)
		klass += " abcjs-hint";

	var pathString = "";
	for (var i = 0; i < params.beams.length; i++) {
		var beam = params.beams[i];
		if (beam.split) {
			var slope = getSlope(renderer, beam.startX, beam.startY, beam.endX, beam.endY);
			var xes = [ ];
			for (var j = 0; j < beam.split.length; j+=2) {
				xes.push([beam.split[j], beam.split[j+1]]);
			}
			for (j = 0; j < xes.length; j++) {
				var y1 = getY(beam.startX, beam.startY, slope, xes[j][0]);
				var y2 = getY(beam.startX, beam.startY, slope, xes[j][1]);
				pathString += draw(renderer, xes[j][0], y1, xes[j][1], y2, beam.dy);
			}
		} else
			pathString += draw(renderer, beam.startX, beam.startY, beam.endX, beam.endY, beam.dy);
	}
	var durationClass = ("abcjs-d"+params.duration).replace(/\./g,"-");
	var klasses = renderer.controller.classes.generate('beam-elem '+durationClass);
	var el = printPath(renderer, {
		path: pathString,
		stroke: "none",
		fill: "#000000",
		'class': klasses
	});
	return [el];
}

function draw(renderer, startX, startY, endX, endY, dy) {
	// the X coordinates are actual coordinates, but the Y coordinates are in pitches.
	startY = renderer.calcY(startY);
	endY = renderer.calcY(endY);
	return "M" + startX + " " + startY + " L" + endX + " " + endY +
		"L" + endX + " " + (endY + dy) + " L" + startX + " " + (startY + dy) + "z";
}

function getSlope(renderer, startX, startY, endX, endY) {
	startY = startY;
	endY = endY;
	return (endY - startY) / (endX - startX);
}

function getY(startX, startY, slope, currentX) {
	var x = currentX - startX;
	return startY + x*slope;
}

module.exports = drawBeam;
