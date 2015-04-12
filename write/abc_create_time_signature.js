//    abc_create_time_signature.js
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

	ABCJS.write.createTimeSignature = function(elem) {
		var abselem = new ABCJS.write.AbsoluteElement(elem,0,10, 'staff-extra');
		if (elem.type === "specified") {
			//TODO make the alignment for time signatures centered
			for (var i = 0; i < elem.value.length; i++) {
				if (i !== 0)
					abselem.addRight(new ABCJS.write.RelativeElement('+', i*20-9, ABCJS.write.glyphs.getSymbolWidth("+"), 6, { thickness: ABCJS.write.glyphs.symbolHeightInPitches("+") }));
				if (elem.value[i].den) {
					// TODO-PER: get real widths here, also center the num and den.
					abselem.addRight(new ABCJS.write.RelativeElement(elem.value[i].num, i*20, ABCJS.write.glyphs.getSymbolWidth(elem.value[i].num.charAt(0))*elem.value[i].num.length, 8, { thickness: ABCJS.write.glyphs.symbolHeightInPitches(elem.value[i].num.charAt(0)) }));
					abselem.addRight(new ABCJS.write.RelativeElement(elem.value[i].den, i*20, ABCJS.write.glyphs.getSymbolWidth(elem.value[i].den.charAt(0))*elem.value[i].den.length, 4, { thickness: ABCJS.write.glyphs.symbolHeightInPitches(elem.value[i].den.charAt(0)) }));
				} else {
					abselem.addRight(new ABCJS.write.RelativeElement(elem.value[i].num, i*20, ABCJS.write.glyphs.getSymbolWidth(elem.value[i].num.charAt(0))*elem.value[i].num.length, 6, { thickness: ABCJS.write.glyphs.symbolHeightInPitches(elem.value[i].num.charAt(0)) }));
				}
			}
		} else if (elem.type === "common_time") {
			abselem.addRight(new ABCJS.write.RelativeElement("timesig.common", 0, ABCJS.write.glyphs.getSymbolWidth("timesig.common"), 6, { thickness: ABCJS.write.glyphs.symbolHeightInPitches("timesig.common") }));

		} else if (elem.type === "cut_time") {
			abselem.addRight(new ABCJS.write.RelativeElement("timesig.cut", 0, ABCJS.write.glyphs.getSymbolWidth("timesig.cut"), 6, { thickness: ABCJS.write.glyphs.symbolHeightInPitches("timesig.cut") }));
		}
		return abselem;
	};
})();
