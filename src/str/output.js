var keyAccidentals = require("../const/key-accidentals");
var { relativeMajor, transposeKey, relativeMode } = require("../const/relative-major");
var transposeChordName = require("../parse/transpose-chord")

var strTranspose;

(function () {
	"use strict";
	strTranspose = function (abc, abcTune, steps) {
		var changes = [];
		var i;
		for (i = 0; i < abcTune.length; i++)
			changes = changes.concat(transposeOneTune(abc, abcTune[i], steps))

		// Reverse sort so that we are replacing strings from the end to the beginning so that the indexes aren't invalidated as we go.
		// (Because voices can be written in different ways we can't count on the notes being encountered in the order they appear in the string.)
		changes = changes.sort(function (a, b) {
			return b.start - a.start
		})
		//console.log(changes)
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
			if (abcTune.lines[i].staff) {
				for (var j = 0; j < abcTune.lines[i].staff.length; j++) {
					changes = changes.concat(transposeVoices(abc, abcTune.lines[i].staff[j].voices, abcTune.lines[i].staff[j].key, steps))
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
				var destinationKey = newKey({root: match[2], acc: match[3], mode: match[4]}, steps)
				var dest = destinationKey.root + destinationKey.acc + destinationKey.mode
				changes.push({start: start, end: start + key.length, note: dest})
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

	function transposeVoice(abc, voice, keyRoot, keyAccidentals, destinationKey, steps) {
		var changes = []
		var letterDistance = letters.indexOf(destinationKey.root) - letters.indexOf(keyRoot)
		if (steps > 12)
			letterDistance += 7
		else if (steps < -12)
			letterDistance -= 14
		else if (steps < 0)
			letterDistance -= 7

		var measureAccidentals = {}
		for (var i = 0; i < voice.length; i++) {
			var el = voice[i];
			if (el.chord) {
				for (var c = 0; c < el.chord.length; c++) {
					var ch = el.chord[c]
					if (ch.position === 'default') {
						var prefersFlats = destinationKey.accidentals.length && destinationKey.accidentals[0].acc === 'flat'
						var newChord = transposeChordName(ch.name, steps, prefersFlats, true)
						newChord = newChord.replace(/♭/g, "b").replace(/♯/g, "#")
						changes.push(replaceChord(abc, el.startChar, el.endChar, newChord))
					}
				}
			}
			if (el.el_type === 'note' && el.pitches) {
				for (var j = 0; j < el.pitches.length; j++) {
					var note = parseNote(el.pitches[j].name, keyRoot, keyAccidentals, measureAccidentals)
					var newPitch = transposePitch(note, destinationKey, letterDistance, measureAccidentals[note.name])
					if (note.acc)
						measureAccidentals[note.name] = note.acc
					changes.push(replaceNote(abc, el.startChar, el.endChar, newPitch, j))
					//console.log(abc.substring(el.startChar, el.endChar) + ': ' + newPitch)
				}
				if (el.gracenotes) {
					for (var g = 0; g < el.gracenotes.length; g++) {
						var grace = parseNote(el.gracenotes[g].name, keyRoot, keyAccidentals, measureAccidentals)
						var newGrace = transposePitch(grace, destinationKey, letterDistance, measureAccidentals[grace.name])
						if (grace.acc)
							measureAccidentals[grace.name] = grace.acc
						changes.push(replaceGrace(abc, el.startChar, el.endChar, newGrace, g))
					}
				}
			} else if (el.el_type === "bar")
				measureAccidentals = {}
		}
		return changes
	}

	var letters = "CDEFGAB"
	var octaves = [",,,,", ",,,", ",,", ",", "", "'", "''", "'''", "''''"]

	function newKey(key, steps) {
		if (key.root === "none")
			return key;
		var major = relativeMajor(key.root + key.acc + key.mode)
		var newMajor = transposeKey(major, steps)
		var newMode = relativeMode(newMajor, key.mode)
		var acc = keyAccidentals(newMajor)
		return { root: newMode[0], mode: key.mode, acc: newMode.length > 1 ? newMode[1] : '', accidentals: acc }
	}

	function transposePitch(note, key, letterDistance, measureAccidental) {
		// Depending on what the current note and new note are, the octave might have changed
		// The letterDistance is how far the change is to see if we passed "C" when transposing.

		// If there is an adjustment of 3 or -3 (if there is a flat in the key sig but the note has a double sharp, for instance), then bump the pitch a note.
		var pitch = note.pitch
		if (note.adj === 3) {
			pitch++
			note.adj -= 2
		} else if (note.adj === -3) {
			pitch--
			note.adj += 2
		}
		var root = letters.indexOf(key.root)
		var index = (root + pitch) % 7
		// TODO-PER: The octave crossing isn't complete. Check for going down below an octave and also transposing more than an octave.
		// if the note crosses "c" then the octave changes, so that is true of "B" when going up one step, "A" and "B" when going up two steps, etc., and reverse when going down.
		if (index - letterDistance < 0)
			note.oct++;

		var name = letters[index]

		var acc = '';
		if (note.adj) {
			var adj = note.adj
			// the amount of adjustment depends on the key - if there is a sharp in the key sig, then -1 is a natural, if there isn't, then -1 is a flat.
			for (var i = 0; i < key.accidentals.length; i++) {
				if (key.accidentals[i].note.toLowerCase() === name.toLowerCase()) {
					adj = adj + (key.accidentals[i].acc === 'flat' ? -1 : 1)
					break;
				}
			}
			switch (adj) {
				case -2: acc = "__"; break;
				case -1: acc = "_"; break;
				case 0: acc = "="; break;
				case 1: acc = "^"; break;
				case 2: acc = "^^"; break;
			}
			if (measureAccidental === acc)
				acc = ""
		}
		switch (note.oct) {
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
		if (note.oct > 4)
			name = name.toLowerCase();

		return acc + name
	}

	// This the relationship of the note to the tonic and an octave. So what is returned is a distance in steps from the tonic and the amount of adjustment from
	// a normal scale. That is - in the key of D an F# is two steps from the tonic and no adjustment. A G# is three steps from the tonic and one half-step higher.
	// I don't think there is any adjustment needed for minor keys since the adjustment is based on the key signature and the accidentals.
	function parseNote(note, keyRoot, keyAccidentals, measureAccidentals) {
		var root = letters.indexOf(keyRoot)
		var reg = note.match(/([_^=]*)([A-Ga-g])([,']*)/)
		// reg[1] : "__", "_", "", "=", "^", or "^^"
		// reg[2] : A-G a-g
		// reg[3] : commas or apostrophes
		var name = reg[2].toUpperCase()
		var pos = letters.indexOf(name) - root;
		if (pos < 0) pos += 7
		var oct = octaves.indexOf(reg[3])
		if (name === reg[2]) // See if it is a capital letter and subtract an octave if so.
			oct--;
		return { acc: reg[1], name: name, pitch: pos, oct: oct, adj: calcAdjustment(reg[1], keyAccidentals[name], measureAccidentals[name]) }
	}

	function replaceNote(abc, start, end, newPitch, index) {
		// There may be more than just the note between the start and end - there could be spaces, there could be a chord symbol, there could be a decoration.
		// This could also be a part of a chord. If so, then the particular note needs to be teased out.
		var note = abc.substring(start, end)
		var match = note.match(/([_^=]*[A-Ga-g][,']*)(\s*)$/)
		if (match) {
			// This will match a single note
			var noteLen = match[1].length
			var trailingSpaceLen = match[2].length
			var leadingLen = end - start - noteLen - trailingSpaceLen
			// if (leadingLen || trailingSpaceLen)
			// 	console.log(note, leadingLen, noteLen, trailingSpaceLen)
			start += leadingLen
			end -= trailingSpaceLen
		} else {
			// I don't know how to capture more than one note, so I'm separating them. There is a limit of the number of notes in a chord depending on the repeats I have here, but it is unlikely to happen in real music.
			match = note.match(/\[([_^=]*[A-Ga-g][,']*)([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?\](\s*)$/)
			if (match) {
				// This will match a chord
				// Get the number of chars used by the previous notes in this chord
				var count = 1 // one character for the open bracket
				for (var i = 1; i < index + 1; i++) { // index is the iteration through the chord. This function gets called for each one.
					count += match[i].length
				}
				start += count
				end = start + match[index + 1].length
			}
		}
		return { start: start, end: end, note: newPitch }
	}

	function replaceGrace(abc, start, end, newGrace, index) {
		var note = abc.substring(start, end)
		// I don't know how to capture more than one note, so I'm separating them. There is a limit of the number of notes in a chord depending on the repeats I have here, but it is unlikely to happen in real music.
		var match = note.match(/\{([_^=]*[A-Ga-g][,']*)([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?([_^=]*[A-Ga-g][,']*)?\}/)
		if (match) {
			// This will match all notes inside a grace symbol
			// Get the number of chars used by the previous graces
			var count = 1 // one character for the open brace
			for (var i = 1; i < index + 1; i++) { // index is the iteration through the chord. This function gets called for each one.
				count += match[i].length
			}
			start += count
			end = start + match[index + 1].length
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
