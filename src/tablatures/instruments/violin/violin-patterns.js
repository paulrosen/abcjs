var StringPatterns = require('../string-patterns');

function ViolinPatterns(tuning,capo) {
  this.tuning = tuning;
  if (!tuning) {
    this.tuning = ['G,', 'D', 'A', 'e'];
  }
  this.strings = new StringPatterns(tuning);
}

module.exports = ViolinPatterns;
