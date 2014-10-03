//    abc_relative_element.js: Definition of the RelativeElement class.
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

ABCJS.write.RelativeElement = function(c, dx, w, pitch, opt) {
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
	this.top = pitch;
	this.bottom = pitch;
	if (opt.stemHeight) {
		if (opt.stemHeight > 0)
			this.top += opt.stemHeight;
		else
			this.bottom += opt.stemHeight;
	}
	switch (this.type) {
		case "debug": this.hasLowest2 = 3; break;
		case "lyric": this.hasLowest1 = 3; break;
		case "chord":
		case "text": this.hasHighest2 = 3; break;
		case "part": this.hasHighest1 = 3; break;
	}
};

ABCJS.write.RelativeElement.prototype.draw = function (renderer, x, bartop) {
	if (this.pitch === undefined)
		window.console.error(this.type + " Relative Element y-coordinate not set.");
	var y = renderer.calcY(this.pitch);
	this.x = x+this.dx;
	switch(this.type) {
		case "symbol":
			if (this.c===null) return null;
			this.graphelem = renderer.printSymbol(this.x, this.pitch, this.c, this.scalex, this.scaley, renderer.addClasses('symbol')); break;
		case "debug":
			this.graphelem = renderer.renderText(this.x, renderer.calcY(15), ""+this.c, "debugfont", 'debug-msg', 'start'); break;
		case "barNumber":
			this.graphelem = renderer.renderText(this.x, y, ""+this.c, "measurefont", 'bar-number', "start");
			break;
		case "lyric":
			this.graphelem = renderer.renderText(this.x, y, this.c, "vocalfont", 'abc-lyric', "middle");
			break;
		case "chord":
			this.graphelem = renderer.renderText(this.x, y, this.c, 'gchordfont', "chord", "start");
			break;
		case "decoration":
			this.graphelem = renderer.renderText(this.x, y, this.c, 'annotationfont', "annotation", "middle");
			break;
		case "text":
			this.graphelem = renderer.renderText(this.x, y, this.c, 'annotationfont', "annotation", "start");
			break;
		case "part":
			this.graphelem = renderer.renderText(this.x, y, this.c, 'partsfont', "part", "middle");
			break;
		case "bar":
			this.graphelem = renderer.printStem(this.x, this.linewidth, y, (bartop)?bartop:renderer.calcY(this.pitch2)); break; // bartop can't be 0
		case "stem":
			this.graphelem = renderer.printStem(this.x, this.linewidth, y, renderer.calcY(this.pitch2)); break;
		case "ledger":
			this.graphelem = renderer.printStaveLine(this.x, this.x+this.w, this.pitch); break;
	}
	if (this.scalex!==1 && this.graphelem) {
		this.graphelem.scale(this.scalex, this.scaley, this.x, y);
	}
	return this.graphelem;
};
