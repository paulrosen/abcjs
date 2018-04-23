//    abc_create_time_signature.js
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
		} else if (elem.type === "tempus_imperfectum") {
			abselem.addRight(new RelativeElement("timesig.imperfectum", 0, glyphs.getSymbolWidth("timesig.imperfectum"), 6, { thickness: glyphs.symbolHeightInPitches("timesig.imperfectum") }));
		} else if (elem.type === "tempus_imperfectum_prolatio") {
			abselem.addRight(new RelativeElement("timesig.imperfectum2", 0, glyphs.getSymbolWidth("timesig.imperfectum2"), 6, { thickness: glyphs.symbolHeightInPitches("timesig.imperfectum2") }));
		} else if (elem.type === "tempus_perfectum") {
			abselem.addRight(new RelativeElement("timesig.perfectum", 0, glyphs.getSymbolWidth("timesig.perfectum"), 6, { thickness: glyphs.symbolHeightInPitches("timesig.perfectum") }));
		} else if (elem.type === "tempus_perfectum_prolatio") {
			abselem.addRight(new RelativeElement("timesig.perfectum2", 0, glyphs.getSymbolWidth("timesig.perfectum2"), 6, { thickness: glyphs.symbolHeightInPitches("timesig.perfectum2") }));
		} else {
			console.log("time signature:",elem);
		}
		return abselem;
	};
})();

module.exports = createTimeSignature;
