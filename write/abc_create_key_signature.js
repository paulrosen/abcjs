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

var AbsoluteElement = require('./abc_absolute_element');
var glyphs = require('./abc_glyphs');
var RelativeElement = require('./abc_relative_element');

var parseCommon = require('../parse/abc_common');

var createKeySignature;

(function() {
	"use strict";

	createKeySignature = function(elem, tuneNumber) {
		if (!elem.accidentals || elem.accidentals.length === 0)
			return null;
		var abselem = new AbsoluteElement(elem, 0, 10, 'staff-extra', tuneNumber);
		var dx = 0;
		parseCommon.each(elem.accidentals, function(acc) {
			var symbol = (acc.acc === "sharp") ? "accidentals.sharp" : (acc.acc === "natural") ? "accidentals.nat" : "accidentals.flat";
			//var notes = { 'A': 5, 'B': 6, 'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G':4, 'a': 12, 'b': 13, 'c': 7, 'd': 8, 'e': 9, 'f': 10, 'g':11 };
			abselem.addRight(new RelativeElement(symbol, dx, glyphs.getSymbolWidth(symbol), acc.verticalPos, {thickness: glyphs.symbolHeightInPitches(symbol)}));
			dx += glyphs.getSymbolWidth(symbol) + 2;
		}, this);
		return abselem;
	};
})();

module.exports = createKeySignature;
