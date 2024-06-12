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
// If there is any note in the melody that has a rhythm head, then assume the melody controls the rhythm, so that is
// the same as a break.

var parseCommon = require("../parse/abc_common");

var ChordTrack = function ChordTrack(numVoices, chordsOff, midiOptions, meter) {
	this.chordTrack = [];
	this.chordTrackFinished = false;
	this.chordChannel = numVoices; // first free channel for chords
	this.currentChords = [];
	this.lastChord;
	this.chordLastBar;
	this.chordsOff = !!chordsOff
	this.gChordTacet = this.chordsOff;
	this.hasRhythmHead = false;
	this.transpose = 0;
	this.lastBarTime = 0;
	this.meter = meter;
	this.tempoChangeFactor = 1;

	this.bassInstrument = midiOptions.bassprog && midiOptions.bassprog.length === 1 ? midiOptions.bassprog[0] : 0;
	this.chordInstrument = midiOptions.chordprog && midiOptions.chordprog.length === 1 ? midiOptions.chordprog[0] : 0;
	this.boomVolume = midiOptions.bassvol && midiOptions.bassvol.length === 1 ? midiOptions.bassvol[0] : 64;
	this.chickVolume = midiOptions.chordvol && midiOptions.chordvol.length === 1 ? midiOptions.chordvol[0] : 48;
};

ChordTrack.prototype.setMeter = function (meter) {
	this.meter = meter
};

ChordTrack.prototype.setTempoChangeFactor = function (tempoChangeFactor) {
	this.tempoChangeFactor = tempoChangeFactor
};

ChordTrack.prototype.setLastBarTime = function (lastBarTime) {
	this.lastBarTime = lastBarTime
};

ChordTrack.prototype.setTranspose = function (transpose) {
	this.transpose = transpose
};

ChordTrack.prototype.setRhythmHead = function (isRhythmHead, elem) {
	this.hasRhythmHead = isRhythmHead
	var ePitches = [];
	if (isRhythmHead) {
		if (this.lastChord && this.lastChord.chick) {
			for (var i2 = 0; i2 < this.lastChord.chick.length; i2++) {
				var note2 = parseCommon.clone(elem.pitches[0]);
				note2.actualPitch = this.lastChord.chick[i2];
				ePitches.push(note2);
			}
		}
	}
	return ePitches
};

ChordTrack.prototype.barEnd = function (element) {
	if (this.chordTrack.length > 0 && !this.chordTrackFinished) {
		this.resolveChords(this.lastBarTime, timeToRealTime(element.time));
		this.currentChords = [];
	}
	this.chordLastBar = this.lastChord;
};

ChordTrack.prototype.gChordReceived = function (element) {
	if (!this.chordsOff)
		this.gChordTacet = element.tacet;
};

ChordTrack.prototype.finish = function () {
	if (!this.chordTrackEmpty()) // Don't do chords on more than one track, so turn off chord detection after we create it.
		this.chordTrackFinished = true;
};

ChordTrack.prototype.addTrack = function (tracks) {
	if (!this.chordTrackEmpty())
		tracks.push(this.chordTrack);
};

ChordTrack.prototype.findChord = function (elem) {
	if (this.gChordTacet)
		return 'break';

	// TODO-PER: Just using the first chord if there are more than one.
	if (this.chordTrackFinished || !elem.chord || elem.chord.length === 0)
		return null;

	// Return the first annotation that is a regular chord: that is, it is in the default place or is a recognized "tacet" phrase.
	for (var i = 0; i < elem.chord.length; i++) {
		var ch = elem.chord[i];
		if (ch.position === 'default')
			return ch.name;
		if (this.breakSynonyms.indexOf(ch.name.toLowerCase()) >= 0)
			return 'break';
	}
	return null;
}

ChordTrack.prototype.interpretChord = function (name) {
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
		return { chick: [] };
	var root = name.substring(0, 1);
	if (root === '(') {
		name = name.substring(1, name.length - 2);
		if (name.length === 0)
			return undefined;
		root = name.substring(0, 1);
	}
	var bass = this.basses[root];
	if (!bass)	// If the bass note isn't listed, then this was an unknown root. Only A-G are accepted.
		return undefined;
	// Don't transpose the chords more than an octave.
	var chordTranspose = this.transpose;
	while (chordTranspose < -8)
		chordTranspose += 12;
	while (chordTranspose > 8)
		chordTranspose -= 12;
	bass += chordTranspose;
	var bass2 = bass - 5;	// The alternating bass is a 4th below
	var chick;
	if (name.length === 1)
		chick = this.chordNotes(bass, '');
	var remaining = name.substring(1);
	var acc = remaining.substring(0, 1);
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
	chick = this.chordNotes(bass, arr[0]);
	// If the 5th is altered then the bass is altered. Normally the bass is 7 from the root, so adjust if it isn't.
	if (chick.length >= 3) {
		var fifth = chick[2] - chick[0];
		bass2 = bass2 + fifth - 7;
	}

	if (arr.length === 2) {
		var explicitBass = this.basses[arr[1].substring(0, 1)];
		if (explicitBass) {
			var bassAcc = arr[1].substring(1);
			var bassShift = { '#': 1, '♯': 1, 'b': -1, '♭': -1 }[bassAcc] || 0;
			bass = this.basses[arr[1].substring(0, 1)] + bassShift + chordTranspose;
			bass2 = bass;
		}
	}
	return { boom: bass, boom2: bass2, chick: chick };
}

ChordTrack.prototype.chordNotes = function (bass, modifier) {
	var intervals = this.chordIntervals[modifier];
	if (!intervals) {
		if (modifier.slice(0, 2).toLowerCase() === 'ma' || modifier[0] === 'M')
			intervals = this.chordIntervals.M;
		else if (modifier[0] === 'm' || modifier[0] === '-')
			intervals = this.chordIntervals.m;
		else
			intervals = this.chordIntervals.M;
	}
	bass += 12;	// the chord is an octave above the bass note.
	var notes = [];
	for (var i = 0; i < intervals.length; i++) {
		notes.push(bass + intervals[i]);
	}
	return notes;
}

ChordTrack.prototype.writeBoom = function (boom, beatLength, volume, beat, noteLength) {
	// undefined means there is a stop time.
	if (boom !== undefined)
		this.chordTrack.push({ cmd: 'note', pitch: boom, volume: volume, start: this.lastBarTime + beat * durationRounded(beatLength, this.tempoChangeFactor), duration: durationRounded(noteLength, this.tempoChangeFactor), gap: 0, instrument: this.bassInstrument });
}

ChordTrack.prototype.writeChick = function (chick, beatLength, volume, beat, noteLength) {
	for (var c = 0; c < chick.length; c++)
		this.chordTrack.push({ cmd: 'note', pitch: chick[c], volume: volume, start: this.lastBarTime + beat * durationRounded(beatLength, this.tempoChangeFactor), duration: durationRounded(noteLength, this.tempoChangeFactor), gap: 0, instrument: this.chordInstrument });
}

ChordTrack.prototype.chordTrackEmpty = function () {
	var isEmpty = true;
	for (var i = 0; i < this.chordTrack.length && isEmpty; i++) {
		if (this.chordTrack[i].cmd === 'note')
			isEmpty = false
	}
	return isEmpty;
}

ChordTrack.prototype.resolveChords = function (startTime, endTime) {
	var num = this.meter.num;
	var den = this.meter.den;
	var beatLength = 1 / den;
	var noteLength = beatLength / 2;
	var pattern = this.rhythmPatterns[num + '/' + den];
	var thisMeasureLength = parseInt(num, 10) / parseInt(den, 10);
	var portionOfAMeasure = thisMeasureLength - (endTime - startTime) / this.tempoChangeFactor;
	if (Math.abs(portionOfAMeasure) < 0.00001)
		portionOfAMeasure = false;
	if (!pattern || portionOfAMeasure) { // If it is an unsupported meter, or this isn't a full bar, just chick on each beat.
		pattern = [];
		var beatsPresent = ((endTime - startTime) / this.tempoChangeFactor) / beatLength;
		for (var p = 0; p < beatsPresent; p++)
			pattern.push("chick");
	}
	//console.log(startTime, pattern, currentChords, lastChord, portionOfAMeasure)

	if (this.currentChords.length === 0) { // there wasn't a new chord this measure, so use the last chord declared.
		this.currentChords.push({ beat: 0, chord: this.lastChord });
	}
	if (this.currentChords[0].beat !== 0 && this.lastChord) { // this is the case where there is a chord declared in the measure, but not on its first beat.
		if (this.chordLastBar)
			this.currentChords.unshift({ beat: 0, chord: this.chordLastBar });
	}
	if (this.currentChords.length === 1) {
		for (var m = this.currentChords[0].beat; m < pattern.length; m++) {
			if (!this.hasRhythmHead) {
				switch (pattern[m]) {
					case 'boom':
						this.writeBoom(this.currentChords[0].chord.boom, beatLength, this.boomVolume, m, noteLength);
						break;
					case 'boom2':
						this.writeBoom(this.currentChords[0].chord.boom2, beatLength, this.boomVolume, m, noteLength);
						break;
					case 'chick':
						this.writeChick(this.currentChords[0].chord.chick, beatLength, this.chickVolume, m, noteLength);
						break;
				}
			}
		}
		return;
	}

	// If we are here it is because more than one chord was declared in the measure, so we have to sort out what chord goes where.

	// First, normalize the chords on beats.
	var mult = beatLength === 0.125 ? 3 : 1; // If this is a compound meter then the beats in the currentChords is 1/3 of the true beat
	var beats = {};
	for (var i = 0; i < this.currentChords.length; i++) {
		var cc = this.currentChords[i];
		var b = Math.round(cc.beat * mult);
		beats['' + b] = cc;
	}

	// - If there is a chord on the second beat, play a chord for the first beat instead of a bass note.
	// - Likewise, if there is a chord on the fourth beat of 4/4, play a chord on the third beat instead of a bass note.
	for (var m2 = 0; m2 < pattern.length; m2++) {
		var thisChord;
		if (beats['' + m2])
			thisChord = beats['' + m2];
		var lastBoom;
		if (!this.hasRhythmHead && thisChord) {
			switch (pattern[m2]) {
				case 'boom':
					if (beats['' + (m2 + 1)]) // If there is not a chord change on the next beat, play a bass note.
						this.writeChick(thisChord.chord.chick, beatLength, this.chickVolume, m2, noteLength);
					else {
						this.writeBoom(thisChord.chord.boom, beatLength, this.boomVolume, m2, noteLength);
						lastBoom = thisChord.chord.boom;
					}
					break;
				case 'boom2':
					if (beats['' + (m2 + 1)])
						this.writeChick(thisChord.chord.chick, beatLength, this.chickVolume, m2, noteLength);
					else {
						// If there is the same root as the last chord, use the alternating bass, otherwise play the root.
						if (lastBoom === thisChord.chord.boom) {
							this.writeBoom(thisChord.chord.boom2, beatLength, this.boomVolume, m2, noteLength);
							lastBoom = undefined;
						} else {
							this.writeBoom(thisChord.chord.boom, beatLength, this.boomVolume, m2, noteLength);
							lastBoom = thisChord.chord.boom;
						}
					}
					break;
				case 'chick':
					this.writeChick(thisChord.chord.chick, beatLength, this.chickVolume, m2, noteLength);
					break;
				case '':
					if (beats['' + m2])	// If there is an explicit chord on this beat, play it.
						this.writeChick(thisChord.chord.chick, beatLength, this.chickVolume, m2, noteLength);
					break;
			}
		}
	}
}

ChordTrack.prototype.processChord = function (elem) {
	if (this.chordTrackFinished)
		return
	//var firstChord = false;
	var chord = this.findChord(elem);
	if (chord) {
		var c = this.interpretChord(chord);
		// If this isn't a recognized chord, just completely ignore it.
		if (c) {
			// If we ever have a chord in this voice, then we add the chord track.
			// However, if there are chords on more than one voice, then just use the first voice.
			if (this.chordTrack.length === 0) {
				//firstChord = true;
				this.chordTrack.push({ cmd: 'program', channel: this.chordChannel, instrument: this.chordInstrument });
			}

			this.lastChord = c;
			var barBeat = calcBeat(this.lastBarTime, getBeatFraction(this.meter), timeToRealTime(elem.time));
			this.currentChords.push({ chord: this.lastChord, beat: barBeat, start: timeToRealTime(elem.time) });
		}
	}
	//return firstChord;
}

ChordTrack.prototype.breakSynonyms = ['break', '(break)', 'no chord', 'n.c.', 'tacet'];

ChordTrack.prototype.basses = {
	'A': 33, 'B': 35, 'C': 36, 'D': 38, 'E': 40, 'F': 41, 'G': 43
};

ChordTrack.prototype.chordIntervals = {
	// diminished (all flat 5 chords)
	'dim': [0, 3, 6],
	'°': [0, 3, 6],
	'˚': [0, 3, 6],

	'dim7': [0, 3, 6, 9],
	'°7': [0, 3, 6, 9],
	'˚7': [0, 3, 6, 9],

	'ø7': [0, 3, 6, 10],
	'm7(b5)': [0, 3, 6, 10],
	'm7b5': [0, 3, 6, 10],
	'm7♭5': [0, 3, 6, 10],
	'-7(b5)': [0, 3, 6, 10],
	'-7b5': [0, 3, 6, 10],

	'7b5': [0, 4, 6, 10],
	'7(b5)': [0, 4, 6, 10],
	'7♭5': [0, 4, 6, 10],

	'7(b9,b5)': [0, 4, 6, 10, 13],
	'7b9,b5': [0, 4, 6, 10, 13],
	'7(#9,b5)': [0, 4, 6, 10, 15],
	'7#9b5': [0, 4, 6, 10, 15],
	'maj7(b5)': [0, 4, 6, 11],
	'maj7b5': [0, 4, 6, 11],
	'13(b5)': [0, 4, 6, 10, 14, 21],
	'13b5': [0, 4, 6, 10, 14, 21],

	// minor (all normal 5, minor 3 chords)
	'm': [0, 3, 7],
	'-': [0, 3, 7],
	'm6': [0, 3, 7, 9],
	'-6': [0, 3, 7, 9],
	'm7': [0, 3, 7, 10],
	'-7': [0, 3, 7, 10],

	'-(b6)': [0, 3, 7, 8],
	'-b6': [0, 3, 7, 8],
	'-6/9': [0, 3, 7, 9, 14],
	'-7(b9)': [0, 3, 7, 10, 13],
	'-7b9': [0, 3, 7, 10, 13],
	'-maj7': [0, 3, 7, 11],
	'-9+7': [0, 3, 7, 11, 13],
	'-11': [0, 3, 7, 11, 14, 17],
	'm11': [0, 3, 7, 11, 14, 17],
	'-maj9': [0, 3, 7, 11, 14],
	'-∆9': [0, 3, 7, 11, 14],
	'mM9': [0, 3, 7, 11, 14],

	// major (all normal 5, major 3 chords)
	'M': [0, 4, 7],
	'6': [0, 4, 7, 9],
	'6/9': [0, 4, 7, 9, 14],
	'6add9': [0, 4, 7, 9, 14],
	'69': [0, 4, 7, 9, 14],

	'7': [0, 4, 7, 10],
	'9': [0, 4, 7, 10, 14],
	'11': [0, 7, 10, 14, 17],
	'13': [0, 4, 7, 10, 14, 21],
	'7b9': [0, 4, 7, 10, 13],
	'7♭9': [0, 4, 7, 10, 13],
	'7(b9)': [0, 4, 7, 10, 13],
	'7(#9)': [0, 4, 7, 10, 15],
	'7#9': [0, 4, 7, 10, 15],
	'(13)': [0, 4, 7, 10, 14, 21],
	'7(9,13)': [0, 4, 7, 10, 14, 21],
	'7(#9,b13)': [0, 4, 7, 10, 15, 20],
	'7(#11)': [0, 4, 7, 10, 14, 18],
	'7#11': [0, 4, 7, 10, 14, 18],
	'7(b13)': [0, 4, 7, 10, 20],
	'7b13': [0, 4, 7, 10, 20],
	'9(#11)': [0, 4, 7, 10, 14, 18],
	'9#11': [0, 4, 7, 10, 14, 18],
	'13(#11)': [0, 4, 7, 10, 18, 21],
	'13#11': [0, 4, 7, 10, 18, 21],

	'maj7': [0, 4, 7, 11],
	'∆7': [0, 4, 7, 11],
	'Δ7': [0, 4, 7, 11],
	'maj9': [0, 4, 7, 11, 14],
	'maj7(9)': [0, 4, 7, 11, 14],
	'maj7(11)': [0, 4, 7, 11, 17],
	'maj7(#11)': [0, 4, 7, 11, 18],
	'maj7(13)': [0, 4, 7, 14, 21],
	'maj7(9,13)': [0, 4, 7, 11, 14, 21],

	'7sus4': [0, 5, 7, 10],
	'm7sus4': [0, 3, 7, 10, 17],
	'sus4': [0, 5, 7],
	'sus2': [0, 2, 7],
	'7sus2': [0, 2, 7, 10],
	'9sus4': [0, 5, 7, 10, 14],
	'13sus4': [0, 5, 7, 10, 14, 21],

	// augmented (all sharp 5 chords)
	'aug7': [0, 4, 8, 10],
	'+7': [0, 4, 8, 10],
	'+': [0, 4, 8],
	'7#5': [0, 4, 8, 10],
	'7♯5': [0, 4, 8, 10],
	'7+5': [0, 4, 8, 10],
	'9#5': [0, 4, 8, 10, 14],
	'9♯5': [0, 4, 8, 10, 14],
	'9+5': [0, 4, 8, 10, 14],
	'-7(#5)': [0, 3, 8, 10],
	'-7#5': [0, 3, 8, 10],
	'7(#5)': [0, 4, 8, 10],
	'7(b9,#5)': [0, 4, 8, 10, 13],
	'7b9#5': [0, 4, 8, 10, 13],
	'maj7(#5)': [0, 4, 8, 11],
	'maj7#5': [0, 4, 8, 11],
	'maj7(#5,#11)': [0, 4, 8, 11, 18],
	'maj7#5#11': [0, 4, 8, 11, 18],
	'9(#5)': [0, 4, 8, 10, 14],
	'13(#5)': [0, 4, 8, 10, 14, 21],
	'13#5': [0, 4, 8, 10, 14, 21]
};

ChordTrack.prototype.rhythmPatterns = {
	"2/2": ['boom', 'chick'],
	"2/4": ['boom', 'chick'],
	"3/4": ['boom', 'chick', 'chick'],
	"4/4": ['boom', 'chick', 'boom2', 'chick'],
	"5/4": ['boom', 'chick', 'chick', 'boom2', 'chick'],
	"6/8": ['boom', '', 'chick', 'boom2', '', 'chick'],
	"9/8": ['boom', '', 'chick', 'boom2', '', 'chick', 'boom2', '', 'chick'],
	"12/8": ['boom', '', 'chick', 'boom2', '', 'chick', 'boom', '', 'chick', 'boom2', '', 'chick'],
};

// TODO-PER: these are repeated in flattener. Can it be shared?
function calcBeat(measureStart, beatLength, currTime) {
	var distanceFromStart = currTime - measureStart;
	return distanceFromStart / beatLength;
}

function getBeatFraction(meter) {
	switch (parseInt(meter.den, 10)) {
		case 2: return 0.5;
		case 4: return 0.25;
		case 8:
			if (meter.num % 3 === 0)
				return 0.375;
			else
				return 0.125;
		case 16: return 0.125;
	}
	return 0.25;
}

function timeToRealTime(time) {
	return time / 1000000;
}

function durationRounded(duration, tempoChangeFactor) {
	return Math.round(duration * tempoChangeFactor * 1000000) / 1000000;
}

module.exports = ChordTrack;
