//    abc_absolute_element.js: Definition of the AbsoluteElement class.
//    Copyright (C) 2010-2020 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

var setClass = require('./set-class');

// duration - actual musical duration - different from notehead duration in triplets. refer to abcelem to get the notehead duration
// minspacing - spacing which must be taken on top of the width defined by the duration
// type is a meta-type for the element. It is not necessary for drawing, but it is useful to make semantic sense of the element. For instance, it can be used in the element's class name.
var AbsoluteElement = function AbsoluteElement(abcelem, duration, minspacing, type, tuneNumber, options) {
	//console.log("Absolute:",abcelem, type);
	if (!options)
		options = {};
	this.tuneNumber = tuneNumber;
	this.abcelem = abcelem;
	this.duration = duration;
	this.durationClass = options.durationClassOveride ? options.durationClassOveride : this.duration;
	this.minspacing = minspacing || 0;
	this.x = 0;
	this.children = [];
	this.heads = [];
	this.extra = [];
	this.extraw = 0;
	//this.decs = [];
	this.w = 0;
	this.right = [];
	this.invisible = false;
	this.bottom = undefined;
	this.top = undefined;
	this.type = type;
	// these are the heights of all of the vertical elements that can't be placed until the end of the line.
	// the vertical order of elements that are above is: tempo, part, volume/dynamic, ending/chord, lyric
	// the vertical order of elements that are below is: lyric, chord, volume/dynamic
	this.specialY = {
		tempoHeightAbove: 0,
		partHeightAbove: 0,
		volumeHeightAbove: 0,
		dynamicHeightAbove: 0,
		endingHeightAbove: 0,
		chordHeightAbove: 0,
		lyricHeightAbove: 0,

		lyricHeightBelow: 0,
		chordHeightBelow: 0,
		volumeHeightBelow: 0,
		dynamicHeightBelow: 0
	};
};

// For each of the relative elements that can't be placed in advance (because their vertical placement depends on everything
// else on the line), this iterates through them and sets their pitch. By the time this is called, specialYResolved contains a
// hash with the vertical placement (in pitch units) for each type.
// TODO-PER: I think this needs to be separated by "above" and "below". How do we know that for dynamics at the point where they are being defined, though? We need a pass through all the relative elements to set "above" and "below".
AbsoluteElement.prototype.setUpperAndLowerElements = function(specialYResolved) {
	// specialYResolved contains the actual pitch for each of the classes of elements.
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		for (var key in this.specialY) { // for each class of element that needs to be placed vertically
			if (this.specialY.hasOwnProperty(key)) {
				if (child[key]) { // If this relative element has defined a height for this class of element
					child.pitch = specialYResolved[key];
					if (child.top === undefined) { // TODO-PER: HACK! Not sure this is the right place to do this.
						child.setUpperAndLowerElements(specialYResolved);
						this.pushTop(child.top);
						this.pushBottom(child.bottom);
					}
				}
			}
		}
	}
};

AbsoluteElement.prototype.addExtra = function (extra) {
	if (extra.dx<this.extraw) this.extraw = extra.dx;
	this.extra[this.extra.length] = extra;
	this.addChild(extra);
};

AbsoluteElement.prototype.addHead = function (head) {
	if (head.dx<this.extraw) this.extraw = head.dx;
	this.heads[this.heads.length] = head;
	this.addRight(head);
};

AbsoluteElement.prototype.addRight = function (right) {
	if (right.dx+right.w>this.w) this.w = right.dx+right.w;
	this.right[this.right.length] = right;
	this.addChild(right);
};

AbsoluteElement.prototype.addCentered = function (elem) {
	var half = elem.w/2;
	if (-half<this.extraw) this.extraw = -half;
	this.extra[this.extra.length] = elem;
	if (elem.dx+half>this.w) this.w = elem.dx+half;
	this.right[this.right.length] = elem;
	this.addChild(elem);
};

AbsoluteElement.prototype.setLimit = function(member, child) {
	if (!child[member]) return;
	if (!this.specialY[member])
		this.specialY[member] = child[member];
	else
		this.specialY[member] = Math.max(this.specialY[member], child[member]);
};

AbsoluteElement.prototype.addChild = function (child) {
	//console.log("Relative:",child);
	child.parent = this;
	this.children[this.children.length] = child;
	this.pushTop(child.top);
	this.pushBottom(child.bottom);
	this.setLimit('tempoHeightAbove', child);
	this.setLimit('partHeightAbove', child);
	this.setLimit('volumeHeightAbove', child);
	this.setLimit('dynamicHeightAbove', child);
	this.setLimit('endingHeightAbove', child);
	this.setLimit('chordHeightAbove', child);
	this.setLimit('lyricHeightAbove', child);
	this.setLimit('lyricHeightBelow', child);
	this.setLimit('chordHeightBelow', child);
	this.setLimit('volumeHeightBelow', child);
	this.setLimit('dynamicHeightBelow', child);
};

AbsoluteElement.prototype.pushTop = function (top) {
	if (top !== undefined) {
		if (this.top === undefined)
			this.top = top;
		else
			this.top = Math.max(top, this.top);
	}
};

AbsoluteElement.prototype.pushBottom = function (bottom) {
	if (bottom !== undefined) {
		if (this.bottom === undefined)
			this.bottom = bottom;
		else
			this.bottom = Math.min(bottom, this.bottom);
	}
};

AbsoluteElement.prototype.setX = function (x) {
	this.x = x;
	for (var i=0; i<this.children.length; i++)
		this.children[i].setX(x);
};

AbsoluteElement.prototype.setHint = function () {
	this.hint = true;
};

AbsoluteElement.prototype.isIE=/*@cc_on!@*/false;//IE detector

AbsoluteElement.prototype.highlight = function (klass, color) {
	if (klass === undefined)
		klass = "abcjs-note_selected";
	if (color === undefined)
		color = "#ff0000";
	setClass(this.elemset, klass, "", color);
};

AbsoluteElement.prototype.unhighlight = function (klass, color) {
	if (klass === undefined)
		klass = "abcjs-note_selected";
	if (color === undefined)
		color = "#000000";
	setClass(this.elemset, "", klass, color);
};

module.exports = AbsoluteElement;
