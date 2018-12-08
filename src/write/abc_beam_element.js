//    abc_beam_element.js: Definition of the BeamElem class.
//    Copyright (C) 2010-2018 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var AbsoluteElement = require('./abc_absolute_element');
var RelativeElement = require('./abc_relative_element');
var spacing = require('./abc_spacing');

var getDurlog = function(duration) {
        // TODO-PER: This is a hack to prevent a Chrome lockup. Duration should have been defined already,
        // but there's definitely a case where it isn't. [Probably something to do with triplets.]
        if (duration === undefined) {
                return 0;
        }
//        console.log("getDurlog: " + duration);
  return Math.floor(Math.log(duration)/Math.log(2));
};


// Most elements on the page are related to a particular absolute element -- notes, rests, bars, etc. Beams, however, span multiple elements.
// This means that beams can't be laid out until the absolute elements are placed. There is the further complication that the stems for beamed
// notes can't be laid out until the beams are because we don't know how long they will be until we know the slope of the beam and the horizontal
// spacing of the absolute elements.
//
// So, when a beam is detected, a BeamElem is created, then all notes belonging to that beam are added to it. These notes are not given stems at that time.
// Then, after the horizontal layout is complete, all of the BeamElem are iterated to set the beam position, then all of the notes that are beamed are given
// stems. After that, we are ready for the drawing step.

// There are three phases: the setup phase, when new elements are being discovered, the layout phase, when everything is calculated, and the drawing phase,
// when the object is not changed, but is used to put the elements on the page.

var BeamElem;

(function() {
	"use strict";

	//
	// Setup phase
	//
	BeamElem = function BeamElem(stemHeight, type, flat) {
		// type is "grace", "up", "down", or undefined. flat is used to force flat beams, as it commonly found in the grace notes of bagpipe music.
		this.isflat = flat;
		this.isgrace = (type && type === "grace");
		this.forceup = this.isgrace || (type && type === "up");
		this.forcedown = (type && type === "down");
		this.elems = []; // all the AbsoluteElements that this beam touches. It may include embedded rests.
		this.total = 0;
		this.allrests = true;
		this.stemHeight = stemHeight;
		this.beams = []; // During the layout phase, this will become a list of the beams that need to be drawn.
	};

	BeamElem.prototype.setHint = function () {
		this.hint = true;
	};

	BeamElem.prototype.add = function(abselem) {
		var pitch = abselem.abcelem.averagepitch;
		if (pitch === undefined) return; // don't include elements like spacers in beams
		this.allrests = this.allrests && abselem.abcelem.rest;
		abselem.beam = this;
		this.elems.push(abselem);
		//var pitch = abselem.abcelem.averagepitch;
		this.total += pitch; // TODO CHORD (get pitches from abselem.heads)
		if (this.min === undefined || abselem.abcelem.minpitch < this.min) {
			this.min = abselem.abcelem.minpitch;
		}
		if (this.max === undefined || abselem.abcelem.maxpitch > this.max) {
			this.max = abselem.abcelem.maxpitch;
		}
	};

	var middleLine = 6;	// hardcoded 6 is B

	BeamElem.prototype.calcDir = function() {
		if (this.forceup) return true;
		if (this.forcedown) return false;
		var average = calcAverage(this.total, this.elems.length);
		return average < middleLine;
	};

	//
	// layout phase
	//
	BeamElem.prototype.layout = function() {
		if (this.elems.length === 0 || this.allrests) return;

		this.stemsUp = this.calcDir(); // True means the stems are facing up.
		var dy = calcDy(this.stemsUp, this.isgrace); // This is the width of the beam line.

		// create the main beam
		var firstElement = this.elems[0];
		var lastElement = this.elems[this.elems.length - 1];
		var minStemHeight = 0; // The following is to leave space for "!///!" marks.
		var referencePitch = this.stemsUp ? firstElement.abcelem.maxpitch : firstElement.abcelem.minpitch;
		minStemHeight = minStem(firstElement, this.stemsUp, referencePitch, minStemHeight);
		minStemHeight = minStem(lastElement, this.stemsUp, referencePitch, minStemHeight);
		minStemHeight = Math.max(this.stemHeight, minStemHeight + 3); // TODO-PER: The 3 is the width of a 16th beam. The actual height of the beam should be used instead.
		var yPos = calcYPos(this.total, this.elems.length, minStemHeight, this.stemsUp, firstElement.abcelem.averagepitch, lastElement.abcelem.averagepitch, this.isflat, this.min, this.max, this.isgrace);
		var xPos = calcXPos(this.stemsUp, firstElement, lastElement);
		this.beams.push({ startX: xPos[0], endX: xPos[1], startY: yPos[0], endY: yPos[1], dy: dy });

		// create the rest of the beams (in the case of 1/16th notes, etc.
		var beams = createAdditionalBeams(this.elems, this.stemsUp, this.beams[0], this.isgrace, dy);
		for (var i = 0; i < beams.length; i++)
			this.beams.push(beams[i]);

		// Now that the main beam is defined, we know how tall the stems should be, so create them and attach them to the original notes.
		createStems(this.elems, this.stemsUp, this.beams[0], dy, this.mainNote);
	};

	BeamElem.prototype.isAbove = function() {
		return this.stemsUp;
	};

	// We can't just use the entire beam for the calculation. The range has to be passed in, because the beam might extend into some unrelated notes. for instance, (3_a'f'e'f'2 when L:16
	BeamElem.prototype.heightAtMidpoint = function(startX, endX) {
		if (this.beams.length === 0)
			return 0;
		var beam = this.beams[0];
		var midPoint = startX + (endX - startX) / 2;
		return getBarYAt(beam.startX, beam.startY, beam.endX, beam.endY, midPoint);
	};

	BeamElem.prototype.yAtNote = function(element) {
		var beam = this.beams[0];
		return getBarYAt(beam.startX, beam.startY, beam.endX, beam.endY, element.x);
	};

	BeamElem.prototype.xAtMidpoint = function(startX, endX) {
		return startX + (endX - startX)/2;
	};

	//
	// Drawing phase
	//
	BeamElem.prototype.draw = function(renderer) {
		if (this.beams.length === 0) return;

		renderer.beginGroup();
		for (var i = 0; i < this.beams.length; i++) {
			var beam = this.beams[i];
			drawBeam(renderer, beam.startX, beam.startY, beam.endX, beam.endY, beam.dy, this.hint);
		}
		renderer.endGroup('beam-elem');
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

	function calcAverage(total, numElements) {
		if (!numElements)
			return 0;
		return total / numElements;
	}

	function getBarYAt(startx, starty, endx, endy, x) {
		return starty + (endy - starty) / (endx - startx) * (x - startx);
	}

	function calcDy(asc, isGrace) {
		var dy = (asc) ? spacing.STEP : -spacing.STEP;
		if (isGrace) dy = dy * 0.4;
		return dy;
	}

	function drawBeam(renderer, startX, startY, endX, endY, dy, isHint) {
		var klass = 'beam-elem';
		if (isHint)
			klass += " abcjs-hint";

		// the X coordinates are actual coordinates, but the Y coordinates are in pitches.
		startY = renderer.calcY(startY);
		endY = renderer.calcY(endY);
		var pathString = "M" + startX + " " + startY + " L" + endX + " " + endY +
			"L" + endX + " " + (endY + dy) + " L" + startX + " " + (startY + dy) + "z";
		renderer.printPath({
			path: pathString,
			stroke: "none",
			fill: "#000000",
			'class': renderer.addClasses(klass)
		});
	}

	function calcXPos(asc, firstElement, lastElement) {
		var starthead = firstElement.heads[asc ? 0 : firstElement.heads.length - 1];
		var endhead = lastElement.heads[asc ? 0 : lastElement.heads.length - 1];
		var startX = starthead.x;
		if (asc) startX += starthead.w - 0.6;
		var endX = endhead.x;
		if (asc) endX += endhead.w;
		return [ startX, endX ];
	}

	function calcYPos(total, numElements, stemHeight, asc, firstAveragePitch, lastAveragePitch, isFlat, minPitch, maxPitch, isGrace) {
		var average = calcAverage(total, numElements); // This is the average pitch for the all the notes that will be beamed.
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

		return [ startY, endY];
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
			parent.addExtra(stem);
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
				if (auxBeams[-4 - durlog]) {
					auxBeams[-4 - durlog].single = false;
				} else {
					auxBeams[-4 - durlog] = {
						x: x + ((asc) ? -0.6 : 0), y: bary + sy * (-4 - durlog + 1),
						durlog: durlog, single: true
					};
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
					beams.push({ startX: auxBeams[j].x, endX: auxBeamEndX, startY: auxBeams[j].y, endY: auxBeamEndY, dy: dy });
					auxBeams = auxBeams.slice(0, j);
				}
			}
		}
		return beams;
	}
})();

module.exports = BeamElem;
