/*
Emit tab for Guitar staff
*/
var StringTablature = require('../string-tablature');
var TabCommon = require('../../tab-common');
var TabRenderer = require('../../tab-renderer');
var GuitarPatterns = require('./guitar-patterns');
var setGuitarFonts = require('./guitar-fonts');


var plugin = {

  /**
  * upon init mainly store provided instances for later usage
  * @param {*} abcTune  the parsed tune AST tree
 *  @param {*} tuneNumber  the parsed tune AST tree
  * @param {*} params  complementary args provided to Tablature Plugin
  */
  init: function (abcTune, tuneNumber, params ) {
    var _super = new TabCommon(abcTune, tuneNumber, params);
    this._super = _super;
    this.abcTune = abcTune;
    this.linePitch = 3;
    this.nbLines = 6;
    this.isTabBig = true;
    this.capo = params.capo;
    this.transpose = params.visualTranspose;
    this.tablature = new StringTablature(this.nbLines,
      this.linePitch);

    var semantics = new GuitarPatterns(_super.params.tuning,
      this.capo,
      params.highestNote,
      this.linePitch
    );
    this.semantics = semantics;
  },

  render: function (renderer, line, staffIndex) {
    console.log('GuitarTab plugin rendered');
    setGuitarFonts(this.abcTune);
    var rndrer = new TabRenderer(this, renderer, line, staffIndex);
    rndrer.doLayout();
  }

};

//
// Tablature plugin definition
//
var AbcGuitarTab = function () {
  return { name: 'GuitarTab', tablature: plugin };
};


module.exports = AbcGuitarTab;