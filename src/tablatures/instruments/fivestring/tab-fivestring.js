/*
Emit tab for Five String instrument staff
*/
var StringTablature = require('../string-tablature');
var TabCommon = require('../../tab-common');
var TabRenderer = require('../../tab-renderer');
var FiveStringPatterns = require('./fivestring-patterns');

/**
* upon init mainly store provided instances for later usage
* @param {*} abcTune  the parsed tune AST tree
*  @param {*} tuneNumber  the parsed tune AST tree
* @param {*} params  complementary args provided to Tablature Plugin
*/
Plugin.prototype.init = function (abcTune, tuneNumber, params) {
  var _super = new TabCommon(abcTune, tuneNumber, params);
  this._super = _super;
  this.abcTune = abcTune;
  this.linePitch = 3;
  this.nbLines = 5;
  this.isTabBig = true;
  this.tabSymbolOffset = -.95; // Offset the tab symbol down a bit
  this.capo = params.capo;
  this.transpose = params.visualTranspose;
  this.hideTabSymbol = params.hideTabSymbol;
  this.tablature = new StringTablature(this.nbLines,
    this.linePitch);

  var semantics = new FiveStringPatterns(this);
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
var AbcFiveStringTab = function () {
  return { name: 'FiveStringTab', tablature: Plugin };
};


module.exports = AbcFiveStringTab;