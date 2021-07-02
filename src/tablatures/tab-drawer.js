var nonMusic = require('../write/draw/non-music')
var Line = require('../write/draw/tab-line');
var printSymbol = require('../write/draw/print-symbol');
var glyphs = require('../write/abc_glyphs');

var printStem = require('../write/draw/print-stem');

function TabDrawer(tabRenderer) {
  this.tabRenderer = tabRenderer;
  this.renderer = tabRenderer.renderer;
  this.controller = this.renderer.controller;
}

TabDrawer.prototype.drawSymbol = function (x,y, symbol) {
  var ycorr = glyphs.getYCorr(symbol);
  var el = glyphs.printSymbol(x, y + ycorr, symbol, this.renderer.paper, {});
  return el
}

TabDrawer.prototype.drawRendered = function () {
  nonMusic(this.renderer, this.tabRenderer.rendered);
  this.tabRenderer.reset(); // cleanup after drawing
}

TabDrawer.prototype.drawHLine = function ( x1, x2, numLine, lineSpace, klass, name) {
  var y = this.renderer.y + (numLine * lineSpace);
  var line = new Line(this.renderer, klass, name, 0.35);
  line.printHorizontal(x1, x2, y);
  return y;
};

TabDrawer.prototype.drawVLine = function (y1, y2, x, klass, name,dx) {
  var line = new Line(this.renderer, klass, name, dx);
  line.printVertical(y1, y2, x);
};

TabDrawer.prototype.drawBar = function (y1, y2, x, klass, name, dx) {
  return printStem(this.renderer, x,dx,y1,y2,klass,name)  
}

TabDrawer.prototype.drawTab = function (x,y, fontName) {
  return this.drawSymbol(x, y, fontName);
};


module.exports = TabDrawer;