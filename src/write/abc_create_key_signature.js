//    abc_create_key_signature.js
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
		abselem.isKeySig = true;
		var dx = 0;
		parseCommon.each(elem.accidentals, function(acc) {
			var symbol;
			switch(acc.acc) {
				case "sharp": symbol = "accidentals.sharp"; break;
				case "natural": symbol = "accidentals.nat"; break;
				case "flat": symbol = "accidentals.flat"; break;
				case "quartersharp": symbol = "accidentals.halfsharp"; break;
				case "quarterflat": symbol = "accidentals.halfflat"; break;
				default: symbol = "accidentals.flat";
			}
			abselem.addRight(new RelativeElement(symbol, dx, glyphs.getSymbolWidth(symbol), acc.verticalPos, {thickness: glyphs.symbolHeightInPitches(symbol)}));
			dx += glyphs.getSymbolWidth(symbol) + 2;
		}, this);
		return abselem;
	};
})();

module.exports = createKeySignature;
