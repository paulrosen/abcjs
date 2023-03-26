/**
 * Tablature Absolute elements factory
 */
var AbsoluteElement = require('../write/creation/elements/absolute-element');
var RelativeElement = require('../write/creation/elements/relative-element');

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
    if (returned.abcelem.el_type === "note")
      returned.abcelem.el_type = 'tabNumber';
  }
  // TODO-PER: This fixes the classes because the element isn't created at the right time.
  absSrc.cloned = returned
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

function buildRelativeTabNote(plugin, relX, def, curNote, isGrace) {
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
    strNote, 0, 0, pitch+0.3, opt);
  tabNoteRelative.x = relX;
  tabNoteRelative.isGrace = isGrace;
  tabNoteRelative.isAltered = curNote.note.isAltered;
  return tabNoteRelative;
}

function getXGrace(abs, index) {
  var found = 0;
  if (abs.extra) {
    for (var ii = 0; ii < abs.extra.length; ii++) {
      if (abs.extra[ii].c.indexOf('noteheads') >= 0) {
        if (found === index) {
          return abs.extra[ii].x + abs.extra[ii].w/2;
        } else {
          found++;
        }
      }
    }
  }
  return -1;
}

function graceInRest( absElem ) {
  if (absElem.abcelem) {
    var elem = absElem.abcelem; 
    if (elem.rest) {
      return elem.gracenotes;
    }
  }
  return null;
}

function convertToNumber(plugin, pitches, graceNotes) {
  var tabPos = plugin.semantics.notesToNumber(pitches, graceNotes);
  if (tabPos.error) {
    plugin._super.setError(tabPos.error);
    return tabPos; // give up on error here
  }
  if (tabPos.graces && tabPos.notes) {
    // add graces to last note in notes
    var posNote = tabPos.notes.length - 1;
    tabPos.notes[posNote].graces = tabPos.graces;
  }
  return tabPos;
}

function buildGraceRelativesForRest(plugin,abs,absChild,graceNotes,tabVoice) {
  for (var mm = 0; mm < graceNotes.length; mm++) {
    var defGrace = { el_type: "note", startChar: absChild.abcelem.startChar, endChar: absChild.abcelem.endChar, notes: [], grace: true };
    var graceX = getXGrace(absChild, mm);
    var curGrace = graceNotes[mm];
    var tabGraceRelative = buildRelativeTabNote(plugin, graceX, defGrace, curGrace, true);
    abs.children.push(tabGraceRelative);
    tabVoice.push(defGrace);
  }
}

/**
 * Build tab absolutes by scanning current staff line absolute array
 * @param {*} staffAbsolute
 */
TabAbsoluteElements.prototype.build = function (plugin,
  staffAbsolute,
  tabVoice,
  voiceIndex,
  staffIndex,
  keySig ) {
  var staffSize = getInitialStaffSize(staffAbsolute);
  var source = staffAbsolute[staffIndex+voiceIndex];
  var dest = staffAbsolute[staffSize+staffIndex+voiceIndex];
  var tabPos = null;
  var defNote = null;
  if (source.children[0].abcelem.el_type != 'clef') {
    // keysig missing => provide one for tabs
    if (keySig != 'none') {
      source.children.splice(0, 0, keySig);
    }  
  }
  for (var ii = 0; ii < source.children.length; ii++) {
    var absChild = source.children[ii];
    var absX = absChild.x;
    var relX = absX;
    // if (absChild.children.length > 0) {
    //   relX = absChild.children[0].x;
    // }
    if ( (absChild.isClef) ) {
      dest.children.push(buildTabAbsolute(plugin, absX, relX));
      if (absChild.abcelem.type.indexOf('-8') >= 0) plugin.semantics.strings.clefTranspose = -12
      if (absChild.abcelem.type.indexOf('+8') >= 0) plugin.semantics.strings.clefTranspose = 12
    }
    switch (absChild.type) {
      case 'staff-extra key-signature':
        // refresh key accidentals
        this.accidentals = absChild.abcelem.accidentals;
        plugin.semantics.strings.accidentals = this.accidentals;
        break;
      case 'bar':
        plugin.semantics.strings.measureAccidentals = {}
        var lastBar = false;
        if (ii === source.children.length-1) {
          // used for final line bar drawing
          // for multi tabs / multi staves
          lastBar = true;
        }
        var cloned = cloneAbsoluteAndRelatives(absChild, plugin);
        if (cloned.abcelem.barNumber) {
          delete cloned.abcelem.barNumber;
          for (var bn = 0; bn < cloned.children.length; bn++) {
            if (cloned.children[bn].type === "barNumber" ) {
              cloned.children.splice(bn, 1);
              break;
            }
          }
        }
        cloned.abcelem.lastBar = lastBar;
        dest.children.push(cloned);
        tabVoice.push({
          el_type: absChild.abcelem.el_type,
          type: absChild.abcelem.type,
          endChar: absChild.abcelem.endChar,
          startChar: absChild.abcelem.startChar,
          abselem: cloned
        });
        break;
      case 'rest':
        var restGraces = graceInRest(absChild);
        if (restGraces) {
          // to number conversion 
          tabPos = convertToNumber(plugin, null, restGraces);
          if (tabPos.error) return;
          // build relative for grace
          defGrace = { el_type: "note", startChar: absChild.abcelem.startChar, endChar: absChild.abcelem.endChar, notes: [], grace: true };
          buildGraceRelativesForRest(plugin, abs, absChild, tabPos.graces, tabVoice);
       }
        break;
      case 'note':
        var abs = cloneAbsolute(absChild);
        abs.x = absChild.heads[0].x + absChild.heads[0].w / 2; // center the number
        abs.lyricDim = lyricsDim(absChild);
        var pitches = absChild.abcelem.pitches;
        var graceNotes = absChild.abcelem.gracenotes;
        abs.type = 'tabNumber';
        // to number conversion 
        tabPos = convertToNumber(plugin, pitches, graceNotes);   
        if (tabPos.error) return;
        if (tabPos.graces) {
          // add graces to last note in notes
          var posNote = tabPos.notes.length - 1;
          tabPos.notes[posNote].graces = tabPos.graces;
        }
        // build relative
        defNote = { el_type: "note", startChar: absChild.abcelem.startChar, endChar: absChild.abcelem.endChar, notes: [] };
        for (var ll = 0; ll < tabPos.notes.length; ll++) {
          var curNote = tabPos.notes[ll];
          if (curNote.graces) {
            for (var mm = 0; mm < curNote.graces.length; mm++) {
              var defGrace = { el_type: "note", startChar: absChild.abcelem.startChar, endChar: absChild.abcelem.endChar, notes: [], grace: true };
              var graceX = getXGrace(absChild , mm);
              var curGrace = curNote.graces[mm];
              var tabGraceRelative = buildRelativeTabNote(plugin, graceX, defGrace, curGrace, true);
              abs.children.push(tabGraceRelative);
              tabVoice.push(defGrace);
            }
          }
          var tabNoteRelative = buildRelativeTabNote(plugin, abs.x+absChild.heads[ll].dx, defNote, curNote, false);
          abs.children.push(tabNoteRelative);
        }
        if (defNote.notes.length > 0) {
          defNote.abselem = abs;
          tabVoice.push(defNote);
          dest.children.push(abs);
        }
        break;
    }
  }
};

module.exports = TabAbsoluteElements;
