var StringPatterns = require('../string-patterns');

function GuitarPatterns(tuning,capo,highestNote,linePitch,abcSrc) {
  this.tuning = tuning;
  if (!tuning) {
    this.tuning = ['E,', 'A', 'D', 'G' , 'B' , 'e'];
  }
  this.strings = new StringPatterns(tuning,capo,highestNote,linePitch,abcSrc);
}

GuitarPatterns.prototype.notesToNumber = function (notes, graces) {
  var converter = this.strings;
  return converter.notesToNumber(notes, graces);
};

GuitarPatterns.prototype.stringToPitch = function (stringNumber) {
  var converter = this.strings;
  return converter.stringToPitch(stringNumber);
};


module.exports = GuitarPatterns;
