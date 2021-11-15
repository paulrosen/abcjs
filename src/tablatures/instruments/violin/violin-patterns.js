var StringPatterns = require('../string-patterns');

function ViolinPatterns(plugin) {
  this.tuning = plugin._super.params.tuning;
  if (!this.tuning) {
    this.tuning = ['G,', 'D', 'A', 'e'];
  }
  plugin.tuning = this.tuning;
  this.strings = new StringPatterns(plugin);
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
