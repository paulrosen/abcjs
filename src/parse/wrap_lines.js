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

	for (var i = 0; i < tune.lines.length; i++) {
		var line = tune.lines[i];
		if (line.staff) {
			var staffs = line.staff;
			for (var j = 0; j < staffs.length; j++) {
				if (startNewLine[j] === undefined) {
					startNewLine[j] = [];
					currentLine[j] = [];
					measureNumber[j] = [];
				}
				var staff = staffs[j];
				var voices = staff.voices;
				for (var k = 0; k < voices.length; k++) {
					if (startNewLine[j][k] === undefined) {
						startNewLine[j][k] = true;
						currentLine[j][k] = 0;
						measureNumber[j][k] = 0;
					}
					var voice = voices[k];
					for (var e = 0; e < voice.length; e++) {
						if (startNewLine[j][k]) {
							if (!newLines[currentLine[j][k]])
								newLines[currentLine[j][k]] = { staff: [] };
							if (!newLines[currentLine[j][k]].staff[j]) {
								newLines[currentLine[j][k]].staff[j] = {voices: []};
								for (var key in staff) {
									if (staff.hasOwnProperty(key)) {
										if (key !== 'voices')
											newLines[currentLine[j][k]].staff[j][key] = staff[key];
									}
								}
							}
							startNewLine[j][k] = false;
						}
						var element = voice[e];
						if (!newLines[currentLine[j][k]].staff[j].voices[k])
							newLines[currentLine[j][k]].staff[j].voices[k] = [];
						newLines[currentLine[j][k]].staff[j].voices[k].push(element);
						if (element.el_type === 'bar') {
							measureNumber[j][k]++;
							if (lineBreaks[measureNumber[j][k]]) {
								startNewLine[j][k] = true;
								currentLine[j][k]++;
							}
						}
					}

				}
			}
		} else {
			newLines.push(line);
			currentLine++;
		}
	}
	tune.lines = newLines;
}

module.exports = wrapLines;
