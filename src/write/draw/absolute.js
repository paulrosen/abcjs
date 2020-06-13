var drawTempo = require('./tempo');
var drawRelativeElement = require('./relative');
var spacing = require('../abc_spacing');
var setClass = require('../set-class');
var elementGroup = require('./group-elements');

function drawAbsolute(renderer, params, bartop) {
	if (params.invisible) return;
	params.elemset = [];
	elementGroup.beginGroup(renderer.paper, renderer.controller);
	for (var i=0; i<params.children.length; i++) {
		var child = params.children[i];
		var el;
		switch (child.constructor.name) {
			case 'TempoElement':
				el = drawTempo(renderer, child);
				if (el)
					params.elemset = params.elemset.concat(el);
				break;
			default:
				el = drawRelativeElement(renderer, child, bartop);
				if (el)
					params.elemset.push(el);
		}
	}
	var klass = params.type;
	if (params.type === 'note' || params.type === 'rest') {
		klass += ' d' + Math.round(params.durationClass*1000)/1000;
		klass = klass.replace(/\./g, '-');
		if (params.abcelem.pitches) {
			for (var j = 0; j < params.abcelem.pitches.length; j++) {
				klass += ' p' + params.abcelem.pitches[j].pitch;
			}
		}
	}
	var g = elementGroup.endGroup(klass);
	if (g)
		params.elemset.push(g);
	if (klass === "tempo" && params.children.length > 0) {
		renderer.controller.currentAbsEl.elemset[0] = params.elemset[0];
		// Combine any tempo elements that are in a row. TODO-PER: this is a hack because the tempo note is an AbsoluteElement so there are nested AbsoluteElements here.
		params.children[0].adjustElements(renderer);
	}
	if (params.klass)
		setClass(params.elemset, "mark", "", "#00ff00");
	if (params.hint)
		setClass(params.elemset, "abcjs-hint", "", null);
	params.abcelem.abselem = params;

	var step = spacing.STEP;
}

module.exports = drawAbsolute;
