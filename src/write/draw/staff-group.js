var spacing = require('../abc_spacing');
var drawBrace = require('./brace');
var drawVoice = require('./voice');
var printStaff = require('./staff');
var printDebugBox = require('./debug-box');
var printStem = require('./print-stem');

function drawStaffGroup(renderer, params) {
	// We enter this method with renderer.y pointing to the topmost coordinate that we're allowed to draw.
	// All of the children that will be drawn have a relative "pitch" set, where zero is the first ledger line below the staff.
	// renderer.y will be offset at the beginning of each staff by the amount required to make the relative pitch work.
	// If there are multiple staves, then renderer.y will be incremented for each new staff.

	var debugPrint;
	var colorIndex;
	if (/*ABCJS.write.debugPlacement*/false) {
		var colors = [ "rgb(207,27,36)", "rgb(168,214,80)", "rgb(110,161,224)", "rgb(191,119,218)", "rgb(195,30,151)",
			"rgb(31,170,177)", "rgb(220,166,142)" ];
		debugPrint = function(staff, key) {
			if (staff.positionY[key]) {
				//renderer.printHorizontalLine(50, renderer.calcY(staff.positionY[key]), key.substr(0, 4) + " " + Math.round(staff.positionY[key]));
				var height = staff.specialY[key] * spacing.STEP;
				printDebugBox(renderer.padding.left, renderer.calcY(staff.positionY[key]), renderer.controller.width, height,colors[colorIndex], 0.4, key.substr(0, 4));
				colorIndex += 1; if (colorIndex > 6) colorIndex = 0;
			}
		};
	}

	// An invisible marker is useful to be able to find where each system starts.
	addInvisibleMarker(renderer,"abcjs-top-of-system");

	var startY = renderer.y; // So that it can be restored after we're done.
	// Set the absolute Y position for each staff here, so the voice drawing below can just use if.
	for (var j = 0; j < params.staffs.length; j++) {
		var staff1 = params.staffs[j];
		//renderer.printHorizontalLine(50, renderer.y, "start");
		renderer.moveY(spacing.STEP, staff1.top);
		staff1.absoluteY = renderer.y;
		if (/*ABCJS.write.debugPlacement*/false) {
			colorIndex = 0;
			printDebugBox(renderer.padding.left, renderer.calcY(staff1.originalTop), renderer.controller.width, renderer.calcY(staff1.originalBottom)-renderer.calcY(staff1.originalTop), "#000000", 0.1);
			debugPrint(staff1, 'chordHeightAbove');
			debugPrint(staff1, 'chordHeightBelow');
			debugPrint(staff1, 'dynamicHeightAbove');
			debugPrint(staff1, 'dynamicHeightBelow');
			debugPrint(staff1, 'endingHeightAbove');
			debugPrint(staff1, 'lyricHeightAbove');
			debugPrint(staff1, 'lyricHeightBelow');
			debugPrint(staff1, 'partHeightAbove');
			debugPrint(staff1, 'tempoHeightAbove');
			debugPrint(staff1, 'volumeHeightAbove');
			debugPrint(staff1, 'volumeHeightBelow');
		}
		if (staff1.bottom < 0)
			renderer.moveY(spacing.STEP, -staff1.bottom);
	}
	var topLine; // these are to connect multiple staves. We need to remember where they are.
	var bottomLine;

	var bartop = 0;
	for (var i=0;i<params.voices.length;i++) {
		var staff = params.voices[i].staff;
		renderer.y = staff.absoluteY;
		renderer.controller.classes.incrVoice();
		//renderer.y = staff.y;
		// offset for starting the counting at middle C
		if (!params.voices[i].duplicate) {
//			renderer.moveY(spacing.STEP, staff.top);
			if (!topLine) topLine  = renderer.calcY(10);
			bottomLine  = renderer.calcY(2);
			if (staff.lines !== 0) {
				renderer.controller.classes.newMeasure();
				printStaff(renderer, params.startx, params.w, staff.lines);
			}
			printBrace(renderer, staff.absoluteY, params.brace, i);
			printBrace(renderer, staff.absoluteY, params.bracket, i);
		}
		drawVoice(renderer, params.voices[i], bartop);
		renderer.controller.classes.newMeasure();
		if (!params.voices[i].duplicate) {
			bartop = renderer.calcY(2); // This connects the bar lines between two different staves.
//			if (staff.bottom < 0)
//				renderer.moveY(spacing.STEP, -staff.bottom);
		}
	}
	renderer.controller.classes.newMeasure();

	// connect all the staves together with a vertical line
	if (params.staffs.length>1) {
		printStem(renderer, params.startx, 0.6, topLine, bottomLine);
	}
	renderer.y = startY;
}

function printBrace(renderer, absoluteY, brace, index) {
	if (brace) {
		for (var i = 0; i < brace.length; i++) {
			if (brace[i].isStartVoice(index)) {
				brace[i].startY = absoluteY - spacing.STEP * 10;
				brace[i].elemset = drawBrace(renderer, brace[i]);
			}
		}
	}
}

function addInvisibleMarker(renderer, className) {
	var y = Math.round(renderer.y);
	renderer.paper.pathToBack({path:"M 0 " + y + " L 0 0", stroke:"none", fill:"none", "stroke-opacity": 0, "fill-opacity": 0, 'class': renderer.controller.classes.generate(className), 'data-vertical': y });
}

module.exports = drawStaffGroup;
