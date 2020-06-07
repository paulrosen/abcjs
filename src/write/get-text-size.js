var GetTextSize = function GetTextSize(getFontAndAttr, svg) {
	this.getFontAndAttr = getFontAndAttr;
	this.svg = svg;
};

GetTextSize.prototype.calc = function(text, type, klass, el) {
	var hash = this.getFontAndAttr.calc(type, klass);
	var size = this.svg.getTextSize(text, hash.attr, el);
	if (hash.font.box) {
		return { height: size.height + 8, width: size.width + 8 };
	}
	return size;
};

module.exports = GetTextSize;
