
var StringTablature = require('../string-tablature');
var TabCommon = require('../../tab-common');
var TabRenderer = require('../../tab-renderer');
var ViolinPatterns = require('./violin-patterns');
var setViolinFonts = require('./violin-fonts');

var plugin = {

  // public stuff
  /**
   * upon init mainly store provided instances for later usage
   * @param {*} abcTune  the parsed tune AST tree
  *  @param {*} tuneNumber  the parsed tune AST tree
   * @param {*} params  complementary args provided to Tablature Plugin
   */
  init: function (abcTune, tuneNumber, params ) {
    var _super = new TabCommon(abcTune, tuneNumber, params);
    this.abcTune = abcTune;
    this._super = _super;
    this.linePitch = 3 ;
    this.nbLines = 4;
    this.isTabBig = false;
    this.capo = params.capo;
    this.tablature = new StringTablature(this.nbLines,
      this.linePitch);
    var semantics = new ViolinPatterns(
      _super.params.tuning,
      this.capo,
      params.highestNote,
      this.linePitch
    );
    this.semantics = semantics;
  },

  render: function (renderer, line, staffIndex) {
    console.log('ViolinTab plugin rendered');
    var _super = this._super;
    setViolinFonts(this.abcTune);
    this.semantics.strings.accidentals = _super.setAccidentals(line, 0);
    var rndrer = new TabRenderer(this, renderer, line, staffIndex);
    rndrer.doLayout();
  }

};

//
// Tablature plugin definition
//
var AbcViolinTab = function () {
  return { name: 'ViolinTab', tablature: plugin };
};

module.exports = AbcViolinTab;
