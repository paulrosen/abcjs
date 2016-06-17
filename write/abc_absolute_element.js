//    abc_absolute_element.js: Definition of the AbsoluteElement class.
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

// duration - actual musical duration - different from notehead duration in triplets. refer to abcelem to get the notehead duration
// minspacing - spacing which must be taken on top of the width defined by the duration
// type is a meta-type for the element. It is not necessary for drawing, but it is useful to make semantic sense of the element. For instance, it can be used in the element's class name.
ABCJS.write.AbsoluteElement = function(abcelem, duration, minspacing, type, tuneNumber) {
	//console.log("Absolute:",abcelem, type);
	this.tuneNumber = tuneNumber;
	this.abcelem = abcelem;
	this.duration = duration;
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
ABCJS.write.AbsoluteElement.prototype.setUpperAndLowerElements = function(specialYResolved) {
	// specialYResolved contains the actual pitch for each of the classes of elements.
	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		for (var key in this.specialY) { // for each class of element that needs to be placed vertically
			if (this.specialY.hasOwnProperty(key)) {
				if (child[key]) { // If this relative element has defined a height for this class of element
					child.pitch = specialYResolved[key];
				}
			}
		}
	}
};

ABCJS.write.AbsoluteElement.prototype.getMinWidth = function () { // absolute space taken to the right of the note
	return this.w;
};

ABCJS.write.AbsoluteElement.prototype.getExtraWidth = function () { // space needed to the left of the note
	return -this.extraw;
};

ABCJS.write.AbsoluteElement.prototype.addExtra = function (extra) {
	if (extra.dx<this.extraw) this.extraw = extra.dx;
	this.extra[this.extra.length] = extra;
	this.addChild(extra);
};

ABCJS.write.AbsoluteElement.prototype.addHead = function (head) {
	if (head.dx<this.extraw) this.extraw = head.dx;
	this.heads[this.heads.length] = head;
	this.addRight(head);
};

ABCJS.write.AbsoluteElement.prototype.addRight = function (right) {
	if (right.dx+right.w>this.w) this.w = right.dx+right.w;
	this.right[this.right.length] = right;
	this.addChild(right);
};

ABCJS.write.AbsoluteElement.prototype.addCentered = function (elem) {
	var half = elem.w/2;
	if (-half<this.extraw) this.extraw = -half;
	this.extra[this.extra.length] = elem;
	if (elem.dx+half>this.w) this.w = elem.dx+half;
	this.right[this.right.length] = elem;
	this.addChild(elem);
};

ABCJS.write.AbsoluteElement.prototype.setLimit = function(member, child) {
	if (!child[member]) return;
	if (!this.specialY[member])
		this.specialY[member] = child[member];
	else
		this.specialY[member] = Math.max(this.specialY[member], child[member]);
};

ABCJS.write.AbsoluteElement.prototype.addChild = function (child) {
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

ABCJS.write.AbsoluteElement.prototype.pushTop = function (top) {
	if (top !== undefined) {
		if (this.top === undefined)
			this.top = top;
		else
			this.top = Math.max(top, this.top);
	}
};

ABCJS.write.AbsoluteElement.prototype.pushBottom = function (bottom) {
	if (bottom !== undefined) {
		if (this.bottom === undefined)
			this.bottom = bottom;
		else
			this.bottom = Math.min(bottom, this.bottom);
	}
};

ABCJS.write.AbsoluteElement.prototype.setX = function (x) {
	this.x = x;
	for (var i=0; i<this.children.length; i++)
		this.children[i].setX(x);
};

ABCJS.write.AbsoluteElement.prototype.setHint = function () {
	this.hint = true;
};

ABCJS.write.AbsoluteElement.prototype.draw = function (renderer, bartop) {
	this.elemset = renderer.paper.set();
	if (this.invisible) return;
	renderer.beginGroup();
	for (var i=0; i<this.children.length; i++) {
		if (ABCJS.write.debugPlacement) {
			if (this.children[i].klass === 'ornament')
				renderer.printShadedBox(this.x, renderer.calcY(this.children[i].top), this.w, renderer.calcY(this.children[i].bottom)-renderer.calcY(this.children[i].top), "rgba(0,0,200,0.3)");
		}
		this.elemset.push(this.children[i].draw(renderer,bartop));
	}
	this.elemset.push(renderer.endGroup(this.type));
	if (this.klass)
		this.setClass("mark", "", "#00ff00");
	if (this.hint)
		this.setClass("abcjs-hint", "", null);
	var color = ABCJS.write.debugPlacement ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)"; // Create transparent box that encompasses the element, and not so transparent to debug it.
	var target = renderer.printShadedBox(this.x, renderer.calcY(this.top), this.w, renderer.calcY(this.bottom)-renderer.calcY(this.top), color);
	var self = this;
	var controller = renderer.controller;
//	this.elemset.mouseup(function () {
	target.mouseup(function () {
		controller.notifySelect(self, self.tuneNumber);
	});
	this.abcelem.abselem = this;

	var spacing = ABCJS.write.spacing.STEP;

	var start = function () {
			// storing original relative coordinates
			this.dy = 0;
		},
		move = function (dx, dy) {
			// move will be called with dx and dy
			dy = Math.round(dy/spacing)*spacing;
			this.translate(0, -this.dy);
			this.dy = dy;
			this.translate(0,this.dy);
		},
		up = function () {
			if (self.abcelem.pitches) {
				var delta = -Math.round(this.dy / spacing);
				self.abcelem.pitches[0].pitch += delta;
				self.abcelem.pitches[0].verticalPos += delta;
				controller.notifyChange();
			}
		};
	if (this.abcelem.el_type==="note" && controller.editable)
		this.elemset.drag(move, start, up);
};

ABCJS.write.AbsoluteElement.prototype.isIE=/*@cc_on!@*/false;//IE detector

ABCJS.write.AbsoluteElement.prototype.setClass = function (addClass, removeClass, color) {
	if (color !== null)
		this.elemset.attr({fill:color});
	if (!this.isIE) {
		for (var i = 0; i < this.elemset.length; i++) {
			if (this.elemset[i][0].setAttribute) {
				var kls = this.elemset[i][0].getAttribute("class");
				if (!kls) kls = "";
				kls = kls.replace(removeClass, "");
				kls = kls.replace(addClass, "");
				if (addClass.length > 0) {
					if (kls.length > 0 && kls.charAt(kls.length-1) !== ' ') kls += " ";
					kls += addClass;
				}
				this.elemset[i][0].setAttribute("class", kls);
			}
		}
	}
};

ABCJS.write.AbsoluteElement.prototype.highlight = function (klass, color) {
	if (klass === undefined)
		klass = "note_selected";
	if (color === undefined)
		color = "#ff0000";
	this.setClass(klass, "", color);
};

ABCJS.write.AbsoluteElement.prototype.unhighlight = function (klass, color) {
	if (klass === undefined)
		klass = "note_selected";
	if (color === undefined)
		color = "#000000";
	this.setClass("", klass, color);
};

