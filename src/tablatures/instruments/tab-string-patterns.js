var StringPatterns = require('./string-patterns');

function TabStringPatterns(plugin, defaultTuning) {
  this.tuning = plugin._super.params.tuning;
  if (!this.tuning) {
    this.tuning = defaultTuning;
  }
  plugin.tuning = this.tuning;
  this.strings = new StringPatterns(plugin);
}

TabStringPatterns.prototype.notesToNumber = function (notes, graces) {
  var converter = this.strings;
  return converter.notesToNumber(notes, graces);
};

TabStringPatterns.prototype.stringToPitch = function (stringNumber) {
  var converter = this.strings;
  return converter.stringToPitch(stringNumber);
};


module.exports = TabStringPatterns;
