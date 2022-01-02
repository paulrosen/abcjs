
var StringTablature = require('../string-tablature');
var TabCommon = require('../../tab-common');
var TabRenderer = require('../../tab-renderer');
var ViolinPatterns = require('./violin-patterns');
var setViolinFonts = require('./violin-fonts');
const addTab = require("../../tab-staff-creator");


/**
 * upon init mainly store provided instances for later usage
 * @param {*} abcTune  the parsed tune AST tree
*  @param {*} tuneNumber  the parsed tune AST tree
 * @param {*} params  complementary args provided to Tablature Plugin
 */
Plugin.prototype.init = function (abcTune, tuneNumber, params) {
  var _super = new TabCommon(abcTune, tuneNumber, params);
  this.abcTune = abcTune;
  this._super = _super;
  this.linePitch = 3;
  this.nbLines = 4;
  this.isTabBig = false;
  this.capo = params.capo;
  this.transpose = params.visualTranspose;
  // this.tablature = new StringTablature(this.nbLines,
  //   this.linePitch);
  var semantics = new ViolinPatterns(this);
  this.semantics = semantics;
};

Plugin.prototype.numberCreator = function(pitch) {
  console.log("V",pitch.pitch)
  return {
    string: Math.round(Math.random() * 3),
    number: Math.round(Math.random() * 5 + 8),
  }
}

Plugin.prototype.createLine = function (staff, tabDef, spacing) {
  return addTab(staff, tabDef, spacing, this.numberCreator)
};

// Plugin.prototype.render = function (renderer, line, staffIndex) {
//   if (this._super.inError) return;
//   if (this.tablature.bypass(line)) return;
//   console.log('ViolinTab plugin rendered');
//   setViolinFonts(this.abcTune);
//   var rndrer = new TabRenderer(this, renderer, line, staffIndex);
//   rndrer.doLayout();
// };

function Plugin() {}

//
// Tablature plugin definition
//
var AbcViolinTab = function () {
  return { name: 'ViolinTab', tablature: Plugin };
};

module.exports = AbcViolinTab;
