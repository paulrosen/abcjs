//    wrap_lines.js: does line wrap on an already parsed tune.
//    Copyright (C) 2018 Paul Rosen (paul at paulrosen dot net)
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function wrapLines(tune, lineBreaks) {
	if (!lineBreaks || tune.lines.length === 0)
		return;

	// tune.lines contains nested arrays: there is an array of lines (that's the part this function rewrites),
	// there is an array of staffs per line (for instance, piano will have 2, orchestra will have many)
	// there is an array of voices per staff (for instance, 4-part harmony might have bass and tenor on a single staff)
	// The measure numbers start at zero for each staff, but on the succeeding lines, the measure numbers are reset to the beginning of the line.
	var newLines = [];
	// keep track of our counters for each staff and voice
	var startNewLine = [];
	var currentLine = [];
	var measureNumber = [];
	var measureMarker = [];
	var lastMeter = '';
	var voiceStart = {};
	var linesWithoutStaff = 0;

	for (var i = 0; i < tune.lines.length; i++) {
		var line = tune.lines[i];
		if (line.staff) {
			var staffs = line.staff;
			for (var j = 0; j < staffs.length; j++) {
				if (startNewLine[j] === undefined) {
					startNewLine[j] = [];
					currentLine[j] = [];
					measureNumber[j] = [];
					measureMarker[j] = [];
				}
				var staff = staffs[j];
				var voices = staff.voices;
				for (var k = 0; k < voices.length; k++) {
					if (startNewLine[j][k] === undefined) {
						startNewLine[j][k] = true;
						currentLine[j][k] = 0;
						measureNumber[j][k] = 0;
						measureMarker[j][k] = 0;
					}
					if (linesWithoutStaff > 0) currentLine[j][k] += linesWithoutStaff;
					var voice = voices[k];
					for (var e = 0; e < voice.length; e++) {
						if (startNewLine[j][k]) {
							if (!newLines[currentLine[j][k]])
								newLines[currentLine[j][k]] = { staff: [] };
							if (!newLines[currentLine[j][k]].staff[j]) {
								newLines[currentLine[j][k]].staff[j] = {voices: []};
								for (var key in staff) {
									if (staff.hasOwnProperty(key)) {
										if (key === 'meter') {
											if (newLines.length === 1 || lastMeter !== JSON.stringify(staff[key])) {
												lastMeter = JSON.stringify(staff[key]);
												newLines[currentLine[j][k]].staff[j][key] = staff[key];
											}
										} else if (key !== 'voices') {
											newLines[currentLine[j][k]].staff[j][key] = staff[key];
										}
									}
								}
							}
							if (measureMarker[j][k])
								newLines[currentLine[j][k]].staff[j].barNumber = measureMarker[j][k];
							startNewLine[j][k] = false;
						}
						var element = voice[e];
						if (!newLines[currentLine[j][k]].staff[j].voices[k]) {
							newLines[currentLine[j][k]].staff[j].voices[k] = [];
							for (var startItem in voiceStart) {
								if (voiceStart.hasOwnProperty(startItem)) {
									newLines[currentLine[j][k]].staff[j].voices[k].push(voiceStart[startItem])
								}
							}
						}
						newLines[currentLine[j][k]].staff[j].voices[k].push(element);
						if (element.el_type === 'stem') {
							// This is a nice trick to just pay attention to the last setting of each type.
							voiceStart[element.el_type] = element;
						}

						if (element.el_type === 'bar') {
							measureNumber[j][k]++;
							if (lineBreaks[measureNumber[j][k]]) {
								startNewLine[j][k] = true;
								currentLine[j][k]++;
								measureMarker[j][k] = element.barNumber;
								delete element.barNumber;
							}
						}
					}

				}
			}
			linesWithoutStaff = 0;
		} else {
			newLines.push(line);
			linesWithoutStaff++;
		}
	}
	tune.lines = newLines;
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

// function createLineTestArray(numLines, numMeasures, maxMeasuresPerLine, minMeasuresPerLine) {
// 	var tries = [];
// 	// To get all the iterations, it is every digit in a particular base-numbering system.
// 	// That is, we want to generate every number that is (numLines-1) digits, in base (max-min+1)
// 	// For instance, for 5 lines where the min is 6 and max is 8, we want ever combination of 4 digits in base 3.
// 	var base = maxMeasuresPerLine - minMeasuresPerLine + 1;
// 	var digits = numLines - 1; // The last digit is fixed: it is what ever is needed to sum up to the total number of measures.
// 	var done = false;
// 	var iter = 0;
// 	while (!done) {
// 		var attempt = [];
// 		var num = iter;
// 		var total = 0;
// 		for (var d = digits - 1; d >= 0; d--) {
// 			attempt[d] = (num % base) + minMeasuresPerLine;
// 			num = Math.floor(num / base);
// 			total += attempt[d];
// 		}
// 		if (num > 0)
// 			done = true; // continue until we exceed the greatest number. We know because there is a remainer.
// 		else {
// 			var lastLine = numMeasures - total;
// 			if (lastLine >= minMeasuresPerLine && lastLine <= maxMeasuresPerLine) {
// 				attempt[digits] = lastLine;
// 				tries.push(attempt);
// 			}
// 			iter++;
// 		}
// 	}
// 	return tries;
// }

// function getVariance(attempt, idealLineBreak, widths, allowableOverage) {
// 	var measureNumber = 0;
// 	var thisWorstVariance = 0;
// 	for (var j = 0; j < attempt.length; j++) {
// 		var lineWidth = 0;
// 		var measuresThisLine = attempt[j];
// 		for (var k = 0; k < measuresThisLine; k++) {
// 			lineWidth += widths[measureNumber++];
// 		}
// 		if (lineWidth > allowableOverage)
// 			return null;
// 		var variance = Math.abs(lineWidth - idealLineBreak);
// 		if (variance > thisWorstVariance)
// 			thisWorstVariance = variance;
// 	}
// 	return thisWorstVariance;
// }

// function getMaxVariance(widths, lineBreakPoint, lineBreaks) {
// 	var maxVariance = 0;
// 	var numLines = lineBreaks.length + 1; // the last line doesn't have an explicit break
// 	var measureNumber = 0;
// 	var totals = [];
// 	for (var i = 0; i <= lineBreaks.length; i++) {
// 		var breakMeasure = (i === lineBreaks.length) ? widths.length : lineBreaks[i];
// 		var thisTotal = 0;
// 		for (var j = measureNumber; j < breakMeasure; j++) {
// 			thisTotal += widths[j];
// 		}
// 		measureNumber = breakMeasure;
// 		var thisVariance = thisTotal <= lineBreakPoint ? lineBreakPoint - thisTotal : 1000000;
// 		totals.push({total: thisTotal, variance: thisVariance})
// 		maxVariance = Math.max(maxVariance, thisVariance);
// 	}
//
// 	console.log(lineBreakPoint, totals)
// 	return maxVariance;
// }

function getVariance(widths, lineBreaks) {
	var numLines = lineBreaks.length + 1; // the last line doesn't have an explicit break
	var avg = widths.total / numLines;
	var largestVariance = 0;
	var measureNumber = 0;
	for (var i = 0; i <= lineBreaks.length; i++) {
		var breakMeasure = (i === lineBreaks.length) ? widths.measureWidths.length-1 : lineBreaks[i];
		var thisVariance = lineVariance(widths.measureWidths, measureNumber, breakMeasure, avg);
		measureNumber = breakMeasure+1;
		largestVariance = Math.max(largestVariance, thisVariance);
	}

	return largestVariance;
}

// function getAvgVariance(widths, lineBreakPoint, lineBreaks) {
// 	var totalVariance = 0;
// 	var numLines = lineBreaks.length + 1; // the last line doesn't have an explicit break
// 	var measureNumber = 0;
// 	for (var i = 0; i <= lineBreaks.length; i++) {
// 		var breakMeasure = (i === lineBreaks.length) ? widths.length : lineBreaks[i];
// 		var thisTotal = 0;
// 		for (var j = measureNumber; j < breakMeasure; j++) {
// 			thisTotal += widths[j];
// 		}
// 		measureNumber = breakMeasure;
// 		var thisVariance = Math.abs(lineBreakPoint - thisTotal);
// 		totalVariance += thisVariance;
// 	}
//
// 	return totalVariance / numLines;
// }

function lineVariance(widths, start, end, avg) {
	var thisTotal = lineWidth(widths, start, end);
	var thisVariance = Math.abs(avg - thisTotal);
	return thisVariance;
}

function lineWidth(widths, start, end) {
	var thisTotal = 0;
	for (var j = start; j <= end; j++)
		thisTotal += widths[j];
	return thisTotal;
}

// TODO-PER: For long pieces of music, this can get long, so stop finding the combinations at an arbitrary place.
function getAttempts(widths, start, linesLeft, min, max, lastLines) {
	var MAX_COMBINATIONS = 1200;
	var acc = 0;
	var attempts = [];
	for (var i = start; i < widths.length && acc < max; i++) {
		acc += widths[i];
		if (acc > max)
			break;
		if (acc > min) {
			if (linesLeft > 0 && attempts.length < MAX_COMBINATIONS) {
				var nextLines = getAttempts(widths, i + 1, linesLeft - 1, min, max, lastLines);
				for (var j = 0; j < nextLines.length; j++)
					attempts.push([i].concat(nextLines[j]));
			}
			if (linesLeft === 1 && lastLines.indexOf(i) >= 0)
				attempts.push([i]);
		}
	}
	return attempts;
}

function lastLinePossibilities(widths, start, min, max) {
	var acc = 0;
	var possibilities = [];
	for (var i = widths.length-1; i >= 0; i--) {
		acc += widths[i];
		if (acc > max)
			break;
		if (acc > min && i < start) {
			possibilities.push(i-1);
		}
	}
	return possibilities;
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
	//	figure out how many lines - That's one more than was tried before.
	var numLines = Math.ceil(widths.total / lineBreakPoint) + 1;

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
// 	// Instead of having to try all the different combinations to find the best, we start with an important piece of knowledge about the lineBreaks we are given:
// 	// If there is a line too short, it is the last one.
// 	// So, let's just do a couple of tweaks to see how it works to add one or two measures to the last line.
// 	var avg = widths.total / (lineBreaks.length + 1);
// 	var variance = getVariance(widths, lineBreaks);
// 	var variancePct = variance/lineBreakPoint*100;
//
// 	if (lineBreaks.length === 0)
// 		return { failed: true, reason: "Only one line." };
//
// 	var lastLineStart = lineBreaks[lineBreaks.length-1]+1;
// 	var lastLineVariance = lineVariance(widths.measureWidths, lastLineStart, widths.measureWidths.length, avg);
// 	if (variance > lastLineVariance)
// 		return { failed: true, reason: "Last line is not too short." };
//
// 	// Let's get a list of all combinations that have a possibility of working. That is, all combinations where no line has a variance larger than "variance".
// 	var lastLines = lastLinePossibilities(widths.measureWidths, lastLineStart, avg - variance, avg + variance);
// 	var attempts = getAttempts(widths.measureWidths, 0, lineBreaks.length, avg - variance, avg + variance, lastLines);
// 	//console.log(attempts, avg - variance, avg + variance);
//
// 	var failed = true;
// 	for (var i = 0; i < attempts.length; i++) {
// 		var newVariance = getVariance(widths, attempts[i]);
// 		if (newVariance < variance) {
// 			explanation.attempts.push({
// 				type: "Optimize try", lineBreaks: attempts[i],
// 				variance: Math.round(variance), newVariance: Math.round(newVariance),
// 				totalAttempts: attempts.length
// 			});
// 			variance = newVariance;
// 			lineBreaks = attempts[i];
// 			failed = false;
// 		}
// 	}
// 	if (failed) {
// 		explanation.attempts.push({ type: "Optimize try", lineBreaks: lineBreaks, variance: variance, reason: "None of the " + attempts.length + " attempts were better." });
// 		// TODO-PER: This shouldn't be necessary, but just try to move one measure down and see if it helps.
// 		if (lineBreaks.length > 0) {
// 			var attempt = [].concat(lineBreaks);
// 			attempt[attempt.length - 1]--;
// 			newVariance = getVariance(widths, attempt);
// 			explanation.attempts.push({
// 				type: "Optimize last try", lineBreaks: attempts[i],
// 				variance: Math.round(variance), newVariance: Math.round(newVariance),
// 				totalAttempts: attempts.length
// 			});
// 			if (newVariance < variance) {
// 				variance = newVariance;
// 				lineBreaks = attempt;
// 				failed = false;
// 			}
// 		}
// 	}
// 	// Let's squeeze the line successively until it spills onto an extra line, then take the option with the lowest variance
// 	// var targetNumLines = lineBreaks.length;
// 	// var newNumLines = targetNumLines;
// 	// var TRY_INCREMENT = 1;
// 	// var tryBreakPoint = lineBreakPoint - TRY_INCREMENT;
// 	// var failed = true;
// 	// while (targetNumLines === newNumLines && tryBreakPoint > 50) {
// 	// 	var ff = freeFormLineBreaks(widths.measureWidths, tryBreakPoint);
// 	// 	newNumLines = ff.lineBreaks.length;
// 	// 	if (newNumLines === targetNumLines) {
// 	// 		var newVariance = getVariance(widths, ff.lineBreaks);
// 	// 		var newVariancePct = newVariance/tryBreakPoint*100;
// 	// 		explanation.attempts.push({type: "Optimize try", tryBreakPoint: Math.round(tryBreakPoint), lineBreaks: ff.lineBreaks, totals: ff.totals,
// 	// 			variance: Math.round(variance), newVariance: Math.round(newVariance), variancePct: Math.round(variancePct), newVariancePct: Math.round(newVariancePct)
// 	// 		});
// 	// 		if (newVariancePct < variancePct) {
// 	// 			variancePct = newVariancePct;
// 	// 			lineBreaks = ff.lineBreaks;
// 	// 			failed = false;
// 	// 		}
// 	// 	} else {
// 	// 		explanation.attempts.push({type: "Optimize try", explanation: "Exceeded number of lines." , tryBreakPoint: Math.round(tryBreakPoint), lineBreaks: ff.lineBreaks, totals: ff.totals, variance: variance, avg: avg, variancePct: variancePct});
// 	// 	}
// 	// 	tryBreakPoint -= TRY_INCREMENT;
// 	// }
//
// 	return { failed: failed, lineBreaks: lineBreaks, variance: variance };
// }

// function fixedNumLinesBreaks(widths, numLines, allowOver, allowableVariance) {
// 	var idealLineBreak = widths.total / numLines;
// 	// If all the measures had the same amount of stuff, then the ave would be correct.
// 	// We will test all the combinations from one less to one more than the average.
// 	var averageMeasuresPerLine = Math.round(widths.measureWidths.length / numLines);
// 	var minMeasuresPerLine = Math.max(averageMeasuresPerLine - 1, 1);
// 	var maxMeasuresPerLine = averageMeasuresPerLine + 1;
// 	var tries = createLineTestArray(numLines, widths.measureWidths.length, maxMeasuresPerLine, minMeasuresPerLine);
// 	console.log("fixedNumLinesBreaks tests ("+minMeasuresPerLine+'-'+maxMeasuresPerLine+")", numLines, tries.length)
//
// 	// For each possible number of measures per line, see which has the closest spacing to the ideal.
// 	var bestCase = -1;
// 	var bestCaseVariance = 1000000;
// 	for (var i = 0 ; i < tries.length; i++) {
// 		var attempt = tries[i];
// 		var variance = getVariance(attempt, idealLineBreak, widths.measureWidths, allowOver ? allowableVariance : 0);
// 		if (variance !== null) {
// 			if (variance < bestCaseVariance) {
// 				bestCaseVariance = variance;
// 				bestCase = i;
// 			}
// 		}
// 	}
// 	var failed = true;
// 	// For debugging, recreate the line widths
// 	var totals = [];
// 	if (bestCase >= 0) {
// 		failed = false;
// 		var index = 0;
// 		for (i = 0; i < tries[bestCase].length; i++) {
// 			var total = 0;
// 			for (var j = 0; j < tries[bestCase][i]; j++) {
// 				total += widths.measureWidths[index++];
// 			}
// 			totals.push(Math.round(total));
// 		}
// 		// We now have an array that contains the number of measures per line, but we want to return the absolute measure number to break on.
// 		if (tries[bestCase].length > 0) {
// 			tries[bestCase][0]--; // The results should contain the last measure number on the line, zero-based.
// 			for (i = 1; i < tries[bestCase].length; i++)
// 				tries[bestCase][i] += tries[bestCase][i - 1]; // This sets the zero-based measure number
// 			// The last line is implied and we don't need to return it
// 			tries[bestCase].pop();
// 		}
// 	}
// 	return { failed: failed, lineBreaks: tries[bestCase], bestCaseVariance: Math.round(bestCaseVariance), totals: totals };
// }

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

function getRevisedTune(lineBreaks, staffWidth, abcString, params, Parse) {
	var abcParser = new Parse();
	var revisedParams = {
		lineBreaks: lineBreaks,
		staffwidth: staffWidth
	};
	for (var key in params) {
		if (params.hasOwnProperty(key) && key !== 'wrap' && key !== 'staffwidth') {
			revisedParams[key] = params[key];
		}
	}

	abcParser.parse(abcString, revisedParams);
	return { tune: abcParser.getTune(), revisedParams: revisedParams };
}

function calcLineWraps(tune, widths, abcString, params, Parse, engraver_controller) {
	// For calculating how much can go on the line, it depends on the width of the line. It is a convenience to just divide it here
	// by the minimum spacing instead of multiplying the min spacing later.
	// The scaling works differently: this is done by changing the scaling of the outer SVG, so the scaling needs to be compensated
	// for here, because the actual width will be different from the calculated numbers.

	// If the desired width is less than the margin, just punt and return the original tune
	if (params.staffwidth < widths.left) {
		return {
			explanation: "Staffwidth is narrower than the margin",
			tune: tune,
			revisedParams: params
		};
	}
	var scale = params.scale ? Math.max(params.scale, 0.1) : 1;
	var minSpacing = params.wrap.minSpacing ? Math.max(parseFloat(params.wrap.minSpacing), 1) : 1;
	var minSpacingLimit = params.wrap.minSpacingLimit ? Math.max(parseFloat(params.wrap.minSpacingLimit), 1) : minSpacing - 0.1;
	var maxSpacing = params.wrap.maxSpacing ? Math.max(parseFloat(params.wrap.maxSpacing), 1) : undefined;
	if (params.wrap.lastLineLimit && !maxSpacing)
		maxSpacing = Math.max(parseFloat(params.wrap.lastLineLimit), 1);
	var targetHeight = params.wrap.targetHeight ? Math.max(parseInt(params.wrap.targetHeight, 10), 100) : undefined;
	var preferredMeasuresPerLine = params.wrap.preferredMeasuresPerLine ? Math.max(parseInt(params.wrap.preferredMeasuresPerLine, 10), 1) : undefined;

	var lineBreakPoint = (params.staffwidth - widths.left) / minSpacing / scale;
	var minLineSize = (params.staffwidth - widths.left) / maxSpacing / scale;
	var allowableVariance = (params.staffwidth - widths.left) / minSpacingLimit / scale;
	var explanation = { widths: widths, lineBreakPoint: lineBreakPoint, minLineSize: minLineSize, attempts: [], staffWidth: params.staffwidth, minWidth: Math.round(allowableVariance) };

	// If there is a preferred number of measures per line, test that first. If none of the lines is too long, then we're finished.
	var lineBreaks = null;
	if (preferredMeasuresPerLine) {
		var f = fixedMeasureLineBreaks(widths.measureWidths, lineBreakPoint, preferredMeasuresPerLine);
		explanation.attempts.push({ type: "Fixed Measures Per Line", preferredMeasuresPerLine: preferredMeasuresPerLine, lineBreaks: f.lineBreaks, failed: f.failed, totals: f.totals });
		if (!f.failed)
			lineBreaks = f.lineBreaks;
	}

	// If we don't have lineBreaks yet, use the free form method of line breaks.
	// This will be called either if Preferred Measures is not used, or if the music is just weird - like a single measure is way too crowded.
	if (!lineBreaks) {
		var ff = freeFormLineBreaks(widths.measureWidths, lineBreakPoint);
		explanation.attempts.push({ type: "Free Form", lineBreaks: ff.lineBreaks, totals: ff.totals });
		lineBreaks = ff.lineBreaks;

		// We now have an acceptable number of lines, but the measures may not be optimally distributed. See if there is a better distribution.
		ff = optimizeLineWidths(widths, lineBreakPoint, lineBreaks, explanation);
		explanation.attempts.push({ type: "Optimize", failed: ff.failed, reason: ff.reason, lineBreaks: ff.lineBreaks, totals: ff.totals });
		if (!ff.failed)
			lineBreaks = ff.lineBreaks;
	}

	// If the vertical space exceeds targetHeight, remove a line and try again. If that is too crowded, then don't use it.
	var staffWidth = params.staffwidth;
	var ret = getRevisedTune(lineBreaks, staffWidth, abcString, params, Parse);
	var newWidths = engraver_controller.getMeasureWidths(ret.tune);
	var gotTune = true; // If we adjust the num lines, set this to false
	explanation.attempts.push({type: "heightCheck", height: newWidths.height });

	// 	if all of the lines are too sparse, make the width narrower.
	// TODO-PER: implement this case.

	// If one line and the spacing is > maxSpacing, make the width narrower.
	if (lineBreaks.length === 0 && minLineSize > widths.total) {
		staffWidth = (widths.total * maxSpacing * scale) + widths.left;
		explanation.attempts.push({type: "too sparse", newWidth: Math.round(staffWidth)})
		gotTune = false;
	}

	// if (ret.lineBreaks.length === 0) {
	// 	// Everything fits on one line, so see if there is TOO much space and the staff width needs to be shortened.
	// 	if (minLineSize > 0 && ret.totalThisLine > 0 && ret.totalThisLine < minLineSize)
	// 		staffWidth = staffWidth / (minLineSize / ret.totalThisLine);
	// } else if (ret.totalThisLine < minLineSize) {
	// 	// the last line is too short, so attempt to redistribute by changing the min.
	// 	// We will try more and less space alternatively. The space can't be less than 1.0, and we'll try in 0.1 increments.
	// 	var minTrys = [];
	// 	if (minSpacing > 1.1)
	// 		minTrys.push(minSpacing - 0.1);
	// 	minTrys.push(minSpacing + 0.1);
	// 	if (minSpacing > 1.2)
	// 		minTrys.push(minSpacing - 0.2);
	// 	minTrys.push(minSpacing + 0.2);
	// 	if (minSpacing > 1.3)
	// 		minTrys.push(minSpacing - 0.3);
	// 	minTrys.push(minSpacing + 0.3);
	// 	for (var i = 0; i < minTrys.length && ret.totalThisLine < minLineSize; i++) {
	// 		lineBreakPoint = (params.staffwidth - widths.left) / minTrys[i] / scale;
	// 		ret = calcLineBreaks(widths.measureWidths, lineBreakPoint);
	// 	}
	// }

	if (!gotTune)
		ret = getRevisedTune(lineBreaks, staffWidth, abcString, params, Parse);
	ret.explanation = explanation;
	return ret;
}

module.exports = { wrapLines: wrapLines, calcLineWraps: calcLineWraps };
