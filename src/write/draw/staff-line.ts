import printLine from './print-line';

function printStaffLine(renderer: any, x1: any, x2: any, pitch: any, klass: any, name: any, dy: any) {
  var y = renderer.calcY(pitch);
  return printLine(renderer, x1, x2, y, klass, name, dy);
}

export default printStaffLine;
