import RelativeElement from './abc_relative_element';
import spacing from './abc_spacing';

var addChord;

(function () {
	"use strict";
	addChord = function (getTextSize, abselem, elem, roomTaken, roomTakenRight) {
		for (var i = 0; i < elem.chord.length; i++) {
			var chord = elem.chord[i];
			var x = 0;
			var y;
			var font;
			var klass;
			if (chord.position === "left" || chord.position === "right" || chord.position === "below" || chord.position === "above") {
				font = 'annotationfont';
				klass = "annotation";
			} else {
				font = 'gchordfont';
				klass = "chord";
			}
			var attr = getTextSize.attr(font, klass);
			var dim = getTextSize.calc(chord.name, font, klass);
			var chordWidth = dim.width;
			var chordHeight = dim.height / spacing.STEP;
			switch (chord.position) {
				case "left":
					roomTaken += chordWidth + 7;
					x = -roomTaken;        // TODO-PER: This is just a guess from trial and error
					y = elem.averagepitch;
					abselem.addExtra(new RelativeElement(chord.name, x, chordWidth + 4, y, {
						type: "text",
						height: chordHeight,
						dim: attr
					}));
					break;
				case "right":
					roomTakenRight += 4;
					x = roomTakenRight;// TODO-PER: This is just a guess from trial and error
					y = elem.averagepitch;
					abselem.addRight(new RelativeElement(chord.name, x, chordWidth + 4, y, {
						type: "text",
						height: chordHeight,
						dim: attr
					}));
					break;
				case "below":
					// setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
					abselem.addRight(new RelativeElement(chord.name, 0, 0, undefined, {
						type: "text",
						position: "below",
						height: chordHeight,
						dim: attr
					}));
					break;
				case "above":
					// setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
					abselem.addRight(new RelativeElement(chord.name, 0, 0, undefined, {
						type: "text",
						height: chordHeight,
						dim: attr
					}));
					break;
				default:
					if (chord.rel_position) {
						var relPositionY = chord.rel_position.y + 3 * spacing.STEP; // TODO-PER: this is a fudge factor to make it line up with abcm2ps
						abselem.addChild(new RelativeElement(chord.name, x + chord.rel_position.x, 0, elem.minpitch + relPositionY / spacing.STEP, {
							type: "text",
							height: chordHeight,
							dim: attr
						}));
					} else {
						// setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
						var pos2 = 'above';
						if (elem.positioning && elem.positioning.chordPosition)
							pos2 = elem.positioning.chordPosition;

						abselem.addCentered(new RelativeElement(chord.name, x, chordWidth, undefined, {
							type: "chord",
							position: pos2,
							height: chordHeight,
							dim: attr
						}));
					}
			}
		}
		return {roomTaken: roomTaken, roomTakenRight: roomTakenRight};
	};

})();

export default addChord;
