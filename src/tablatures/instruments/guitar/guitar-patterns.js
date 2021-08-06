var StringPatterns = require('../string-patterns');

function GuitarPatterns(tuning,capo,highestNote) {
  this.tuning = tuning;
  if (!tuning) {
    this.tuning = ['E,', 'A', 'D', 'G' , 'B' , 'e'];
  }
  this.strings = new StringPatterns(tuning,capo,highestNote);
}

module.exports = GuitarPatterns;
