var renderText = require('./text');
var glyphs = require('../creation/glyphs');
var elementGroup = require('./group-elements');

/**
 * assumes this.y is set appropriately
 * if symbol is a multichar string without a . (as in scripts.staccato) 1 symbol per char is assumed
 * not scaled if not in printgroup
 */
function printSymbol(renderer, x, offset, symbol, options) {
	// TODO-PER: what happened to scalex, and scaley? That might have been a bug introduced in refactoring
	var el;
	var ycorr;
	if (!symbol) return null;
	if (symbol.length > 1 && symbol.indexOf(".") < 0) {
		var groupClass = elementGroup.isInGroup() ? '' : options.klass // If this is already in a group then don't repeat the classes for the sub-group)
		renderer.paper.openGroup({ "data-name": options.name, klass: groupClass });
		var dx = 0;
		for (var i = 0; i < symbol.length; i++) {
			var s = symbol[i];
			ycorr = glyphs.getYCorr(s);
			el = glyphs.printSymbol(x + dx, renderer.calcY(offset + ycorr), s, renderer.paper, { stroke: options.stroke, fill: options.fill });
			if (el) {
				if (i < symbol.length - 1)
					dx += kernSymbols(s, symbol[i + 1], glyphs.getSymbolWidth(s));
			} else {
				renderText(renderer, { x: x, y: renderer.y, text: "no symbol:" + symbol, type: "debugfont", klass: 'debug-msg', anchor: 'start' }, false);
			}
		}
		var g = renderer.paper.closeGroup();
		return g;
	} else {
		ycorr = glyphs.getYCorr(symbol);
		if (elementGroup.isInGroup()) {
			el = glyphs.printSymbol(x, renderer.calcY(offset + ycorr), symbol, renderer.paper, { "data-name": options.name });
		} else {
			el = glyphs.printSymbol(x, renderer.calcY(offset + ycorr), symbol, renderer.paper, { klass: options.klass, stroke: options.stroke, fill: options.fill, "data-name": options.name });
		}
		if (el) {
			return el;
		}
		renderText(renderer, { x: x, y: renderer.y, text: "no symbol:" + symbol, type: "debugfont", klass: 'debug-msg', anchor: 'start' }, false);
		return null;
	}
}

function kernSymbols(lastSymbol, thisSymbol, lastSymbolWidth) {
	// This is just some adjustments to make it look better.
	var width = lastSymbolWidth;
	if (lastSymbol === 'f' && thisSymbol === 'f')
		width = width * 2 / 3;
	if (lastSymbol === 'p' && thisSymbol === 'p')
		width = width * 5 / 6;
	if (lastSymbol === 'f' && thisSymbol === 'z')
		width = width * 5 / 8;
	return width;
}

module.exports = printSymbol;
