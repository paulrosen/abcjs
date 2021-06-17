var printStaffLine = require('../write/draw/staff-line');
var renderText = require('../write/draw/text');
var FreeText = require('../write/free-text');
var nonMusic = require('../write/draw/non-music');

function TabRenderer(renderer) {
  this.renderer = renderer;
  this.controller = renderer.controller;
  this.reset();
}


TabRenderer.prototype.reset = function () {
  this.rendered = {
    rows : []
  };
}

TabRenderer.prototype.instrumentName = function (name) {
  var textSize = this.controller.getTextSize;
  var rows = this.rendered.rows;
  rows.push({ left: 18, text: name, font: 'infofont', klass: 'text instrumentname', anchor: 'start' });
  var size = textSize.calc(name, 'infofont', 'text instrumentname');
  rows.push({ move: size.height });
}



module.exports = TabRenderer;