var layoutVoice = require('./voice');
var setUpperAndLowerElements = require('./set-upper-and-lower-elements');
var layoutStaffGroup = require('./staff-group');
var getLeftEdgeOfStaff = require('./get-left-edge-of-staff');

var layout = function (renderer, abctune, width, space, expandToWidest) {
	var i;
	var abcLine;
	// Adjust the x-coordinates to their absolute positions
	var maxWidth = width;
	for (i = 0; i < abctune.lines.length; i++) {
		abcLine = abctune.lines[i];
		if (abcLine.staff) {
			// console.log("=== line", i)
			var thisWidth = setXSpacing(renderer, maxWidth, space, abcLine.staffGroup, abctune.formatting, i === abctune.lines.length - 1, false);
			// console.log(thisWidth, maxWidth)
			if (Math.round(thisWidth) > Math.round(maxWidth)) { // to take care of floating point weirdness
				maxWidth = thisWidth
				if (expandToWidest)
					i = -1 // do the calculations over with the new width
			}
		}
	}

	// Layout the beams and add the stems to the beamed notes.
	for (i = 0; i < abctune.lines.length; i++) {
		abcLine = abctune.lines[i];
		if (abcLine.staffGroup && abcLine.staffGroup.voices) {
			for (var j = 0; j < abcLine.staffGroup.voices.length; j++)
				layoutVoice(abcLine.staffGroup.voices[j]);
			setUpperAndLowerElements(renderer, abcLine.staffGroup);
		}
	}

	// Set the staff spacing
	// TODO-PER: we should have been able to do this by the time we called setUpperAndLowerElements, but for some reason the "bottom" element seems to be set as a side effect of setting the X spacing.
	for (i = 0; i < abctune.lines.length; i++) {
		abcLine = abctune.lines[i];
		if (abcLine.staffGroup) {
			abcLine.staffGroup.setHeight();
		}
	}
	return maxWidth;
}
// Do the x-axis positioning for a single line (a group of related staffs)
var setXSpacing = function (renderer, width, space, staffGroup, formatting, isLastLine, debug) {
	var leftEdge = getLeftEdgeOfStaff(renderer, staffGroup.getTextSize, staffGroup.voices, staffGroup.brace, staffGroup.bracket);
	var newspace = space;
	for (var it = 0; it < 8; it++) { // TODO-PER: shouldn't need multiple passes, but each pass gets it closer to the right spacing. (Only affects long lines: normal lines break out of this loop quickly.)
		// console.log("iteration", it)
		// dumpGroup("before", staffGroup)
		var ret = layoutStaffGroup(newspace, renderer, debug, staffGroup, leftEdge);
		// dumpGroup("after",staffGroup)
		newspace = calcHorizontalSpacing(isLastLine, formatting.stretchlast, width + renderer.padding.left, staffGroup.w, newspace, ret.spacingUnits, ret.minSpace, renderer.padding.left + renderer.padding.right);
		if (debug)
			console.log("setXSpace", it, staffGroup.w, newspace, staffGroup.minspace);
		if (newspace === null) break;
	}
	centerWholeRests(staffGroup.voices);
	return staffGroup.w - leftEdge
};

// function dumpGroup(label, staffGroup) {
// 	var output = {
// 		line: staffGroup.line,
// 		w: staffGroup.w,
// 		voice: {
// 			i: staffGroup.voices[0].i,
// 			minx: staffGroup.voices[0].minx,
// 			nextx: staffGroup.voices[0].nextx,
// 			spacingduration: staffGroup.voices[0].spacingduration,
// 			w: staffGroup.voices[0].w,
// 			children: [],
// 		}
// 	}
// 	for (var i = 0; i < staffGroup.voices[0].children.length; i++) {
// 		var child = staffGroup.voices[0].children[i]
// 		output.voice.children.push({ fixedW: child.fixed.w, w: child.w, x: child.x, type: child.type })
// 	}
// 	console.log(label,output)
// }

function calcHorizontalSpacing(isLastLine, stretchLast, targetWidth, lineWidth, spacing, spacingUnits, minSpace, padding) {
	if (isLastLine) {
		if (stretchLast === undefined) {
			if (lineWidth / targetWidth < 0.66) return null; // keep this for backward compatibility. The break isn't quite the same for some reason.
		} else {
			// "Stretch the last music line of a tune when it lacks less than the float fraction of the page width."
			var lack = 1 - (lineWidth + padding) / targetWidth;
			var stretch = lack < stretchLast;
			if (!stretch) return null; // don't stretch last line too much
		}
	}
	if (Math.abs(targetWidth - lineWidth) < 2) return null; // if we are already near the target width, we're done.
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
		for (var j = 1; j < voice.children.length - 1; j++) {
			var absElem = voice.children[j];
			if (absElem.abcelem.rest && (absElem.abcelem.rest.type === 'whole' || absElem.abcelem.rest.type === 'multimeasure')) {
				var before = voice.children[j - 1];
				var after = voice.children[j + 1];
				absElem.center(before, after);
			}
		}
	}
}

module.exports = layout;
