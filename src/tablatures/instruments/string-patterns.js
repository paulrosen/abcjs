const { noteToMidi } = require('../../synth/note-to-midi');
var TabNote = require('./tab-note');
var tabNotes = require('./tab-notes');


function buildCapo(self) {
	var capoTuning = null;
	var tuning = self.tuning;
	if (self.capo > 0) {
		capoTuning = [];
		for (var iii = 0; iii < tuning.length; iii++) {
			var curNote = new TabNote(tuning[iii]);
			for (var jjj = 0; jjj < self.capo; jjj++) {
				curNote = curNote.nextNote();
			}
			capoTuning[iii] = curNote.emit();
		}
	}
	return capoTuning;
}

function buildPatterns(self) {
	var strings = [];
	var tuning = self.tuning;
	if (self.capo > 0) {
		tuning = self.capoTuning;
	}
	var pitches = self.stringPitches; // already computed, capo-aware
	var pos = tuning.length - 1;
	for (var iii = 0; iii < tuning.length; iii++) {
		// The notes of a string go up to the next higher string -- searched by
		// pitch rather than by position, so that reentrant tunings are accepted.
		var nextNote = self.highestNote; // no higher string
		var nextIdx = -1;
		for (var kkk = 0; kkk < tuning.length; kkk++) {
			if (pitches[kkk] > pitches[iii] && (nextIdx === -1 || pitches[kkk] < pitches[nextIdx]))
				nextIdx = kkk;
		}
		if (nextIdx !== -1)
			nextNote = tuning[nextIdx];
		var stringNotes = tabNotes(tuning[iii], nextNote);
		if (stringNotes.error) {
			return stringNotes;
		}
		strings[pos--] = stringNotes;
	}
	return strings;
}


function buildSecond(first) {
	var seconds = [];
	seconds[0] = [];
	var strings = first.strings;
	for (var iii = 1; iii < strings.length; iii++) {
		seconds[iii] = strings[iii - 1];
	}
	return seconds;
}

/*
 * Choosing a string for each note
 *
 * 1. noteCandidates(): every string on which a note can be played, with its fret.
 *    The strings are tested by pitch, not by position, so reentrant tunings
 *    (high-G ukulele, 5-string banjo...) work.
 * 2. Single notes (toNumber): the lowest fret; on a tie, the string closest to
 *    the previous note. For ascending tunings this is the same choice as before.
 * 3. Chords (handleChordNotes): one note per string, the best voicing according
 *    to isBetterAssignment(), found by searchAssignment().
 *
 * "arrIndex" is the index of the string in the tuning (0 = first string of the
 * tuning); the "str" returned to the renderer counts from the other end.
 */

// An explicit accidental applies to the following notes of the same measure.
function recordMeasureAccidental(self, note) {
	if (note.isAltered || note.natural) {
		var acc;
		if (note.isFlat) {
			if (note.isDouble) acc = "__"; else acc = "_";
		} else if (note.isSharp) {
			if (note.isDouble) acc = "^^"; else acc = "^";
		} else if (note.natural)
			acc = "=";
		self.measureAccidentals[note.name.toUpperCase()] = acc;
	}
}

// Every string this note can be played on: { arrIndex, fret (exact), num (displayed) },
// lowest fret first.
function noteCandidates(self, note) {
	var pitch = note.pitch + note.pitchAltered;
	if (note.quarter === '^') pitch -= 0.5;
	else if (note.quarter === "v") pitch += 0.5;
	var candidates = [];
	for (var i = 0; i < self.stringPitches.length; i++) {
		var fret = pitch - self.stringPitches[i];
		if (fret >= 0)
			candidates.push({ arrIndex: i, fret: fret, num: Math.round(fret) });
	}
	candidates.sort(function (a, b) { return a.fret - b.fret; });
	return candidates;
}

function toNumber(self, note) {
	recordMeasureAccidental(self, note);
	var candidates = noteCandidates(self, note);
	if (candidates.length === 0) {
		return {
			num: "?",
			str: self.stringPitches.length - 1,
			note: note
		};
	}
	// lowest fret; on a tie, the string closest to the previous note
	if (self.lastArrIndex != null) {
		candidates.sort(function (a, b) {
			if (a.fret !== b.fret) return a.fret - b.fret;
			return Math.abs(a.arrIndex - self.lastArrIndex) - Math.abs(b.arrIndex - self.lastArrIndex);
		});
	}
	var chosen = candidates[0];
	self.lastArrIndex = chosen.arrIndex;
	return {
		num: chosen.num,
		str: self.stringPitches.length - 1 - chosen.arrIndex,
		note: note
	};
}

function assignmentCost(assignment) {
	var max = -Infinity, min = Infinity, sum = 0, count = 0;
	for (var i = 0; i < assignment.length; i++) {
		if (!assignment[i]) continue;
		count++;
		var f = assignment[i].num;
		if (f > max) max = f;
		if (f < min) min = f;
		sum += f;
	}
	return { max: max, spread: max - min, sum: sum, count: count };
}

// Ranking of chord voicings:
// 1. as many notes as possible on distinct strings,
// 2. the lowest highest fret,
// 3. the lowest sum of frets (each note as low as possible),
// 4. the smallest spread,
// 5. on a perfect tie (unisons), earlier notes on lower strings.
function isBetterAssignment(a, aCost, b, bCost) {
	if (aCost.count !== bCost.count) return aCost.count > bCost.count;
	if (aCost.max !== bCost.max) return aCost.max < bCost.max;
	if (aCost.sum !== bCost.sum) return aCost.sum < bCost.sum;
	if (aCost.spread !== bCost.spread) return aCost.spread < bCost.spread;
	for (var i = 0; i < a.length; i++) {
		var ai = a[i] ? a[i].arrIndex : Infinity;
		var bi = b[i] ? b[i].arrIndex : Infinity;
		if (ai !== bi) return ai < bi;
	}
	return false;
}

// Best voicing: one candidate per note, never two notes on the same string.
// With allowUnplaced, notes may be left without a string (shown as "?") when
// no complete voicing exists. Exhaustive backtracking: chords have few notes.
function searchAssignment(candidateLists, allowUnplaced) {
	var n = candidateLists.length;
	var usedStrings = {};
	var current = new Array(n);
	var best = null, bestCost = null;

	function backtrack(noteIdx) {
		if (noteIdx === n) {
			var cost = assignmentCost(current);
			if (!best || isBetterAssignment(current, cost, best, bestCost)) {
				best = current.slice();
				bestCost = cost;
			}
			return;
		}
		var cands = candidateLists[noteIdx];
		for (var ii = 0; ii < cands.length; ii++) {
			var cand = cands[ii];
			if (usedStrings[cand.arrIndex]) continue;
			usedStrings[cand.arrIndex] = true;
			current[noteIdx] = cand;
			backtrack(noteIdx + 1);
			usedStrings[cand.arrIndex] = false;
		}
		if (allowUnplaced) {
			current[noteIdx] = null;
			backtrack(noteIdx + 1);
		}
	}
	backtrack(0);
	return best; // null when no voicing exists
}

function handleChordNotes(self, notes) {
	var activeNotes = [];
	for (var iiii = 0; iiii < notes.length; iiii++) {
		if (notes[iiii].endTie)
			continue;
		var note = new TabNote(notes[iiii].name, self.clefTranspose);
		note.checkKeyAccidentals(self.accidentals, self.measureAccidentals);
		recordMeasureAccidental(self, note);
		activeNotes.push(note);
	}
	if (activeNotes.length === 0)
		return [];

	// With more notes than strings, the partial search places as many notes as
	// possible and marks the others "?" instead of stacking two on one string.
	var numStrings = self.stringPitches.length;
	var candidateLists = activeNotes.map(function (n) { return noteCandidates(self, n); });
	var assignment = searchAssignment(candidateLists, false) || searchAssignment(candidateLists, true);

	var retNotes = [];
	for (var jj = 0; jj < activeNotes.length; jj++) {
		var chosen = assignment[jj];
		if (chosen)
			retNotes.push({ num: chosen.num, str: numStrings - 1 - chosen.arrIndex, note: activeNotes[jj] });
		else // no free string left for this note in this voicing: "?" on the bottom string, as before
			retNotes.push({ num: "?", str: numStrings - 1, note: activeNotes[jj] });
	}
	return retNotes;
}

StringPatterns.prototype.stringToPitch = function (stringNumber) {
	var startingPitch = 5.3;
	var bottom = this.strings.length - 1;
	return startingPitch + ((bottom - stringNumber) * this.linePitch);
};

function invalidNumber(retNotes, note) {
	var number = {
		num: "?",
		str: 0,
		note: note
	};
	retNotes.push(number);
	retNotes.error = note.emit() + ': unexpected note for instrument';
}

StringPatterns.prototype.notesToNumber = function (notes, graces) {
	var note;
	var number;
	var error = null;
	var retNotes = null;
	if (notes) {
		retNotes = [];
		if (notes.length > 1) {
			retNotes = handleChordNotes(this, notes);
			if (retNotes.error) {
				error = retNotes.error;
			}
		} else {
			if (!notes[0].endTie) {
				note = new TabNote(notes[0].name, this.clefTranspose);
				note.checkKeyAccidentals(this.accidentals, this.measureAccidentals)
				number = toNumber(this, note);
				if (number) {
					retNotes.push(number);
				} else {
					invalidNumber(retNotes, note);
					error = retNotes.error;
				}
			}
		}
	}
	if (error) return retNotes;
	var retGraces = null;
	if (graces) {
		retGraces = [];
		for (var iiii = 0; iiii < graces.length; iiii++) {
			note = new TabNote(graces[iiii].name, this.clefTranspose);
			note.checkKeyAccidentals(this.accidentals, this.measureAccidentals)
			number = toNumber(this, note);
			if (number) {
				retGraces.push(number);
			} else {
				invalidNumber(retGraces, note);
				error = retNotes.error;
			}
		}
	}

	return {
		notes: retNotes,
		graces: retGraces,
		error: error
	};
};

StringPatterns.prototype.toString = function () {
	var arr = []
	for (var i = 0; i < this.tuning.length; i++) {
		var str = this.tuning[i].replace(/,/g, '').replace(/'/g, '').toUpperCase();
		if (str[0] === '_') str = str[1] + 'b '
		else if (str[0] === '^') str = str[1] + "# "
		arr.push(str)
	}
	return arr.join('');
};

StringPatterns.prototype.tabInfos = function (plugin) {
	var name = plugin.params.label;
	if (name) {
		var tunePos = name.indexOf('%T');
		var tuning = "";
		if (tunePos != -1) {
			tuning = this.toString();
			if (plugin.capo > 0) {
				tuning += ' capo:' + plugin.capo;
			}
			name = name.replace('%T', tuning);
		}
		return name;
	}
	return '';
};

// MAE 27 Nov 2023
StringPatterns.prototype.suppress = function (plugin) {
	var suppress = plugin.params.suppress;
	if (suppress) {
		return true;
	}
	return false;
};
// MAE 27 Nov 2023 End

/**
 * Common patterns for all string instruments
 * @param {} plugin
 * @param {} tuning
 * @param {*} capo
 * @param {*} highestNote 
 */
function StringPatterns(plugin) {
	//console.log("INIT StringPatterns constructor")
	var tuning = plugin.tuning;
	var capo = plugin.capo;
	var highestNote = plugin.params.highestNote;
	this.linePitch = plugin.linePitch;
	this.highestNote = "a'";
	if (highestNote) {
		// override default
		this.highestNote = highestNote;
	}
	this.measureAccidentals = {}
	this.capo = 0;
	if (capo) {
		this.capo = parseInt(capo, 10);
	}
	this.transpose = plugin.transpose ? plugin.transpose : 0
	this.tuning = tuning;
	this.lastArrIndex = null; // string of the previous note (see toNumber)
	this.stringPitches = []
	for (var i = 0; i < this.tuning.length; i++) {
		var pitch = noteToMidi(this.tuning[i]) + this.capo
		this.stringPitches.push(pitch)
	}
	if (this.capo > 0) {
		this.capoTuning = buildCapo(this);
	}
	this.strings = buildPatterns(this);
	if (this.strings.error) {
		plugin.setError(this.strings.error);
		plugin.inError = true;
		return;
	}
	// second position pattern per string
	this.secondPos = buildSecond(this);
}



module.exports = StringPatterns;
