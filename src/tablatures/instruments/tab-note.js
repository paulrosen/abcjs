/**
 * 
 * Note structure for Tabs
 * 
 */
var notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function TabNote(note) {
  var first = note.charAt(0);
  if (first == '_' || first == '^') {
    this.note = note.charAt(1);
  } else {
    this.note = note.charAt(0);
  }
  this.isLower = (this.note == this.note.toLowerCase());
  this.note = this.note.toUpperCase();
  this.hasComma = note.indexOf(',') != -1;
  this.isQuoted = note.indexOf("'") != -1;
  this.sharp = note.indexOf('^') != -1;
  this.flat = note.indexOf('_') != -1;
}

TabNote.prototype.sameNoteAs = function (note) {
  if ((this.note == note.note) &&
    (this.hasComma == note.hasComma) &&
    (this.isLower == note.isLower) &&
    (this.isQuoted == note.isQuoted) &&
    (this.sharp == note.sharp) &&
    (this.flat == note.flat)) {
    return true;
  } else {
    return false;
  }
};

TabNote.prototype.nextNote = function () {
  var newNote = this.note;
  var newTabNote = new TabNote(newNote);
  newTabNote.hasComma = this.hasComma;
  newTabNote.isLower = this.isLower;
  newTabNote.isQuoted = this.isQuoted;

  if (!this.sharp) {
    if (this.note != 'E' && this.note != 'B') {
      newTabNote.sharp = true;
      return newTabNote;
    }
  }
  var noteIndex = notes.indexOf(newNote);
  if (noteIndex == notes.length - 1) {
    noteIndex = 0;
  } else {
    noteIndex++;
  }
  newTabNote.note = notes[noteIndex];
  if (newTabNote.note == 'C') {
    if (newTabNote.hasComma) {
      newTabNote.hasComma = false;
    } else {
      if (!newTabNote.isLower) {
        newTabNote.isLower = true;
      } else {
        newTabNote.isQuoted = true;
      }
    }
  }
  return newTabNote;
};

TabNote.prototype.emit = function () {
  var returned = this.note;
  if (this.sharp) {
    returned = '^' + returned;
  }
  if (this.flat) {
    returned = '_' + returned;
  }
  if (this.hasComma) {
    returned += ',';
  } else {
    if (this.isLower) {
      returned = returned.toLowerCase();
      if (this.isQuoted) {
        returned += "'";
      }
    }
  }
  return returned;
};

module.exports = {
  'TabNote': TabNote,
  'notes': notes
};