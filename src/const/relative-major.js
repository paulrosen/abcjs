// All these keys have the same number of accidentals
var keys = {
	'C': { modes: ['CMaj', 'Amin', 'Am', 'GMix', 'DDor', 'EPhr', 'FLyd', 'BLoc'], stepsFromC: 0 },
	'Db': { modes: ['DbMaj', 'Bbmin', 'Bbm', 'AbMix', 'EbDor', 'FPhr', 'GbLyd', 'CLoc'], stepsFromC: 1 },
	'D': { modes: ['DMaj', 'Bmin', 'Bm', 'AMix', 'EDor', 'F#Phr', 'GLyd', 'C#Loc'], stepsFromC: 2 },
	'Eb': { modes: ['EbMaj', 'Cmin', 'Cm', 'BbMix', 'FDor', 'GPhr', 'AbLyd', 'DLoc'], stepsFromC: 3 },
	'E': { modes: ['EMaj', 'C#min', 'C#m', 'BMix', 'F#Dor', 'G#Phr', 'ALyd', 'D#Loc'], stepsFromC: 4 },
	'F': { modes: ['FMaj', 'Dmin', 'Dm', 'CMix', 'GDor', 'APhr', 'BbLyd', 'ELoc'], stepsFromC: 5 },
	'Gb': { modes: ['GbMaj', 'Ebmin', 'Ebm', 'DbMix', 'AbDor', 'BbPhr', 'CbLyd', 'FLoc'], stepsFromC: 6 },
	'G': { modes: ['GMaj', 'Emin', 'Em', 'DMix', 'ADor', 'BPhr', 'CLyd', 'F#Loc'], stepsFromC: 7 },
	'Ab': { modes: ['AbMaj', 'Fmin', 'Fm', 'EbMix', 'BbDor', 'CPhr', 'DbLyd', 'GLoc'], stepsFromC: 8 },
	'A': { modes: ['AMaj', 'F#min', 'F#m', 'EMix', 'BDor', 'C#Phr', 'DLyd', 'G#Loc'], stepsFromC: 9 },
	'Bb': { modes: ['BbMaj', 'Gmin', 'Gm', 'FMix', 'CDor', 'DPhr', 'EbLyd', 'ALoc'], stepsFromC: 10 },
	'B': { modes: ['BMaj', 'G#min', 'G#m', 'F#Mix', 'C#Dor', 'D#Phr', 'ELyd', 'A#Loc'], stepsFromC: 11 },
	// Enharmonic keys
	'C#': { modes: ['C#Maj', 'A#min', 'A#m', 'G#Mix', 'D#Dor', 'E#Phr', 'F#Lyd', 'B#Loc'], stepsFromC: 1 },
	'F#': { modes: ['F#Maj', 'D#min', 'D#m', 'C#Mix', 'G#Dor', 'A#Phr', 'BLyd', 'E#Loc'], stepsFromC: 6 },
	'Cb': { modes: ['CbMaj', 'Abmin', 'Abm', 'GbMix', 'DbDor', 'EbPhr', 'FbLyd', 'BbLoc'], stepsFromC: 11 },
}

var keyReverse = null

function createKeyReverse() {
	keyReverse = {}
	var allKeys = Object.keys(keys)
	for (var i = 0 ; i < allKeys.length; i++) {
		var keyObj = keys[allKeys[i]]
		keyReverse[allKeys[i].toLowerCase()] = allKeys[i];
		for (var j = 0; j < keyObj.modes.length; j++) {
			var mode = keyObj.modes[j].toLowerCase()
			keyReverse[mode] = allKeys[i];
		}
	}
}

function relativeMajor(key) {
	// Translate a key to its relative major. If it doesn't exist, do the best we can
	// by just returning the original key.
	// There are alternate spellings of these - so the search needs to be case insensitive.
	// To make this efficient, the first time this is called the "keys" object is reversed so this search is fast in the future
	if (!keyReverse) {
		createKeyReverse()
	}
	// get the key portion itself - there might be other stuff, like extra sharps and flats, or the mode written out.
	var mode = key.toLowerCase().match(/([a-g][b#]?)(maj|min|mix|dor|phr|lyd|loc|m)?/)
	if (!mode || !mode[2])
		return key;
	mode = mode[1] + mode[2]
	var maj = keyReverse[mode]
	if (maj)
		return maj;
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
	var match = mode.toLowerCase().match(/^(maj|min|mix|dor|phr|lyd|loc|m)/)	
	if (!match)
		return majorKey
	var regMode = match[1]	
	for (var i = 0; i < group.modes.length; i++) {
		var thisMode = group.modes[i]
		var ind = thisMode.toLowerCase().indexOf(regMode)
		if (ind !== -1 && ind === thisMode.length - regMode.length)
			return thisMode.substring(0, thisMode.length - regMode.length)
	}
	return majorKey;
}

function transposeKey(key, steps) {
	// This takes a major key and adds the desired steps.
	// It assigns each key a number that is the number of steps from C so that there can just be arithmetic.
	var match = keys[key]
	if (!match)
		return key;
	while (steps < 0) steps += 12;
	var fromC = (match.stepsFromC + steps) % 12;
	for (var i = 0;  i < Object.keys(keys).length; i++) {
		var k = Object.keys(keys)[i]
		if (keys[k].stepsFromC === fromC)
			return k;
	}
	return key;
}

module.exports = {relativeMajor: relativeMajor, relativeMode: relativeMode, transposeKey: transposeKey};
