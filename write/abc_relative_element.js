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
	this.attributes = opt.attributes; // only present on textual elements
	this.top = pitch + ((opt.extreme==="above")? 7 : 0);
	this.bottom = pitch - ((opt.extreme==="below")? 7 : 0);
};

ABCJS.write.RelativeElement.prototype.draw = function (printer, x, bartop) {
	this.x = x+this.dx;
	switch(this.type) {
		case "symbol":
			if (this.c===null) return null;
			this.graphelem = printer.printSymbol(this.x, this.pitch, this.c, this.scalex, this.scaley, 'symbol l'+printer.lineNumber); break;
		case "debug":
			this.graphelem = printer.debugMsg(this.x, this.c); break;
		case "debugLow":
			this.graphelem = printer.printLyrics(this.x, this.c); break;
		case "chord":
		case "text":
			this.graphelem = printer.printText(this.x, this.pitch, this.c);
			break;
		case "bar":
			this.graphelem = printer.printStem(this.x, this.linewidth, printer.calcY(this.pitch), (bartop)?bartop:printer.calcY(this.pitch2)); break; // bartop can't be 0
		case "stem":
			this.graphelem = printer.printStem(this.x, this.linewidth, printer.calcY(this.pitch), printer.calcY(this.pitch2)); break;
		case "ledger":
			this.graphelem = printer.printStaveLine(this.x, this.x+this.w, this.pitch); break;
	}
	if (this.scalex!==1 && this.graphelem) {
		this.graphelem.scale(this.scalex, this.scaley, this.x, printer.calcY(this.pitch));
	}
	if (this.attributes) {
		this.graphelem.attr(this.attributes);
	}
	return this.graphelem;
};
