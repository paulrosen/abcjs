var VoiceElement = require('../write/abc_voice_element');
var TabAbsoluteElements = require('./tab-absolute-elements');
var spacing = require('../write/abc_spacing');

function initSpecialY() {
  return {
    tempoHeightAbove: 0,
    partHeightAbove: 0,
    volumeHeightAbove: 0,
    dynamicHeightAbove: 0,
    endingHeightAbove: 0,
    chordHeightAbove: 0,
    lyricHeightAbove: 0,
    lyricHeightBelow: 0,
    chordHeightBelow: 0,
    volumeHeightBelow: 0,
    dynamicHeightBelow: 0
  };
}

function getLyricHeight(voice) {
  var maxLyricHeight = 0;
  for (var ii = 0; ii < voice.children.length; ii++) {
    var curAbs = voice.children[ii];
    if (curAbs.specialY) {
      if (curAbs.specialY.lyricHeightBelow > maxLyricHeight) {
        maxLyricHeight = curAbs.specialY.lyricHeightBelow;
      }
    }
  }
  return maxLyricHeight; // add spacing
}

function buildTabName(self, dest) {
  var stringSemantics = self.plugin.semantics.strings;
  var controller = self.renderer.controller;
  var textSize = controller.getTextSize;
  var tabName = stringSemantics.tabInfos(self.plugin);
  var size = textSize.calc(tabName, 'infofont', 'text instrumentname');
  dest.tabNameInfos = {
    textSize: size,
    name: tabName
  };
  return size.height;
}

/**
 * Laying out tabs
 * @param {*} renderer
 * @param {*} line
 * @param {*} staffIndex
 * @param {*} tablatureLayout
 */
function TabRenderer(plugin, renderer, line, staffIndex) {
  this.renderer = renderer;
  this.plugin = plugin;
  this.line = line;
  this.absolutes = new TabAbsoluteElements();
  this.staffIndex = staffIndex + 1;
  this.tabStaff = {
    clef: {
      type: 'TAB'
    }
  };
  this.tabSize = (plugin.linePitch * plugin.nbLines);
}

TabRenderer.prototype.doLayout = function () {
  var staffs = this.line.staff;
  if (staffs) {
    staffs.splice(
      this.staffIndex, 0,
      this.tabStaff
    );
  }
  var staffGroup = this.line.staffGroup;

  var voices = staffGroup.voices;
  var firstVoice = voices[0];
  // take lyrics into account if any
  var lyricsHeight = getLyricHeight(firstVoice);

  var previousStaff = staffGroup.staffs[this.staffIndex - 1];
  var tabTop = previousStaff.top + lyricsHeight;
  var staffGroupInfos = {
    bottom: -1,
    specialY: initSpecialY(),
    lines: this.plugin.nbLines,
    linePitch: this.plugin.linePitch,
    dy: 0.15,
    top: tabTop,
  };
  staffGroup.staffs.splice(this.staffIndex, 0, staffGroupInfos);
  // staffGroup.staffs.push(staffGroupInfos);
  staffGroup.height += this.tabSize ;
  var tabVoice = new VoiceElement(0, 0);
  var nameHeight = buildTabName(this, tabVoice) / spacing.STEP;
  for (var ii = this.staffIndex + 1; ii < staffGroup.staffs.length; ii++) {
    staffGroup.staffs[ii].top += nameHeight;
  }
  staffGroup.height += nameHeight * spacing.STEP ;
  tabVoice.staff = staffGroupInfos;
  voices.splice(this.staffIndex, 0, tabVoice);
  // build from staff
  this.tabStaff.voices = [];
  this.absolutes.build(this.plugin, voices, this.tabStaff.voices);
};


module.exports = TabRenderer;