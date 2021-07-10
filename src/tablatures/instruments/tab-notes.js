
var TabNote = require('./tab-note');

var notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];


function TabNotes(fromNote, toNote) {
  this.fromN = new TabNote(fromNote);
  this.toN = new TabNote(toNote);
}

TabNotes.prototype.build = function () {
  var fromN = this.fromN;
  var toN = this.toN;
  var buildReturned = [];
  var startIndex = notes.indexOf(fromN.note);
  var toIndex = notes.indexOf(toN.note);
  if ((startIndex == -1) || (toIndex == -1)) {
    return buildReturned;
  }
  var finished = false;
  var curPos = startIndex;
  while (!finished) {
    buildReturned.push(fromN.emit())
    if (fromN.note != 'E' && fromN.note != 'B') {
      fromN.sharp = true;
      buildReturned.push(fromN.emit());
      fromN.sharp = false;
    }
    if (fromN.note == 'B') {
      if (fromN.hasComma) {
        fromN.hasComma = false;
      } else {
        if (!fromN.isLower) {
          fromN.isLower = true;
        } else {
          fromN.isQuoted = true;
        }
      }
    }
    curPos++;
    if (curPos >= notes.length) {
      curPos = 0;
    }
    fromN.note = notes[curPos];
    if ( fromN.sameNoteAs(toN)) {
      finished = true;
    }
  }
  return buildReturned;
}

module.exports = TabNotes;