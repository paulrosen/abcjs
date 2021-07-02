var StringPatterns = require('../string-patterns');

function GuitarPatterns(tuning) {
  this.tuning = tuning;
  if (!tuning) {
    this.tuning = ['E,', 'A', 'D', 'G' , 'B' , 'e'];
  }
  this.strings = new StringPatterns(tuning);
}

module.exports = GuitarPatterns;
