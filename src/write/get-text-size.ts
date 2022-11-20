var GetTextSize = function GetTextSize(this: any, getFontAndAttr: any, svg: any) {
  this.getFontAndAttr = getFontAndAttr;
  this.svg = svg;
};

GetTextSize.prototype.updateFonts = function (fontOverrides: any) {
  this.getFontAndAttr.updateFonts(fontOverrides);
};

GetTextSize.prototype.attr = function (type: any, klass: any) {
  return this.getFontAndAttr.calc(type, klass);
};

GetTextSize.prototype.calc = function (text: any, type: any, klass: any, el: any) {
  var hash;
  // This can be passed in either a string or a font. If it is a string it names one of the standard fonts.
  if (typeof type === "string") hash = this.attr(type, klass);
  else {
    hash = {
      font: {
        face: type.face,
        size: type.size,
        decoration: type.decoration,
        style: type.style,
        weight: type.weight
      },
      attr: {
        "font-size": type.size,
        "font-style": type.style,
        "font-family": type.face,
        "font-weight": type.weight,
        "text-decoration": type.decoration,
        class: this.getFontAndAttr.classes.generate(klass)
      }
    };
  }
  var size = this.svg.getTextSize(text, hash.attr, el);
  if (hash.font.box) {
    // Add padding and an equal margin to each side.
    return {
      height: size.height + hash.font.padding * 4,
      width: size.width + hash.font.padding * 4
    };
  }
  return size;
};

GetTextSize.prototype.baselineToCenter = function (
  text: any,
  type: any,
  klass: any,
  index: any,
  total: any
) {
  // This is for the case where SVG wants to use the baseline of the first line as the Y coordinate.
  // If there are multiple lines of text or there is an array of text then that will not be centered so this adjusts it.
  var height = this.calc(text, type, klass).height;
  var fontHeight = this.attr(type, klass).font.size;

  return height * 0.5 + (total - index - 2) * fontHeight;
};

export default GetTextSize;
