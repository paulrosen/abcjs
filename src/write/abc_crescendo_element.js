//    abc_crescendo_element.js: Definition of the CrescendoElem class.
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

var sprintf = require('./sprintf');

var CrescendoElem = function CrescendoElem(anchor1, anchor2, dir, positioning) {
	this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
	this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
	this.dir = dir; // either "<" or ">"
	if (positioning === 'above')
		this.dynamicHeightAbove = 4;
	else
		this.dynamicHeightBelow = 4;
	this.pitch = undefined; // This will be set later
};

CrescendoElem.prototype.setUpperAndLowerElements = function(positionY) {
	if (this.dynamicHeightAbove)
		this.pitch = positionY.dynamicHeightAbove;
	else
		this.pitch = positionY.dynamicHeightBelow;
};

CrescendoElem.prototype.draw = function (renderer) {
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

CrescendoElem.prototype.drawLine = function (renderer, y1, y2) {
	// TODO-PER: This is just a quick hack to make the dynamic marks not crash if they are mismatched. See the slur treatment for the way to get the beginning and end.
	var left = this.anchor1 ? this.anchor1.x : 0;
	var right = this.anchor2 ? this.anchor2.x : 800;
	var pathString = sprintf("M %f %f L %f %f",
		left, y1, right, y2);
	renderer.printPath({path:pathString, stroke:"#000000", 'class': renderer.addClasses('decoration')});
};

module.exports = CrescendoElem;
