function printDebugBox(renderer, attr, comment) {
	var box = renderer.paper.rectBeneath(attr);
	if (comment)
		renderer.paper.text(comment, { x: 0, y: attr.y + 7, "text-anchor": "start", "font-size": "14px", fill: "rgba(0,0,255,.4)", stroke: "rgba(0,0,255,.4)" });
	return box;
}

module.exports = printDebugBox;
