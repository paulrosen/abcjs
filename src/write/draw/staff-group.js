var spacing = require('../helpers/spacing');
var drawBrace = require('./brace');
var drawVoice = require('./voice');
var printStaff = require('./staff');
var printDebugBox = require('./debug-box');
var printStem = require('./print-stem');
var nonMusic = require('./non-music');

function drawStaffGroup(renderer, params, selectables, lineNumber) {
	// We enter this method with renderer.y pointing to the topmost coordinate that we're allowed to draw.
	// All of the children that will be drawn have a relative "pitch" set, where zero is the first ledger line below the staff.
	// renderer.y will be offset at the beginning of each staff by the amount required to make the relative pitch work.
	// If there are multiple staves, then renderer.y will be incremented for each new staff.

	var colorIndex;

	// An invisible marker is useful to be able to find where each system starts.
	//addInvisibleMarker(renderer, "abcjs-top-of-system");

	var startY = renderer.y; // So that it can be restored after we're done.
	// Set the absolute Y position for each staff here, so the voice drawing below can just use if.
	for (var j = 0; j < params.staffs.length; j++) {
		var staff1 = params.staffs[j];
		//renderer.printHorizontalLine(50, renderer.y, "start");
		renderer.moveY(spacing.STEP, staff1.top);
		staff1.absoluteY = renderer.y;
		if (renderer.showDebug) {
			if (renderer.showDebug.indexOf("box") >= 0 && staff1.voices) {
				boxAllElements(renderer, params.voices, staff1.voices);
			}
			if (renderer.showDebug.indexOf("grid") >= 0) {
				renderer.paper.dottedLine({ x1: renderer.padding.left, x2: renderer.padding.left + renderer.controller.width, y1: startY, y2: startY, stroke: "#0000ff" });
				printDebugBox(renderer,
					{
						x: renderer.padding.left,
						y: renderer.calcY(staff1.originalTop),
						width: renderer.controller.width,
						height: renderer.calcY(staff1.originalBottom) - renderer.calcY(staff1.originalTop),
						fill: renderer.foregroundColor,
						stroke: renderer.foregroundColor,
						"fill-opacity": 0.1,
						"stroke-opacity": 0.1
					});
				colorIndex = 0;
				debugPrintGridItem(staff1, 'chordHeightAbove');
				debugPrintGridItem(staff1, 'chordHeightBelow');
				debugPrintGridItem(staff1, 'dynamicHeightAbove');
				debugPrintGridItem(staff1, 'dynamicHeightBelow');
				debugPrintGridItem(staff1, 'endingHeightAbove');
				debugPrintGridItem(staff1, 'lyricHeightAbove');
				debugPrintGridItem(staff1, 'lyricHeightBelow');
				debugPrintGridItem(staff1, 'partHeightAbove');
				debugPrintGridItem(staff1, 'tempoHeightAbove');
				debugPrintGridItem(staff1, 'volumeHeightAbove');
				debugPrintGridItem(staff1, 'volumeHeightBelow');
			}
		}
		renderer.moveY(spacing.STEP, -staff1.bottom);
		if (renderer.showDebug) {
			if (renderer.showDebug.indexOf("grid") >= 0) {
				renderer.paper.dottedLine({
					x1: renderer.padding.left,
					x2: renderer.padding.left + renderer.controller.width,
					y1: renderer.y,
					y2: renderer.y,
					stroke: "#0000aa"
				});
			}
		}
	}
	var topLine; // these are to connect multiple staves. We need to remember where they are.
	var bottomLine;

	var linePitch = 2;
	var bartop = 0;
	for (var i = 0; i < params.voices.length; i++) {
		var staff = params.voices[i].staff;
		var tabName = params.voices[i].tabNameInfos;
		renderer.y = staff.absoluteY;
		renderer.controller.classes.incrVoice();
		//renderer.y = staff.y;
		// offset for starting the counting at middle C
		if (!params.voices[i].duplicate) {
			//			renderer.moveY(spacing.STEP, staff.top);
			if (!topLine) topLine = renderer.calcY(10);
			bottomLine = renderer.calcY(linePitch);
			if (staff.lines !== 0) {
				if (staff.linePitch) {
					linePitch = staff.linePitch;
				}
				renderer.controller.classes.newMeasure();
				var lines = printStaff(renderer, params.startx, params.w, staff.lines, staff.linePitch, 0.35);
				bottomLine = lines[1];
				staff.bottomLine = bottomLine;
				staff.topLine = lines[0];
				// rework bartop when tabs are present with current staff
				if (staff.hasTab) {
					// do not link to staff above  (ugly looking)
					bartop = staff.topLine;
				}
				if (staff.hasStaff) {
					// this is a tab
					bartop = staff.hasStaff.topLine;
					params.voices[i].barto = true;
					params.voices[i].topLine = topLine;
				}

			}
			printBrace(renderer, staff.absoluteY, params.brace, i, selectables);
			printBrace(renderer, staff.absoluteY, params.bracket, i, selectables);
		}
		drawVoice(renderer, params.voices[i], bartop, selectables, {
			top: startY,
			zero: renderer.y,
			height: params.height * spacing.STEP
		});
		var tabNameHeight = 0;
		if (tabName) {
			// print tab infos on staffBottom
			var r = { rows: [] };
			r.rows.push({ absmove: bottomLine + 2 });
			var leftMargin = 8;
			r.rows.push({ left: params.startx + leftMargin, text: tabName.name, font: 'tablabelfont', klass: 'text instrument-name', anchor: 'start' });
			r.rows.push({ move: tabName.textSize.height });
			nonMusic(renderer, r);
			tabNameHeight = tabName.textSize.height;
		}

		renderer.controller.classes.newMeasure();
		if (!params.voices[i].duplicate) {
			bartop = renderer.calcY(2 + tabNameHeight); // This connects the bar lines between two different staves.
			//			if (staff.bottom < 0)
			//				renderer.moveY(spacing.STEP, -staff.bottom);
		}
	}
	renderer.controller.classes.newMeasure();

	// connect all the staves together with a vertical line
	var staffSize = params.staffs.length;
	if (staffSize > 1) {
		topLine = params.staffs[0].topLine;
		bottomLine = params.staffs[staffSize - 1].bottomLine;
		printStem(renderer, params.startx, 0.6, topLine, bottomLine, null);
	}
	renderer.y = startY;

	function debugPrintGridItem(staff, key) {
		var colors = ["rgb(207,27,36)", "rgb(168,214,80)", "rgb(110,161,224)", "rgb(191,119,218)", "rgb(195,30,151)",
			"rgb(31,170,177)", "rgb(220,166,142)"];
		if (staff.positionY && staff.positionY[key]) {
			var height = staff.specialY[key] * spacing.STEP;
			if (key === "chordHeightAbove" && staff.specialY.chordLines && staff.specialY.chordLines.above)
				height *= staff.specialY.chordLines.above;
			if (key === "chordHeightBelow" && staff.specialY.chordLines && staff.specialY.chordLines.below)
				height *= staff.specialY.chordLines.below;
			printDebugBox(renderer,
				{
					x: renderer.padding.left,
					y: renderer.calcY(staff.positionY[key]),
					width: renderer.controller.width,
					height: height,
					fill: colors[colorIndex],
					stroke: colors[colorIndex],
					"fill-opacity": 0.4,
					"stroke-opacity": 0.4
				},
				key.substr(0, 4));
			colorIndex += 1; if (colorIndex > 6) colorIndex = 0;
		}
	}
}

function printBrace(renderer, absoluteY, brace, index, selectables) {
	if (brace) {
		for (var i = 0; i < brace.length; i++) {
			if (brace[i].isStartVoice(index)) {
				brace[i].startY = absoluteY - spacing.STEP * 10;
				brace[i].elemset = drawBrace(renderer, brace[i], selectables);
			}
		}
	}
}

// function addInvisibleMarker(renderer, className) {
// 	var y = Math.round(renderer.y);
// 	renderer.paper.pathToBack({path:"M 0 " + y + " L 0 0", stroke:"none", fill:"none", "stroke-opacity": 0, "fill-opacity": 0, 'class': renderer.controller.classes.generate(className), 'data-vertical': y });
// }

function boxAllElements(renderer, voices, which) {
	for (var i = 0; i < which.length; i++) {
		var children = voices[which[i]].children;
		for (var j = 0; j < children.length; j++) {
			var elem = children[j];
			var coords = elem.getFixedCoords();
			if (elem.invisible || coords.t === undefined || coords.b === undefined)
				continue;
			var height = (coords.t - coords.b) * spacing.STEP;
			printDebugBox(renderer,
				{
					x: coords.x,
					y: renderer.calcY(coords.t),
					width: coords.w,
					height: height,
					fill: "#88e888",
					"fill-opacity": 0.4,
					stroke: "#4aa93d",
					"stroke-opacity": 0.8
				});

			for (var k = 0; k < elem.children.length; k++) {
				var relElem = elem.children[k];
				var chord = relElem.getChordDim();
				if (chord) {
					var y = renderer.calcY(relElem.pitch);
					y += relElem.dim.font.size * relElem.getLane();
					printDebugBox(renderer,
						{
							x: chord.left,
							y: y,
							width: chord.right - chord.left,
							height: relElem.dim.font.size,
							fill: "none",
							stroke: "#4aa93d",
							"stroke-opacity": 0.8
						});
				}
			}
		}
	}
}

module.exports = drawStaffGroup;
