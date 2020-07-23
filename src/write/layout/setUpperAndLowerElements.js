var spacing = require('../abc_spacing');

var setUpperAndLowerElements = function(renderer, staffGroup) {
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

		if (/*ABCJS.write.debugPlacement*/false) {
			staff.originalTop = staff.top; // This is just being stored for debugging purposes.
			staff.originalBottom = staff.bottom; // This is just being stored for debugging purposes.
		}

		if (staff.specialY.lyricHeightAbove) { staff.top += staff.specialY.lyricHeightAbove; positionY.lyricHeightAbove = staff.top; }
		if (staff.specialY.chordHeightAbove) { staff.top += staff.specialY.chordHeightAbove; positionY.chordHeightAbove = staff.top; }
		if (staff.specialY.endingHeightAbove) {
			if (staff.specialY.chordHeightAbove)
				staff.top += 2;
			else
				staff.top += staff.specialY.endingHeightAbove;
			positionY.endingHeightAbove = staff.top;
		}
		if (staff.specialY.dynamicHeightAbove && staff.specialY.volumeHeightAbove) {
			staff.top += Math.max(staff.specialY.dynamicHeightAbove, staff.specialY.volumeHeightAbove);
			positionY.dynamicHeightAbove = staff.top;
			positionY.volumeHeightAbove = staff.top;
		} else if (staff.specialY.dynamicHeightAbove) {
			staff.top += staff.specialY.dynamicHeightAbove; positionY.dynamicHeightAbove = staff.top;
		} else if (staff.specialY.volumeHeightAbove) { staff.top += staff.specialY.volumeHeightAbove; positionY.volumeHeightAbove = staff.top; }
		if (staff.specialY.partHeightAbove) { staff.top += staff.specialY.partHeightAbove; positionY.partHeightAbove = staff.top; }
		if (staff.specialY.tempoHeightAbove) { staff.top += staff.specialY.tempoHeightAbove; positionY.tempoHeightAbove = staff.top; }

		if (staff.specialY.lyricHeightBelow) { positionY.lyricHeightBelow = staff.bottom; staff.bottom -= staff.specialY.lyricHeightBelow; }
		if (staff.specialY.chordHeightBelow) { positionY.chordHeightBelow = staff.bottom; staff.bottom -= staff.specialY.chordHeightBelow; }
		if (staff.specialY.volumeHeightBelow && staff.specialY.dynamicHeightBelow) {
			positionY.volumeHeightBelow = staff.bottom;
			positionY.dynamicHeightBelow = staff.bottom;
			staff.bottom -= Math.max(staff.specialY.volumeHeightBelow, staff.specialY.dynamicHeightBelow);
		} else if (staff.specialY.volumeHeightBelow) {
			positionY.volumeHeightBelow = staff.bottom; staff.bottom -= staff.specialY.volumeHeightBelow;
		} else if (staff.specialY.dynamicHeightBelow) {
			positionY.dynamicHeightBelow = staff.bottom; staff.bottom -= staff.specialY.dynamicHeightBelow;
		}

		if (/*ABCJS.write.debugPlacement*/false)
			staff.positionY = positionY; // This is just being stored for debugging purposes.

		for (var j = 0; j < staff.voices.length; j++) {
			var voice = staffGroup.voices[staff.voices[j]];
			setUpperAndLowerVoiceElements(positionY, voice);
		}
		// We might need a little space in between staves if the staves haven't been pushed far enough apart by notes or extra vertical stuff.
		// Only try to put in extra space if this isn't the top staff.
		if (lastStaffBottom !== undefined) {
			var thisStaffTop = staff.top - 10;
			var forcedSpacingBetween = lastStaffBottom + thisStaffTop;
			var minSpacingInPitches = renderer.spacing.systemStaffSeparation/spacing.STEP;
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

function setUpperAndLowerVoiceElements(positionY, voice) {
	var i;
	var abselem;
	for (i = 0; i < voice.children.length; i++) {
		abselem = voice.children[i];
		setUpperAndLowerAbsoluteElements(positionY, abselem);
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
};

// For each of the relative elements that can't be placed in advance (because their vertical placement depends on everything
// else on the line), this iterates through them and sets their pitch. By the time this is called, specialYResolved contains a
// hash with the vertical placement (in pitch units) for each type.
// TODO-PER: I think this needs to be separated by "above" and "below". How do we know that for dynamics at the point where they are being defined, though? We need a pass through all the relative elements to set "above" and "below".
function setUpperAndLowerAbsoluteElements(specialYResolved, element) {
	// specialYResolved contains the actual pitch for each of the classes of elements.
	for (var i = 0; i < element.children.length; i++) {
		var child = element.children[i];
		for (var key in element.specialY) { // for each class of element that needs to be placed vertically
			if (element.specialY.hasOwnProperty(key)) {
				if (child[key]) { // If this relative element has defined a height for this class of element
					child.pitch = specialYResolved[key];
					if (child.top === undefined) { // TODO-PER: HACK! Not sure this is the right place to do this.
						child.setUpperAndLowerElements(specialYResolved);
						element.pushTop(child.top);
						element.pushBottom(child.bottom);
					}
				}
			}
		}
	}
};

function setUpperAndLowerCrescendoElements(positionY, element) {
	if (element.dynamicHeightAbove)
		element.pitch = positionY.dynamicHeightAbove;
	else
		element.pitch = positionY.dynamicHeightBelow;
};

function setUpperAndLowerDynamicElements(positionY, element) {
	if (element.volumeHeightAbove)
		element.pitch = positionY.volumeHeightAbove;
	else
		element.pitch = positionY.volumeHeightBelow;
};

function setUpperAndLowerEndingElements(positionY, element) {
	element.pitch = positionY.endingHeightAbove - 2;
};

module.exports = setUpperAndLowerElements;
