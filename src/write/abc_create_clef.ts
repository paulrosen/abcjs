//    abc_create_clef.js

import AbsoluteElement from './abc_absolute_element';

import glyphs from './abc_glyphs';
import RelativeElement from './abc_relative_element';

var createClef = function (elem: any, tuneNumber: any) {
  var clef;
  var octave = 0;
  elem.el_type = "clef";
  // @ts-expect-error TS(2554): Expected 6 arguments, but got 5.
  var abselem = new AbsoluteElement(
    elem,
    0,
    10,
    "staff-extra clef",
    tuneNumber
  );
  abselem.isClef = true;
  switch (elem.type) {
    case "treble":
      clef = "clefs.G";
      break;
    case "tenor":
      clef = "clefs.C";
      break;
    case "alto":
      clef = "clefs.C";
      break;
    case "bass":
      clef = "clefs.F";
      break;
    case "treble+8":
      clef = "clefs.G";
      octave = 1;
      break;
    case "tenor+8":
      clef = "clefs.C";
      octave = 1;
      break;
    case "bass+8":
      clef = "clefs.F";
      octave = 1;
      break;
    case "alto+8":
      clef = "clefs.C";
      octave = 1;
      break;
    case "treble-8":
      clef = "clefs.G";
      octave = -1;
      break;
    case "tenor-8":
      clef = "clefs.C";
      octave = -1;
      break;
    case "bass-8":
      clef = "clefs.F";
      octave = -1;
      break;
    case "alto-8":
      clef = "clefs.C";
      octave = -1;
      break;
    case "none":
      return null;
    case "perc":
      clef = "clefs.perc";
      break;
    default:
      abselem.addFixed(
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        new RelativeElement("clef=" + elem.type, 0, 0, undefined, {
          type: "debug"
        })
      );
  }
  // if (elem.verticalPos) {
  // pitch = elem.verticalPos;
  // }
  var dx = 5;
  if (clef) {
    var height = glyphs.symbolHeightInPitches(clef);
    var ofs = clefOffsets(clef);
    abselem.addRight(
      // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      new RelativeElement(clef, dx, glyphs.getSymbolWidth(clef), elem.clefPos, {
        top: height + elem.clefPos + ofs,
        bottom: elem.clefPos + ofs
      })
    );

    if (octave !== 0) {
      var scale = 2 / 3;
      var adjustspacing =
        (glyphs.getSymbolWidth(clef) - glyphs.getSymbolWidth("8") * scale) / 2;
      var pitch = octave > 0 ? abselem.top + 3 : abselem.bottom - 1;
      var top = octave > 0 ? abselem.top + 3 : abselem.bottom - 3;
      var bottom = top - 2;
      if (elem.type === "bass-8") {
        // The placement for bass octave is a little different. It should hug the clef.
        pitch = 3;
        adjustspacing = 0;
      }
      abselem.addRight(
        // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
        new RelativeElement(
          "8",
          dx + adjustspacing,
          glyphs.getSymbolWidth("8") * scale,
          pitch,
          {
            scalex: scale,
            scaley: scale,
            top: top,
            bottom: bottom
          }
        )
      );
      //abselem.top += 2;
    }
  }
  return abselem;
};

function clefOffsets(clef: any) {
  switch (clef) {
    case "clefs.G":
      return -5;
    case "clefs.C":
      return -4;
    case "clefs.F":
      return -4;
    case "clefs.perc":
      return -2;
    default:
      return 0;
  }
}

export default createClef;
