var VoiceElement = require('../write/abc_voice_element');
var TabAbsoluteElements = require('./tab-absolute-elements');

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
  var toto = 0 ;  var maxLyricHeight = 0;
  for ( var ii=0; ii < voice.children.length; ii++) {
    var curAbs = voice.children[ii];
    if (curAbs.specialY) {
      if (curAbs.specialY.lyricHeightBelow > maxLyricHeight) {
        maxLyricHeight = curAbs.specialY.lyricHeightBelow;
      }
    }
  }
  return maxLyricHeight ; // add spacing
}

function buildTabName(self,dest) {
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
function TabRenderer(plugin,renderer, line, staffIndex) {
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
  var lyricsHeight = getLyricHeight(firstVoice);
  var curStaffHeight;
  // start using pos and height of above staff
  if (lyricsHeight > 0) {
    curStaffHeight = staffGroup.height -8 ; // adjust strange behavior with lyrics
  } else {
    curStaffHeight = staffGroup.height;
  }
  
  var tabTop = curStaffHeight;
  var staffGroupInfos = {
    bottom: -1,
    specialY: initSpecialY(),
    lines: this.plugin.nbLines,
    linePitch: this.plugin.linePitch,
    dy: 0.15,
    top: tabTop,
  };
  //staffGroup.staffs.splice(this.staffIndex, 0, staffGroupInfos);
  staffGroup.staffs.push(staffGroupInfos);
  staffGroup.height += this.tabSize;
  var tabVoice = new VoiceElement(0, 0);
  var nameHeight = buildTabName(this,tabVoice);
  staffGroup.height += nameHeight;
  tabVoice.staff = staffGroupInfos;
  voices.push(tabVoice);
  // build from staff
  this.absolutes.build(this.plugin, voices);
};


module.exports = TabRenderer;