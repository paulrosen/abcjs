var allNotes = {};

const allPitches = [
	'C,,,', 'D,,,', 'E,,,', 'F,,,', 'G,,,', 'A,,,', 'B,,,',
	'C,,', 'D,,', 'E,,', 'F,,', 'G,,', 'A,,', 'B,,',
	'C,', 'D,', 'E,', 'F,', 'G,', 'A,', 'B,',
	'C', 'D', 'E', 'F', 'G', 'A', 'B',
	'c', 'd', 'e', 'f', 'g', 'a', 'b',
	"c'", "d'", "e'", "f'", "g'", "a'", "b'",
	"c''", "d''", "e''", "f''", "g''", "a''", "b''",
	"c'''", "d'''", "e'''", "f'''", "g'''", "a'''", "b'''",
];

allNotes.pitchIndex = function(noteName) {
	return allPitches.indexOf(noteName)
}

allNotes.noteName = function(pitchIndex) {
	return allPitches[pitchIndex]
}

module.exports = allNotes;
