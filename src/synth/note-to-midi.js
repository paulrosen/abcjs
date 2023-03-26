var accidentals = {
	"__": -2,
	"_": -1,
	"_/": -0.5,
	"=": 0,
	"": 0,
	"^/": 0.5,
	"^": 1,
	"^^": 2
}

var notesInOrder = ['C', '-', 'D', '-', 'E', 'F', '-', 'G', '-', 'A', '-', 'B', 'c', '-', 'd', '-', 'e', 'f', '-', 'g', '-', 'a', '-', 'b']

function noteToMidi(note) {
	var reg = note.match(/([_^\/]*)([ABCDEFGabcdefg])(,*)('*)/)
	if (reg && reg.length === 5) {
		var acc = accidentals[reg[1]]
		var pitch = notesInOrder.indexOf(reg[2])
		var octave = reg[4].length - reg[3].length
		return 48 + pitch + acc + octave * 12;
	}
	return 0;
}

function midiToNote(midi) {
	midi = parseInt(midi, 10) // TODO-PER: not sure how to handle quarter sharps and flats, so strip them for now.
	var octave = Math.floor(midi / 12)
	var pitch = midi % 12
	var name = notesInOrder[pitch]
	if (name === '-') {
		name = '^' + notesInOrder[pitch-1]
	}
	
	if (octave > 4) {
		name = name.toLowerCase()
		octave -= 5
		while (octave > 0) {
			name += "'"
			octave--
		}
	} else {
		while (octave < 4) {
			name += ','
			octave++
		}
	}	
	return name
}

module.exports = {noteToMidi: noteToMidi, midiToNote: midiToNote};
