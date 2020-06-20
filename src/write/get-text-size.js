var GetTextSize = function GetTextSize(getFontAndAttr, svg) {
	this.getFontAndAttr = getFontAndAttr;
	this.svg = svg;
};

GetTextSize.prototype.updateFonts = function(fontOverrides) {
	this.getFontAndAttr.updateFonts(fontOverrides);
};

GetTextSize.prototype.attr = function(type, klass) {
	return this.getFontAndAttr.calc(type, klass);
};

GetTextSize.prototype.calc = function(text, type, klass, el) {
	var hash = this.attr(type, klass);
	var size = this.svg.getTextSize(text, hash.attr, el);
	if (hash.font.box) {
		// Add padding and an equal margin to each side.
		return { height: size.height + hash.font.padding*4, width: size.width + hash.font.padding*4 };
	}
	return size;
};

module.exports = GetTextSize;
