import elementGroup from './group-elements';
import roundNumber from './round-number';

function printStem(renderer: any, x: any, dx: any, y1: any, y2: any, klass: any, name: any) {
  if (dx < 0 || y1 < y2) {
    // correct path "handedness" for intersection with other elements
    var tmp = roundNumber(y2);
    y2 = roundNumber(y1);
    y1 = tmp;
  } else {
    y1 = roundNumber(y1);
    y2 = roundNumber(y2);
  }
  x = roundNumber(x);
  var x2 = roundNumber(x + dx);
  var pathArray = [
    ["M", x, y1],
    ["L", x, y2],
    ["L", x2, y2],
    ["L", x2, y1],
    ["z"]
  ];
  var attr = { path: "" };
  for (var i = 0; i < pathArray.length; i++)
    attr.path += pathArray[i].join(" ");
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (klass) attr["class"] = klass;
  // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  if (name) attr["data-name"] = name;
  if (!elementGroup.isInGroup()) {
    // @ts-expect-error TS(2339): Property 'stroke' does not exist on type '{ path: ... Remove this comment to see the full error message
    attr.stroke = "none";
    // @ts-expect-error TS(2339): Property 'fill' does not exist on type '{ path: st... Remove this comment to see the full error message
    attr.fill = renderer.foregroundColor;
  }
  return renderer.paper.pathToBack(attr);
}

export default printStem;
