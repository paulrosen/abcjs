function Subtitle(spaceAbove, formatting, text, center, paddingLeft, getTextSize) {
	this.rows = [];
	if (spaceAbove)
		this.rows.push({move: spaceAbove});
	var tAnchor = formatting.titleleft ? 'start' : 'middle';
	var tLeft = formatting.titleleft ? paddingLeft : center;
	this.rows.push({left: tLeft, text: text, font: 'subtitlefont', klass: 'text subtitle', anchor: tAnchor});
	var size = getTextSize.calc(text, 'subtitlefont', 'text subtitle');
	this.rows.push({move: size.height});
}

module.exports = Subtitle;
