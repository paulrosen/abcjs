//    abc_relative_element.js: Definition of the RelativeElement class.
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

var glyphs = require('./abc_glyphs');

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
	//if (this.type === "symbol") {
	//	var offset = glyphs.getYCorr(this.c);
	//	this.top += offset;
	//	this.bottom += offset;
	//}
	this.height = opt.height ? opt.height : 4; // The +1 is to give a little bit of padding.
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

RelativeElement.prototype.setX = function (x) {
	this.x = x+this.dx;
};

RelativeElement.prototype.setUpperAndLowerElements = function(positionY) {
	switch(this.type) {
		case "part":
			this.top = positionY.partHeightAbove + this.height;
			this.bottom = positionY.partHeightAbove;
			break;
		case "text":
		case "chord":
			if (this.chordHeightAbove) {
				this.top = positionY.chordHeightAbove;
				this.bottom = positionY.chordHeightAbove;
			} else {
				this.top = positionY.chordHeightBelow;
				this.bottom = positionY.chordHeightBelow;
			}
			break;
		case "lyric":
			if (this.lyricHeightAbove) {
				this.top = positionY.lyricHeightAbove;
				this.bottom = positionY.lyricHeightAbove;
			} else {
				this.top = positionY.lyricHeightBelow;
				this.bottom = positionY.lyricHeightBelow;
			}
			break;
		case "debug":
			this.top = positionY.chordHeightAbove;
			this.bottom = positionY.chordHeightAbove;
			break;
	}
	if (this.pitch === undefined || this.top === undefined)
		window.console.error("RelativeElement position not set.", this.type, this.pitch, this.top, positionY);
};

RelativeElement.prototype.draw = function (renderer, bartop) {
	if (this.pitch === undefined)
		window.console.error(this.type + " Relative Element y-coordinate not set.");
	var y = renderer.calcY(this.pitch);
	switch(this.type) {
		case "symbol":
			if (this.c===null) return null;
			var klass = "symbol";
			if (this.klass) klass += " " + this.klass;
			this.graphelem = renderer.printSymbol(this.x, this.pitch, this.c, this.scalex, this.scaley, renderer.addClasses(klass)); break;
		case "debug":
			this.graphelem = renderer.renderText(this.x, renderer.calcY(15), ""+this.c, "debugfont", 'debug-msg', 'start'); break;
		case "barNumber":
			this.graphelem = renderer.renderText(this.x, y, ""+this.c, "measurefont", 'bar-number', "middle");
			break;
		case "lyric":
			this.graphelem = renderer.renderText(this.x, y, this.c, "vocalfont", 'lyric', "middle");
			break;
		case "chord":
			this.graphelem = renderer.renderText(this.x, y, this.c, 'gchordfont', "chord", "middle");
			break;
		case "decoration":
			this.graphelem = renderer.renderText(this.x, y, this.c, 'annotationfont', "annotation", "middle", true);
			break;
		case "text":
			this.graphelem = renderer.renderText(this.x, y, this.c, 'annotationfont', "annotation", "start", this.centerVertically);
			break;
		case "multimeasure-text":
			this.graphelem = renderer.renderText(this.x+this.w/2, y, this.c, 'tempofont', "rest", "middle", false);
			break;
		case "part":
			this.graphelem = renderer.renderText(this.x, y, this.c, 'partsfont', "part", "start");
			break;
		case "bar":
			this.graphelem = renderer.printStem(this.x, this.linewidth, y, (bartop)?bartop:renderer.calcY(this.pitch2)); break; // bartop can't be 0
		case "stem":
			this.graphelem = renderer.printStem(this.x, this.linewidth, y, renderer.calcY(this.pitch2)); break;
		case "ledger":
			this.graphelem = renderer.printStaveLine(this.x, this.x+this.w, this.pitch); break;
	}
	if (this.scalex!==1 && this.graphelem) {
		renderer.scaleExistingElem(this.graphelem, this.scalex, this.scaley, this.x, y);
	}
	return this.graphelem;
};

module.exports = RelativeElement;
