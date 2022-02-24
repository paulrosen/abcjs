//    wrap_lines.js: does line wrap on an already parsed tune.

function wrapLines(tune, lineBreaks, barNumbers) {
	if (!lineBreaks || tune.lines.length === 0)
		return;

	// tune.lines contains nested arrays: there is an array of lines (that's the part this function rewrites),
	// there is an array of staffs per line (for instance, piano will have 2, orchestra will have many)
	// there is an array of voices per staff (for instance, 4-part harmony might have bass and tenor on a single staff)
	var lines = tune.deline({lineBreaks: false});
	var linesBreakElements = findLineBreaks(lines, lineBreaks);
	//console.log(JSON.stringify(linesBreakElements))
	tune.lines = addLineBreaks(lines, linesBreakElements, barNumbers);
	tune.lineBreaks = linesBreakElements;
}

function addLineBreaks(lines, linesBreakElements, barNumbers) {
	// linesBreakElements is an array of all of the elements that break for a new line
	// The objects in the array look like:
	// {"ogLine":0,"line":0,"staff":0,"voice":0,"start":0, "end":21}
	// ogLine is the original line that it came from,
	// line is the target line.
	// then copy all the elements from start to end for the staff and voice specified.
	// If the item doesn't contain "staff" then it is a non music line and should just be copied.
	var outputLines = [];
	var lastKeySig = []; // This is per staff - if the key changed then this will be populated.
	var lastStem = [];
	var currentBarNumber = 1;
	for (var i = 0; i < linesBreakElements.length; i++) {
		var action = linesBreakElements[i];
		if (lines[action.ogLine].staff) {
			var inputStaff = lines[action.ogLine].staff[action.staff];
			if (!outputLines[action.line]) {
				outputLines[action.line] = {staff: []}
			}
			if (!outputLines[action.line].staff[action.staff]) {
				outputLines[action.line].staff[action.staff] = {voices: []};
				if (barNumbers !== undefined && action.staff === 0 && action.line > 0) {
					outputLines[action.line].staff[action.staff].barNumber = currentBarNumber;
				}
				var keys = Object.keys(inputStaff)
				for (var k = 0; k < keys.length; k++) {
					var skip = keys[k] === "voices";
					if (keys[k] === "meter" && action.line !== 0)
						skip = true;
					if (!skip)
						outputLines[action.line].staff[action.staff][keys[k]] = inputStaff[keys[k]];
				}
				if (lastKeySig[action.staff])
					outputLines[action.line].staff[action.staff].key = lastKeySig[action.staff];

			}
			if (!outputLines[action.line].staff[action.staff].voices[action.voice]) {
				outputLines[action.line].staff[action.staff].voices[action.voice] = [];
			}
			outputLines[action.line].staff[action.staff].voices[action.voice] =
				lines[action.ogLine].staff[action.staff].voices[action.voice].slice(action.start, action.end+1);
			if (lastStem[action.staff*10+action.voice])
				outputLines[action.line].staff[action.staff].voices[action.voice].unshift({el_type: "stem", direction: lastStem[action.staff*10+action.voice].direction})
			var currVoice = outputLines[action.line].staff[action.staff].voices[action.voice];
			for (var kk = currVoice.length-1; kk >= 0; kk--) {
				if (currVoice[kk].el_type === "key") {
					lastKeySig[action.staff] = {
						root: currVoice[kk].root,
						acc: currVoice[kk].acc,
						mode: currVoice[kk].mode,
						accidentals: currVoice[kk].accidentals.filter(function (acc) { return acc.acc !== 'natural' })
					};
					break;
				}
			}
			for (kk = currVoice.length-1; kk >= 0; kk--) {
				if (currVoice[kk].el_type === "stem") {
					lastStem[action.staff*10+action.voice] = {
						direction: currVoice[kk].direction,
					};
					break;
				}
			}
			if (barNumbers !== undefined && action.staff === 0 && action.voice === 0) {
				for (kk = 0; kk < currVoice.length; kk++) {
					if (currVoice[kk].el_type === 'bar') {
						currentBarNumber++
						if (kk === currVoice.length-1)
							delete currVoice[kk].barNumber
						else
							currVoice[kk].barNumber = currentBarNumber
					}
				}
			}
		} else {
			outputLines[action.line] = lines[action.ogLine];
		}
	}
	// There could be some missing info - if the tune passed in was incomplete or had different lengths for different voices or was missing a voice altogether - just fill in the gaps.
	for (var ii = 0; ii < outputLines.length; ii++) {
		if (outputLines[ii].staff) {
			outputLines[ii].staff = outputLines[ii].staff.filter(function (el) {
				return el != null;
			});
		}
	}
	return outputLines;
}


function findLineBreaks(lines, lineBreakArray) {
	// lineBreakArray is an array of all of the sections of the tune - often there will just be one
	// section unless there is a subtitle or other non-music lines. Each of the elements of
	// Each element of lineBreakArray is an array of the zero-based last measure of the line.
	var lineBreakIndexes = [];
	var lbai = 0;
	var lineCounter = 0;
	var outputLine = 0;
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line.staff) {
			var lineStart = lineCounter;
			var lineBreaks = lineBreakArray[lbai];
			lbai++;
			for (var j = 0; j < line.staff.length; j++) {
				var staff = line.staff[j];
				for (var k = 0; k < staff.voices.length; k++) {
					outputLine = lineStart;
					var measureNumber = 0;
					var lbi = 0;
					var voice = staff.voices[k];
					var start = 0;
					for (var e = 0; e < voice.length; e++) {
						var el = voice[e];

						if (el.el_type === 'bar') {
							if (lineBreaks[lbi] === measureNumber) {
								lineBreakIndexes.push({ ogLine: i, line: outputLine, staff: j, voice: k, start: start, end: e})
								start = e + 1;
								outputLine++;
								lineCounter = Math.max(lineCounter, outputLine)
								lbi++;
							}
							measureNumber++;

						}
					}
					lineBreakIndexes.push({ ogLine: i, line: outputLine, staff: j, voice: k, start: start, end: voice.length})
					outputLine++;
					lineCounter = Math.max(lineCounter, outputLine)
				}
			}
		} else {
			lineBreakIndexes.push({ ogLine: i, line: outputLine })
			outputLine++;
			lineCounter = Math.max(lineCounter, outputLine)
		}
	}
	return lineBreakIndexes;
}


function freeFormLineBreaks(widths, lineBreakPoint) {
	var lineBreaks = [];
	var totals = [];
	var totalThisLine = 0;
	// run through each measure and see if the accumulation is less than the ideal.
	// if it passes the ideal, then see whether the last or this one is closer to the ideal.
	for (var i = 0; i < widths.length; i++) {
		var width = widths[i];
		var attemptedWidth = totalThisLine + width;
		if (attemptedWidth < lineBreakPoint)
			totalThisLine = attemptedWidth;
		else {
			// This just passed the ideal, so see whether the previous or the current number of measures is closer.
			var oldDistance = lineBreakPoint - totalThisLine;
			var newDistance = attemptedWidth - lineBreakPoint;
			if (oldDistance < newDistance && totalThisLine > 0) {
				lineBreaks.push(i - 1);
				totals.push(Math.round(totalThisLine - width));
				totalThisLine = width;
			} else {
				if (i < widths.length-1) {
					lineBreaks.push(i);
					totals.push(Math.round(totalThisLine));
					totalThisLine = 0;
				}
			}
		}
	}
	totals.push(Math.round(totalThisLine));
	return { lineBreaks: lineBreaks, totals: totals };
}

function clone(arr) {
	var newArr = [];
	for (var i = 0; i < arr.length; i++)
		newArr.push(arr[i]);
	return newArr;
}

function oneTry(measureWidths, idealWidths, accumulator, lineAccumulator, lineWidths, lastVariance, highestVariance, currLine, lineBreaks, startIndex, otherTries) {
	for (var i = startIndex; i < measureWidths.length; i++) {
		var measureWidth = measureWidths[i];
		accumulator += measureWidth;
		lineAccumulator += measureWidth;
		var thisVariance = Math.abs(accumulator - idealWidths[currLine]);
		var varianceIsClose = Math.abs(thisVariance - lastVariance) < idealWidths[0] / 10; // see if the difference is less than 10%, if so, run the test both ways.
		if (varianceIsClose) {
			if (thisVariance < lastVariance) {
				// Also attempt one less measure on the current line - sometimes that works out better.
				var newWidths = clone(lineWidths);
				var newBreaks = clone(lineBreaks);
				newBreaks.push(i-1);
				newWidths.push(lineAccumulator - measureWidth);
				otherTries.push({
					accumulator: accumulator,
					lineAccumulator: measureWidth,
					lineWidths: newWidths,
					lastVariance: Math.abs(accumulator - idealWidths[currLine+1]),
					highestVariance: Math.max(highestVariance, lastVariance),
					currLine: currLine+1,
					lineBreaks: newBreaks,
					startIndex: i+1});
			} else if (thisVariance > lastVariance && i < measureWidths.length-1) {
				// Also attempt one extra measure on this line.
				newWidths = clone(lineWidths);
				newBreaks = clone(lineBreaks);
				// newBreaks[newBreaks.length-1] = i;
				// newWidths[newWidths.length-1] = lineAccumulator;
				otherTries.push({
					accumulator: accumulator,
					lineAccumulator: lineAccumulator,
					lineWidths: newWidths,
					lastVariance: thisVariance,
					highestVariance: Math.max(highestVariance, thisVariance),
					currLine: currLine,
					lineBreaks: newBreaks,
					startIndex: i+1});
			}
		}
		if (thisVariance > lastVariance) {
			lineBreaks.push(i - 1);
			currLine++;
			highestVariance = Math.max(highestVariance, lastVariance);
			lastVariance = Math.abs(accumulator - idealWidths[currLine]);
			lineWidths.push(lineAccumulator - measureWidth);
			lineAccumulator = measureWidth;
		} else {
			lastVariance = thisVariance;
		}
	}
	lineWidths.push(lineAccumulator);
}

function optimizeLineWidths(widths, lineBreakPoint, lineBreaks, explanation) {
	//	figure out how many lines
	var numLines = Math.ceil(widths.total / lineBreakPoint); // + 1 TODO-PER: this used to be plus one - not sure why

	//	get the ideal width for a line (cumulative width / num lines) - approx the same as lineBreakPoint except for rounding
	var idealWidth = Math.floor(widths.total / numLines);

	//	get each ideal line width (1*ideal, 2*ideal, 3*ideal, etc)
	var idealWidths = [];
	for (var i = 0; i < numLines; i++)
		idealWidths.push(idealWidth*(i+1));

	//	from first measure, step through accum. Widths until the abs of the ideal is greater than the last one.
	// This can sometimes look funny in edge cases, so when the length is within 10%, try one more or one less to see which is better.
	// This is better than trying all the possibilities because that would get to be a huge number for even a medium size piece.
	// This method seems to never generate more than about 16 tries and it is usually 4 or less.
	var otherTries = [];
	otherTries.push({
		accumulator: 0,
		lineAccumulator: 0,
		lineWidths: [],
		lastVariance: 999999,
		highestVariance: 0,
		currLine: 0,
		lineBreaks: [], // These are the zero-based last measure on each line
		startIndex: 0});
	var index = 0;
	while (index < otherTries.length) {
		oneTry(widths.measureWidths,
			idealWidths,
			otherTries[index].accumulator,
			otherTries[index].lineAccumulator,
			otherTries[index].lineWidths,
			otherTries[index].lastVariance,
			otherTries[index].highestVariance,
			otherTries[index].currLine,
			otherTries[index].lineBreaks,
			otherTries[index].startIndex,
			otherTries);
		index++;
	}
	for (i = 0; i < otherTries.length; i++) {
		var otherTry = otherTries[i];
		otherTry.variances = [];
		otherTry.aveVariance = 0;
		for (var j = 0; j < otherTry.lineWidths.length; j++) {
			var lineWidth = otherTry.lineWidths[j];
			otherTry.variances.push(lineWidth - idealWidths[0]);
			otherTry.aveVariance += Math.abs(lineWidth - idealWidths[0]);
		}
		otherTry.aveVariance =  otherTry.aveVariance / otherTry.lineWidths.length;
		explanation.attempts.push({ type: "optimizeLineWidths", lineBreaks: otherTry.lineBreaks, variances: otherTry.variances, aveVariance: otherTry.aveVariance, widths: widths.measureWidths });
	}
	var smallest = 9999999;
	var smallestIndex = -1;
	for (i = 0; i < otherTries.length; i++) {
		otherTry = otherTries[i];
		if (otherTry.aveVariance < smallest) {
			smallest = otherTry.aveVariance;
			smallestIndex = i;
		}
	}
	return { failed: false, lineBreaks: otherTries[smallestIndex].lineBreaks, variance: otherTries[smallestIndex].highestVariance };
}

function fixedMeasureLineBreaks(widths, lineBreakPoint, preferredMeasuresPerLine) {
	var lineBreaks = [];
	var totals = [];
	var thisWidth = 0;
	var failed = false;
	for (var i = 0; i < widths.length; i++) {
		thisWidth += widths[i];
		if (thisWidth > lineBreakPoint) {
			failed = true;
		}
		if (i % preferredMeasuresPerLine === (preferredMeasuresPerLine-1)) {
			if (i !== widths.length-1) // Don't bother putting a line break for the last line - it's already a break.
				lineBreaks.push(i);
			totals.push(Math.round(thisWidth));
			thisWidth = 0;
		}
	}
	return { failed: failed, totals: totals, lineBreaks: lineBreaks };
}

function getRevisedTuneParams(lineBreaks, staffWidth, params) {

	var revisedParams = {
		lineBreaks: lineBreaks,
		staffwidth: staffWidth
	};
	for (var key in params) {
		if (params.hasOwnProperty(key) && key !== 'wrap' && key !== 'staffwidth') {
			revisedParams[key] = params[key];
		}
	}

	return { revisedParams: revisedParams };
}

function calcLineWraps(tune, widths, params) {
	// For calculating how much can go on the line, it depends on the width of the line. It is a convenience to just divide it here
	// by the minimum spacing instead of multiplying the min spacing later.
	// The scaling works differently: this is done by changing the scaling of the outer SVG, so the scaling needs to be compensated
	// for here, because the actual width will be different from the calculated numbers.

	// If the desired width is less than the margin, just punt and return the original tune
	//console.log(widths)
	if (widths.length === 0 || params.staffwidth < widths[0].left) {
		return {
			reParse: false,
			explanation: "Staff width is narrower than the margin",
			revisedParams: params
		};
	}
	var scale = params.scale ? Math.max(params.scale, 0.1) : 1;
	var minSpacing = params.wrap.minSpacing ? Math.max(parseFloat(params.wrap.minSpacing), 1) : 1;
	var minSpacingLimit = params.wrap.minSpacingLimit ? Math.max(parseFloat(params.wrap.minSpacingLimit), 1) : minSpacing - 0.1;
	var maxSpacing = params.wrap.maxSpacing ? Math.max(parseFloat(params.wrap.maxSpacing), 1) : undefined;
	if (params.wrap.lastLineLimit && !maxSpacing)
		maxSpacing = Math.max(parseFloat(params.wrap.lastLineLimit), 1);
	// var targetHeight = params.wrap.targetHeight ? Math.max(parseInt(params.wrap.targetHeight, 10), 100) : undefined;
	var preferredMeasuresPerLine = params.wrap.preferredMeasuresPerLine ? Math.max(parseInt(params.wrap.preferredMeasuresPerLine, 10), 0) : undefined;

	var accumulatedLineBreaks = [];
	var explanations = [];
	for (var s = 0; s < widths.length; s++) {
		var section = widths[s];
		var usableWidth = params.staffwidth - section.left;
		var lineBreakPoint = usableWidth / minSpacing / scale;
		var minLineSize = usableWidth / maxSpacing / scale;
		var allowableVariance = usableWidth / minSpacingLimit / scale;
		var explanation = {
			widths: section,
			lineBreakPoint: lineBreakPoint,
			minLineSize: minLineSize,
			attempts: [],
			staffWidth: params.staffwidth,
			minWidth: Math.round(allowableVariance)
		};

		// If there is a preferred number of measures per line, test that first. If none of the lines is too long, then we're finished.
		var lineBreaks = null;
		if (preferredMeasuresPerLine) {
			var f = fixedMeasureLineBreaks(section.measureWidths, lineBreakPoint, preferredMeasuresPerLine);
			explanation.attempts.push({
				type: "Fixed Measures Per Line",
				preferredMeasuresPerLine: preferredMeasuresPerLine,
				lineBreaks: f.lineBreaks,
				failed: f.failed,
				totals: f.totals
			});
			if (!f.failed)
				lineBreaks = f.lineBreaks;
		}

		// If we don't have lineBreaks yet, use the free form method of line breaks.
		// This will be called either if Preferred Measures is not used, or if the music is just weird - like a single measure is way too crowded.
		if (!lineBreaks) {
			var ff = freeFormLineBreaks(section.measureWidths, lineBreakPoint);
			explanation.attempts.push({type: "Free Form", lineBreaks: ff.lineBreaks, totals: ff.totals});
			lineBreaks = ff.lineBreaks;

			// We now have an acceptable number of lines, but the measures may not be optimally distributed. See if there is a better distribution.
			if (lineBreaks.length > 0 && section.measureWidths.length < 25) {
				// Only do this if everything doesn't fit on one line.
				// This is an intensive operation and it is optional so just do it for shorter music.
				ff = optimizeLineWidths(section, lineBreakPoint, lineBreaks, explanation);
				explanation.attempts.push({
					type: "Optimize",
					failed: ff.failed,
					reason: ff.reason,
					lineBreaks: ff.lineBreaks,
					totals: ff.totals
				});
				if (!ff.failed)
					lineBreaks = ff.lineBreaks;
			}
		}
		accumulatedLineBreaks.push(lineBreaks);
		explanations.push(explanation);
	}
	// If the vertical space exceeds targetHeight, remove a line and try again. If that is too crowded, then don't use it.
	var staffWidth = params.staffwidth;
	var ret = getRevisedTuneParams(accumulatedLineBreaks, staffWidth, params);
	ret.explanation = explanations;
	ret.reParse = true;
	return ret;
}

module.exports = { wrapLines: wrapLines, calcLineWraps: calcLineWraps };
