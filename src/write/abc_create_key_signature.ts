//    abc_create_key_signature.js

import AbsoluteElement from './abc_absolute_element';

import glyphs from './abc_glyphs';
import RelativeElement from './abc_relative_element';
import parseCommon from '../parse/abc_common';

var createKeySignature = function(this: any, elem: any, tuneNumber: any) {
  elem.el_type = "keySignature";
  if (!elem.accidentals || elem.accidentals.length === 0) return null;
  // @ts-expect-error TS(2554): Expected 6 arguments, but got 5.
  var abselem = new AbsoluteElement(
    elem,
    0,
    10,
    "staff-extra key-signature",
    tuneNumber
  );
  abselem.isKeySig = true;
  var dx = 0;
  // @ts-expect-error TS(2339): Property 'each' does not exist on type '{}'.
  parseCommon.each(
    elem.accidentals,
    function (acc: any) {
      var symbol;
      var fudge = 0;
      switch (acc.acc) {
        case "sharp":
          symbol = "accidentals.sharp";
          fudge = -3;
          break;
        case "natural":
          symbol = "accidentals.nat";
          break;
        case "flat":
          symbol = "accidentals.flat";
          fudge = -1.2;
          break;
        case "quartersharp":
          symbol = "accidentals.halfsharp";
          fudge = -2.5;
          break;
        case "quarterflat":
          symbol = "accidentals.halfflat";
          fudge = -1.2;
          break;
        default:
          symbol = "accidentals.flat";
      }
      abselem.addRight(
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        new RelativeElement(
          symbol,
          dx,
          glyphs.getSymbolWidth(symbol),
          acc.verticalPos,
          {
            thickness: glyphs.symbolHeightInPitches(symbol),
            top: acc.verticalPos + glyphs.symbolHeightInPitches(symbol) + fudge,
            bottom: acc.verticalPos + fudge
          }
        )
      );
      dx += glyphs.getSymbolWidth(symbol) + 2;
    },
    this
  );
  return abselem;
};

export default createKeySignature;
