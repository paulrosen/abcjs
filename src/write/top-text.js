function TopText(metaText, lines, width, isPrint, paddingLeft, spacing, getTextSize) {
	this.rows = [];

	if (metaText.header && isPrint) {
		// Note: whether there is a header or not doesn't change any other positioning, so this doesn't change the Y-coordinate.
		// This text goes above the margin, so we'll temporarily move up.
		var headerTextHeight = getTextSize.calc("XXXX", "headerfont", 'abcjs-header abcjs-meta-top').height;
		this.addTextIf(paddingLeft, metaText.header.left, 'headerfont', 'header meta-top', -headerTextHeight, 0, 'start', getTextSize);
		this.addTextIf(paddingLeft + width / 2, metaText.header.center, 'headerfont', 'header meta-top', -headerTextHeight, null, 'middle', getTextSize);
		this.addTextIf(paddingLeft + width, metaText.header.right, 'headerfont', 'header meta-top', -headerTextHeight, null, 'end', getTextSize);
	}
	if (isPrint)
		this.rows.push({move: spacing.top});
	if (metaText.title) {
		this.addTextIf(paddingLeft + width / 2, metaText.title, 'titlefont', 'title meta-top', spacing.title, 0, 'middle', getTextSize, "title");
	}
	if (lines[0] && lines[0].subtitle) {
		this.addTextIf(paddingLeft + width / 2, lines[0].subtitle, 'subtitlefont', 'text meta-top subtitle', spacing.subtitle, 0, 'middle', getTextSize, "subtitle");
	}

	if (metaText.rhythm || metaText.origin || metaText.composer) {
		this.rows.push({move: spacing.composer});
		if (metaText.rhythm && metaText.rhythm.length > 0) {
			var noMove = !!(metaText.composer || metaText.origin);
			this.addTextIf(paddingLeft, metaText.rhythm, 'infofont', 'meta-top rhythm', 0, null, "start", getTextSize, "rhythm", noMove);
		}
		var composerLine = "";
		if (metaText.composer) composerLine += metaText.composer;
		if (metaText.origin) composerLine += ' (' + metaText.origin + ')';
		if (composerLine.length > 0) {
			this.addTextIf(paddingLeft + width, composerLine, 'composerfont', 'meta-top composer', 0, null, "end", getTextSize, "composer");
		}
	}

	if (metaText.author && metaText.author.length > 0) {
		this.addTextIf(paddingLeft + width, metaText.author, 'composerfont', 'meta-top author', 0, 0, "end", getTextSize, "author");
	}

	if (metaText.partOrder && metaText.partOrder.length > 0) {
		this.addTextIf(paddingLeft, metaText.partOrder, 'partsfont', 'meta-top part-order', 0, 0, "start", getTextSize, "partOrder");
	}
}

TopText.prototype.addTextIf = function (marginLeft, text, font, klass, marginTop, marginBottom, anchor, getTextSize, absElemType, noMove) {
	if (!text)
		return;
	if (marginTop)
		this.rows.push({move: marginTop});
	this.rows.push({left: marginLeft, text: text, font: font, klass: klass, anchor: anchor, absElemType: absElemType});
	if (!noMove) {
		var size = getTextSize.calc(text, font, klass);
		this.rows.push({move: size.height});
		if (marginBottom)
			this.rows.push({move: marginBottom});
	}
}

module.exports = TopText;
