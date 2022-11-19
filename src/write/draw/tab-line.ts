import sprintf from './sprintf';
import roundNumber from './round-number';
import printStem from './print-stem';

function TabLine(this: any, renderer: any, klass: any, dx: any, name: any) {
  this.renderer = renderer;
  if (!dx) dx = 0.35; // default
  this.dx = dx;
  this.klass = klass;
  this.name = name;
  var fill = renderer.foregroundColor;
  this.options = { stroke: "none", fill: fill };
  if (name) this.options["data-name"] = name;
  if (klass) this.options["class"] = klass;
}

TabLine.prototype.printVertical = function (y1: any, y2: any, x: any) {
  return printStem(
    this.renderer,
    x,
    this.dx,
    y1,
    y2,
    this.options.klass,
    this.options.name
  );
};

TabLine.prototype.printHorizontal = function (x1: any, x2: any, y: any) {
  x1 = roundNumber(x1);
  x2 = roundNumber(x2);
  var y1 = roundNumber(y - this.dx);
  var y2 = roundNumber(y + this.dx);
  this.options.path = sprintf(
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
  return this.renderer.paper.pathToBack(this.options);
};

export default TabLine;
