var allKeys = require("../const/all-keys");
var { relativeMajor, transposeKey, relativeMode } = require("../const/relative-major");
var transposeChordName = require("../parse/transpose-chord")

var strTranspose;

(function() {
	"use strict";
	strTranspose = function(abc, abcTune, steps) {
		var changes = [];
		var i;
		for (i = 0; i < abcTune.length; i++)
			changes = changes.concat(transposeOneTune(abc, abcTune[i], steps))

		// Reverse sort so that we are replacing strings from the end to the beginning so that the indexes aren't invalidated as we go.
		// (Because voices can be written in different ways we can't count on the notes being encountered in the order they appear in the string.)
		changes = changes.sort(function(a,b) {
			return b.start - a.start
		})
		//console.log(changes)
		var output = abc.split('')
		for (i = 0; i < changes.length; i++) {
			var ch = changes[i]
			output.splice(ch.start, ch.end-ch.start, ch.note)
		}
		return output.join('')
	}

	function transposeOneTune(abc, abcTune, steps) {
		var changes = []
		var k = abcTune.getKeySignature()
		var keySigDef = k.root + k.acc + k.mode
		var place = abc.indexOf("K:")+2
		while (abc[place] === ' ')
			place++;
		var destinationKey = newKey(k, steps)
		changes.push({start: place, end: place+keySigDef.length, note: destinationKey.root+destinationKey.acc+k.mode})

		for (var i = 0; i < abcTune.lines.length; i++) {
			if (abcTune.lines[i].staff) {
				for (var j = 0; j < abcTune.lines[i].staff.length; j++) {
					changes = changes.concat(transposeVoices(abc, abcTune.lines[i].staff[j].voices, abcTune.lines[i].staff[j].key, steps))
				}
			}
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
		var ret = { }
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
		var measureAccidentals = {}
		for (var i = 0; i < voice.length; i++) {
			var el = voice[i];
			if (el.chord) {
				for (var c = 0; c < el.chord.length; c++) {
					var ch = el.chord[c]
					if (ch.position === 'default') {
						var newChord = transposeChordName(ch.name, steps)
						changes.push(replaceChord(abc, el.startChar, el.endChar,newChord))
					}
				}
			}
			if (el.el_type === 'note' && el.pitches) {
				for (var j = 0; j < el.pitches.length; j++) {
					var note = parseNote(el.pitches[j].name, keyRoot, keyAccidentals, measureAccidentals)
					if (note.acc)
						measureAccidentals[note.name] = note.acc
					var newPitch = transposePitch(note, destinationKey)
					changes.push(replaceNote(abc, el.startChar, el.endChar, newPitch ))
					//console.log(abc.substring(el.startChar, el.endChar) + ': ' + newPitch)
				}
			} else if (el.el_type === "bar")
				measureAccidentals = {}
		}
		return changes
	}

	var letters = "ABCDEFG"
	var octaves = [",,,,",",,,",",,",",","","'", "''", "'''", "''''"]

	function newKey(key, steps) {
		var major = relativeMajor(key.root + key.acc + key.mode)
		var newMajor = transposeKey(major, steps)
		var newMode = relativeMode(newMajor)
		var acc = allKeys()[newMajor]
		return {root: newMode[0], mode: key.mode, acc: newMode.length>1?newMode[1]:'', accidentals: acc}
	}

	function transposePitch(note, key) {
		// TODO-PER: if the note crosses "c" then the octave changes, so that is true of "B" when going up one step, "A" and "B" when going up two steps, etc., and reverse when going down.
		var root = letters.indexOf(key.root)
		var index = (root + note.pitch) % 7
		var name = letters[index]
		// TODO-PER: figure out the accidental when there are key sig concerns
		var acc = '';
		switch (note.adj) {
			case -2: acc = "__"; break;
			case -1: acc = "_"; break;
			case 0: acc = ""; break;
			case 1: acc = "^"; break;
			case 2: acc = "^^"; break;
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
		if (name === reg[2])
			oct--;
		return {acc: reg[1], name: name, pitch: pos, oct: oct, adj: calcAdjustment(reg[1], keyAccidentals[name], measureAccidentals[name])}
	}

	function replaceNote(abc, start, end, newPitch ) {
		// There may be more than just the note between the start and end - there could be spaces, there could be a chord symbol, there could be a decoration.
		var note = abc.substring(start, end)
		var match = note.match(/([_^=]*[A-Ga-g][,']*)(\s*)$/)
		if (match) {
			var noteLen = match[1].length
			var trailingSpaceLen = match[2].length
			var leadingLen = end - start - noteLen - trailingSpaceLen
			// if (leadingLen || trailingSpaceLen)
			// 	console.log(note, leadingLen, noteLen, trailingSpaceLen)
			start += leadingLen
			end -= trailingSpaceLen
		}
		return {start: start, end: end, note: newPitch}
	}

	function replaceChord(abc, start, end, newChord ) {
		// Isolate the chord and just replace that
		var match = abc.substring(start, end).match(/([^"]+)?(".+")+/)
		if (match[1])
			start += match[1].length
		end = start + match[2].length	
		// leave the quote in, so skip one more
		return {start: start+1, end: end-1, note: newChord}
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
				switch(thisAccidental) {
					case '__': return -2;
					case '_': return -1;
					case '=': return 0;
					case '^': return 1;
					case '^^': return 2;
					default: return 0; // this should never happen
				}
			case '_':
				switch(thisAccidental) {
					case '__': return -1;
					case '_': return 0;
					case '=': return 1;
					case '^': return 2;
					case '^^': return 3;
					default: return 0; // this should never happen
				}
			case '^':
				switch(thisAccidental) {
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
