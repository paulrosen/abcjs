var { relativeMajor } = require("./relative-major");

var key1sharp = { acc: 'sharp', note: 'f' };
var key2sharp = { acc: 'sharp', note: 'c' };
var key3sharp = { acc: 'sharp', note: 'g' };
var key4sharp = { acc: 'sharp', note: 'd' };
var key5sharp = { acc: 'sharp', note: 'A' };
var key6sharp = { acc: 'sharp', note: 'e' };
var key7sharp = { acc: 'sharp', note: 'B' };
var key1flat = { acc: 'flat', note: 'B' };
var key2flat = { acc: 'flat', note: 'e' };
var key3flat = { acc: 'flat', note: 'A' };
var key4flat = { acc: 'flat', note: 'd' };
var key5flat = { acc: 'flat', note: 'G' };
var key6flat = { acc: 'flat', note: 'c' };
var key7flat = { acc: 'flat', note: 'F' };

var keys = {
	'C#': [key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp, key7sharp],
	'F#': [key1sharp, key2sharp, key3sharp, key4sharp, key5sharp, key6sharp],
	'B': [key1sharp, key2sharp, key3sharp, key4sharp, key5sharp],
	'E': [key1sharp, key2sharp, key3sharp, key4sharp],
	'A': [key1sharp, key2sharp, key3sharp],
	'D': [key1sharp, key2sharp],
	'G': [key1sharp],
	'C': [],
	'F': [key1flat],
	'Bb': [key1flat, key2flat],
	'Eb': [key1flat, key2flat, key3flat],
	'Cm': [key1flat, key2flat, key3flat],
	'Ab': [key1flat, key2flat, key3flat, key4flat],
	'Db': [key1flat, key2flat, key3flat, key4flat, key5flat],
	'Gb': [key1flat, key2flat, key3flat, key4flat, key5flat, key6flat],
	'Cb': [key1flat, key2flat, key3flat, key4flat, key5flat, key6flat, key7flat],

	// The following are not in the 2.0 spec, but seem normal enough.
	// TODO-PER: These SOUND the same as what's written, but they aren't right
	'A#': [key1flat, key2flat],
	'B#': [],
	'D#': [key1flat, key2flat, key3flat],
	'E#': [key1flat],
	'G#': [key1flat, key2flat, key3flat, key4flat],
	'none': [],
};

function keyAccidentals(key) {
	var newKey = keys[relativeMajor(key)]
	if (!newKey) // If we don't recognize the key then there is no change
		return null
	return JSON.parse(JSON.stringify(newKey))
};

module.exports = keyAccidentals;
