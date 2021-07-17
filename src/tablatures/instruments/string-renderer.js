var TabRenderer = require('../tab-renderer');
var TabDrawer = require('../tab-drawer');

// private stuff
function isRepeat(absChild) {
  var type = absChild.abcelem.type;
  if (type) {
    if  ( type.endsWith('_repeat') )  return true;
  }
  return false;
}

/*
 * render tablature for string voice
 */

function StringTabRenderer(self,renderer) {
  this._super = self._super;
  var _super = this._super;
  if (_super.tabRenderer == null) {
    _super.tabRenderer = new TabRenderer(renderer);
  }
  if (_super.tabDrawer == null) {
    _super.tabDrawer = new TabDrawer(_super.tabRenderer);
    _super.tabRenderer.drawer = _super.tabDrawer;
  }
}

StringTabRenderer.prototype.render = function(tablature, semantics, voice) {
  var absChild;
  var thickBar = false;
  var _super = this._super;
  // draw starting vertical line
  tablature.verticalLine(tablature.startx, _super.topStaffY, tablature.bottomLine);
  var lastX = tablature.endx;

  for (ii = 0; ii < voice.children.length; ii++) {
    absChild = voice.children[ii];
    var scoreType;
    for (jj = 0; jj < absChild.children.length; jj++) {
      var relChild = absChild.children[jj];
      scoreType = relChild.parent.abcelem.el_type;
      switch (scoreType) {
        case 'clef':
          tablature.tab(relChild);
          break;
        case 'bar':
          tablature.bar(relChild);
          if (ii == voice.children.length - 1) {
            thickBar = isRepeat(absChild);
          }
          lastX = relChild.x;
          break;
      }
      if (scoreType == 'note') {
        var pitches = absChild.abcelem.pitches;
        var graceNotes = absChild.gracenotes;
        tabPos = semantics.strings.notesToNumber(pitches, graceNotes);
        _super.tabRenderer.numbers(absChild.x, tablature, tabPos, thickBar);
      }
    }
  }
  // draw ending vertical line
  tablature.verticalLine(lastX, _super.topStaffY, tablature.bottomLine,thickBar);

}

module.exports = StringTabRenderer;