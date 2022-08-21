var keyAccidentals = require("../const/key-accidentals");
var { relativeMajor, transposeKey, relativeMode } = require("../const/relative-major");
var transposeChordName = require("../parse/transpose-chord")

var strTranspose;

(function () {
	"use strict";
	strTranspose = function (abc, abcTune, steps) {
		if (abcTune === "TEST") // Backdoor way to get entry points for unit tests
			return { keyAccidentals: keyAccidentals, relativeMajor: relativeMajor, transposeKey: transposeKey, relativeMode: relativeMode, transposeChordName: transposeChordName}
		steps = parseInt(steps, 10)
		var changes = [];
		var i;
		for (i = 0; i < abcTune.length; i++)
			changes = changes.concat(transposeOneTune(abc, abcTune[i], steps))

		// Reverse sort so that we are replacing strings from the end to the beginning so that the indexes aren't invalidated as we go.
		// (Because voices can be written in different ways we can't count on the notes being encountered in the order they appear in the string.)
		changes = changes.sort(function (a, b) {
			return b.start - a.start
		})
		var output = abc.split('')
		for (i = 0; i < changes.length; i++) {
			var ch = changes[i]
			output.splice(ch.start, ch.end - ch.start, ch.note)
		}
		return output.join('')
	}

	function transposeOneTune(abc, abcTune, steps) {
		var changes = []

		// Don't transpose bagpipe music - that is a special case and is always a particular key
		var key = abcTune.getKeySignature()
		if (key.root === 'Hp' || key.root === "HP")
			return changes;

		changes = changes.concat(changeAllKeySigs(abc, steps))

		for (var i = 0; i < abcTune.lines.length; i++) {
			var staves = abcTune.lines[i].staff
			if (staves) {
				for (var j = 0; j < staves.length; j++) {
					var staff = staves[j]
					if (staff.clef.type !== "perc")
						changes = changes.concat(transposeVoices(abc, staff.voices, staff.key, steps))
				}
			}
		}
		return changes
	}

	function changeAllKeySigs(abc, steps) {
		var changes = [];
		var arr = abc.split("K:")
		// now each line except the first one will start with whatever is right after "K:"
		var count = arr[0].length
		for (var i = 1; i < arr.length; i++) {
			var segment = arr[i]
			var match = segment.match(/^( *)([A-G])([#b]?)(\w*)/)
			if (match) {
				var start = count + 2 + match[1].length // move past the 'K:' and optional white space
				var key = match[2] + match[3] + match[4] // key name, accidental, and mode
				var destinationKey = newKey({ root: match[2], acc: match[3], mode: match[4] }, steps)
				var dest = destinationKey.root + destinationKey.acc + destinationKey.mode
				changes.push({ start: start, end: start + key.length, note: dest })
			}
			count += segment.length + 2
		}
		return changes
	}

	function transposeVoices(abc, voices, key, steps) {
		var changes = [];
		var destinationKey = newKey(key, steps)
		for (var i = 0; i < voices.length; i++) {
			changes = changes.concat(transposeVoice(abc, voices[i], key.root, createKeyAccidentals(key), destinationKey, steps))
		}
		return changes
	}

	function createKeyAccidentals(key) {
		var ret = {}
		for (var i = 0; i < key.accidentals.length; i++) {
			var acc = key.accidentals[i];
			if (acc.acc === 'flat')
				ret[acc.note.toUpperCase()] = '_'
			else if (acc.acc === 'sharp')
				ret[acc.note.toUpperCase()] = '^'
		}
		return ret
	}

	function setLetterDistance(destinationKey, keyRoot, steps) {
		var letterDistance = letters.indexOf(destinationKey.root) - letters.indexOf(keyRoot)
		if (keyRoot === "none")
			letterDistance = letters.indexOf(destinationKey.root)
		if (letterDistance === 0) {
			// This could either be a half step (like Eb => E) or almost an octave (like E => Eb)
			if (steps > 2) // If it is a large leap, then we are going up an octave
				letterDistance += 7
			else if (steps === -12) // If it is a large leap, then we are going down an octave	
			 	letterDistance -= 7
		} else if (steps > 0 && letterDistance < 0) 
			letterDistance += 7
		else if (steps < 0 && letterDistance > 0) 
			letterDistance -= 7

		if (steps > 12)
			letterDistance += 7
		else if (steps < -12)
			letterDistance -= 7

		return letterDistance
	}

	function transposeVoice(abc, voice, keyRoot, keyAccidentals, destinationKey, steps) {
		var changes = []
		var letterDistance = setLetterDistance(destinationKey, keyRoot, steps)

		var measureAccidentals = {}
		var transposedMeasureAccidentals = {}
		for (var i = 0; i < voice.length; i++) {
			var el = voice[i];
			if (el.chord) {
				for (var c = 0; c < el.chord.length; c++) {
					var ch = el.chord[c]
					if (ch.position === 'default') {
						var prefersFlats = destinationKey.accidentals.length && destinationKey.accidentals[0].acc === 'flat'
						var newChord = transposeChordName(ch.name, steps, prefersFlats, true)
						newChord = newChord.replace(/♭/g, "b").replace(/♯/g, "#")
						if (newChord !== ch.name) // If we didn't recognize the chord the input is returned unchanged and there is nothing to replace
							changes.push(replaceChord(abc, el.startChar, el.endChar, newChord))
					}
				}
			}
			if (el.el_type === 'note' && el.pitches) {
				for (var j = 0; j < el.pitches.length; j++) {
					var note = parseNote(el.pitches[j].name, keyRoot, keyAccidentals, measureAccidentals)
					if (note.acc)
						measureAccidentals[note.name.toUpperCase()] = note.acc
					var newPitch = transposePitch(note, destinationKey, letterDistance, transposedMeasureAccidentals)
					if (newPitch.acc)
						transposedMeasureAccidentals[newPitch.upper] = newPitch.acc
					changes.push(replaceNote(abc, el.startChar, el.endChar, newPitch.acc + newPitch.name, j))
				}
				if (el.gracenotes) {
					for (var g = 0; g < el.gracenotes.length; g++) {
						var grace = parseNote(el.gracenotes[g].name, keyRoot, keyAccidentals, measureAccidentals)
						if (grace.acc)
							measureAccidentals[grace.name.toUpperCase()] = grace.acc
						var newGrace = transposePitch(grace, destinationKey, letterDistance, measureAccidentals)
						if (newGrace.acc)
							transposedMeasureAccidentals[newGrace.upper] = newGrace.acc
						changes.push(replaceGrace(abc, el.startChar, el.endChar, newGrace.acc + newGrace.name, g))
					}
				}
			} else if (el.el_type === "bar") {
				measureAccidentals = {}
				transposedMeasureAccidentals = {}
			} else if (el.el_type === "keySignature") {
				keyRoot = el.root
				keyAccidentals = createKeyAccidentals(el)
				destinationKey = newKey(el, steps)
				letterDistance = setLetterDistance(destinationKey, keyRoot, steps)
			}
		}
		return changes
	}

	var letters = "CDEFGAB"
	var octaves = [",,,,", ",,,", ",,", ",", "", "'", "''", "'''", "''''"]

	function newKey(key, steps) {
		if (key.root === "none") {
			return { root: transposeKey("C", steps), mode: "", acc: "", accidentals: [] }
		}
		var major = relativeMajor(key.root + key.acc + key.mode)
		var newMajor = transposeKey(major, steps)
		var newMode = relativeMode(newMajor, key.mode)
		var acc = keyAccidentals(newMajor)
		return { root: newMode[0], mode: key.mode, acc: newMode.length > 1 ? newMode[1] : '', accidentals: acc }
	}

	function transposePitch(note, key, letterDistance, measureAccidentals) {
		// Depending on what the current note and new note are, the octave might have changed
		// The letterDistance is how far the change is to see if we passed "C" when transposing.

		var pitch = note.pitch
		var origDistFromC = letters.indexOf(note.name)
		var root = letters.indexOf(key.root)
		var index = (root + pitch) % 7
		// if the note crosses "c" then the octave changes, so that is true of "B" when going up one step, "A" and "B" when going up two steps, etc., and reverse when going down.
		var newDistFromC = origDistFromC + letterDistance
		var oct = note.oct
		while (newDistFromC > 6) {
			oct++
			newDistFromC -= 7
		}
		while (newDistFromC < 0) {
			oct--
			newDistFromC += 7
		}

		var name = letters[index]

		var acc = '';
		var adj = note.adj
		// the amount of adjustment depends on the key - if there is a sharp in the key sig, then -1 is a natural, if there isn't, then -1 is a flat.
		var keyAcc = '=';
		for (var i = 0; i < key.accidentals.length; i++) {
			if (key.accidentals[i].note.toLowerCase() === name.toLowerCase()) {
				adj = adj + (key.accidentals[i].acc === 'flat' ? -1 : 1)
				keyAcc = (key.accidentals[i].acc === 'flat' ? '_' : '^')
				break;
			}
		}
		switch (adj) {
			case -2: acc = "__"; break;
			case -1: acc = "_"; break;
			case 0: acc = "="; break;
			case 1: acc = "^"; break;
			case 2: acc = "^^"; break;
			case -3:
				// This requires a triple flat, so bump down the pitch and try again
				var newNote = {}
				newNote.pitch = note.pitch - 1
				newNote.oct = note.oct
				newNote.name = letters[letters.indexOf(note.name) - 1]
				if (!newNote.name) {
					newNote.name = "B"
					newNote.oct--
				}
				if (newNote.name === "B" || newNote.name === "E")
					newNote.adj = note.adj + 1;
				else
					newNote.adj = note.adj + 2;
				return transposePitch(newNote, key, letterDistance + 1, measureAccidentals)
			case 3:
				// This requires a triple sharp, so bump up the pitch and try again
				var newNote = {}
				newNote.pitch = note.pitch + 1
				newNote.oct = note.oct
				newNote.name = letters[letters.indexOf(note.name) + 1]
				if (!newNote.name) {
					newNote.name = "C"
					newNote.oct++
				}
				if (newNote.name === "C" || newNote.name === "F")
					newNote.adj = note.adj - 1;
				else
					newNote.adj = note.adj - 2;
				return transposePitch(newNote, key, letterDistance + 1, measureAccidentals)
		}
		if ((measureAccidentals[name] === acc || (!measureAccidentals[name] && acc === keyAcc)) && !note.courtesy)
			acc = ""

		switch (oct) {
			case 0: name = name + ",,,"; break;
			case 1: name = name + ",,"; break;
			case 2: name = name + ","; break;
			// case 3: it is already correct
			case 4: name = name.toLowerCase(); break;
			case 5: name = name.toLowerCase() + "'"; break;
			case 6: name = name.toLowerCase() + "''"; break;
			case 7: name = name.toLowerCase() + "'''"; break;
			case 8: name = name.toLowerCase() + "''''"; break;
		}
		if (oct > 4)
			name = name.toLowerCase();

		return { acc: acc, name: name, upper: name.toUpperCase() }
	}

	var regPitch = /([_^=]*)([A-Ga-g])([,']*)/
	var regNote = /([_^=]*[A-Ga-g][,']*)(\d*\/*\d*)([\>\<\-\)\.\s\\]*)/
	var regOptionalNote = /([_^=]*[A-Ga-g][,']*)?(\d*\/*\d*)?([\>\<\-\)]*)?/
	var regSpace = /(\s*)$/

	// This the relationship of the note to the tonic and an octave. So what is returned is a distance in steps from the tonic and the amount of adjustment from
	// a normal scale. That is - in the key of D an F# is two steps from the tonic and no adjustment. A G# is three steps from the tonic and one half-step higher.
	// I don't think there is any adjustment needed for minor keys since the adjustment is based on the key signature and the accidentals.
	function parseNote(note, keyRoot, keyAccidentals, measureAccidentals) {
		var root = keyRoot === "none" ? 0 : letters.indexOf(keyRoot)
		var reg = note.match(regPitch)
		// reg[1] : "__", "_", "", "=", "^", or "^^"
		// reg[2] : A-G a-g
		// reg[3] : commas or apostrophes
		var name = reg[2].toUpperCase()
		var pos = letters.indexOf(name) - root;
		if (pos < 0) pos += 7
		var oct = octaves.indexOf(reg[3])
		if (name === reg[2]) // See if it is a capital letter and subtract an octave if so.
			oct--;
		var currentAcc = measureAccidentals[name] || keyAccidentals[name] || "=" //  use the key accidentals if they exist, but override with the measure accidentals, and if neither of them exist, use a natural.
		return { acc: reg[1], name: name, pitch: pos, oct: oct, adj: calcAdjustment(reg[1], keyAccidentals[name], measureAccidentals[name]), courtesy: reg[1] === currentAcc }
	}

	function replaceNote(abc, start, end, newPitch, index) {
		// There may be more than just the note between the start and end - there could be spaces, there could be a chord symbol, there could be a decoration.
		// This could also be a part of a chord. If so, then the particular note needs to be teased out.
		var note = abc.substring(start, end)
		var match = note.match(new RegExp(regNote.source + regSpace.source), '')
		if (match) {
			// This will match a single note
			var noteLen = match[1].length
			var trailingLen = match[2].length + match[3].length + match[4].length
			var leadingLen = end - start - noteLen - trailingLen
			start += leadingLen
			end -= trailingLen
		} else {
			// I don't know how to capture more than one note, so I'm separating them. There is a limit of the number of notes in a chord depending on the repeats I have here, but it is unlikely to happen in real music.
			var regPreBracket = /([^\[]*)/
			var regOpenBracket = /\[/
			var regCloseBracket = /\-?](\d*\/*\d*)?([\>\<\-\)]*)/
			match = note.match(new RegExp(regPreBracket.source + regOpenBracket.source + regOptionalNote.source +
				regOptionalNote.source + regOptionalNote.source + regOptionalNote.source +
				regOptionalNote.source + regOptionalNote.source + regOptionalNote.source +
				regOptionalNote.source + regCloseBracket.source + regSpace.source))

			if (match) {
				// This will match a chord
				// Get the number of chars used by the previous notes in this chord
				var count = 1 + match[1].length // one character for the open bracket
				for (var i = 0; i < index; i++) { // index is the iteration through the chord. This function gets called for each one.
					if (match[i * 3 + 2])
						count += match[i * 3 + 2].length
					if (match[i * 3 + 3])
						count += match[i * 3 + 3].length
					if (match[i * 3 + 4])
						count += match[i * 3 + 4].length
				}
				start += count
				var endLen = match[index * 3 + 2] ? match[index * 3 + 2].length : 0
				// endLen += match[index * 3 + 3] ? match[index * 3 + 3].length : 0
				// endLen += match[index * 3 + 4] ? match[index * 3 + 4].length : 0

				end = start + endLen
			}
		}
		return { start: start, end: end, note: newPitch }
	}

	function replaceGrace(abc, start, end, newGrace, index) {
		var note = abc.substring(start, end)
		// I don't know how to capture more than one note, so I'm separating them. There is a limit of the number of notes in a chord depending on the repeats I have here, but it is unlikely to happen in real music.
		var regOpenBrace = /\{/
		var regCloseBrace = /\}/
		var regPreBrace = /([^\{]*)/
		var regPreNote = /(\/*)/
		var match = note.match(new RegExp(regPreBrace.source + regOpenBrace.source + regPreNote.source + regOptionalNote.source +
			regPreNote.source + regOptionalNote.source + regPreNote.source + regOptionalNote.source + regPreNote.source + regOptionalNote.source +
			regPreNote.source + regOptionalNote.source + regPreNote.source + regOptionalNote.source + regPreNote.source + regOptionalNote.source +
			regPreNote.source + regOptionalNote.source + regCloseBrace.source))
		if (match) {
			// This will match all notes inside a grace symbol
			// Get the number of chars used by the previous graces
			var count = 1 + match[1].length // one character for the open brace, and whatever comes before the brace
			for (var i = 0; i < index; i++) { // index is the iteration through the chord. This function gets called for each one.
				if (match[i * 3 + 2])
					count += match[i * 3 + 2].length
				if (match[i * 3 + 3])
					count += match[i * 3 + 3].length
				if (match[i * 3 + 4])
					count += match[i * 3 + 4].length
				if (match[i * 3 + 5])
					count += match[i * 3 + 5].length
			}
			if (match[index * 3 + 2])
				count += match[i * 3 + 2].length
			start += count
			var endLen = match[index * 3 + 3] ? match[index * 3 + 3].length : 0
			endLen += match[index * 3 + 4] ? match[index * 3 + 4].length : 0
			endLen += match[index * 3 + 5] ? match[index * 3 + 5].length : 0

			end = start + endLen
		}
		return { start: start, end: end, note: newGrace }
	}

	function replaceChord(abc, start, end, newChord) {
		// Isolate the chord and just replace that
		var match = abc.substring(start, end).match(/([^"]+)?(".+")+/)
		if (match[1])
			start += match[1].length
		end = start + match[2].length
		// leave the quote in, so skip one more
		return { start: start + 1, end: end - 1, note: newChord }
	}

	function calcAdjustment(thisAccidental, keyAccidental, measureAccidental) {
		if (!thisAccidental && measureAccidental) {
			// There was no accidental on this note, but there was earlier in the measure, so we'll use that
			thisAccidental = measureAccidental
		}
		if (!thisAccidental)
			return 0; // there is no deviation from the key.

		switch (keyAccidental) {
			case undefined:
				switch (thisAccidental) {
					case '__': return -2;
					case '_': return -1;
					case '=': return 0;
					case '^': return 1;
					case '^^': return 2;
					default: return 0; // this should never happen
				}
			case '_':
				switch (thisAccidental) {
					case '__': return -1;
					case '_': return 0;
					case '=': return 1;
					case '^': return 2;
					case '^^': return 3;
					default: return 0; // this should never happen
				}
			case '^':
				switch (thisAccidental) {
					case '__': return -3;
					case '_': return -2;
					case '=': return -1;
					case '^': return 0;
					case '^^': return 1;
					default: return 0; // this should never happen
				}
		}
		return 0// this should never happen
	}
})();

module.exports = strTranspose;
