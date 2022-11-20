/**
 *
 * Common Class/Method available for all instruments
 *
 */

function TabCommon(this: any, abcTune: any, tuneNumber: any, params: any) {
  this.tune = abcTune;
  this.params = params;
  this.tuneNumber = tuneNumber;
  this.inError = false;
}

TabCommon.prototype.setError = function (error: any) {
  var tune = this.tune;
  if (error) {
    this.error = error;
    this.inError = true;
    if (tune.warnings) {
      tune.warnings.push(error);
    } else {
      tune.warnings = [error];
    }
  }
};

export default TabCommon;
