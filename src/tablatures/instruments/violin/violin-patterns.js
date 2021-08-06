var StringPatterns = require('../string-patterns');

function ViolinPatterns(tuning,capo,highestNote) {
  this.tuning = tuning;
  if (!tuning) {
    this.tuning = ['G,', 'D', 'A', 'e'];
  }
  this.strings = new StringPatterns(tuning,capo,highestNote);
}

module.exports = ViolinPatterns;
