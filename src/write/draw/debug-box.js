function printDebugBox(renderer, x, y, width, height, color, opacity, comment) {
	var box = renderer.paper.rect({ x: x, y: y, width: width, height: height, fill: color, stroke: color, "fill-opacity": opacity, "stroke-opacity": opacity });
	if (comment)
		renderer.paper.text(comment, {x: 0, y: y+7, "text-anchor": "start", "font-size":"14px", fill: "rgba(0,0,255,.4)", stroke: "rgba(0,0,255,.4)" });
	return box;
}

module.exports = printDebugBox;
