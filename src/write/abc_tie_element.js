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
	this.above = options.above; // true if the arc curves above
	this.force = options.force; // force the arc curve, regardless of beaming if true
	this.isTie = options.isTie;
	this.isGrace = options.isGrace;
	this.stemDir = options.stemDir;
	this.dir = options.dir;
};

TieElem.prototype.setEndAnchor = function(anchor2) {
//	console.log("end", this.anchor1 ? this.anchor1.pitch : "N/A", anchor2 ? anchor2.pitch : "N/A", this.isTie, this.isGrace);
	this.anchor2 = anchor2; // must have a .x and a .pitch property or be null (means ends at the end of the line)
	if (this.isTie) {
		if (this.anchor1) // this can happen if the tie comes from the previous line.
			this.anchor1.isTie = true;
		if (this.anchor2) // this can happen if the tie does not go to the next line.
			this.anchor2.isTie = true;
	}
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
	// console.log("layout",
	// 	"pitch 1:" + (this.anchor1 ? this.anchor1.pitch : "N/A"),
	// 	" pitch 2:" + (this.anchor2 ? this.anchor2.pitch : "N/A"),
	// 	" isTie:" + this.isTie,
	// 	" above:" + this.above,
	// 	" force:" + this.force,
	// 	" stemDir:" + this.stemDir,
	// 	" dir:" + this.dir,
	// 	" isGrace:" + this.isGrace);

	if (this.isGrace)
		this.above = false;
	else if (this.force)
		this.above = this.stemDir === "up";
	else {
		var referencePitch;
		if (this.anchor1)
			referencePitch = this.anchor1.pitch;
		else if (this.anchor2)
			referencePitch = this.anchor2.pitch;
		else
			referencePitch = 14; // TODO-PER: this can't really happen normally. This would imply that a tie crossed over three lines, something like "C-\nz\nC"
		this.above = referencePitch >= 6;
	}
};

function hasStem(anchor) {
	return anchor && anchor.parent.duration < 1;
}

function isStemUp(anchor) {
	if (!anchor)
		return false;
	if (!hasStem(anchor)) // is there a stem at all?
		return false;
	// TODO-PER: this is a fragile way to detect that there is a stem going up on this note.
	return anchor.pitch !== anchor.highestVert;
}

function getPitch(anchor, isAbove, isTie) {
	if (isTie) {
		// Always go to the note
		return anchor.pitch;
	}
	if (isAbove && anchor.highestVert !== undefined)
		return anchor.highestVert;
	return anchor.pitch;
}

TieElem.prototype.layout = function (lineStartX, lineEndX) {
	// We now have all of the input variables set, so we can figure out the start and ending x,y coordinates, and finalize the direction of the arc.

	// Ties and slurs are handled a little differently, so do calculations for them separately.
	if (this.isTie) {
		this.calcTieDirection();
		if (this.anchor1) // this can happen if the tie comes from the previous line.
			this.anchor1.tieAbove = this.above;
		if (this.anchor2) // this can happen if the tie goes to the next line.
			this.anchor2.tieAbove = this.above;
	} else {

		// PER: We might have to override the natural slur direction if the first and last notes are not in the
		// same direction. We always put the slur up in this case. The one case that works out wrong is that we always
		// want the slur to be up when the last note is stem down. We can tell the stem direction if the top is
		// equal to the pitch: if so, there is no stem above it.
		if (!this.force) {
			if (!hasStem(this.anchor1) && !hasStem(this.anchor2))
				; // If neither note has a stem, just take the natural direction.
			else if (hasStem(this.anchor1) && !hasStem(this.anchor2))
				; // if the first note has a stem and the second doesn't, just take the natural direction.
			else if (!isStemUp(this.anchor2))
				this.above = true;
		}

		// There is an exception in the slur direction if there is also a tie on the starting or ending note.
		if (!this.force && this.anchor2 && this.anchor2.isTie)
			this.above = this.anchor2.tieAbove;
		else if (!this.force && this.anchor1 && this.anchor1.isTie)
			this.above = this.anchor1.tieAbove;
	}

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

	// For the pitches, if one of the anchors is present, both of the pitches are that anchor. If both are present, then we use both. If neither is present, we use the top of the staff.
	if (this.anchor1 && this.anchor2) {
		this.startY = getPitch(this.anchor1, this.above, this.isTie);
		this.endY = getPitch(this.anchor2, this.above, this.isTie);
		if (lineStartX) {
			// If one of the notes has a stem going up and the other has a stem going down, then move the end points a little.
			var anchor1StemUp = this.anchor1.highestVert > this.anchor1.pitch;
			var anchor2StemUp = this.anchor2.highestVert > this.anchor2.pitch;
			if (anchor1StemUp && !anchor2StemUp && this.anchor1.pitch < this.anchor2.pitch) {
				this.startY = (this.anchor1.highestVert + this.anchor1.pitch) / 2;
				this.startX += 5; // So that the slur doesn't run into the stem.
			}
			if (anchor2StemUp && !anchor1StemUp && this.anchor1.pitch > this.anchor2.pitch) {
				this.endY = (this.anchor2.highestVert + this.anchor2.pitch) / 2;
			}
		}
	} else if (this.anchor1) {
		this.startY = getPitch(this.anchor1, this.above, this.isTie);
		this.endY = getPitch(this.anchor1, this.above, this.isTie);
	} else if (this.anchor2) {
		this.startY = getPitch(this.anchor2, this.above, this.isTie);
		this.endY = getPitch(this.anchor2, this.above, this.isTie);
	} else {
		// This is the case where the slur covers the entire line.
		// TODO-PER: figure out where the real top and bottom of the line are.
		this.startY = this.above ? 14 : 0;
		this.endY = this.above ? 14 : 0;
	}
};

TieElem.prototype.draw = function (renderer, linestartx, lineendx) {
	this.layout(linestartx, lineendx);

	var klass;
	if (this.hint)
			klass = "abcjs-hint";
	renderer.drawArc(this.startX, this.endX, this.startY, this.endY,  this.above, klass, this.isTie);

};

module.exports = TieElem;
