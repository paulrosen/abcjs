/*
Emit tab for Guitar staff
*/
var StringTablature = require('../string-tablature');
var TabCommon = require('../../tab-common');
var TabRenderer = require('../../tab-renderer');
var GuitarPatterns = require('./guitar-patterns');

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
  this.nbLines = 6;
  this.isTabBig = true;
  this.capo = params.capo;
  this.transpose = params.visualTranspose;
  this.tablature = new StringTablature(this.nbLines,
    this.linePitch);

  var semantics = new GuitarPatterns(this);
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
var AbcGuitarTab = function () {
  return { name: 'GuitarTab', tablature: Plugin };
};


module.exports = AbcGuitarTab;