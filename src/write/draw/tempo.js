var drawRelativeElement = require('./relative');
var renderText = require('./text');

function drawTempo(renderer, params) {
	var x = params.x;
	if (params.pitch === undefined)
		window.console.error("Tempo Element y-coordinate not set.");

	//var tempoGroup;
	params.tempo.el_type = "tempo";
	//	renderer.wrapInAbsElem(params.tempo, "abcjs-tempo", function () {
	//renderer.paper.openGroup({klass: renderer.controller.classes.generate("tempo wha")});
	// The text is aligned with extra room for descenders but numbers look like they are a little too high, so bump it a little.
	var descenderHeight = 2;
	var y = renderer.calcY(params.pitch) + 2;
	var text;
	var size;
	if (params.tempo.preString) {
		text = renderText(renderer, { x: x, y: y, text: params.tempo.preString, type: 'tempofont', klass: 'abcjs-tempo', anchor: "start", noClass: true, "dominant-baseline": "ideographic", name: "pre" }, true);
		size = renderer.controller.getTextSize.calc(params.tempo.preString, 'tempofont', 'tempo', text);
		var preWidth = size.width;
		var charWidth = preWidth / params.tempo.preString.length; // Just get some average number to increase the spacing.
		x += preWidth + charWidth;
	}
	if (params.note) {
		params.note.setX(x);
		for (var i = 0; i < params.note.children.length; i++)
			drawRelativeElement(renderer, params.note.children[i], x);
		x += (params.note.w + 5);
		var str = "= " + params.tempo.bpm;
		text = renderText(renderer, { x: x, y: y, text: str, type: 'tempofont', klass: 'abcjs-tempo', anchor: "start", noClass: true, name: "beats" });
		size = renderer.controller.getTextSize.calc(str, 'tempofont', 'tempo', text);
		var postWidth = size.width;
		var charWidth2 = postWidth / str.length; // Just get some average number to increase the spacing.
		x += postWidth + charWidth2;
	}
	if (params.tempo.postString) {
		renderText(renderer, { x: x, y: y, text: params.tempo.postString, type: 'tempofont', klass: 'abcjs-tempo', anchor: "start", noClass: true, name: "post" }, true);
	}
	//tempoGroup = renderer.paper.closeGroup();
	//	});
	//return [tempoGroup];
}

module.exports = drawTempo;
