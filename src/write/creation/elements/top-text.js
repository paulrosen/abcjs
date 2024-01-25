const addTextIf = require("../add-text-if");
const richText = require("./rich-text");

function TopText(metaText, metaTextInfo, formatting, lines, width, isPrint, paddingLeft, spacing, shouldAddClasses, getTextSize) {
	this.rows = [];

	if (metaText.header && isPrint) {
		// Note: whether there is a header or not doesn't change any other positioning, so this doesn't change the Y-coordinate.
		// This text goes above the margin, so we'll temporarily move up.
		var headerTextHeight = getTextSize.calc("X", "headerfont", 'abcjs-header abcjs-meta-top').height;
		addTextIf(this.rows, { marginLeft: paddingLeft, text: metaText.header.left, font: 'headerfont', klass: 'header meta-top', marginTop: -headerTextHeight, info: metaTextInfo.header, name: "header" }, getTextSize);
		addTextIf(this.rows, { marginLeft: paddingLeft + width / 2, text: metaText.header.center, font: 'headerfont', klass: 'header meta-top', marginTop: -headerTextHeight, anchor: 'middle', info: metaTextInfo.header, name: "header" }, getTextSize);
		addTextIf(this.rows, { marginLeft: paddingLeft + width, text: metaText.header.right, font: 'headerfont', klass: 'header meta-top', marginTop: -headerTextHeight, anchor: 'end', info: metaTextInfo.header, name: "header" }, getTextSize);

		//		TopText.prototype.addTextIf = function (marginLeft, text, font, klass, marginTop, marginBottom, anchor, getTextSize, absElemType, noMove) {
	}
	if (isPrint)
		this.rows.push({ move: spacing.top });
	var tAnchor = formatting.titleleft ? 'start' : 'middle';
	var tLeft = formatting.titleleft ? paddingLeft : paddingLeft + width / 2;
	if (metaText.title) {
		var klass = shouldAddClasses ? 'abcjs-title' : ''
		richText(this.rows, metaText.title, "titlefont", klass, 'title', tLeft, {marginTop: spacing.title, anchor: tAnchor, absElemType: "title", info: metaTextInfo.title},  getTextSize)
	}
	if (lines.length) {
		var index = 0;
		while (index < lines.length && lines[index].subtitle) {
			var klass = shouldAddClasses ? 'abcjs-text abcjs-subtitle' : ''
			richText(this.rows, lines[index].subtitle.text, "subtitlefont", klass, 'subtitle', tLeft, {marginTop: spacing.subtitle, anchor: tAnchor, absElemType: "subtitle", info: lines[index].subtitle},  getTextSize)
			index++;
		}
	}

	if (metaText.rhythm || metaText.origin || metaText.composer) {
		this.rows.push({ move: spacing.composer });
		if (metaText.rhythm && metaText.rhythm.length > 0) {
			var noMove = !!(metaText.composer || metaText.origin);
			var klass = shouldAddClasses ? 'abcjs-rhythm' : ''
			addTextIf(this.rows, { marginLeft: paddingLeft, text: metaText.rhythm, font: 'infofont', klass: klass, absElemType: "rhythm", noMove: noMove, info: metaTextInfo.rhythm, name: "rhythm" }, getTextSize);
		}
		var hasSimpleComposerLine = true
		if (metaText.composer && typeof metaText.composer !== 'string')
			hasSimpleComposerLine = false
		if (metaText.origin && typeof metaText.origin !== 'string')
			hasSimpleComposerLine = false
			
		var composerLine = metaText.composer ? metaText.composer : '';
		if (metaText.origin) {
			if (typeof composerLine === 'string' && typeof metaText.origin === 'string')
				composerLine += ' (' + metaText.origin + ')';
			else if (typeof composerLine === 'string' && typeof metaText.origin !== 'string') {
				composerLine = [{text:composerLine}]
				composerLine.push({text:" ("})
				composerLine = composerLine.concat(metaText.origin)
				composerLine.push({text:")"})
			} else {
				composerLine.push({text:" ("})
				composerLine = composerLine.concat(metaText.origin)
				composerLine.push({text:")"})
			}
		}
		if (composerLine) {
			var klass = shouldAddClasses ? 'abcjs-composer' : ''
			richText(this.rows, composerLine, 'composerfont', klass, "composer", paddingLeft+width, {anchor: "end", absElemType: "composer", info: metaTextInfo.composer, ingroup: true}, getTextSize)
		}
	}

	if (metaText.author && metaText.author.length > 0) {
		var klass = shouldAddClasses ? 'abcjs-author' : ''
		richText(this.rows, metaText.author, 'composerfont', klass, "author", paddingLeft+width, {anchor: "end", absElemType: "author", info: metaTextInfo.author}, getTextSize)
	}

	if (metaText.partOrder && metaText.partOrder.length > 0) {
		var klass = shouldAddClasses ? 'abcjs-part-order' : ''
		richText(this.rows, metaText.partOrder, 'partsfont', klass, "part-order", paddingLeft, {absElemType: "partOrder", info: metaTextInfo.partOrder, anchor: 'start'}, getTextSize)

	}
}

module.exports = TopText;
