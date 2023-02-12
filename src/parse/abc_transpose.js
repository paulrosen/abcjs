//    abc_transpose.js: Handles the automatic transposition of key signatures, chord symbols, and notes.

var allNotes = require("./all-notes");
var transposeChordName = require("../parse/transpose-chord")
var keyAccidentals = require('../const/key-accidentals');
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

transpose.keySignature = function(multilineVars, keyName, root, acc, localTranspose) {
	if (multilineVars.clef.type === "perc" || multilineVars.clef.type === "none")
		return { accidentals: keyAccidentals(keyName), root: root, acc: acc };
	if (!localTranspose) localTranspose = 0;
	multilineVars.localTransposeVerticalMovement = 0;
	multilineVars.localTransposePreferFlats = false;
	var k = keyAccidentals(keyName);
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
	var thisKeyIndex = keyIndex[baseKey]
	var recognized = thisKeyIndex !== undefined
	if (!recognized) {
		// Either the key sig is "none" or we don't recognize it. Either way we don't change it, and we assume key of C for the purposes of this calculation.
		thisKeyIndex = 0
		baseKey = "C"
		keyName = ""
	}
	var index = thisKeyIndex + multilineVars.localTranspose;
	while (index < 0) index += 12;
	if (index > 11) index = index % 12;
	var newKeyName = (keyName[0] === 'm' ? newKeyMinor[index] : newKey[index]);
	var transposedKey = newKeyName + keyName;
	var newKeySig = keyAccidentals(transposedKey);
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
	if (recognized)
		return { accidentals: newKeySig, root: newKeyName[0], acc: newKeyName.length > 1 ? newKeyName[1] : "" };
	else
		return { accidentals: [], root: root, acc: acc };
};

transpose.chordName = function(multilineVars, chord) {
	return transposeChordName(chord, multilineVars.localTranspose, multilineVars.localTransposePreferFlats, multilineVars.freegchord)
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
var accidentals3 = {
	"-2": "__",
	"-1": "_",
	"0": "=",
	"1": "^",
	"2": "^^"
};
//var count = 0
transpose.note = function(multilineVars, el) {
	// the "el" that is passed in has el.name, el.accidental, and el.pitch. "pitch" is the vertical position (0=middle C)
	// localTranspose is the number of half steps
	// localTransposeVerticalMovement is the vertical distance to move.
	//console.log(count++,multilineVars.localTranspose, el)
	if (!multilineVars.localTranspose || multilineVars.clef.type === "perc")
		return;
	var origPitch = el.pitch;
	if (multilineVars.localTransposeVerticalMovement) {
		el.pitch = el.pitch + multilineVars.localTransposeVerticalMovement;
		if (el.name) {
			var actual = el.accidental ? el.name.substring(1) : el.name
			var acc = el.accidental ? el.name[0] : ''
			var p = allNotes.pitchIndex(actual)
			el.name = acc + allNotes.noteName(p+multilineVars.localTransposeVerticalMovement)
		}
	}

	if (el.accidental) {
		var ret = accidentalChange(origPitch, el.pitch, el.accidental, multilineVars.globalTransposeOrigKeySig, multilineVars.targetKey);
		el.pitch = ret[0];
		el.accidental = accidentals2[ret[1]];
		if (el.name) {
			el.name = accidentals3[ret[1]] + el.name.replace(/[_^=]/g,'');
		}
	}

};

module.exports = transpose;
