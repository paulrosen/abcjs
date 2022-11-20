import sprintf from './sprintf';
import renderText from './text';
import printPath from './print-path';
import roundNumber from './round-number';

function drawEnding(renderer: any, params: any, linestartx: any, lineendx: any, selectables: any) {
  if (params.pitch === undefined)
    window.console.error("Ending Element y-coordinate not set.");
  var y = roundNumber(renderer.calcY(params.pitch));
  var height = 20;
  var pathString = "";

  if (params.anchor1) {
    linestartx = roundNumber(params.anchor1.x + params.anchor1.w);
    pathString += sprintf(
      // @ts-expect-error TS(2554): Expected 0 arguments, but got 5.
      "M %f %f L %f %f ",
      linestartx,
      y,
      linestartx,
      roundNumber(y + height)
    );
  }

  if (params.anchor2) {
    lineendx = roundNumber(params.anchor2.x);
    pathString += sprintf(
      // @ts-expect-error TS(2554): Expected 0 arguments, but got 5.
      "M %f %f L %f %f ",
      lineendx,
      y,
      lineendx,
      roundNumber(y + height)
    );
  }

  // @ts-expect-error TS(2554): Expected 0 arguments, but got 5.
  pathString += sprintf("M %f %f L %f %f ", linestartx, y, lineendx, y);

  renderer.paper.openGroup({
    klass: renderer.controller.classes.generate("ending"),
    "data-name": "ending"
  });
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  printPath(renderer, {
    path: pathString,
    stroke: renderer.foregroundColor,
    fill: renderer.foregroundColor,
    "data-name": "line"
  });
  if (params.anchor1)
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
    renderText(renderer, {
      x: roundNumber(linestartx + 5),
      y: roundNumber(renderer.calcY(params.pitch - 0.5)),
      text: params.text,
      type: "repeatfont",
      klass: "ending",
      anchor: "start",
      noClass: true,
      name: params.text
    });
  var g = renderer.paper.closeGroup();
  selectables.wrapSvgEl({ el_type: "ending", startChar: -1, endChar: -1 }, g);
  return [g];
}

export default drawEnding;
