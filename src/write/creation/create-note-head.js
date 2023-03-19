var glyphs = require('./glyphs');
var RelativeElement = require('./elements/relative-element');

var createNoteHead = function (abselem, c, pitchelem, options) {
	if (!options) options = {};
	var dir = (options.dir !== undefined) ? options.dir : null;
	var headx = (options.headx !== undefined) ? options.headx : 0;
	var extrax = (options.extrax !== undefined) ? options.extrax : 0;
	var flag = (options.flag !== undefined) ? options.flag : null;
	var dot = (options.dot !== undefined) ? options.dot : 0;
	var dotshiftx = (options.dotshiftx !== undefined) ? options.dotshiftx : 0;
	var scale = (options.scale !== undefined) ? options.scale : 1;
	var accidentalSlot = (options.accidentalSlot !== undefined) ? options.accidentalSlot : [];
	var shouldExtendStem = (options.shouldExtendStem !== undefined) ? options.shouldExtendStem : false;
	var printAccidentals = (options.printAccidentals !== undefined) ? options.printAccidentals : true;

	// TODO scale the dot as well
	var pitch = pitchelem.verticalPos;
	var notehead;
	var accidentalshiftx = 0;
	var newDotShiftX = 0;
	var extraLeft = 0;
	if (c === undefined)
		abselem.addFixed(new RelativeElement("pitch is undefined", 0, 0, 0, { type: "debug" }));
	else if (c === "") {
		notehead = new RelativeElement(null, 0, 0, pitch);
	} else {
		var shiftheadx = headx;
		if (pitchelem.printer_shift) {
			var adjust = (pitchelem.printer_shift === "same") ? 1 : 0;
			shiftheadx = (dir === "down") ? -glyphs.getSymbolWidth(c) * scale + adjust : glyphs.getSymbolWidth(c) * scale - adjust;
		}
		var opts = { scalex: scale, scaley: scale, thickness: glyphs.symbolHeightInPitches(c) * scale, name: pitchelem.name };
		notehead = new RelativeElement(c, shiftheadx, glyphs.getSymbolWidth(c) * scale, pitch, opts);
		notehead.stemDir = dir;
		if (flag) {
			var pos = pitch + ((dir === "down") ? -7 : 7) * scale;
			// if this is a regular note, (not grace or tempo indicator) then the stem will have been stretched to the middle line if it is far from the center.
			if (shouldExtendStem) {
				if (dir === "down" && pos > 6)
					pos = 6;
				if (dir === "up" && pos < 6)
					pos = 6;
			}
			//if (scale===1 && (dir==="down")?(pos>6):(pos<6)) pos=6;
			var xdelta = (dir === "down") ? headx : headx + notehead.w - 0.6;
			abselem.addRight(new RelativeElement(flag, xdelta, glyphs.getSymbolWidth(flag) * scale, pos, { scalex: scale, scaley: scale }));
		}
		newDotShiftX = notehead.w + dotshiftx - 2 + 5 * dot;
		for (; dot > 0; dot--) {
			var dotadjusty = (1 - Math.abs(pitch) % 2); //PER: take abs value of the pitch. And the shift still happens on ledger lines.
			abselem.addRight(new RelativeElement("dots.dot", notehead.w + dotshiftx - 2 + 5 * dot, glyphs.getSymbolWidth("dots.dot"), pitch + dotadjusty));
		}
	}
	if (notehead)
		notehead.highestVert = pitchelem.highestVert;

	if (printAccidentals && pitchelem.accidental) {
		var symb;
		switch (pitchelem.accidental) {
			case "quartersharp":
				symb = "accidentals.halfsharp";
				break;
			case "dblsharp":
				symb = "accidentals.dblsharp";
				break;
			case "sharp":
				symb = "accidentals.sharp";
				break;
			case "quarterflat":
				symb = "accidentals.halfflat";
				break;
			case "flat":
				symb = "accidentals.flat";
				break;
			case "dblflat":
				symb = "accidentals.dblflat";
				break;
			case "natural":
				symb = "accidentals.nat";
		}
		// if a note is at least a sixth away, it can share a slot with another accidental
		var accSlotFound = false;
		var accPlace = extrax;
		for (var j = 0; j < accidentalSlot.length; j++) {
			if (pitch - accidentalSlot[j][0] >= 6) {
				accidentalSlot[j][0] = pitch;
				accPlace = accidentalSlot[j][1];
				accSlotFound = true;
				break;
			}
		}
		if (accSlotFound === false) {
			accPlace -= (glyphs.getSymbolWidth(symb) * scale + 2);
			accidentalSlot.push([pitch, accPlace]);
			accidentalshiftx = (glyphs.getSymbolWidth(symb) * scale + 2);
		}
		var h = glyphs.symbolHeightInPitches(symb);
		abselem.addExtra(new RelativeElement(symb, accPlace, glyphs.getSymbolWidth(symb), pitch, { scalex: scale, scaley: scale, top: pitch + h / 2, bottom: pitch - h / 2 }));
		extraLeft = glyphs.getSymbolWidth(symb) / 2; // TODO-PER: We need a little extra width if there is an accidental, but I'm not sure why it isn't the full width of the accidental.
	}

	return { notehead: notehead, accidentalshiftx: accidentalshiftx, dotshiftx: newDotShiftX, extraLeft: extraLeft };

};

module.exports = createNoteHead;
