//    abc_engraver_controller.js: Controls the engraving process of an ABCJS abstract syntax tree as produced by ABCJS/parse
//    Copyright (C) 2014 Gregory Dyke (gregdyke at gmail dot com)
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


/*global window, Math, Raphael */

var spacing = require('./abc_spacing');
var AbstractEngraver = require('./abc_abstract_engraver');
var Renderer = require('./abc_renderer');
var Raphael = require('raphael');

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
 * @param {Object} paper SVG like object with methods path, text, etc.
 * @param {Object} params all the params -- documented on github //TODO-GD move some of that documentation here
 */
var EngraverController = function(paper, params) {
  params = params || {};
  if (!paper) {
  	// if a Raphael object was not passed in, create on here.
	  paper = Raphael(params.elementId, params.staffwidth, params.staffheight);
  }
  this.responsive = params.responsive;
  this.space = 3*spacing.SPACE;
  this.scale = params.scale || undefined;
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
	if (params.listener)
		this.addSelectListener(params.listener);

	// HACK-PER: Raphael doesn't support setting the class of an element, so this adds that support. This doesn't work on IE8 or less, though.
	this.usingSvg = (window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? true : false); // Same test Raphael uses
	if (this.usingSvg && params.add_classes)
		Raphael._availableAttrs['class'] = "";
	Raphael._availableAttrs['text-decoration'] = "";
	Raphael._availableAttrs['data-vertical'] = "";

  //TODO-GD factor out all calls directly made to renderer.paper and fix all the coupling issues below
  this.renderer=new Renderer(paper, params.regression);
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
EngraverController.prototype.engraveABC = function(abctunes) {
  if (abctunes[0]===undefined) {
    abctunes = [abctunes];
  }
	this.reset();

  for (var i = 0; i < abctunes.length; i++) {
    this.engraveTune(abctunes[i], i);
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

/**
 * Run the engraving process on a single tune
 * @param {ABCJS.Tune} abctune
 */
EngraverController.prototype.engraveTune = function (abctune, tuneNumber) {
	this.renderer.lineNumber = null;
	abctune.formatting.tripletfont = {face: "Times", size: 11, weight: "normal", style: "italic", decoration: "none"}; // TODO-PER: This font isn't defined in the standard, so it's hardcoded here for now.

	this.renderer.abctune = abctune; // TODO-PER: this is just to get the font info.
	this.renderer.setVerticalSpace(abctune.formatting);
	this.renderer.measureNumber = null;
	this.renderer.setPrintMode(abctune.media === 'print');
	var scale = abctune.formatting.scale ? abctune.formatting.scale : this.scale;
	if (scale === undefined) scale = this.renderer.isPrint ? 0.75 : 1;
	this.renderer.setPadding(abctune);
	this.engraver = new AbstractEngraver(abctune.formatting.bagpipes,this.renderer, tuneNumber);
	this.engraver.setStemHeight(this.renderer.spacing.stemHeight);
	this.renderer.engraver = this.engraver; //TODO-PER: do we need this coupling? It's just used for the tempo
	if (abctune.formatting.staffwidth) {
		this.width = abctune.formatting.staffwidth * 1.33; // The width is expressed in pt; convert to px.
	} else {
		this.width = this.renderer.isPrint ? this.staffwidthPrint : this.staffwidthScreen;
	}
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
			this.setXSpacing(abcLine.staffGroup, abctune.formatting, i === abctune.lines.length - 1);
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
			this.renderer.outputFreeText(abcLine.text);
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
EngraverController.prototype.setXSpacing = function (staffGroup, formatting, isLastLine) {
   var newspace = this.space;
  for (var it = 0; it < 3; it++) { // TODO-PER: shouldn't need this triple pass any more, but it does slightly affect the coordinates.
	  staffGroup.layout(newspace, this.renderer, false);
	  var stretchLast = formatting.stretchlast ? formatting.stretchlast : false;
		newspace = calcHorizontalSpacing(isLastLine, stretchLast, this.width+this.renderer.padding.left, staffGroup.w, newspace, staffGroup.spacingunits, staffGroup.minspace);
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
EngraverController.prototype.notifySelect = function (abselem, tuneNumber) {
  this.clearSelection();
  if (abselem.highlight) {
    this.selected = [abselem];
    abselem.highlight();
  }
  var abcelem = abselem.abcelem || {};
  for (var i=0; i<this.listeners.length;i++) {
	  if (this.listeners[i].highlight)
		  this.listeners[i].highlight(abcelem, tuneNumber);
  }
};

/**
 * Called by the Abstract Engraving Structure to say it was modified (e.g. notehead dragged)
 * @protected
 */
EngraverController.prototype.notifyChange = function (/*abselem*/) {
  for (var i=0; i<this.listeners.length;i++) {
    if (this.listeners[i].modelChanged)
      this.listeners[i].modelChanged();
  }
};

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
EngraverController.prototype.addSelectListener = function (listener) {
  this.listeners[this.listeners.length] = listener;
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
			if (absElem.abcelem.rest && absElem.abcelem.rest.type === 'whole') {
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
