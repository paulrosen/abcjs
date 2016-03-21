//    abc_crescendo_element.js: Definition of the CrescendoElem class.
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

ABCJS.write.CrescendoElem = function(anchor1, anchor2, dir, positioning) {
	this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
	this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
	this.dir = dir; // either "<" or ">"
	if (positioning === 'above')
		this.dynamicHeightAbove = 4;
	else
		this.dynamicHeightBelow = 4;
	this.pitch = undefined; // This will be set later
};

ABCJS.write.CrescendoElem.prototype.setUpperAndLowerElements = function(positionY) {
	if (this.dynamicHeightAbove)
		this.pitch = positionY.dynamicHeightAbove;
	else
		this.pitch = positionY.dynamicHeightBelow;
};

ABCJS.write.CrescendoElem.prototype.draw = function (renderer) {
	if (this.pitch === undefined)
		window.console.error("Crescendo Element y-coordinate not set.");
	var y = renderer.calcY(this.pitch) + 4; // This is the top pixel to use (it is offset a little so that it looks good with the volume marks.)
	var height = 8;
	if (this.dir === "<") {
		this.drawLine(renderer, y+height/2, y);
		this.drawLine(renderer, y+height/2, y+height);
	} else {
		this.drawLine(renderer, y, y+height/2);
		this.drawLine(renderer, y+height, y+height/2);
	}
};

ABCJS.write.CrescendoElem.prototype.drawLine = function (renderer, y1, y2) {
	// TODO-PER: This is just a quick hack to make the dynamic marks not crash if they are mismatched. See the slur treatment for the way to get the beginning and end.
	var left = this.anchor1 ? this.anchor1.x : 0;
	var right = this.anchor2 ? this.anchor2.x : 800;
	var pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		left, y1, right, y2);
	renderer.printPath({path:pathString, stroke:"#000000", 'class': renderer.addClasses('decoration')});
};
