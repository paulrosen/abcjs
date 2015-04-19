//    abc_beam_element.js: Definition of the BeamElem class.
//    Copyright (C) 2010,2014 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*globals ABCJS */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

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

(function() {
	"use strict";

	//
	// Setup phase
	//
	ABCJS.write.BeamElem = function(stemHeight, type, flat) {
		// type is "grace", "up", "down", or undefined. flat is used to force flat beams, as it commonly found in the grace notes of bagpipe music.
		this.isflat = flat;
		this.isgrace = (type && type === "grace");
		this.forceup = this.isgrace || (type && type === "up");
		this.forcedown = (type && type === "down");
		this.elems = []; // all the ABCJS.write.AbsoluteElements that this beam touches. It may include embedded rests.
		this.total = 0;
		this.allrests = true;
		this.stemHeight = stemHeight;
		this.beams = []; // During the layout phase, this will become a list of the beams that need to be drawn.
	};

	ABCJS.write.BeamElem.prototype.add = function(abselem) {
		var pitch = abselem.abcelem.averagepitch;
		if (pitch === undefined) return; // don't include elements like spacers in beams
		this.allrests = this.allrests && abselem.abcelem.rest;
		abselem.beam = this;
		this.elems.push(abselem);
		//var pitch = abselem.abcelem.averagepitch;
		this.total += pitch; // TODO CHORD (get pitches from abselem.heads)
		if (!this.min || abselem.abcelem.minpitch < this.min) {
			this.min = abselem.abcelem.minpitch;
		}
		if (!this.max || abselem.abcelem.maxpitch > this.max) {
			this.max = abselem.abcelem.maxpitch;
		}
	};

	var middleLine = 6;	// hardcoded 6 is B

	ABCJS.write.BeamElem.prototype.calcDir = function() {
		if (this.forceup) return true;
		if (this.forcedown) return false;
		var average = calcAverage(this.total, this.elems.length);
		return average < middleLine;
	};

	//
	// layout phase
	//
	ABCJS.write.BeamElem.prototype.layout = function() {
		if (this.elems.length === 0 || this.allrests) return;

		this.stemsUp = this.calcDir(); // True means the stems are facing up.
		var dy = calcDy(this.stemsUp, this.isgrace); // This is the width of the beam line.

		// create the main beam
		var firstElement = this.elems[0];
		var lastElement = this.elems[this.elems.length - 1];
		var yPos = calcYPos(this.total, this.elems.length, this.stemHeight, this.stemsUp, firstElement.abcelem.averagepitch, lastElement.abcelem.averagepitch, this.isflat, this.min, this.max, this.isgrace);
		var xPos = calcXPos(this.stemsUp, firstElement, lastElement);
		this.beams.push({ startX: xPos[0], endX: xPos[1], startY: yPos[0], endY: yPos[1], dy: dy });

		// create the rest of the beams (in the case of 1/16th notes, etc.
		var beams = createAdditionalBeams(this.elems, this.stemsUp, this.beams[0], this.isgrace, dy);
		for (var i = 0; i < beams.length; i++)
			this.beams.push(beams[i]);

		// Now that the main beam is defined, we know how tall the stems should be, so create them and attach them to the original notes.
		createStems(this.elems, this.stemsUp, this.beams[0], dy, this.mainNote);
	};

	ABCJS.write.BeamElem.prototype.isAbove = function() {
		return this.stemsUp;
	};

	// We can't just use the entire beam for the calculation. The range has to be passed in, because the beam might extend into some unrelated notes. for instance, (3_a'f'e'f'2 when L:16
	ABCJS.write.BeamElem.prototype.heightAtMidpoint = function(startX, endX) {
		if (this.beams.length === 0)
			return 0;
		var beam = this.beams[0];
		var midPoint = startX + (endX - startX) / 2;
		return getBarYAt(beam.startX, beam.startY, beam.endX, beam.endY, midPoint);
	};

	ABCJS.write.BeamElem.prototype.xAtMidpoint = function(startX, endX) {
		return startX + (endX - startX)/2;
	};

	//
	// Drawing phase
	//
	ABCJS.write.BeamElem.prototype.draw = function(renderer) {
		if (this.beams.length === 0) return;

		renderer.beginGroup();
		for (var i = 0; i < this.beams.length; i++) {
			var beam = this.beams[i];
			drawBeam(renderer, beam.startX, beam.startY, beam.endX, beam.endY, beam.dy);
		}
		renderer.endGroup('beam-elem');
	};

	//
	// private functions
	//
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

ABCJS.write.BeamElem.prototype.draw = function(printer) {
	if (this.elems.length === 0 || this.allrests) return;
	this.drawBeam(printer);
	this.drawStems(printer);
};

	function drawBeam(renderer, startX, startY, endX, endY, dy) {
		// the X coordinates are actual coordinates, but the Y coordinates are in pitches.
		startY = renderer.calcY(startY);
		endY = renderer.calcY(endY);
		var pathString = "M" + startX + " " + startY + " L" + endX + " " + endY +
			"L" + endX + " " + (endY + dy) + " L" + startX + " " + (startY + dy) + "z";
		renderer.printPath({
			path: pathString,
			stroke: "none",
			fill: "#000000",
			'class': renderer.addClasses('beam-elem')
		});
	}

ABCJS.write.BeamElem.prototype.drawBeam = function(printer) {
	var average = this.average();
	var barpos = (this.isgrace)? 5:7;
	this.calcDir();

	function calcYPos(total, numElements, stemHeight, asc, firstAveragePitch, lastAveragePitch, isFlat, minPitch, maxPitch, isGrace) {
		var average = calcAverage(total, numElements); // This is the average pitch for the all the notes that will be beamed.
		var barpos = stemHeight - 2; // (isGrace)? 5:7;
		var barminpos = stemHeight - 2;
		var pos = Math.round(asc ? Math.max(average + barpos, maxPitch + barminpos) : Math.min(average - barpos, minPitch - barminpos));

	if (slant>maxslant) slant = maxslant;
	if (slant<-maxslant) slant = -maxslant;
	this.starty = printer.calcY(this.pos+Math.floor(slant/2));
	this.endy = printer.calcY(this.pos+Math.floor(-slant/2));

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

	// PER: if the notes are too high or too low, make the beam go down to the middle
	if (this.asc && this.pos < 6) {
		this.starty = printer.calcY(6);
		this.endy = printer.calcY(6);
	} else if (!this.asc && this.pos > 6) {
		this.starty = printer.calcY(6);
		this.endy = printer.calcY(6);
	}

	var pathString = "M"+this.startx+" "+this.starty+" L"+this.endx+" "+this.endy+
		"L"+this.endx+" "+(this.endy+this.dy) +" L"+this.startx+" "+(this.starty+this.dy)+"z";
	printer.printPath({path:pathString, stroke:"none", fill:"#000000", 'class': printer.addClasses('beam-elem')});
};

ABCJS.write.BeamElem.prototype.drawStems = function(printer) {
	var auxbeams = [];  // auxbeam will be {x, y, durlog, single} auxbeam[0] should match with durlog=-4 (16th) (j=-4-durlog)
	printer.beginGroup();
	for (var i=0,ii=this.elems.length; i<ii; i++) {
		if (this.elems[i].abcelem.rest)
			continue;
		var furthesthead = this.elems[i].heads[(this.asc)? 0: this.elems[i].heads.length-1];
		var ovaldelta = (this.isgrace)?1/3:1/5;
		var pitch = furthesthead.pitch + ((this.asc) ? ovaldelta : -ovaldelta);
		var y = printer.calcY(pitch);
		var x = furthesthead.x + ((this.asc) ? furthesthead.w: 0);
		var bary=this.getBarYAt(x);
		var dx = (this.asc) ? -0.6 : 0.6;
		printer.printStem(x,dx,y,bary);

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
			for (var durlog = ABCJS.write.getDurlog(elem.abcelem.duration); durlog < -3; durlog++) { // get the duration via abcelem because of triplets
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
				if (i === elems.length - 1 || ABCJS.write.getDurlog(elems[i + 1].abcelem.duration) > (-j - 4)) {

					var auxBeamEndX = x;
					var auxBeamEndY = bary + sy * (j + 1);


					if (auxBeams[j].single) {
						auxBeamEndX = (i === 0) ? x + 5 : x - 5;
						auxBeamEndY = getBarYAt(beam.startX, beam.startY, beam.endX, beam.endY, auxBeamEndX) + sy * (j + 1);
					}
					beams.push({ startX: auxBeams[j].x, endX: auxBeamEndX, startY: auxBeams[j].y, endY: auxBeamEndY, dy: dy });
					auxBeams = auxBeams.slice(0, j);
				}
				// TODO I think they are drawn from front to back, hence the small x difference with the main beam

				var pathString ="M"+auxbeams[j].x+" "+auxbeams[j].y+" L"+auxbeamendx+" "+auxbeamendy+
					"L"+auxbeamendx+" "+(auxbeamendy+this.dy) +" L"+auxbeams[j].x+" "+(auxbeams[j].y+this.dy)+"z";
				printer.printPath({path:pathString, stroke:"none", fill:"#000000", 'class': printer.addClasses('beam-elem')});
				auxbeams = auxbeams.slice(0,j);
			}
		}
		return beams;
	}
	printer.endGroup('beam-elem');
};

ABCJS.write.BeamElem.prototype.getBarYAt = function(x) {
	return this.starty + (this.endy-this.starty)/(this.endx-this.startx)*(x-this.startx);
};
