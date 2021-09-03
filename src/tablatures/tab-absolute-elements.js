/**
 * Tablature Absolute elements factory
 */
var AbsoluteElement = require('../write/abc_absolute_element');
var RelativeElement = require('../write/abc_relative_element');

function isObject(a) { return a != null && a.constructor === Object; }
function clone(dest,src) {
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
  clone(returned, absSrc);
  returned.top = 0;
  returned.bottom = -1;
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
      clone(relative, child);
      first = plugin.tablature.setRelative(child, relative, first);
      returned.children.push(relative);
    }
  }
  return returned;
}

function buildTabAbsolute(plugin , absX , relX ) {
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

function TabAbsoluteElements() {}

/**
 * Build tab absolutes by scanning current staff line absolute array
 * @param {*} staffAbsolute
 */
TabAbsoluteElements.prototype.build = function (plugin, staffAbsolute) {
  var source = staffAbsolute[0];
  var dest = staffAbsolute[1];
  for (var ii = 0; ii < source.children.length; ii++) {
    var absChild = source.children[ii];
    var absX = absChild.x;
    var relX = absChild.children[0].x;
    if (absChild.isClef) {
      dest.children.push(buildTabAbsolute(plugin, absX, relX));
    }
    switch (absChild.type) {
      case 'bar':
        
        dest.children.push(cloneAbsoluteAndRelatives(absChild, plugin));
        break;
      case 'note':
        var abs = cloneAbsolute(absChild);
        abs.lyricDim = lyricsDim(absChild);
        var pitches = absChild.abcelem.pitches;
        var graceNotes = absChild.gracenotes;
        var tabPos = plugin.semantics.notesToNumber(pitches, graceNotes);
        abs.type = 'tabNumber';
        // convert note to number
        for (var jj = 0; jj < tabPos.notes.length; jj++) {
          var pitch = plugin.semantics.stringToPitch(tabPos.notes[jj].str);
          var tabNoteRelative = new RelativeElement(
            tabPos.notes[jj].num.toString(), 0, 0, pitch,
            { type: 'tabNumber' });
          tabNoteRelative.x = relX;
          abs.children.push(tabNoteRelative);
        }
        dest.children.push(abs);
        break;
    }
  }
};

module.exports = TabAbsoluteElements;