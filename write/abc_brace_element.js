//    abc_brace_element.js: Definition of the BraceElement class.
//    Copyright (C) 2010,2016 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

ABCJS.write.BraceElem = function() {
    this.length = 1;
};

ABCJS.write.BraceElem.prototype.increaseStavesIncluded = function() {
    this.length++;
};

ABCJS.write.BraceElem.prototype.setLocation = function(x) {
	this.x = x;
};

ABCJS.write.BraceElem.prototype.getWidth = function() {
	return 10; // TODO-PER: right now the drawing function doesn't vary the width at all. If it does in the future then this will change.
};

ABCJS.write.BraceElem.prototype.layout = function (renderer, top, bottom) {
    this.startY = top;
    this.endY = bottom;
};

ABCJS.write.BraceElem.prototype.draw = function (renderer, top, bottom) {
    this.layout(renderer, top, bottom);
    renderer.drawBrace(this.x,this.startY, this.endY);

};
