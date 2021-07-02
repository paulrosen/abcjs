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


module.exports = TabCommon;