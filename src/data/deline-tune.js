function delineTune(inputLines, options) {
	if (!options) options = {};
	var lineBreaks = !!options.lineBreaks;
	var outputLines = [];
	var inMusicLine = false;
	var currentMeter = [];
	var currentKey = [];
	var currentClef = [];
	var currentVocalFont = [];
	var currentGChordFont = [];
	var currentTripletFont = [];
	var currentAnnotationFont = [];
	for (var i = 0; i < inputLines.length; i++) {
		var inputLine = inputLines[i];
		if (inputLine.staff) {
			if (inMusicLine && !inputLine.vskip) {
				var outputLine = outputLines[outputLines.length-1];
				//findMismatchKeys(inputLine, outputLine, ["staff", "staffGroup"], "line", i)
				for (var s = 0; s < outputLine.staff.length; s++) {
					var inputStaff = inputLine.staff[s];
					var outputStaff = outputLine.staff[s];
					if (inputStaff) {
						if (!objEqual(inputStaff.meter, currentMeter[s])) {
							// The meter changed for this line, otherwise it wouldn't have been set
							addMeterToVoices(inputStaff.meter, inputStaff.voices)
							currentMeter[s] = inputStaff.meter;
							delete inputStaff.meter;
						}
						if (!objEqual(inputStaff.key, currentKey[s])) {
							addKeyToVoices(inputStaff.key, inputStaff.voices);
							currentKey[s] = inputStaff.key;
							delete inputStaff.key;
						}
						if (inputStaff.title)
							outputStaff.abbrevTitle = inputStaff.title;
						if (!objEqual(inputStaff.clef, currentClef[s])) {
							addClefToVoices(inputStaff.clef, inputStaff.voices);
							currentClef[s] = inputStaff.clef;
							delete inputStaff.clef;
						}
						if (!objEqual(inputStaff.vocalfont, currentVocalFont[s])) {
							addFontToVoices(inputStaff.vocalfont, inputStaff.voices, 'vocalfont')
							currentVocalFont[s] = inputStaff.vocalfont;
							delete inputStaff.vocalfont;
						}
						if (!objEqual(inputStaff.gchordfont, currentGChordFont[s])) {
							addFontToVoices(inputStaff.gchordfont, inputStaff.voices, 'gchordfont')
							currentGChordFont[s] = inputStaff.gchordfont;
							delete inputStaff.gchordfont;
						}
						if (!objEqual(inputStaff.tripletfont, currentTripletFont[s])) {
							addFontToVoices(inputStaff.tripletfont, inputStaff.voices, 'tripletfont')
							currentTripletFont[s] = inputStaff.tripletfont;
							delete inputStaff.tripletfont;
						}
						if (!objEqual(inputStaff.annotationfont, currentAnnotationFont[s])) {
							addFontToVoices(inputStaff.annotationfont, inputStaff.voices, 'annotationfont')
							currentAnnotationFont[s] = inputStaff.annotationfont;
							delete inputStaff.annotationfont;
						}
					}
					//findMismatchKeys(inputStaff, outputStaff, ["voices", "title", "abbrevTitle", "barNumber", "meter", "key", "clef", "vocalfont", "gchordfont", "tripletfont", "annotationfont"], "staff", i + ' ' + s)
					if (inputStaff) {
						for (var v = 0; v < outputStaff.voices.length; v++) {
							var outputVoice = outputStaff.voices[v];
							var inputVoice = inputStaff.voices[v];
							if (lineBreaks)
								outputVoice.push({el_type: "break"});
							if (inputVoice)
								outputStaff.voices[v] = outputVoice.concat(inputVoice)
						}
					}
				}
			} else {
				for (var ii = 0; ii < inputLine.staff.length; ii++) {
					currentKey[ii] = inputLine.staff[ii].key;
					currentMeter[ii] = inputLine.staff[ii].meter;
					currentClef[ii] = inputLine.staff[ii].clef;
				}
				// copy this because we are going to change it and we don't want to change the original.
				outputLines.push(cloneLine(inputLine));
			}
			inMusicLine = true;
		} else {
			inMusicLine = false;
			outputLines.push(inputLine);
		}
	}
	return outputLines;
}
// function findMismatchKeys(input, output, ignore, context, context2) {
// 	if (!input) {
// 		return;
// 	}
// 	var outputKeys = Object.keys(output);
// 	var inputKeys = Object.keys(input);
// 	for (var ii = 0; ii < ignore.length; ii++) {
// 		if (outputKeys.indexOf(ignore[ii]) >= 0) {
// 			outputKeys.splice(outputKeys.indexOf(ignore[ii]), 1);
// 		}
// 		if (inputKeys.indexOf(ignore[ii]) >= 0) {
// 			inputKeys.splice(inputKeys.indexOf(ignore[ii]), 1);
// 		}
// 	}
// 	if (inputKeys.join(",") !== outputKeys.join(",")) {
// 		console.log("keys mismatch "+context + ' ' + context2, input, output);
// 	}
// 	for (var k = 0; k < inputKeys.length; k++) {
// 		var key = inputKeys[k];
// 		if (ignore.indexOf(key) < 0) {
// 			var inputValue = JSON.stringify(input[key], replacer);
// 			var outputValue = JSON.stringify(output[key], replacer);
// 			if (inputValue !== outputValue)
// 				console.log("value mismatch "+context + ' ' + context2 + ' ' + key, inputValue, outputValue)
// 		}
// 	}
// }
function replacer(key, value) {
	// Filtering out properties
	if (key === 'abselem') {
		return 'abselem';
	}
	return value;
}

function addMeterToVoices(meter, voices) {
	meter.el_type = "meter";
	meter.startChar = -1;
	meter.endChar = -1;
	for (var i = 0; i < voices.length; i++) {
		voices[i].unshift(meter);
	}
}

function addKeyToVoices(key, voices) {
	key.el_type = "key";
	key.startChar = -1;
	key.endChar = -1;
	for (var i = 0; i < voices.length; i++) {
		voices[i].unshift(key);
	}
}

function addClefToVoices(clef, voices) {
	clef.el_type = "clef";
	clef.startChar = -1;
	clef.endChar = -1;
	for (var i = 0; i < voices.length; i++) {
		voices[i].unshift(clef);
	}
}

function addFontToVoices(font, voices, type) {
	font.el_type = "font";
	font.type = type;
	font.startChar = -1;
	font.endChar = -1;
	for (var i = 0; i < voices.length; i++) {
		voices[i].unshift(font);
	}
}

function objEqual(input, output) {
	if (!input)
		return true; // the default is whatever the old output is.
	var inputValue = JSON.stringify(input, replacer);
	var outputValue = JSON.stringify(output, replacer);
	return inputValue === outputValue;
}

function cloneLine(line) {
	var output = {};
	var keys = Object.keys(line);
	for (var i = 0; i < keys.length; i++) {
		if (keys[i] !== "staff")
			output[keys[i]] = line[keys[i]];
		else {
			output.staff = [];
			for (var j = 0; j < line.staff.length; j++) {
				var staff = {};
				var keys2 = Object.keys(line.staff[j]);
				for (var k = 0; k < keys2.length; k++) {
					if (keys2[k] !== "voices")
						staff[keys2[k]] = line.staff[j][keys2[k]];
					else {
						staff.voices = [];
						for (var v = 0; v < line.staff[j].voices.length; v++) {
							staff.voices.push([].concat(line.staff[j].voices[v]));
						}
					}
				}
				output.staff.push(staff)
			}
		}
	}
	return output;
}

module.exports = delineTune;
