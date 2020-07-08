function FreeText(text, vskip, getFontAndAttr, paddingLeft, width, getTextSize) {
	this.rows = [];
	var size;
	if (vskip)
		this.rows.push({move: vskip});
	var hash = getFontAndAttr.calc('textfont', 'defined-text');
	if (text === "") {	// we do want to print out blank lines if they have been specified.
		this.rows.push({move: hash.attr['font-size'] * 2}); // move the distance of the line, plus the distance of the margin, which is also one line.
	} else if (typeof text === 'string') {
		this.rows.push({move: hash.attr['font-size']/2}); // TODO-PER: move down some - the y location should be the top of the text, but we output text specifying the center line.
		this.rows.push({left: paddingLeft, text: text, font: 'textfont', klass: 'defined-text', anchor: "start", absElemType: "freeText"});
		size = getTextSize.calc(text, 'textfont', 'defined-text');
		this.rows.push({move: size.height});
	} else {
		var currentFont = 'textfont';
		var isCentered = false; // The structure is wrong here: it requires an array to do centering, but it shouldn't have.
		for (var i = 0; i < text.length; i++) {
			if (text[i].font)
				currentFont = text[i].font;
			else
				currentFont = 'textfont';
			if (text[i].center)
				isCentered = true;
			var alignment = isCentered ? 'middle' : 'start';
			var x = isCentered ? width / 2 : paddingLeft;
			this.rows.push({left: x, text: text[i].text, font: currentFont, klass: 'defined-text', anchor: "start", absElemType: "freeText"});
			size = getTextSize.calc(text[i].text, currentFont, 'defined-text');
			this.rows.push({move: size.height});
		}
	}
}

module.exports = FreeText;
