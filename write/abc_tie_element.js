//    abc_tie_element.js: Definition of the TieElement class.
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

ABCJS.write.TieElem = function(anchor1, anchor2, above, forceandshift, isTie) {
	this.anchor1 = anchor1; // must have a .x and a .pitch, and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
	this.anchor2 = anchor2; // must have a .x and a .pitch property or be null (means ends at the end of the line)
	this.above = above; // true if the arc curves above
	this.force = forceandshift; // force the arc curve, regardless of beaming if true
	this.isTie = isTie;
};

ABCJS.write.TieElem.prototype.setEndAnchor = function(anchor2) {
	this.anchor2 = anchor2; // must have a .x and a .pitch property or be null (means ends at the end of the line)
};

// If we encounter a repeat sign, then we don't want to extend either a tie or a slur past it, so these are called to be a limit.
ABCJS.write.TieElem.prototype.setStartX = function(startLimitElem) {
	this.startLimitX = startLimitElem;
};

ABCJS.write.TieElem.prototype.setEndX = function(endLimitElem) {
	this.endLimitX = endLimitElem;
};

ABCJS.write.TieElem.prototype.setHint = function () {
	this.hint = true;
};

ABCJS.write.TieElem.prototype.setUpperAndLowerElements = function(positionY) {
	// Doesn't depend on the highest and lowest, so there's nothing to do here.
};

ABCJS.write.TieElem.prototype.layout = function (lineStartX, lineEndX) {
	function getPitch(anchor, isAbove, isTie) {
		if (isTie) {
			// Always go to the note
			return anchor.pitch;
		}
		if (isAbove && anchor.highestVert !== undefined)
			return anchor.highestVert;
		return anchor.pitch;
	}
	// We now have all of the input variables set, so we can figure out the start and ending x,y coordinates, and finalize the direction of the arc.

	// PER: We might have to override the natural slur direction if the first and last notes are not in the
	// same direction. We always put the slur up in this case. The one case that works out wrong is that we always
	// want the slur to be up when the last note is stem down. We can tell the stem direction if the top is
	// equal to the pitch: if so, there is no stem above it.
	if (!this.force && this.anchor2 && this.anchor2.pitch === this.anchor2.highestVert) // TODO-PER: this is a fragile way to detect that there is no stem going up on this note.
		this.above = true;

	if (this.anchor1)
		this.startX = this.anchor1.x; // The normal case where there is a starting element to attach to.
	else if (this.startLimitX)
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

ABCJS.write.TieElem.prototype.draw = function (renderer, linestartx, lineendx) {
	this.layout(linestartx, lineendx);

	var klass;
	if (this.hint)
			klass = "abcjs-hint";
	renderer.drawArc(this.startX, this.endX, this.startY, this.endY,  this.above, klass);

};
