var printStaffLine = require('../write/draw/staff-line');
var TabInstrumentName = require('./instrument_name');
var renderText = require('../write/draw/text');
var FreeText = require('../write/free-text');
function TabUtils(renderer) {
  this.renderer = renderer;
  this.controller = renderer.controller;
}

TabUtils.prototype.drawLine = function (x1, x2, pitch) {
};

TabUtils.prototype.drawTab = function (x1, x2, pitch) {
};

TabUtils.prototype.drawTab = function (x1, x2, pitch) {
};



TabUtils.prototype.drawInstrumentName = function (name) {
  var textSize = this.controller.getTextSize;
  var name = new TabInstrumentName(name, textSize);
};



module.exports = TabUtils;