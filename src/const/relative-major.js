// All these keys have the same number of accidentals
var keys = {
	'C': { modes: ['Am', 'GMix', 'DDor', 'EPhr', 'FLyd', 'BLoc'], stepsFromC: 0 },
	'Db': { modes: ['Bbm', 'AbMix', 'EbDor', 'FPhr', 'GbLyd', 'CLoc'], stepsFromC: 1 },
	'D': { modes: ['Bm', 'AMix', 'EDor', 'F#Phr', 'GLyd', 'C#Loc'], stepsFromC: 2 },
	'Eb': { modes: ['Cm', 'BbMix', 'FDor', 'GPhr', 'AbLyd', 'DLoc'], stepsFromC: 3 },
	'E': { modes: ['C#m', 'BMix', 'F#Dor', 'G#Phr', 'ALyd', 'D#Loc'], stepsFromC: 4 },
	'F': { modes: ['Dm', 'CMix', 'GDor', 'APhr', 'BbLyd', 'ELoc'], stepsFromC: 5 },
	'Gb': { modes: ['Ebm', 'DbMix', 'AbDor', 'BbPhr', 'CbLyd', 'FLoc'], stepsFromC: 6 },
	'G': { modes: ['Em', 'DMix', 'ADor', 'BPhr', 'CLyd', 'F#Loc'], stepsFromC: 7 },
	'Ab': { modes: ['Fm', 'EbMix', 'BbDor', 'CPhr', 'DbLyd', 'GLoc'], stepsFromC: 8 },
	'A': { modes: ['F#m', 'EMix', 'BDor', 'C#Phr', 'DLyd', 'G#Loc'], stepsFromC: 9 },
	'Bb': { modes: ['Gm', 'FMix', 'CDor', 'DPhr', 'EbLyd', 'ALoc'], stepsFromC: 10 },
	'B': { modes: ['G#m', 'F#Mix', 'C#Dor', 'D#Phr', 'ELyd', 'A#Loc'], stepsFromC: 11 },
	// Enharmonic keys
	'C#': { modes: ['A#m', 'G#Mix', 'D#Dor', 'E#Phr', 'F#Lyd', 'B#Loc'], stepsFromC: 1 },
	'F#': { modes: ['D#m', 'C#Mix', 'G#Dor', 'A#Phr', 'BLyd', 'E#Loc'], stepsFromC: 6 },
	'Cb': { modes: ['Abm', 'GbMix', 'DbDor', 'EbPhr', 'FbLyd', 'BbLoc'], stepsFromC: 11 },
}

function relativeMajor(key) {
	// Translate a key to its relative major. If it doesn't exist, do the best we can
	// by just returning the original key.
	for (var i = 0;  i < Object.keys(keys).length; i++) {
		var k = Object.keys(keys)[i]
		if (k === key || keys[k].modes.indexOf(key) >= 0)
			return k;
	}
	return key;
}

function relativeMode(majorKey, mode) {
	// The reverse of the relativeMajor. Translate it back to the original mode.
	// If it isn't a recognized mode or it is already major, then just return the major key.
	var group = keys[majorKey]
	if (!group)
		return majorKey;
	if (mode === '')
		return majorKey;
	for (var i = 0; i < group.modes.length; i++) {
		if (group.modes[i].indexOf(mode) >= 0)
			return group.modes[i].replace(mode, '')
	}
	return majorKey;
}

function transposeKey(key, steps) {
	// This takes a major key and adds the desired steps.
	// It assigns each key a number that is the number of steps from C so that there can just be arithmetic.
	var match = keys[key]
	if (!match)
		return key;
	var fromC = (match.stepsFromC + steps) % 12;
	for (var i = 0;  i < Object.keys(keys).length; i++) {
		var k = Object.keys(keys)[i]
		if (keys[k].stepsFromC === fromC)
			return k;
	}
	return key;
}

module.exports = {relativeMajor: relativeMajor, relativeMode: relativeMode, transposeKey: transposeKey};
