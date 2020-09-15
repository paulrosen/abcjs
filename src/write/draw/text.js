function renderText(renderer, params) {
	var laneMargin = 1;
	var y = params.y;
	if (params.lane)
		y += (params.dim.font.size+laneMargin)*params.lane;

	var hash;
	if (params.dim) {
		hash = params.dim;
		hash.attr.class = params.klass;
	} else
		 hash = renderer.controller.getFontAndAttr.calc(params.type, params.klass);
	if (params.anchor)
		hash.attr["text-anchor"] = params.anchor;
	hash.attr.x = params.x;
	hash.attr.y = y;
	if (!params.centerVertically)
		hash.attr.y += hash.font.size;
	if (params.type === 'debugfont') {
		console.log("Debug msg: " + params.text);
		hash.attr.stroke = "#ff0000";
	}

	var text = params.text.replace(/\n\n/g, "\n \n");
	text = text.replace(/^\n/, "\xA0\n");

	if (hash.font.box) {
		renderer.paper.openGroup({klass: hash.attr['class'], fill: "#000000"});
		if (hash.attr["text-anchor"] === "end") {
			hash.attr.x -= hash.font.padding;
		} else if (hash.attr["text-anchor"] === "start") {
			hash.attr.x += hash.font.padding;
		}
		hash.attr.y += hash.font.padding;
		delete hash.attr['class'];
	}
	if (params.noClass)
		delete hash.attr['class'];
	var elem = renderer.paper.text(text, hash.attr);
	if (hash.font.box) {
		var size = elem.getBBox();

		var delta = 0;
		if (hash.attr["text-anchor"] === "middle") {
		 	delta = size.width / 2 + hash.font.padding;
		} else if (hash.attr["text-anchor"] === "end") {
			delta = size.width + hash.font.padding * 2;
		}
		var deltaY = 0;
		if (params.centerVertically) {
			deltaY = size.height - hash.font.padding;
		}
		renderer.paper.rect({ x: Math.round(params.x - delta), y: Math.round(y - deltaY), width: Math.round(size.width + hash.font.padding*2), height: Math.round(size.height + hash.font.padding*2)});
		elem = renderer.paper.closeGroup();
	}
	return elem;
}

module.exports = renderText;
