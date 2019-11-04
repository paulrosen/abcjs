//    abc_engraver_controller.js: Controls the engraving process of an ABCJS abstract syntax tree as produced by ABCJS/parse
//    Copyright (C) 2014-2018 Gregory Dyke (gregdyke at gmail dot com)
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


/*global Math */

var spacing = require('./abc_spacing');
var AbstractEngraver = require('./abc_abstract_engraver');
var Renderer = require('./abc_renderer');

/**
 * @class
 * Controls the engraving process, from ABCJS Abstract Syntax Tree (ABCJS AST) to rendered score sheet
 *
 * Call engraveABC to run the process. This creates a graphelems ABCJS Abstract Engraving Structure (ABCJS AES) that can be accessed through this.staffgroups
 * this data structure is first laid out (giving the graphelems x and y coordinates) and then drawn onto the renderer
 * each ABCJS AES represents a single staffgroup - all elements that are not in a staffgroup are rendered directly by the controller
 *
 * elements in ABCJS AES know their "source data" in the ABCJS AST, and their "target shape"
 * in the renderer for highlighting purposes
 *
 * @param {Object} paper div element that will wrap the SVG
 * @param {Object} params all the params -- documented on github //TODO-GD move some of that documentation here
 */
var EngraverController = function(paper, params) {
  params = params || {};
  this.responsive = params.responsive;
  this.space = 3*spacing.SPACE;
  this.scale = params.scale ? parseFloat(params.scale) : 0;
  if (!(this.scale > 0.1))
  	this.scale = undefined;

	if (params.staffwidth) {
		// Note: Normally all measurements to the engraver are in POINTS. However, if a person is formatting for the
		// screen and directly inputting the width, then it is more logical to have the measurement in pixels.
		this.staffwidthScreen = params.staffwidth;
		this.staffwidthPrint = params.staffwidth;
	} else {
		this.staffwidthScreen = 740; // TODO-PER: Not sure where this number comes from, but this is how it's always been.
		this.staffwidthPrint = 680; // The number of pixels in 8.5", after 1cm of margin has been removed.
	}
  this.editable = params.editable || false;
	this.listeners = [];
	if (params.clickListener)
		this.addSelectListener(params.clickListener);

  this.renderer=new Renderer(paper, params.regression, params.add_classes);
	this.renderer.setPaddingOverride(params);
  this.renderer.controller = this; // TODO-GD needed for highlighting

	this.reset();
};

EngraverController.prototype.reset = function() {
	this.selected = [];
	this.ingroup = false;
	this.staffgroups = [];
	this.lastStaffGroupIndex = -1;
	if (this.engraver)
		this.engraver.reset();
	this.engraver = null;
	this.renderer.reset();
};

/**
 * run the engraving process
 * @param {ABCJS.Tune|ABCJS.Tune[]} abctunes
 */
EngraverController.prototype.engraveABC = function(abctunes, tuneNumber) {
  if (abctunes[0]===undefined) {
    abctunes = [abctunes];
  }
	this.reset();

  for (var i = 0; i < abctunes.length; i++) {
  	if (tuneNumber === undefined)
  		tuneNumber = i;
    this.engraveTune(abctunes[i], tuneNumber);
  }
	if (this.renderer.doRegression)
		return this.renderer.regressionLines.join("\n");
};

/**
 * Some of the items on the page are not scaled, so adjust them in the opposite direction of scaling to cancel out the scaling.
 * @param {float} scale
 */
EngraverController.prototype.adjustNonScaledItems = function (scale) {
	this.width /= scale;
	this.renderer.adjustNonScaledItems(scale);
};

EngraverController.prototype.getMeasureWidths = function(abcTune) {
	this.reset();

	this.renderer.lineNumber = null;

	this.renderer.newTune(abcTune);
	this.engraver = new AbstractEngraver(this.renderer, 0, { bagpipes: abcTune.formatting.bagpipes, flatbeams: abcTune.formatting.flatbeams });
	this.engraver.setStemHeight(this.renderer.spacing.stemHeight);
	if (abcTune.formatting.staffwidth) {
		this.width = abcTune.formatting.staffwidth * 1.33; // The width is expressed in pt; convert to px.
	} else {
		this.width = this.renderer.isPrint ? this.staffwidthPrint : this.staffwidthScreen;
	}

	var scale = abcTune.formatting.scale ? abcTune.formatting.scale : this.scale;
	if (this.responsive === "resize") // The resizing will mess with the scaling, so just don't do it explicitly.
		scale = undefined;
	if (scale === undefined) scale = this.renderer.isPrint ? 0.75 : 1;
	this.adjustNonScaledItems(scale);

	var ret = { left: 0, measureWidths: [], height: 0, total: 0 };
	// TODO-PER: need to add the height of the title block, too.
	ret.height = this.renderer.padding.top + this.renderer.spacing.music + this.renderer.padding.bottom + 24; // the 24 is the empirical value added to the bottom of all tunes.
	var debug = false;
	var hasPrintedTempo = false;
	for(var i=0; i<abcTune.lines.length; i++) {
		var abcLine = abcTune.lines[i];
		if (abcLine.staff) {
			abcLine.staffGroup = this.engraver.createABCLine(abcLine.staff, !hasPrintedTempo ? abcTune.metaText.tempo: null);

			abcLine.staffGroup.layout(0, this.renderer, debug);
			// At this point, the voices are laid out so that the bar lines are even with each other. So we just need to get the placement of the first voice.
			if (abcLine.staffGroup.voices.length > 0) {
				var voice = abcLine.staffGroup.voices[0];
				var foundNotStaffExtra = false;
				var lastXPosition = 0;
				for (var k = 0; k < voice.children.length; k++) {
					var child = voice.children[k];
					if (!foundNotStaffExtra && !child.isClef && !child.isKeySig) {
						foundNotStaffExtra = true;
						ret.left = child.x;
						lastXPosition = child.x;
					}
					if (child.type === 'bar') {
						ret.measureWidths.push(child.x - lastXPosition);
						ret.total += (child.x - lastXPosition);
						lastXPosition = child.x;
					}
				}
			}
			hasPrintedTempo = true;
			ret.height += abcLine.staffGroup.calcHeight() * spacing.STEP;
		}
	}
	return ret;
};

/**
 * Run the engraving process on a single tune
 * @param {ABCJS.Tune} abctune
 */
EngraverController.prototype.engraveTune = function (abctune, tuneNumber) {
	this.renderer.lineNumber = null;

	this.renderer.newTune(abctune);
	this.engraver = new AbstractEngraver(this.renderer, tuneNumber, { bagpipes: abctune.formatting.bagpipes, flatbeams: abctune.formatting.flatbeams });
	this.engraver.setStemHeight(this.renderer.spacing.stemHeight);
	this.engraver.measureLength = abctune.getMeterFraction().num/abctune.getMeterFraction().den;
	if (abctune.formatting.staffwidth) {
		this.width = abctune.formatting.staffwidth * 1.33; // The width is expressed in pt; convert to px.
	} else {
		this.width = this.renderer.isPrint ? this.staffwidthPrint : this.staffwidthScreen;
	}

	var scale = abctune.formatting.scale ? abctune.formatting.scale : this.scale;
	if (this.responsive === "resize") // The resizing will mess with the scaling, so just don't do it explicitly.
		scale = undefined;
	if (scale === undefined) scale = this.renderer.isPrint ? 0.75 : 1;
	this.adjustNonScaledItems(scale);

	// Generate the raw staff line data
	var i;
	var abcLine;
	var hasPrintedTempo = false;
	for(i=0; i<abctune.lines.length; i++) {
		abcLine = abctune.lines[i];
		if (abcLine.staff) {
			abcLine.staffGroup = this.engraver.createABCLine(abcLine.staff, !hasPrintedTempo ? abctune.metaText.tempo: null);
			hasPrintedTempo = true;
		}
	}

	// Adjust the x-coordinates to their absolute positions
	var maxWidth = this.width;
	for(i=0; i<abctune.lines.length; i++) {
		abcLine = abctune.lines[i];
		if (abcLine.staff) {
			this.setXSpacing(abcLine.staffGroup, abctune.formatting, i === abctune.lines.length - 1, false);
			if (abcLine.staffGroup.w > maxWidth) maxWidth = abcLine.staffGroup.w;
		}
	}

	// Layout the beams and add the stems to the beamed notes.
	for(i=0; i<abctune.lines.length; i++) {
		abcLine = abctune.lines[i];
		if (abcLine.staffGroup && abcLine.staffGroup.voices) {
			for (var j = 0; j < abcLine.staffGroup.voices.length; j++)
				abcLine.staffGroup.voices[j].layoutBeams();
			abcLine.staffGroup.setUpperAndLowerElements(this.renderer);
		}
	}

	// Set the staff spacing
	// TODO-PER: we should have been able to do this by the time we called setUpperAndLowerElements, but for some reason the "bottom" element seems to be set as a side effect of setting the X spacing.
	for(i=0; i<abctune.lines.length; i++) {
		abcLine = abctune.lines[i];
		if (abcLine.staffGroup) {
			abcLine.staffGroup.height = abcLine.staffGroup.calcHeight();
		}
	}

	// Do all the writing to output
	this.renderer.topMargin(abctune);
	//this.renderer.printHorizontalLine(this.width + this.renderer.padding.left + this.renderer.padding.right);
	this.renderer.engraveTopText(this.width, abctune);
	this.renderer.addMusicPadding();

	this.staffgroups = [];
	this.lastStaffGroupIndex = -1;
	for (var line = 0; line < abctune.lines.length; line++) {
		this.renderer.lineNumber = line;
		abcLine = abctune.lines[line];
		if (abcLine.staff) {
			this.engraveStaffLine(abcLine.staffGroup);
		} else if (abcLine.subtitle && line !== 0) {
			this.renderer.outputSubtitle(this.width, abcLine.subtitle);
		} else if (abcLine.text !== undefined) {
			this.renderer.outputFreeText(abcLine.text, abcLine.vskip);
		} else if (abcLine.separator !== undefined) {
			this.renderer.outputSeparator(abcLine.separator);
		}
	}

	this.renderer.moveY(24); // TODO-PER: Empirically discovered. What variable should this be?
	this.renderer.engraveExtraText(this.width, abctune);
	this.renderer.setPaperSize(maxWidth, scale, this.responsive);
};

function calcHorizontalSpacing(isLastLine, stretchLast, targetWidth, lineWidth, spacing, spacingUnits, minSpace) {
	// TODO-PER: This used to stretch the first line when it is the only line, but I'm not sure why. abcm2ps doesn't do that
	if (isLastLine && lineWidth / targetWidth < 0.66 && !stretchLast) return null; // don't stretch last line too much
	if (Math.abs(targetWidth-lineWidth) < 2) return null; // if we are already near the target width, we're done.
	var relSpace = spacingUnits * spacing;
	var constSpace = lineWidth - relSpace;
	if (spacingUnits > 0) {
		spacing = (targetWidth - constSpace) / spacingUnits;
		if (spacing * minSpace > 50) {
			spacing = 50 / minSpace;
		}
		return spacing;
	}
	return null;
}

/**
 * Do the x-axis positioning for a single line (a group of related staffs)
 * @param {ABCJS.Tune} abctune an ABCJS AST
 * @param {Object} staffGroup an staffGroup
 * @param {Object} formatting an formatting
 * @param {boolean} isLastLine is this the last line to be printed?
 * @private
 */
EngraverController.prototype.setXSpacing = function (staffGroup, formatting, isLastLine, debug) {
   var newspace = this.space;
  for (var it = 0; it < 8; it++) { // TODO-PER: shouldn't need multiple passes, but each pass gets it closer to the right spacing. (Only affects long lines: normal lines break out of this loop quickly.)
	  var ret = staffGroup.layout(newspace, this.renderer, debug);
	  var stretchLast = formatting.stretchlast ? formatting.stretchlast : false;
		newspace = calcHorizontalSpacing(isLastLine, stretchLast, this.width+this.renderer.padding.left, staffGroup.w, newspace, ret.spacingUnits, ret.minSpace);
		if (debug)
			console.log("setXSpace", it, staffGroup.w, newspace, staffGroup.minspace);
		if (newspace === null) break;
  }
	centerWholeRests(staffGroup.voices);
	//this.renderer.printHorizontalLine(this.width);
};

/**
 * Engrave a single line (a group of related staffs)
 * @param {ABCJS.Tune} abctune an ABCJS AST
 * @param {Object} staffGroup an staffGroup
 * @private
 */
EngraverController.prototype.engraveStaffLine = function (staffGroup) {
	if (this.lastStaffGroupIndex > -1)
		this.renderer.addStaffPadding(this.staffgroups[this.lastStaffGroupIndex], staffGroup);
	this.renderer.voiceNumber = null;
	staffGroup.draw(this.renderer);
	var height = staffGroup.height * spacing.STEP;
	//this.renderer.printVerticalLine(this.width+this.renderer.padding.left, this.renderer.y, this.renderer.y+height);
  this.staffgroups[this.staffgroups.length] = staffGroup;
	this.lastStaffGroupIndex = this.staffgroups.length-1;
	this.renderer.y += height;
};

/**
 * Called by the Abstract Engraving Structure or any other (e.g. midi playback) to say it was selected (notehead clicked on)
 * @protected
 */
EngraverController.prototype.notifySelect = function (abselem, tuneNumber, classes) {
  this.clearSelection();
  if (abselem.highlight) {
    this.selected = [abselem];
    abselem.highlight();
  }
  var abcelem = abselem.abcelem || {};
  for (var i=0; i<this.listeners.length;i++) {
	  this.listeners[i](abcelem, tuneNumber, classes);
  }
};

/**
 * Called by the Abstract Engraving Structure to say it was modified (e.g. notehead dragged)
 * @protected
 */
// EngraverController.prototype.notifyChange = function (/*abselem*/) {
//   for (var i=0; i<this.listeners.length;i++) {
//     if (this.listeners[i].modelChanged)
//       this.listeners[i].modelChanged();
//   }
// };

/**
 *
 * @private
 */
EngraverController.prototype.clearSelection = function () {
  for (var i=0;i<this.selected.length;i++) {
    this.selected[i].unhighlight();
  }
  this.selected = [];
};

/**
 * @param {Object} listener
 * @param {Function} listener.modelChanged the model the listener passed to this controller has changed
 * @param {Function} listener.highlight the abcelem of the model the listener passed to this controller should be highlighted
 */
EngraverController.prototype.addSelectListener = function (clickListener) {
  this.listeners[this.listeners.length] = clickListener;
};

/**
 * Tell the controller to highlight some noteheads of its engraved score
 * @param {number} start the character in the source abc where highlighting should start
 * @param {number} end the character in the source abc where highlighting should end
 */
EngraverController.prototype.rangeHighlight = function(start,end)
{
    this.clearSelection();
    for (var line=0;line<this.staffgroups.length; line++) {
	var voices = this.staffgroups[line].voices;
	for (var voice=0;voice<voices.length;voice++) {
	    var elems = voices[voice].children;
	    for (var elem=0; elem<elems.length; elem++) {
		// Since the user can highlight more than an element, or part of an element, a hit is if any of the endpoints
		// is inside the other range.
		var elStart = elems[elem].abcelem.startChar;
		var elEnd = elems[elem].abcelem.endChar;
		if ((end>elStart && start<elEnd) || ((end===start) && end===elEnd)) {
		    //		if (elems[elem].abcelem.startChar>=start && elems[elem].abcelem.endChar<=end) {
		    this.selected[this.selected.length]=elems[elem];
		    elems[elem].highlight();
		}
	    }
	}
    }
};


function centerWholeRests(voices) {
	// whole rests are a special case: if they are by themselves in a measure, then they should be centered.
	// (If they are not by themselves, that is probably a user error, but we'll just center it between the two items to either side of it.)
	for (var i = 0; i < voices.length; i++) {
		var voice = voices[i];
		// Look through all of the elements except for the first and last. If the whole note appears there then there isn't anything to center it between anyway.
		for (var j = 1; j < voice.children.length-1; j++) {
			var absElem = voice.children[j];
			if (absElem.abcelem.rest && (absElem.abcelem.rest.type === 'whole' || absElem.abcelem.rest.type === 'multimeasure')) {
				var before = voice.children[j-1];
				var after = voice.children[j+1];
				var midpoint = (after.x - before.x) / 2 + before.x;
				absElem.x = midpoint - absElem.w / 2;
				for (var k = 0; k < absElem.children.length; k++)
					absElem.children[k].x = absElem.x;
			}
		}
	}
}

module.exports = EngraverController;
