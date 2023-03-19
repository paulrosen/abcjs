//    abc_create_key_signature.js

var AbsoluteElement = require('./elements/absolute-element');
var glyphs = require('./glyphs');
var RelativeElement = require('./elements/relative-element');

var createKeySignature = function (elem, tuneNumber) {
	elem.el_type = "keySignature";
	if (!elem.accidentals || elem.accidentals.length === 0)
		return null;
	var abselem = new AbsoluteElement(elem, 0, 10, 'staff-extra key-signature', tuneNumber);
	abselem.isKeySig = true;
	var dx = 0;
	elem.accidentals.forEach(function (acc) {
		var symbol;
		var fudge = 0;
		switch (acc.acc) {
			case "sharp": symbol = "accidentals.sharp"; fudge = -3; break;
			case "natural": symbol = "accidentals.nat"; break;
			case "flat": symbol = "accidentals.flat"; fudge = -1.2; break;
			case "quartersharp": symbol = "accidentals.halfsharp"; fudge = -2.5; break;
			case "quarterflat": symbol = "accidentals.halfflat"; fudge = -1.2; break;
			default: symbol = "accidentals.flat";
		}
		abselem.addRight(new RelativeElement(symbol, dx, glyphs.getSymbolWidth(symbol), acc.verticalPos, { thickness: glyphs.symbolHeightInPitches(symbol), top: acc.verticalPos + glyphs.symbolHeightInPitches(symbol) + fudge, bottom: acc.verticalPos + fudge }));
		dx += glyphs.getSymbolWidth(symbol) + 2;
	}, this);
	return abselem;
};

module.exports = createKeySignature;
