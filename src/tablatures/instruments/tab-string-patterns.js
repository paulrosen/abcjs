var StringPatterns = require('./string-patterns');

function TabStringPatterns(plugin, defaultTuning, defaultStrOrder) {
  this.tuning = plugin._super.params.tuning;
  this.str_order = plugin._super.params.str_order;
  if (!this.tuning) {
    this.tuning = defaultTuning;
  }
  plugin.tuning = this.tuning;
  if (!this.str_order) {
    if (!defaultStrOrder) {
      this.str_order = [...Array(this.tuning.length).keys()];
    }
    else {
      this.str_order = defaultStrOrder;
    }
  }
  plugin.str_order = this.str_order;
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

