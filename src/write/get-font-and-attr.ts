var GetFontAndAttr = function GetFontAndAttr(this: any, formatting: any, classes: any) {
  this.formatting = formatting;
  this.classes = classes;
};

GetFontAndAttr.prototype.updateFonts = function (fontOverrides: any) {
  if (fontOverrides.gchordfont)
    this.formatting.gchordfont = fontOverrides.gchordfont;
  if (fontOverrides.tripletfont)
    this.formatting.tripletfont = fontOverrides.tripletfont;
  if (fontOverrides.annotationfont)
    this.formatting.annotationfont = fontOverrides.annotationfont;
  if (fontOverrides.vocalfont)
    this.formatting.vocalfont = fontOverrides.vocalfont;
};

GetFontAndAttr.prototype.calc = function (type: any, klass: any) {
  var font;
  if (typeof type === "string") {
    font = this.formatting[type];
    // Raphael deliberately changes the font units to pixels for some reason, so we need to change points to pixels here.
    if (font)
      font = {
        face: font.face,
        size: Math.round((font.size * 4) / 3),
        decoration: font.decoration,
        style: font.style,
        weight: font.weight,
        box: font.box
      };
    else
      font = {
        face: "Arial",
        size: Math.round((12 * 4) / 3),
        decoration: "underline",
        style: "normal",
        weight: "normal"
      };
  } else
    font = {
      face: type.face,
      size: Math.round((type.size * 4) / 3),
      decoration: type.decoration,
      style: type.style,
      weight: type.weight,
      box: type.box
    };
  var paddingPercent = this.formatting.fontboxpadding
    ? this.formatting.fontboxpadding
    : 0.1;
  // @ts-expect-error TS(2339): Property 'padding' does not exist on type '{ face:... Remove this comment to see the full error message
  font.padding = font.size * paddingPercent;

  var attr = {
    "font-size": font.size,
    "font-style": font.style,
    "font-family": font.face,
    "font-weight": font.weight,
    "text-decoration": font.decoration,
    class: this.classes.generate(klass)
  };
  return { font: font, attr: attr };
};

export default GetFontAndAttr;
