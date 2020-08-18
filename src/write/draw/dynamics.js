import printSymbol from './print-symbol';

function drawDynamics(renderer, params, selectables) {
	if (params.pitch === undefined)
		window.console.error("Dynamic Element y-coordinate not set.");
	var scalex = 1;
	var scaley = 1;
	var el = printSymbol(renderer, params.anchor.x, params.pitch, params.dec, scalex, scaley, renderer.controller.classes.generate('decoration'));
	selectables.wrapSvgEl({el_type: "dynamicDecoration", startChar: -1, endChar: -1, decoration: params.dec}, el);
	return [el];
}

export default drawDynamics;
