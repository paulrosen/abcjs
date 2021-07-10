/**
 * 
 * Note structure for Tabs
 * 
 */

function TabNote( note ) {
  this.note = note.charAt(0).toUpperCase();
  this.hasComma = note.indexOf(',') != -1;
  this.isLower = (note.charAt(0) == note.charAt(0).toLowerCase());
  this.isQuoted = note.indexOf("'") != -1;
  this.sharp = note.indexOf('^') != -1;
  this.flat = note.indexOf('_') != -1;
}

TabNote.prototype.sameNoteAs = function(note) {
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
}

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
  return returned
}

module.exports = TabNote;