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

transpose.keySignature = function(multilineVars, keys, keyName, root, acc, localTranspose) {
	if (!localTranspose) localTranspose = 0;
	multilineVars.localTransposeVerticalMovement = 0;
	multilineVars.localTransposePreferFlats = false;
	var k = keys[keyName];
	if (!k) return multilineVars.key; // If the key isn't in the list, it is non-standard. We won't attempt to transpose it.
	multilineVars.localTranspose = (multilineVars.globalTranspose ? multilineVars.globalTranspose : 0) + localTranspose;

	if (!multilineVars.localTranspose)
		return { accidentals: k, root: root, acc: acc };
	multilineVars.globalTransposeOrigKeySig = k;
	if (multilineVars.localTranspose % 12 === 0) {
		multilineVars.localTransposeVerticalMovement = (multilineVars.localTranspose / 12) * 7;
		return { accidentals: k, root: root, acc: acc };
	}

	var baseKey = keyName[0];
	if (keyName[1] === 'b' || keyName[1] === '#') {
		baseKey += keyName[1];
		keyName = keyName.substr(2);
	} else
		keyName = keyName.substr(1);
	var index = keyIndex[baseKey] + multilineVars.localTranspose;
	while (index < 0) index += 12;
	if (index > 11) index = index % 12;
	var newKeyName = (keyName[0] === 'm' ? newKeyMinor[index] : newKey[index]);
	var transposedKey = newKeyName + keyName;
	var newKeySig = keys[transposedKey];
	if (newKeySig.length > 0 && newKeySig[0].acc === 'flat')
		multilineVars.localTransposePreferFlats = true;
	var distance = transposedKey.charCodeAt(0) - baseKey.charCodeAt(0);
	if (multilineVars.localTranspose > 0) {
		if (distance < 0)
			distance += 7;
		else if (distance === 0) {
			// There's a funny thing that happens when the key changes only an accidental's distance, for instance, from Ab to A.
			// If the distance is positive (we are raising pitch), and the change is higher (that is, Ab -> A), then raise an octave.
			// This test is easier because we know the keys are not equal (or we wouldn't get this far), so if the base key is a flat key, then
			// the transposed key must be higher. Likewise, if the transposed key is sharp, then the base key must be lower. And one
			// of those two things must be true because they are not both natural.
			if (baseKey[1] === '#' ||  transposedKey[1] === 'b')
				distance += 7;
		}
	} else if (multilineVars.localTranspose < 0) {
		if (distance > 0)
			distance -= 7;
		else if (distance === 0) {
			// There's a funny thing that happens when the key changes only an accidental's distance, for instance, from Ab to A.
			// If the distance is negative (we are dropping pitch), and the change is lower (that is, A -> Ab), then drop an octave.
			if (baseKey[1] === 'b' ||  transposedKey[1] === '#')
				distance -= 7;
		}
	}

	if (multilineVars.localTranspose > 0)
		multilineVars.localTransposeVerticalMovement = distance + Math.floor(multilineVars.localTranspose / 12) * 7;
	else
		multilineVars.localTransposeVerticalMovement = distance + Math.ceil(multilineVars.localTranspose / 12) * 7;
	return { accidentals: newKeySig, root: newKeyName[0], acc: newKeyName.length > 1 ? newKeyName[1] : "" };
};

var sharpChords = [ 'C', 'C♯', 'D', "D♯", 'E', 'F', "F♯", 'G', 'G♯', 'A', 'A♯', 'B'];
var flatChords = [ 'C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
var sharpChordsFree = [ 'C', 'C#', 'D', "D#", 'E', 'F', "F#", 'G', 'G#', 'A', 'A#', 'B'];
var flatChordsFree = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

transpose.chordName = function(multilineVars, chord) {
	if (multilineVars.localTranspose && (multilineVars.localTranspose % 12 !== 0)) { // The chords are the same if it is an exact octave change.
		var transposeFactor = multilineVars.localTranspose;
		while (transposeFactor < 0) transposeFactor += 12;
		if (transposeFactor > 11) transposeFactor = transposeFactor % 12;
		if (multilineVars.freegchord) {
			chord = chord.replace(/Cb/g, "`~11`");
			chord = chord.replace(/Db/g, "`~1`");
			chord = chord.replace(/Eb/g, "`~3`");
			chord = chord.replace(/Fb/g, "`~4`");
			chord = chord.replace(/Gb/g, "`~6`");
			chord = chord.replace(/Ab/g, "`~8`");
			chord = chord.replace(/Bb/g, "`~10`");
			chord = chord.replace(/C#/g, "`~1`");
			chord = chord.replace(/D#/g, "`~3`");
			chord = chord.replace(/E#/g, "`~5`");
			chord = chord.replace(/F#/g, "`~6`");
			chord = chord.replace(/G#/g, "`~8`");
			chord = chord.replace(/A#/g, "`~10`");
			chord = chord.replace(/B#/g, "`~0`");
		} else {
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
		}
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
				if (multilineVars.freegchord)
					arr[i] = multilineVars.localTransposePreferFlats ? flatChordsFree[chordNum] : sharpChordsFree[chordNum];
				else
					arr[i] = multilineVars.localTransposePreferFlats ? flatChords[chordNum] : sharpChords[chordNum];
			}
		}
		chord = arr.join("");
	}
	return chord;
};

var pitchToLetter = [ 'c', 'd', 'e', 'f', 'g', 'a', 'b' ];
function accidentalChange(origPitch, newPitch, accidental, origKeySig, newKeySig) {
	var origPitchLetter = pitchToLetter[(origPitch + 49) % 7]; // Make sure it is a positive pitch before normalizing.
	var origAccidental = 0;
	for (var i = 0; i < origKeySig.length; i++) {
		if (origKeySig[i].note.toLowerCase() === origPitchLetter)
			origAccidental = accidentals[origKeySig[i].acc];
	}

	var currentAccidental = accidentals[accidental];
	var delta = currentAccidental - origAccidental;

	var newPitchLetter = pitchToLetter[(newPitch + 49) % 7]; // Make sure it is a positive pitch before normalizing.
	var newAccidental = 0;
	for (var j = 0; j < newKeySig.accidentals.length; j++) {
		if (newKeySig.accidentals[j].note.toLowerCase() === newPitchLetter)
			newAccidental = accidentals[newKeySig.accidentals[j].acc];
	}
	var calcAccidental = delta + newAccidental;
	if (calcAccidental < -2) {
		newPitch--;
		calcAccidental += (newPitchLetter === 'c' || newPitchLetter === 'f') ? 1 : 2;
	}
	if (calcAccidental > 2) {
		newPitch++;
		calcAccidental -= (newPitchLetter === 'b' || newPitchLetter === 'e') ? 1 : 2;
	}
	return [newPitch, calcAccidental];
}

var accidentals = {
	dblflat: -2,
	flat: -1,
	natural: 0,
	sharp: 1,
	dblsharp: 2
};
var accidentals2 = {
	"-2": "dblflat",
	"-1": "flat",
	"0": "natural",
	"1": "sharp",
	"2": "dblsharp"
};
transpose.note = function(multilineVars, el) {
	// the "el" that is passed in has el.accidental, and el.pitch. "pitch" is the vertical position (0=middle C)
	// localTranspose is the number of half steps
	// localTransposeVerticalMovement is the vertical distance to move.
	if (!multilineVars.localTranspose)
		return;
	var origPitch = el.pitch;
	el.pitch = el.pitch + multilineVars.localTransposeVerticalMovement;

	if (el.accidental) {
		var ret = accidentalChange(origPitch, el.pitch, el.accidental, multilineVars.globalTransposeOrigKeySig, multilineVars.targetKey);
		el.pitch = ret[0];
		el.accidental = accidentals2[ret[1]];
	}

};

module.exports = transpose;
