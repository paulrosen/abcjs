const addTextIf = require("../add-text-if");

function TopText(metaText, metaTextInfo, formatting, lines, width, isPrint, paddingLeft, spacing, getTextSize) {
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
		addTextIf(this.rows, { marginLeft: tLeft, text: metaText.title, font: 'titlefont', klass: 'title meta-top', marginTop: spacing.title, anchor: tAnchor, absElemType: "title", info: metaTextInfo.title, name: "title" }, getTextSize);
	}
	if (lines.length) {
		var index = 0;
		while (index < lines.length && lines[index].subtitle) {
			addTextIf(this.rows, { marginLeft: tLeft, text: lines[index].subtitle.text, font: 'subtitlefont', klass: 'text meta-top subtitle', marginTop: spacing.subtitle, anchor: tAnchor, absElemType: "subtitle", info: lines[index].subtitle, name: "subtitle" }, getTextSize);
			index++;
		}
	}

	if (metaText.rhythm || metaText.origin || metaText.composer) {
		this.rows.push({ move: spacing.composer });
		if (metaText.rhythm && metaText.rhythm.length > 0) {
			var noMove = !!(metaText.composer || metaText.origin);
			addTextIf(this.rows, { marginLeft: paddingLeft, text: metaText.rhythm, font: 'infofont', klass: 'meta-top rhythm', absElemType: "rhythm", noMove: noMove, info: metaTextInfo.rhythm, name: "rhythm" }, getTextSize);
		}
		var composerLine = "";
		if (metaText.composer) composerLine += metaText.composer;
		if (metaText.origin) composerLine += ' (' + metaText.origin + ')';
		if (composerLine.length > 0) {
			addTextIf(this.rows, { marginLeft: paddingLeft + width, text: composerLine, font: 'composerfont', klass: 'meta-top composer', anchor: "end", absElemType: "composer", info: metaTextInfo.composer, name: "composer" }, getTextSize);
		}
	}

	if (metaText.author && metaText.author.length > 0) {
		addTextIf(this.rows, { marginLeft: paddingLeft + width, text: metaText.author, font: 'composerfont', klass: 'meta-top author', anchor: "end", absElemType: "author", info: metaTextInfo.author, name: "author" }, getTextSize);
	}

	if (metaText.partOrder && metaText.partOrder.length > 0) {
		addTextIf(this.rows, { marginLeft: paddingLeft, text: metaText.partOrder, font: 'partsfont', klass: 'meta-top part-order', absElemType: "partOrder", info: metaTextInfo.partOrder, name: "part-order" }, getTextSize);
	}
}

module.exports = TopText;
