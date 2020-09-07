//    abc_create_clef.js
//    Copyright (C) 2010-2020 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

var createClef;

(function() {
	"use strict";

	createClef = function(elem, tuneNumber) {
		var clef;
		var octave = 0;
		elem.el_type = "clef";
		var abselem = new AbsoluteElement(elem,0,10, 'staff-extra clef', tuneNumber);
		abselem.isClef = true;
		switch (elem.type) {
			case "treble": clef = "clefs.G"; break;
			case "tenor": clef="clefs.C"; break;
			case "alto": clef="clefs.C"; break;
			case "bass": clef="clefs.F"; break;
			case 'treble+8': clef = "clefs.G"; octave = 1; break;
			case 'tenor+8':clef="clefs.C"; octave = 1; break;
			case 'bass+8': clef="clefs.F"; octave = 1; break;
			case 'alto+8': clef="clefs.C"; octave = 1; break;
			case 'treble-8': clef = "clefs.G"; octave = -1; break;
			case 'tenor-8':clef="clefs.C"; octave = -1; break;
			case 'bass-8': clef="clefs.F"; octave = -1; break;
			case 'alto-8': clef="clefs.C"; octave = -1; break;
			case 'none': return null;
			case 'perc': clef="clefs.perc"; break;
			default: abselem.addFixed(new RelativeElement("clef="+elem.type, 0, 0, undefined, {type:"debug"}));
		}
		// if (elem.verticalPos) {
		// pitch = elem.verticalPos;
		// }
		var dx =5;
		if (clef) {
			var height = glyphs.symbolHeightInPitches(clef);
			var ofs = clefOffsets(clef);
			abselem.addRight(new RelativeElement(clef, dx, glyphs.getSymbolWidth(clef), elem.clefPos, { top: height+elem.clefPos+ofs, bottom: elem.clefPos+ofs}));

			if (octave !== 0) {
				var scale = 2 / 3;
				var adjustspacing = (glyphs.getSymbolWidth(clef) - glyphs.getSymbolWidth("8") * scale) / 2;
				var pitch = (octave > 0) ? abselem.top + 3 : abselem.bottom - 1;
				var top = (octave > 0) ? abselem.top + 3 : abselem.bottom - 3;
				var bottom = top-2;
				if (elem.type === "bass-8") {
					// The placement for bass octave is a little different. It should hug the clef.
					pitch = 3;
					adjustspacing = 0;
				}
				abselem.addRight(new RelativeElement("8", dx + adjustspacing, glyphs.getSymbolWidth("8") * scale, pitch, {
					scalex: scale,
					scaley: scale,
					top: top,
					bottom: bottom
				}));
				//abselem.top += 2;
			}
		}
		return abselem;
	};

	function clefOffsets(clef) {
		switch (clef) {
			case "clefs.G": return -5;
			case "clefs.C": return -4;
			case "clefs.F": return -4;
			case "clefs.perc": return -2;
			default: return 0;
		}
	}
})();

module.exports = createClef;
