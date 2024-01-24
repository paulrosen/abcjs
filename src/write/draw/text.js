var roundNumber = require("./round-number");

function renderText(renderer, params, alreadyInGroup) {
	var y = params.y;

	// TODO-PER: Probably need to merge the regular text and rich text better. At the least, rich text loses the font box.
	if (params.phrases) {
		//richTextLine = function (phrases, x, y, klass, anchor, target)
		var elem = renderer.paper.richTextLine(params.phrases, params.x, params.y, params.klass, params.anchor);
		return elem;
	}

	if (params.lane) {
		var laneMargin = params.dim.font.size * 0.25;
		y += (params.dim.font.size + laneMargin) * params.lane;
	}

	var hash;
	if (params.dim) {
		hash = params.dim;
		hash.attr.class = params.klass;
	} else
		hash = renderer.controller.getFontAndAttr.calc(params.type, params.klass);
	if (params.anchor)
		hash.attr["text-anchor"] = params.anchor;
	if (params['dominant-baseline'])
		hash.attr["dominant-baseline"] = params['dominant-baseline'];
	hash.attr.x = params.x;
	hash.attr.y = y;
	if (!params.centerVertically)
		hash.attr.y += hash.font.size;
	if (params.type === 'debugfont') {
		console.log("Debug msg: " + params.text);
		hash.attr.stroke = "#ff0000";
	}
	if (params.cursor) {
		hash.attr.cursor = params.cursor;
	}

	var text = params.text.replace(/\n\n/g, "\n \n");
	text = text.replace(/^\n/, "\xA0\n");

	if (hash.font.box) {
		if (!alreadyInGroup)
			renderer.paper.openGroup({ klass: hash.attr['class'], fill: renderer.foregroundColor, "data-name": params.name });
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
	hash.attr.x = roundNumber(hash.attr.x);
	hash.attr.y = roundNumber(hash.attr.y);
	if (params.name)
		hash.attr["data-name"] = params.name;
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
		renderer.paper.rect({ "data-name": "box", x: Math.round(params.x - delta), y: Math.round(y - deltaY), width: Math.round(size.width + hash.font.padding * 2), height: Math.round(size.height + hash.font.padding * 2) });
		if (!alreadyInGroup)
			elem = renderer.paper.closeGroup();
	}
	return elem;
}

module.exports = renderText;
