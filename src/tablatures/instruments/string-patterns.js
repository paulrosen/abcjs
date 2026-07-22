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
    var myPitch = pitches[iii];
    var nextNote = self.highestNote; // fallback: this string has no higher neighbor
    var bestHigherIdx = -1;
    for (var kkk = 0; kkk < tuning.length; kkk++) {
      if (kkk === iii) continue;
      if (pitches[kkk] > myPitch && (bestHigherIdx === -1 || pitches[kkk] < pitches[bestHigherIdx])) {
        bestHigherIdx = kkk;
      }
    }
    if (bestHigherIdx !== -1) {
      nextNote = tuning[bestHigherIdx];
    }
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


function computeStringCandidates(self, note) {
  // Every string this note can physically be played on (fret >= 0),
  // independent of tuning order -- required for reentrant tunings.
  var pitch = note.pitch + note.pitchAltered;
  if (note.quarter === '^') pitch -= 0.5;
  else if (note.quarter === "v") pitch += 0.5;
  var candidates = [];
  for (var i = 0; i < self.stringPitches.length; i++) {
    var fret = pitch - self.stringPitches[i];
    if (fret >= 0) {
      candidates.push({ arrIndex: i, num: Math.round(fret) });
    }
  }
  candidates.sort(function (a, b) { return a.num - b.num; });
  return candidates;
}

function bestChordAssignment(candidateLists) {
  // Finds the note->string bijection (one note per distinct string)
  // that minimizes the worst fret used, tie-broken by fret spread,
  // then by total fret sum. Brute-force backtracking: chords rarely
  // exceed 6 notes, so this is cheap regardless of tuning shape.
  var n = candidateLists.length;
  var usedStrings = {};
  var current = new Array(n);
  var best = null, bestCost = null;

  function cost(assignment) {
    var max = -Infinity, min = Infinity, sum = 0;
    for (var i = 0; i < assignment.length; i++) {
      var f = assignment[i].num;
      if (f > max) max = f;
      if (f < min) min = f;
      sum += f;
    }
    return { max: max, spread: max - min, sum: sum };
  }
  function better(a, b) {
    if (a.max !== b.max) return a.max < b.max;
    if (a.spread !== b.spread) return a.spread < b.spread;
    return a.sum < b.sum;
  }
  function backtrack(noteIdx) {
    if (noteIdx === n) {
      var c = cost(current);
      if (!best || better(c, bestCost)) { best = current.slice(); bestCost = c; }
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
  }
  backtrack(0);
  return best; // null if no complete valid assignment exists
}

function handleChordNotes(self, notes) {
  var activeNotes = [];
  for (var iiii = 0; iiii < notes.length; iiii++) {
    if (notes[iiii].endTie) continue;
    var note = new TabNote(notes[iiii].name, self.clefTranspose);
    note.checkKeyAccidentals(self.accidentals, self.measureAccidentals);
    activeNotes.push(note);
  }
  if (activeNotes.length === 0) return [];

  var numStrings = self.stringPitches.length;

  if (activeNotes.length > numStrings) {
    // Physically impossible (more simultaneous notes than strings) --
    // no valid bijection can exist. Fall back to independent placement.
    return activeNotes.map(function (n) { return toNumber(self, n); });
  }

  var candidateLists = activeNotes.map(function (n) {
    return computeStringCandidates(self, n);
  });
  var assignment = bestChordAssignment(candidateLists);

  if (!assignment) {
    // No complete valid assignment exists for this exact chord on this
    // instrument (rare). Fall back rather than dropping notes silently.
    return activeNotes.map(function (n) { return toNumber(self, n); });
  }

  var retNotes = [];
  for (var jj = 0; jj < activeNotes.length; jj++) {
    var chosen = assignment[jj];
    retNotes.push({
      num: chosen.num,
      str: numStrings - 1 - chosen.arrIndex,
      note: activeNotes[jj]
    });
  }
  return retNotes;
}


function toNumber(self, note) {
  if (note.isAltered || note.natural) {
    var acc;
    if (note.isFlat) {
      if (note.isDouble) acc = "__"; else acc = "_";
    } else if (note.isSharp) {
      if (note.isDouble) acc = "^^"; else acc = "^";
    } else if (note.natural) acc = "=";
    self.measureAccidentals[note.name.toUpperCase()] = acc;
  }

  var pitch = note.pitch + note.pitchAltered;
  if (note.quarter === '^') pitch -= 0.5;
  else if (note.quarter === "v") pitch += 0.5;

  // Check every string, independent of array order -- required for
  // reentrant tunings (ukulele high-G etc). Collect every string on
  // which this pitch is physically playable (fret >= 0).
  var candidates = [];
  for (var i = 0; i < self.stringPitches.length; i++) {
    var fret = pitch - self.stringPitches[i];
    if (fret >= 0) {
      candidates.push({ arrIndex: i, num: fret });
    }
  }
  if (candidates.length === 0) {
    return {
      num: "?",
      str: self.stringPitches.length - 1,
      note: note
    };
  }

  // Prefer the lowest fret; on ties, prefer the string closest to the
  // one used for the previous note, to avoid needless jumps across the tab.
  candidates.sort(function (a, b) {
    if (a.num !== b.num) return a.num - b.num;
    if (self.lastArrIndex != null) {
      return Math.abs(a.arrIndex - self.lastArrIndex) - Math.abs(b.arrIndex - self.lastArrIndex);
    }
    return 0;
  });
  var chosen = candidates[0];
  self.lastArrIndex = chosen.arrIndex;

  return {
    num: Math.round(chosen.num),
    str: self.stringPitches.length - 1 - chosen.arrIndex, // unchanged display-order convention
    note: note
  };
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
		var str = this.tuning[i].replaceAll(',', '').replaceAll("'", '').toUpperCase();
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
	this.lastArrIndex = null;
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