function Subtitle(spaceAbove, text, center, getTextSize) {
	this.rows = [];
	if (spaceAbove)
		this.rows.push({move: spaceAbove});
	this.rows.push({left: center, text: text, font: 'subtitlefont', klass: 'text subtitle', anchor: "middle"});
	var size = getTextSize.calc(text, 'subtitlefont', 'text subtitle');
	this.rows.push({move: size.height});
}

module.exports = Subtitle;
