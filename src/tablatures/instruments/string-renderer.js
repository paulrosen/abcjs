var TabRenderer = require('../tab-renderer');
var TabDrawer = require('../tab-drawer');

/**
 * render tablature for string voice
 * @param {*} tablature 
 * @param {*} voice 
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
  var _super = this._super;
  // draw starting vertical line
  tablature.verticalLine(tablature.startx, _super.topStaffY, tablature.bottomLine);

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
          break;
      }
      if (scoreType == 'note') {
        var pitches = absChild.abcelem.pitches;
        var graceNotes = absChild.gracenotes;
        tabPos = semantics.strings.notesToNumber(pitches, graceNotes);
        _super.tabRenderer.numbers(absChild.x, tablature, tabPos);
      }
    }
  }
  // draw ending vertical line
  tablature.verticalLine(tablature.endx, _super.topStaffY, tablature.bottomLine);

}

module.exports = StringTabRenderer;