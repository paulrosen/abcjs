//    abc_create_clef.js

var AbsoluteElement = require('./abc_absolute_element');
var glyphs = require('./abc_glyphs');
var RelativeElement = require('./abc_relative_element');
const spacing = require("./abc_spacing");

var createClef = function(elem, tuneNumber, getTextSize) {
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
			case 'TAB': clef="tab.tiny"; break;
			default: abselem.addFixed(new RelativeElement("clef="+elem.type, 0, 0, undefined, {type:"debug"}));
		}
		if (elem.label) {
			var dim = getTextSize.calc(elem.label, 'tablabelfont', "tab-label");
			abselem.addFixed(new RelativeElement(elem.label, 10, 0, 1.5, {type:"label"}));
			abselem.bottom -= dim.height / spacing.STEP
		}
		// if (elem.verticalPos) {
		// pitch = elem.verticalPos;
		// }
		var dx =5;
		if (clef) {
			var height = glyphs.symbolHeightInPitches(clef);
			var ofs = clefOffsets(clef);
			var opt = { top: height+elem.clefPos+ofs, bottom: elem.clefPos+ofs}
			if (clef === 'tab.tiny' && elem.stafflines) {
				var staffHeight = (elem.stafflines-1)*2
				opt.top = staffHeight + 2
				opt.bottom = 2
				opt.scalex = Math.min(1.8,staffHeight / height)
				opt.scaley = Math.min(1.8,staffHeight / height)
			}
			abselem.addRight(new RelativeElement(clef, dx, glyphs.getSymbolWidth(clef), elem.clefPos, opt));

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

module.exports = createClef;
