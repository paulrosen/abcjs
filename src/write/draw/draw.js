var drawStaffGroup = require('./staff-group');
var setPaperSize = require('./set-paper-size');
var nonMusic = require('./non-music');
var spacing = require('../abc_spacing');

function draw(renderer, classes, abcTune, width, maxWidth, responsive, scale) {
	renderer.topMargin(abcTune);
	nonMusic(renderer, abcTune.topText);
	renderer.addMusicPadding();

	var staffgroups = [];
	for (var line = 0; line < abcTune.lines.length; line++) {
		classes.incrLine();
		var abcLine = abcTune.lines[line];
		if (abcLine.staff) {
			if (abcLine.vskip) {
				renderer.moveY(abcLine.vskip);
			}
			if (staffgroups.length >= 1)
				renderer.addStaffPadding(staffgroups[staffgroups.length - 1], abcLine.staffGroup);
			staffgroups.push(engraveStaffLine(renderer, abcLine.staffGroup));
		} else if (abcLine.nonMusic) {
			nonMusic(renderer, abcLine.nonMusic);
		}
	}

	renderer.moveY(24); // TODO-PER: Empirically discovered. What variable should this be?
	renderer.engraveExtraText(width, abcTune);
	setPaperSize(renderer, maxWidth, scale, responsive);
	return staffgroups;
}

function engraveStaffLine(renderer, staffGroup) {
	drawStaffGroup(renderer, staffGroup);
	var height = staffGroup.height * spacing.STEP;
	renderer.y += height;
	return staffGroup;
}

module.exports = draw;
