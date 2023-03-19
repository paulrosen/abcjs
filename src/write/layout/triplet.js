var getBarYAt = require('./get-bar-y-at');

function layoutTriplet(element) {
	// TODO end and beginning of line (PER: P.S. I'm not sure this can happen: I think the parser will always specify both the start and end points.)
	if (element.anchor1 && element.anchor2) {
		element.hasBeam = !!element.anchor1.parent.beam && element.anchor1.parent.beam === element.anchor2.parent.beam;
		var beam = element.anchor1.parent.beam;
		// if hasBeam is true, then the first and last element in the triplet have the same beam.
		// We also need to check if the beam doesn't contain other notes so that `(3 dcdcc` will do a bracket.
		if (element.hasBeam && (beam.elems[0] !== element.anchor1.parent || beam.elems[beam.elems.length - 1] !== element.anchor2.parent))
			element.hasBeam = false;

		if (element.hasBeam) {
			// If there is a beam then we don't need to draw anything except the text. The beam could either be above or below.
			var left = isAbove(beam) ? element.anchor1.x + element.anchor1.w : element.anchor1.x;
			element.yTextPos = heightAtMidpoint(left, element.anchor2.x, beam);
			element.yTextPos += isAbove(beam) ? 3 : -2; // This creates some space between the beam and the number.
			element.xTextPos = xAtMidpoint(left, element.anchor2.x);
			element.top = element.yTextPos + 1;
			element.bottom = element.yTextPos - 2;
			if (isAbove(beam))
				element.endingHeightAbove = 4;
		} else {
			// If there isn't a beam, then we need to draw the bracket and the text. The bracket is always above.
			// The bracket is never lower than the 'a' line, but is 4 pitches above the first and last notes. If there is
			// a tall note in the middle, the bracket is horizontal and above the highest note.
			element.startNote = Math.max(element.anchor1.parent.top, 9) + 4;
			element.endNote = Math.max(element.anchor2.parent.top, 9) + 4;
			// If it starts or ends on a rest, make the beam horizontal
			if (element.anchor1.parent.type === "rest" && element.anchor2.parent.type !== "rest")
				element.startNote = element.endNote;
			else if (element.anchor2.parent.type === "rest" && element.anchor1.parent.type !== "rest")
				element.endNote = element.startNote;
			// See if the middle note is really high.
			var max = 0;
			for (var i = 0; i < element.middleElems.length; i++) {
				max = Math.max(max, element.middleElems[i].top);
			}
			max += 4;
			if (max > element.startNote || max > element.endNote) {
				element.startNote = max;
				element.endNote = max;
			}
			if (element.flatBeams) {
				element.startNote = Math.max(element.startNote, element.endNote);
				element.endNote = Math.max(element.startNote, element.endNote);
			}

			element.yTextPos = element.startNote + (element.endNote - element.startNote) / 2;
			element.xTextPos = element.anchor1.x + (element.anchor2.x + element.anchor2.w - element.anchor1.x) / 2;
			element.top = element.yTextPos + 1;
		}
	}
	delete element.middleElems;
	delete element.flatBeams;
}

function isAbove(beam) {
	return beam.stemsUp;
}

// We can't just use the entire beam for the calculation. The range has to be passed in, because the beam might extend into some unrelated notes. for instance, (3_a'f'e'f'2 when L:16
function heightAtMidpoint(startX, endX, beam) {
	if (beam.beams.length === 0)
		return 0;
	beam = beam.beams[0];
	var midPoint = startX + (endX - startX) / 2;
	return getBarYAt(beam.startX, beam.startY, beam.endX, beam.endY, midPoint);
}

function xAtMidpoint(startX, endX) {
	return startX + (endX - startX) / 2;
}

module.exports = layoutTriplet;
