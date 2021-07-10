var printStaffLine = require('../write/draw/staff-line');
var renderText = require('../write/draw/text');
var FreeText = require('../write/free-text');
var nonMusic = require('../write/draw/non-music');

// private
function number(self, x, y, number) {
  var textSize = self.controller.getTextSize;
  var str = number.toString();
  var size = textSize.calc(str, 'tabnumberfont', 'text instrumentname');
  y -= (size.height/2)+1;
  var rows = self.rendered.rows;
  rows.push({ absmove: y });
  rows.push({ left: x, text: str, font: 'tabnumberfont', klass: 'text instrumentname', anchor: 'start' });
  self.drawer.drawRendered()
}

function TabRenderer(renderer) {
  this.renderer = renderer;
  this.controller = renderer.controller;
  this.drawer = null;
  this.reset();
}

TabRenderer.prototype.reset = function () {
  this.rendered = {
    rows : []
  };
}

TabRenderer.prototype.instrumentName = function (name,y) {
  var textSize = this.controller.getTextSize;
  var rows = this.rendered.rows;
  rows.push({ absmove: y });
  rows.push({ left: 18, text: name, font: 'infofont', klass: 'text instrumentname', anchor: 'start' });
  var size = textSize.calc(name, 'infofont', 'text instrumentname');
  rows.push({ move: size.height });
  this.drawer.drawRendered();
  return size.height;
}

TabRenderer.prototype.numbers = function (x, tablature, tabPos) {
  var notes = tabPos.notes;
  var graces = tabPos.graces;
  for (jjjj = 0; jjjj < notes.length; jjjj++) {
    var note = notes[jjjj];
    if (note) {
      var y = tablature.getY('on', note.str, 0);
      number(this, x, y, note.num);
      if (graces) {
        // TODO: graces
      }
    }
  }
}

/**
 * Empty space filler
 * @param {*} size 
 */
TabRenderer.prototype.fillerY = function (size) {
  var rows = this.rendered.rows;
  rows.push({ move: size });
  this.drawer.drawRendered();
  return size;
}

module.exports = TabRenderer;