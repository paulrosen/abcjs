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
var setupSelection = require('./selection');
var layout = require('./layout/layout');
var Classes = require('./classes');
var GetFontAndAttr = require('./get-font-and-attr');
var GetTextSize = require('./get-text-size');
var draw = require('./draw/draw');

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
  this.editable = params.editable || false;
	this.listeners = [];
	if (params.clickListener)
		this.addSelectListener(params.clickListener);

  this.renderer=new Renderer(paper, params.regression);
	this.renderer.setPaddingOverride(params);
  this.renderer.controller = this; // TODO-GD needed for highlighting

	this.reset();
};

EngraverController.prototype.reset = function() {
	this.selected = [];
	this.ingroup = false;
	this.staffgroups = [];
	if (this.engraver)
		this.engraver.reset();
	this.engraver = null;
	this.renderer.reset();
	this.history = [];
	this.currentAbsEl = null;
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

	this.classes.reset();

	this.getFontAndAttr = new GetFontAndAttr(abcTune.formatting, this.classes);
	this.getTextSize = new GetTextSize(this.getFontAndAttr, this.renderer.paper);
	this.renderer.newTune(abcTune);
	this.engraver = new AbstractEngraver(this.getTextSize, 0, {
		bagpipes: abcTune.formatting.bagpipes,
		flatbeams: abcTune.formatting.flatbeams,
		graceSlurs: abcTune.formatting.graceSlurs !== false // undefined is the default, which is true
	});
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
			abcLine.staffGroup = this.engraver.createABCLine(abcLine.staff, !hasPrintedTempo ? abcTune.metaText.tempo: null, this.getTextSize);

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
	this.classes.reset();

	this.renderer.newTune(abctune);
	this.engraver = new AbstractEngraver(this.getTextSize, tuneNumber, {
		bagpipes: abctune.formatting.bagpipes,
		flatbeams: abctune.formatting.flatbeams,
		graceSlurs: abctune.formatting.graceSlurs !== false // undefined is the default, which is true
	});
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
			abcLine.staffGroup = this.engraver.createABCLine(abcLine.staff, !hasPrintedTempo ? abctune.metaText.tempo: null, this.getTextSize);
			hasPrintedTempo = true;
		}
	}

	// Adjust the x-coordinates to their absolute positions
	var maxWidth = layout(this.renderer, abctune, this.width, this.space);

	// Do all the writing to output
	this.staffgroups = draw(this.renderer, this.classes, abctune, this.width, maxWidth, this.responsive, scale);

	setupSelection(this);
};

EngraverController.prototype.recordHistory = function (svgEl, notSelectable) {
	var isNote = this.currentAbsEl && this.currentAbsEl.abcelem && this.currentAbsEl.abcelem.el_type === "note" && !this.currentAbsEl.abcelem.rest && svgEl.tagName !== 'text';
	var selectable = notSelectable !== true;
	if (!this.currentAbsEl || !this.currentAbsEl.abcelem) selectable = false;
	if (this.selectTypes === false)
		selectable = false;
	else if (this.selectTypes === undefined)
		this.selectTypes = [ 'note' ];
	else if (this.selectTypes === true) {
		// Nothing to do here. If selectable was set to false earlier then it can't be overwritten.
	} else if (this.selectTypes.indexOf(this.currentAbsEl.abcelem.el_type) < 0)
		selectable = false;

	if (!selectable)
		return;

	this.history.push({ absEl: this.currentAbsEl, svgEl: svgEl, selectable: selectable, isDraggable: isNote });
};

EngraverController.prototype.getDim = function(historyEl) {
	// Get the dimensions on demand because the getBBox call is expensive.
	if (!historyEl.dim) {
		var box = historyEl.svgEl.getBBox();
		historyEl.dim = { left: Math.round(box.x), top: Math.round(box.y), right: Math.round(box.x+box.width), bottom: Math.round(box.y+box.height) };
	}
	return historyEl.dim;
};

EngraverController.prototype.combineHistory = function (len, svgEl) {
	if (len < 2)
		return;
	var items = [];
	for (var i = 0; i < len; i++) {
		items.push(this.history.pop());
	}
	for (i = 0; i < items.length; i++) {
		this.getDim(items[i]);
	}
	for (i = 1; i < items.length; i++) {
		items[0].dim.left = Math.min(items[0].dim.left, items[i].dim.left);
		items[0].dim.top = Math.min(items[0].dim.top, items[i].dim.top);
		items[0].dim.right = Math.max(items[0].dim.right, items[i].dim.right);
		items[0].dim.bottom = Math.max(items[0].dim.bottom, items[i].dim.bottom);
	}
	items[0].svgEl = svgEl;
	this.history.push(items[0]);
};


EngraverController.prototype.addSelectListener = function (clickListener) {
	this.listeners[this.listeners.length] = clickListener;
};

module.exports = EngraverController;
