import RelativeElement from './abc_relative_element';
import spacing from './abc_spacing';
import formatJazzChord from './format-jazz-chord';

var addChord = function (
  getTextSize: any,
  abselem: any,
  elem: any,
  roomTaken: any,
  roomTakenRight: any,
  noteheadWidth: any,
  jazzchords: any
) {
  for (var i = 0; i < elem.chord.length; i++) {
    var pos = elem.chord[i].position;
    var rel_position = elem.chord[i].rel_position;
    var chords = elem.chord[i].name.split("\n");
    for (var j = chords.length - 1; j >= 0; j--) {
      // parse these in opposite order because we place them from bottom to top.
      var chord = chords[j];
      var x = 0;
      var y;
      var font;
      var klass;
      if (
        pos === "left" ||
        pos === "right" ||
        pos === "below" ||
        pos === "above" ||
        !!rel_position
      ) {
        font = "annotationfont";
        klass = "annotation";
      } else {
        font = "gchordfont";
        klass = "chord";
        if (jazzchords) chord = formatJazzChord(chord);
      }
      var attr = getTextSize.attr(font, klass);
      var dim = getTextSize.calc(chord, font, klass);
      var chordWidth = dim.width;
      // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
      var chordHeight = dim.height / spacing.STEP;
      switch (pos) {
        case "left":
          roomTaken += chordWidth + 7;
          x = -roomTaken; // TODO-PER: This is just a guess from trial and error
          y = elem.averagepitch;
          abselem.addExtra(
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            new RelativeElement(chord, x, chordWidth + 4, y, {
              type: "text",
              height: chordHeight,
              dim: attr,
              position: "left"
            })
          );
          break;
        case "right":
          roomTakenRight += 4;
          x = roomTakenRight; // TODO-PER: This is just a guess from trial and error
          y = elem.averagepitch;
          abselem.addRight(
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            new RelativeElement(chord, x, chordWidth + 4, y, {
              type: "text",
              height: chordHeight,
              dim: attr,
              position: "right"
            })
          );
          break;
        case "below":
          // setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
          abselem.addRight(
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            new RelativeElement(chord, 0, 0, undefined, {
              type: "text",
              position: "below",
              height: chordHeight,
              dim: attr,
              realWidth: chordWidth
            })
          );
          break;
        case "above":
          // setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
          abselem.addRight(
            // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
            new RelativeElement(chord, 0, 0, undefined, {
              type: "text",
              position: "above",
              height: chordHeight,
              dim: attr,
              realWidth: chordWidth
            })
          );
          break;
        default:
          if (rel_position) {
            // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
            var relPositionY = rel_position.y + 3 * spacing.STEP; // TODO-PER: this is a fudge factor to make it line up with abcm2ps
            abselem.addRight(
              // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
              new RelativeElement(
                chord,
                x + rel_position.x,
                0,
                // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
                elem.minpitch + relPositionY / spacing.STEP,
                {
                  position: "relative",
                  type: "text",
                  height: chordHeight,
                  dim: attr
                }
              )
            );
          } else {
            // setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
            var pos2 = "above";
            if (elem.positioning && elem.positioning.chordPosition)
              pos2 = elem.positioning.chordPosition;

            if (pos2 !== "hidden") {
              abselem.addCentered(
                // @ts-expect-error TS(7009): 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
                new RelativeElement(
                  chord,
                  noteheadWidth / 2,
                  chordWidth,
                  undefined,
                  {
                    type: "chord",
                    position: pos2,
                    height: chordHeight,
                    dim: attr,
                    realWidth: chordWidth
                  }
                )
              );
            }
          }
      }
    }
  }
  return { roomTaken: roomTaken, roomTakenRight: roomTakenRight };
};

export default addChord;