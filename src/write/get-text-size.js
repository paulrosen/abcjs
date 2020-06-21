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

GetTextSize.prototype.baselineToCenter = function(text, type, klass, index, total) {
	// This is for the case where SVG wants to use the baseline of the first line as the Y coordinate.
	// If there are multiple lines of text or there is an array of text then that will not be centered so this adjusts it.
	var height = this.calc(text, type, klass).height;
	var fontHeight = this.attr(type, klass).font.size;

	return height * 0.5 + (total - index - 2) * fontHeight;
};


module.exports = GetTextSize;
