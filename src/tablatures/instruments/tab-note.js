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

function cloneNote(self) {
  var newNote = self.note;
  var newTabNote = new TabNote(newNote);
  newTabNote.hasComma = self.hasComma;
  newTabNote.isLower = self.isLower;
  newTabNote.isQuoted = self.isQuoted;
  newTabNote.sharp = self.sharp;
  newTabNote.flat = self.flat;
  return newTabNote;
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

TabNote.prototype.getAccidentalEquiv = function () {
  var cloned = cloneNote(this);
  if (cloned.sharp) {
    cloned = cloned.nextNote();
    cloned.flat = true;
  } else if (cloned.flat) {
    cloned = cloned.prevNote();
    cloned.sharp = true;
  }
  return cloned;
};


TabNote.prototype.nextNote = function () {
  var newTabNote = cloneNote(this);

  if (!this.sharp) {
    if (this.note != 'E' && this.note != 'B') {
      newTabNote.sharp = true;
      return newTabNote;
    }
  } else {
    newTabNote.sharp = false; // cleanup
  }
  var noteIndex = notes.indexOf(this.note);
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

TabNote.prototype.prevNote = function () {
  var newTabNote = cloneNote(this);

  if (this.sharp) {
    newTabNote.sharp = false;
    return newTabNote;
  }
  var noteIndex = notes.indexOf(this.note);
  if (noteIndex == 0) {
    noteIndex = notes.length - 1;
  } else {
    noteIndex--;
  }
  newTabNote.note = notes[noteIndex];
  if (newTabNote.note == 'B') {
    if (newTabNote.isLower) {
      newTabNote.hasComma = true;
    } else {
      if (newTabNote.isQuoted) {
        newTabNote.isQuoted = false;
      } else {
        newTabNote.isLower = true;
      }
    }
  }
  if (this.flat) {
    newTabNote.flat = false;
    return newTabNote;
  } else {
    if (this.note != 'E' && this.note != 'B') {
      newTabNote.sharp = true;
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
  if (this.natural) {
    returned = '=' + returned;
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