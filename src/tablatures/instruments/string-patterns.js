/**
 * Handles Violin score to tabs conversion
 * @param {} tuning 
 */
var TabNotes = require('./tab-notes');

function buildPatterns(self) {
  var strings = []
  var pos = self.tuning.length-1;
  for (iii = 0; iii < self.tuning.length; iii++) {
    var nextNote = "d'"; // highest handled note
    if (iii != self.tuning.length - 1) {
      nextNote = self.tuning[iii + 1];
    }
    tabNotes = new TabNotes(self.tuning[iii], nextNote);
    strings[pos--] = tabNotes.build();
  }
  return strings;
}

function buildSecond(first) {
  var seconds = [];
  seconds[0] =[];
  var strings =first.strings
  for (iii = 1; iii < strings.length ; iii++)  {
    seconds[iii] = strings[iii-1];
  }
  return seconds;
}
 
function checkNote(note) {
  var isFlat = false;
  var newNote = note;
  var isSharp = false;
  var isAltered = false;
  var acc = 0;
  if (note.startsWith('_')) {
    isFlat = true;
    acc = -1;
  } else if (note.startsWith('^')) {
    isSharp = true;
    acc = +1;
  }
  isAltered = isFlat || isSharp;
  if (isAltered) {
    newNote = note.slice(1);
  }
  return {
    'isAltered': isAltered,
    'isSharp': isSharp,
    'isFlat': isFlat,
    'note': newNote,
    'acc' : acc
  }
}

function noteToNumber(self, nNote, stringNumber , secondPosition )  {
  var note = checkNote(nNote);
  var strings = self.strings;
  if (secondPosition) {
    strings = secondPosition;
  }
  num = strings[stringNumber].indexOf(note.note);
  if (num != -1) {
    if (secondPosition) {
      num += 7;
    }
    if (note.isFlat && (num == 0)) {
      // flat on 0 pos => previous string Fifth position
      str = stringNumber+1;
      num = 7;
    }
    return {
      num: (num + note.acc),
      str: stringNumber,
      name: nNote
    }
  }
  return null;
}

function toNumber (self, nNote ) {
  var num = null;
  var str = 0;
  while (str < self.strings.length) {
    num = noteToNumber(self,nNote,str);
    if (num) {
      return num;
    }
    str++;
  }
  return null; // not found
}

function sameString(self, chord) {
  for (jjjj = 0; jjjj < chord.length-1; jjjj++) {
    var curPos = chord[jjjj];
    var nextPos = chord[jjjj + 1];
    if (curPos.str == nextPos.str) {
      // same String
      // => change lower pos 
      if (curPos.str == self.strings.length - 1) {
        return 'Invalid tab Chord position for instrument';
      }
      // change lower pitch on lowest string
      if (nextPos.num < curPos.num) {
        nextPos.str++;
        nextPos = noteToNumber(self,
          nextPos.name,
          nextPos.str,
          self.secondPos
        );
      } else {
        curPos.str++;
        curPos = noteToNumber(self,
          curPos.name,
          curPos.str,
          self.secondPos
        );
      }
      if (nextPos == null || curPos == null) {
        return "Can't map tab Chord position for instrument";
      }
      // update table
      chord[jjjj] = curPos;
      chord[jjjj + 1] = nextPos;
    }
  }
}


function handleChordNotes(self,notes) {
  retNotes = [];
  for (iiii = 0; iiii < notes.length; iiii++) {
    var curPos = toNumber(self, notes[iiii].name);
    retNotes.push(curPos);
  }
  var error = sameString(self, retNotes)
  return retNotes;
}

StringPatterns.prototype.notesToNumber = function (notes, graces) {
  if (notes) {
    var retNotes = [];
    if (notes.length > 1) {
      retNotes = handleChordNotes(this,notes);
    } else {
      retNotes.push(toNumber(this, notes[0].name));
    }
    var retGraces = null;
    if (graces) {
      retGraces = [];
      for (iiii = 0; iiii < graces.length; iiii++) {
        retGraces.push(toNumber(this, graces[iiii].name));
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
  return this.tuning.join('').replaceAll(',','').toUpperCase();
}

function StringPatterns(tuning) {
  this.tuning = tuning;
  this.strings = buildPatterns(this);
  // second position pattern per string
  this.secondPos = buildSecond(this);
}

module.exports = StringPatterns;