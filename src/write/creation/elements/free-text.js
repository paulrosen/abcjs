function FreeText(info, vskip, getFontAndAttr, paddingLeft, width, getTextSize) {
	var text = info.text;
	this.rows = [];
	var size;
	if (vskip)
		this.rows.push({ move: vskip });
	var hash = getFontAndAttr.calc('textfont', 'defined-text');
	if (text === "") {	// we do want to print out blank lines if they have been specified.
		this.rows.push({ move: hash.attr['font-size'] * 2 }); // move the distance of the line, plus the distance of the margin, which is also one line.
	} else if (typeof text === 'string') {
		this.rows.push({ move: hash.attr['font-size'] / 2 }); // TODO-PER: move down some - the y location should be the top of the text, but we output text specifying the center line.
		this.rows.push({ left: paddingLeft, text: text, font: 'textfont', klass: 'defined-text', anchor: "start", startChar: info.startChar, endChar: info.endChar, absElemType: "freeText", name: "free-text" });
		size = getTextSize.calc(text, 'textfont', 'defined-text');
		this.rows.push({ move: size.height });
	} else if (text) {
		var maxHeight = 0;
		var leftSide = paddingLeft;
		var currentFont = 'textfont';
		for (var i = 0; i < text.length; i++) {
			if (text[i].font) {
				currentFont = text[i].font;
			} else
				currentFont = 'textfont';
			this.rows.push({ left: leftSide, text: text[i].text, font: currentFont, klass: 'defined-text', anchor: 'start', startChar: info.startChar, endChar: info.endChar, absElemType: "freeText", name: "free-text" });
			size = getTextSize.calc(text[i].text, getFontAndAttr.calc(currentFont, 'defined-text').font, 'defined-text');
			leftSide += size.width + size.height / 2; // add a little padding to the right side. The height of the font is probably a close enough approximation.
			maxHeight = Math.max(maxHeight, size.height)
		}
		this.rows.push({ move: maxHeight });
	} else {
		// The structure is wrong here: it requires an array to do centering, but it shouldn't have.
		if (info.length === 1) {
			var x = width / 2;
			this.rows.push({ left: x, text: info[0].text, font: 'textfont', klass: 'defined-text', anchor: 'middle', startChar: info.startChar, endChar: info.endChar, absElemType: "freeText", name: "free-text" });
			size = getTextSize.calc(info[0].text, 'textfont', 'defined-text');
			this.rows.push({ move: size.height });
		}
	}
}

module.exports = FreeText;
