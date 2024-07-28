/* eslint-disable no-debugger */
var VoiceElement = require('../../write/creation/elements/voice-element');
var TabAbsoluteElements = require('./tab-absolute-elements');
var spacing = require('../../write/helpers/spacing');

function initSpecialY() {
	return {
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
}

function getLyricHeight(voice) {
	var maxLyricHeight = 0;
	for (var ii = 0; ii < voice.children.length; ii++) {
		var curAbs = voice.children[ii];
		if (curAbs.specialY) {
			if (curAbs.specialY.lyricHeightBelow > maxLyricHeight) {
				maxLyricHeight = curAbs.specialY.lyricHeightBelow;
			}
		}
	}
	return maxLyricHeight; // add spacing
}

function buildTabName(plugin, renderer, dest) {
	var stringSemantics = plugin.semantics;
	var textSize = renderer.controller.getTextSize;
	var tabName = stringSemantics.tabInfos(plugin);
	var suppress = stringSemantics.suppress(plugin);
	var doDraw = true;

	if (suppress) {
		doDraw = false
	}


	if (doDraw) {
		var size = textSize.calc(tabName, 'tablabelfont', 'text instrumentname');
		dest.tabNameInfos = {
			textSize: { height: size.height, width: size.width },
			name: tabName
		};
		return size.height;
	}
	return 0

}

function islastTabInStaff(index, staffGroup) {
	if (staffGroup[index].isTabStaff) {
		if (index === staffGroup.length - 1) return true;
		if (staffGroup[index + 1].isTabStaff) {
			return false;
		} else {
			return true;
		}
	}
	return false;
}

function getStaffNumbers(staffs) {
	var nbStaffs = 0;
	for (var ii = 0; ii < staffs.length; ii++) {
		if (!staffs[ii].isTabStaff) {
			nbStaffs++;
		}
	}
	return nbStaffs;
}

function getParentStaffIndex(staffs, index) {
	for (var ii = index; ii >= 0; ii--) {
		if (!staffs[ii].isTabStaff) {
			return ii;
		}
	}
	return -1;
}


function linkStaffAndTabs(staffs) {
	for (var ii = 0; ii < staffs.length; ii++) {
		if (staffs[ii].isTabStaff) {
			// link to parent staff
			var parentIndex = getParentStaffIndex(staffs, ii);
			staffs[ii].hasStaff = staffs[parentIndex];
			if (!staffs[parentIndex].hasTab) staffs[parentIndex].hasTab = [];
			staffs[parentIndex].hasTab.push(staffs[ii]);
		}
	}
}

function isMultiVoiceSingleStaff(staffs, parent) {
	if (getStaffNumbers(staffs) === 1) {
		if (parent.voices.length > 1) return true;
	}
	return false;
}


function getNextTabPos(tabIndex, staffGroup) {
	var startIndex = 0;
	var handledVoices = 0;
	var inProgress = true;
	var nbVoices = 0;
	while (inProgress) {
		//for (var ii = 0; ii < staffGroup.length; ii++) {
		if (!staffGroup[startIndex])
			return -1;
		if (!staffGroup[startIndex].isTabStaff) {
			nbVoices = staffGroup[startIndex].voices.length; // get number of staff voices
		}
		if (staffGroup[startIndex].isTabStaff) {
			handledVoices++;
			if (islastTabInStaff(startIndex, staffGroup)) {
				if (handledVoices < nbVoices) return startIndex + 1;
			}
		} else {
			handledVoices = 0;
			if (startIndex >= tabIndex) {
				if (startIndex + 1 == staffGroup.length) return startIndex + 1;
				if (!staffGroup[startIndex + 1].isTabStaff) return startIndex + 1;
			}
		}
		startIndex++;
		// out of space case
		if (startIndex > staffGroup.length) return -1;
	}
}

function getLastStaff(staffs, lastTab) {
	for (var ii = lastTab; ii >= 0; ii--) {
		if (!staffs[ii].isTabStaff) {
			return staffs[ii];
		}
	}
	return null;
}

function checkVoiceKeySig(voices, ii) {
	var curVoice = voices[ii];
	// on multivoice multistaff only the first voice has key signature
	// folling consecutive do not have one => we should provide the first voice key sig back then
	var elem0 = curVoice.children[0].abcelem;
	if (elem0.el_type === 'clef') return null;
	if (ii == 0) {
		// not found => clef=none case
		return 'none';
	}
	return voices[ii - 1].children[0];
}

function tabRenderer(plugin, renderer, line, staffIndex) {
	//console.log("RENDER tabRenderer")
	var absolutes = new TabAbsoluteElements();
	var tabStaff = {
		clef: {
			type: 'TAB'
		}
	};
	var tabSize = (plugin.linePitch * plugin.nbLines);
	var staffs = line.staff;
	if (staffs) {
		// give up on staffline=0 in key 
		var firstStaff = staffs[0];
		if (firstStaff) {
			if (firstStaff.clef) {
				if (firstStaff.clef.stafflines == 0) {
					plugin.setError("No tablatures when stafflines=0");
					return;
				}
			}
		}
		staffs.splice(
			staffs.length, 0,
			tabStaff
		);
	}
	var staffGroup = line.staffGroup;

	var voices = staffGroup.voices;
	var firstVoice = voices[0];
	// take lyrics into account if any
	var lyricsHeight = getLyricHeight(firstVoice);
	var padd = 3;
	var prevIndex = staffIndex;
	var previousStaff = staffGroup.staffs[prevIndex];
	var tabTop = tabSize + padd - previousStaff.bottom - lyricsHeight;
	if (previousStaff.isTabStaff) {
		tabTop = previousStaff.top;
	}
	var staffGroupInfos = {
		bottom: -1,
		isTabStaff: true,
		specialY: initSpecialY(),
		lines: plugin.nbLines,
		linePitch: plugin.linePitch,
		dy: 0.15,
		top: tabTop,
	};
	var nextTabPos = getNextTabPos(staffIndex, staffGroup.staffs);
	if (nextTabPos === -1)
		return;
	staffGroupInfos.parentIndex = nextTabPos - 1;
	staffGroup.staffs.splice(nextTabPos, 0, staffGroupInfos);
	// staffGroup.staffs.push(staffGroupInfos);
	staffGroup.height += tabSize + padd;
	var parentStaff = getLastStaff(staffGroup.staffs, nextTabPos);
	var nbVoices = 1;
	if (isMultiVoiceSingleStaff(staffGroup.staffs, parentStaff)) {
		nbVoices = parentStaff.voices.length;
	}
	// build from staff
	tabStaff.voices = [];
	for (var ii = 0; ii < nbVoices; ii++) {
		var tabVoice = new VoiceElement(0, 0);
		if (ii > 0) tabVoice.duplicate = true;
		var nameHeight = buildTabName(plugin, renderer, tabVoice) / spacing.STEP;
		nameHeight = Math.max(nameHeight, 1) // If there is no label for the tab line, then there needs to be a little padding
		// This was pushing down the top staff by the tab label height
		//staffGroup.staffs[staffIndex].top += nameHeight;
		staffGroup.staffs[staffIndex].top += 1;
		staffGroup.height += nameHeight;
		tabVoice.staff = staffGroupInfos;
		var tabVoiceIndex = voices.length
		voices.splice(voices.length, 0, tabVoice);
		var keySig = checkVoiceKeySig(voices, ii + staffIndex);
		tabStaff.voices[ii] = [];
		absolutes.build(plugin, voices, tabStaff.voices[ii], ii, staffIndex, keySig, tabVoiceIndex);
	}
	linkStaffAndTabs(staffGroup.staffs); // crossreference tabs and staff
}

module.exports = tabRenderer;
