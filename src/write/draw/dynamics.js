var printSymbol = require('./print-symbol');

function drawDynamics(renderer, params) {
	if (params.pitch === undefined)
		window.console.error("Dynamic Element y-coordinate not set.");
	var scalex = 1;
	var scaley = 1;
	var ret = renderer.wrapInAbsElem({el_type: "dynamicDecoration", startChar: -1, endChar: -1, decoration: this.dec}, 'abcjs-decoration', function () {
		var el = printSymbol(renderer, params.anchor.x, params.pitch, params.dec, scalex, scaley, renderer.controller.classes.generate('decoration'));
		return el;
	});
	return [ret];
}

module.exports = drawDynamics;
