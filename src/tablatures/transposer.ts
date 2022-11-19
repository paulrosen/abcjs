/**
 *
 * generic transposer
 *
 */
import TabNote from './instruments/tab-note';

function buildAccEquiv(acc: any, note: any) {
  var equiv = note.getAccidentalEquiv();
  if (acc.note.toUpperCase() == equiv.name.toUpperCase()) {
    equiv.isSharp = false;
    equiv.isFlat = false;
    return equiv;
  }
  return note;
}

function adjustNoteToKey(acc: any, note: any) {
  if (acc.acc == "sharp") {
    if (note.isFlat) {
      return buildAccEquiv(acc, note);
    } else if (note.isSharp) {
      if (acc.note.toUpperCase() == note.name.toUpperCase()) {
        note.isSharp = false;
        note.isKeySharp = true;
      } else {
        if (acc.note.toUpperCase() == note.name.toUpperCase()) {
          note.natural = true;
        }
      }
    }
  } else if (acc.acc == "flat") {
    if (note.isSharp) {
      return buildAccEquiv(acc, note);
    } else if (note.isFlat) {
      if (acc.note.toUpperCase() == note.name.toUpperCase()) {
        note.isFlat = false;
        note.isKeyFlat = true;
      }
    } else {
      if (acc.note.toUpperCase() == note.name.toUpperCase()) {
        note.natural = true;
      }
    }
  }
  return note;
}

function replaceNote(self: any, newNote: any, start: any, end: any) {
  if (self.lastEnd) {
    while (start > self.lastEnd) {
      self.updatedSrc.push(self.abcSrc[self.lastEnd]);
      self.lastEnd++;
    }
  }
  var nNote = newNote.split("");
  for (var ii = 0; ii < nNote.length; ii++) {
    self.updatedSrc.push(nNote[ii]);
  }
  var curPos = start + ii;
  while (end >= curPos) {
    self.updatedSrc.push(nNote[curPos]);
    curPos++;
  }
  self.lastEnd = end;
}

function checkKeys(self: any, note: any) {
  var accs = self.transposedKey;
  for (var ii = 0; ii < accs.length; ii++) {
    note = adjustNoteToKey(accs[ii], note);
  }
  return note;
}

Transposer.prototype.transposeNote = function (note: any) {
  var returned = note;
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  var curNote = new TabNote.TabNote(returned.name);
  if (this.transposeBy > 0) {
    for (var ii = 0; ii < this.transposeBy; ii++) {
      curNote = checkKeys(this, curNote.nextNote());
    }
  } else if (this.transposeBy < 0) {
    for (var jj = this.transposeBy; jj < 0; jj++) {
      curNote = checkKeys(this, curNote.prevNote());
    }
  }
  returned.name = curNote.emit();
  return returned;
};

Transposer.prototype.upgradeSource = function (note: any, startChar: any, endChar: any) {
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  var n = new TabNote.TabNote(note.name);
  var newNote = n.emit();
  replaceNote(this, newNote, startChar, endChar - 1);
};

function Transposer(this: any, transposedKey: any, transposeBy: any) {
  this.transposeBy = transposeBy;
  this.transposedKey = transposedKey;
  this.lastEnd = this.kEnd + 1;
}

export default Transposer;
