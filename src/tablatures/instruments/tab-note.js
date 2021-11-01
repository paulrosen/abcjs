/**
 * 
 * Note structure for Tabs
 * 
 */
var notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];


function TabNote(note) {
  var isFlat = false;
  var newNote = note;
  var isSharp = false;
  var isAltered = false;
  var natural = null;
  var quarter = null;
  var isDouble = false;
  var acc = 0;

  if (note.startsWith('_')) {
    isFlat = true;
    acc = -1;
    // check quarter flat
    if (note[1] == '/') {
      isFlat = false;
      quarter = "v";
      acc = 0;
    } else if (note[1] == '_') {
      // double flat
      isDouble = true;
      acc -= 1;
    }
  } else if (note.startsWith('^')) {
    isSharp = true;
    acc = +1;
    // check quarter sharp
    if (note[1] == '/') {
      isSharp = false;
      quarter = "^";
      acc = 0;
    } else if (note[1] == '^') {
      // double sharp
      isDouble = true;
      acc += 1;
    }
  } else if (note.startsWith('=')) {
    natural = true;
    acc = 0;
  }
  isAltered = isFlat || isSharp || (quarter != null);
  if (isAltered || natural) {
    if ((quarter != null) || (isDouble)) {
      newNote = note.slice(2);
    } else {
      newNote = note.slice(1);
    }
  }
  var hasComma = (note.match(/,/g) || []).length;
  var hasQuote = (note.match(/'/g) || []).length;

  this.name = newNote;
  this.acc = acc;
  this.isSharp = isSharp;
  this.isDouble = isDouble;
  this.isAltered = isAltered;
  this.isFlat = isFlat;
  this.natural = natural;
  this.quarter = quarter;
  this.isLower = (this.name == this.name.toLowerCase());
  this.name = this.name[0].toUpperCase();
  this.hasComma = hasComma;
  this.isQuoted = hasQuote;
}

function cloneNote(self) {
  var newNote = self.name;
  var newTabNote = new TabNote(newNote);
  newTabNote.hasComma = self.hasComma;
  newTabNote.isLower = self.isLower;
  newTabNote.isQuoted = self.isQuoted;
  newTabNote.isSharp = self.isSharp;
  newTabNote.isFlat = self.isFlat;
  return newTabNote;
} 
TabNote.prototype.sameNoteAs = function (note) {
  if ((this.name == note.name) &&
    (this.hasComma == note.hasComma) &&
    (this.isLower == note.isLower) &&
    (this.isQuoted == note.isQuoted) &&
    (this.isSharp == note.isSharp) &&
    (this.isFlat == note.isFlat)) {
    return true;
  } else {
    return false;
  }
};

function isUpperCase(candidate) {
  return  /^[A-Z]*$/.test(candidate);
}
TabNote.prototype.isLowerThan = function (note) {
  var noteComparator = ['C','D','E','F','G','A','B'];
  if (this.hasComma > note.hasComma) return true;
  if (note.hasComma > this.hasComma) return false;
  if (this.isQuoted > note.isQuoted) return false;
  if (note.isQuoted > this.isQuoted) return true;
  var noteName = note.name[0];
  var thisName = this.name[0];
  if (isUpperCase(noteName)) {
    if (!isUpperCase(thisName)) return true;
  } else {
    if (isUpperCase(thisName)) return false;
  }
  thisName = thisName.toUpperCase();
  noteName = noteName.toUpperCase();
  if (noteComparator.indexOf(thisName) < noteComparator.indexOf(noteName)) return true;
  return false;
};

TabNote.prototype.checkKeyAccidentals = function(accidentals) {
  if (accidentals) {
    var curNote = this.name;
    for (var iii = 0; iii < accidentals.length; iii++) {
      var curAccidentals = accidentals[iii];
      if (curNote == curAccidentals.note.toUpperCase()) {
        if (curAccidentals.acc == 'flat') {
          this.acc = -1;
        }
        if (curAccidentals.acc == 'sharp') {
          this.acc = +1;
        }
      }
    }
  }
};

TabNote.prototype.getAccidentalEquiv = function () {
  var cloned = cloneNote(this);
  if (cloned.isSharp) {
    cloned = cloned.nextNote();
    cloned.isFlat = true;
  } else if (cloned.isFlat) {
    cloned = cloned.prevNote();
    cloned.isSharp = true;
  }
  return cloned;
};


TabNote.prototype.nextNote = function () {
  var newTabNote = cloneNote(this);

  if (!this.isSharp) {
    if (this.name != 'E' && this.name != 'B') {
      newTabNote.isSharp = true;
      return newTabNote;
    }
  } else {
    newTabNote.isSharp = false; // cleanup
  }
  var noteIndex = notes.indexOf(this.name);
  if (noteIndex == notes.length - 1) {
    noteIndex = 0;
  } else {
    noteIndex++;
  }
  newTabNote.name = notes[noteIndex];
  if (newTabNote.name == 'C') {
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

  if (this.isSharp) {
    newTabNote.isSharp = false;
    return newTabNote;
  }
  var noteIndex = notes.indexOf(this.name);
  if (noteIndex == 0) {
    noteIndex = notes.length - 1;
  } else {
    noteIndex--;
  }
  newTabNote.name = notes[noteIndex];
  if (newTabNote.name == 'B') {
    if (newTabNote.isLower) {
      newTabNote.hasComma = 1;
    } else {
      if (newTabNote.isQuoted > 0) {
        newTabNote.isQuoted -= 1;
      } else {
        newTabNote.isLower = true;
      }
    }
  }
  if (this.isFlat) {
    newTabNote.isFlat = false;
    return newTabNote;
  } else {
    if (this.name != 'E' && this.name != 'B') {
      newTabNote.isSharp = true;
    }
  }
  return newTabNote;
};

TabNote.prototype.emit = function () {
  var returned = this.name;
  if (this.isSharp) {
    returned = '^' + returned;
    if (this.isDouble) {
      returned = '^' + returned;
    }
  }
  if (this.isFlat) {
    returned = '_' + returned;
    if (this.isDouble) {
      returned = '_' + returned;
    }
  }
  if (this.quarter) {
    if (this.quarter == "^") {
      returned = "^/" + returned;
    } else {
      returned = "_/" + returned;
    }
  }
  if (this.natural) {
    returned = '=' + returned;
  }
  for (var ii = 1; ii <= this.hasComma; ii++) {
    returned += ',';
  }
  
  if (this.isLower) {
    returned = returned.toLowerCase();
    for (var jj = 1; jj <= this.isQuoted; jj++) {
      returned += "'";
    }
  }
  return returned;
};

module.exports = {
  'TabNote': TabNote,
  'notes': notes
};