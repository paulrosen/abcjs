var sprintf = require('./sprintf');
var roundNumber = require("./round-number");

function printLine(renderer, x1, x2, y , klass, name ,dy ) {
  if (!dy ) dy = 0.35;
  var fill = renderer.foregroundColor;
  x1 = roundNumber(x1);
  x2 = roundNumber(x2);
  var y1 = roundNumber(y - dy);
  var y2 = roundNumber(y + dy);
  var pathString = sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y1, x2, y1,
    x2, y2, x1, y2);
  var options = { path: pathString, stroke: "none", fill: fill };
  if (name)
    options['data-name'] = name;
  if (klass)
    options['class'] = klass;
  var ret = renderer.paper.pathToBack(options);

  return ret;
}

module.exports = printLine;

