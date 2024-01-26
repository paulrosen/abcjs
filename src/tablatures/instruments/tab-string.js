
var StringTablature = require('./string-tablature');
var TabCommon = require('../tab-common');
var TabRenderer = require('../tab-renderer');
var TabStringPatterns = require('./tab-string-patterns');


/**
 * upon init mainly store provided instances for later usage
 * @param {*} abcTune  the parsed tune AST tree
*  @param {*} tuneNumber  the parsed tune AST tree
 * @param {*} params  complementary args provided to Tablature Plugin
 */
Plugin.prototype.init = function (abcTune, tuneNumber, params, staffNumber, tabSettings) {
  var _super = new TabCommon(abcTune, tuneNumber, params);
  this.abcTune = abcTune;
  this._super = _super;
  this.linePitch = 3;
  this.nbLines = tabSettings.defaultTuning.length;
  this.isTabBig = tabSettings.isTabBig;
  this.tabSymbolOffset = tabSettings.tabSymbolOffset;
  this.capo = params.capo;
  this.transpose = params.visualTranspose;
  this.hideTabSymbol = params.hideTabSymbol;
  this.tablature = new StringTablature(this.nbLines,
    this.linePitch);
  var semantics = new TabStringPatterns(this, tabSettings.defaultTuning);
  this.semantics = semantics;
};

Plugin.prototype.render = function (renderer, line, staffIndex) {
  if (this._super.inError) return;
  if (this.tablature.bypass(line)) return;
  var rndrer = new TabRenderer(this, renderer, line, staffIndex);
  rndrer.doLayout();
};

function Plugin() {}

//
// Tablature plugin definition
//
var AbcStringTab = function () {
  return { name: 'StringTab', tablature: Plugin };
};

module.exports = AbcStringTab;
