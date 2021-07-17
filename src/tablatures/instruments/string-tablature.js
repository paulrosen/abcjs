/*
 *
 *  Violin / Mandolin / tenor Banjo tablature layout   
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
  this.tabFontName = 'tab.tiny'
  this.tabYPos = 1
}

Tablature.prototype.print = function () {
  var klass = "abcjs-top-tab";
  this.renderer.paper.openGroup({ prepend: true, klass: this.renderer.controller.classes.generate("abcjs-tab") });
  // since numbers will be on lines , use fixed size space between lines
  for (var i = 0; i <= this.numLines-1; i++) {
    this.lines[i] = this.drawer.drawHLine(
      this.startx,
      this.endx,
      i,
      this.lineSpace,
      klass);
    klass = undefined;
  }
  this.topLine = this.lines[0];
  this.bottomLine = this.lines[this.numLines-1];
  this.renderer.paper.closeGroup();  
}

Tablature.prototype.getY = function (pos, lineNumber, pitch) {
  if (!pitch) pitch = 0;
  var interval = (this.lines[2] - this.lines[1])/2;
  switch (pos) {
    case "above": // above line
      return this.lines[lineNumber] - interval - pitch;
    case "on": // on line
      return this.lines[lineNumber] + pitch ;
    case "below": // below line
      if (lineNumber >= this.lines.length - 1) {
        lineNumber = this.lines.length - 1
      }
      return this.lines[lineNumber] + interval + pitch;
  }
}

Tablature.prototype.verticalLine = function (x, y1, y2,thickLine) {
  var klass = "abcjs-vert-tab";
  var dx = 0.6;
  if (thickLine) dx = 4;
  this.renderer.paper.openGroup({ prepend: true, klass: this.renderer.controller.classes.generate("abcjs-vert-tab") });
  this.drawer.drawVLine(y1, y2,x,klass,dx);
  this.renderer.paper.closeGroup();
}

Tablature.prototype.bar = function (staffInfos) {
  var nbLines = this.lines.length;
  var dotPos = Math.round(nbLines / 2);
  if (this.dotY == null) {
    this.dotY = this.getY('on', dotPos-1);
  } else {
    this.dotY = this.getY('on', dotPos);
  }
  switch (staffInfos.type) {
    case 'bar':
      this.drawer.drawBar(this.topLine, this.bottomLine, staffInfos.x, null, "tabbar", staffInfos.linewidth);
      break;
    case 'symbol':
      this.drawer.drawSymbol(staffInfos.x,this.dotY,staffInfos.name);
      break;
  }
  if (this.dotY == this.getY('on', dotPos)) {
    this.dotY = null; // just reset
  }
}

Tablature.prototype.tab = function (staffInfos) {
  this.drawer.drawTab(staffInfos.x,
    this.getY('below', this.tabYPos),
    this.tabFontName);
}

module.exports = Tablature;
