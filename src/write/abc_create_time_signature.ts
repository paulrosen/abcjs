//    abc_create_time_signature.js

import AbsoluteElement from './abc_absolute_element';

import glyphs from './abc_glyphs';
import RelativeElement from './abc_relative_element';

var createTimeSignature = function (elem: any, tuneNumber: any) {
  elem.el_type = "timeSignature";
  // @ts-expect-error TS(2554): Expected 6 arguments, but got 5.
  var abselem = new AbsoluteElement(
    elem,
    0,
    10,
    "staff-extra time-signature",
    tuneNumber
  );
  if (elem.type === "specified") {
    var x = 0;
    for (var i = 0; i < elem.value.length; i++) {
      if (i !== 0) {
        abselem.addRight(
          // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
          new RelativeElement("+", x + 1, glyphs.getSymbolWidth("+"), 6, {
            thickness: glyphs.symbolHeightInPitches("+")
          })
        );
        x += glyphs.getSymbolWidth("+") + 2;
      }
      if (elem.value[i].den) {
        var numWidth = 0;
        for (var i2 = 0; i2 < elem.value[i].num.length; i2++)
          numWidth += glyphs.getSymbolWidth(elem.value[i].num.charAt(i2));
        var denWidth = 0;
        for (i2 = 0; i2 < elem.value[i].num.length; i2++)
          denWidth += glyphs.getSymbolWidth(elem.value[i].den.charAt(i2));
        var maxWidth = Math.max(numWidth, denWidth);
        abselem.addRight(
          // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
          new RelativeElement(
            elem.value[i].num,
            x + (maxWidth - numWidth) / 2,
            numWidth,
            8,
            {
              thickness: glyphs.symbolHeightInPitches(
                elem.value[i].num.charAt(0)
              )
            }
          )
        );
        abselem.addRight(
          // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
          new RelativeElement(
            elem.value[i].den,
            x + (maxWidth - denWidth) / 2,
            denWidth,
            4,
            {
              thickness: glyphs.symbolHeightInPitches(
                elem.value[i].den.charAt(0)
              )
            }
          )
        );
        x += maxWidth;
      } else {
        var thisWidth = 0;
        for (var i3 = 0; i3 < elem.value[i].num.length; i3++)
          thisWidth += glyphs.getSymbolWidth(elem.value[i].num.charAt(i3));
        abselem.addRight(
          // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
          new RelativeElement(elem.value[i].num, x, thisWidth, 6, {
            thickness: glyphs.symbolHeightInPitches(
              elem.value[i].num.charAt(0)
            )
          })
        );
        x += thisWidth;
      }
    }
  } else if (elem.type === "common_time") {
    abselem.addRight(
      // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      new RelativeElement(
        "timesig.common",
        0,
        glyphs.getSymbolWidth("timesig.common"),
        6,
        { thickness: glyphs.symbolHeightInPitches("timesig.common") }
      )
    );
  } else if (elem.type === "cut_time") {
    abselem.addRight(
      // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      new RelativeElement(
        "timesig.cut",
        0,
        glyphs.getSymbolWidth("timesig.cut"),
        6,
        { thickness: glyphs.symbolHeightInPitches("timesig.cut") }
      )
    );
  } else if (elem.type === "tempus_imperfectum") {
    abselem.addRight(
      // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      new RelativeElement(
        "timesig.imperfectum",
        0,
        glyphs.getSymbolWidth("timesig.imperfectum"),
        6,
        { thickness: glyphs.symbolHeightInPitches("timesig.imperfectum") }
      )
    );
  } else if (elem.type === "tempus_imperfectum_prolatio") {
    abselem.addRight(
      // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      new RelativeElement(
        "timesig.imperfectum2",
        0,
        glyphs.getSymbolWidth("timesig.imperfectum2"),
        6,
        { thickness: glyphs.symbolHeightInPitches("timesig.imperfectum2") }
      )
    );
  } else if (elem.type === "tempus_perfectum") {
    abselem.addRight(
      // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      new RelativeElement(
        "timesig.perfectum",
        0,
        glyphs.getSymbolWidth("timesig.perfectum"),
        6,
        { thickness: glyphs.symbolHeightInPitches("timesig.perfectum") }
      )
    );
  } else if (elem.type === "tempus_perfectum_prolatio") {
    abselem.addRight(
      // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
      new RelativeElement(
        "timesig.perfectum2",
        0,
        glyphs.getSymbolWidth("timesig.perfectum2"),
        6,
        { thickness: glyphs.symbolHeightInPitches("timesig.perfectum2") }
      )
    );
  } else {
    console.log("time signature:", elem);
  }
  return abselem;
};

export default createTimeSignature;