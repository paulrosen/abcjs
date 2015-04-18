//    abc_create_clef.js
//    Copyright (C) 2010,2015 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

	ABCJS.write.createClef = function(elem) {
		var clef;
		var octave = 0;
		var abselem = new ABCJS.write.AbsoluteElement(elem,0,10, 'staff-extra');
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
			default: abselem.addChild(new ABCJS.write.RelativeElement("clef="+elem.type, 0, 0, undefined, {type:"debug"}));
		}
		// if (elem.verticalPos) {
		// pitch = elem.verticalPos;
		// }
		var dx =5;
		if (clef) {
			abselem.addRight(new ABCJS.write.RelativeElement(clef, dx, ABCJS.write.glyphs.getSymbolWidth(clef), elem.clefPos));

			if (clef === 'clefs.G') {
				abselem.top = 13;
				abselem.bottom = -1;
			} else {
				abselem.top = 10;
				abselem.bottom = 2;
			}
			if (octave !== 0) {
				var scale = 2 / 3;
				var adjustspacing = (ABCJS.write.glyphs.getSymbolWidth(clef) - ABCJS.write.glyphs.getSymbolWidth("8") * scale) / 2;
				abselem.addRight(new ABCJS.write.RelativeElement("8", dx + adjustspacing, ABCJS.write.glyphs.getSymbolWidth("8") * scale, (octave > 0) ? abselem.top + 3 : abselem.bottom - 1, {
					scalex: scale,
					scaley: scale
				}));
				abselem.top += 2;
			}
		}
		return abselem;
	};

})();
