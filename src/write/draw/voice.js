var drawCrescendo = require('./crescendo');
var drawDynamics = require('./dynamics');
var drawTriplet = require('./triplet');
var drawEnding = require('./ending');
var drawTie = require('./tie');
var drawTempo = require('./tempo');
var drawBeam = require('./beam');
var renderText = require('./text');
var drawAbsolute = require('./absolute');
var parseCommon = require('../../parse/abc_common');

var crescendoElem = require('../abc_crescendo_element');
var dynamicDecorationElem = require('../abc_dynamic_decoration');
var tripletElem = require('../abc_triplet_element');
var endingElem = require('../abc_ending_element');
var tieElem = require('../abc_tie_element');
var tempoElem = require('../abc_tempo_element');

function drawVoice(renderer, params, bartop) {
	var width = params.w-1;
	renderer.staffbottom = params.staff.bottom;

	if (params.header) { // print voice name
		var textpitch = 14 - (params.voicenumber+1)*(12/(params.voicetotal+1));
		renderer.wrapInAbsElem({ el_type: "voiceName", startChar: -1, endChar: -1, text: params.header }, 'meta-bottom extra-text', function() {
			var textEl = renderText(renderer, {x: renderer.padding.left, y: renderer.calcY(textpitch), text: params.header, type: 'voicefont', klass: 'staff-extra voice-name', anchor: 'start'});
			return textEl;
		});
	}

	for (var i=0, ii=params.children.length; i<ii; i++) {
		var child = params.children[i];
		var justInitializedMeasureNumber = false;
		if (child.type !== 'staff-extra' && !renderer.controller.classes.isInMeasure()) {
			renderer.controller.classes.startMeasure();
			justInitializedMeasureNumber = true;
		}
		renderer.controller.currentAbsEl = child;
		switch (child.constructor) {
			case tempoElem:
				child.elemset = drawTempo(renderer, child);
				break;
			default:
				drawAbsolute(renderer, child,(params.barto || i === ii - 1) ? bartop : 0);
		}
		if (child.type === 'note' || isNonSpacerRest(child))
			renderer.controller.classes.incrNote();
		if (child.type === 'bar' && !justInitializedMeasureNumber) {
			renderer.controller.classes.incrMeasure();
		}
	}

	renderer.controller.classes.startMeasure();
	parseCommon.each(params.beams, function(beam) {
		if (beam === 'bar') {
			renderer.controller.classes.incrMeasure();
		} else
			drawBeam(renderer, beam); // beams must be drawn first for proper printing of triplets, slurs and ties.
	});

	renderer.controller.classes.startMeasure();
	parseCommon.each(params.otherchildren, function(child) {
		if (child === 'bar') {
			renderer.controller.classes.incrMeasure();
		} else {
			switch (child.constructor) {
				case crescendoElem:
					child.elemset = drawCrescendo(renderer, child);
					break;
				case dynamicDecorationElem:
					child.elemset = drawDynamics(renderer, child);
					break;
				case tripletElem:
					drawTriplet(renderer, child);
					break;
				case endingElem:
					child.elemset = drawEnding(renderer, child, params.startx + 10, width);
					break;
				case tieElem:
					child.elemset = drawTie(renderer, child, params.startx + 10, width);
					break;
				default:
					console.log(child)
					drawAbsolute(renderer, child, params.startx + 10, width);
			}
		}
	});

}

function isNonSpacerRest(elem) {
	if (elem.type !== 'rest')
		return false;
	if (elem.abcelem && elem.abcelem.rest && elem.abcelem.rest.type !== 'spacer')
		return true;
	return false;
}

module.exports = drawVoice;
