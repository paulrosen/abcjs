var RelativeElement = require('../creation/elements/relative-element');
var spacing = require('../helpers/spacing');
var getBarYAt = require('./get-bar-y-at');

var layoutBeam = function (beam) {
	if (beam.elems.length === 0 || beam.allrests) return;

	var dy = calcDy(beam.stemsUp, beam.isgrace); // This is the width of the beam line.

	// create the main beam
	var firstElement = beam.elems[0];
	var lastElement = beam.elems[beam.elems.length - 1];
	var minStemHeight = 0; // The following is to leave space for "!///!" marks.
	var referencePitch = beam.stemsUp ? firstElement.abcelem.maxpitch : firstElement.abcelem.minpitch;
	minStemHeight = minStem(firstElement, beam.stemsUp, referencePitch, minStemHeight);
	minStemHeight = minStem(lastElement, beam.stemsUp, referencePitch, minStemHeight);
	minStemHeight = Math.max(beam.stemHeight, minStemHeight + 3); // TODO-PER: The 3 is the width of a 16th beam. The actual height of the beam should be used instead.
	var yPos = calcYPos(beam.average, beam.elems.length, minStemHeight, beam.stemsUp, firstElement.abcelem.averagepitch, lastElement.abcelem.averagepitch, beam.isflat, beam.min, beam.max, beam.isgrace);
	var xPos = calcXPos(beam.stemsUp, firstElement, lastElement);
	beam.addBeam({ startX: xPos[0], endX: xPos[1], startY: yPos[0], endY: yPos[1], dy: dy });

	// create the rest of the beams (in the case of 1/16th notes, etc.
	var beams = createAdditionalBeams(beam.elems, beam.stemsUp, beam.beams[0], beam.isgrace, dy);
	for (var i = 0; i < beams.length; i++)
		beam.addBeam(beams[i]);

	// Now that the main beam is defined, we know how tall the stems should be, so create them and attach them to the original notes.
	createStems(beam.elems, beam.stemsUp, beam.beams[0], dy, beam.mainNote);
};

var getDurlog = function (duration) {
	// TODO-PER: This is a hack to prevent a Chrome lockup. Duration should have been defined already,
	// but there's definitely a case where it isn't. [Probably something to do with triplets.]
	if (duration === undefined) {
		return 0;
	}
	//        console.log("getDurlog: " + duration);
	return Math.floor(Math.log(duration) / Math.log(2));
};

//
// private functions
//
function minStem(element, stemsUp, referencePitch, minStemHeight) {
	if (!element.children)
		return minStemHeight;
	for (var i = 0; i < element.children.length; i++) {
		var elem = element.children[i];
		if (stemsUp && elem.top !== undefined && elem.c === "flags.ugrace")
			minStemHeight = Math.max(minStemHeight, elem.top - referencePitch);
		else if (!stemsUp && elem.bottom !== undefined && elem.c === "flags.ugrace")
			minStemHeight = Math.max(minStemHeight, referencePitch - elem.bottom + 7); // The extra 7 is because we are measuring the slash from the top.
	}
	return minStemHeight;
}

function calcSlant(leftAveragePitch, rightAveragePitch, numStems, isFlat) {
	if (isFlat)
		return 0;
	var slant = leftAveragePitch - rightAveragePitch;
	var maxSlant = numStems / 2;

	if (slant > maxSlant) slant = maxSlant;
	if (slant < -maxSlant) slant = -maxSlant;
	return slant;
}

function calcDy(asc, isGrace) {
	var dy = (asc) ? spacing.STEP : -spacing.STEP;
	if (isGrace) dy = dy * 0.4;
	return dy;
}

function calcXPos(asc, firstElement, lastElement) {
	var starthead = firstElement.heads[asc ? 0 : firstElement.heads.length - 1];
	var endhead = lastElement.heads[asc ? 0 : lastElement.heads.length - 1];
	var startX = starthead.x;
	if (asc) startX += starthead.w - 0.6;
	var endX = endhead.x;
	endX += (asc) ? endhead.w : 0.6;
	return [startX, endX];
}

function calcYPos(average, numElements, stemHeight, asc, firstAveragePitch, lastAveragePitch, isFlat, minPitch, maxPitch, isGrace) {
	var barpos = stemHeight - 2; // (isGrace)? 5:7;
	var barminpos = stemHeight - 2;
	var pos = Math.round(asc ? Math.max(average + barpos, maxPitch + barminpos) : Math.min(average - barpos, minPitch - barminpos));

	var slant = calcSlant(firstAveragePitch, lastAveragePitch, numElements, isFlat);
	var startY = pos + Math.floor(slant / 2);
	var endY = pos + Math.floor(-slant / 2);

	// If the notes are too high or too low, make the beam go down to the middle
	if (!isGrace) {
		if (asc && pos < 6) {
			startY = 6;
			endY = 6;
		} else if (!asc && pos > 6) {
			startY = 6;
			endY = 6;
		}
	}

	return [startY, endY];
}

function createStems(elems, asc, beam, dy, mainNote) {
	for (var i = 0; i < elems.length; i++) {
		var elem = elems[i];
		if (elem.abcelem.rest)
			continue;
		// TODO-PER: This is odd. If it is a regular beam then elems is an array of AbsoluteElements, if it is a grace beam then it is an array of objects , so we directly attach the element to the parent. We tell it if is a grace note because they are passed in as a generic object instead of an AbsoluteElement.
		var isGrace = elem.addExtra ? false : true;
		var parent = isGrace ? mainNote : elem;
		var furthestHead = elem.heads[(asc) ? 0 : elem.heads.length - 1];
		var ovalDelta = 1 / 5;//(isGrace)?1/3:1/5;
		var pitch = furthestHead.pitch + ((asc) ? ovalDelta : -ovalDelta);
		var dx = asc ? furthestHead.w : 0; // down-pointing stems start on the left side of the note, up-pointing stems start on the right side, so we offset by the note width.
		if (!isGrace)
			dx += furthestHead.dx;
		var x = furthestHead.x + dx; // this is now the actual x location in pixels.
		var bary = getBarYAt(beam.startX, beam.startY, beam.endX, beam.endY, x);
		var lineWidth = (asc) ? -0.6 : 0.6;
		if (!asc)
			bary -= (dy / 2) / spacing.STEP;	// TODO-PER: This is just a fudge factor so the down-pointing stems don't overlap.
		if (isGrace)
			dx += elem.heads[0].dx;
		// TODO-PER-HACK: One type of note head has a different placement of the stem. This should be more generically calculated:
		if (furthestHead.c === 'noteheads.slash.quarter') {
			if (asc)
				pitch += 1;
			else
				pitch -= 1;
		}
		var stem = new RelativeElement(null, dx, 0, pitch, {
			"type": "stem",
			"pitch2": bary,
			linewidth: lineWidth
		});
		stem.setX(parent.x); // This is after the x coordinates were set, so we have to set it directly.
		parent.addRight(stem);
	}

}

function createAdditionalBeams(elems, asc, beam, isGrace, dy) {
	var beams = [];
	var auxBeams = [];  // auxbeam will be {x, y, durlog, single} auxbeam[0] should match with durlog=-4 (16th) (j=-4-durlog)
	for (var i = 0; i < elems.length; i++) {
		var elem = elems[i];
		if (elem.abcelem.rest)
			continue;
		var furthestHead = elem.heads[(asc) ? 0 : elem.heads.length - 1];
		var x = furthestHead.x + ((asc) ? furthestHead.w : 0);
		var bary = getBarYAt(beam.startX, beam.startY, beam.endX, beam.endY, x);

		var sy = (asc) ? -1.5 : 1.5;
		if (isGrace) sy = sy * 2 / 3; // This makes the second beam on grace notes closer to the first one.
		var duration = elem.abcelem.duration; // get the duration via abcelem because of triplets
		if (duration === 0) duration = 0.25; // if this is stemless, then we use quarter note as the duration.
		for (var durlog = getDurlog(duration); durlog < -3; durlog++) {
			var index = -4 - durlog;
			if (auxBeams[index]) {
				auxBeams[index].single = false;
			} else {
				auxBeams[index] = {
					x: x + ((asc) ? -0.6 : 0), y: bary + sy * (index + 1),
					durlog: durlog, single: true
				};
			}
			if (i > 0 && elem.abcelem.beambr && elem.abcelem.beambr <= (index + 1)) {
				if (!auxBeams[index].split)
					auxBeams[index].split = [auxBeams[index].x];
				var xPos = calcXPos(asc, elems[i - 1], elem);
				if (auxBeams[index].split[auxBeams[index].split.length - 1] >= xPos[0]) {
					// the reduction in beams leaves a note unattached so create a small flag for it.
					xPos[0] += elem.w;
				}
				auxBeams[index].split.push(xPos[0]);
				auxBeams[index].split.push(xPos[1]);
			}
		}

		for (var j = auxBeams.length - 1; j >= 0; j--) {
			if (i === elems.length - 1 || getDurlog(elems[i + 1].abcelem.duration) > (-j - 4)) {

				var auxBeamEndX = x;
				var auxBeamEndY = bary + sy * (j + 1);


				if (auxBeams[j].single) {
					auxBeamEndX = (i === 0) ? x + 5 : x - 5;
					auxBeamEndY = getBarYAt(beam.startX, beam.startY, beam.endX, beam.endY, auxBeamEndX) + sy * (j + 1);
				}
				var b = { startX: auxBeams[j].x, endX: auxBeamEndX, startY: auxBeams[j].y, endY: auxBeamEndY, dy: dy }
				if (auxBeams[j].split !== undefined) {
					var split = auxBeams[j].split;
					if (b.endX <= split[split.length - 1]) {
						// the reduction in beams leaves the last note by itself, so create a little flag for it
						split[split.length - 1] -= elem.w;
					}
					split.push(b.endX);
					b.split = auxBeams[j].split;
				}
				beams.push(b);
				auxBeams = auxBeams.slice(0, j);
			}
		}
	}
	return beams;
}

module.exports = layoutBeam;
