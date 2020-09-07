//    abc_relative_element.js: Definition of the RelativeElement class.
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

var RelativeElement = function RelativeElement(c, dx, w, pitch, opt) {
	opt = opt || {};
	this.x = 0;
	this.c = c;      // character or path or string
	this.dx = dx;    // relative x position
	this.w = w;      // minimum width taken up by this element (can include gratuitous space)
	this.pitch = pitch; // relative y position by pitch
	this.scalex = opt.scalex || 1; // should the character/path be scaled?
	this.scaley = opt.scaley || 1; // should the character/path be scaled?
	this.type = opt.type || "symbol"; // cheap types.
	this.pitch2 = opt.pitch2;
	this.linewidth = opt.linewidth;
	this.klass = opt.klass;
	this.top = pitch;
	if (this.pitch2 !== undefined && this.pitch2 > this.top) this.top = this.pitch2;
	this.bottom = pitch;
	if (this.pitch2 !== undefined && this.pitch2 < this.bottom) this.bottom = this.pitch2;
	if (opt.thickness) {
		this.top += opt.thickness/2;
		this.bottom -= opt.thickness/2;
	}
	if (opt.stemHeight) {
		if (opt.stemHeight > 0)
			this.top += opt.stemHeight;
		else
			this.bottom += opt.stemHeight;
	}
	if (opt.dim)
		this.dim = opt.dim;
	if (opt.position)
		this.position = opt.position;
	this.height = opt.height ? opt.height : 4; // The +1 is to give a little bit of padding.
	if (opt.top)
		this.top = opt.top;
	if (opt.bottom)
		this.bottom = opt.bottom;
	if (opt.realWidth)
		this.realWidth = opt.realWidth;
	else
		this.realWidth = this.w;
	this.centerVertically = false;
	switch (this.type) {
		case "debug":
			this.chordHeightAbove = this.height;
			break;
		case "lyric":
			if (opt.position && opt.position === 'below')
				this.lyricHeightBelow = this.height;
			else
				this.lyricHeightAbove = this.height;
			break;
		case "chord":
			if (opt.position && opt.position === 'below')
				this.chordHeightBelow = this.height;
			else
				this.chordHeightAbove = this.height;
			break;
		case "text":
			if (this.pitch === undefined) {
				if (opt.position && opt.position === 'below')
					this.chordHeightBelow = this.height;
				else
					this.chordHeightAbove = this.height;
			} else
				this.centerVertically = true;
			break;
		case "part": this.partHeightAbove = this.height; break;
	}
};

RelativeElement.prototype.getChordDim = function () {
	if (this.type === "debug")
		return null;
	if (!this.chordHeightAbove && !this.chordHeightBelow)
		return null;
	// Chords are centered, annotations are left justified.
	// We add a little margin so that items can't touch - we use half the font size as the margin, so that is 1/4 on each side.
	// if there is only one character that we're printing, use half of that margin.
	var margin = this.dim.font.size/4;
	if (this.c.length === 1)
		margin = margin / 2;

	var offset = this.type === "chord" ? this.realWidth/2 : 0;
	var left = this.x - offset - margin;
	var right = left + this.realWidth + margin;
	return { left: left, right: right};
};

RelativeElement.prototype.invertLane = function (total) {
	if (this.lane === undefined)
		this.lane = 0;
	this.lane = total - this.lane - 1;
};

RelativeElement.prototype.putChordInLane = function (i) {
	this.lane = i;
	if (this.chordHeightAbove)
		this.chordHeightAbove = this.height*this.lane;
	else
		this.chordHeightBelow = this.height*this.lane;
};

RelativeElement.prototype.getLane = function () {
	if (this.lane === undefined)
		return 0;
	return this.lane;
};

RelativeElement.prototype.setX = function (x) {
	this.x = x+this.dx;
};

module.exports = RelativeElement;
