import sprintf from './sprintf';
import spacing from '../abc_spacing';
import renderText from './text';

function drawBrace(renderer: any, params: any, selectables: any) {
  // The absoluteY number is the spot where the note on the first ledger line is drawn (i.e. middle C if treble clef)
  // The STEP offset here moves it to the top and bottom lines
  // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
  var startY = params.startVoice.staff.absoluteY - spacing.STEP * 10;
  if (params.endVoice && params.endVoice.staff)
    // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
    params.endY = params.endVoice.staff.absoluteY - spacing.STEP * 2;
  else if (params.lastContinuedVoice && params.lastContinuedVoice.staff)
    // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
    params.endY = params.lastContinuedVoice.staff.absoluteY - spacing.STEP * 2;
  // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
  else params.endY = params.startVoice.staff.absoluteY - spacing.STEP * 2;
  return draw(
    renderer,
    params.x,
    startY,
    params.endY,
    params.type,
    params.header,
    selectables
  );
}

function straightPath(renderer: any, xLeft: any, yTop: any, yBottom: any, type: any) {
  // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
  xLeft += spacing.STEP;
  // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
  var xLineWidth = spacing.STEP * 0.75;
  // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
  var yOverlap = spacing.STEP * 0.75;
  var height = yBottom - yTop;
  // Straight line
  var pathString = sprintf(
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 9.
    "M %f %f l %f %f l %f %f l %f %f z",
    xLeft,
    yTop - yOverlap, // top left line
    0,
    height + yOverlap * 2, // bottom left line
    xLineWidth,
    0, // bottom right line
    0,
    -(height + yOverlap * 2) // top right line
  );
  // Top arm
  // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
  var wCurve = spacing.STEP * 2;
  // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
  var hCurve = spacing.STEP;
  pathString += sprintf(
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 11.
    "M %f %f q %f %f %f %f q %f %f %f %f z",
    xLeft + xLineWidth,
    yTop - yOverlap, // top left arm
    wCurve * 0.6,
    hCurve * 0.2,
    wCurve,
    -hCurve, // right point
    -wCurve * 0.1,
    hCurve * 0.3,
    -wCurve,
    // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
    hCurve + spacing.STEP // left bottom
  );
  // Bottom arm
  pathString += sprintf(
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 11.
    "M %f %f q %f %f %f %f q %f %f %f %f z",
    xLeft + xLineWidth,
    yTop + yOverlap + height, // bottom left arm
    wCurve * 0.6,
    -hCurve * 0.2,
    wCurve,
    hCurve, // right point
    -wCurve * 0.1,
    -hCurve * 0.3,
    -wCurve,
    // @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
    -hCurve - spacing.STEP // left bottom
  );
  return renderer.paper.path({
    path: pathString,
    stroke: renderer.foregroundColor,
    fill: renderer.foregroundColor,
    class: renderer.controller.classes.generate(type),
    "data-name": type
  });
}

function curvyPath(renderer: any, xLeft: any, yTop: any, yBottom: any, type: any) {
  var yHeight = yBottom - yTop;

  var pathString = curve(
    xLeft,
    yTop,
    [7.5, -8, 21, 0, 18.5, -10.5, 7.5],
    [
      0,
      yHeight / 5.5,
      yHeight / 3.14,
      yHeight / 2,
      yHeight / 2.93,
      yHeight / 4.88,
      0
    ]
  );

  pathString += curve(
    xLeft,
    yTop,
    [0, 17.5, -7.5, 6.6, -5, 20, 0],
    [
      yHeight / 2,
      yHeight / 1.46,
      yHeight / 1.22,
      yHeight,
      yHeight / 1.19,
      yHeight / 1.42,
      yHeight / 2
    ]
  );

  return renderer.paper.path({
    path: pathString,
    stroke: renderer.foregroundColor,
    fill: renderer.foregroundColor,
    class: renderer.controller.classes.generate(type),
    "data-name": type
  });
}

function curve(xLeft: any, yTop: any, xCurve: any, yCurve: any) {
  return sprintf(
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 15.
    "M %f %f C %f %f %f %f %f %f C %f %f %f %f %f %f z",
    xLeft + xCurve[0],
    yTop + yCurve[0],
    xLeft + xCurve[1],
    yTop + yCurve[1],
    xLeft + xCurve[2],
    yTop + yCurve[2],
    xLeft + xCurve[3],
    yTop + yCurve[3],
    xLeft + xCurve[4],
    yTop + yCurve[4],
    xLeft + xCurve[5],
    yTop + yCurve[5],
    xLeft + xCurve[6],
    yTop + yCurve[6]
  );
}

var draw = function (
  renderer: any,
  xLeft: any,
  yTop: any,
  yBottom: any,
  type: any,
  header: any,
  selectables: any
) {
  //Tony
  var ret;
  if (header) {
    renderer.paper.openGroup({
      klass: renderer.controller.classes.generate("staff-extra voice-name"),
      "data-name": type
    });
    var position = yTop + (yBottom - yTop) / 2;
    position =
      position -
      renderer.controller.getTextSize.baselineToCenter(
        header,
        "voicefont",
        "staff-extra voice-name",
        0,
        1
      );

    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    renderText(renderer, {
      x: renderer.padding.left,
      y: position,
      text: header,
      type: "voicefont",
      klass: "staff-extra voice-name",
      anchor: "start",
      centerVertically: true
    });
  }
  if (type === "brace") ret = curvyPath(renderer, xLeft, yTop, yBottom, type);
  else if (type === "bracket")
    ret = straightPath(renderer, xLeft, yTop, yBottom, type);
  if (header) {
    ret = renderer.paper.closeGroup();
  }
  selectables.wrapSvgEl({ el_type: type, startChar: -1, endChar: -1 }, ret);

  return ret;
};
export default drawBrace;