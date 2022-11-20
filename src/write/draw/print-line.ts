import sprintf from './sprintf';
import roundNumber from './round-number';

function printLine(renderer: any, x1: any, x2: any, y: any, klass: any, name: any, dy: any) {
  if (!dy) dy = 0.35;
  var fill = renderer.foregroundColor;
  x1 = roundNumber(x1);
  x2 = roundNumber(x2);
  var y1 = roundNumber(y - dy);
  var y2 = roundNumber(y + dy);
  var pathString = sprintf(
    // @ts-expect-error TS(2554): Expected 0 arguments, but got 9.
    "M %f %f L %f %f L %f %f L %f %f z",
    x1,
    y1,
    x2,
    y1,
    x2,
    y2,
    x1,
    y2
  );
  var options = { path: pathString, stroke: "none", fill: fill };
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (name) options["data-name"] = name;
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (klass) options["class"] = klass;
  var ret = renderer.paper.pathToBack(options);

  return ret;
}

export default printLine;
