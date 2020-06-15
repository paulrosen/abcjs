var drawStaffGroup = require('./staff-group');
var drawSeparator = require('./separator');
var setPaperSize = require('./set-paper-size');
var spacing = require('../abc_spacing');

function draw(renderer, classes, abcTune, width, maxWidth, responsive, scale) {
	renderer.topMargin(abcTune);
	renderer.engraveTopText(width, abcTune);
	renderer.addMusicPadding();

	var staffgroups = [];
	for (var line = 0; line < abcTune.lines.length; line++) {
		classes.incrLine();
		var abcLine = abcTune.lines[line];
		if (abcLine.staff) {
			staffgroups.push(engraveStaffLine(renderer, abcLine.staffGroup));
			if (staffgroups.length > 1)
				renderer.addStaffPadding(staffgroups[staffgroups.length-2], staffgroups[staffgroups.length-1]);
		} else if (abcLine.subtitle && line !== 0) {
			renderer.outputSubtitle(width, abcLine.subtitle);
		} else if (abcLine.text !== undefined) {
			renderer.outputFreeText(abcLine.text, abcLine.vskip);
		} else if (abcLine.separator !== undefined && abcLine.separator.lineLength) {
			renderer.moveY(abcLine.separator.spaceAbove);
			drawSeparator(renderer, abcLine.separator.lineLength);
			renderer.moveY(abcLine.separator.spaceBelow);
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
