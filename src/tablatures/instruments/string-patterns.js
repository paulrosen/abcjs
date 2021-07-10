/**
 * Handles Violin score to tabs conversion
 * @param {} tuning 
 */
var TabNotes = require('./tab-notes');

// var notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

// private
/*
function buildNote(pos, hasComma, isLower, isQuoted, sharp) {
  var returned = notes[pos];
  if (sharp) {
    returned = sharp + returned;
  }
  if (hasComma) {
    returned += ',';
  } else {
    if (isLower) {
      returned = returned.toLowerCase();
      if (isQuoted) {
        returned += "'";
      }
    } 
  }
  return returned
}
*/


// private
/*
function buildNoteList(fromNote, toNote) {
  var buildReturned = [];
  var fromN = fromNote.charAt(0).toUpperCase();
  var toN = toNote.charAt(0).toUpperCase();
  var startIndex = notes.indexOf(fromN);
  var toIndex = notes.indexOf(toN);
  if ((startIndex == -1) || (toIndex == -1)) {
    return buildReturned;
  }
  var hasComma = fromNote.indexOf(',') != -1;
  var isLower = (fromNote.charAt(0) == fromNote.charAt(0).toLowerCase());
  var isQuoted = fromNote.indexOf("'") != -1;;
  var finished = false;
  var curPos = startIndex;
  while (!finished) {
    var curNote = notes[curPos];
    buildReturned.push(buildNote(curPos, hasComma, isLower,isQuoted))
    if (curNote != 'E' && curNote != 'B') {
      buildReturned.push(buildNote(curPos, hasComma, isLower,isQuoted, '^'));
    }
    if (curNote == 'B') {
      if (hasComma) {
        hasComma = false;
      } else {
        if (!isLower) {
          isLower = true;
        } else {
          isQuoted = true;
        }
      }
    }
    curPos++;
    if ( curPos >= notes.length) {
      curPos = 0;
    } 
    if (notes[curPos] == toN) {
      finished = true;
    } 
  }
  return buildReturned;
}
*/

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

/**
 * 
 * @param {} self 
 * @param {*} note 
 * @returns 0 : noAccident ; -1 flat ; +1 sharp
 */
function accidentalCheck(self,note) {
  var accidentals = self.accidentals;
  var n = note.charAt(0).toUpperCase();
  var returned = 0;
  if (accidentals) {
    for (ai = 0; ai < accidentals.length; ai++) {
      var acc = accidentals[ai];
      if (acc.note.toUpperCase() == n) {
        if (acc.acc == "flat") {
          returned = -1;
        } else {
          returned = 1;
        }
      }
    }
  }
  return returned;
}

function toNumber (self,note) {
  var num = -1;
  var str = 0;
  var acc = 0
  while (str < self.strings.length) {
    num = self.strings[str].indexOf(note);
    if (num != -1) {
      acc = accidentalCheck(self, note);
      return {
        num: (num+acc) ,
        str: str
      }
    }
    str++;
  }
  return null; // not found
}

StringPatterns.prototype.notesToNumber = function (notes, graces) {
  if (notes) {
    var retNotes = [];
    for (iiii = 0; iiii < notes.length; iiii++) {
      retNotes.push(toNumber(this, notes[iiii].name));
    }
    var retGraces = null;
    if (graces) {
      retGraces = [];
      for (iiii = 0; iiii < notes.length; iiii++) {
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
  this.accidentals = null;
  this.strings = buildPatterns(this);
}

module.exports = StringPatterns;