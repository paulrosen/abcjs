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

ABCJS.write.TripletElem = function(number, anchor1, anchor2, above) {
	this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
	this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
	this.above = above;
	this.number = number;
};

ABCJS.write.TripletElem.prototype.draw = function (renderer, linestartx, lineendx) {
	// TODO end and beginning of line
	if (this.anchor1 && this.anchor2) {
		var ypos = this.above?16:-1;	// PER: Just bumped this up from 14 to make (3z2B2B2 (3B2B2z2 succeed. There's probably a better way.

		if (this.anchor1.parent.beam &&
			this.anchor1.parent.beam===this.anchor2.parent.beam) {
			var beam = this.anchor1.parent.beam;
			this.above = beam.asc;
			ypos = beam.pos;
		} else {
			this.drawLine(renderer,renderer.calcY(ypos));
		}
		var xsum = this.anchor1.x+this.anchor2.x;
		var ydelta = 0;
		if (beam) {
			if (this.above) {
				xsum += (this.anchor2.w + this.anchor1.w);
				ydelta = 4;
			} else {
				ydelta = -4;
			}
		} else {
			xsum += this.anchor2.w;
		}


		renderer.printText(xsum/2, ypos+ydelta, this.number, "middle", 'triplet').attr({"font-size":"10px", 'font-style': 'italic' });

	}
};

ABCJS.write.TripletElem.prototype.drawLine = function (renderer, y) {
	var pathString;
	var linestartx = this.anchor1.x;
	pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		linestartx, y, linestartx, y+5);
	renderer.printPath({path:pathString, stroke:"#000000", 'class': renderer.addClasses('triplet')});

	var lineendx = this.anchor2.x+this.anchor2.w;
	pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		lineendx, y, lineendx, y+5);
	renderer.printPath({path:pathString, stroke:"#000000", 'class': renderer.addClasses('triplet')});

	pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		linestartx, y, (linestartx+lineendx)/2-5, y);
	renderer.printPath({path:pathString, stroke:"#000000", 'class': renderer.addClasses('triplet')});


	pathString = ABCJS.write.sprintf("M %f %f L %f %f",
			(linestartx+lineendx)/2+5, y, lineendx, y);
	renderer.printPath({path:pathString, stroke:"#000000", 'class': renderer.addClasses('triplet')});

};
