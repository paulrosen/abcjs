//    abc_tie_element.js: Definition of the TieElement class.
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

var TieElem = function TieElem(options) {
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
	this.internalNotes = [];
};

TieElem.prototype.addInternalNote = function(note) {
	this.internalNotes.push(note);
};

TieElem.prototype.setEndAnchor = function(anchor2) {
//	console.log("end", this.anchor1 ? this.anchor1.pitch : "N/A", anchor2 ? anchor2.pitch : "N/A", this.isTie, this.isGrace);
	this.anchor2 = anchor2; // must have a .x and a .pitch property or be null (means ends at the end of the line)
};

// If we encounter a repeat sign, then we don't want to extend either a tie or a slur past it, so these are called to be a limit.
TieElem.prototype.setStartX = function(startLimitElem) {
	this.startLimitX = startLimitElem;
};

TieElem.prototype.setEndX = function(endLimitElem) {
	this.endLimitX = endLimitElem;
};

TieElem.prototype.setHint = function () {
	this.hint = true;
};

TieElem.prototype.setUpperAndLowerElements = function(positionY) {
	// Doesn't depend on the highest and lowest, so there's nothing to do here.
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
		this.startX = this.startLimitX.x+this.startLimitX.w; // if there is no start element, but there is a repeat mark before the start of the line.
	else
		this.startX = lineStartX; // There is no element and no repeat mark: extend to the beginning of the line.

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
			this.startX += this.anchor1.w/2; // When going to the middle of the stem, bump the line to the right a little bit to make it look right.
		} else
			this.startY = this.anchor1.pitch;

		// If the closing note has an up stem, and it is beamed, and it isn't the first note in the beam, then the beam will get in the way.
		var beamInterferes = this.anchor2.parent.beam && this.anchor2.parent.beam.stemsUp && this.anchor2.parent.beam.elems[0] !== this.anchor2.parent;
		var midPoint = (this.anchor2.highestVert + this.anchor2.pitch) / 2;
		if (this.above && this.anchor2.stemDir === "up" && !this.fixedY && !beamInterferes && (midPoint < this.startY)) {
			this.endY = midPoint;
			this.endX += this.anchor2.w/2; // When going to the middle of the stem, bump the line to the right a little bit to make it look right.
		} else
			this.endY = this.above && beamInterferes ? this.anchor2.highestVert : this.anchor2.pitch;

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

TieElem.prototype.layout = function (lineStartX, lineEndX) {
	// We now have all of the input variables set, so we can figure out the start and ending x,y coordinates, and finalize the direction of the arc.

	// Ties and slurs are handled a little differently, so do calculations for them separately.
	if (!this.anchor1 || !this.anchor2)
		this.isTie = true; // if the slur goes off the end of the line, then draw it like a tie
	else if (this.anchor1.pitch === this.anchor2.pitch && this.internalNotes.length === 0)
		this.isTie = true;
	else
		this.isTie = false;

	// TODO-PER: Not sure why this would be needed, but it would be better to figure out a way to have the anchors be immutable here anyway.
	// if (this.isTie) {
	// 	if (this.anchor1) // this can happen if the tie comes from the previous line.
	// 		this.anchor1.isTie = true;
	// 	if (this.anchor2) // this can happen if the tie does not go to the next line.
	// 		this.anchor2.isTie = true;
	// }

	if (this.isTie) {
		this.calcTieDirection();
		// TODO-PER: Not sure why this would be needed, but it would be better to figure out a way to have the anchors be immutable here anyway.
		// if (this.anchor1) // this can happen if the tie comes from the previous line.
		// 	this.anchor1.tieAbove = this.above;
		// if (this.anchor2) // this can happen if the tie goes to the next line.
		// 	this.anchor2.tieAbove = this.above;
		this.calcX(lineStartX, lineEndX);
		this.calcTieY();

	} else {
		this.calcSlurDirection();
		this.calcX(lineStartX, lineEndX);
		this.calcSlurY();
	}
	this.avoidCollisionAbove();
};

TieElem.prototype.draw = function (renderer, linestartx, lineendx) {
	this.layout(linestartx, lineendx);

	var klass;
	if (this.hint)
			klass = "abcjs-hint";
	var fudgeY =  this.fixedY ? 1.5 : 0; // TODO-PER: This just compensates for drawArc, which contains too much knowledge of ties and slurs.
	renderer.drawArc(this.startX, this.endX, this.startY+fudgeY, this.endY+fudgeY,  this.above, klass, this.isTie);

};

module.exports = TieElem;
