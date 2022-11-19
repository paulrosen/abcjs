import printLine from './print-line';

function printStaffLine(renderer, x1, x2, pitch, klass, name, dy) {
  var y = renderer.calcY(pitch);
  return printLine(renderer, x1, x2, y, klass, name, dy);
}

export default printStaffLine;
