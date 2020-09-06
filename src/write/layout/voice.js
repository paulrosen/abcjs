var layoutBeam = require('./beam');
var getBarYAt = require('./getBarYAt');

var layoutVoice = function(voice) {
	for (var i = 0; i < voice.beams.length; i++) {
		if (voice.beams[i].type === 'BeamElem') {
			layoutBeam(voice.beams[i]);
			moveDecorations(voice.beams[i]);
			// The above will change the top and bottom of the abselem children, so see if we need to expand our range.
			for (var j = 0; j < voice.beams[i].elems.length; j++) {
				voice.adjustRange(voice.beams[i].elems[j]);
			}
		}
	}
	voice.staff.specialY.chordLines = setLaneForChord(voice.children);

	// Now we can layout the triplets
	for (i = 0; i < voice.otherchildren.length; i++) {
		var child = voice.otherchildren[i];
		if (child.type === 'TripletElem') {
			layout(child);
			voice.adjustRange(child);
		}
	}
	voice.staff.top = Math.max(voice.staff.top, voice.top);
	voice.staff.bottom = Math.min(voice.staff.bottom, voice.bottom);
};

function moveDecorations(beam) {
	var padding = 1.5; // This is the vertical padding between elements, in pitches.
	for (var ch = 0; ch < beam.elems.length; ch++) {
		var child = beam.elems[ch];
		if (child.top) {
			// We now know where the ornaments should have been placed, so move them if they would overlap.
			var top = yAtNote(child, beam);
			for (var i = 0; i < child.children.length; i++) {
				var el = child.children[i];
				if (el.klass === 'ornament') {
					if (el.bottom - padding < top) {
						var distance = top - el.bottom + padding; // Find the distance that it needs to move and add a little margin so the element doesn't touch the beam.
						el.bottom += distance;
						el.top += distance;
						el.pitch += distance;
						top = child.top = el.top;
					}
				}
			}
		}
	}
}

function placeInLane(rightMost, relElem) {
	// These items are centered so figure the coordinates accordingly and add a little margin.
	var xCoords = relElem.getChordDim();
	if (xCoords) {
		for (var i = 0; i < rightMost.length; i++) {
			var fits = rightMost[i] < xCoords.left;
			if (fits) {
				if (i > 0)
					relElem.putChordInLane(i);
				rightMost[i] = xCoords.right;
				return;
			}
		}
		// If we didn't return early, then we need a new row
		rightMost.push(xCoords.right);
		relElem.putChordInLane(rightMost.length-1);
	}
}

function setLaneForChord(absElems) {
	// Criteria:
	// 1) lane numbers start from the bottom so that as many items as possible are in lane 0, closest to the music.
	// 2) a chord can have more than one line (for instance "C\nD") each line is a lane.
	// 3) if two adjoining items would touch then push the second one to the next lane.
	// 4) use as many lanes as is necessary to get everything to not touch.
	// 5) leave a margin between items, so use another lane if the chords would have less than a character's width.
	// 6) if the chord only has one character, allow it to be closer than if the chord has more than one character.
	var rightMostAbove = [0];
	var rightMostBelow = [0];
	for (var i = 0; i < absElems.length; i++) {
		for (var j = 0; j < absElems[i].children.length; j++) {
			var relElem = absElems[i].children[j];
			if (relElem.chordHeightAbove) {
				placeInLane(rightMostAbove, relElem);
			}
			if (relElem.chordHeightBelow) {
				placeInLane(rightMostBelow, relElem);
			}
		}
	}
	// If we used a second line, then we need to go back and set the first lines.
	// Also we need to flip the indexes of the names so that we can count from the top line.
	if (rightMostAbove.length > 1 || rightMostBelow.length > 1)
		setLane(absElems, rightMostAbove.length, rightMostBelow.length);
	return { above: rightMostAbove.length, below: rightMostBelow.length };
}

function numAnnotationsBelow(absElem) {
	var count = 0;
	for (var j = 0; j < absElem.children.length; j++) {
		var relElem = absElem.children[j];
		if (relElem.chordHeightBelow)
			count++;
	}
	return count;
}

function setLane(absElems, numLanesAbove, numLanesBelow) {
	for (var i = 0; i < absElems.length; i++) {
		var below = numAnnotationsBelow(absElems[i]);
		for (var j = 0; j < absElems[i].children.length; j++) {
			var relElem = absElems[i].children[j];
			if (relElem.chordHeightAbove) {
				relElem.invertLane(numLanesAbove);
			} else if (relElem.chordHeightBelow) {
				relElem.invertLane(below);
			}
		}
	}
}

function yAtNote(element, beam) {
	beam = beam.beams[0];
	return getBarYAt(beam.startX, beam.startY, beam.endX, beam.endY, element.x);
}

function layout(element) {
	// TODO end and beginning of line (PER: P.S. I'm not sure this can happen: I think the parser will always specify both the start and end points.)
	if (element.anchor1 && element.anchor2) {
		element.hasBeam = !!element.anchor1.parent.beam && element.anchor1.parent.beam === element.anchor2.parent.beam;
		var beam = element.anchor1.parent.beam;
		// if hasBeam is true, then the first and last element in the triplet have the same beam.
		// We also need to check if the beam doesn't contain other notes so that `(3 dcdcc` will do a bracket.
		if (element.hasBeam && (beam.elems[0] !== element.anchor1.parent || beam.elems[beam.elems.length-1] !== element.anchor2.parent))
			element.hasBeam = false;

		if (element.hasBeam) {
			// If there is a beam then we don't need to draw anything except the text. The beam could either be above or below.
			var left = isAbove(beam) ? element.anchor1.x + element.anchor1.w : element.anchor1.x;
			element.yTextPos = heightAtMidpoint(left,  element.anchor2.x, beam);
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
	return startX + (endX - startX)/2;
}

module.exports = layoutVoice;
