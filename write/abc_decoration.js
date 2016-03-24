// abc_decoration.js: Creates a data structure suitable for printing a line of abc
// Copyright (C) 2010-2016 Gregory Dyke (gregdyke at gmail dot com) & Paul Rosen
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

/*global window, ABCJS */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

(function() {
	"use strict";

	ABCJS.write.Decoration = function() {
		this.startDiminuendoX = undefined;
		this.startCrescendoX = undefined;
		this.minTop = 12;	// TODO-PER: this is assuming a 5-line staff. Pass that info in.
		this.minBottom = 0;
	};

	var closeDecoration = function(voice, decoration, pitch, width, abselem, roomtaken, dir, minPitch) {
		var yPos;
		for (var i=0;i<decoration.length; i++) {
			if (decoration[i]==="staccato" || decoration[i]==="tenuto" || decoration[i] === "accent") {
				var symbol = "scripts." + decoration[i];
				if (decoration[i] === "accent") symbol = "scripts.sforzato";
				if (yPos === undefined)
					yPos = (dir==="down") ? pitch+2:minPitch-2;
				else
					yPos = (dir==="down") ? yPos+2:yPos-2;
				if (decoration[i] === "accent") {
					// Always place the accent three pitches away, no matter whether that is a line or space.
					if (dir === "up") yPos--;
					else yPos++;
				} else {
					// don't place on a stave line. The stave lines are 2,4,6,8,10
					switch (yPos) {
						case 2:
						case 4:
						case 6:
						case 8:
						case 10:
							if (dir === "up") yPos--;
							else yPos++;
							break;
					}
				}
				if (pitch>9) yPos++; // take up some room of those that are above
				var deltaX = width/2;
				if (ABCJS.write.glyphs.getSymbolAlign(symbol)!=="center") {
					deltaX -= (ABCJS.write.glyphs.getSymbolWidth(symbol)/2);
				}
				abselem.addChild(new ABCJS.write.RelativeElement(symbol, deltaX, ABCJS.write.glyphs.getSymbolWidth(symbol), yPos));
			}
			if (decoration[i]==="slide" && abselem.heads[0]) {
				var yPos2 = abselem.heads[0].pitch;
				yPos2 -= 2; // TODO-PER: not sure what this fudge factor is.
				var blank1 = new ABCJS.write.RelativeElement("", -roomtaken-15, 0, yPos2-1);
				var blank2 = new ABCJS.write.RelativeElement("", -roomtaken-5, 0, yPos2+1);
				abselem.addChild(blank1);
				abselem.addChild(blank2);
				voice.addOther(new ABCJS.write.TieElem(blank1, blank2, false, false, false));
			}
		}
		if (yPos === undefined)
			yPos = pitch;

		return { above: yPos, below: abselem.bottom };
	};

	var volumeDecoration = function(voice, decoration, abselem, positioning) {
		for (var i=0;i<decoration.length; i++) {
			switch(decoration[i]) {
				case "p":
				case "mp":
				case "pp":
				case "ppp":
				case "pppp":
				case "f":
				case "ff":
				case "fff":
				case "ffff":
				case "sfz":
				case "mf":
					var elem = new ABCJS.write.DynamicDecoration(abselem, decoration[i], positioning);
					voice.addOther(elem);
			}
		}
	};

	var compoundDecoration = function(decoration, pitch, width, abselem, dir) {
		function highestPitch() {
			if (abselem.heads.length === 0)
				return 10;	// TODO-PER: I don't know if this can happen, but we'll return the top of the staff if so.
			var pitch = abselem.heads[0].pitch;
			for (var i = 1; i < abselem.heads.length; i++)
				pitch = Math.max(pitch, abselem.heads[i].pitch);
			return pitch;
		}
		function lowestPitch() {
			if (abselem.heads.length === 0)
				return 2;	// TODO-PER: I don't know if this can happen, but we'll return the bottom of the staff if so.
			var pitch = abselem.heads[0].pitch;
			for (var i = 1; i < abselem.heads.length; i++)
				pitch = Math.min(pitch, abselem.heads[i].pitch);
			return pitch;
		}
		function compoundDecoration(symbol, count) {
			var placement = (dir === 'down') ? lowestPitch()+1:highestPitch()+9;
			var deltaX = width/2;
			deltaX += (dir === 'down') ? -5 : 3;
			for (var i = 0; i < count; i++) {
				placement -= 1;
				abselem.addChild(new ABCJS.write.RelativeElement(symbol, deltaX, ABCJS.write.glyphs.getSymbolWidth(symbol), placement));
			}
		}

		for (var i=0;i<decoration.length; i++) {
			switch(decoration[i]) {
				case "/": compoundDecoration("flags.ugrace", 1); break;
				case "//": compoundDecoration("flags.ugrace", 2); break;
				case "///": compoundDecoration("flags.ugrace", 3); break;
				case "////": compoundDecoration("flags.ugrace", 4); break;
			}
		}
	};

	var stackedDecoration = function(decoration, width, abselem, yPos, positioning, minTop, minBottom) {
		function incrementPlacement(placement, height) {
			if (placement === 'above')
				yPos.above += height;
			else
				yPos.below -= height;
		}
		function getPlacement(placement) {
			var y;
			if (placement === 'above') {
				y = yPos.above;
				if (y < minTop)
					y = minTop;
			} else {
				y = yPos.below;
				if (y > minBottom)
					y = minBottom;
			}
			return y;
		}
		function textDecoration(text, placement) {
			var y = getPlacement(placement);
			var textFudge = 2;
			var textHeight = 5;
			// TODO-PER: Get the height of the current font and use that for the thickness.
			abselem.addChild(new ABCJS.write.RelativeElement(text, width/2, 0, y+textFudge, {type:"decoration", klass: 'ornament', thickness: 3}));

			incrementPlacement(placement, textHeight);
		}
		function symbolDecoration(symbol, placement) {
			var deltaX = width/2;
			if (ABCJS.write.glyphs.getSymbolAlign(symbol) !== "center") {
				deltaX -= (ABCJS.write.glyphs.getSymbolWidth(symbol) / 2);
			}
			var height = ABCJS.write.glyphs.symbolHeightInPitches(symbol) + 1; // adding a little padding so nothing touches.
			var y = getPlacement(placement);
			y = (placement === 'above') ? y + height/2 : y - height/2;// Center the element vertically.
			abselem.addChild(new ABCJS.write.RelativeElement(symbol, deltaX, ABCJS.write.glyphs.getSymbolWidth(symbol), y, { klass: 'ornament', thickness: ABCJS.write.glyphs.symbolHeightInPitches(symbol) }));

			incrementPlacement(placement, height);
		}

		var symbolList = {
			"+": "scripts.stopped",
			"open": "scripts.open",
			"snap": "scripts.snap",
			"wedge": "scripts.wedge",
			"thumb": "scripts.thumb",
			"shortphrase": "scripts.shortphrase",
			"mediumphrase": "scripts.mediumphrase",
			"longphrase": "scripts.longphrase",
			"trill": "scripts.trill",
			"roll": "scripts.roll",
			"irishroll": "scripts.roll",
			"marcato": "scripts.umarcato",
			"dmarcato": "scripts.dmarcato",
			"umarcato": "scripts.umarcato",
			"turn": "scripts.turn",
			"uppermordent": "scripts.prall",
			"pralltriller": "scripts.prall",
			"mordent": "scripts.mordent",
			"lowermordent": "scripts.mordent",
			"downbow": "scripts.downbow",
			"upbow": "scripts.upbow",
			"fermata": "scripts.ufermata",
			"invertedfermata": "scripts.dfermata",
			"breath": ",",
			"coda": "scripts.coda",
			"segno": "scripts.segno"
		};

		var hasOne = false;
		for (var i=0;i<decoration.length; i++) {
			switch(decoration[i]) {
				case "0":
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "D.C.":
				case "D.S.":
					textDecoration(decoration[i], positioning);
					hasOne = true;
					break;
				case "fine":
					textDecoration("FINE", positioning);
					hasOne = true;
					break;
				case "+":
				case "open":
				case "snap":
				case "wedge":
				case "thumb":
				case "shortphrase":
				case "mediumphrase":
				case "longphrase":
				case "trill":
				case "roll":
				case "irishroll":
				case "marcato":
				case "dmarcato":
				case "turn":
				case "uppermordent":
				case "pralltriller":
				case "mordent":
				case "lowermordent":
				case "downbow":
				case "upbow":
				case "fermata":
				case "breath":
				case "umarcato":
				case "coda":
				case "segno":
					symbolDecoration(symbolList[decoration[i]], positioning);
					hasOne = true;
					break;
				case "invertedfermata":
					symbolDecoration(symbolList[decoration[i]], 'below');
					hasOne = true;
					break;
				case "mark":
					abselem.klass = "mark";
					break;
			}
		}
		return hasOne;
	};

	ABCJS.write.Decoration.prototype.dynamicDecoration = function(voice, decoration, abselem, positioning) {
		var diminuendo;
		var crescendo;
		for (var i=0;i<decoration.length; i++) {
			switch(decoration[i]) {
				case "diminuendo(":
					this.startDiminuendoX = abselem;
					diminuendo = undefined;
					break;
				case "diminuendo)":
					diminuendo = { start: this.startDiminuendoX, stop: abselem};
					this.startDiminuendoX = undefined;
					break;
				case "crescendo(":
					this.startCrescendoX = abselem;
					crescendo = undefined;
					break;
				case "crescendo)":
					crescendo = { start: this.startCrescendoX, stop: abselem};
					this.startCrescendoX = undefined;
					break;
			}
		}
		if (diminuendo) {
			voice.addOther(new ABCJS.write.CrescendoElem(diminuendo.start, diminuendo.stop, ">", positioning));
		}
		if (crescendo) {
			voice.addOther(new ABCJS.write.CrescendoElem(crescendo.start, crescendo.stop, "<", positioning));
		}
	};

	ABCJS.write.Decoration.prototype.createDecoration = function(voice, decoration, pitch, width, abselem, roomtaken, dir, minPitch, positioning, hasVocals) {
		if (!positioning)
			positioning = { ornamentPosition: 'above', volumePosition: hasVocals ? 'above' :'below', dynamicPosition: hasVocals ? 'above' : 'below' };
		// These decorations don't affect the placement of other decorations
		volumeDecoration(voice, decoration, abselem, positioning.volumePosition);
		this.dynamicDecoration(voice, decoration, abselem, positioning.dynamicPosition);
		compoundDecoration(decoration, pitch, width, abselem, dir);

		// treat staccato, accent, and tenuto first (may need to shift other markers)
		var yPos = closeDecoration(voice, decoration, pitch, width, abselem, roomtaken, dir, minPitch);
		// yPos is an object containing 'above' and 'below'. That is the placement of the next symbol on either side.

		yPos.above = Math.max(yPos.above, this.minTop);
		var hasOne = stackedDecoration(decoration, width, abselem, yPos, positioning.ornamentPosition, this.minTop, this.minBottom);
		if (hasOne) {
//			abselem.top = Math.max(yPos.above + 3, abselem.top); // TODO-PER: Not sure why we need this fudge factor.
		}
	};

})();

