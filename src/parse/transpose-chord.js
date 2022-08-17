var sharpChords = ['C', 'C♯', 'D', "D♯", 'E', 'F', "F♯", 'G', 'G♯', 'A', 'A♯', 'B'];
var flatChords = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
var sharpChordsFree = ['C', 'C#', 'D', "D#", 'E', 'F', "F#", 'G', 'G#', 'A', 'A#', 'B'];
var flatChordsFree = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function transposeChordName(chord, steps, preferFlats, freeGCchord) {
	if (!steps || (steps % 12 === 0)) // The chords are the same if it is an exact octave change.
		return chord;

	// There are two things in the chord that might need to be transposed:
	// The chord will start with a letter from A-G, and might have one accidental after it.
	// That accidental might be an actual sharp or flat char, or it might be a pound sign or lower case "b".
	// Then there is a bunch of stuff that isn't transposed and should just be copied. That is stuff like "7" and more complicated chords.
	// But there is one other exception: right after a slash there will be a bass note and possibly an accidental. That should also be transposed.

	while (steps < 0) steps += 12;
	if (steps > 11) steps = steps % 12;

	// (chord name w/accidental) (a bunch of stuff) (/) (bass note) (anything else)
	var match = chord.match(/^([A-G][b#♭♯]?)([^\/]+)?\/?([A-G][b#♭♯]?)?(.+)?/)
	if (!match)
		return chord; // We don't recognize the format of the chord, so skip it.
	var name = match[1]
	var extra1 = match[2]
	var bass = match[3]
	var extra2 = match[4]
	var index = sharpChords.indexOf(name)
	if (index < 0)
		index = flatChords.indexOf(name)
	if (index < 0)
		index = sharpChordsFree.indexOf(name)
	if (index < 0)
		index = flatChordsFree.indexOf(name)
	if (index < 0)
		return chord; // This should never happen, but if we can't find the chord just bail.	

	index += steps
	index = index % 12

	if (preferFlats) {
		if (freeGCchord) chord = flatChordsFree[index]
		else chord = flatChords[index]
	} else {
		if (freeGCchord) chord = sharpChordsFree[index]
		else chord = sharpChords[index]
	}

	if (extra1)
		chord += extra1

	if (bass) {
		var index = sharpChords.indexOf(bass)
		if (index < 0)
			index = flatChords.indexOf(bass)
		if (index < 0)
			index = sharpChordsFree.indexOf(bass)
		if (index < 0)
			index = flatChordsFree.indexOf(bass)
		chord += '/'
		if (index >= 0) {
			index += steps
			index = index % 12
			if (preferFlats) {
				if (freeGCchord) chord += flatChordsFree[index]
				else chord += flatChords[index]
			} else {
				if (freeGCchord) chord += sharpChordsFree[index]
				else chord += sharpChords[index]
			}
		} else
			chord += bass; // Don't know what to do so do nothing
	}

	if (extra2)
		chord += extra2

	return chord;
}

module.exports = transposeChordName