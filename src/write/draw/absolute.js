var drawTempo = require('./tempo');
var drawRelativeElement = require('./relative');
var spacing = require('../abc_spacing');
var setClass = require('../set-class');
var elementGroup = require('./group-elements');

function drawAbsolute(renderer, params, bartop, selectables, staffPos) {
	if (params.invisible) return;
	var isTempo = params.children.length > 0 && params.children[0].type === "TempoElement";
	params.elemset = [];
	elementGroup.beginGroup(renderer.paper, renderer.controller);
	for (var i=0; i<params.children.length; i++) {
		var child = params.children[i];
		switch (child.type) {
			case "TempoElement":
				drawTempo(renderer, child);
				break;
			default:
				drawRelativeElement(renderer, child, bartop);
		}
	}
	var klass = params.type;
	if (params.type === 'note' || params.type === 'rest') {
		params.counters = renderer.controller.classes.getCurrent();
		klass += ' d' + Math.round(params.durationClass*1000)/1000;
		klass = klass.replace(/\./g, '-');
		if (params.abcelem.pitches) {
			for (var j = 0; j < params.abcelem.pitches.length; j++) {
				klass += ' p' + params.abcelem.pitches[j].pitch;
			}
		}
	}
	var g = elementGroup.endGroup(klass, params.type);
	if (g) {
		if (isTempo) {
			params.startChar = params.abcelem.startChar;
			params.endChar = params.abcelem.endChar;
			selectables.add(params, g, false, staffPos);
		} else {
			params.elemset.push(g);
			var isSelectable = false;
			if (params.type === 'note' || params.type === 'tabNumber') {
				isSelectable = true;
			}
			selectables.add(params, g, isSelectable, staffPos);
		}
	} else if (params.elemset.length > 0)
		selectables.add(params, params.elemset[0], params.type === 'note', staffPos);
	// If there was no output, then don't add to the selectables. This happens when using the "y" spacer, for instance.

	if (params.klass)
		setClass(params.elemset, "mark", "", "#00ff00");
	if (params.hint)
		setClass(params.elemset, "abcjs-hint", "", null);
	params.abcelem.abselem = params;

	if (params.heads && params.heads.length > 0) {
		params.notePositions = [];
		for (var jj = 0; jj < params.heads.length; jj++) {
			params.notePositions.push({
				x: params.heads[jj].x + params.heads[jj].w/2,
				y: staffPos.zero - params.heads[jj].pitch * spacing.STEP
			});
		}
	}
}

module.exports = drawAbsolute;
