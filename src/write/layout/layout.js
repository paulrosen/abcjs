var layoutVoice = require('./voice');
var setUpperAndLowerElements = require('./setUpperAndLowerElements');
var layoutStaffGroup = require('./staffGroup');
var layout;

(function () {
	"use strict";
	layout = function (renderer, abctune, width, space) {
		var i;
		var abcLine;
		// Adjust the x-coordinates to their absolute positions
		var maxWidth = width;
		for(i=0; i<abctune.lines.length; i++) {
			abcLine = abctune.lines[i];
			if (abcLine.staff) {
				setXSpacing(renderer, width, space, abcLine.staffGroup, abctune.formatting, i === abctune.lines.length - 1, false);
				if (abcLine.staffGroup.w > maxWidth) maxWidth = abcLine.staffGroup.w;
			}
		}

		// Layout the beams and add the stems to the beamed notes.
		for(i=0; i<abctune.lines.length; i++) {
			abcLine = abctune.lines[i];
			if (abcLine.staffGroup && abcLine.staffGroup.voices) {
				for (var j = 0; j < abcLine.staffGroup.voices.length; j++)
					layoutVoice(abcLine.staffGroup.voices[j]);
				setUpperAndLowerElements(renderer, abcLine.staffGroup);
			}
		}

		// Set the staff spacing
		// TODO-PER: we should have been able to do this by the time we called setUpperAndLowerElements, but for some reason the "bottom" element seems to be set as a side effect of setting the X spacing.
		for(i=0; i<abctune.lines.length; i++) {
			abcLine = abctune.lines[i];
			if (abcLine.staffGroup) {
				abcLine.staffGroup.setHeight();
			}
		}
		return maxWidth;
	}
	// Do the x-axis positioning for a single line (a group of related staffs)
	var setXSpacing = function (renderer, width, space, staffGroup, formatting, isLastLine, debug) {
		var newspace = space;
		for (var it = 0; it < 8; it++) { // TODO-PER: shouldn't need multiple passes, but each pass gets it closer to the right spacing. (Only affects long lines: normal lines break out of this loop quickly.)
			var ret = layoutStaffGroup(newspace, renderer, debug, staffGroup);
			var stretchLast = formatting.stretchlast ? formatting.stretchlast : false;
			newspace = calcHorizontalSpacing(isLastLine, stretchLast, width+renderer.padding.left, staffGroup.w, newspace, ret.spacingUnits, ret.minSpace);
			if (debug)
				console.log("setXSpace", it, staffGroup.w, newspace, staffGroup.minspace);
			if (newspace === null) break;
		}
		centerWholeRests(staffGroup.voices);
	};

	function calcHorizontalSpacing(isLastLine, stretchLast, targetWidth, lineWidth, spacing, spacingUnits, minSpace) {
		// TODO-PER: This used to stretch the first line when it is the only line, but I'm not sure why. abcm2ps doesn't do that
		if (isLastLine && lineWidth / targetWidth < 0.66 && !stretchLast) return null; // don't stretch last line too much
		if (Math.abs(targetWidth-lineWidth) < 2) return null; // if we are already near the target width, we're done.
		var relSpace = spacingUnits * spacing;
		var constSpace = lineWidth - relSpace;
		if (spacingUnits > 0) {
			spacing = (targetWidth - constSpace) / spacingUnits;
			if (spacing * minSpace > 50) {
				spacing = 50 / minSpace;
			}
			return spacing;
		}
		return null;
	}

	function centerWholeRests(voices) {
		// whole rests are a special case: if they are by themselves in a measure, then they should be centered.
		// (If they are not by themselves, that is probably a user error, but we'll just center it between the two items to either side of it.)
		for (var i = 0; i < voices.length; i++) {
			var voice = voices[i];
			// Look through all of the elements except for the first and last. If the whole note appears there then there isn't anything to center it between anyway.
			for (var j = 1; j < voice.children.length-1; j++) {
				var absElem = voice.children[j];
				if (absElem.abcelem.rest && (absElem.abcelem.rest.type === 'whole' || absElem.abcelem.rest.type === 'multimeasure')) {
					var before = voice.children[j-1];
					var after = voice.children[j+1];
					absElem.center(before, after);
				}
			}
		}
	}
})();

module.exports = layout;
