//    abc_transpose.js: Handles the automatic transposition of key signatures, chord symbols, and notes.
//    Copyright (C) 2010-2018 Paul Rosen (paul at paulrosen dot net)
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

var transpose = {};

var keyIndex = {
	'C': 0,
	'C#': 1,
	'Db': 1,
	'D': 2,
	'D#': 3,
	'Eb': 3,
	'E': 4,
	'F': 5,
	'F#': 6,
	'Gb': 6,
	'G': 7,
	'G#': 8,
	'Ab': 8,
	'A': 9,
	'A#': 10,
	'Bb': 10,
	'B': 11
};
var newKey = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
var newKeyMinor = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];

transpose.keySignature = function(multilineVars, keys, keyName) {
	var k = keys[keyName];
	if (!k) return k;
	if (!multilineVars.globalTranspose)
		return k;
	if (multilineVars.globalTranspose % 12 === 0) {
		multilineVars.globalTransposeVerticalMovement = (multilineVars.globalTranspose / 12) * 7;
		return k;
	}

	var baseKey = keyName[0];
	if (keyName[1] === 'b' || keyName[1] === '#') {
		baseKey += keyName[1];
		keyName = keyName.substr(2);
	} else
		keyName = keyName.substr(1);
	var index = keyIndex[baseKey] + multilineVars.globalTranspose;
	while (index < 0) index += 12;
	if (index > 11) index = index % 12;
	var transposedKey = (keyName[0] === 'm' ? newKeyMinor[index] : newKey[index]) + keyName;
	var newKeySig = keys[transposedKey];
	if (newKeySig.length > 0 && newKeySig[0].acc === 'flat')
		multilineVars.globalTransposePreferFlats = true;
	var distance = transposedKey.charCodeAt(0) - baseKey.charCodeAt(0);
	if (multilineVars.globalTranspose > 0 && distance < 0)
		distance += 7;
	if (multilineVars.globalTranspose < 0 && distance > 0)
		distance -= 7;

	if (multilineVars.globalTranspose > 0)
		multilineVars.globalTransposeVerticalMovement = distance + Math.floor(multilineVars.globalTranspose / 12) * 7;
	else
		multilineVars.globalTransposeVerticalMovement = distance + Math.ceil(multilineVars.globalTranspose / 12) * 7;
	console.log("globalTransposeVerticalMovement", baseKey,
		transposedKey,
		multilineVars.globalTranspose,
		transposedKey.charCodeAt(0) - baseKey.charCodeAt(0),
		distance,
		Math.floor(multilineVars.globalTranspose / 12) * 7,
		Math.ceil(multilineVars.globalTranspose / 12) * 7,
		multilineVars.globalTransposeVerticalMovement);
	return newKeySig;
};

var sharpChords = [ 'C', 'C♯', 'D', "D♯", 'E', 'F', "F♯", 'G', 'G♯', 'A', 'A♯', 'B'];
var flatChords = [ 'C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];

transpose.chordName = function(multilineVars, chord) {
	if (multilineVars.globalTranspose && (multilineVars.globalTranspose % 12 !== 0)) { // The chords are the same if it is an exact octave change.
		var transposeFactor = multilineVars.globalTranspose;
		while (transposeFactor < 0) transposeFactor += 12;
		if (transposeFactor > 11) transposeFactor = transposeFactor % 12;
		chord = chord.replace(/C♭/g, "`~11`");
		chord = chord.replace(/D♭/g, "`~1`");
		chord = chord.replace(/E♭/g, "`~3`");
		chord = chord.replace(/F♭/g, "`~4`");
		chord = chord.replace(/G♭/g, "`~6`");
		chord = chord.replace(/A♭/g, "`~8`");
		chord = chord.replace(/B♭/g, "`~10`");
		chord = chord.replace(/C♯/g, "`~1`");
		chord = chord.replace(/D♯/g, "`~3`");
		chord = chord.replace(/E♯/g, "`~5`");
		chord = chord.replace(/F♯/g, "`~6`");
		chord = chord.replace(/G♯/g, "`~8`");
		chord = chord.replace(/A♯/g, "`~10`");
		chord = chord.replace(/B♯/g, "`~0`");
		chord = chord.replace(/C/g, "`~0`");
		chord = chord.replace(/D/g, "`~2`");
		chord = chord.replace(/E/g, "`~4`");
		chord = chord.replace(/F/g, "`~5`");
		chord = chord.replace(/G/g, "`~7`");
		chord = chord.replace(/A/g, "`~9`");
		chord = chord.replace(/B/g, "`~11`");
		var arr = chord.split("`");
		for (var i = 0; i < arr.length; i++) {
			if (arr[i][0] === '~') {
				var chordNum = parseInt(arr[i].substr(1),10);
				chordNum += transposeFactor;
				if (chordNum > 11) chordNum -= 12;
				arr[i] = multilineVars.globalTransposePreferFlats ? flatChords[chordNum] : sharpChords[chordNum];
			}
		}
		chord = arr.join("");
	}
	return chord;
};

var accidentals = {
	dblflat: -2,
	flat: -1,
	natural: 0,
	sharp: 1,
	dblsharp: 2
};
transpose.note = function(multilineVars, el) {
	// the "el" that is passed in has el.accidental, and el.pitch. "pitch" is the vertical position (0=middle C)
	// globalTranspose is the number of half steps
	// globalTransposeVerticalMovement is the vertical distance to move.

	if (!multilineVars.globalTranspose)
		return;
	el.pitch = el.pitch + multilineVars.globalTransposeVerticalMovement;

	// TODO-PER: Handle accidentals.

};

module.exports = transpose;
