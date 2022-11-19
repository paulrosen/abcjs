import sprintf from './sprintf';
import printPath from './print-path';
import roundNumber from './round-number';

function drawCrescendo(renderer: any, params: any, selectables: any) {
  if (params.pitch === undefined)
    window.console.error("Crescendo Element y-coordinate not set.");
  var y = renderer.calcY(params.pitch) + 4; // This is the top pixel to use (it is offset a little so that it looks good with the volume marks.)
  var height = 8;

  // TODO-PER: This is just a quick hack to make the dynamic marks not crash if they are mismatched. See the slur treatment for the way to get the beginning and end.
  var left = params.anchor1 ? params.anchor1.x : 0;
  var right = params.anchor2 ? params.anchor2.x : 800;

  var el;
  if (params.dir === "<") {
    el = drawLine(
      renderer,
      y + height / 2,
      y,
      y + height / 2,
      y + height,
      left,
      right
    );
  } else {
    el = drawLine(
      renderer,
      y,
      y + height / 2,
      y + height,
      y + height / 2,
      left,
      right
    );
  }
  selectables.wrapSvgEl(
    { el_type: "dynamicDecoration", startChar: -1, endChar: -1 },
    el
  );
  return [el];
}

var drawLine = function (renderer: any, y1: any, y2: any, y3: any, y4: any, left: any, right: any) {
  y1 = roundNumber(y1);
  y2 = roundNumber(y2);
  y3 = roundNumber(y3);
  y4 = roundNumber(y4);
  left = roundNumber(left);
  right = roundNumber(right);

  var pathString = sprintf(
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 9.
    "M %f %f L %f %f M %f %f L %f %f",
    left,
    y1,
    right,
    y2,
    left,
    y3,
    right,
    y4
  );
  // @ts-expect-error TS(2554): Expected 3 arguments, but got 2.
  return printPath(renderer, {
    path: pathString,
    highlight: "stroke",
    stroke: renderer.foregroundColor,
    class: renderer.controller.classes.generate("dynamics decoration"),
    "data-name": "dynamics"
  });
};

export default drawCrescendo;
