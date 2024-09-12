//    abc_tie_element.js: Definition of the TieElement class.

var TieElem = function TieElem(options) {
	this.type = "TieElem";
	//	console.log("constructor", options.anchor1 ? options.anchor1.pitch : "N/A", options.anchor2 ? options.anchor2.pitch : "N/A", options.isTie, options.isGrace);
	this.anchor1 = options.anchor1; // must have a .x and a .pitch, and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
	this.anchor2 = options.anchor2; // must have a .x and a .pitch property or be null (means ends at the end of the line)
	if (options.isGrace)
		this.isGrace = true;
	if (options.fixedY)
		this.fixedY = true;
	if (options.stemDir)
		this.stemDir = options.stemDir;
	if (options.voiceNumber !== undefined)
		this.voiceNumber = options.voiceNumber;
	if (options.style !== undefined)
		this.dotted = true;
	this.internalNotes = [];
};

TieElem.prototype.addInternalNote = function (note) {
	this.internalNotes.push(note);
};

TieElem.prototype.setEndAnchor = function (anchor2) {
	//	console.log("end", this.anchor1 ? this.anchor1.pitch : "N/A", anchor2 ? anchor2.pitch : "N/A", this.isTie, this.isGrace);
	this.anchor2 = anchor2; // must have a .x and a .pitch property or be null (means ends at the end of the line)

	// we don't really have enough info to know what the vertical extent is yet and we won't until drawing. This will just give it enough
	// room on either side (we don't even know if the slur will be above yet). We need to set this so that we can make sure the voice has
	// at least enough room that the line doesn't get cut off if the tie or slur is the lowest thing.
	if (this.anchor1) {
		this.top = Math.max(this.anchor1.pitch, this.anchor2.pitch) + 4
		this.bottom = Math.min(this.anchor1.pitch, this.anchor2.pitch) - 4
	} else {
		this.top = this.anchor2.pitch + 4
		this.bottom = this.anchor2.pitch - 4
	}
};

// If we encounter a repeat sign, then we don't want to extend either a tie or a slur past it, so these are called to be a limit.
TieElem.prototype.setStartX = function (startLimitElem) {
	this.startLimitX = startLimitElem;
};

TieElem.prototype.setEndX = function (endLimitElem) {
	this.endLimitX = endLimitElem;
};

TieElem.prototype.setHint = function () {
	this.hint = true;
};

TieElem.prototype.calcTieDirection = function () {
	// The rules:
	// 1) If it is in a grace note group, then the direction is always BELOW.
	// 2) If it is in a single voice, then the direction is always OPPOSITE of the stem (or where the stem would have been in the case of whole notes.)
	// 3) If the stem direction is forced (probably because there are two voices on the same line), then the direction is the SAME as the stem direction.

	if (this.isGrace)
		this.above = false;
	else if (this.voiceNumber === 0)
		this.above = true;
	else if (this.voiceNumber > 0)
		this.above = false;
	else {
		var referencePitch;
		if (this.anchor1)
			referencePitch = this.anchor1.pitch;
		else if (this.anchor2)
			referencePitch = this.anchor2.pitch;
		else
			referencePitch = 14; // TODO-PER: this can't really happen normally. This would imply that a tie crossed over three lines, something like "C-\nz\nC"
		// Put the arc in the opposite direction of the stem. That isn't always the pitch if one or both of the notes are beamed with something that affects its stem.
		if ((this.anchor1 && this.anchor1.stemDir === 'down') && (this.anchor2 && this.anchor2.stemDir === "down"))
			this.above = true;
		else if ((this.anchor1 && this.anchor1.stemDir === 'up') && (this.anchor2 && this.anchor2.stemDir === "up"))
			this.above = false;
		else if (this.anchor1 && this.anchor2)
			this.above = referencePitch >= 6;
		else if (this.anchor1)
			this.above = this.anchor1.stemDir === "down";
		else if (this.anchor2)
			this.above = this.anchor2.stemDir === "down";
		else
			this.above = referencePitch >= 6;
	}
};

// From "standard music notation practice" by Music Publishers’ Association:
// 1) Slurs are placed under the note heads if all stems go up.
// 2) Slurs are placed over the note heads if all stems go down.
// 3) If there are both up stems and down stems, prefer placing the slur over.
// 4) When the staff has opposite stemmed voices, all slurs should be on the stemmed side.

TieElem.prototype.calcSlurDirection = function () {
	if (this.isGrace)
		this.above = false;
	else if (this.voiceNumber === 0)
		this.above = true;
	else if (this.voiceNumber > 0)
		this.above = false;
	else {
		var hasDownStem = false;
		if (this.anchor1 && this.anchor1.stemDir === "down")
			hasDownStem = true;
		if (this.anchor2 && this.anchor2.stemDir === "down")
			hasDownStem = true;
		for (var i = 0; i < this.internalNotes.length; i++) {
			var n = this.internalNotes[i];
			if (n.stemDir === "down")
				hasDownStem = true;
		}
		this.above = hasDownStem;
	}
};

TieElem.prototype.calcX = function (lineStartX, lineEndX) {
	if (this.anchor1) {
		this.startX = this.anchor1.x; // The normal case where there is a starting element to attach to.
		if (this.anchor1.scalex < 1) // this is a grace note - don't offset the tie as much.
			this.startX -= 3;
	} else if (this.startLimitX)
		this.startX = this.startLimitX.x + this.startLimitX.w; // if there is no start element, but there is a repeat mark before the start of the line.
	else {
		if (this.anchor2)
			this.startX = this.anchor2.x - 20; // There is no element and no repeat mark: make a small arc
		else
			this.startX = lineStartX; // Don't have any guidance, so extend to beginning of line
	}
	if (!this.anchor1 && this.dotted)
		this.startX -= 3; // The arc needs to be long enough to tell that it is dotted.

	if (this.anchor2)
		this.endX = this.anchor2.x; // The normal case where there is a starting element to attach to.
	else if (this.endLimitX)
		this.endX = this.endLimitX.x; // if there is no start element, but there is a repeat mark before the start of the line.
	else
		this.endX = lineEndX; // There is no element and no repeat mark: extend to the beginning of the line.
};

TieElem.prototype.calcTieY = function () {
	// If the tie comes from another line, then one or both anchors will be missing.
	if (this.anchor1)
		this.startY = this.anchor1.pitch;
	else if (this.anchor2)
		this.startY = this.anchor2.pitch;
	else
		this.startY = this.above ? 14 : 0;

	if (this.anchor2)
		this.endY = this.anchor2.pitch;
	else if (this.anchor1)
		this.endY = this.anchor1.pitch;
	else
		this.endY = this.above ? 14 : 0;
};

// From "standard music notation practice" by Music Publishers’ Association:
// 1) If the anchor note is down stem, the slur points to the note head.
// 2) If the anchor note is up stem, and the slur is over, then point to middle of stem.

TieElem.prototype.calcSlurY = function () {
	if (this.anchor1 && this.anchor2) {
		if (this.above && this.anchor1.stemDir === "up" && !this.fixedY) {
			this.startY = (this.anchor1.highestVert + this.anchor1.pitch) / 2;
			this.startX += this.anchor1.w / 2; // When going to the middle of the stem, bump the line to the right a little bit to make it look right.
		} else
			this.startY = this.anchor1.pitch;

		// If the closing note has an up stem, and it is beamed, and it isn't the first note in the beam, then the beam will get in the way.
		var beamInterferes = this.anchor2.parent.beam && this.anchor2.parent.beam.stemsUp && this.anchor2.parent.beam.elems[0] !== this.anchor2.parent;
		var midPoint = (this.anchor2.highestVert + this.anchor2.pitch) / 2;
		if (this.above && this.anchor2.stemDir === "up" && !this.fixedY && !beamInterferes && (midPoint < this.startY)) {
			this.endY = midPoint;
			this.endX += Math.round(this.anchor2.w / 2); // When going to the middle of the stem, bump the line to the right a little bit to make it look right.
		} else
			this.endY = this.above && beamInterferes ? this.anchor2.highestVert : this.anchor2.pitch;

		if (this.anchor1.scalex === 1) { // Need a way to tell if this is a grace note - if so then keep the slur as close as possible. TODO-PER-HACK: this should be more declaratively determined.
			var hasBeam1 = !!this.anchor1.parent.beam
			var hasBeam2 = !!this.anchor2.parent.beam
			if (hasBeam1) {
				var isLastInBeam = this.anchor1.parent === this.anchor1.parent.beam.elems[this.anchor1.parent.beam.elems.length-1]
				if (!isLastInBeam) {
						if (this.above)
						this.startY = this.anchor1.parent.fixed.t
					else
						this.startY = this.anchor1.parent.fixed.b
				}
			}

			if (hasBeam2) {
				var isFirstInBeam = this.anchor2.parent === this.anchor2.parent.beam.elems[0]
				if (!isFirstInBeam) {
					if (this.above)
						this.endY = this.anchor2.parent.fixed.t
					else
						this.endY = this.anchor2.parent.fixed.b
				}
			}
		}
	} else if (this.anchor1) {
		this.startY = this.endY = this.anchor1.pitch;
	} else if (this.anchor2) {
		this.startY = this.endY = this.anchor2.pitch;
	} else {
		// This is the case where the slur covers the entire line.
		// TODO-PER: figure out where the real top and bottom of the line are.
		this.startY = this.above ? 14 : 0;
		this.endY = this.above ? 14 : 0;
	}
};

TieElem.prototype.avoidCollisionAbove = function () {
	// Double check that an interior note in the slur isn't so high that it interferes.
	if (this.above) {
		var maxInnerHeight = -50;
		for (var i = 0; i < this.internalNotes.length; i++) {
			if (this.internalNotes[i].highestVert > maxInnerHeight)
				maxInnerHeight = this.internalNotes[i].highestVert;
		}
		if (maxInnerHeight > this.startY && maxInnerHeight > this.endY)
			this.startY = this.endY = maxInnerHeight - 1;
	}
};

TieElem.prototype.getYBounds = function () {
	var lineStartX = 10 // TODO-PER: I'm not sure where to get this number from but it probably doesn't matter much
	var lineEndX = 1000 // TODO-PER: I'm not sure where to get this number from but it probably doesn't matter much
	if (this.isTie) {
		this.calcTieDirection();
		this.calcX(lineStartX, lineEndX);
		this.calcTieY();

	} else {
		this.calcSlurDirection();
		this.calcX(lineStartX, lineEndX);
		this.calcSlurY();
	}
	var top;
	var bottom;
	// TODO-PER: It's hard to tell how far the arc is, so I'm just using 3 as the max
	if (this.above) {
		bottom = Math.min(this.startY, this.endY)
		top = bottom + 3
	} else {
		top = Math.min(this.startY, this.endY)
		bottom = top - 3
	}
	return [ top, bottom ]
};

module.exports = TieElem;
