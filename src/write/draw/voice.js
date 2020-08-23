var drawCrescendo = require('./crescendo');
var drawDynamics = require('./dynamics');
var drawTriplet = require('./triplet');
var drawEnding = require('./ending');
var drawTie = require('./tie');
var drawBeam = require('./beam');
var renderText = require('./text');
var drawAbsolute = require('./absolute');

function drawVoice(renderer, params, bartop, selectables) {
	var width = params.w-1;
	renderer.staffbottom = params.staff.bottom;

	if (params.header) { // print voice name
		var textEl = renderText(renderer, {x: renderer.padding.left, y: renderer.calcY(params.headerPosition), text: params.header, type: 'voicefont', klass: 'staff-extra voice-name', anchor: 'start', centerVertically: true});
		selectables.wrapSvgEl({ el_type: "voiceName", startChar: -1, endChar: -1, text: params.header }, textEl);
	}

	var i;
	var child;
	for (i=0; i < params.children.length; i++) {
		child = params.children[i];
		var justInitializedMeasureNumber = false;
		if (child.type !== 'staff-extra' && !renderer.controller.classes.isInMeasure()) {
			renderer.controller.classes.startMeasure();
			justInitializedMeasureNumber = true;
		}
		switch (child.type) {
			// case "tempo":
			// 	child.elemset = drawTempo(renderer, child, selectables);
			// 	break;
			default:
				drawAbsolute(renderer, child,(params.barto || i === params.children.length - 1) ? bartop : 0, selectables);
		}
		if (child.type === 'note' || isNonSpacerRest(child))
			renderer.controller.classes.incrNote();
		if (child.type === 'bar' && !justInitializedMeasureNumber) {
			renderer.controller.classes.incrMeasure();
		}
	}

	renderer.controller.classes.startMeasure();

	for (i = 0; i < params.beams.length; i++) {
		var beam = params.beams[i];
		if (beam === 'bar') {
			renderer.controller.classes.incrMeasure();
		} else
			drawBeam(renderer, beam, selectables); // beams must be drawn first for proper printing of triplets, slurs and ties.
	}

	renderer.controller.classes.startMeasure();
	for (i = 0; i < params.otherchildren.length; i++) {
		child = params.otherchildren[i];
		if (child === 'bar') {
			renderer.controller.classes.incrMeasure();
		} else {
			switch (child.type) {
				case "CrescendoElem":
					child.elemset = drawCrescendo(renderer, child, selectables);
					break;
				case "DynamicDecoration":
					child.elemset = drawDynamics(renderer, child, selectables);
					break;
				case "TripletElem":
					drawTriplet(renderer, child, selectables);
					break;
				case "EndingElem":
					child.elemset = drawEnding(renderer, child, params.startx + 10, width, selectables);
					break;
				case "TieElem":
					child.elemset = drawTie(renderer, child, params.startx + 10, width, selectables);
					break;
				default:
					console.log(child)
					drawAbsolute(renderer, child, params.startx + 10, width, selectables);
			}
		}
	}

}

function isNonSpacerRest(elem) {
	if (elem.type !== 'rest')
		return false;
	if (elem.abcelem && elem.abcelem.rest && elem.abcelem.rest.type !== 'spacer')
		return true;
	return false;
}

module.exports = drawVoice;
