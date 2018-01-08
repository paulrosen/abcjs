//    abc_dynamic_decoration.js: Definition of the DynamicDecoration class.
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

var spacing = require('./abc_spacing');

var DynamicDecoration = function DynamicDecoration(anchor, dec, position) {
	this.anchor = anchor;
	this.dec = dec;
	if (position === 'below')
		this.volumeHeightBelow = 5;
	else
		this.volumeHeightAbove = 5;
	this.pitch = undefined; // This will be set later
};

DynamicDecoration.prototype.setUpperAndLowerElements = function(positionY) {
	if (this.volumeHeightAbove)
		this.pitch = positionY.volumeHeightAbove;
	else
		this.pitch = positionY.volumeHeightBelow;
};

DynamicDecoration.prototype.draw = function(renderer, linestartx, lineendx) {
	if (this.pitch === undefined)
		window.console.error("Dynamic Element y-coordinate not set.");
	var scalex = 1;
	var scaley = 1;
	renderer.printSymbol(this.anchor.x, this.pitch, this.dec, scalex, scaley, renderer.addClasses('decoration'));
};

module.exports = DynamicDecoration;
