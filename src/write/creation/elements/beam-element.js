//    abc_beam_element.js: Definition of the BeamElem class.

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

//
// Setup phase
//
var BeamElem = function BeamElem(stemHeight, type, flat, firstElement) {
	// type is "grace", "up", "down", or undefined. flat is used to force flat beams, as it commonly found in the grace notes of bagpipe music.
	this.type = "BeamElem";
	this.isflat = !!flat;
	this.isgrace = !!(type && type === "grace");
	this.forceup = !!(this.isgrace || (type && type === "up"));
	this.forcedown = !!(type && type === "down");
	this.elems = []; // all the AbsoluteElements that this beam touches. It may include embedded rests.
	this.total = 0;
	this.average = 6; // use middle line as start for average.
	this.allrests = true;
	this.stemHeight = stemHeight;
	this.beams = []; // During the layout phase, this will become a list of the beams that need to be drawn.
	if (firstElement && firstElement.duration) {
		this.duration = firstElement.duration;
		if (firstElement.startTriplet) {
			this.duration *= firstElement.tripletMultiplier;
		}
		this.duration = Math.round(this.duration * 1000) / 1000;
	} else
		this.duration = 0;
};

BeamElem.prototype.setHint = function () {
	this.hint = true;
};

BeamElem.prototype.runningDirection = function (abcelem) {
	var pitch = abcelem.averagepitch;
	if (pitch === undefined) return; // don't include elements like spacers in beams
	this.total = Math.round(this.total + pitch);
	if (!this.count)
		this.count = 0;
	this.count++
};

BeamElem.prototype.add = function (abselem) {
	var pitch = abselem.abcelem.averagepitch;
	if (pitch === undefined) return; // don't include elements like spacers in beams
	if (!abselem.abcelem.rest)
		this.allrests = false;
	abselem.beam = this;
	this.elems.push(abselem);
	this.total = Math.round(this.total + pitch);
	if (this.min === undefined || abselem.abcelem.minpitch < this.min) {
		this.min = abselem.abcelem.minpitch;
	}
	if (this.max === undefined || abselem.abcelem.maxpitch > this.max) {
		this.max = abselem.abcelem.maxpitch;
	}
};

BeamElem.prototype.addBeam = function (beam) {
	this.beams.push(beam);
};

BeamElem.prototype.setStemDirection = function () {
	// Have to figure this out before the notes are placed because placing the notes also places the decorations.
	this.average = calcAverage(this.total, this.count);
	if (this.forceup) {
		this.stemsUp = true;
	} else if (this.forcedown) {
		this.stemsUp = false;
	} else {
		var middleLine = 6;	// hardcoded 6 is B
		this.stemsUp = this.average < middleLine; // true is up, false is down;
	}
	delete this.count;
	this.total = 0;
};

BeamElem.prototype.calcDir = function () {
	this.average = calcAverage(this.total, this.elems.length);
	if (this.forceup) {
		this.stemsUp = true;
	} else if (this.forcedown) {
		this.stemsUp = false;
	} else {
		var middleLine = 6;	// hardcoded 6 is B
		this.stemsUp = this.average < middleLine; // true is up, false is down;
	}
	var dir = this.stemsUp ? 'up' : 'down';
	for (var i = 0; i < this.elems.length; i++) {
		for (var j = 0; j < this.elems[i].heads.length; j++) {
			this.elems[i].heads[j].stemDir = dir;
		}
	}
};

function calcAverage(total, numElements) {
	if (!numElements)
		return 0;
	return total / numElements;
}

module.exports = BeamElem;
