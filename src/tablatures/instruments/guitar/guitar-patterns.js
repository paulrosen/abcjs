var StringPatterns = require('../string-patterns');

function GuitarPatterns(plugin) {
  this.tuning = plugin._super.params.tuning;
  if (!this.tuning) {
    this.tuning = ['E,', 'A,', 'D', 'G' , 'B' , 'e'];
  }
  plugin.tuning = this.tuning;
  this.strings = new StringPatterns(plugin);
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
