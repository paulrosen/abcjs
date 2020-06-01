var RelativeElement = require('./abc_relative_element');
var spacing = require('./abc_spacing');

var addChord;

(function () {
	"use strict";
	addChord = function (renderer, abselem, elem, roomTaken, roomTakenRight) {
		var chordMargin = 8; // If there are chords next to each other, this is how close they can get.
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
			var dim = renderer.getTextSize(chord.name, 'annotationfont', "annotation");
			var chordWidth = dim.width;
			var chordHeight = dim.height / spacing.STEP;
			switch (chord.position) {
				case "left":
					roomTaken += chordWidth + 7;
					x = -roomTaken;        // TODO-PER: This is just a guess from trial and error
					y = elem.averagepitch;
					abselem.addExtra(new RelativeElement(chord.name, x, chordWidth + 4, y, {
						type: "text",
						height: chordHeight
					}));
					break;
				case "right":
					roomTakenRight += 4;
					x = roomTakenRight;// TODO-PER: This is just a guess from trial and error
					y = elem.averagepitch;
					abselem.addRight(new RelativeElement(chord.name, x, chordWidth + 4, y, {
						type: "text",
						height: chordHeight
					}));
					break;
				case "below":
					// setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
					abselem.addRight(new RelativeElement(chord.name, 0, 0, undefined, {
						type: "text",
						position: "below",
						height: chordHeight
					}));
					break;
				case "above":
					// setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
					abselem.addRight(new RelativeElement(chord.name, 0, 0, undefined, {
						type: "text",
						height: chordHeight
					}));
					break;
				default:
					if (chord.rel_position) {
						var relPositionY = chord.rel_position.y + 3 * spacing.STEP; // TODO-PER: this is a fudge factor to make it line up with abcm2ps
						abselem.addChild(new RelativeElement(chord.name, x + chord.rel_position.x, 0, elem.minpitch + relPositionY / spacing.STEP, {
							type: "text",
							height: chordHeight
						}));
					} else {
						// setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
						var pos2 = 'above';
						if (elem.positioning && elem.positioning.chordPosition)
							pos2 = elem.positioning.chordPosition;

						abselem.addCentered(new RelativeElement(chord.name, x, chordWidth, undefined, {
							type: "chord",
							position: pos2,
							height: chordHeight
						}));
					}
			}
		}
		return {roomTaken: roomTaken, roomTakenRight: roomTakenRight};
	};

})();

module.exports = addChord;
