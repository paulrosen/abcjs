import printStaffLine from './staff-line';

function printStaff(renderer: any, startx: any, endx: any, numLines: any, linePitch: any, dy: any) {
  var klass = "abcjs-top-line";
  var pitch = 2;
  if (linePitch) {
    pitch = linePitch;
  }
  renderer.paper.openGroup({
    prepend: true,
    klass: renderer.controller.classes.generate("abcjs-staff")
  });
  // If there is one line, it is the B line. Otherwise, the bottom line is the E line.
  var firstYLine = 0;
  var lastYLine = 0;
  if (numLines === 1) {
    // @ts-expect-error TS(2554): Expected 7 arguments, but got 5.
    printStaffLine(renderer, startx, endx, 6, klass);
    firstYLine = renderer.calcY(10);
    lastYLine = renderer.calcY(2);
  } else {
    for (var i = numLines - 1; i >= 0; i--) {
      var curpitch = (i + 1) * pitch;
      lastYLine = renderer.calcY(curpitch);
      if (firstYLine === 0) {
        firstYLine = lastYLine;
      }
      printStaffLine(renderer, startx, endx, curpitch, klass, null, dy);
      // @ts-expect-error TS(2322): Type 'undefined' is not assignable to type 'string... Remove this comment to see the full error message
      klass = undefined;
    }
  }
  renderer.paper.closeGroup();
  return [firstYLine, lastYLine];
}

export default printStaff;
