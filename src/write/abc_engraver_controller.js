//    abc_engraver_controller.js: Controls the engraving process of an ABCJS abstract syntax tree as produced by ABCJS/parse
//    Copyright (C) 2014-2020 Gregory Dyke (gregdyke at gmail dot com)
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
var FreeText = require('./free-text');
var Separator = require('./separator');
var Subtitle = require('./subtitle');
var TopText = require('./top-text');
var BottomText = require('./bottom-text');
var setupSelection = require('./selection');
var layout = require('./layout/layout');
var Classes = require('./classes');
var GetFontAndAttr = require('./get-font-and-attr');
var GetTextSize = require('./get-text-size');
var draw = require('./draw/draw');
var calcHeight = require('./calcHeight');

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
  this.selectionColor = params.selectionColor;
  this.dragColor = params.dragColor ? params.dragColor : params.selectionColor;
  this.dragging = !!params.dragging;
  this.selectTypes = params.selectTypes;
  this.responsive = params.responsive;
  this.space = 3*spacing.SPACE;
  this.scale = params.scale ? parseFloat(params.scale) : 0;
  this.classes = new Classes({ shouldAddClasses: params.add_classes });
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
	this.listeners = [];
	if (params.clickListener)
		this.addSelectListener(params.clickListener);

  this.renderer=new Renderer(paper, params.regression);
	this.renderer.setPaddingOverride(params);
	if (params.showDebug)
		this.renderer.showDebug = params.showDebug;
  this.renderer.controller = this; // TODO-GD needed for highlighting

	this.reset();
};

EngraverController.prototype.reset = function() {
	this.selected = [];
	this.staffgroups = [];
	if (this.engraver)
		this.engraver.reset();
	this.engraver = null;
	this.renderer.reset();
	this.dragTarget = null;
	this.dragIndex = -1;
	this.dragMouseStart = { x: -1, y: -1 };
	this.dragYStep = 0;
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
	  this.getFontAndAttr = new GetFontAndAttr(abctunes[i].formatting, this.classes);
	  this.getTextSize = new GetTextSize(this.getFontAndAttr, this.renderer.paper);
    this.engraveTune(abctunes[i], tuneNumber);
  }
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
	this.getFontAndAttr = new GetFontAndAttr(abcTune.formatting, this.classes);
	this.getTextSize = new GetTextSize(this.getFontAndAttr, this.renderer.paper);

	this.setupTune(abcTune, 0);
	this.constructTuneElements(abcTune);
	var maxWidth = layout(this.renderer, abcTune, 0, this.space);

	var ret = { left: 0, measureWidths: [], height: 0, total: 0 };
	// TODO-PER: need to add the height of the title block, too.
	ret.height = this.renderer.padding.top + this.renderer.spacing.music + this.renderer.padding.bottom + 24; // the 24 is the empirical value added to the bottom of all tunes.

	for(var i=0; i<abcTune.lines.length; i++) {
		var abcLine = abcTune.lines[i];
		if (abcLine.staff) {
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
			ret.height += calcHeight(abcLine.staffGroup) * spacing.STEP;
		}
	}
	return ret;
};

EngraverController.prototype.setupTune = function (abcTune, tuneNumber) {
	this.classes.reset();

	this.renderer.newTune(abcTune);
	this.engraver = new AbstractEngraver(this.getTextSize, tuneNumber, {
		bagpipes: abcTune.formatting.bagpipes,
		flatbeams: abcTune.formatting.flatbeams,
		graceSlurs: abcTune.formatting.graceSlurs !== false // undefined is the default, which is true
	});
	this.engraver.setStemHeight(this.renderer.spacing.stemHeight);
	this.engraver.measureLength = abcTune.getMeterFraction().num/abcTune.getMeterFraction().den;
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
	return scale;
};

EngraverController.prototype.constructTuneElements = function (abcTune) {
	abcTune.topText = new TopText(abcTune.metaText, abcTune.lines, this.width, this.renderer.isPrint, this.renderer.padding.left, this.renderer.spacing, this.getTextSize);

	// Generate the raw staff line data
	var i;
	var abcLine;
	var hasPrintedTempo = false;
	var hasSeenNonSubtitle = false;
	for(i=0; i<abcTune.lines.length; i++) {
		abcLine = abcTune.lines[i];
		if (abcLine.staff) {
			hasSeenNonSubtitle = true;
			abcLine.staffGroup = this.engraver.createABCLine(abcLine.staff, !hasPrintedTempo ? abcTune.metaText.tempo: null, this.getTextSize);
			hasPrintedTempo = true;
		} else if (abcLine.subtitle) {
			// If the subtitle is at the top, then it was already accounted for. So skip all subtitles until the first non-subtitle line.
			if (hasSeenNonSubtitle) {
				var center = this.width / 2 + this.renderer.padding.left;
				abcLine.nonMusic = new Subtitle(this.renderer.spacing.subtitle, abcLine.subtitle, center, this.getTextSize);
			}
		} else if (abcLine.text !== undefined) {
			hasSeenNonSubtitle = true;
			abcLine.nonMusic = new FreeText(abcLine.text, abcLine.vskip, this.getFontAndAttr, this.renderer.padding.left, this.width, this.getTextSize);
		} else if (abcLine.separator !== undefined && abcLine.separator.lineLength) {
			hasSeenNonSubtitle = true;
			abcLine.nonMusic = new Separator(abcLine.separator.spaceAbove, abcLine.separator.lineLength, abcLine.separator.spaceBelow);
		}
	}
	abcTune.bottomText = new BottomText(abcTune.metaText, this.width, this.renderer.isPrint, this.renderer.padding.left, this.renderer.spacing, this.getTextSize);
};

EngraverController.prototype.engraveTune = function (abcTune, tuneNumber) {
	var scale = this.setupTune(abcTune, tuneNumber);

	// Create all of the element objects that will appear on the page.
	this.constructTuneElements(abcTune);

	// Do all the positioning, both horizontally and vertically
	var maxWidth = layout(this.renderer, abcTune, this.width, this.space);

	// Do all the writing to the SVG
	var ret = draw(this.renderer, this.classes, abcTune, this.width, maxWidth, this.responsive, scale, this.selectTypes, tuneNumber);
	this.staffgroups = ret.staffgroups;
	this.selectables = ret.selectables;

	setupSelection(this);
};

EngraverController.prototype.getDim = function(historyEl) {
	// Get the dimensions on demand because the getBBox call is expensive.
	if (!historyEl.dim) {
		var box = historyEl.svgEl.getBBox();
		historyEl.dim = { left: Math.round(box.x), top: Math.round(box.y), right: Math.round(box.x+box.width), bottom: Math.round(box.y+box.height) };
	}
	return historyEl.dim;
};

EngraverController.prototype.addSelectListener = function (clickListener) {
	this.listeners[this.listeners.length] = clickListener;
};

module.exports = EngraverController;
