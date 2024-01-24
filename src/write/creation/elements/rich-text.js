function richText(rows, str, defFont, klass, name, paddingLeft, attr, getTextSize) {
	var space = getTextSize.calc("i", defFont, klass);
	if (str === '') {
		rows.push({ move: space.height });
	// else if (typeof str === 'string') {
	// 	var marginTop = - space.height/2 // TODO-PER: Don't know why it wants to print this low
	// 	addTextIf(rows, { marginLeft: paddingLeft, text: str, font: defFont, klass: klass, inGroup: attr.inGroup, name: name, marginTop: marginTop, anchor: attr.anchor, absElemType: attr.absElemType, info: attr.info }, getTextSize);
	// 	rows.push({ move: space.height/2 });
	} else {
		if (typeof str === 'string') {
			str = [{text: str}]
		}
		var largestY = 0;
		var gap = 0;
		//var offsetX = 0;
		var row = {
			klass: klass,
			left: paddingLeft,
			anchor: attr.anchor,
			phrases: []
		}
		rows.push(row)
		for (var k = 0; k < str.length; k++) {
			var thisWord = str[k];
			var font = (thisWord.font) ? thisWord.font : getTextSize.attr(defFont, klass).font;
			var phrase = {
				content: thisWord.text,
			}
			if (font)
				phrase.attrs = {
					"font-family": getTextSize.getFamily(font.face),
					"font-size": font.size,
					"font-weight": font.weight,
					"font-style": font.style,
					"font-decoration": font.decoration,
			}
			//if (thisWord.text) {
				row.phrases.push(phrase);
				var size = getTextSize.calc(thisWord.text, font, klass);
				largestY = Math.max(largestY, size.height);
				//offsetX += size.width;
				// If the phrase ends in a space, then that is not counted in the width, so we need to add that in ourselves.
				if (thisWord.text[thisWord.text.length - 1] === ' ') {
					//offsetX += space.width;
					gap = space.width
				}
			// } else {
			// 	rows.push({ move: space.height });
			//}
		}
		rows.push({ move: largestY });
	}
}

module.exports = richText;
