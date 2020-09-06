var renderText = require('./text');
var printStem = require('./print-stem');
var printStaffLine = require('./staff-line');
var printSymbol = require('./print-symbol');

function drawRelativeElement(renderer, params, bartop, selectables) {
	if (params.pitch === undefined)
		window.console.error(params.type + " Relative Element y-coordinate not set.");
	var y = renderer.calcY(params.pitch);
	switch(params.type) {
		case "symbol":
			if (params.c===null) return null;
			var klass = "symbol";
			if (params.klass) klass += " " + params.klass;
			params.graphelem = printSymbol(renderer, params.x, params.pitch, params.c, params.scalex, params.scaley, renderer.controller.classes.generate(klass), "none", "#000000"); break;
		case "debug":
			params.graphelem = renderText(renderer, { x: params.x, y: renderer.calcY(15), text: ""+params.c, type: "debugfont", klass: renderer.controller.classes.generate('debug-msg'), anchor: 'start', centerVertically: false, dim: params.dim}); break;
		case "barNumber":
			params.graphelem = renderText(renderer, { x: params.x, y: y, text: ""+params.c, type: "measurefont", klass: renderer.controller.classes.generate('bar-number'), anchor: "middle", dim: params.dim});
			break;
		case "lyric":
			params.graphelem = renderText(renderer, { x: params.x, y: y, text: params.c, type: "vocalfont", klass: renderer.controller.classes.generate('lyric'), anchor: "middle", dim: params.dim});
			break;
		case "chord":
			params.graphelem = renderText(renderer, { x: params.x, y: y, text: params.c, type: 'gchordfont', klass: renderer.controller.classes.generate("chord"), anchor: "middle", dim: params.dim, lane: params.getLane()});
			break;
		case "decoration":
			// The +6 is to compensate for the placement of text in svg: to be on the same row as symbols, the y-coord needs to compensate for the center line.
			params.graphelem = renderText(renderer, { x: params.x, y: y+6, text: params.c, type: 'annotationfont', klass: renderer.controller.classes.generate("annotation"), anchor: "middle", centerVertically: true, dim: params.dim});
			break;
		case "text":
			params.graphelem = renderText(renderer, { x: params.x, y: y, text: params.c, type: 'annotationfont', klass: renderer.controller.classes.generate("annotation"), anchor: "start", centerVertically: params.centerVertically, dim: params.dim, lane: params.getLane()});
			break;
		case "multimeasure-text":
			params.graphelem = renderText(renderer, { x: params.x+params.w/2, y: y, text: params.c, type: 'tempofont', klass: renderer.controller.classes.generate("rest"), anchor: "middle", centerVertically: false, dim: params.dim});
			break;
		case "part":
			params.graphelem = renderText(renderer, { x: params.x, y: y, text: params.c, type: 'partsfont', klass: renderer.controller.classes.generate("part"), anchor: "start", dim: params.dim});
			break;
		case "bar":
			params.graphelem = printStem(renderer, params.x, params.linewidth, y, (bartop)?bartop:renderer.calcY(params.pitch2)); break; // bartop can't be 0
		case "stem":
			params.graphelem = printStem(renderer, params.x, params.linewidth, y, renderer.calcY(params.pitch2)); break;
		case "ledger":
			params.graphelem = printStaffLine(renderer, params.x, params.x+params.w, params.pitch, renderer.controller.classes.generate("ledger")); break;
	}
	if (params.scalex!==1 && params.graphelem) {
		scaleExistingElem(renderer.paper, params.graphelem, params.scalex, params.scaley, params.x, y);
	}
	return params.graphelem;
}

function scaleExistingElem(paper, elem, scaleX, scaleY, x, y) {
	paper.setAttributeOnElement(elem, { style: "transform:scale("+scaleX+","+scaleY + ");transform-origin:" + x + "px " + y + "px;"});
}

module.exports = drawRelativeElement;
