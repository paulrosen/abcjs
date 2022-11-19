import StringTablature from '../string-tablature';
import TabCommon from '../../tab-common';
import TabRenderer from '../../tab-renderer';
import ViolinPatterns from './violin-patterns';
import setViolinFonts from './violin-fonts';

/**
 * upon init mainly store provided instances for later usage
 * @param {*} abcTune  the parsed tune AST tree
 *  @param {*} tuneNumber  the parsed tune AST tree
 * @param {*} params  complementary args provided to Tablature Plugin
 */
Plugin.prototype.init = function (abcTune: any, tuneNumber: any, params: any) {
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  var _super = new TabCommon(abcTune, tuneNumber, params);
  this.abcTune = abcTune;
  this._super = _super;
  this.linePitch = 3;
  this.nbLines = 4;
  this.isTabBig = false;
  this.capo = params.capo;
  this.transpose = params.visualTranspose;
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  this.tablature = new StringTablature(this.nbLines, this.linePitch);
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  var semantics = new ViolinPatterns(this);
  this.semantics = semantics;
};

Plugin.prototype.render = function (renderer: any, line: any, staffIndex: any) {
  if (this._super.inError) return;
  if (this.tablature.bypass(line)) return;
  setViolinFonts(this.abcTune);
  // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  var rndrer = new TabRenderer(this, renderer, line, staffIndex);
  rndrer.doLayout();
};

function Plugin() {}

//
// Tablature plugin definition
//
var AbcViolinTab = function () {
  return { name: "ViolinTab", tablature: Plugin };
};

export default AbcViolinTab;
