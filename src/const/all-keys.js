function allKeys() {
	var key1sharp = {acc: 'sharp', note: 'f'};
	var key2sharp = {acc: 'sharp', note: 'c'};
	var key3sharp = {acc: 'sharp', note: 'g'};
	var key4sharp = {acc: 'sharp', note: 'd'};
	var key5sharp = {acc: 'sharp', note: 'A'};
	var key6sharp = {acc: 'sharp', note: 'e'};
	var key7sharp = {acc: 'sharp', note: 'B'};
	var key1flat = {acc: 'flat', note: 'B'};
	var key2flat = {acc: 'flat', note: 'e'};
	var key3flat = {acc: 'flat', note: 'A'};
	var key4flat = {acc: 'flat', note: 'd'};
	var key5flat = {acc: 'flat', note: 'G'};
	var key6flat = {acc: 'flat', note: 'c'};
	var key7flat = {acc: 'flat', note: 'F'};

	var keys = {
		'C#': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'A#m': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'G#Mix': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'D#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'E#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'F#Lyd': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'B#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],

		'F#': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'D#m': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'C#Mix': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'G#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'A#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'BLyd': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],
		'E#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp ],

		'B': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'G#m': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'F#Mix': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'C#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'D#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'ELyd': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],
		'A#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp ],

		'E': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'C#m': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'BMix': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'F#Dor': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'G#Phr': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'ALyd': [ key1sharp, key2sharp, key3sharp, key4sharp ],
		'D#Loc': [ key1sharp, key2sharp, key3sharp, key4sharp ],

		'A': [ key1sharp, key2sharp, key3sharp ],
		'F#m': [ key1sharp, key2sharp, key3sharp ],
		'EMix': [ key1sharp, key2sharp, key3sharp ],
		'BDor': [ key1sharp, key2sharp, key3sharp ],
		'C#Phr': [ key1sharp, key2sharp, key3sharp ],
		'DLyd': [ key1sharp, key2sharp, key3sharp ],
		'G#Loc': [ key1sharp, key2sharp, key3sharp ],

		'D': [ key1sharp, key2sharp ],
		'Bm': [ key1sharp, key2sharp ],
		'AMix': [ key1sharp, key2sharp ],
		'EDor': [ key1sharp, key2sharp ],
		'F#Phr': [ key1sharp, key2sharp ],
		'GLyd': [ key1sharp, key2sharp ],
		'C#Loc': [ key1sharp, key2sharp ],

		'G': [ key1sharp ],
		'Em': [ key1sharp ],
		'DMix': [ key1sharp ],
		'ADor': [ key1sharp ],
		'BPhr': [ key1sharp ],
		'CLyd': [ key1sharp ],
		'F#Loc': [ key1sharp ],

		'C': [],
		'Am': [],
		'GMix': [],
		'DDor': [],
		'EPhr': [],
		'FLyd': [],
		'BLoc': [],

		'F': [ key1flat ],
		'Dm': [ key1flat ],
		'CMix': [ key1flat ],
		'GDor': [ key1flat ],
		'APhr': [ key1flat ],
		'BbLyd': [ key1flat ],
		'ELoc': [ key1flat ],

		'Bb': [ key1flat, key2flat ],
		'Gm': [ key1flat, key2flat ],
		'FMix': [ key1flat, key2flat ],
		'CDor': [ key1flat, key2flat ],
		'DPhr': [ key1flat, key2flat ],
		'EbLyd': [ key1flat, key2flat ],
		'ALoc': [ key1flat, key2flat ],

		'Eb': [ key1flat, key2flat, key3flat ],
		'Cm': [ key1flat, key2flat, key3flat ],
		'BbMix': [ key1flat, key2flat, key3flat ],
		'FDor': [ key1flat, key2flat, key3flat ],
		'GPhr': [ key1flat, key2flat, key3flat ],
		'AbLyd': [ key1flat, key2flat, key3flat ],
		'DLoc': [ key1flat, key2flat, key3flat ],

		'Ab': [ key1flat, key2flat, key3flat, key4flat ],
		'Fm': [ key1flat, key2flat, key3flat, key4flat ],
		'EbMix': [ key1flat, key2flat, key3flat, key4flat ],
		'BbDor': [ key1flat, key2flat, key3flat, key4flat ],
		'CPhr': [ key1flat, key2flat, key3flat, key4flat ],
		'DbLyd': [ key1flat, key2flat, key3flat, key4flat ],
		'GLoc': [ key1flat, key2flat, key3flat, key4flat ],

		'Db': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'Bbm': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'AbMix': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'EbDor': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'FPhr': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'GbLyd': [ key1flat, key2flat, key3flat, key4flat, key5flat ],
		'CLoc': [ key1flat, key2flat, key3flat, key4flat, key5flat ],

		'Gb': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'Ebm': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'DbMix': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'AbDor': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'BbPhr': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'CbLyd': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],
		'FLoc': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat ],

		'Cb': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'Abm': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'GbMix': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'DbDor': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'EbPhr': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'FbLyd': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],
		'BbLoc': [ key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat ],

		// The following are not in the 2.0 spec, but seem normal enough.
		// TODO-PER: These SOUND the same as what's written, but they aren't right
		'A#': [ key1flat, key2flat ],
		'B#': [],
		'D#': [ key1flat, key2flat, key3flat ],
		'E#': [ key1flat ],
		'G#': [ key1flat, key2flat, key3flat, key4flat ],
		'Gbm': [ key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp ],
		'none': []
	};

	return keys;
};

module.exports = allKeys;
