function BottomText(metaText, width, isPrint, paddingLeft, spacing, getTextSize) {
	this.rows = [];
	if (metaText.unalignedWords && metaText.unalignedWords.length > 0)
		this.unalignedWords(metaText.unalignedWords, paddingLeft, spacing, getTextSize);
	this.extraText(metaText, paddingLeft, spacing, getTextSize);
	if (metaText.footer && isPrint)
		this.footer(metaText.footer, paddingLeft, getTextSize);
}

BottomText.prototype.unalignedWords = function (unalignedWords, paddingLeft, spacing, getTextSize) {
	var indent = 50;
	var klass = 'meta-bottom unaligned-words';
	var defFont = 'wordsfont';
	this.rows.push({startGroup: "unalignedWords", klass: 'abcjs-meta-bottom abcjs-unaligned-words'});
	var space = getTextSize.calc("i", defFont, klass);

	this.rows.push({move: spacing.words});

	for (var j = 0; j < unalignedWords.length; j++) {
		if (unalignedWords[j] === '')
			this.rows.push({move: space.height});
		else if (typeof unalignedWords[j] === 'string') {
			this.addTextIf(paddingLeft + indent, unalignedWords[j], defFont, klass, 0, 0, "start", getTextSize, null, true);
		} else {
			var largestY = 0;
			var offsetX = 0;
			for (var k = 0; k < unalignedWords[j].length; k++) {
				var thisWord = unalignedWords[j][k];
				var font = (thisWord.font) ? thisWord.font : defFont;
				this.rows.push({
					left: paddingLeft + indent + offsetX,
					text: thisWord.text,
					font: font,
					anchor: 'start'
				});
				var size = getTextSize.calc(thisWord.text, defFont, klass);
				largestY = Math.max(largestY, size.height);
				offsetX += size.width;
				// If the phrase ends in a space, then that is not counted in the width, so we need to add that in ourselves.
				if (thisWord.text[thisWord.text.length - 1] === ' ') {
					offsetX += space.width;
				}
			}
			this.rows.push({move: largestY});
		}
	}
	this.rows.push({move: space.height * 2});
	this.rows.push({endGroup: "unalignedWords", absElemType: "unalignedWords"});
}

BottomText.prototype.extraText = function (metaText, marginLeft, spacing, getTextSize) {
	var extraText = "";
	if (metaText.book) extraText += "Book: " + metaText.book + "\n";
	if (metaText.source) extraText += "Source: " + metaText.source + "\n";
	if (metaText.discography) extraText += "Discography: " + metaText.discography + "\n";
	if (metaText.notes) extraText += "Notes: " + metaText.notes + "\n";
	if (metaText.transcription) extraText += "Transcription: " + metaText.transcription + "\n";
	if (metaText.history) extraText += "History: " + metaText.history + "\n";
	if (metaText['abc-copyright']) extraText += "Copyright: " + metaText['abc-copyright'] + "\n";
	if (metaText['abc-creator']) extraText += "Creator: " + metaText['abc-creator'] + "\n";
	if (metaText['abc-edited-by']) extraText += "Edited By: " + metaText['abc-edited-by'] + "\n";
	if (extraText.length > 0) {
			this.addTextIf(marginLeft, extraText, 'historyfont', 'meta-bottom extra-text', spacing.info, 0, "start", getTextSize, "extraText");
	}
}

BottomText.prototype.footer = function (footer, marginLeft, getTextSize) {
	var klass = 'header meta-bottom';
	var font = "footerfont";
	this.rows.push({startGroup: "footer", klass: klass});
	// Note: whether there is a footer or not doesn't change any other positioning, so this doesn't change the Y-coordinate.
	this.addTextIf(paddingLeft, footer.left, font, klass, 0, 0, 'start', getTextSize);
	this.addTextIf(paddingLeft + width / 2, footer.center, font, klass, 0, 0, 'middle', getTextSize);
	this.addTextIf(paddingLeft + width, footer.right, font, klass, 0, 0, 'end', getTextSize);
}

BottomText.prototype.addTextIf = function (marginLeft, text, font, klass, marginTop, marginBottom, anchor, getTextSize, absElemType, inGroup) {
	if (!text)
		return;
	if (marginTop)
		this.rows.push({move: marginTop});
	var attr = {left: marginLeft, text: text, font: font, anchor: anchor};
	if (absElemType)
		attr.absElemType = absElemType;
	if (!inGroup) {
		attr.klass = klass;
	}
	this.rows.push(attr);
	var size = getTextSize.calc(text, font, klass);
	this.rows.push({move: size.height});
	if (marginBottom)
		this.rows.push({move: marginBottom});
}

module.exports = BottomText;
