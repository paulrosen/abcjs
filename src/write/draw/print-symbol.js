var renderText = require('./text');
var glyphs = require('../abc_glyphs');
var elementGroup = require('./group-elements');

/**
 * assumes this.y is set appropriately
 * if symbol is a multichar string without a . (as in scripts.staccato) 1 symbol per char is assumed
 * not scaled if not in printgroup
 */
function printSymbol(renderer, x, offset, symbol, scalex, scaley, klass) {
	var el;
	var ycorr;
	if (!symbol) return null;
	if (symbol.length > 1 && symbol.indexOf(".") < 0) {
		renderer.paper.openGroup({klass: klass});
		var dx = 0;
		for (var i = 0; i < symbol.length; i++) {
			var s = symbol.charAt(i);
			ycorr = glyphs.getYCorr(s);
			el = glyphs.printSymbol(x + dx, renderer.calcY(offset + ycorr), s, renderer.paper, '', "", "");
			if (el) {
				if (i < symbol.length - 1)
					dx += kernSymbols(s, symbol.charAt(i + 1), glyphs.getSymbolWidth(s));
			} else {
				renderText(renderer, { x: x, y: renderer.y, text: "no symbol:" + symbol, type: "debugfont", klass: 'debug-msg', anchor: 'start'});
			}
		}
		var g = renderer.paper.closeGroup();
		return g;
	} else {
		ycorr = glyphs.getYCorr(symbol);
		if (elementGroup.isInGroup()) {
			elementGroup.addPath(glyphs.getPathForSymbol(x, renderer.calcY(offset + ycorr), symbol, scalex, scaley));
		} else {
			el = glyphs.printSymbol(x, renderer.calcY(offset + ycorr), symbol, renderer.paper, klass, "none", "#000000");
			if (el) {
				return el;
			} else
				renderText(renderer, { x: x, y: renderer.y, text: "no symbol:" + symbol, type: "debugfont", klass: 'debug-msg', anchor: 'start'});
		}
		return null;
	}
}

function kernSymbols(lastSymbol, thisSymbol, lastSymbolWidth) {
	// This is just some adjustments to make it look better.
	var width = lastSymbolWidth;
	if (lastSymbol === 'f' && thisSymbol === 'f')
		width = width*2/3;
	if (lastSymbol === 'p' && thisSymbol === 'p')
		width = width*5/6;
	if (lastSymbol === 'f' && thisSymbol === 'z')
		width = width*5/8;
	return width;
}

module.exports = printSymbol;
