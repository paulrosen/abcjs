/**
 * Layout tablature informations for draw
 * @param {*} numLines
 * @param {*} lineSpace
 */

function StringTablature(this: any, numLines: any, lineSpace: any) {
  this.numLines = numLines;
  this.lineSpace = lineSpace;
  this.verticalSize = this.numLines * this.lineSpace;
  var pitch = 3;
  this.bar = {
    pitch: pitch,
    pitch2: lineSpace * numLines,
    height: 5
  };
}

/**
 * return true if current line should not produce a tab
 * @param {} line
 */
StringTablature.prototype.bypass = function (line: any) {
  var voices = line.staffGroup.voices;
  if (voices.length > 0) {
    if (voices[0].isPercussion) return true;
  }
  return false;
};

StringTablature.prototype.setRelative = function (child: any, relative: any, first: any) {
  switch (child.type) {
    case "bar":
      relative.pitch = this.bar.pitch;
      relative.pitch2 = this.bar.pitch2;
      relative.height = this.height;
      break;
    case "symbol":
      var top = this.bar.pitch2 / 2;
      if (child.name == "dots.dot") {
        if (first) {
          relative.pitch = top;
          return false;
        } else {
          relative.pitch = top + this.lineSpace;
          return true;
        }
      }
      break;
  }
  return first;
};

export default StringTablature;
