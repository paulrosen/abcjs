const addTextIf = require("../add-text-if");

function BottomText(metaText, width, isPrint, paddingLeft, spacing, getTextSize) {
	this.rows = [];
	if (metaText.unalignedWords && metaText.unalignedWords.length > 0)
		this.unalignedWords(metaText.unalignedWords, paddingLeft, spacing, getTextSize);
	this.extraText(metaText, paddingLeft, spacing, getTextSize);
	if (metaText.footer && isPrint)
		this.footer(metaText.footer, width, paddingLeft, getTextSize);
}

BottomText.prototype.unalignedWords = function (unalignedWords, paddingLeft, spacing, getTextSize) {
	var klass = 'meta-bottom unaligned-words';
	var defFont = 'wordsfont';
	this.rows.push({ startGroup: "unalignedWords", klass: 'abcjs-meta-bottom abcjs-unaligned-words', name: "words" });
	var space = getTextSize.calc("i", defFont, klass);

	this.rows.push({ move: spacing.words });

	for (var j = 0; j < unalignedWords.length; j++) {
		if (unalignedWords[j] === '')
			this.rows.push({ move: space.height });
		else if (typeof unalignedWords[j] === 'string') {
			addTextIf(this.rows, { marginLeft: paddingLeft, text: unalignedWords[j], font: defFont, klass: klass, inGroup: true, name: "words" }, getTextSize);
		} else {
			var largestY = 0;
			var offsetX = 0;
			for (var k = 0; k < unalignedWords[j].length; k++) {
				var thisWord = unalignedWords[j][k];
				var font = (thisWord.font) ? thisWord.font : defFont;
				this.rows.push({
					left: paddingLeft + offsetX,
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
			this.rows.push({ move: largestY });
		}
	}
	this.rows.push({ move: space.height * 2 });
	this.rows.push({ endGroup: "unalignedWords", absElemType: "unalignedWords", startChar: -1, endChar: -1, name: "unalignedWords" });
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
		addTextIf(this.rows, { marginLeft: marginLeft, text: extraText, font: 'historyfont', klass: 'meta-bottom extra-text', marginTop: spacing.info, absElemType: "extraText", name: "description" }, getTextSize);
	}
}

BottomText.prototype.footer = function (footer, width, paddingLeft, getTextSize) {
	var klass = 'header meta-bottom';
	var font = "footerfont";
	this.rows.push({ startGroup: "footer", klass: klass });
	// Note: whether there is a footer or not doesn't change any other positioning, so this doesn't change the Y-coordinate.
	addTextIf(this.rows, { marginLeft: paddingLeft, text: footer.left, font: font, klass: klass, name: "footer" }, getTextSize);
	addTextIf(this.rows, { marginLeft: paddingLeft + width / 2, text: footer.center, font: font, klass: klass, anchor: 'middle', name: "footer" }, getTextSize);
	addTextIf(this.rows, { marginLeft: paddingLeft + width, text: footer.right, font: font, klass: klass, anchor: 'end', name: "footer" }, getTextSize);
}

module.exports = BottomText;
