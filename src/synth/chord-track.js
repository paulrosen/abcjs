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
// - There is a standard pattern of boom-chick for each time sig, or it can be overridden.
// - For any unrecognized meter, play the full chord on each beat.
//
//	- If there is a chord specified that is not on a beat, move it earlier to the previous beat, unless there is already a chord on that beat.
//	- Otherwise, move it later, unless there is already a chord on that beat.
// 	- Otherwise, ignore it. (TODO-PER: expand this as more support is added.)
//
// If there is any note in the melody that has a rhythm head, then assume the melody controls the rhythm, so there is no chord added for that entire measure.

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

	// MAE 17 Jun 2024 - To allow for bass and chord instrument octave shifts
	this.bassInstrument = midiOptions.bassprog && midiOptions.bassprog.length >= 1 ? midiOptions.bassprog[0] : 0;
	this.chordInstrument = midiOptions.chordprog && midiOptions.chordprog.length >= 1 ? midiOptions.chordprog[0] : 0;

	// MAE For octave shifted bass and chords
	this.bassOctaveShift = midiOptions.bassprog && midiOptions.bassprog.length === 2 ? midiOptions.bassprog[1] : 0;
	this.chordOctaveShift = midiOptions.chordprog && midiOptions.chordprog.length === 2 ? midiOptions.chordprog[1] : 0;

	this.boomVolume = midiOptions.bassvol && midiOptions.bassvol.length === 1 ? midiOptions.bassvol[0] : 64;
	this.chickVolume = midiOptions.chordvol && midiOptions.chordvol.length === 1 ? midiOptions.chordvol[0] : 48;

	// This allows for an initial %%MIDI gchord with no string
	if (midiOptions.gchord && (midiOptions.gchord.length > 0)) {
		this.overridePattern = parseGChord(midiOptions.gchord[0])
	}
	else {
		this.overridePattern = undefined;
	}
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
				var note2 = Object.assign({},elem.pitches[0]);
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

ChordTrack.prototype.gChordOn = function (element) {
	if (!this.chordsOff)
		this.gChordTacet = element.tacet;
};

ChordTrack.prototype.paramChange = function (element) {
	switch (element.el_type) {
		case "gchord":
			// Skips gchord elements that don't have pattern strings
			if (element.param && element.param.length > 0) {
				this.overridePattern = parseGChord(element.param);

				// Generate a default duration scale based on the pattern
				//this.gchordduration = generateDefaultDurationScale(element.param);
			} else
				this.overridePattern = undefined;
			break;
		case "bassprog":
			this.bassInstrument = element.value;
			if ((element.octaveShift != undefined) && (element.octaveShift != null)) {
				this.bassOctaveShift = element.octaveShift;
			}
			else {
				this.bassOctaveShift = 0;
			}
			break;
		case "chordprog":
			this.chordInstrument = element.value;
			if ((element.octaveShift != undefined) && (element.octaveShift != null)) {
				this.chordOctaveShift = element.octaveShift;
			}
			else {
				this.chordOctaveShift = 0;
			}
			break;
		case "bassvol":
			this.boomVolume = element.param;
			break;
		case "chordvol":
			this.chickVolume = element.param;
			break;
		default:
			console.log("unhandled midi param", element)	
	}
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
		name = name.substring(1, name.length - 1);
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
	
    	// MAE 31 Aug 2024 - For visual transpose backup range issue
    	// If transposed below A or above G, bring it back in the normal backup range
    	if (bass < 33){
      		bass += 12;
    	}
    	else if (bass > 44){
	     	 bass -= 12;
    	}

	// MAE 17 Jun 2024 - Supporting octave shifted bass and chords
	var unshiftedBass = bass;

	bass += this.bassOctaveShift * 12;

	var bass2 = bass - 5;	// The alternating bass is a 4th below
	var chick;
	if (name.length === 1)
		chick = this.chordNotes(bass, '');
	var remaining = name.substring(1);
	var acc = remaining.substring(0, 1);
	if (acc === 'b' || acc === '♭') {
		unshiftedBass--;
		bass--;
		bass2--;
		remaining = remaining.substring(1);
	} else if (acc === '#' || acc === '♯') {
		unshiftedBass++;
		bass++;
		bass2++;
		remaining = remaining.substring(1);
	}
	var arr = remaining.split('/');
	chick = this.chordNotes(unshiftedBass, arr[0]);
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

			// MAE 22 May 2024 - Supporting octave shifted bass and chords
			bass += this.bassOctaveShift * 12;

			bass2 = bass;
		}
	}
	return { boom: bass, boom2: bass2, chick: chick };
}

ChordTrack.prototype.chordNotes = function (bass, modifier) {
	// accept either chord spelling
	modifier = modifier.replace(/♭/g,'b').replace(/♯/g,'#')

	var intervals = chordIntervals[modifier];
	if (!intervals) {
		// If the chord isn't in our list, we can at least guess
		// whether it is major or minor.
		if (modifier.slice(0, 2).toLowerCase() === 'ma' || modifier[0] === 'M')
			intervals = chordIntervals.M;
		else if (modifier[0] === 'm' || modifier[0] === '-')
			intervals = chordIntervals.m;
		else
			intervals = chordIntervals.M;
	}
	bass += 12;	// the chord is an octave above the bass note.

	// MAE 22 May 2024 - For chick octave shift
	bass += (this.chordOctaveShift * 12);

	var notes = [];
	for (var i = 0; i < intervals.length; i++) {
		notes.push(bass + intervals[i]);
	}
	return notes;
}

ChordTrack.prototype.writeNote = function (note, beatLength, volume, beat, noteLength, instrument) {
	// undefined means there is a stop time.
	if (note !== undefined)
		this.chordTrack.push({ cmd: 'note', pitch: note, volume: volume, start: this.lastBarTime + beat * durationRounded(beatLength, this.tempoChangeFactor), duration: durationRounded(noteLength, this.tempoChangeFactor), gap: 0, instrument: instrument });
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
	// If there is a rhythm head anywhere in the measure then don't add a separate rhythm track
	if (this.hasRhythmHead)
		return

	var num = this.meter.num;
	var den = this.meter.den;
	var beatLength = 1 / den;
	var noteLength = beatLength / 2;
	var thisMeasureLength = parseInt(num, 10) / parseInt(den, 10);
	var portionOfAMeasure = thisMeasureLength - (endTime - startTime) / this.tempoChangeFactor;
	if (Math.abs(portionOfAMeasure) < 0.00001)
		portionOfAMeasure = 0;

	 // there wasn't a new chord this measure, so use the last chord declared.
	 // also the case where there is a chord declared in the measure, but not on its first beat.
	if (this.currentChords.length === 0 || this.currentChords[0].beat !== 0) {
		this.currentChords.unshift({ beat: 0, chord: this.chordLastBar });
	}

	//console.log(this.currentChords)
	var currentChordsExpanded = expandCurrentChords(this.currentChords, 8*num/den, beatLength)
	//console.log(currentChordsExpanded)
	var thisPattern = this.overridePattern ? this.overridePattern : this.rhythmPatterns[num + '/' + den]
	if (portionOfAMeasure) {
		thisPattern = [];
		var beatsPresent = ((endTime - startTime) / this.tempoChangeFactor) * 8;
		for (var p = 0; p < beatsPresent/2; p += 2) {
			thisPattern.push("chick");
			thisPattern.push("");
		}
	}
	if (!thisPattern) {
		thisPattern = []
		for (var p = 0; p < (8*num/den)/2; p++) {
			thisPattern.push('chick')
			thisPattern.push("");
		}
	}
	var firstBoom = true
	// If the pattern is overridden, it might be longer than the length of a measure. If so, then ignore the rest of it
	var minLength = Math.min(thisPattern.length, currentChordsExpanded.length)
	for (var p = 0; p < minLength; p++) {
		if (p > 0 && currentChordsExpanded[p-1] && currentChordsExpanded[p] && currentChordsExpanded[p-1].boom !== currentChordsExpanded[p].boom)
			firstBoom = true
		var type = thisPattern[p]
		var isBoom = type.indexOf('boom') >= 0
		// If we changed chords at a time when we're not expecting a bass note, then add an extra bass note in if the first thing in the pattern is a bass note.
		var newBass = !isBoom &&
			p !== 0 &&
			thisPattern[0].indexOf('boom') >= 0 &&
			(!currentChordsExpanded[p-1] || currentChordsExpanded[p-1].boom !== currentChordsExpanded[p].boom)
		var pitches = resolvePitch(currentChordsExpanded[p], type, firstBoom, newBass)
		if (isBoom)
			firstBoom = false
		for (var oo = 0; oo < pitches.length; oo++) {
			this.writeNote(pitches[oo], 
				0.125,
				isBoom || newBass ? this.boomVolume : this.chickVolume,
				p,
				noteLength,
				isBoom || newBass ? this.bassInstrument : this.chordInstrument
			)
			if (newBass)
				newBass = false
			else
				isBoom = false // only the first note in a chord is a bass note. This handles the case where bass and chord are played at the same time.
		}
	}
	return
}

ChordTrack.prototype.processChord = function (elem) {
	if (this.chordTrackFinished)
		return
	var chord = this.findChord(elem);
	if (chord) {
		var c = this.interpretChord(chord);
		// If this isn't a recognized chord, just completely ignore it.
		if (c) {
			// If we ever have a chord in this voice, then we add the chord track.
			// However, if there are chords on more than one voice, then just use the first voice.
			if (this.chordTrack.length === 0) {
				this.chordTrack.push({ cmd: 'program', channel: this.chordChannel, instrument: this.chordInstrument });
			}

			this.lastChord = c;
			var barBeat = calcBeat(this.lastBarTime, timeToRealTime(elem.time));
			this.currentChords.push({ chord: this.lastChord, beat: barBeat, start: timeToRealTime(elem.time) });
		}
	}
}

function resolvePitch(currentChord, type, firstBoom, newBass) {
	var ret = []
	if (!currentChord)
		return ret
	if (type.indexOf('boom') >= 0)
		ret.push(firstBoom ? currentChord.boom : currentChord.boom2)
	else if (newBass)
		ret.push(currentChord.boom)
	var numChordNotes = currentChord.chick.length
	if (type.indexOf('chick') >= 0) {
		for (var i = 0; i < numChordNotes; i++)
			ret.push(currentChord.chick[i])
	}
	switch (type) {
		case 'DO': ret.push(currentChord.chick[0]); break;
		case 'MI': ret.push(currentChord.chick[1]); break;
		case 'SOL': ret.push(extractNote(currentChord,2)); break;
		case 'TI': ret.push(extractNote(currentChord,3)); break;
		case 'TOP': ret.push(extractNote(currentChord,4)); break;
		case 'do': ret.push(currentChord.chick[0]+12); break;
		case 'mi': ret.push(currentChord.chick[1]+12); break;
		case 'sol': ret.push(extractNote(currentChord,2)+12); break;
		case 'ti': ret.push(extractNote(currentChord,3)+12); break;
		case 'top': ret.push(extractNote(currentChord,4)+12); break;
	}
	return ret
}

function extractNote(chord, index) {
	// This creates an arpeggio note no matter how many notes are in the chord - if it runs out of notes it continues in the next octave
	var octave = Math.floor(index / chord.chick.length)
	var note = chord.chick[index % chord.chick.length]
	//console.log(chord.chick, {index, octave, note, index % chord.chick.length)
	return note + octave * 12
}

function parseGChord(gchord) {
	// TODO-PER: The spec is more complicated than this but for now this will not try to do anything with error cases like the wrong number of beats.
	var pattern = []
	for (var i = 0; i < gchord.length; i++) {
		var ch = gchord[i]
		switch(ch) {
			case 'z' : pattern.push(''); break;
			case '2' : pattern.push(''); break; // TODO-PER: This should extend the last note, but that's a small effect
			case 'c' : pattern.push('chick'); break;
			case 'b' : pattern.push('boom&chick'); break;
			case 'f' : pattern.push('boom'); break;
			case 'G' : pattern.push('DO'); break;
			case 'H' : pattern.push('MI'); break;
			case 'I' : pattern.push('SOL'); break;
			case 'J' : pattern.push('TI'); break;
			case 'K' : pattern.push('TOP'); break;
			case 'g' : pattern.push('do'); break;
			case 'h' : pattern.push('mi'); break;
			case 'i' : pattern.push('sol'); break;
			case 'j' : pattern.push('ti'); break;
			case 'k' : pattern.push('top'); break;
		}
	}
	return pattern
}

// This returns an array that has a chord for each 1/8th note position in the current measure
function expandCurrentChords(currentChords, num8thNotes, beatLength) {
	beatLength = beatLength * 8 // this is expressed as a fraction, so that 0.25 is a quarter notes. We want it to be the number of 8th notes
	var chords = []
	if (currentChords.length === 0)
		return chords

	var currentChord = currentChords[0].chord
	for (var i = 1; i < currentChords.length; i++) {
		var current = currentChords[i]
		while (chords.length < current.beat) {
			chords.push(currentChord)
		}
		currentChord = current.chord
	}
	while (chords.length < num8thNotes)
		chords.push(currentChord)
	return chords
}

function calcBeat(measureStart, currTime) {
	var distanceFromStart = currTime - measureStart;
	return distanceFromStart * 8;
}

ChordTrack.prototype.breakSynonyms = ['break', '(break)', 'no chord', 'n.c.', 'tacet'];

ChordTrack.prototype.basses = {
	'A': 33, 'B': 35, 'C': 36, 'D': 38, 'E': 40, 'F': 41, 'G': 43
};

var chordIntervals = {
	// unusual chords
	"-addb2": [0, 1, 3, 7],
	"maddb2": [0, 1, 3, 7],
	"addb2": [0, 1, 4, 7],
	"susb2": [0, 1, 7],
	"-add2": [0, 2, 3, 7],
	"madd2": [0, 2, 3, 7],
	"add2": [0, 2, 4, 7],
	"sus2": [0, 2, 7],
	"-7sus2": [0, 2, 7, 10],
	"7sus2": [0, 2, 7, 10],
	"m7sus2": [0, 2, 7, 10],
	"min7sus2": [0, 2, 7, 10],
	"7sus2/9": [0, 2, 7, 10, 14],
	"add#2": [0, 3, 4, 7],
	"-add4": [0, 3, 5, 7],
	"madd4": [0, 3, 5, 7],

	// diminished chords
	"dim": [0, 3, 6],
	"m(b5)": [0, 3, 6],
	"°": [0, 3, 6],
	"˚": [0, 3, 6],
	"-add#4": [0, 3, 6, 7],
	"madd#4": [0, 3, 6, 7],
	"dim7": [0, 3, 6, 9],
	"°7": [0, 3, 6, 9],
	"˚7": [0, 3, 6, 9],
	"-7(b5)": [0, 3, 6, 10],
	"-7b5": [0, 3, 6, 10],
	"m7(b5)": [0, 3, 6, 10],
	"m7b5": [0, 3, 6, 10],
	"ø": [0, 3, 6, 10],
	"ø7": [0, 3, 6, 10],

	// minor chords
	"-": [0, 3, 7],
	"m": [0, 3, 7],
	"-(b6)": [0, 3, 7, 8],
	"-b6": [0, 3, 7, 8],
	"m(b6)": [0, 3, 7, 8],
	"mb6": [0, 3, 7, 8],
	"-6": [0, 3, 7, 9],
	"m6": [0, 3, 7, 9],
	"-6(9)": [0, 3, 7, 9, 14],
	"-6/9": [0, 3, 7, 9, 14],
	"-69": [0, 3, 7, 9, 14],
	"m6(9)": [0, 3, 7, 9, 14],
	"m6/9": [0, 3, 7, 9, 14],
	"m69": [0, 3, 7, 9, 14],
	"-7": [0, 3, 7, 10],
	"m7": [0, 3, 7, 10],
	"-7(b9)": [0, 3, 7, 10, 13],
	"-7b9": [0, 3, 7, 10, 13],
	"-7(9)": [0, 3, 7, 10, 14],
	"-7/9": [0, 3, 7, 10, 14],
	"-9": [0, 3, 7, 10, 14],
	"m7(9)": [0, 3, 7, 10, 14],
	"m7/9": [0, 3, 7, 10, 14],
	"m9": [0, 3, 7, 10, 14],
	"-7(9,11)": [0, 3, 7, 10, 14, 17],
	"-7/9/11": [0, 3, 7, 10, 14, 17],
	"m7(9,11)": [0, 3, 7, 10, 14, 17],
	"m7/9/11": [0, 3, 7, 10, 14, 17],
	"-13": [0, 3, 7, 10, 14, 17, 21],
	"-7(9,11,13)": [0, 3, 7, 10, 14, 17, 21],
	"-7/9/11/13": [0, 3, 7, 10, 14, 17, 21],
	"m13": [0, 3, 7, 10, 14, 17, 21],
	"m7(9,11,13)": [0, 3, 7, 10, 14, 17, 21],
	"m7/9/11/13": [0, 3, 7, 10, 14, 17, 21],
	"-7(9,13)": [0, 3, 7, 10, 14, 21],
	"-7/9/13": [0, 3, 7, 10, 14, 21],
	"m7(9,13)": [0, 3, 7, 10, 14, 21],
	"m7/9/13": [0, 3, 7, 10, 14, 21],
	"-7(11)": [0, 3, 7, 10, 17],
	"-7/11": [0, 3, 7, 10, 17],
	"m7(11)": [0, 3, 7, 10, 17],
	"m7/11": [0, 3, 7, 10, 17],
	"-7(11,13)": [0, 3, 7, 10, 17, 21],
	"-7/11/13": [0, 3, 7, 10, 17, 21],
	"m7(11,13)": [0, 3, 7, 10, 17, 21],
	"m7/11/13": [0, 3, 7, 10, 17, 21],
	"-(maj7)": [0, 3, 7, 11],
	"-7M": [0, 3, 7, 11],
	"-maj7": [0, 3, 7, 11],
	"-∆7": [0, 3, 7, 11],
	"m(maj7)": [0, 3, 7, 11],
	"mM7": [0, 3, 7, 11],
	"min(maj7)": [0, 3, 7, 11],
	"-9+7": [0, 3, 7, 11, 13],
	"-(maj9)": [0, 3, 7, 11, 14],
	"-7M(9)": [0, 3, 7, 11, 14],
	"-maj9": [0, 3, 7, 11, 14],
	"-∆9": [0, 3, 7, 11, 14],
	"m(maj9)": [0, 3, 7, 11, 14],
	"mM9": [0, 3, 7, 11, 14],
	"min(maj9)": [0, 3, 7, 11, 14],
	"-11": [0, 3, 7, 11, 14, 17],
	"m11": [0, 3, 7, 11, 14, 17],
	"-addb9": [0, 3, 7, 13],
	"maddb9": [0, 3, 7, 13],
	"-add9": [0, 3, 7, 14],
	"madd9": [0, 3, 7, 14],
	"-add11": [0, 3, 7, 17],
	"madd11": [0, 3, 7, 17],
	"-add#11": [0, 3, 7, 18],
	"madd#11": [0, 3, 7, 18],

	// altered minor chords
	"-#5": [0, 3, 8],
	"-(#5)": [0, 3, 8],
	"m#5": [0, 3, 8],
	"m(#5)": [0, 3, 8],
	"-7#5": [0, 3, 8, 10],
	"-7(#5)": [0, 3, 8, 10],
	"dim7(b13)": [0, 3, 9, 20],
	"°7(b13)": [0, 3, 9, 20],
	"˚7(b13)": [0, 3, 9, 20],

	// altered major chords
	"add4": [0, 4, 5, 7],
	"maj(b5)": [0, 4, 6],
	"majb5": [0, 4, 6],
	"add#4": [0, 4, 6, 7],
	"7(b5)": [0, 4, 6, 10],
	"7b5": [0, 4, 6, 10],
	"7(b5,b9)": [0, 4, 6, 10, 13],
	"7(b9,b5)": [0, 4, 6, 10, 13],
	"7b5(b9)": [0, 4, 6, 10, 13],
	"7b9,b5": [0, 4, 6, 10, 13],
	"7b9b5": [0, 4, 6, 10, 13],
	"7(b5,b9,b13)": [0, 4, 6, 10, 13, 20],
	"7/b5/b9/b13": [0, 4, 6, 10, 13, 20],
	"7b5/b9/b13": [0, 4, 6, 10, 13, 20],
	"7(b5,b9,13)": [0, 4, 6, 10, 13, 21],
	"7/b5/b9/13": [0, 4, 6, 10, 13, 21],
	"7b5/b9/13": [0, 4, 6, 10, 13, 21],
	"7(9,b5)": [0, 4, 6, 10, 14],
	"7(b5,9)": [0, 4, 6, 10, 14],
	"7b5(9)": [0, 4, 6, 10, 14],
	"9b5": [0, 4, 6, 10, 14],
	"13(b5)": [0, 4, 6, 10, 14, 21],
	"13b5": [0, 4, 6, 10, 14, 21],
	"7(b5,9,13)": [0, 4, 6, 10, 14, 21],
	"7/b5/9/13": [0, 4, 6, 10, 14, 21],
	"7b5/9/13": [0, 4, 6, 10, 14, 21],
	"7#9b5": [0, 4, 6, 10, 15],
	"7(#9,b5)": [0, 4, 6, 10, 15],
	"7(b5,#9)": [0, 4, 6, 10, 15],
	"7b5(#9)": [0, 4, 6, 10, 15],
	"7(b5,#9,b13)": [0, 4, 6, 10, 15, 20],
	"7/b5/#9/b13": [0, 4, 6, 10, 15, 20],
	"7b5/#9/b13": [0, 4, 6, 10, 15, 20],
	"7(b5,#9,13)": [0, 4, 6, 10, 15, 21],
	"7/b5/#9/13": [0, 4, 6, 10, 15, 21],
	"7b5/#9/13": [0, 4, 6, 10, 15, 21],
	"7(b5,b13)": [0, 4, 6, 10, 20],
	"7/b5/b13": [0, 4, 6, 10, 20],
	"7b5/b13": [0, 4, 6, 10, 20],
	"7(b5,13)": [0, 4, 6, 10, 21],
	"7/b5/13": [0, 4, 6, 10, 21],
	"7b5(13)": [0, 4, 6, 10, 21],
	"7b5/13": [0, 4, 6, 10, 21],
	"7M(b5)": [0, 4, 6, 11],
	"maj7(b5)": [0, 4, 6, 11],
	"maj7b5": [0, 4, 6, 11],
	"7M(b5,9)": [0, 4, 6, 11, 14],
	"maj7(b5,9)": [0, 4, 6, 11, 14],
	"maj7b5/9": [0, 4, 6, 11, 14],
	"7M(b5,9,13)": [0, 4, 6, 11, 14, 21],
	"maj7(b5,9,13)": [0, 4, 6, 11, 14, 21],
	"maj7b5/9/13": [0, 4, 6, 11, 14, 21],
	"7M(b5,13)": [0, 4, 6, 11, 21],
	"maj7(b5,13)": [0, 4, 6, 11, 21],
	"maj7b5/13": [0, 4, 6, 11, 21],

	// major chords
	"M": [0, 4, 7],
	"Δ": [0, 4, 7],
	"∆": [0, 4, 7],
	"6": [0, 4, 7, 9],
	"6(9)": [0, 4, 7, 9, 14],
	"6/9": [0, 4, 7, 9, 14],
	"69": [0, 4, 7, 9, 14],
	"6add9": [0, 4, 7, 9, 14],
	"6(9,11)": [0, 4, 7, 9, 14, 17],
	"6/9/11": [0, 4, 7, 9, 14, 17],
	"6911": [0, 4, 7, 9, 14, 17],
	"6(9,#11)": [0, 4, 7, 9, 14, 18],
	"6/9/#11": [0, 4, 7, 9, 14, 18],
	"69#11": [0, 4, 7, 9, 14, 18],
	"6(11)": [0, 4, 7, 9, 17],
	"6/11": [0, 4, 7, 9, 17],
	"611": [0, 4, 7, 9, 17],
	"6#11": [0, 4, 7, 9, 18],
	"6(#11)": [0, 4, 7, 9, 18],
	"6/#11": [0, 4, 7, 9, 18],
	"7": [0, 4, 7, 10],
	"7(b9)": [0, 4, 7, 10, 13],
	"7b9": [0, 4, 7, 10, 13],
	"7(9)": [0, 4, 7, 10, 14],
	"7/9": [0, 4, 7, 10, 14],
	"9": [0, 4, 7, 10, 14],
	"7(9,11)": [0, 4, 7, 10, 14, 17],
	"7/9/11": [0, 4, 7, 10, 14, 17],
	"7(9,11,13)": [0, 4, 7, 10, 14, 17, 21],
	"7/9/11/13": [0, 4, 7, 10, 14, 17, 21],
	"7#11": [0, 4, 7, 10, 14, 18],
	"7(#11)": [0, 4, 7, 10, 14, 18],
	"9#11": [0, 4, 7, 10, 14, 18],
	"9(#11)": [0, 4, 7, 10, 14, 18],
	"(13)": [0, 4, 7, 10, 14, 21],
	"13": [0, 4, 7, 10, 14, 21],
	"7(9,13)": [0, 4, 7, 10, 14, 21],
	"7/9/13": [0, 4, 7, 10, 14, 21],
	"9/13": [0, 4, 7, 10, 14, 21],
	"7#9": [0, 4, 7, 10, 15],
	"7(#9)": [0, 4, 7, 10, 15],
	"7(#9,b13)": [0, 4, 7, 10, 15, 20],
	"7(11)": [0, 4, 7, 10, 17],
	"7/11": [0, 4, 7, 10, 17],
	"7(11,13)": [0, 4, 7, 10, 17, 21],
	"7/11/13": [0, 4, 7, 10, 17, 21],
	"13#11": [0, 4, 7, 10, 18, 21],
	"13(#11)": [0, 4, 7, 10, 18, 21],
	"7(b13)": [0, 4, 7, 10, 20],
	"7b13": [0, 4, 7, 10, 20],
	"7(13)": [0, 4, 7, 10, 21],
	"7/13": [0, 4, 7, 10, 21],
	"7M": [0, 4, 7, 11],
	"maj7": [0, 4, 7, 11],
	"Δ7": [0, 4, 7, 11],
	"∆7": [0, 4, 7, 11],
	"7M(9)": [0, 4, 7, 11, 14],
	"7M/9": [0, 4, 7, 11, 14],
	"maj7(9)": [0, 4, 7, 11, 14],
	"maj7/9": [0, 4, 7, 11, 14],
	"maj9": [0, 4, 7, 11, 14],
	"Δ9": [0, 4, 7, 11, 14],
	"∆9": [0, 4, 7, 11, 14],
	"7M(9,11)": [0, 4, 7, 11, 14, 17],
	"7M/9/11": [0, 4, 7, 11, 14, 17],
	"maj11": [0, 4, 7, 11, 14, 17],
	"maj7(9,11)": [0, 4, 7, 11, 14, 17],
	"maj7/9/11": [0, 4, 7, 11, 14, 17],
	"Δ11": [0, 4, 7, 11, 14, 17],
	"∆11": [0, 4, 7, 11, 14, 17],
	"7M(9,11,13)": [0, 4, 7, 11, 14, 17, 21],
	"7M/9/11/13": [0, 4, 7, 11, 14, 17, 21],
	"maj13": [0, 4, 7, 11, 14, 17, 21],
	"maj7(9,11,13)": [0, 4, 7, 11, 14, 17, 21],
	"maj7/9/11/13": [0, 4, 7, 11, 14, 17, 21],
	"Δ11(13)": [0, 4, 7, 11, 14, 17, 21],
	"Δ13": [0, 4, 7, 11, 14, 17, 21],
	"∆11(13)": [0, 4, 7, 11, 14, 17, 21],
	"7M(9,#11)": [0, 4, 7, 11, 14, 18],
	"7M/9/#11": [0, 4, 7, 11, 14, 18],
	"maj7(9,#11)": [0, 4, 7, 11, 14, 18],
	"maj7/9/#11": [0, 4, 7, 11, 14, 18],
	"maj9#11": [0, 4, 7, 11, 14, 18],
	"maj9(#11)": [0, 4, 7, 11, 14, 18],
	"maj9/#11": [0, 4, 7, 11, 14, 18],
	"Δ9(#11)": [0, 4, 7, 11, 14, 18],
	"7M(9,#11,13)": [0, 4, 7, 11, 14, 18, 21],
	"7M/9/#11/13": [0, 4, 7, 11, 14, 18, 21],
	"maj13#11": [0, 4, 7, 11, 14, 18, 21],
	"maj13(#11)": [0, 4, 7, 11, 14, 18, 21],
	"maj13/#11": [0, 4, 7, 11, 14, 18, 21],
	"Δ13(#11)": [0, 4, 7, 11, 14, 18, 21],
	"∆13(#11)": [0, 4, 7, 11, 14, 18, 21],
	"7M(9,13)": [0, 4, 7, 11, 14, 21],
	"7M/9/13": [0, 4, 7, 11, 14, 21],
	"maj7(9,13)": [0, 4, 7, 11, 14, 21],
	"maj7/9/13": [0, 4, 7, 11, 14, 21],
	"maj9(13)": [0, 4, 7, 11, 14, 21],
	"Δ9(13)": [0, 4, 7, 11, 14, 21],
	"∆9(13)": [0, 4, 7, 11, 14, 21],
	"7M(11)": [0, 4, 7, 11, 17],
	"7M/11": [0, 4, 7, 11, 17],
	"maj7(11)": [0, 4, 7, 11, 17],
	"maj7/11": [0, 4, 7, 11, 17],
	"Δ7(11)": [0, 4, 7, 11, 17],
	"∆7(11)": [0, 4, 7, 11, 17],
	"7M(#11)": [0, 4, 7, 11, 18],
	"7M/#11": [0, 4, 7, 11, 18],
	"maj7(#11)": [0, 4, 7, 11, 18],
	"maj7/#11": [0, 4, 7, 11, 18],
	"Δ7(#11)": [0, 4, 7, 11, 18],
	"∆7(#11)": [0, 4, 7, 11, 18],
	"7M(13)": [0, 4, 7, 11, 21],
	"7M/13": [0, 4, 7, 11, 21],
	"maj7(13)": [0, 4, 7, 11, 21],
	"maj7/13": [0, 4, 7, 11, 21],
	"Δ7(13)": [0, 4, 7, 11, 21],
	"∆7(13)": [0, 4, 7, 11, 21],
	"addb9": [0, 4, 7, 13],
	"add9": [0, 4, 7, 14],
	"add#9": [0, 4, 7, 15],
	"add11": [0, 4, 7, 17],
	"add#11": [0, 4, 7, 18],

	// augmented chords
	"+": [0, 4, 8],
	"aug": [0, 4, 8],
	"+7": [0, 4, 8, 10],
	"7#5": [0, 4, 8, 10],
	"7(#5)": [0, 4, 8, 10],
	"7+5": [0, 4, 8, 10],
	"aug7": [0, 4, 8, 10],
	"7(b9,#5)": [0, 4, 8, 10, 13],
	"7b9#5": [0, 4, 8, 10, 13],
	"9#5": [0, 4, 8, 10, 14],
	"9(#5)": [0, 4, 8, 10, 14],
	"9+5": [0, 4, 8, 10, 14],
	"13#5": [0, 4, 8, 10, 14, 21],
	"13(#5)": [0, 4, 8, 10, 14, 21],
	"7M(#5)": [0, 4, 8, 11],
	"maj7#5": [0, 4, 8, 11],
	"maj7(#5)": [0, 4, 8, 11],
	"7M(#5,9)": [0, 4, 8, 11, 14],
	"maj7#5/9": [0, 4, 8, 11, 14],
	"maj7(#5,9)": [0, 4, 8, 11, 14],
	"maj7#5#11": [0, 4, 8, 11, 18],
	"maj7(#5,#11)": [0, 4, 8, 11, 18],

	// sus4 chords
	"sus": [0, 5, 7],
	"sus4": [0, 5, 7],
	"-7sus4": [0, 5, 7, 10],
	"7sus": [0, 5, 7, 10],
	"7sus4": [0, 5, 7, 10],
	"m7sus4": [0, 5, 7, 10],
	"min7sus4": [0, 5, 7, 10],
	"7sus(b9)": [0, 5, 7, 10, 13],
	"7sus4(b9)": [0, 5, 7, 10, 13],
	"-9sus4": [0, 5, 7, 10, 14],
	"7sus4(9)": [0, 5, 7, 10, 14],
	"7sus4/9": [0, 5, 7, 10, 14],
	"9sus": [0, 5, 7, 10, 14],
	"9sus4": [0, 5, 7, 10, 14],
	"m9sus4": [0, 5, 7, 10, 14],
	"min9sus4": [0, 5, 7, 10, 14],
	"11sus4": [0, 5, 7, 10, 14, 17],
	"13sus4": [0, 5, 7, 10, 14, 21],
	"7sus(#9)": [0, 5, 7, 10, 15],
	"7sus4(#9)": [0, 5, 7, 10, 15],
	"7sus4(11)": [0, 5, 7, 10, 17],
	"7sus4(13)": [0, 5, 7, 10, 21],
	"7Msus": [0, 5, 7, 11],
	"7Msus4": [0, 5, 7, 11],
	"maj7sus": [0, 5, 7, 11],
	"maj7sus4": [0, 5, 7, 11],

	// power chords and unusual chords
	"#4": [0, 6],
	"b5": [0, 6],
	"sus#4": [0, 6, 7],
	"7Msus#4": [0, 6, 11],
	"maj7sus#4": [0, 6, 11],
	"5": [0, 7],
	"11": [0, 7, 10, 14, 17],
	"5(8)": [0, 7, 12],
	"5add8": [0, 7, 12],
	"5(9)": [0, 7, 14],
	"5add9": [0, 7, 14],
	"#5": [0, 8],
	"b6": [0, 8],
}

ChordTrack.prototype.rhythmPatterns = {
	"2/2": ['boom', '', '', '', 'chick', '', '', ''],
	"3/2": ['boom', '', '', '', 'chick', '', '', '', 'chick', '', '', ''],
	"4/2": ['boom', '', '', '', 'chick', '', '', '', 'boom', '', '', '', 'chick', '', '', ''],

	"2/4": ['boom', '', 'chick', ''],
	"3/4": ['boom', '', 'chick', '', 'chick', ''],
	"4/4": ['boom', '', 'chick', '', 'boom', '', 'chick', ''],
	"5/4": ['boom', '', 'chick', '', 'chick', '', 'boom', '', 'chick', ''],
	"6/4": ['boom', '', 'chick', '', 'boom', '', 'chick', '', 'boom', '', 'chick', ''],

	"3/8": ['boom', '', 'chick'],
	"5/8": ['boom', 'chick', 'chick', 'boom', 'chick'],
	"6/8": ['boom', '', 'chick', 'boom', '', 'chick'],
	"7/8": ['boom', 'chick', 'chick', 'boom', 'chick', 'boom', 'chick'],
	"9/8": ['boom', '', 'chick', 'boom', '', 'chick', 'boom', '', 'chick'],
	"10/8": ['boom', 'chick', 'chick', 'boom', 'chick', 'chick', 'boom', 'chick', 'boom', 'chick'],
	"11/8": ['boom', 'chick', 'chick', 'boom', 'chick', 'chick', 'boom', 'chick', 'boom', 'chick', 'chick'],
	"12/8": ['boom', '', 'chick', 'boom', '', 'chick', 'boom', '', 'chick', 'boom', '', 'chick'],
};

// TODO-PER: these are repeated in flattener. Can it be shared?

function timeToRealTime(time) {
	return time / 1000000;
}

function durationRounded(duration, tempoChangeFactor) {
	return Math.round(duration * tempoChangeFactor * 1000000) / 1000000;
}

module.exports = ChordTrack;
