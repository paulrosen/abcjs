const {noteToMidi} = require('../../synth/note-to-midi');
var TabNote = require('./tab-note');
var TabNotes = require('./tab-notes');


function buildCapo(self) {
  var capoTuning = null;
  var tuning = self.tuning;
  if (self.capo > 0) {
    capoTuning = [];
    for (var iii = 0; iii < tuning.length; iii++) {
      var curNote = new TabNote.TabNote(tuning[iii]);
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
  var pos = tuning.length - 1;
  for (var iii = 0; iii < tuning.length; iii++) {
    var nextNote = self.highestNote; // highest handled note
    if (iii != tuning.length - 1) {
      nextNote = tuning[iii + 1];
    }
    var tabNotes = new TabNotes(tuning[iii],nextNote);
    var stringNotes = tabNotes.build();
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

function sameString(self, chord) {
  for (var jjjj = 0; jjjj < chord.length - 1; jjjj++) {
    var curPos = chord[jjjj];
    var nextPos = chord[jjjj + 1];
    if (curPos.str == nextPos.str) {
      // same String
      // => change lower pos 
      if (curPos.str == self.strings.length - 1) {
        // Invalid tab Chord position for instrument
        curPos.num = "?";
        nextPos.num = "?"; 
        return; 
      }
      // change lower pitch on lowest string
      if (nextPos.num < curPos.num) {
        nextPos.str++;
        nextPos = noteToNumber(self,
          nextPos.note,
          nextPos.str,
          self.secondPos,
          self.strings[nextPos.str].length
        );
      } else {
        curPos.str++;
        curPos = noteToNumber(self,
          curPos.note,
          curPos.str,
          self.secondPos,
          self.strings[curPos.str].length
        );
      }
      // update table
      chord[jjjj] = curPos;
      chord[jjjj + 1] = nextPos;
    }
  }
  return null;
}

function handleChordNotes(self, notes) {
  var retNotes = [];
  for (var iiii = 0; iiii < notes.length; iiii++) {
    if (notes[iiii].endTie)
      continue;
    var note = new TabNote.TabNote(notes[iiii].name, self.clefTranspose);
    note.checkKeyAccidentals(self.accidentals, self.measureAccidentals)
    var curPos = toNumber(self, note);
    retNotes.push(curPos);
  }
  sameString(self, retNotes);
  return retNotes;
}

function noteToNumber(self, note, stringNumber, secondPosition , firstSize) {
  var strings = self.strings;
  note.checkKeyAccidentals(self.accidentals, self.measureAccidentals) ;
  if (secondPosition) {
    strings = secondPosition;
  }
  var noteName = note.emitNoAccidentals();
  var num = strings[stringNumber].indexOf(noteName);
  var acc = note.acc;
  if (num != -1) {
    if (secondPosition) {
      num += firstSize;
    }
    if ( (note.isFlat || note.acc == -1) && (num == 0)) {
      // flat on 0 pos => previous string 7th position
      var noteEquiv = note.getAccidentalEquiv();
      stringNumber++;
      num = strings[stringNumber].indexOf(noteEquiv.emit());
      acc = 0;
    }
    return {
      num: (num + acc),
      str: stringNumber,
      note: note
    };
  }
  return null;
}

function toNumber(self, note) {
  if (note.isAltered || note.natural) {
    var acc;
    if (note.isFlat) {
      if (note.isDouble)
        acc = "__"
      else
        acc = "_"  
    } else if (note.isSharp) {
      if (note.isDouble)
        acc = "^^"
      else
        acc = "^"  
    } else if (note.natural)
      acc = "="
    self.measureAccidentals[note.name.toUpperCase()] = acc  
  }
  for (var i = self.stringPitches.length-1; i >= 0; i--) {
    if (note.pitch + note.pitchAltered >= self.stringPitches[i]) {
      var num = note.pitch + note.pitchAltered - self.stringPitches[i]
      if (note.quarter === '^') num -= 0.5
      else if (note.quarter === "v") num += 0.5
      return {
        num: Math.round(num),
        str: self.stringPitches.length-1-i, // reverse the strings because string 0 is on the bottom
        note: note
      }
    }
  }
  return {
    num: "?",
    str: self.stringPitches.length-1,
    note: note,
  };
}

StringPatterns.prototype.stringToPitch = function (stringNumber) {
  var startingPitch = 5.3;
  var bottom = this.strings.length - 1;
  return startingPitch + ((bottom - stringNumber) * this.linePitch);
};

function invalidNumber( retNotes , note ) {
  var number = {
    num: "?",
    str: 0,
    note: note
  };
  retNotes.push(number);
  retNotes.error = note.emit() + ': unexpected note for instrument' ;
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
        note = new TabNote.TabNote(notes[0].name, this.clefTranspose);
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
      note = new TabNote.TabNote(graces[iiii].name, this.clefTranspose);
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
  var _super = plugin._super;
  var name = _super.params.label;
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

/**
 * Common patterns for all string instruments
 * @param {} plugin
 * @param {} tuning
 * @param {*} capo
 * @param {*} highestNote 
 */
function StringPatterns(plugin) {
  var tuning = plugin.tuning;
  var capo = plugin.capo;
  var highestNote = plugin._super.params.highestNote;
  this.linePitch = plugin.linePitch;
  this.highestNote = "a'";
  if (highestNote) {
    // override default
    this.highestNote = highestNote;
  }
  this.measureAccidentals = {}
  this.capo = 0;
  if (capo) {
    this.capo = parseInt(capo,10);
  }
  this.transpose = plugin.transpose ? plugin.transpose : 0
  this.tuning = tuning;
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
    plugin._super.setError(this.strings.error);
    plugin.inError = true;
    return;
  }
  // second position pattern per string
  this.secondPos = buildSecond(this);
}



module.exports = StringPatterns;