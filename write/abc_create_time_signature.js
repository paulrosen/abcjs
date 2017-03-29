//    abc_create_time_signature.js
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

var createTimeSignature;

(function() {
	"use strict";

	createTimeSignature = function(elem, tuneNumber) {
		var abselem = new AbsoluteElement(elem,0,10, 'staff-extra', tuneNumber);
		if (elem.type === "specified") {
			//TODO make the alignment for time signatures centered
			for (var i = 0; i < elem.value.length; i++) {
				if (i !== 0)
					abselem.addRight(new RelativeElement('+', i*20-9, glyphs.getSymbolWidth("+"), 6, { thickness: glyphs.symbolHeightInPitches("+") }));
				if (elem.value[i].den) {
					// TODO-PER: get real widths here, also center the num and den.
					abselem.addRight(new RelativeElement(elem.value[i].num, i*20, glyphs.getSymbolWidth(elem.value[i].num.charAt(0))*elem.value[i].num.length, 8, { thickness: glyphs.symbolHeightInPitches(elem.value[i].num.charAt(0)) }));
					abselem.addRight(new RelativeElement(elem.value[i].den, i*20, glyphs.getSymbolWidth(elem.value[i].den.charAt(0))*elem.value[i].den.length, 4, { thickness: glyphs.symbolHeightInPitches(elem.value[i].den.charAt(0)) }));
				} else {
					abselem.addRight(new RelativeElement(elem.value[i].num, i*20, glyphs.getSymbolWidth(elem.value[i].num.charAt(0))*elem.value[i].num.length, 6, { thickness: glyphs.symbolHeightInPitches(elem.value[i].num.charAt(0)) }));
				}
			}
		} else if (elem.type === "common_time") {
			abselem.addRight(new RelativeElement("timesig.common", 0, glyphs.getSymbolWidth("timesig.common"), 6, { thickness: glyphs.symbolHeightInPitches("timesig.common") }));

		} else if (elem.type === "cut_time") {
			abselem.addRight(new RelativeElement("timesig.cut", 0, glyphs.getSymbolWidth("timesig.cut"), 6, { thickness: glyphs.symbolHeightInPitches("timesig.cut") }));
		}
		return abselem;
	};
})();

module.exports = createTimeSignature;
