//    abc_midi_flattener.js: Turn a linear series of events into a series of MIDI commands.
//    Copyright (C) 2010-2018 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// We input a set of voices, but the notes are still complex. This pass changes the logical definitions
// of the grace notes, decorations, ties, triplets, rests, transpositions, keys, and accidentals into actual note durations.
// It also extracts guitar chords to a separate voice and resolves their rhythm.

var flatten;

(function() {
	"use strict";

	var barAccidentals;
	var accidentals;
	var transpose;
	var bagpipes;
	var multiplier;
	var tracks;
	var startingTempo;
	var startingMeter;
	var tempoChangeFactor = 1;
	var instrument;
	var currentInstrument;
	// var channel;
	var currentTrack;
	var pitchesTied;
	var lastNoteDurationPosition;
	var currentTrackCounter;

	var meter = { num: 4, den: 4 };
	var chordTrack;
	var chordTrackFinished;
	var chordChannel;
	var chordInstrument = 0;
	var drumInstrument = 128;
	var currentChords;
	var lastChord;
	var barBeat;
	var gChordTacet = false;
	var doBeatAccents = true;
	var stressBeat1 = 105;
	var stressBeatDown = 95;
	var stressBeatUp = 85;
	var beatFraction = 0.25;
	var nextVolume;
	var nextVolumeDelta;

	var drumTrack;
	var drumTrackFinished;
	var drumDefinition = {};

	var normalBreakBetweenNotes = 1.0/128;	// a 128th note of silence between notes for articulation.

	flatten = function(voices, options) {
		if (!options) options = {};
		barAccidentals = [];
		accidentals = [0,0,0,0,0,0,0];
		bagpipes = false;
		multiplier = 1;
		tracks = [];
		startingTempo = undefined;
		startingMeter = undefined;
		tempoChangeFactor = 1;
		instrument = undefined;
		currentInstrument = undefined;
		// channel = undefined;
		currentTrack = undefined;
		currentTrackCounter = undefined;
		pitchesTied = {};

		// For resolving chords.
		meter = { num: 4, den: 4 };
		chordTrack = [];
		chordChannel = voices.length; // first free channel for chords
		chordTrackFinished = false;
		currentChords = [];
		lastChord = undefined;
		barBeat = 0;
		gChordTacet = options.chordsOff ? true : false;

		doBeatAccents = true;
		stressBeat1 = 105;
		stressBeatDown = 95;
		stressBeatUp = 85;
		beatFraction = 0.25;
		nextVolume = undefined;
		nextVolumeDelta = undefined;

		// For the drum/metronome track.
		drumTrack = [];
		drumTrackFinished = false;
		drumDefinition = {};

		zeroOutMilliseconds(voices);

		for (var i = 0; i < voices.length; i++) {
			transpose = 0;
			lastNoteDurationPosition = -1;
			var voice = voices[i];
			currentTrack = [{ cmd: 'program', channel: i, instrument: instrument }];
			currentTrackCounter = 0;
			pitchesTied = {};
			for (var j = 0; j < voice.length; j++) {
				var element = voice[j];
				switch (element.el_type) {
					case "note":
						writeNote(element, options.voicesOff);
						break;
					case "key":
						accidentals = setKeySignature(element);
						break;
					case "meter":
						if (!startingMeter)
							startingMeter = element;
						meter = element;
						beatFraction = getBeatFraction(meter);
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
						if (chordTrack.length > 0 && i === 0) {
							resolveChords();
							currentChords = [];
						}
						barBeat = 0;
						barAccidentals = [];
						if (i === 0) // Only write the drum part on the first voice so that it is not duplicated.
							writeDrum(voices.length+1);
						break;
					case "bagpipes":
						bagpipes = true;
						break;
					case "instrument":
						if (instrument === undefined)
							instrument = element.program;
						currentInstrument = element.program;
						if (currentTrack.length > 0 && currentTrack[currentTrack.length-1].cmd === 'program')
							currentTrack[currentTrack.length-1].instrument = element.program;
						else {
							var ii;
							for (ii = currentTrack.length-1; ii >= 0 && currentTrack[ii].cmd !== 'program'; ii--)
								;
							if (ii < 0 || currentTrack[ii].instrument !== element.program)
								currentTrack.push({cmd: 'program', channel: i, instrument: element.program});
						}
						break;
					case "channel":
					// 	if (channel === undefined)
					// 		channel = element.channel;
					// 	currentTrack[0].channel = element.channel;
						break;
					case "drum":
						drumDefinition = normalizeDrumDefinition(element.params);
						break;
					case "gchord":
						if (!options.chordsOff)
							gChordTacet = element.tacet;
						break;
					case "beat":
						stressBeat1 = element.beats[0];
						stressBeatDown = element.beats[1];
						stressBeatUp = element.beats[2];
						// TODO-PER: also use the last parameter - which changes which beats are strong.
						break;
					case "vol":
						nextVolume = element.volume;
						break;
					case "volinc":
						nextVolumeDelta = element.volume;
						break;
					case "beataccents":
						doBeatAccents = element.value;
						break;
					default:
						// This should never happen
						console.log("MIDI creation. Unknown el_type: " + element.el_type + "\n");// jshint ignore:line
						break;
				}
			}
			if (currentTrack[0].instrument === undefined)
				currentTrack[0].instrument = instrument ? instrument : 0;
			tracks.push(currentTrack);
			if (chordTrack.length > 0) // Don't do chords on more than one track, so turn off chord detection after we create it.
				chordTrackFinished = true;
			if (drumTrack.length > 0) // Don't do drums on more than one track, so turn off drum after we create it.
				drumTrackFinished = true;
		}
		if (chordTrack.length > 0)
			tracks.push(chordTrack);
		if (drumTrack.length > 0)
			tracks.push(drumTrack);
		// Adjust the tempo according to the meter. The rules are this:
		// 1) If the denominator is 2 or 4, then always make a beat be the denominator.
		//
		// 2) If the denominator is 8 or 16, then:
		// a) If the numerator is divisible by 3, the beat is 3*denominator.
		// b) Otherwise the beat is the denominator.
		//
		// 3) If the denominator is anything else, then don't worry about it because it doesn't make sense. Don't modify it and hope for the best.
		//
		// Right now, the startingTempo is calculated for a quarter note, so modify it if necessary.
		// var num = startingMeter ? parseInt(startingMeter.num, 10) : meter.num;
		// var den = startingMeter ? parseInt(startingMeter.den, 10) : meter.den;
		// if (den === 2)
		// 	startingTempo *= 2;
		// else if (den === 8) {
		// 	if (parseInt(num, 10) % 3 === 0)
		// 		startingTempo *= 3/2;
		// 	else
		// 		startingTempo /= 2;
		// } else if (den === 16) {
		// 	if (num % 3 === 0)
		// 		startingTempo *= 3/4;
		// 	else
		// 		startingTempo /= 4;
		// }

		return { tempo: startingTempo, instrument: instrument, tracks: tracks, totalDuration: totalDuration(tracks) };
	};

	function zeroOutMilliseconds(voices) {
		for (var i = 0; i < voices.length; i++) {
			var voice = voices[i];
			for (var j = 0; j < voice.length; j++) {
				var element = voice[j];
				delete element.currentTrackMilliseconds;
			}
		}
	}

	function totalDuration(tracks) {
		var total = 0;
		for (var i = 0; i < tracks.length; i++) {
			var track = tracks[i];
			var trackTotal = 0;
			for (var j = 0; j < track.length; j++) {
				var event = track[j];
				if (event.duration)
					trackTotal += event.duration;
			}
			total = Math.max(total, trackTotal);
		}
		return total;
	}

	function getBeatFraction(meter) {
		switch (meter.den) {
			case 2: return 0.5;
			case 4: return 0.25;
			case 8: return 0.375;
			case 16: return 0.125;
		}
		return 0.25;
	}
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
		if (gChordTacet)
			return 'break';

		// TODO-PER: Just using the first chord if there are more than one.
		if (chordTrackFinished || !elem.chord || elem.chord.length === 0)
			return null;

		// Return the first annotation that is a regular chord: that is, it is in the default place or is a recognized "tacet" phrase.
		for (var i = 0; i < elem.chord.length; i++) {
			var ch = elem.chord[i];
			if (ch.position === 'default')
				return ch.name;
			if (breakSynonyms.indexOf(ch.name.toLowerCase()) >= 0)
				return 'break';
		}
		return null;
	}

	function timeFromStart() {
		var distance = 0;
		for (var ct = 0; ct < currentTrack.length; ct++) {
			if (currentTrack[ct].cmd === 'move')
				distance += currentTrack[ct].duration;
		}
		return distance;
	}

	function writeNote(elem, voiceOff) {
		//
		// Create a series of note events to append to the current track.
		// The output event is one of: { pitchStart: pitch_in_abc_units, volume: from_1_to_64 }
		// { pitchStop: pitch_in_abc_units }
		// { moveTime: duration_in_abc_units }
		// If there are guitar chords, then they are put in a separate track, but they have the same format.
		//

		var volume;
		if (nextVolume) {
			volume = nextVolume;
			nextVolume = undefined;
		} else if (!doBeatAccents) {
			volume = stressBeatDown;
		} else {
			if (barBeat === 0)
				volume = stressBeat1;
			else if (barBeat % beatFraction < 0.001) // A little slop because of JavaScript floating point math.
				volume = stressBeatDown;
			else
				volume = stressBeatUp;
		}
		if (nextVolumeDelta) {
			volume += nextVolumeDelta;
			nextVolumeDelta = undefined;
		}
		if (volume < 0)
			volume = 0;
		if (volume > 127)
			volume = 127;
		var velocity = voiceOff ? 0 : volume;
		var chord = findChord(elem);
		if (chord) {
			var c = interpretChord(chord);
			// If this isn't a recognized chord, just completely ignore it.
			if (c) {
				// If we ever have a chord in this voice, then we add the chord track.
				// However, if there are chords on more than one voice, then just use the first voice.
				if (chordTrack.length === 0) {
					chordTrack.push({cmd: 'program', channel: chordChannel, instrument: chordInstrument});
					// need to figure out how far in time the chord started: if there are pickup notes before the chords start, we need pauses.
					var distance = timeFromStart();
					if (distance > 0)
						chordTrack.push({cmd: 'move', duration: distance*tempoChangeFactor });
				}

				lastChord = c;
				currentChords.push({chord: lastChord, beat: barBeat});
			}
		}

		if (elem.startTriplet) {
			multiplier = elem.tripletMultiplier;
		}

		var duration = (elem.durationClass ? elem.durationClass : elem.duration) *multiplier;
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
			var stealFromCurrent = (bagpipes || lastNoteDurationPosition < 0 || currentTrack.length === 0);
			var stealFromDuration = stealFromCurrent ? duration : currentTrack[lastNoteDurationPosition].duration;
			graces = processGraceNotes(elem.gracenotes, stealFromDuration);
			if (!bagpipes) {
				duration = writeGraceNotes(graces, stealFromCurrent, duration, null, velocity);
			}
		}

		// The currentTrackCounter is the number of whole notes from the beginning of the piece.
		// The beat fraction is the note that gets a beat (.25 is a quarter note)
		// The tempo is in minutes and we want to get to milliseconds.
		if (!elem.currentTrackMilliseconds)
			elem.currentTrackMilliseconds = [];
		elem.currentTrackMilliseconds.push(currentTrackCounter / beatFraction / startingTempo * 60*1000);
		if (elem.pitches) {
			if (graces && bagpipes) {
				// If it is bagpipes, then the graces are played with the note. If the grace has the same pitch as the note, then we just skip it.
				duration = writeGraceNotes(graces, true, duration, null, velocity);
			}
			var pitches = [];
			elem.midiPitches = [];
			for (var i=0; i<elem.pitches.length; i++) {
				var note = elem.pitches[i];
				var actualPitch = adjustPitch(note);
				pitches.push({ pitch: actualPitch, startTie: note.startTie });
				elem.midiPitches.push({ pitch: actualPitch+60, durationInMeasures: duration*tempoChangeFactor, volume: volume, instrument: currentInstrument }); // TODO-PER: why is the internal numbering system offset by 60 from midi? It should probably be the same as midi.

				if (!pitchesTied[''+actualPitch])	// If this is the second note of a tie, we don't start it again.
					currentTrack.push({ cmd: 'start', pitch: actualPitch, volume: velocity });
				else {
					// but we do add the duration to what we call back.
					for (var last = currentTrack.length-1; last >= 0; last--) {
						if (currentTrack[last].cmd === 'start' && currentTrack[last].pitch === actualPitch && currentTrack[last].elem) {
							var pitchArray = currentTrack[last].elem.midiPitches;
							for (var last2 = 0; last2 < pitchArray.length; last2++) {
								if (pitchArray[last2].pitch-60 === actualPitch) { // TODO-PER: the 60 is to compensate for the midi pitch numbers again.
									pitchArray[last2].durationInMeasures += duration * tempoChangeFactor;
								}
							}
							break;
						}
					}
				}

				if (note.startTie) {
					pitchesTied['' + actualPitch] = true;
					currentTrack[currentTrack.length-1].elem = elem;
				} else if (note.endTie)
					pitchesTied[''+actualPitch] = false;
			}
			if (elem.gracenotes) {
				for (var j = 0; j < elem.gracenotes.length; j++) {
					elem.midiGraceNotePitches = [];
					var grace = elem.gracenotes[j];
					elem.midiGraceNotePitches.push({ pitch: adjustPitch(grace)+60, durationInMeasures: 0, volume: volume, instrument: currentInstrument});
				}
			}
			var thisBreakBetweenNotes = normalBreakBetweenNotes;
			var soundDuration = duration-normalBreakBetweenNotes;
			if (soundDuration < 0) {
				soundDuration = 0;
				thisBreakBetweenNotes = 0;
			}
			currentTrack.push({ cmd: 'move', duration: soundDuration*tempoChangeFactor });
			lastNoteDurationPosition = currentTrack.length-1;
			currentTrackCounter += soundDuration*tempoChangeFactor;

			for (var ii = 0; ii < pitches.length; ii++) {
				if (!pitchesTied[''+pitches[ii].pitch])
					currentTrack.push({ cmd: 'stop', pitch: pitches[ii].pitch });
			}
			currentTrack.push({ cmd: 'move', duration: thisBreakBetweenNotes*tempoChangeFactor });
			currentTrackCounter += thisBreakBetweenNotes*tempoChangeFactor;
		} else if (elem.rest) {
			currentTrack.push({ cmd: 'move', duration: duration*tempoChangeFactor });
			currentTrackCounter += duration*tempoChangeFactor;
		}

		if (elem.endTriplet) {
			multiplier=1;
		}
	}

	var scale = [0,2,4,5,7,9,11];
	function adjustPitch(note) {
		if (note.midipitch)
			return note.midipitch - 60;
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
			var pitch = grace.midipitch ? grace.midipitch - 60 : grace.pitch;
			ret.push({ pitch: pitch, duration: grace.duration/graceDivider*multiplier });
		}
		return ret;
	}

	function writeGraceNotes(graces, stealFromCurrent, duration, skipNote, velocity) {
		for (var g = 0; g < graces.length; g++) {
			var gp = graces[g];
			if (gp !== skipNote)
				currentTrack.push({cmd: 'start', pitch: gp.pitch, volume: velocity});
			currentTrack.push({cmd: 'move', duration: graces[g].duration*tempoChangeFactor });
			if (gp !== skipNote)
				currentTrack.push({cmd: 'stop', pitch: gp.pitch});
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
			var explicitBass = basses[arr[1].substring(0,1)];
			if (explicitBass) {
				var bassAcc = arr[1].substring(1);
				var bassShift = {'#': 1, '♯': 1, 'b': -1, '♭': -1}[bassAcc] || 0;
				bass = basses[arr[1].substring(0,1)] + bassShift + transpose;
				bass2 = bass;
			}
		}
		return { boom: bass, boom2: bass2, chick: chick };
	}

	var chordIntervals = {
		// diminished (all flat 5 chords)
		'dim': [ 0, 3, 6 ],
		'°': [ 0, 3, 6 ],
		'˚': [ 0, 3, 6 ],

		'dim7': [ 0, 3, 6, 9 ],
		'°7': [ 0, 3, 6, 9 ],
		'˚7': [ 0, 3, 6, 9 ],

		'ø7': [ 0, 3, 6, 10 ],
		'm7(b5)': [ 0, 3, 6, 10 ],
		'm7b5': [ 0, 3, 6, 10 ],
		'-7(b5)': [ 0, 3, 6, 10 ],
		'-7b5': [ 0, 3, 6, 10 ],

		'7b5': [ 0, 4, 6, 10 ],
		'7(b5)': [ 0, 4, 6, 10 ],
		'7♭5': [ 0, 4, 6, 10 ],

		'7(b9,b5)': [ 0, 4, 6, 10, 13 ],
		'7b9,b5': [ 0, 4, 6, 10, 13 ],
		'7(#9,b5)': [ 0, 4, 6, 10, 15 ],
		'7#9b5': [ 0, 4, 6, 10, 15 ],
		'maj7(b5)': [ 0, 3, 6, 11 ],
		'maj7b5': [ 0, 3, 6, 11 ],
		'13(b5)': [ 0, 4, 6, 10, 14, 18 ],
		'13b5': [ 0, 4, 6, 10, 14, 18 ],

		// minor (all normal 5, minor 3 chords)
		'm': [ 0, 3, 7 ],
		'-': [ 0, 3, 7 ],
		'm6': [ 0, 3, 7, 9 ],
		'-6': [ 0, 3, 7, 9 ],
		'm7': [ 0, 3, 7, 10 ],
		'-7': [ 0, 3, 7, 10 ],

		'-(b6)': [ 0, 3, 7, 8 ],
		'-b6': [ 0, 3, 7, 8 ],
		'-6/9': [ 0, 3, 7, 9, 14 ],
		'-7(b9)': [ 0, 3, 7, 10, 13 ],
		'-7b9': [ 0, 3, 7, 10, 13 ],
		'-maj7': [ 0, 3, 7, 11 ],
		'-9+7': [ 0, 3, 7, 11, 13 ],
		'-11': [  0, 3, 7, 11, 14, 16 ],

		// major (all normal 5, major 3 chords)
		'M': [ 0, 4, 7 ],
		'6': [ 0, 4, 7, 9 ],
		'6/9': [ 0, 4, 7, 9, 14 ],

		'7': [ 0, 4, 7, 10 ],
		'9': [ 0, 4, 7, 10, 14 ],
		'11': [ 0, 4, 7, 10, 14, 16 ],
		'13': [ 0, 4, 7, 10, 14, 18 ],
		'7b9': [ 0, 4, 7, 10, 13 ],
		'7♭9': [ 0, 4, 7, 10, 13 ],
		'7(b9)': [ 0, 4, 7, 10, 13 ],
		'7(#9)': [ 0, 4, 7, 10, 15 ],
		'7#9': [ 0, 4, 7, 10, 15 ],
		'(13)': [ 0, 4, 7, 10, 14, 18 ],
		'7(9,13)': [ 0, 4, 7, 10, 14, 18 ],
		'7(#9,b13)': [ 0, 4, 7, 10, 15, 17 ],
		'7(#11)': [ 0, 4, 7, 10, 14, 17 ],
		'7#11': [ 0, 4, 7, 10, 14, 17 ],
		'7(b13)': [ 0, 4, 7, 10, 17 ],
		'7b13': [ 0, 4, 7, 10, 17 ],
		'9(#11)': [ 0, 4, 7, 10, 14, 17 ],
		'9#11': [ 0, 4, 7, 10, 14, 17 ],
		'13(#11)': [ 0, 4, 7, 10, 15, 18 ],
		'13#11': [ 0, 4, 7, 10, 15, 18 ],

		'maj7': [ 0, 4, 7, 11 ],
		'∆7': [ 0, 4, 7, 11 ],
		'Δ7': [ 0, 4, 7, 11 ],
		'maj9': [ 0, 4, 7, 11, 14 ],
		'maj7(9)': [ 0, 4, 7, 11, 14 ],
		'maj7(11)': [ 0, 4, 7, 11, 16 ],
		'maj7(#11)': [ 0, 4, 7, 11, 17 ],
		'maj7(13)': [ 0, 4, 7, 11, 18 ],
		'maj7(9,13)': [ 0, 4, 7, 11, 14, 18 ],

		'7sus4': [ 0, 5, 7, 10 ],
		'm7sus4': [ 0, 5, 7, 10 ],
		'sus4': [ 0, 5, 7 ],
		'sus2': [ 0, 2, 7 ],
		'7sus2': [ 0, 2, 7, 10 ],
		'9sus4': [ 0, 5, 7, 14 ],
		'13sus4': [ 0, 5, 7, 18 ],

		// augmented (all sharp 5 chords)
		'aug7': [ 0, 4, 8, 10 ],
		'+7': [ 0, 4, 8, 10 ],
		'+': [ 0, 4, 8 ],
		'7#5': [ 0, 4, 8, 10 ],
		'7♯5': [ 0, 4, 8, 10 ],
		'7+5': [ 0, 4, 8, 10 ],
		'9#5': [ 0, 4, 8, 10, 14 ],
		'9♯5': [ 0, 4, 8, 10, 14 ],
		'9+5': [ 0, 4, 8, 10, 14 ],
		'-7(#5)': [ 0, 3, 8, 10 ],
		'-7#5': [ 0, 3, 8, 10 ],
		'7(#5)': [ 0, 4, 8, 10 ],
		'7(b9,#5)': [ 0, 4, 8, 10, 13 ],
		'7b9#5': [ 0, 4, 8, 10, 13 ],
		'maj7(#5)': [ 0, 4, 8, 11 ],
		'maj7#5': [ 0, 4, 8, 11 ],
		'maj7(#5,#11)': [ 0, 4, 8, 11, 14 ],
		'maj7#5#11': [ 0, 4, 8, 11, 14 ],
		'9(#5)': [ 0, 4, 8, 10, 14 ],
		'13(#5)': [ 0, 4, 8, 10, 14, 18 ],
		'13#5': [ 0, 4, 8, 10, 14, 18 ]
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
		"5/4": [ 'boom', 'chick', 'chick', 'boom2', 'chick' ],
		"6/8": [ 'boom', '', 'chick', 'boom2', '', 'chick' ],
		"9/8": [ 'boom', '', 'chick', 'boom2', '', 'chick', 'boom2', '', 'chick' ],
		"12/8": [ 'boom', '', 'chick', 'boom2', '', 'chick', 'boom2', '', 'chick', 'boom2', '', 'chick' ],
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

	function normalizeDrumDefinition(params) {
		// Be very strict with the drum definition. If anything is not perfect,
		// just turn the drums off.
		// Perhaps all of this logic belongs in the parser instead.
		if (params.pattern.length === 0 || params.on === false)
			return { on: false };

		var str = params.pattern[0];
		var events = [];
		var event = "";
		var totalPlay = 0;
		for (var i = 0; i < str.length; i++) {
			if (str[i] === 'd')
				totalPlay++;
			if (str[i] === 'd' || str[i] === 'z') {
				if (event.length !== 0) {
					events.push(event);
					event = str[i];
				} else
					event = event + str[i];
			} else {
				if (event.length === 0) {
					// there was an error: the string should have started with d or z
					return {on: false};
				}
				event = event + str[i];
			}
		}

		if (event.length !== 0)
			events.push(event);

		// Now the events array should have one item per event.
		// There should be two more params for each event: the volume and the pitch.
		if (params.pattern.length !== totalPlay*2 + 1)
			return { on: false };

		var ret = { on: true, bars: params.bars, pattern: []};
		var beatLength = 1/meter.den;
		var playCount = 0;
		for (var j = 0; j < events.length; j++) {
			event = events[j];
			var len = 1;
			var div = false;
			var num = 0;
			for (var k = 1; k < event.length; k++) {
				switch(event[k]) {
					case "/":
						if (num !== 0)
							len *= num;
						num = 0;
						div = true;
						break;
					case "1":
					case "2":
					case "3":
					case "4":
					case "5":
					case "6":
					case "7":
					case "8":
					case "9":
						num = num*10 +event[k];
						break;
					default:
						return { on: false };
				}
			}
			if (div) {
				if (num === 0) num = 2; // a slash by itself is interpreted as "/2"
				len /= num;
			} else if (num)
				len *= num;
			if (event[0] === 'd') {
				ret.pattern.push({ len: len * beatLength, pitch: params.pattern[1 + playCount], velocity: params.pattern[1 + playCount + totalPlay]});
				playCount++;
			} else
				ret.pattern.push({ len: len * beatLength, pitch: null});
		}
		// Now normalize the pattern to cover the correct number of measures. The note lengths passed are relative to each other and need to be scaled to fit a measure.
		var totalTime = 0;
		var measuresPerBeat = meter.num/meter.den;
		for (var ii = 0; ii < ret.pattern.length; ii++)
			totalTime += ret.pattern[ii].len;
		var numBars = params.bars ? params.bars : 1;
		var factor = totalTime /  numBars / measuresPerBeat;
		for (ii = 0; ii < ret.pattern.length; ii++)
			ret.pattern[ii].len = ret.pattern[ii].len / factor;
		return ret;
	}

	function drumBeat(pitch, soundLength, volume) {
		drumTrack.push({ cmd: 'start', pitch: pitch - 60, volume: volume});
		drumTrack.push({ cmd: 'move', duration: soundLength });
		drumTrack.push({ cmd: 'stop', pitch: pitch - 60 });
	}

	function writeDrum(channel) {
		if (drumTrack.length === 0 && !drumDefinition.on)
			return;

		var measureLen = meter.num/meter.den;
		if (drumTrack.length === 0) {
			drumTrack.push({cmd: 'program', channel: channel, instrument: drumInstrument});
			// need to figure out how far in time the bar started: if there are pickup notes before the chords start, we need pauses.
			var distance = timeFromStart();
			if (distance > 0 && distance < measureLen - 0.01) { // because of floating point, adding the notes might not exactly equal the measure size.
				drumTrack.push({cmd: 'move', duration: distance * tempoChangeFactor});
				return;
			}
		}

		if (!drumDefinition.on) {
			// this is the case where there has been a drum track, but it was specifically turned off.
			drumTrack.push({ cmd: 'move', duration: measureLen * tempoChangeFactor });
			return;
		}
		for (var i = 0; i < drumDefinition.pattern.length; i++) {
			var len = drumDefinition.pattern[i].len * tempoChangeFactor;
			if (drumDefinition.pattern[i].pitch)
				drumBeat(drumDefinition.pattern[i].pitch, len, drumDefinition.pattern[i].velocity);
			else
				drumTrack.push({ cmd: 'move', duration: len });
		}
	}
})();

module.exports = flatten;
