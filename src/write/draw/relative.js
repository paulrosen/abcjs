var renderText = require('./text');
var printStem = require('./print-stem');
var printStaffLine = require('./staff-line');
var printSymbol = require('./print-symbol');

function drawRelativeElement(renderer, params, bartop) {
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
			params.graphelem = renderText(renderer, { x: params.x, y: renderer.calcY(15), text: ""+params.c, type: "debugfont", klass: 'debug-msg', anchor: 'start', centerVertically: false, history: 'not-selectable'}); break;
		case "barNumber":
			params.graphelem = renderText(renderer, { x: params.x, y: y, text: ""+params.c, type: "measurefont", klass: 'bar-number', anchor: "middle", history: 'ignore'});
			break;
		case "lyric":
			params.graphelem = renderText(renderer, { x: params.x, y: y, text: params.c, type: "vocalfont", klass: 'lyric', anchor: "middle"});
			break;
		case "chord":
			params.graphelem = renderText(renderer, { x: params.x, y: y, text: params.c, type: 'gchordfont', klass: "chord", anchor: "middle"});
			break;
		case "decoration":
			params.graphelem = renderText(renderer, { x: params.x, y: y, text: params.c, type: 'annotationfont', klass: "annotation", anchor: "middle", centerVertically: true});
			break;
		case "text":
			params.graphelem = renderText(renderer, { x: params.x, y: y, text: params.c, type: 'annotationfont', klass: "annotation", anchor: "start", centerVertically: params.centerVertically});
			break;
		case "multimeasure-text":
			params.graphelem = renderText(renderer, { x: params.x+params.w/2, y: y, text: params.c, type: 'tempofont', klass: "rest", anchor: "middle", centerVertically: false});
			break;
		case "part":
			params.graphelem = renderText(renderer, { x: params.x, y: y, text: params.c, type: 'partsfont', klass: "part", anchor: "start"});
			break;
		case "bar":
			params.graphelem = printStem(renderer, params.x, params.linewidth, y, (bartop)?bartop:renderer.calcY(params.pitch2)); break; // bartop can't be 0
		case "stem":
			params.graphelem = printStem(renderer, params.x, params.linewidth, y, renderer.calcY(params.pitch2)); break;
		case "ledger":
			params.graphelem = printStaffLine(renderer, params.x, params.x+params.w, params.pitch, renderer.controller.classes.generate("ledger")); break;
	}
	if (params.scalex!==1 && params.graphelem) {
		renderer.scaleExistingElem(params.graphelem, params.scalex, params.scaley, params.x, y);
	}
	return params.graphelem;
}

module.exports = drawRelativeElement;
