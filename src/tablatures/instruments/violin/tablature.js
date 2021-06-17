/*
 *
 *  Violin / Mandolin / tenor Banjo tablature  
 * 
 */

function Tablature(drawer, numLines, lineSpace) {
  this.drawer = drawer;
  this.renderer = drawer.renderer;
  this.startx = this.renderer.tablatures.startx;
  this.endx = this.renderer.tablatures.w;
  this.numLines = numLines;
  this.lineSpace = lineSpace;
  this.lines = [];
  this.topLine = -1;
  this.bottomLine = -1;
  this.staffY = -1;
  this.dotY = null;
}

Tablature.prototype.print = function () {
  var klass = "abcjs-top-tab";
  this.renderer.paper.openGroup({ prepend: true, klass: this.renderer.controller.classes.generate("abcjs-tab") });
  // since numbers will be on lines , use fixed size space between lines
  for (var i = 1; i <= this.numLines; i++) {
    this.lines[i] = this.drawer.drawHLine(
      this.startx,
      this.endx,
      i,
      this.lineSpace,
      klass);
    klass = undefined;
  }
  this.topLine = this.lines[1];
  this.bottomLine = this.lines[this.numLines];
  this.renderer.paper.closeGroup();  
}

Tablature.prototype.getY = function (pos, lineNumber, pitch) {
  if (!pitch) pitch = 2;
  var interval = (this.lines[1] - this.lines[2])/2;
  switch (pos) {
    case "above": // above line
      if (lineNumber == 1) {
        return this.lines[1] - pitch;
      } else {
        return this.lines[lineNumber] - interval;
      }
    case "on": // on line
      return this.lines[lineNumber];
    case "below": // below line
      if ( lineNumber >= this.lines.length ) {
        return this.lines[this.lines.length-1] + pitch;
      } else {
        return this.lines[lineNumber] + interval;
      }
  }
}

Tablature.prototype.verticalLine = function (x, y1, y2) {
  var klass = "abcjs-vert-tab";
  this.renderer.paper.openGroup({ prepend: true, klass: this.renderer.controller.classes.generate("abcjs-vert-tab") });
  this.drawer.drawVLine(y1, y2,x,klass);
  this.renderer.paper.closeGroup();
}

Tablature.prototype.bar = function ( staffInfos ) {
  if (this.dotY == null) {
    this.dotY = this.getY('on', 2);
  } else {
    this.dotY = this.getY('on', 3);
  }
  switch (staffInfos.type) {
    case 'bar':
      this.drawer.drawBar(this.topLine, this.bottomLine, staffInfos.x, null, "tabbar", staffInfos.linewidth);
      break;
    case 'symbol':
      this.drawer.drawSymbol(staffInfos.x,this.dotY,staffInfos.name);
      break;
  }
  if (this.dotY == this.getY('on', 3)) {
    this.dotY = null; // just reset
  }
}

Tablature.prototype.tab = function (staffInfos) {
  this.drawer.drawTab(staffInfos.x,
    this.getY('above', 2),
    staffInfos.pitch);
}

module.exports = Tablature;
