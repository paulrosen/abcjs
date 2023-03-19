//    abc_absolute_element.js: Definition of the AbsoluteElement class.

var highlight = require("../../interactive/highlight");
var unhighlight = require("../../interactive/unhighlight");

// Everything that is placed in the SVG is first created as an absolute element. This is one unit of graphic information.
// That is, it embodies a concept: a clef, a time signature, a bar line,etc. or most complexly:
// a note with its accidental, grace note, chord symbol, trill, stem, eighth flags, etc.
// In the largest sense, these are placed on the page at a particular place that is determined during the layout phase.
// This object doesn't contain any of the drawing information, though. That information is contained in an array of
// RelativeElements as the "children" of this class.
// During the layout phase, the width of all the children is calculated and the X coordinate of the absolute element is set.
//
// So, after the AbsoluteElement is placed, then its children can be placed relative to that. There are different types of
// relative elements that are placed with different rules:
// 1) Fixed - these elements don't move relative to the absolute element's coordinates. These are things like the notehead,
// any ledger lines, accidentals, etc.
// 2) Slotted - these elements can move vertically and don't get Y coordinates until after the absolute element is placed.
// These are things like the chord symbol, many decorations, the lyrics, etc.
//
// Relative elements are also classified by how they are related. This could be:
// 1) Increases the absolute element's width to the left. This doesn't change the center point of
// the absolute element, so adding a sharp to the note won't move it to the right. However, if the elements
// are close together then this enforces a minimum distance.
// 2) Has no effect on the width. Annotations and the tempo act like this. No matter how long they are the width doesn't change.
// 3) Increases the absolute element's width to the right. This doesn't change the center point,
// but it will increase the minimum distance.
// 4) Sets the width on both sides. This is the note heads. They are centered on both sides of the absolute element's X coordinate.

// duration - actual musical duration - different from notehead duration in triplets. refer to abcelem to get the notehead duration
// minspacing - spacing which must be taken on top of the width defined by the duration
// type is a meta-type for the element. It is not necessary for drawing, but it is useful to make semantic sense of the element. For instance, it can be used in the element's class name.
var AbsoluteElement = function AbsoluteElement(abcelem, duration, minspacing, type, tuneNumber, options) {
	//	console.log("Absolute:",abcelem, duration, minspacing, type, tuneNumber, options);
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
	this.w = 0;
	this.right = [];
	this.invisible = false;
	this.bottom = undefined;
	this.top = undefined;
	this.type = type;

	// The following are the dimensions of the fixed part of the element.
	// That is, the chord text will be a different height depending on lot of factors, but the 8th flag will always be in the same place.
	this.fixed = { w: 0, t: undefined, b: undefined }; // there is no x-coord here, because that is set later.

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

AbsoluteElement.prototype.getFixedCoords = function () {
	return { x: this.x, w: this.fixed.w, t: this.fixed.t, b: this.fixed.b };
};

AbsoluteElement.prototype.addExtra = function (extra) {
	// used for accidentals, multi-measure rest text,
	// left-side decorations, gracenote heads,
	// left annotations, gracenote stems.
	// if (!(extra.c && extra.c.indexOf("accidentals") >= 0) &&
	// 	!(extra.c && extra.c.indexOf("arpeggio") >= 0) &&
	// 	extra.type !== "multimeasure-text" &&
	// 	!(extra.c === "noteheads.quarter" && (extra.scalex === 0.6 || extra.scalex === 0.36)) &&
	// 	!(extra.type === "stem" && extra.linewidth === -0.6) &&
	// 	extra.position !== "left"
	// )
	// 	console.log("extra", extra);

	this.fixed.w = Math.max(this.fixed.w, extra.dx + extra.w);
	if (this.fixed.t === undefined) this.fixed.t = extra.top; else this.fixed.t = Math.max(this.fixed.t, extra.top);
	if (this.fixed.b === undefined) this.fixed.b = extra.bottom; else this.fixed.b = Math.min(this.fixed.b, extra.bottom);
	if (extra.dx < this.extraw) this.extraw = extra.dx;
	this.extra[this.extra.length] = extra;
	this._addChild(extra);
};

AbsoluteElement.prototype.addHead = function (head) {
	if (head.dx < this.extraw) this.extraw = head.dx;
	this.heads[this.heads.length] = head;
	this.addRight(head);
};

AbsoluteElement.prototype.addRight = function (right) {
	// // used for clefs, note heads, bar lines, stems, key-signature accidentals, non-beamed flags, dots
	// if (!(right.c && right.c.indexOf("clefs") >= 0) &&
	// 	!(right.c && right.c.indexOf("noteheads") >= 0) &&
	// 	!(right.c && right.c.indexOf("flags") >= 0) &&
	// 	!(right.c && right.c.indexOf("rests") >= 0) &&
	// 	!(right.c && right.c.indexOf("dots.dot") >= 0) &&
	// 	right.type !== "stem" &&
	// 	right.type !== "bar" &&
	// 	right.type !== "none" && // used when an invisible anchor is needed.
	// 	!(this.type.indexOf("clef") >= -1 && right.c === "8") &&
	// 	this.type.indexOf("key-signature") === -1 &&
	// 	this.type.indexOf("time-signature") === -1 &&
	// 	!(this.abcelem && this.abcelem.rest && this.abcelem.rest.type === "spacer") &&
	// 	!(this.abcelem && this.abcelem.rest && this.abcelem.rest.type === "invisible") &&
	// 	!(right.type === "text" && right.position === "relative") &&
	// 	!(right.type === "text" && right.position === "right") &&
	// 	!(right.type === "text" && right.position === "above") &&
	// 	!(right.type === "text" && right.position === "below")
	// )
	// 	console.log("right", right);
	// These are the elements that are the fixed part.
	this.fixed.w = Math.max(this.fixed.w, right.dx + right.w);
	if (right.top !== undefined) {
		if (this.fixed.t === undefined) this.fixed.t = right.top; else this.fixed.t = Math.max(this.fixed.t, right.top);
	}
	if (right.bottom !== undefined) {
		if (this.fixed.b === undefined) this.fixed.b = right.bottom; else this.fixed.b = Math.min(this.fixed.b, right.bottom);
	}
	// if (isNaN(this.fixed.t) || isNaN(this.fixed.b))
	// 	debugger;
	if (right.dx + right.w > this.w) this.w = right.dx + right.w;
	this.right[this.right.length] = right;
	this._addChild(right);
};

AbsoluteElement.prototype.addFixed = function (elem) {
	// used for elements that can't move relative to other elements after they have been placed.
	// used for ledger lines, bar numbers, debug msgs, clef, key sigs, time sigs
	this._addChild(elem);
};

AbsoluteElement.prototype.addFixedX = function (elem) {
	// used for elements that can't move horizontally relative to other elements after they have been placed.
	// used for parts, tempo, decorations
	this._addChild(elem);
};

AbsoluteElement.prototype.addCentered = function (elem) {
	// // used for chord labels, lyrics
	// if (!(elem.type === "chord" && elem.position === "above") &&
	// 	!(elem.type === "chord" && elem.position === "below") &&
	// 	elem.type !== 'lyric'
	// )
	// 	console.log("centered", elem);
	var half = elem.w / 2;
	if (-half < this.extraw) this.extraw = -half;
	this.extra[this.extra.length] = elem;
	if (elem.dx + half > this.w) this.w = elem.dx + half;
	this.right[this.right.length] = elem;
	this._addChild(elem);
};

AbsoluteElement.prototype.setLimit = function (member, child) {
	if (!child[member]) return;
	if (!this.specialY[member])
		this.specialY[member] = child[member];
	else
		this.specialY[member] = Math.max(this.specialY[member], child[member]);
};

AbsoluteElement.prototype._addChild = function (child) {
	//	console.log("Relative:",child);
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
	for (var i = 0; i < this.children.length; i++)
		this.children[i].setX(x);
};

AbsoluteElement.prototype.center = function (before, after) {
	// Used to center whole rests
	var midpoint = (after.x - before.x) / 2 + before.x;
	this.x = midpoint - this.w / 2;
	for (var k = 0; k < this.children.length; k++)
		this.children[k].setX(this.x);
};

AbsoluteElement.prototype.setHint = function () {
	this.hint = true;
};

AbsoluteElement.prototype.highlight = function (klass, color) {
	highlight.bind(this)(klass, color);
};

AbsoluteElement.prototype.unhighlight = function (klass, color) {
	unhighlight.bind(this)(klass, color);
};

module.exports = AbsoluteElement;
