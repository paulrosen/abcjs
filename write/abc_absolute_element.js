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
ABCJS.write.AbsoluteElement = function(abcelem, duration, minspacing) {
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
	this.bottom = 7;
	this.top = 7;
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

ABCJS.write.AbsoluteElement.prototype.addChild = function (child) {
	child.parent = this;
	this.children[this.children.length] = child;
	this.pushTop(child.top);
	this.pushBottom(child.bottom);
};

ABCJS.write.AbsoluteElement.prototype.pushTop = function (top) {
	this.top = Math.max(top, this.top);
};

ABCJS.write.AbsoluteElement.prototype.pushBottom = function (bottom) {
	this.bottom = Math.min(bottom, this.bottom);
};

ABCJS.write.AbsoluteElement.prototype.draw = function (printer, bartop) {
	this.elemset = printer.paper.set();
	if (this.invisible) return;
	printer.beginGroup();
	for (var i=0; i<this.children.length; i++) {
		this.elemset.push(this.children[i].draw(printer,this.x, bartop));
	}
	this.elemset.push(printer.endGroup());
	if (this.klass)
		this.setClass("mark", "", "#00ff00");
	var self = this;
	this.elemset.mouseup(function () {
		printer.notifySelect(self);
	});
	this.abcelem.abselem = this;

	var spacing = ABCJS.write.spacing.STEP*printer.scale;

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
			var delta = -Math.round(this.dy/spacing);
			self.abcelem.pitches[0].pitch += delta;
			self.abcelem.pitches[0].verticalPos += delta;
			printer.notifyChange();
		};
	if (this.abcelem.el_type==="note" && printer.editable)
		this.elemset.drag(move, start, up);
};

ABCJS.write.AbsoluteElement.prototype.isIE=/*@cc_on!@*/false;//IE detector

ABCJS.write.AbsoluteElement.prototype.setClass = function (addClass, removeClass, color) {
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

ABCJS.write.AbsoluteElement.prototype.highlight = function () {
	this.setClass("note_selected", "", "#ff0000");
};

ABCJS.write.AbsoluteElement.prototype.unhighlight = function () {
	this.setClass("", "note_selected", "#000000");
};

