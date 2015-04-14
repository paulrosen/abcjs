//    abc_triplet_element.js: Definition of the TripletElem class.
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

(function() {
	"use strict";

	ABCJS.write.TripletElem = function(number, anchor1) {
		this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
		this.number = number;
	};

	ABCJS.write.TripletElem.prototype.setCloseAnchor = function(anchor2) {
		this.anchor2 = anchor2;
	};

	ABCJS.write.TripletElem.prototype.setUpperAndLowerElements = function(/*positionY*/) {
	};

	ABCJS.write.TripletElem.prototype.draw = function(renderer) {
		// TODO end and beginning of line (PER: P.S. I'm not sure this can happen: I think the parser will always specify both the start and end points.)
		if (this.anchor1 && this.anchor2) {
			var xTextPos;
			var yTextPos;
			var hasBeam = this.anchor1.parent.beam && this.anchor1.parent.beam === this.anchor2.parent.beam;

			if (hasBeam) {
				// If there is a beam then we don't need to draw anything except the text. The beam could either be above or below.
				var beam = this.anchor1.parent.beam;
				var left = beam.isAbove() ? this.anchor1.x + this.anchor1.w : this.anchor1.x;
				xTextPos = beam.xAtMidpoint(left,  this.anchor2.x);
				yTextPos = beam.heightAtMidpoint(left,  this.anchor2.x);
				yTextPos += beam.isAbove() ? 4 : -4; // This creates some space between the beam and the number.
			} else {
				// If there isn't a beam, then we need to draw the bracket and the text. The bracket is always above.
				// The bracket is never lower than the 'a' line, but is 4 pitches above the first and last notes. If there is
				// a tall note in the middle, the bracket is horizontal and above the highest note.
				var startNote = Math.max(this.anchor1.parent.top, 9) + 4;
				var endNote = Math.max(this.anchor2.parent.top, 9) + 4;
				// TODO-PER: Do the case where the middle note is really high.
				xTextPos = this.anchor1.x + (this.anchor2.x + this.anchor2.w - this.anchor1.x) / 2;
				yTextPos = startNote + (endNote - startNote) / 2;
				drawBracket(renderer, this.anchor1.x, startNote, this.anchor2.x + this.anchor2.w, endNote);
			}

			renderer.renderText(xTextPos, renderer.calcY(yTextPos), "" + this.number, 'tripletfont', "triplet", "middle", true);
		}
	};

	function drawLine(renderer, l, t, r, b) {
		var pathString = ABCJS.write.sprintf("M %f %f L %f %f",
			l, t, r, b);
		renderer.printPath({path: pathString, stroke: "#000000", 'class': renderer.addClasses('triplet')});
	}

	function drawBracket(renderer, x1, y1, x2, y2) {
		y1 = renderer.calcY(y1);
		y2 = renderer.calcY(y2);
		var bracketHeight = 5;

		// Draw vertical lines at the beginning and end
		drawLine(renderer, x1, y1, x1, y1 + bracketHeight);
		drawLine(renderer, x2, y2, x2, y2 + bracketHeight);

		// figure out midpoints to draw the broken line.
		var midX = x1 + (x2-x1)/2;
		var midY = y1 + (y2-y1)/2;
		var gapWidth = 8;
		var slope = (y2 - y1) / (x2 - x1);
		var leftEndX = midX - gapWidth;
		var leftEndY = y1 + (leftEndX - x1) * slope;
		drawLine(renderer, x1, y1, leftEndX, leftEndY);
		var rightStartX = midX + gapWidth;
		var rightStartY = y1 + (rightStartX - x1) * slope;
		drawLine(renderer, rightStartX, rightStartY, x2, y2);
	}
})();

