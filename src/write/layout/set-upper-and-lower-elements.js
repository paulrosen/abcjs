var spacing = require('../helpers/spacing');

var setUpperAndLowerElements = function (renderer, staffGroup) {
	// Each staff already has the top and bottom set, now we see if there are elements that are always on top and bottom, and resolve their pitch.
	// Also, get the overall height of all the staves in this group.
	var lastStaffBottom;
	for (var i = 0; i < staffGroup.staffs.length; i++) {
		var staff = staffGroup.staffs[i];
		// the vertical order of elements that are above is: tempo, part, volume/dynamic, ending/chord, lyric
		// the vertical order of elements that are below is: lyric, chord, volume/dynamic
		var positionY = {
			tempoHeightAbove: 0,
			partHeightAbove: 0,
			volumeHeightAbove: 0,
			dynamicHeightAbove: 0,
			endingHeightAbove: 0,
			chordHeightAbove: 0,
			lyricHeightAbove: 0,

			lyricHeightBelow: 0,
			chordHeightBelow: 0,
			volumeHeightBelow: 0,
			dynamicHeightBelow: 0
		};

		if (renderer.showDebug && renderer.showDebug.indexOf("box") >= 0) {
			staff.originalTop = staff.top; // This is just being stored for debugging purposes.
			staff.originalBottom = staff.bottom; // This is just being stored for debugging purposes.
		}

		incTop(staff, positionY, 'lyricHeightAbove');
		incTop(staff, positionY, 'chordHeightAbove', staff.specialY.chordLines.above);
		if (staff.specialY.endingHeightAbove) {
			if (staff.specialY.chordHeightAbove)
				staff.top += 2;
			else
				staff.top += staff.specialY.endingHeightAbove + margin;
			positionY.endingHeightAbove = staff.top;
		}
		if (staff.specialY.dynamicHeightAbove && staff.specialY.volumeHeightAbove) {
			staff.top += Math.max(staff.specialY.dynamicHeightAbove, staff.specialY.volumeHeightAbove) + margin;
			positionY.dynamicHeightAbove = staff.top;
			positionY.volumeHeightAbove = staff.top;
		} else {
			incTop(staff, positionY, 'dynamicHeightAbove');
			incTop(staff, positionY, 'volumeHeightAbove');
		}
		incTop(staff, positionY, 'partHeightAbove');
		incTop(staff, positionY, 'tempoHeightAbove');

		if (staff.specialY.lyricHeightBelow) {
			staff.specialY.lyricHeightBelow += renderer.spacing.vocal / spacing.STEP;
			positionY.lyricHeightBelow = staff.bottom;
			staff.bottom -= (staff.specialY.lyricHeightBelow + margin);
		}
		if (staff.specialY.chordHeightBelow) {
			positionY.chordHeightBelow = staff.bottom;
			var hgt = staff.specialY.chordHeightBelow;
			if (staff.specialY.chordLines.below)
				hgt *= staff.specialY.chordLines.below;
			staff.bottom -= (hgt + margin);
		}
		if (staff.specialY.volumeHeightBelow && staff.specialY.dynamicHeightBelow) {
			positionY.volumeHeightBelow = staff.bottom;
			positionY.dynamicHeightBelow = staff.bottom;
			staff.bottom -= (Math.max(staff.specialY.volumeHeightBelow, staff.specialY.dynamicHeightBelow) + margin);
		} else if (staff.specialY.volumeHeightBelow) {
			positionY.volumeHeightBelow = staff.bottom; staff.bottom -= (staff.specialY.volumeHeightBelow + margin);
		} else if (staff.specialY.dynamicHeightBelow) {
			positionY.dynamicHeightBelow = staff.bottom; staff.bottom -= (staff.specialY.dynamicHeightBelow + margin);
		}

		if (renderer.showDebug && renderer.showDebug.indexOf("box") >= 0)
			staff.positionY = positionY; // This is just being stored for debugging purposes.

		for (var j = 0; j < staff.voices.length; j++) {
			var voice = staffGroup.voices[staff.voices[j]];
			setUpperAndLowerVoiceElements(positionY, voice, renderer.spacing);
		}
		// We might need a little space in between staves if the staves haven't been pushed far enough apart by notes or extra vertical stuff.
		// Only try to put in extra space if this isn't the top staff.
		if (lastStaffBottom !== undefined) {
			var thisStaffTop = staff.top - 10;
			var forcedSpacingBetween = lastStaffBottom + thisStaffTop;
			var minSpacingInPitches = renderer.spacing.systemStaffSeparation / spacing.STEP;
			var addedSpace = minSpacingInPitches - forcedSpacingBetween;
			if (addedSpace > 0)
				staff.top += addedSpace;
		}
		lastStaffBottom = 2 - staff.bottom; // the staff starts at position 2 and the bottom variable is negative. Therefore to find out how large the bottom is, we reverse the sign of the bottom, and add the 2 in.

		// Now we need a little margin on the top, so we'll just throw that in.
		//staff.top += 4;
		//console.log("Staff Y: ",i,heightInPitches,staff.top,staff.bottom);
	}
	//console.log("Staff Height: ",heightInPitches,this.height);
};

var margin = 1;
function incTop(staff, positionY, item, count) {
	if (staff.specialY[item]) {
		var height = staff.specialY[item];
		if (count)
			height *= count;
		staff.top += height + margin;
		positionY[item] = staff.top;
	}
}

function setUpperAndLowerVoiceElements(positionY, voice, spacing) {
	var i;
	var abselem;
	for (i = 0; i < voice.children.length; i++) {
		abselem = voice.children[i];
		setUpperAndLowerAbsoluteElements(positionY, abselem, spacing);
	}
	for (i = 0; i < voice.otherchildren.length; i++) {
		abselem = voice.otherchildren[i];
		switch (abselem.type) {
			case 'CrescendoElem':
				setUpperAndLowerCrescendoElements(positionY, abselem);
				break;
			case 'DynamicDecoration':
				setUpperAndLowerDynamicElements(positionY, abselem);
				break;
			case 'EndingElem':
				setUpperAndLowerEndingElements(positionY, abselem);
				break;
		}
	}
}

// For each of the relative elements that can't be placed in advance (because their vertical placement depends on everything
// else on the line), this iterates through them and sets their pitch. By the time this is called, specialYResolved contains a
// hash with the vertical placement (in pitch units) for each type.
// TODO-PER: I think this needs to be separated by "above" and "below". How do we know that for dynamics at the point where they are being defined, though? We need a pass through all the relative elements to set "above" and "below".
function setUpperAndLowerAbsoluteElements(specialYResolved, element, spacing) {
	// specialYResolved contains the actual pitch for each of the classes of elements.
	for (var i = 0; i < element.children.length; i++) {
		var child = element.children[i];
		for (var key in element.specialY) { // for each class of element that needs to be placed vertically
			if (element.specialY.hasOwnProperty(key)) {
				if (child[key]) { // If this relative element has defined a height for this class of element
					child.pitch = specialYResolved[key];
					if (child.top === undefined) { // TODO-PER: HACK! Not sure this is the right place to do this.
						if (child.type === 'TempoElement') {
							setUpperAndLowerTempoElement(specialYResolved, child);
						} else {
							setUpperAndLowerRelativeElements(specialYResolved, child, spacing);
						}
						element.pushTop(child.top);
						element.pushBottom(child.bottom);
					}
				}
			}
		}
	}
}

function setUpperAndLowerCrescendoElements(positionY, element) {
	if (element.dynamicHeightAbove)
		element.pitch = positionY.dynamicHeightAbove;
	else
		element.pitch = positionY.dynamicHeightBelow;
}

function setUpperAndLowerDynamicElements(positionY, element) {
	if (element.volumeHeightAbove)
		element.pitch = positionY.volumeHeightAbove;
	else
		element.pitch = positionY.volumeHeightBelow;
}

function setUpperAndLowerEndingElements(positionY, element) {
	element.pitch = positionY.endingHeightAbove - 2;
}

function setUpperAndLowerTempoElement(positionY, element) {
	element.pitch = positionY.tempoHeightAbove;
	element.top = positionY.tempoHeightAbove;
	element.bottom = positionY.tempoHeightAbove;
	if (element.note) {
		var tempoPitch = element.pitch - element.totalHeightInPitches + 1; // The pitch we receive is the top of the allotted area: change that to practically the bottom.
		element.note.top = tempoPitch;
		element.note.bottom = tempoPitch;
		for (var i = 0; i < element.note.children.length; i++) {
			var child = element.note.children[i];
			child.top += tempoPitch;
			child.bottom += tempoPitch;
			child.pitch += tempoPitch;
			if (child.pitch2 !== undefined)
				child.pitch2 += tempoPitch;
		}
	}
}

function setUpperAndLowerRelativeElements(positionY, element, renderSpacing) {
	switch (element.type) {
		case "part":
			element.top = positionY.partHeightAbove + element.height;
			element.bottom = positionY.partHeightAbove;
			break;
		case "text":
		case "chord":
			if (element.chordHeightAbove) {
				element.top = positionY.chordHeightAbove;
				element.bottom = positionY.chordHeightAbove;
			} else {
				element.top = positionY.chordHeightBelow;
				element.bottom = positionY.chordHeightBelow;
			}
			break;
		case "lyric":
			if (element.lyricHeightAbove) {
				element.top = positionY.lyricHeightAbove;
				element.bottom = positionY.lyricHeightAbove;
			} else {
				element.top = positionY.lyricHeightBelow + renderSpacing.vocal / spacing.STEP;
				element.bottom = positionY.lyricHeightBelow + renderSpacing.vocal / spacing.STEP;
				element.pitch -= renderSpacing.vocal / spacing.STEP;
			}
			break;
		case "debug":
			element.top = positionY.chordHeightAbove;
			element.bottom = positionY.chordHeightAbove;
			break;
	}
	if (element.pitch === undefined || element.top === undefined)
		console.error("RelativeElement position not set.", element.type, element.pitch, element.top, positionY);
}

module.exports = setUpperAndLowerElements;
