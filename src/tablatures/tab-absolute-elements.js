/**
 * Tablature Absolute elements factory
 */
var AbsoluteElement = require('../write/abc_absolute_element');
var RelativeElement = require('../write/abc_relative_element');
var Transposer = require('./transposer');

function isObject(a) { return a != null && a.constructor === Object; }
function cloneObject(dest, src) {
  for (var prop in src) {
    if (src.hasOwnProperty(prop)) {
      if (!(Array.isArray(src[prop]) || isObject(src[prop]))) {
        dest[prop] = src[prop];
      }
    }
  }
}

function cloneAbsolute(absSrc) {
  var returned = new AbsoluteElement('', 0, 0, '', 0);
  cloneObject(returned, absSrc);
  returned.top = 0;
  returned.bottom = -1;
  if (absSrc.abcelem) {
    returned.abcelem = {};
    cloneObject(returned.abcelem, absSrc.abcelem);
    returned.abcelem.el_type = 'tabNumber';
  }
  return returned;
}

function cloneAbsoluteAndRelatives(absSrc, plugin) {
  var returned = cloneAbsolute(absSrc);
  if (plugin) {
    var children = absSrc.children;
    // proceed with relative as well
    var first = true;
    for (var ii = 0; ii < children.length; ii++) {
      var child = children[ii];
      var relative = new RelativeElement('', 0, 0, 0, '');
      cloneObject(relative, child);
      first = plugin.tablature.setRelative(child, relative, first);
      returned.children.push(relative);
    }
  }
  return returned;
}

function buildTabAbsolute(plugin, absX, relX) {
  var tabIcon = 'tab.tiny';
  var tabYPos = 7.5;
  if (plugin.isTabBig) {
    tabIcon = 'tab.big';
    tabYPos = 10;
  }
  var element = {
    el_type: "tab",
    icon: tabIcon,
    Ypos: tabYPos
  };
  var tabAbsolute = new AbsoluteElement(element, 0, 0, "symbol", 0);
  tabAbsolute.x = absX;
  var tabRelative = new RelativeElement(tabIcon, 0, 0, 7.5, "tab");
  tabRelative.x = relX;
  tabAbsolute.children.push(tabRelative);
  if (tabAbsolute.abcelem.el_type == 'tab') {
    tabRelative.pitch = tabYPos;
  }
  return tabAbsolute;
}

function lyricsDim(abs) {
  if (abs.extra) {
    for (var ii = 0; ii < abs.extra.length; ii++) {
      var extra = abs.extra[ii];
      if (extra.type == 'lyric') {
        return {
          bottom: extra.bottom,
          height: extra.height
        };
      }
    }
  }
  return null;
}
function TabAbsoluteElements() {
  this.accidentals = null;
}

function getInitialStaffSize(staffGroup) {
  var returned = 0;
  for (var ii = 0; ii < staffGroup.length; ii++) {
    if (!staffGroup[ii].tabNameInfos) returned++;
  }
  return returned;
}

/**
 * Build tab absolutes by scanning current staff line absolute array
 * @param {*} staffAbsolute
 */
TabAbsoluteElements.prototype.build = function (plugin,
  staffAbsolute,
  tabVoice,
  voiceIndex,
  staffIndex) {
  var staffSize = getInitialStaffSize(staffAbsolute);
  var source = staffAbsolute[staffIndex+voiceIndex];
  var dest = staffAbsolute[staffSize+staffIndex+voiceIndex];
  var transposer = null;
  for (var ii = 0; ii < source.children.length; ii++) {
    var absChild = source.children[ii];
    var absX = absChild.x;
    var relX = absChild.children[0].x;

    if (absChild.isClef) {
      dest.children.push(buildTabAbsolute(plugin, absX, relX));
    }
    switch (absChild.type) {
      case 'staff-extra key-signature':
        // refresh key accidentals
        this.accidentals = absChild.abcelem.accidentals;
        plugin.semantics.strings.accidentals = this.accidentals;
        if (plugin.transpose) {
          transposer = new Transposer(
            absChild.abcelem.accidentals,
            plugin.transpose 
          );
        }
        break;
      case 'bar':
        var lastBar = false;
        if (ii == source.children.length-1) {
          // used for final line bar drawing
          // for multi tabs / multi staves
          lastBar = true;
        }
        tabVoice.push({
          el_type: absChild.abcelem.el_type,
          type: absChild.abcelem.type,
          endChar: absChild.abcelem.endChar,
          startChar: absChild.abcelem.startChar
        });
        var cloned = cloneAbsoluteAndRelatives(absChild, plugin);
        cloned.abcelem.lastBar = lastBar;
        dest.children.push(cloned);
        break;
      case 'note':
        var abs = cloneAbsolute(absChild);
        abs.lyricDim = lyricsDim(absChild);
        var pitches = absChild.abcelem.pitches;
        var graceNotes = absChild.gracenotes;
        // check transpose
        if (plugin.transpose) {
          //transposer.transpose(plugin.transpose);
          for (var jj = 0; jj < pitches.length; jj++) {
            pitches[jj] = transposer.transposeNote(pitches[jj]);
          }
          if (graceNotes) {
            for (var kk = 0; kk < graceNotes.length; kk++) {
              graceNotes[kk] = transposer.transposeNote(graceNotes[kk]);
            }
          }
        }
        var tabPos = plugin.semantics.notesToNumber(pitches, graceNotes);
        if (tabPos.error) {
          plugin._super.setError(tabPos.error);
        } 
        var def = { el_type: "note", startChar: absChild.abcelem.startChar, endChar: absChild.abcelem.endChar, notes: [] };
        abs.type = 'tabNumber';
        // convert note to number
        for (var ll = 0; ll < tabPos.notes.length; ll++) {
          var curNote = tabPos.notes[ll];
          var strNote = curNote.num;
          if (curNote.note.quarter != null) {
            // add tab quarter => needs to string conversion then 
            strNote = strNote.toString();
            strNote += curNote.note.quarter;
          }
          var pitch = plugin.semantics.stringToPitch(curNote.str);
          def.notes.push({ num: strNote, str: curNote.str, pitch: curNote.note.emit() });
          var opt = {
            type: 'tabNumber'
          };
          var tabNoteRelative = new RelativeElement(
            strNote, 0, 0, pitch, opt);
          tabNoteRelative.x = relX;
          tabNoteRelative.isAltered = curNote.note.isAltered;
          abs.children.push(tabNoteRelative);
        }
        dest.children.push(abs);
        tabVoice.push(def);
        break;
    }
  }
};

module.exports = TabAbsoluteElements;