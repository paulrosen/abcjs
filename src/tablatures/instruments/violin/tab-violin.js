/*
Emit tab for violin staff
*/
var Tablature = require('../string-tablature');
var ViolinPatterns = require('./violin-patterns');
var setViolinFonts = require('./violin-fonts');
var TabCommon = require('../../tab-common');
var StringRenderer = require('../string-renderer');

var plugin = {

  // public stuff
  /**
   * upon init mainly store provided instances for later usage
   * @param {*} abcTune  the parsed tune AST tree
  *  @param {*} tuneNumber  the parsed tune AST tree
   * @param {*} params  complementary args provided to Tablature Plugin
   */
  init: function (abcTune, tuneNumber, params) {
    var _super = new TabCommon(abcTune, tuneNumber, params);
    this._super = _super;
    this.lineSpace = 12;
    this.nbLines = 4;
    var semantics = new ViolinPatterns(_super.params.tuning);
    this.semantics = semantics;
    console.log('ViolinTab plugin inited');
  },

  /**
   * render a score line staff using current abcjs renderer 
   * NB : we assume that renderer , current tunes info + tab params 
   * operational inside plugin instance
   * @param {*} renderer
   * @param {*} staff
   * @return the current height of displayed tab 
   */
  render: function (renderer, voice, curVoice , lineNumber) {
    console.log('ViolinTab plugin rendered');
    var _super = this._super;
    var strRenderer = new StringRenderer(this, renderer);
    // set violin tab fonts
    setViolinFonts(_super.tune);
    //
    // get staff accidentals
    this.semantics.strings.accidentals = _super.setAccidentals(lineNumber, curVoice);

    _super.topStaffY = renderer.tablatures.topStaff;
    // top empty filler
    _super.tabRenderer.fillerY(20);
    
    // get displayed instrument name
    var name = _super.params.name;
    if (!name) {
      name = 'violin';
    }
    //  tablature frame
    var tablature = new Tablature(_super.tabDrawer,
      this.nbLines,
      this.lineSpace);
    tablature.print();
    // Instrument name 
    var yName = tablature.getY('on', tablature.numLines - 1);
    name += '(' + this.semantics.strings.toString() + ')'

    var verticalSize = _super.tabRenderer.instrumentName(name, yName);
    // deal with current voice line
    strRenderer.render(tablature, this.semantics, voice);

    // update vertical size
    verticalSize += this.lineSpace * this.nbLines;
    // return back the vertical size used by tab line
    return verticalSize;
  }
};

//
// Tablature plugin definition
//
var AbcViolinTab = function() {
  return { name: 'ViolinTab', tablature: plugin };
}

module.exports = AbcViolinTab;