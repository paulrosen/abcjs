var StringPatterns = require('../string-patterns');

function ViolinPatterns(tuning,capo,highestNote,linePitch) {
  this.tuning = tuning;
  if (!tuning) {
    this.tuning = ['G,', 'D', 'A', 'e'];
  }
  this.strings = new StringPatterns(tuning,capo,highestNote,linePitch);
}

ViolinPatterns.prototype.notesToNumber = function (notes, graces) {
  var converter = this.strings;
  return converter.notesToNumber(notes, graces);
};

ViolinPatterns.prototype.stringToPitch = function (stringNumber) {
  var converter = this.strings;
  return converter.stringToPitch(stringNumber);
};


module.exports = ViolinPatterns;
