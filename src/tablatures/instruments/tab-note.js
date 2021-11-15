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
  this.isKeySharp = false;
  this.isDouble = isDouble;
  this.isAltered = isAltered;
  this.isFlat = isFlat;
  this.isKeyFlat = false;
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
  newTabNote.isKeySharp = self.isKeySharp;
  newTabNote.isFlat = self.isFlat;
  newTabNote.isKeyFlat = self.isKeyFlat;
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

TabNote.prototype.isLowerThan = function (note) {
  var noteComparator = ['C','D','E','F','G','A','B'];
  if (this.hasComma > note.hasComma) return true;
  if (note.hasComma > this.hasComma) return false;
  if (this.isQuoted > note.isQuoted) return false;
  if (note.isQuoted > this.isQuoted) return true;
  if (this.isLower) {
    if (!note.isLower) return false;
  } else {
    if (note.isLower) return true;
  }
  var noteName = note.name[0].toUpperCase();
  var thisName = this.name[0].toUpperCase();
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
          this.isKeyFlat = true;
        }
        if (curAccidentals.acc == 'sharp') {
          this.acc = +1;
          this.isKeySharp = true;
        }
      }
    }
  }
};

TabNote.prototype.getAccidentalEquiv = function () {
  var cloned = cloneNote(this);
  if (cloned.isSharp || cloned.isKeySharp ) {
    cloned = cloned.nextNote();
    cloned.isFlat = true;
    cloned.isSharp = false;
    cloned.isKeySharp = false;
  } else if (cloned.isFlat || cloned.isKeyFlat ) {
    cloned = cloned.prevNote();
    cloned.isSharp = true;
    cloned.isFlat = false;
    cloned.isKeyFlat = false;
  }
  return cloned;
};


TabNote.prototype.nextNote = function () {
  var newTabNote = cloneNote(this);

  if (!this.isSharp && !this.isKeySharp ) {
    if (this.name != 'E' && this.name != 'B') {
      newTabNote.isSharp = true;
      return newTabNote;
    }
  } else {
    // cleanup
    newTabNote.isSharp = false; 
    newTabNote.isKeySharp = false; 
  }
  var noteIndex = notes.indexOf(this.name);
  if (noteIndex == notes.length - 1) {
    noteIndex = 0;
  } else {
    noteIndex++;
  }
  newTabNote.name = notes[noteIndex];
  if (newTabNote.name == 'C') {
    if (newTabNote.hasComma > 0) {
      newTabNote.hasComma--;
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
      if (newTabNote.hasComma > 0) {
        newTabNote.hasComma++;
      } else {
        if (newTabNote.isQuoted > 0) {
          newTabNote.isQuoted -= 1;
        } else {
          newTabNote.isLower = true;
        }
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

TabNote.prototype.emitNoAccidentals = function (  ) {
  var returned = this.name;
  if (this.isLower) {
    returned = returned.toLowerCase();
  }
  for (var ii = 0; ii < this.isQuoted; ii++) {
    returned += "'";
  }
  for (var jj = 0; jj < this.hasComma; jj++) {
    returned += ",";
  }
  return returned;
};

TabNote.prototype.emit = function () {
  var returned = this.name;
  if (this.isSharp || this.isKeySharp ) {
    returned = '^' + returned;
    if (this.isDouble) {
      returned = '^' + returned;
    }
  }
  if (this.isFlat || this.isKeyFlat) {
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