import drawGlissando from './glissando';
import drawCrescendo from './crescendo';
import drawDynamics from './dynamics';
import drawTriplet from './triplet';
import drawEnding from './ending';
import drawTie from './tie';
import drawBeam from './beam';
import renderText from './text';
import drawAbsolute from './absolute';

function drawVoice(renderer: any, params: any, bartop: any, selectables: any, staffPos: any) {
  var width = params.w - 1;
  renderer.staffbottom = params.staff.bottom;

  if (params.header) {
    // print voice name
    var textEl = renderText(
      renderer,
      {
        x: renderer.padding.left,
        y: renderer.calcY(params.headerPosition),
        text: params.header,
        type: "voicefont",
        klass: "staff-extra voice-name",
        anchor: "start",
        centerVertically: true,
        name: "voice-name"
      },
      true
    );
    selectables.wrapSvgEl(
      { el_type: "voiceName", startChar: -1, endChar: -1, text: params.header },
      textEl
    );
  }

  var i;
  var child;
  var foundNote = false;
  for (i = 0; i < params.children.length; i++) {
    child = params.children[i];
    if (child.type === "note" || child.type === "rest") foundNote = true;
    var justInitializedMeasureNumber = false;
    if (
      child.type !== "staff-extra" &&
      !renderer.controller.classes.isInMeasure()
    ) {
      renderer.controller.classes.startMeasure();
      justInitializedMeasureNumber = true;
    }
    switch (child.type) {
      // case "tempo":
      // 	child.elemset = drawTempo(renderer, child);
      // 	break;
      default:
        if (params.staff.isTabStaff) {
          child.invisible = false;
          if (child.type == "bar") {
            if (child.abcelem.lastBar) {
              bartop = params.topLine;
            }
          }
        }
        drawAbsolute(
          renderer,
          child,
          params.barto || i === params.children.length - 1 ? bartop : 0,
          selectables,
          staffPos
        );
    }
    if (child.type === "note" || isNonSpacerRest(child))
      renderer.controller.classes.incrNote();
    if (child.type === "bar" && !justInitializedMeasureNumber && foundNote) {
      renderer.controller.classes.incrMeasure();
    }
  }

  renderer.controller.classes.startMeasure();

  for (i = 0; i < params.beams.length; i++) {
    var beam = params.beams[i];
    if (beam === "bar") {
      renderer.controller.classes.incrMeasure();
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 3.
    } else drawBeam(renderer, beam, selectables); // beams must be drawn first for proper printing of triplets, slurs and ties.
  }

  renderer.controller.classes.startMeasure();
  for (i = 0; i < params.otherchildren.length; i++) {
    child = params.otherchildren[i];
    if (child === "bar") {
      renderer.controller.classes.incrMeasure();
    } else {
      switch (child.type) {
        case "GlissandoElem":
          child.elemset = drawGlissando(renderer, child, selectables);
          break;
        case "CrescendoElem":
          child.elemset = drawCrescendo(renderer, child, selectables);
          break;
        case "DynamicDecoration":
          child.elemset = drawDynamics(renderer, child, selectables);
          break;
        case "TripletElem":
          drawTriplet(renderer, child, selectables);
          break;
        case "EndingElem":
          child.elemset = drawEnding(
            renderer,
            child,
            params.startx + 10,
            width,
            selectables
          );
          break;
        case "TieElem":
          child.elemset = drawTie(
            renderer,
            child,
            params.startx + 10,
            width,
            selectables
          );
          break;
        default:
          console.log(child);
          drawAbsolute(
            renderer,
            child,
            params.startx + 10,
            width,
            selectables,
            // @ts-expect-error TS(2554): Expected 5 arguments, but got 6.
            staffPos
          );
      }
    }
  }
}

function isNonSpacerRest(elem: any) {
  if (elem.type !== "rest") return false;
  if (elem.abcelem && elem.abcelem.rest && elem.abcelem.rest.type !== "spacer")
    return true;
  return false;
}

export default drawVoice;