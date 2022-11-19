/*
Emit tab for Guitar staff
*/
import StringTablature from '../string-tablature';

import TabCommon from '../../tab-common';
import TabRenderer from '../../tab-renderer';
import GuitarPatterns from './guitar-patterns';
import setGuitarFonts from './guitar-fonts';

/**
 * upon init mainly store provided instances for later usage
 * @param {*} abcTune  the parsed tune AST tree
 *  @param {*} tuneNumber  the parsed tune AST tree
 * @param {*} params  complementary args provided to Tablature Plugin
 */
Plugin.prototype.init = function (abcTune: any, tuneNumber: any, params: any) {
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  var _super = new TabCommon(abcTune, tuneNumber, params);
  this._super = _super;
  this.abcTune = abcTune;
  this.linePitch = 3;
  this.nbLines = 6;
  this.isTabBig = true;
  this.capo = params.capo;
  this.transpose = params.visualTranspose;
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  this.tablature = new StringTablature(this.nbLines, this.linePitch);

  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  var semantics = new GuitarPatterns(this);
  this.semantics = semantics;
};

Plugin.prototype.render = function (renderer: any, line: any, staffIndex: any) {
  if (this._super.inError) return;
  if (this.tablature.bypass(line)) return;
  setGuitarFonts(this.abcTune);
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  var rndrer = new TabRenderer(this, renderer, line, staffIndex);
  rndrer.doLayout();
};

function Plugin() {}

//
// Tablature plugin definition
//
var AbcGuitarTab = function () {
  return { name: "GuitarTab", tablature: Plugin };
};

export default AbcGuitarTab;