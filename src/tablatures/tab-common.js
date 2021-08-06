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

TabCommon.prototype.setError = function (semantics) {
  var tune = this.tune;
  var errors = semantics.strings.hasError;
  if (errors) {
    if (tune.warnings) {
      tune.warning.push(errors);
    } else {
      tune.warnings = [errors];
    }
  }
}

TabCommon.prototype.newTablature = function (Tablature,semantics,name) {
  var verticalSize = 0;
  return verticalSize;
}


TabCommon.prototype.staffFinalization = function(voice,nbStaffs, nbVoices,verticalSize){
  if (nbStaffs == 1) {
    if (nbVoices == 1) {
      this.curTablature = null;
    } else {
      // reset Y to initial value when current staff 
      // has Multiple voices
      var staff = voice.staff;
      staff.absoluteY -= verticalSize;
    }
  } else {
    this.curTablature = null;
  }
  return verticalSize;
}

module.exports = TabCommon; 

