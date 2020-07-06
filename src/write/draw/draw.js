var drawStaffGroup = require('./staff-group');
var setPaperSize = require('./set-paper-size');
var nonMusic = require('./non-music');
var spacing = require('../abc_spacing');

function draw(renderer, classes, abcTune, width, maxWidth, responsive, scale) {
	renderer.moveY(renderer.padding.top);
	nonMusic(renderer, abcTune.topText);
	renderer.moveY(renderer.spacing.music);

	var staffgroups = [];
	for (var line = 0; line < abcTune.lines.length; line++) {
		classes.incrLine();
		var abcLine = abcTune.lines[line];
		if (abcLine.staff) {
			if (abcLine.vskip) {
				renderer.moveY(abcLine.vskip);
			}
			if (staffgroups.length >= 1)
				addStaffPadding(renderer, renderer.spacing.staffSeparation, staffgroups[staffgroups.length - 1], abcLine.staffGroup);
			staffgroups.push(engraveStaffLine(renderer, abcLine.staffGroup));
		} else if (abcLine.nonMusic) {
			nonMusic(renderer, abcLine.nonMusic);
		}
	}

	renderer.moveY(24); // TODO-PER: Empirically discovered. What variable should this be?
	nonMusic(renderer, abcTune.bottomText);
	setPaperSize(renderer, maxWidth, scale, responsive);
	return staffgroups;
}

function engraveStaffLine(renderer, staffGroup) {
	drawStaffGroup(renderer, staffGroup);
	var height = staffGroup.height * spacing.STEP;
	renderer.y += height;
	return staffGroup;
}

function addStaffPadding(renderer, staffSeparation, lastStaffGroup, thisStaffGroup) {
	var lastStaff = lastStaffGroup.staffs[lastStaffGroup.staffs.length-1];
	var lastBottomLine = -(lastStaff.bottom - 2); // The 2 is because the scale goes to 2 below the last line.
	var nextTopLine = thisStaffGroup.staffs[0].top - 10; // Because 10 represents the top line.
	var naturalSeparation = nextTopLine + lastBottomLine; // This is how far apart they'd be without extra spacing
	var separationInPixels = naturalSeparation * spacing.STEP;
	if (separationInPixels < staffSeparation)
		renderer.moveY(staffSeparation-separationInPixels);
}

module.exports = draw;
