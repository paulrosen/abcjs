
var TabNote = require('./tab-note');

var notes = TabNote.notes;

function TabNotes(fromNote, toNote) {
  this.fromN = new TabNote.TabNote(fromNote);
  this.toN = new TabNote.TabNote(toNote);
}


TabNotes.prototype.build = function () {
  var fromN = this.fromN;
  var toN = this.toN;
  // check that toN is not lower than fromN
  if (toN.isLowerThan(fromN)) {
    var from = fromN.emit();
    var tn = toN.emit();
    return {
      error: 'Invalid string Instrument tuning : ' +
        tn + ' string lower than ' + from + ' string'
    };
  }
  var buildReturned = [];
  var startIndex = notes.indexOf(fromN.name);
  var toIndex = notes.indexOf(toN.name);
  if ((startIndex == -1) || (toIndex == -1)) {
    return buildReturned;
  }
  var finished = false;
  while (!finished) {
    buildReturned.push(fromN.emit());
    fromN = fromN.nextNote();
    if (fromN.sameNoteAs(toN)) {
      finished = true;
    }
  }
  return buildReturned;
};

module.exports = TabNotes;
