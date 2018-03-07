//    abc_ending_element.js: Definition of the EndingElement class.
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

var EndingElem = function EndingElem(text, anchor1, anchor2) {
	this.text = text; // text to be displayed top left
	this.anchor1 = anchor1; // must have a .x property or be null (means starts at the "beginning" of the line - after keysig)
	this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
	this.endingHeightAbove = 5;
	this.pitch = undefined; // This will be set later
};

EndingElem.prototype.setUpperAndLowerElements = function(positionY) {
	this.pitch = positionY.endingHeightAbove - 2;
};

EndingElem.prototype.draw = function (renderer, linestartx, lineendx) {
	if (this.pitch === undefined)
		window.console.error("Ending Element y-coordinate not set.");
	var y = renderer.calcY(this.pitch);
	var height = 20;
	var pathString;
	if (this.anchor1) {
		linestartx = this.anchor1.x+this.anchor1.w;
		pathString = sprintf("M %f %f L %f %f",
			linestartx, y, linestartx, y+height);
		renderer.printPath({path:pathString, stroke:"#000000", fill:"#000000", 'class': renderer.addClasses('ending')});
		renderer.renderText(linestartx+5, renderer.calcY(this.pitch-0.5), this.text, 'repeatfont', 'ending',"start");
	}

	if (this.anchor2) {
		lineendx = this.anchor2.x;
		pathString = sprintf("M %f %f L %f %f",
			lineendx, y, lineendx, y+height);
		renderer.printPath({path:pathString, stroke:"#000000", fill:"#000000", 'class': renderer.addClasses('ending')});
	}


	pathString = sprintf("M %f %f L %f %f",
		linestartx, y, lineendx, y);
	renderer.printPath({path:pathString, stroke:"#000000", fill:"#000000", 'class': renderer.addClasses('ending')});
};

module.exports = EndingElem;
