import StringPatterns from '../string-patterns';

function GuitarPatterns(this: any, plugin: any) {
  this.tuning = plugin._super.params.tuning;
  if (!this.tuning) {
    this.tuning = ["E,", "A,", "D", "G", "B", "e"];
  }
  plugin.tuning = this.tuning;
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  this.strings = new StringPatterns(plugin);
}

GuitarPatterns.prototype.notesToNumber = function (notes: any, graces: any) {
  var converter = this.strings;
  return converter.notesToNumber(notes, graces);
};

GuitarPatterns.prototype.stringToPitch = function (stringNumber: any) {
  var converter = this.strings;
  return converter.stringToPitch(stringNumber);
};

export default GuitarPatterns;
