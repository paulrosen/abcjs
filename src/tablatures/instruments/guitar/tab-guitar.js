/*
Emit tab for Guitar staff
*/
var Tablature = require('../string-tablature');
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
    var semantics = new GuitarPatterns(params.tuning);
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
  render: function (renderer, voice, curVoice, lineNumber) {
    console.log('GuitarTab plugin rendered');
    var _super = this._super;
    var strRenderer = new StringRenderer(this, renderer);
    // get staff accidentals
    this.semantics.strings.accidentals = _super.setAccidentals(lineNumber, curVoice);
    // set guitar tab fonts
    setGuitarFonts(_super.tune);

    _super.topStaffY = renderer.tablatures.topStaff;
    // top empty filler
    _super.tabRenderer.fillerY(30);

    //  tablature frame
    var tablature = new Tablature(_super.tabDrawer,
      this.nbLines,
      this.lineSpace);
    tablature.tabFontName = 'tab.big';
    tablature.tabYPos = 2;

    tablature.print();

    // Instrument name 
    var yName = tablature.getY('on', tablature.numLines - 1);
    var name = _super.params.name + '(' + this.semantics.strings.toString() + ')'
    var verticalSize = _super.tabRenderer.instrumentName(name, yName);

    // deal with current voice line
    strRenderer.render(tablature, this.semantics, voice);

    // update vertical size
    verticalSize += this.lineSpace * this.nbLines;

    return verticalSize;
  }

}

//
// Tablature plugin definition
//
var AbcGuitarTab = function () {
  return { name: 'GuitarTab', tablature: plugin };
}


module.exports = AbcGuitarTab;