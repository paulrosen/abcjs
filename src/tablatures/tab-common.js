/**
 * 
 * Common Class/Method available for all instruments 
 * 
 */
function TabCommon(abcTune, tuneNumber, params) {
  this.tune = abcTune;
  this.params = params;
  this.tuneNumber = tuneNumber;
  this.tabRenderer = null;
  this.tabDrawer = null;
  this.topStaffY = -1;
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

module.exports = TabCommon;