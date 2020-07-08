function renderText(renderer, params) {
	var hash;
	if (params.dim) {
		hash = params.dim;
		hash.attr.class = params.klass;
	} else
		 hash = renderer.controller.getFontAndAttr.calc(params.type, params.klass);
	if (params.anchor)
		hash.attr["text-anchor"] = params.anchor;
	hash.attr.x = params.x;
	hash.attr.y = params.y;
	if (!params.centerVertically)
		hash.attr.y += hash.font.size - (hash.font.box ? hash.font.padding : 0);
	if (params.type === 'debugfont') {
		console.log("Debug msg: " + params.text);
		hash.attr.stroke = "#ff0000";
	}

	var text = params.text.replace(/\n\n/g, "\n \n");
	text = text.replace(/^\n/, "\xA0\n");

	if (hash.font.box) {
		renderer.paper.openGroup({klass: hash.attr['class'], fill: "#000000"});
		hash.attr.x += hash.font.padding*2;
		hash.attr.y += hash.font.padding*2;
		delete hash.attr['class'];
	}
	if (params.noClass)
		delete hash.attr['class'];
	var elem = renderer.paper.text(text, hash.attr);
	if (hash.font.box) {
		var size = elem.getBBox(); // renderer.controller.getTextSize.calc(text, params.type, params.klass); // This size already has the box factored in, so that needs to be taken into consideration.
		// var padding = 2;
		var delta = 0;
		if (hash.attr["text-anchor"] === "middle") {
		 	delta = size.width / 2;
		}
		renderer.paper.rect({ x: params.x + hash.font.padding - delta, y: params.y + hash.font.padding, width: size.width + hash.font.padding*2, height: size.height + hash.font.padding*2});
		elem = renderer.paper.closeGroup();
	}
	return elem;
}

module.exports = renderText;
