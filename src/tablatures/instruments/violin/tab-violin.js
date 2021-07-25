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
    // for 4 string instruments using Capo
    this.capo = 0;
    if (params.capo) {
      this.capo = params.capo;
    }
    var semantics = new ViolinPatterns(_super.params.tuning);
    this.semantics = semantics;
    console.log('ViolinTab plugin inited');
  },

  buildTablature: function (name) {
    var _super = this._super;
    _super.curTablature = new Tablature(_super.tabDrawer,
      this.nbLines,
      this.lineSpace);
    var verticalSize = 0;
    _super.curTablature.print();
    // Instrument name 
    var yName = _super.curTablature.getY('on', _super.curTablature.numLines - 1);
    name += '(' + this.semantics.strings.toString() + ')'
    verticalSize = _super.tabRenderer.instrumentName(name, yName);
    // update vertical size
    verticalSize += this.lineSpace * this.nbLines;
    _super.curTablature.verticalSize = verticalSize;
    return verticalSize;
  },

  /**
   * render a score line staff using current abcjs renderer 
   * NB : we assume that renderer , current tunes info + tab params 
   * operational inside plugin iÒnstance
   * @param {*} renderer
   * @param {*} staff
   * @return the current height of displayed tab 
   */
  render: function (renderer, nbStaffs, voices, curVoice, lineNumber) {
    console.log('ViolinTab plugin rendered');
    var nbVoices = voices.length;
    var voice = voices[curVoice];
    var _super = this._super;
    var strRenderer = new StringRenderer(this, renderer);
    // set violin tab fonts
    setViolinFonts(_super.tune);
    //
    // get staff accidentals (assume staff index 0 => to be pondered  later)
    this.semantics.strings.accidentals = _super.setAccidentals(lineNumber, 0);
    _super.topStaffY = renderer.tablatures.topStaff;
    // top empty filler
    _super.tabRenderer.fillerY(20);
    
    // get displayed instrument name
    var name = _super.params.name;
    if (!name) {
      name = 'violin';
    }
    //  tablature frame
    var verticalSize = 0;
    if (_super.curTablature == null) {
      verticalSize = this.buildTablature(name);
    }

    // deal with current voice line
    strRenderer.render(_super.curTablature, this.semantics, voice);

    // return back the vertical size used by tab line
    // is 0 with successive voices when nbStaffs is 1 
    return _super.staffFinalization(voice,nbStaffs,nbVoices,verticalSize);
  }
};

//
// Tablature plugin definition
//
var AbcViolinTab = function() {
  return { name: 'ViolinTab', tablature: plugin };
}

module.exports = AbcViolinTab;