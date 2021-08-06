
var TabNote = require('./tab-note');

var notes = TabNote.notes;

function TabNotes(fromNote, toNote) {
  this.fromN = new TabNote.TabNote(fromNote);
  this.toN = new TabNote.TabNote(toNote);
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
    fromN = fromN.nextNote();
    if ( fromN.sameNoteAs(toN)) {
      finished = true;
    }
  }
  return buildReturned;
}

module.exports = TabNotes;
