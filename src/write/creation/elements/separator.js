function Separator(spaceAbove, lineLength, spaceBelow) {
	this.rows = [];
	if (spaceAbove)
		this.rows.push({ move: spaceAbove });
	this.rows.push({ separator: lineLength, absElemType: "separator" });
	if (spaceBelow)
		this.rows.push({ move: spaceBelow });
}

module.exports = Separator;
