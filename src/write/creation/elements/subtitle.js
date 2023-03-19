function Subtitle(spaceAbove, formatting, info, center, paddingLeft, getTextSize) {
	this.rows = [];
	if (spaceAbove)
		this.rows.push({ move: spaceAbove });
	var tAnchor = formatting.titleleft ? 'start' : 'middle';
	var tLeft = formatting.titleleft ? paddingLeft : center;
	this.rows.push({ left: tLeft, text: info.text, font: 'subtitlefont', klass: 'text subtitle', anchor: tAnchor, startChar: info.startChar, endChar: info.endChar, absElemType: "subtitle", name: "subtitle" });
	var size = getTextSize.calc(info.text, 'subtitlefont', 'text subtitle');
	this.rows.push({ move: size.height });
}

module.exports = Subtitle;
