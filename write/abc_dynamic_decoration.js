//    abc_dynamic_decoration.js: Definition of the DynamicDecoration class.
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

ABCJS.write.DynamicDecoration = function(anchor, dec, position) {
	this.anchor = anchor;
	this.dec = dec;
	if (position === 'below')
		this.volumeHeightBelow = 5;
	else
		this.volumeHeightAbove = 5;
	this.pitch = undefined; // This will be set later
};

ABCJS.write.DynamicDecoration.prototype.setUpperAndLowerElements = function(positionY) {
	if (this.volumeHeightAbove)
		this.pitch = positionY.volumeHeightAbove;
	else
		this.pitch = positionY.volumeHeightBelow;
};

ABCJS.write.DynamicDecoration.prototype.draw = function(renderer, linestartx, lineendx) {
	if (this.pitch === undefined)
		window.console.error("Dynamic Element y-coordinate not set.");
	var scalex = 1;
	var scaley = 1;
	renderer.printSymbol(this.anchor.x, this.pitch, this.dec, scalex, scaley, renderer.addClasses('decoration'));
};

