/**
 * 
 * Common Class/Method available for all instruments 
 * 
 */function TabCommon(abcTune, tuneNumber, params) {
  this.tune = abcTune;
  this.params = params;
  this.tuneNumber = tuneNumber;
  this.tabRenderer = null;
  this.tabDrawer = null;
  this.topStaffY = -1;
  this.curTablature = null;
}

/**
 * Get Key accidentals for current staff
 * @param {*} line 
 * @param {*} staffNumber 
 * @returns 
 */
TabCommon.prototype.setAccidentals = function (line , staffNumber ) {
  var tune = this.tune;
  var line = tune.lines[line];
  var staff = line.staff[staffNumber];
  return staff.key.accidentals;
}

TabCommon.prototype.newTablature = function (Tablature,semantics,name) {
  var verticalSize = 0;
  return verticalSize;
}

module.exports = TabCommon;