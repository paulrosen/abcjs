//    abc_triplet_element.js: Definition of the TripletElem class.
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

var sprintf = require('./sprintf');

var TripletElem;

(function() {
	"use strict";

	TripletElem = function TripletElem(number, anchor1) {
		this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after key signature)
		this.number = number;
	};

	TripletElem.prototype.isClosed = function() {
		return this.anchor2;
	};

	TripletElem.prototype.setCloseAnchor = function(anchor2) {
		this.anchor2 = anchor2;
		// TODO-PER: Unfortunately, I don't know if there is a beam above until after the vertical positioning is done,
		// so I don't know whether to leave room for the number above. Therefore, If there is a beam on the first note, I'll leave room just in case.
		if (this.anchor1.parent.beam)
			this.endingHeightAbove = 4;
	};

	TripletElem.prototype.setUpperAndLowerElements = function(/*positionY*/) {
	};

	TripletElem.prototype.layout = function() {
		// TODO end and beginning of line (PER: P.S. I'm not sure this can happen: I think the parser will always specify both the start and end points.)
		if (this.anchor1 && this.anchor2) {
			this.hasBeam = this.anchor1.parent.beam && this.anchor1.parent.beam === this.anchor2.parent.beam;

			if (this.hasBeam) {
				// If there is a beam then we don't need to draw anything except the text. The beam could either be above or below.
				var beam = this.anchor1.parent.beam;
				var left = beam.isAbove() ? this.anchor1.x + this.anchor1.w : this.anchor1.x;
				this.yTextPos = beam.heightAtMidpoint(left,  this.anchor2.x);
				this.yTextPos += beam.isAbove() ? 4 : -4; // This creates some space between the beam and the number.
				if (beam.isAbove())
					this.endingHeightAbove = 4;
			} else {
				// If there isn't a beam, then we need to draw the bracket and the text. The bracket is always above.
				// The bracket is never lower than the 'a' line, but is 4 pitches above the first and last notes. If there is
				// a tall note in the middle, the bracket is horizontal and above the highest note.
				this.startNote = Math.max(this.anchor1.parent.top, 9) + 4;
				this.endNote = Math.max(this.anchor2.parent.top, 9) + 4;
				// TODO-PER: Do the case where the middle note is really high.
				this.yTextPos = this.startNote + (this.endNote - this.startNote) / 2;
			}

		}
	};

	TripletElem.prototype.draw = function(renderer) {
		var xTextPos;
		if (this.hasBeam) {
			var left = this.anchor1.parent.beam.isAbove() ? this.anchor1.x + this.anchor1.w : this.anchor1.x;
			xTextPos = this.anchor1.parent.beam.xAtMidpoint(left, this.anchor2.x);
		} else {
			xTextPos = this.anchor1.x + (this.anchor2.x + this.anchor2.w - this.anchor1.x) / 2;
			drawBracket(renderer, this.anchor1.x, this.startNote, this.anchor2.x + this.anchor2.w, this.endNote);
		}
		renderer.renderText(xTextPos, renderer.calcY(this.yTextPos), "" + this.number, 'tripletfont', "triplet", "middle", true);
	};

	function drawLine(renderer, l, t, r, b) {
		var pathString = sprintf("M %f %f L %f %f",
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
		//var midY = y1 + (y2-y1)/2;
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

module.exports = TripletElem;
