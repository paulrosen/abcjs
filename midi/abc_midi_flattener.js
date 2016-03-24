//    abc_midi_create.js: Turn a linear series of events into a series of MIDI commands.
//    Copyright (C) 2010,2016 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

// We input a set of voices, but the notes are still complex. This pass changes the logical definitions
// of the grace notes, decorations, ties, triplets, rests, transpositions, keys, and accidentals into actual note durations.
// It also extracts guitar chords to a separate voice and resolves their rhythm.

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.midi)
	window.ABCJS.midi = {};

(function() {
	"use strict";

	var barAccidentals;
	var accidentals;
	var transpose;
	var bagpipes;
	var multiplier;
	var tracks;
	var startingTempo;
	var tempoChangeFactor = 1;
	var instrument;
	var channel;
	var currentTrack;
	var pitchesTied;
	var lastNoteDurationPosition;

	var meter;
	var chordTrack;
	var chordTrackFinished;
	var currentChords;
	var lastChord;
	var barBeat;

	var normalBreakBetweenNotes = 1.0/128;	// a 128th note of silence between notes for articulation.

	window.ABCJS.midi.flatten = function(voices) {
		barAccidentals = [];
		accidentals = [0,0,0,0,0,0,0];
		transpose = 0;
		bagpipes = false;
		multiplier = 1;
		tracks = [];
		startingTempo = undefined;
		tempoChangeFactor = 1;
		instrument = undefined;
		channel = undefined;
		currentTrack = undefined;
		pitchesTied = {};
		lastNoteDurationPosition = -1;

		// For resolving chords.
		meter = undefined;
		chordTrack = [];
		chordTrackFinished = false;
		currentChords = [];
		lastChord = undefined;
		barBeat = 0;

		for (var i = 0; i < voices.length; i++) {
			var voice = voices[i];
			currentTrack = [];
			pitchesTied = {};
			for (var j = 0; j < voice.length; j++) {
				var element = voice[j];
				switch (element.el_type) {
					case "note":
						writeNote(element);
						break;
					case "key":
						accidentals = setKeySignature(element);
						break;
					case "meter":
						meter = element;
						break;
					case "tempo":
						if (!startingTempo)
							startingTempo = element.qpm;
						else
							tempoChangeFactor = element.qpm ? startingTempo / element.qpm : 1;
						break;
					case "transpose":
						transpose = element.transpose;
						break;
					case "bar":
						if (chordTrack.length > 0) {
							resolveChords();
							currentChords = [];
						}
						barBeat = 0;
						barAccidentals = [];
						break;
					case "bagpipes":
						bagpipes = true;
						break;
					case "instrument":
						instrument = element.program;
						break;
					case "channel":
						channel = element.channel;
						break;
					default:
						// This should never happen
						console.log("MIDI creation. Unknown el_type: " + element.el_type + "\n");// jshint ignore:line
						break;
				}
			}
			tracks.push(currentTrack);
			if (chordTrack.length > 0) // Don't do chords on more than one track, so turn off chord detection after we create it.
				chordTrackFinished = true;
		}
		if (chordTrack.length > 0)
			tracks.push(chordTrack);
		return { tempo: startingTempo, instrument: instrument, channel: channel, tracks: tracks };
	};

	//
	// The algorithm for chords is:
	// - The chords are done in a separate track.
	// - If there are notes before the first chord, then put that much silence to start the track.
	// - The pattern of chord expression depends on the meter, and how many chords are in a measure.
	// - There is a possibility that a measure will have an incorrect number of beats, if that is the case, then
	// start the pattern anew on the next measure number.
	// - If a chord root is not A-G, then ignore it as if the chord wasn't there at all.
	// - If a chord modification isn't in our supported list, change it to a major triad.
	//
	// - If there is only one chord in a measure:
	//		- If 2/4, play root chord
	//		- If cut time, play root(1) chord(3)
	//		- If 3/4, play root chord chord
	//		- If 4/4 or common time, play root chord fifth chord
	//		- If 6/8, play root(1) chord(3) fifth(4) chord(6)
	//		- For any other meter, play the full chord on each beat. (TODO-PER: expand this as more support is added.)
	//
	//	- If there is a chord specified that is not on a beat, move it earlier to the previous beat, unless there is already a chord on that beat.
	//	- Otherwise, move it later, unless there is already a chord on that beat.
	// 	- Otherwise, ignore it. (TODO-PER: expand this as more support is added.)
	//
	// - If there is a chord on the second beat, play a chord for the first beat instead of a bass note.
	// - Likewise, if there is a chord on the fourth beat of 4/4, play a chord on the third beat instead of a bass note.
	//
	var breakSynonyms = [ 'break', '(break)', 'no chord', 'n.c.', 'tacet'];

	function findChord(elem) {
		// TODO-PER: Just using the first chord if there are more than one.
		if (chordTrackFinished || !elem.chord || elem.chord.length === 0)
			return null;

		// Return the first annotation that is a regular chord: that is, it is in the default place or is a recognized "tacit" phrase.
		for (var i = 0; i < elem.chord.length; i++) {
			var ch = elem.chord[i];
			if (ch.position === 'default')
				return ch.name;
			if (breakSynonyms.indexOf(ch.name.toLowerCase()) >= 0)
				return 'break';
		}
		return null;
	}

	function writeNote(elem) {
		//
		// Create a series of note events to append to the current track.
		// The output event is one of: { pitchStart: pitch_in_abc_units, volume: from_1_to_64 }
		// { pitchStop: pitch_in_abc_units }
		// { moveTime: duration_in_abc_units }
		// If there are guitar chords, then they are put in a separate track, but they have the same format.
		//

		var chord = findChord(elem);
		if (chord) {
			var c = interpretChord(chord);
			// If this isn't a recognized chord, just completely ignore it.
			if (c) {
				// If we ever have a chord in this voice, then we add the chord track.
				// However, if there are chords on more than one voice, then just use the first voice.
				if (chordTrack.length === 0) {
					chordTrack.push({cmd: 'instrument', instrument: 0});
					// need to figure out how far in time the chord started: if there are pickup notes before the chords start, we need pauses.
					var distance = 0;
					for (var ct = 0; ct < currentTrack.length; ct++) {
						if (currentTrack[ct].cmd === 'move')
							distance += currentTrack[ct].duration;
					}
					if (distance > 0)
						chordTrack.push({cmd: 'move', duration: distance*tempoChangeFactor });
				}

				lastChord = c;
				currentChords.push({chord: lastChord, beat: barBeat});
			}
		}

		if (elem.startTriplet) {
			if (elem.startTriplet === 2)
				multiplier = 3/2;
			else
				multiplier=(elem.startTriplet-1)/elem.startTriplet;
		}

		var duration = elem.duration*multiplier;
		barBeat += duration;

		// if there are grace notes, then also play them.
		// I'm not sure there is an exact rule for the length of the notes. My rule, unless I find
		// a better one is: the grace notes cannot take more than 1/2 of the main note's value.
		// A grace note (of 1/8 note duration) takes 1/8 of the main note's value.
		var graces;
		if (elem.gracenotes) {
			// There are two cases: if this is bagpipe, the grace notes are played on the beat with the current note.
			// Normally, the grace notes would be played before the beat. (If this is the first note in the track, however, then it is played on the current beat.)
			// The reason for the exception on the first note is that it would otherwise move the whole track in time and would affect all the other tracks.
			var stealFromCurrent = (bagpipes || lastNoteDurationPosition < 0);
			var stealFromDuration = stealFromCurrent ? duration : currentTrack[lastNoteDurationPosition].duration;
			graces = processGraceNotes(elem.gracenotes, stealFromDuration);
			if (!bagpipes) {
				duration = writeGraceNotes(graces, stealFromCurrent, duration);
			}
		}

		if (elem.pitches) {
			if (graces && bagpipes) {
				// If it is bagpipes, then the graces are played with the note. If the grace has the same pitch as the note, then we just skip it.
				duration = writeGraceNotes(graces, true, duration);
			}
			var pitches = [];
			for (var i=0; i<elem.pitches.length; i++) {
				var note = elem.pitches[i];
				var actualPitch = adjustPitch(note);
				pitches.push({ pitch: actualPitch, startTie: note.startTie });

				// TODO-PER: should the volume vary depending on whether it is on a beat or measure start?
				if (!pitchesTied[''+actualPitch])	// If this is the second note of a tie, we don't start it again.
					currentTrack.push({ cmd: 'start', pitch: actualPitch, volume: 64 });

				if (note.startTie)
					pitchesTied[''+actualPitch] = true;
				else if (note.endTie)
					pitchesTied[''+actualPitch] = false;
			}
			currentTrack.push({ cmd: 'move', duration: (duration-normalBreakBetweenNotes)*tempoChangeFactor });
			lastNoteDurationPosition = currentTrack.length-1;

			for (var ii = 0; ii < pitches.length; ii++) {
				if (!pitchesTied[''+pitches[ii].pitch])
					currentTrack.push({ cmd: 'stop', pitch: pitches[ii].pitch });
			}
			currentTrack.push({ cmd: 'move', duration: normalBreakBetweenNotes*tempoChangeFactor });
		} else if (elem.rest) {
			currentTrack.push({ cmd: 'move', duration: duration*tempoChangeFactor });
		}

		if (elem.endTriplet) {
			multiplier=1;
		}
	}

	var scale = [0,2,4,5,7,9,11];
	function adjustPitch(note) {
		var pitch = note.pitch;
		if (note.accidental) {
			switch(note.accidental) { // change that pitch (not other octaves) for the rest of the bar
				case "sharp":
					barAccidentals[pitch]=1; break;
				case "flat":
					barAccidentals[pitch]=-1; break;
				case "natural":
					barAccidentals[pitch]=0; break;
				case "dblsharp":
					barAccidentals[pitch]=2; break;
				case "dblflat":
					barAccidentals[pitch]=-2; break;
			}
		}

		var actualPitch = extractOctave(pitch) *12 + scale[extractNote(pitch)];

		if ( barAccidentals[pitch]!==undefined) {
			actualPitch +=  barAccidentals[pitch];
		} else { // use normal accidentals
			actualPitch +=  accidentals[extractNote(pitch)];
		}
		actualPitch += transpose;
		return actualPitch;
	}

	function setKeySignature(elem) {
		var accidentals = [0,0,0,0,0,0,0];
		if (!elem.accidentals) return accidentals;
		for (var i = 0; i < elem.accidentals.length; i++) {
			var acc = elem.accidentals[i];
			var d = (acc.acc === "sharp") ? 1 : (acc.acc === "natural") ?0 : -1;

			var lowercase = acc.note.toLowerCase();
			var note = extractNote(lowercase.charCodeAt(0)-'c'.charCodeAt(0));
			accidentals[note]+=d;
		}
		return accidentals;
	}

	var graceDivider = 8; // This is the fraction of a note that the grace represents. That is, if this is 2, then a grace note of 1/16 would be a 1/32.
	function processGraceNotes(graces, companionDuration) {
		var graceDuration = 0;
		var ret = [];
		var grace;
		for (var g = 0; g < graces.length; g++) {
			grace = graces[g];
			graceDuration += grace.duration;
		}
		graceDuration = graceDuration / graceDivider;
		var multiplier = (graceDuration * 2 > companionDuration) ? companionDuration/(graceDuration * 2) : 1;

		for (g = 0; g < graces.length; g++) {
			grace = graces[g];
			ret.push({ pitch: grace.pitch, duration: grace.duration/graceDivider*multiplier });
		}
		return ret;
	}

	function writeGraceNotes(graces, stealFromCurrent, duration, skipNote) {
		for (var g = 0; g < graces.length; g++) {
			var gp = adjustPitch(graces[g]);
			if (gp !== skipNote)
				currentTrack.push({cmd: 'start', pitch: gp, volume: 64});
			currentTrack.push({cmd: 'move', duration: graces[g].duration*tempoChangeFactor });
			if (gp !== skipNote)
				currentTrack.push({cmd: 'stop', pitch: gp});
			if (!stealFromCurrent)
				currentTrack[lastNoteDurationPosition].duration -= graces[g].duration;
			duration -= graces[g].duration;
		}
		return duration;
	}

	function extractOctave(pitch) {
		return Math.floor(pitch/7);
	}

	function extractNote(pitch) {
		pitch = pitch%7;
		if (pitch<0) pitch+=7;
		return pitch;
	}

	var basses = {
		'A': -27, 'B': -25, 'C': -24, 'D': -22, 'E': -20, 'F': -19, 'G': -17
	};
	function interpretChord(name) {
		// chords have the format:
		// [root][acc][modifier][/][bass][acc]
		// (The chord might be surrounded by parens. Just ignore them.)
		// root must be present and must be from A-G.
		// acc is optional and can be # or b
		// The modifier can be a wide variety of things, like "maj7". As they are discovered, more are supported here.
		// If there is a slash, then there is a bass note, which can be from A-G, with an optional acc.
		// If the root is unrecognized, then "undefined" is returned and there is no chord.
		// If the modifier is unrecognized, a major triad is returned.
		// If the bass notes is unrecognized, it is ignored.
		if (name.length === 0)
			return undefined;
		if (name === 'break')
			return { chick: []};
		var root = name.substring(0,1);
		if (root === '(') {
			name = name.substring(1,name.length-2);
			if (name.length === 0)
				return undefined;
			root = name.substring(0,1);
		}
		var bass = basses[root];
		if (!bass)	// If the bass note isn't listed, then this was an unknown root. Only A-G are accepted.
			return undefined;
		bass  += transpose;
		var bass2 = bass - 5;	// The alternating bass is a 4th below
		var chick;
		if (name.length === 1)
			chick = chordNotes(bass, '');
		var remaining = name.substring(1);
		var acc = remaining.substring(0,1);
		if (acc === 'b' || acc === '♭') {
			bass--;
			bass2--;
			remaining = remaining.substring(1);
		} else if (acc === '#' || acc === '♯') {
			bass++;
			bass2++;
			remaining = remaining.substring(1);
		}
		var arr = remaining.split('/');
		chick = chordNotes(bass, arr[0]);
		if (arr.length === 2) {
			var explicitBass = basses[arr[1]];
			if (explicitBass) {
				bass = basses[arr[1]] + transpose;
				bass2 = bass;
			}
		}
		return { boom: bass, boom2: bass2, chick: chick };
	}

	var chordIntervals = {
		'M': [ 0, 4, 7 ],
		'6': [ 0, 4, 7, 9 ],
		'7': [ 0, 4, 7, 10 ],
		'+7': [ 0, 4, 8, 10 ],
		'aug7': [ 0, 4, 8, 10 ],
		'maj7': [ 0, 4, 7, 11 ],
		'∆7': [ 0, 4, 7, 11 ],
		'9': [ 0, 4, 7, 10, 14 ],
		'11': [ 0, 4, 7, 10, 14, 16 ], // TODO-PER: check this one.
		'13': [ 0, 4, 7, 10, 14, 18 ], // TODO-PER: check this one.
		'+': [ 0, 4, 8 ],
		'7#5': [ 0, 4, 8, 10 ],
		'7+5': [ 0, 4, 8, 10 ],
		'7b9': [ 0, 4, 7, 10, 13 ],
		'7b5': [ 0, 4, 6, 10 ],
		'9#5': [ 0, 4, 8, 10, 14 ],
		'9+5': [ 0, 4, 8, 10, 14 ],
		'm': [ 0, 3, 7 ],
		'-': [ 0, 3, 7 ],
		'm6': [ 0, 3, 7, 9 ],
		'-6': [ 0, 3, 7, 9 ],
		'm7': [ 0, 3, 7, 10 ],
		'-7': [ 0, 3, 7, 10 ],
		'dim': [ 0, 3, 6 ],
		'dim7': [ 0, 3, 6, 9 ],
		'°7': [ 0, 3, 6, 9 ],
		'ø7': [ 0, 3, 6, 9 ],	// TODO-PER: check this one.
		'7sus4': [ 0, 5, 7, 10 ],
		'm7sus4': [ 0, 5, 7, 10 ],	// TODO-PER: check this one.
		'sus4': [ 0, 5, 7 ]
	};
	function chordNotes(bass, modifier) {
		var intervals = chordIntervals[modifier];
		if (!intervals)
			intervals = chordIntervals.M;
		bass += 12;	// the chord is an octave above the bass note.
		var notes = [ ];
		for (var i = 0; i < intervals.length; i++) {
			notes.push(bass + intervals[i]);
		}
		return notes;
	}

	function writeBoom(boom, beatLength) {
		// undefined means there is a stop time.
		if (boom !== undefined)
			chordTrack.push({cmd: 'start', pitch: boom, volume: 64});
		chordTrack.push({ cmd: 'move', duration: (beatLength/2)*tempoChangeFactor });
		if (boom !== undefined)
			chordTrack.push({ cmd: 'stop', pitch: boom });
		chordTrack.push({ cmd: 'move', duration: (beatLength/2)*tempoChangeFactor });
	}

	function writeChick(chick, beatLength) {
		for (var c = 0; c < chick.length; c++)
			chordTrack.push({cmd: 'start', pitch: chick[c], volume: 48});
		chordTrack.push({ cmd: 'move', duration: (beatLength/2)*tempoChangeFactor });
		for (c = 0; c < chick.length; c++)
			chordTrack.push({ cmd: 'stop', pitch: chick[c] });
		chordTrack.push({ cmd: 'move', duration: (beatLength/2)*tempoChangeFactor });
	}

	var rhythmPatterns = { "2/2": [ 'boom', 'chick' ],
		"2/4": [ 'boom', 'chick' ],
		"3/4": [ 'boom', 'chick', 'chick' ],
		"4/4": [ 'boom', 'chick', 'boom2', 'chick' ],
		"6/8": [ 'boom', '', 'chick', 'boom2', '', 'chick' ]
	};

	function resolveChords() {
		var num = meter.num;
		var den = meter.den;
		var beatLength = 1/den;
		var pattern = rhythmPatterns[num+'/'+den];
		var thisMeasureLength = parseInt(num,10)/parseInt(den,10);
		// See if this is a full measure: unfortunately, with triplets, there isn't an exact match, what with the floating point, so we just see if it is "close".
		var portionOfAMeasure = Math.abs(thisMeasureLength - barBeat);
		if (!pattern || portionOfAMeasure > 0.0078125) { // If it is an unsupported meter, or this isn't a full bar, just chick on each beat.
			pattern = [];
			var beatsPresent = barBeat / beatLength;
			for (var p = 0; p < beatsPresent; p++)
				pattern.push("chick");
		}

		if (currentChords.length === 0) { // there wasn't a new chord this measure, so use the last chord declared.
			currentChords.push({ beat: 0, chord: lastChord});
		}
		if (currentChords[0].beat !== 0 && lastChord) { // this is the case where there is a chord declared in the measure, but not on its first beat.
			currentChords.unshift({ beat: 0, chord: lastChord});
		}
		if (currentChords.length === 1) {
			for (var m = 0; m < pattern.length; m++) {
				switch (pattern[m]) {
					case 'boom':
						writeBoom(currentChords[0].chord.boom, beatLength);
						break;
					case 'boom2':
						writeBoom(currentChords[0].chord.boom2, beatLength);
						break;
					case 'chick':
						writeChick(currentChords[0].chord.chick, beatLength);
						break;
					case '':
						chordTrack.push({ cmd: 'move', duration: beatLength*tempoChangeFactor });
						break;
				}
			}
			return;
		}

		// If we are here it is because more than one chord was declared in the measure, so we have to sort out what chord goes where.

		// First, normalize the chords on beats.
		var beats = {};
		for (var i = 0; i < currentChords.length; i++) {
			var cc = currentChords[i];
			var beat = Math.floor(cc.beat / beatLength);	// now all the beats are integers, there may be
			beats[''+beat] = cc;
		}

		// - If there is a chord on the second beat, play a chord for the first beat instead of a bass note.
		// - Likewise, if there is a chord on the fourth beat of 4/4, play a chord on the third beat instead of a bass note.
		for (var m2 = 0; m2 < pattern.length; m2++) {
			var thisChord;
			if (beats[''+m2])
				thisChord = beats[''+m2];
			switch (pattern[m2]) {
				case 'boom':
					if (beats[''+(m2+1)]) // If there is not a chord change on the next beat, play a bass note.
						writeChick(thisChord.chord.chick, beatLength);
					else
						writeBoom(thisChord.chord.boom, beatLength);
					break;
				case 'boom2':
					if (beats[''+(m2+1)])
						writeChick(thisChord.chord.chick, beatLength);
					else
						writeBoom(thisChord.chord.boom2, beatLength);
					break;
				case 'chick':
					writeChick(thisChord.chord.chick, beatLength);
					break;
				case '':
					if (beats[''+m2])	// If there is an explicit chord on this beat, play it.
						writeChick(thisChord.chord.chick, beatLength);
					else
						chordTrack.push({cmd: 'move', duration: beatLength*tempoChangeFactor });
					break;
			}
		}
	}
})();
