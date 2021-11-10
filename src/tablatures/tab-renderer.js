/* eslint-disable no-debugger */
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
  this.staffIndex = staffIndex ;
  this.tabStaff = {
    clef: {
      type: 'TAB'
    }
  };
  this.tabSize = (plugin.linePitch * plugin.nbLines);
}

function getTabStaff(self ,staffGroup) {
  var tabIndex = self.staffIndex;
  var prevIndex = 0; 
  for (var ii = 0; ii < staffGroup.length; ii++) {
    if (!staffGroup[ii].isTabStaff) {
      if (prevIndex == tabIndex) return prevIndex;
      prevIndex++;
    }
  }
  return -1;
}

function getNbTabs(self, staffGroup) {
  var nbTabs = self.staffIndex;
  for (var ii = 0; ii < staffGroup.length; ii++) {
    if (staffGroup[ii].isTabStaff) {
      nbTabs++;
    }
  }
  return nbTabs;
}

function linkStaffAndTabs(staffGroup) {
  for (var ii = 0; ii < staffGroup.length; ii++) {
    if (staffGroup[ii].isTabStaff) {
      // link to previous staff
      staffGroup[ii].hasStaff = staffGroup[ii-1];
      staffGroup[ii - 1].hasTab = staffGroup[ii];
    }
  }
}
TabRenderer.prototype.doLayout = function () {
  var staffs = this.line.staff;
  if (staffs) {
    staffs.splice(
      staffs.length, 0,
      this.tabStaff
    );
  }
  var staffGroup = this.line.staffGroup;

  var voices = staffGroup.voices;
  var firstVoice = voices[0];
  // take lyrics into account if any
  var lyricsHeight = getLyricHeight(firstVoice);
  var padd = 4;
  var prevIndex = getTabStaff(this, staffGroup.staffs);
  var nbTabs = getNbTabs(this, staffGroup.staffs);
  var previousStaff = staffGroup.staffs[prevIndex];
  var tabTop = previousStaff.top + padd + lyricsHeight;
  var staffGroupInfos = {
    bottom: -1,
    isTabStaff: true,
    specialY: initSpecialY(),
    lines: this.plugin.nbLines,
    linePitch: this.plugin.linePitch,
    dy: 0.15,
    top: tabTop,
  };
  staffGroup.staffs.splice(this.staffIndex+1+nbTabs, 0, staffGroupInfos);
  // staffGroup.staffs.push(staffGroupInfos);
  staffGroup.height += this.tabSize + padd;
  var nbVoices = staffs[this.staffIndex].voices.length;
  // build from staff
  this.tabStaff.voices = [];
  for (var ii = 0; ii < nbVoices; ii++) {
    var tabVoice = new VoiceElement(0, 0);
    var nameHeight = buildTabName(this, tabVoice) / spacing.STEP;
    for (var jj = this.staffIndex + 1; jj < staffGroup.staffs.length; jj++) {
      staffGroup.staffs[jj].top += nameHeight;
    }
    staffGroup.height += nameHeight * spacing.STEP;
    tabVoice.staff = staffGroupInfos;
    voices.splice(voices.length, 0, tabVoice);
    this.absolutes.build(this.plugin, voices, this.tabStaff.voices, ii , this.staffIndex);
  }
  linkStaffAndTabs(staffGroup.staffs); // crossreference tabs and staff
};


module.exports = TabRenderer;