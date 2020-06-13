function renderText(renderer, params) {
	var hash = renderer.controller.getFontAndAttr.calc(params.type, params.klass);
	if (params.anchor)
		hash.attr["text-anchor"] = params.anchor;
	hash.attr.x = params.x;
	hash.attr.y = params.y + 7; // TODO-PER: Not sure why the text appears to be 7 pixels off.
	if (!params.centerVertically)
		hash.attr.dy = "0.5em";
	if (params.type === 'debugfont') {
		console.log("Debug msg: " + params.text);
		hash.attr.stroke = "#ff0000";
	}

	var text = params.text.replace(/\n\n/g, "\n \n");
	text = text.replace(/^\n/, "\xA0\n");

	var klass2 = hash.attr['class'];
	if (hash.font.box) {
		hash.attr.x += 2;
		hash.attr.y += 4;
		delete hash.attr['class'];
		renderer.createElemSet({klass: klass2, fill: "#000000"});
	}
	if (params.noClass)
		delete hash.attr['class'];
	var el = renderer.paper.text(text, hash.attr);
	var elem = el;

	if (hash.font.box) {
		var size = renderer.controller.getTextSize.calc(text, params.type, params.klass); // This size already has the box factored in, so the needs to be taken into consideration.
		var padding = 2;
		renderer.paper.rect({ x: params.x - padding, y: params.y, width: size.width - padding, height: size.height - 8});
		elem = renderer.closeElemSet();
	}
	if (!params.history)
		renderer.controller.recordHistory(elem);
	else if (params.history === 'not-selectable')
		renderer.controller.recordHistory(elem, true);
	if (renderer.doRegression) renderer.addToRegression(el);
	return elem;
}

module.exports = renderText;
