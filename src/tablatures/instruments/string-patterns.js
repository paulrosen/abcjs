var TabNote = require('./tab-note');
var TabNotes = require('./tab-notes');


function buildCapo(self) {
  var capoTuning = null;
  var tuning = self.tuning;
  if (self.capo > 0) {
    capoTuning = [];
    for (iii = 0; iii < tuning.length; iii++) {
      var curNote = new TabNote.TabNote(tuning[iii]);
      for (jjj = 0; jjj < self.capo; jjj++) {
        curNote = curNote.nextNote();
      }
      capoTuning[iii] = curNote.emit();
    }
  }
  return capoTuning;
}

function buildPatterns(self) {
  var strings = []
  var tuning = self.tuning;
  if (self.capo > 0) {
    tuning = self.capoTuning;
  }
  var pos = tuning.length - 1;
  for (iii = 0; iii < tuning.length; iii++) {
    var nextNote = self.highestNote; // highest handled note
    if (iii != tuning.length - 1) {
      nextNote = tuning[iii + 1];
    }
    tabNotes = new TabNotes(tuning[iii], nextNote);
    strings[pos--] = tabNotes.build();
  }
  return strings;
}


function buildSecond(first) {
  var seconds = [];
  seconds[0] = [];
  var strings = first.strings
  for (iii = 1; iii < strings.length; iii++) {
    seconds[iii] = strings[iii - 1];
  }
  return seconds;
}

function checkKeyAccidentals(note, accidentals) {
  if (accidentals) {
    for (iii = 0; iii < accidentals.length; iii++) {
      if (note[0].toUpperCase() == accidentals[iii].note.toUpperCase()) {
        if (accidentals[iii].acc == 'flat') {
          return '_' + note;
        }
        if (accidentals[iii].acc == 'sharp') {
          return '^' + note;
        }
      }
    }
  }
  return note;
}

function checkNote(note, accidentals) {
  var isFlat = false;
  var newNote = note;
  var isSharp = false;
  var isAltered = false;
  var acc = 0;

  note = checkKeyAccidentals(note, accidentals);
  if (note.startsWith('_')) {
    isFlat = true;
    acc = -1;
  } else if (note.startsWith('^')) {
    isSharp = true;
    // acc = +1;
  }
  isAltered = isFlat || isSharp;
  if (isFlat) {
    newNote = note.slice(1);
  }
  return {
    'isAltered': isAltered,
    'isSharp': isSharp,
    'isFlat': isFlat,
    'name': newNote,
    'acc': acc
  }
}

function sameString(self, chord) {
  for (jjjj = 0; jjjj < chord.length - 1; jjjj++) {
    var curPos = chord[jjjj];
    var nextPos = chord[jjjj + 1];
    if (curPos.str == nextPos.str) {
      // same String
      // => change lower pos 
      if (curPos.str == self.strings.length - 1) {
        self.hasError = 'Invalid tab Chord position for instrument';
      }
      // change lower pitch on lowest string
      if (nextPos.num < curPos.num) {
        nextPos.str++;
        nextPos = noteToNumber(self,
          nextPos.note,
          nextPos.str,
          self.secondPos
        );
      } else {
        curPos.str++;
        curPos = noteToNumber(self,
          curPos.note,
          curPos.str,
          self.secondPos
        );
      }
      if (nextPos == null || curPos == null) {
        self.hasError = "Can't map tab Chord position for instrument";
      }
      // update table
      chord[jjjj] = curPos;
      chord[jjjj + 1] = nextPos;
    }
  }
}

function handleChordNotes(self, notes) {
  retNotes = [];
  for (iiii = 0; iiii < notes.length; iiii++) {
    var note = checkNote(notes[iiii].name, this.accidentals);
    var curPos = toNumber(self, note);
    retNotes.push(curPos);
  }
  var error = sameString(self, retNotes)
  return retNotes;
}

function EBsharp(note) {
  if (note.isSharp) {
    var name = note.name[1];
    if ((name == 'B') || (name == 'E')) {
      // unusual #B and E case
      note.isSharp = false;
      note.isAltered = false;
      note.acc = 0;
      switch (note.name[1]) {
        case 'E':
          if (note.name.length > 2) {
            note.name = 'f'
          } else {
            note.name = 'F';
          }
          break;
        case 'e':
          note.name = 'f';
          break;
        case 'B':
          if (note.name.length > 2) {
            note.name = 'C'
          } else {
            note.name = 'c';
          }
          break;
        case 'b':
          note.name = 'c';
          break;
      }
    }
  }
  return note;
}



function noteToNumber(self, note, stringNumber, secondPosition) {
  var strings = self.strings;
  if (secondPosition) {
    strings = secondPosition;
  }
  note = EBsharp(note);
  num = strings[stringNumber].indexOf(note.name);
  if (num != -1) {
    if (secondPosition) {
      num += 7;
    }
    if (note.isFlat && (num == 0)) {
      // flat on 0 pos => previous string Fifth position
      stringNumber++;
      num = 7;
    }
    return {
      num: (num + note.acc),
      str: stringNumber,
      note: note
    }
  }
  return null;
}

function toNumber(self, note) {
  var num = null;
  var str = 0;
  while (str < self.strings.length) {
    num = noteToNumber(self, note, str);
    if (num) {
      return num;
    }
    str++;
  }
  return null; // not found
}

StringPatterns.prototype.stringToPitch = function (stringNumber) {
  var startingPitch = 5.3;
  var bottom = this.strings.length - 1;
  return startingPitch + ((bottom - stringNumber) * this.linePitch);
}


StringPatterns.prototype.notesToNumber = function (notes, graces) {
  if (notes) {
    var retNotes = [];
    if (notes.length > 1) {
      retNotes = handleChordNotes(this, notes);
    } else {
      var note = checkNote(notes[0].name, this.accidentals);
      retNotes.push(toNumber(this, note));
    }
    var retGraces = null;
    if (graces) {
      retGraces = [];
      for (iiii = 0; iiii < graces.length; iiii++) {
        var note = checkNote(graces[0].name, this.accidentals);
        retGraces.push(toNumber(this, note));
      }
    }
    return {
      notes: retNotes,
      graces: retGraces
    }
  }
  return null;
}

StringPatterns.prototype.toString = function () {
  return this.tuning.join('').replaceAll(',', '').toUpperCase();
}

StringPatterns.prototype.tabInfos = function (plugin) {
  var _super = plugin._super;
  var name = _super.params.name + '(' + this.toString();
  if (plugin.capo > 0) {
    name += ' capo:' + plugin.capo + ' )';
  } else {
    name += ')';
  }
  return name;
}

/**
 * Common patterns for all string instruments
 * @param {} tuning 
 * @param {*} capo 
 * @param {*} highestNote 
 */
function StringPatterns(tuning, capo, highestNote, linePitch) {
  this.linePitch = linePitch;
  this.highestNote = "f'";
  this.hasError = null; // collect errors here if any
  if (highestNote) {
    // override default
    this.highestNote = highestNote;
  }
  this.capo = 0;
  if (capo) {
    this.capo = capo;
  }
  this.tuning = tuning;
  if (this.capo > 0) {
    this.capoTuning = buildCapo(this);
  }
  this.strings = buildPatterns(this);
  // second position pattern per string
  this.secondPos = buildSecond(this);
}



module.exports = StringPatterns;