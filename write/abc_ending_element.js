//    abc_ending_element.js: Definition of the EndingElement class.
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

ABCJS.write.EndingElem = function(text, anchor1, anchor2) {
	this.text = text; // text to be displayed top left
	this.anchor1 = anchor1; // must have a .x property or be null (means starts at the "beginning" of the line - after keysig)
	this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
};

ABCJS.write.EndingElem.prototype.draw = function (renderer, linestartx, lineendx) {
	var pathString;
	if (this.anchor1) {
		linestartx = this.anchor1.x+this.anchor1.w;
		pathString = ABCJS.write.sprintf("M %f %f L %f %f",
			linestartx, renderer.y, linestartx, renderer.y+10);
		renderer.printPath({path:pathString, stroke:"#000000", fill:"#000000", 'class': renderer.addClasses('ending')}); //TODO scale
		renderer.printText(linestartx+5*renderer.scale, 18.5, this.text, "start", 'ending').attr({"font-size":""+10*renderer.scale+"px"});
	}

	if (this.anchor2) {
		lineendx = this.anchor2.x;
		pathString = ABCJS.write.sprintf("M %f %f L %f %f",
			lineendx, renderer.y, lineendx, renderer.y+10);
		renderer.printPath({path:pathString, stroke:"#000000", fill:"#000000", 'class': renderer.addClasses('ending')}); // TODO scale
	}


	pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		linestartx, renderer.y, lineendx, renderer.y);
	renderer.printPath({path:pathString, stroke:"#000000", fill:"#000000", 'class': renderer.addClasses('ending')});  // TODO scale
};

