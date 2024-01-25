const addTextIf = require("../add-text-if");
const richText = require("./rich-text");

function BottomText(metaText, width, isPrint, paddingLeft, spacing, shouldAddClasses, getTextSize) {
	this.rows = [];
	if (metaText.unalignedWords && metaText.unalignedWords.length > 0)
		this.unalignedWords(metaText.unalignedWords, paddingLeft, spacing, shouldAddClasses, getTextSize);
	this.extraText(metaText, paddingLeft, spacing, shouldAddClasses, getTextSize);
	if (metaText.footer && isPrint)
		this.footer(metaText.footer, width, paddingLeft, getTextSize);
}

BottomText.prototype.unalignedWords = function (unalignedWords, marginLeft, spacing, shouldAddClasses, getTextSize) {
	var klass = shouldAddClasses ? 'abcjs-unaligned-words' : ''
	var defFont = 'wordsfont';
	var space = getTextSize.calc("i", defFont, klass);
	
	this.rows.push({ move: spacing.words });
	
	addMultiLine(this.rows, '', unalignedWords, marginLeft, defFont, "unalignedWords", "unalignedWords", klass, "unalignedWords", spacing, shouldAddClasses, getTextSize)
	this.rows.push({ move: space.height });
}

function addSingleLine(rows, preface, text, marginLeft, klass, shouldAddClasses, getTextSize) {
	if (text) {
		if (preface) {
			if (typeof text === 'string')
				text = preface + text
			else
				text = [{text: preface}].concat(text)
		}
		klass = shouldAddClasses ? 'abcjs-extra-text '+klass : ''
		richText(rows, text, 'historyfont', klass, "description", marginLeft, {absElemType: "extraText", anchor: 'start'}, getTextSize)
	}

}

function addMultiLine(rows, preface, content, marginLeft, defFont, absElemType, groupName, klass, name, spacing, shouldAddClasses, getTextSize) {
	if (content) {
		klass = shouldAddClasses ? 'abcjs-extra-text '+klass : ''
		var size = getTextSize.calc("A", defFont, klass);
		if (typeof content === 'string') {
			if (preface)
				content = preface + "\n" + content
			addTextIf(rows, { marginLeft: marginLeft, text: content, font: defFont, absElemType: "extraText", name: name, 'dominant-baseline': 'middle', klass: klass }, getTextSize);
			//rows.push({move: size.height*3/4})
		} else {
			rows.push({ startGroup: groupName, klass: klass, name: name });
			rows.push({move: spacing.info})
			if (preface) {
				addTextIf(rows, { marginLeft: marginLeft, text: preface, font: defFont, absElemType: "extraText", name: name, 'dominant-baseline': 'middle' }, getTextSize);
				rows.push({move: size.height*3/4})
			}

			for (var j = 0; j < content.length; j++) {
				richText(rows, content[j], defFont, '', name, marginLeft, {anchor: 'start'}, getTextSize)
				// TODO-PER: Hack! the string and rich lines should have used up the same amount of space without this.
				if (j < content.length-1 && typeof content[j] === 'string' && typeof content[j+1] !== 'string')
					rows.push({move: size.height*3/4})
			}
			rows.push({ endGroup: groupName, absElemType: absElemType, startChar: -1, endChar: -1, name: name });
			rows.push({move: size.height})
		}
	}
}
BottomText.prototype.extraText = function (metaText, marginLeft, spacing, shouldAddClasses, getTextSize) {
	addSingleLine(this.rows, "Book: ", metaText.book, marginLeft, 'abcjs-book', shouldAddClasses, getTextSize)
	addSingleLine(this.rows, "Source: ", metaText.source, marginLeft, 'abcjs-source', shouldAddClasses, getTextSize)
	addSingleLine(this.rows, "Discography: ", metaText.discography, marginLeft, 'abcjs-discography', shouldAddClasses, getTextSize)

	addMultiLine(this.rows, 'Notes:', metaText.notes, marginLeft, 'historyfont', "extraText", "notes", 'abcjs-notes', "description", spacing, shouldAddClasses, getTextSize)

	addSingleLine(this.rows, "Transcription: ", metaText.transcription, marginLeft, 'abcjs-transcription', shouldAddClasses, getTextSize)

	addMultiLine(this.rows, "History:", metaText.history, marginLeft, 'historyfont', "extraText", "history", 'abcjs-history', "description", spacing, shouldAddClasses, getTextSize)

	addSingleLine(this.rows, "Copyright: ", metaText['abc-copyright'], marginLeft, 'abcjs-copyright', shouldAddClasses, getTextSize)
	addSingleLine(this.rows, "Creator: ", metaText['abc-creator'], marginLeft, 'abcjs-creator', shouldAddClasses, getTextSize)
	addSingleLine(this.rows, "Edited By: ", metaText['abc-edited-by'], marginLeft, 'abcjs-edited-by', shouldAddClasses, getTextSize)

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
