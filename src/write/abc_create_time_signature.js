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
			var x = 0;
			for (var i = 0; i < elem.value.length; i++) {
				if (i !== 0) {
					abselem.addRight(new RelativeElement('+', x+1, glyphs.getSymbolWidth("+"), 6, {thickness: glyphs.symbolHeightInPitches("+")}));
					x += glyphs.getSymbolWidth("+")+2;
				}
				if (elem.value[i].den) {
					var numWidth = 0;
					for (var i2 = 0; i2 < elem.value[i].num.length; i2++)
						numWidth += glyphs.getSymbolWidth(elem.value[i].num.charAt(i2));
					var denWidth = 0;
					for (i2 = 0; i2 < elem.value[i].num.length; i2++)
						denWidth += glyphs.getSymbolWidth(elem.value[i].den.charAt(i2));
					var maxWidth = Math.max(numWidth, denWidth);
					abselem.addRight(new RelativeElement(elem.value[i].num, x+(maxWidth-numWidth)/2, numWidth, 8, { thickness: glyphs.symbolHeightInPitches(elem.value[i].num.charAt(0)) }));
					abselem.addRight(new RelativeElement(elem.value[i].den, x+(maxWidth-denWidth)/2, denWidth, 4, { thickness: glyphs.symbolHeightInPitches(elem.value[i].den.charAt(0)) }));
					x += maxWidth
				} else {
					var thisWidth = 0;
					for (var i3 = 0; i3 < elem.value[i].num.length; i3++)
						thisWidth += glyphs.getSymbolWidth(elem.value[i].num.charAt(i3));
					abselem.addRight(new RelativeElement(elem.value[i].num, x, thisWidth, 6, { thickness: glyphs.symbolHeightInPitches(elem.value[i].num.charAt(0)) }));
					x += thisWidth;
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
