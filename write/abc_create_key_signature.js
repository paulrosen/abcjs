//    abc_create_key_signature.js
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

(function() {
	"use strict";

	ABCJS.write.createKeySignature = function(elem, tuneNumber) {
		if (!elem.accidentals || elem.accidentals.length === 0)
			return null;
		var abselem = new ABCJS.write.AbsoluteElement(elem, 0, 10, 'staff-extra', tuneNumber);
		var dx = 0;
		window.ABCJS.parse.each(elem.accidentals, function(acc) {
			var symbol = (acc.acc === "sharp") ? "accidentals.sharp" : (acc.acc === "natural") ? "accidentals.nat" : "accidentals.flat";
			//var notes = { 'A': 5, 'B': 6, 'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G':4, 'a': 12, 'b': 13, 'c': 7, 'd': 8, 'e': 9, 'f': 10, 'g':11 };
			abselem.addRight(new ABCJS.write.RelativeElement(symbol, dx, ABCJS.write.glyphs.getSymbolWidth(symbol), acc.verticalPos, {thickness: ABCJS.write.glyphs.symbolHeightInPitches(symbol)}));
			dx += ABCJS.write.glyphs.getSymbolWidth(symbol) + 2;
		}, this);
		return abselem;
	};
})();
