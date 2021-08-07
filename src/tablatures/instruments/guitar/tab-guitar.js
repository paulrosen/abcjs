/*
Emit tab for Guitar staff
*/
var GuitarPatterns = require('./guitar-patterns');
var TabCommon = require('../../tab-common');
var StringRenderer = require('../string-renderer');
var setGuitarFonts = require('./guitar-fonts');


var plugin = {

  /**
  * upon init mainly store provided instances for later usage
  * @param {*} abcTune  the parsed tune AST tree
 *  @param {*} tuneNumber  the parsed tune AST tree
  * @param {*} params  complementary args provided to Tablature Plugin
  */
  init: function (abcTune, tuneNumber, params) {
    this._super = new TabCommon(abcTune, tuneNumber, params);
    this.lineSpace = 12;
    this.nbLines = 6;
    this.capo = params.capo;
    var semantics = new GuitarPatterns(params.tuning,
      this.capo ,
      params.highestNote
    );
    this.semantics = semantics;
    console.log('GuitarTab plugin inited');
  },

  /**
   * render a score line staff using current abcjs renderer 
   * NB : we assume that renderer , current tunes info + tab params 
   * operational inside plugin instance
   * @param {*} renderer
   * @param {*} staff
   * @return the current height of displayed tab 
   */
  render: function (renderer, nbStaffs, voices, curVoice, lineNumber) {
    console.log('GuitarTab plugin rendered');
    var nbVoices = voices.length;
    var voice = voices[curVoice];
    var _super = this._super;
    var strRenderer = new StringRenderer(this, renderer);
    // get staff accidentals (assume staff index 0 => to be pondered  later)
    this.semantics.strings.accidentals = _super.setAccidentals(lineNumber, 0);
    // set guitar tab fonts
    setGuitarFonts(_super.tune);

    _super.topStaffY = renderer.tablatures.topStaff;
    // top empty filler
    _super.tabRenderer.fillerY(30);

    //  tablature frame
    var verticalSize = 0;
    if (_super.curTablature == null) {
      verticalSize = _super.buildTablature(
        this.semantics,
        {
          voice: voice,
          capo: this.capo,
          lineSpace: this.lineSpace,
          nbLines: this.nbLines,
          tabFontName: 'tab.big',
          tabYPos: 2
        }
      );
    }

    // deal with current voice line
    strRenderer.render(_super.curTablature, this.semantics, voice);

    _super.setError(this.semantics); // check any error messages
    // return back the vertical size used by tab line
    // is 0 with successive voices when nbStaffs is 1 
    return _super.staffFinalization(voice, nbStaffs, nbVoices, verticalSize);

  }

}

//
// Tablature plugin definition
//
var AbcGuitarTab = function () {
  return { name: 'GuitarTab', tablature: plugin };
}


module.exports = AbcGuitarTab;