//    abc_engraver_controller.js: Controls the engraving process of an ABCJS abstract syntax tree as produced by ABCJS/parse

/*global Math */

var spacing = require('./helpers/spacing');
var AbstractEngraver = require('./creation/abstract-engraver');
var Renderer = require('./renderer');
var FreeText = require('./creation/elements/free-text');
var Separator = require('./creation/elements/separator');
var Subtitle = require('./creation/elements/subtitle');
var TopText = require('./creation/elements/top-text');
var BottomText = require('./creation/elements/bottom-text');
var setupSelection = require('./interactive/selection');
var layout = require('./layout/layout');
var Classes = require('./helpers/classes');
var GetFontAndAttr = require('./helpers/get-font-and-attr');
var GetTextSize = require('./helpers/get-text-size');
var draw = require('./draw/draw');
var tablatures = require('../api/abc_tablatures');

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
 */
var EngraverController = function (paper, params) {
	params = params || {};
	this.oneSvgPerLine = params.oneSvgPerLine;
	this.selectionColor = params.selectionColor;
	this.dragColor = params.dragColor ? params.dragColor : params.selectionColor;
	this.dragging = !!params.dragging;
	this.selectTypes = params.selectTypes;
	this.responsive = params.responsive;
	this.space = 3 * spacing.SPACE;
	this.initialClef = params.initialClef;
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

	this.renderer = new Renderer(paper);
	this.renderer.setPaddingOverride(params);
	if (params.showDebug)
		this.renderer.showDebug = params.showDebug;
	if (params.jazzchords)
		this.jazzchords = params.jazzchords;
	if (params.germanAlphabet)
		this.germanAlphabet = params.germanAlphabet;
	if (params.lineThickness)
		this.lineThickness = params.lineThickness;
	this.renderer.controller = this; // TODO-GD needed for highlighting
	this.renderer.foregroundColor = params.foregroundColor ? params.foregroundColor : "currentColor";
	if (params.ariaLabel !== undefined)
		this.renderer.ariaLabel = params.ariaLabel;
	this.renderer.minPadding = params.minPadding ? params.minPadding : 0;

	this.reset();
};

EngraverController.prototype.reset = function () {
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
	if (this.lineThickness)
		this.renderer.setLineThickness(this.lineThickness)
};

/**
 * run the engraving process
 */
EngraverController.prototype.engraveABC = function (abctunes, tuneNumber, lineOffset) {
	if (abctunes[0] === undefined) {
		abctunes = [abctunes];
	}
	this.reset();

	for (var i = 0; i < abctunes.length; i++) {
		if (tuneNumber === undefined)
			tuneNumber = i;
		this.getFontAndAttr = new GetFontAndAttr(abctunes[i].formatting, this.classes);
		this.getTextSize = new GetTextSize(this.getFontAndAttr, this.renderer.paper);
		this.engraveTune(abctunes[i], tuneNumber, lineOffset);
	}
};

/**
 * Some of the items on the page are not scaled, so adjust them in the opposite direction of scaling to cancel out the scaling.
 */
EngraverController.prototype.adjustNonScaledItems = function (scale) {
	this.width /= scale;
	this.renderer.adjustNonScaledItems(scale);
};

EngraverController.prototype.getMeasureWidths = function (abcTune) {
	this.reset();
	this.getFontAndAttr = new GetFontAndAttr(abcTune.formatting, this.classes);
	this.getTextSize = new GetTextSize(this.getFontAndAttr, this.renderer.paper);

	this.setupTune(abcTune, 0);
	this.constructTuneElements(abcTune);
	// layout() sets the x-coordinate of the abcTune element here:
	// abcTune.lines[0].staffGroup.voices[0].children[0].x
	layout(this.renderer, abcTune, 0, this.space);

	var ret = [];
	var section;

	var needNewSection = true;
	for (var i = 0; i < abcTune.lines.length; i++) {
		var abcLine = abcTune.lines[i];
		if (abcLine.staff) {
			if (needNewSection) {
				section = {
					left: 0,
					measureWidths: [],
					//height: this.renderer.padding.top + this.renderer.spacing.music + this.renderer.padding.bottom + 24, // the 24 is the empirical value added to the bottom of all tunes.
					total: 0
				};
				ret.push(section);
				needNewSection = false;
			}
			// At this point, the voices are laid out so that the bar lines are even with each other. So we just need to get the placement of the first voice.
			if (abcLine.staffGroup.voices.length > 0) {
				var voice = abcLine.staffGroup.voices[0];
				var foundNotStaffExtra = false;
				var lastXPosition = 0;
				for (var k = 0; k < voice.children.length; k++) {
					var child = voice.children[k];
					if (!foundNotStaffExtra && !child.isClef && !child.isKeySig) {
						foundNotStaffExtra = true;
						section.left = child.x;
						lastXPosition = child.x;
					}
					if (child.type === 'bar') {
						section.measureWidths.push(child.x - lastXPosition);
						section.total += (child.x - lastXPosition);
						lastXPosition = child.x;
					}
				}
			}
			//section.height += calcHeight(abcLine.staffGroup) * spacing.STEP;
		} else
			needNewSection = true;
	}
	return ret;
};

EngraverController.prototype.setupTune = function (abcTune, tuneNumber) {
	this.classes.reset();

	if (abcTune.formatting.jazzchords !== undefined)
		this.jazzchords = abcTune.formatting.jazzchords;

	this.renderer.newTune(abcTune);
	this.engraver = new AbstractEngraver(this.getTextSize, tuneNumber, {
		bagpipes: abcTune.formatting.bagpipes,
		flatbeams: abcTune.formatting.flatbeams,
		graceSlurs: abcTune.formatting.graceSlurs !== false, // undefined is the default, which is true
		percmap: abcTune.formatting.percmap,
		initialClef: this.initialClef,
		jazzchords: this.jazzchords,
		germanAlphabet: this.germanAlphabet
	});
	this.engraver.setStemHeight(this.renderer.spacing.stemHeight);
	this.engraver.measureLength = abcTune.getMeterFraction().num / abcTune.getMeterFraction().den;
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
	abcTune.topText = new TopText(abcTune.metaText, abcTune.metaTextInfo, abcTune.formatting, abcTune.lines, this.width, this.renderer.isPrint, this.renderer.padding.left, this.renderer.spacing, this.getTextSize);

	// Generate the raw staff line data
	var i;
	var abcLine;
	var hasPrintedTempo = false;
	var hasSeenNonSubtitle = false;
	for (i = 0; i < abcTune.lines.length; i++) {
		abcLine = abcTune.lines[i];
		if (abcLine.staff) {
			hasSeenNonSubtitle = true;
			abcLine.staffGroup = this.engraver.createABCLine(abcLine.staff, !hasPrintedTempo ? abcTune.metaText.tempo : null, i);
			hasPrintedTempo = true;
		} else if (abcLine.subtitle) {
			// If the subtitle is at the top, then it was already accounted for. So skip all subtitles until the first non-subtitle line.
			if (hasSeenNonSubtitle) {
				var center = this.width / 2 + this.renderer.padding.left;
				abcLine.nonMusic = new Subtitle(this.renderer.spacing.subtitle, abcTune.formatting, abcLine.subtitle, center, this.renderer.padding.left, this.getTextSize);
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

EngraverController.prototype.engraveTune = function (abcTune, tuneNumber, lineOffset) {
	var scale = this.setupTune(abcTune, tuneNumber);

	// Create all of the element objects that will appear on the page.
	this.constructTuneElements(abcTune);

	// Do all the positioning, both horizontally and vertically
	var maxWidth = layout(this.renderer, abcTune, this.width, this.space);

	// Deal with tablature for staff
	if (abcTune.tablatures) {
		tablatures.layoutTablatures(this.renderer, abcTune);
	}

	// Do all the writing to the SVG
	var ret = draw(this.renderer, this.classes, abcTune, this.width, maxWidth, this.responsive, scale, this.selectTypes, tuneNumber, lineOffset);
	this.staffgroups = ret.staffgroups;
	this.selectables = ret.selectables;

	if (this.oneSvgPerLine) {
		var div = this.renderer.paper.svg.parentNode
		this.svgs = splitSvgIntoLines(this.renderer, div, abcTune.metaText.title, this.responsive)
	} else {
		this.svgs = [this.renderer.paper.svg];
	}
	setupSelection(this, this.svgs);
};

function splitSvgIntoLines(renderer, output, title, responsive) {
	// Each line is a top level <g> in the svg. To split it into separate
	// svgs iterate through each of those and put them in a new svg. Since
	// they are placed absolutely, the viewBox needs to be manipulated to
	// get the correct vertical positioning.
	// We copy all the attributes from the original svg except for the aria-label
	// since we want that to include a count. And the height is now a fraction of the original svg.
	if (!title) title = "Untitled"
	var source = output.querySelector("svg")
	if (responsive === 'resize')
		output.style.paddingBottom = ''
	var style = source.querySelector("style")
	var width = responsive === 'resize' ? source.viewBox.baseVal.width : source.getAttribute("width")
	var sections = output.querySelectorAll("svg > g") // each section is a line, or the top matter or the bottom matter, or text that has been inserted.
	var nextTop = 0 // There are often gaps between the elements for spacing, so the actual top and height needs to be inferred.
	var wrappers = [] // Create all the elements and place them at once because we use the current svg to get data. It would disappear after placing the first line.
	var svgs = []
	for (var i = 0; i < sections.length; i++) {
		var section = sections[i]
		var box = section.getBBox()
		var gapBetweenLines = box.y - nextTop // take the margin into account
		var height = box.height + gapBetweenLines;
		var wrapper = document.createElement("div");
		var divStyles = "overflow: hidden;"
		if (responsive !== 'resize')
			divStyles += "height:" + height + "px;"
		wrapper.setAttribute("style", divStyles)
		var svg = duplicateSvg(source)
		var fullTitle = "Sheet Music for \"" + title + "\" section " + (i + 1)
		svg.setAttribute("aria-label", fullTitle)
		if (responsive !== 'resize')
			svg.setAttribute("height", height)
		if (responsive === 'resize')
			svg.style.position = ''
		// TODO-PER: Hack! Not sure why this is needed.
		var viewBoxHeight = renderer.firefox112 ? height+1 : height
		svg.setAttribute("viewBox", "0 " + nextTop + " " + width + " " + viewBoxHeight)
		svg.appendChild(style.cloneNode(true))
		var titleEl = document.createElement("title")
		titleEl.innerText = fullTitle
		svg.appendChild(titleEl)
		svg.appendChild(section)

		wrapper.appendChild(svg)
		svgs.push(svg)
		output.appendChild(wrapper)
		//wrappers.push(wrapper)
		nextTop = box.y + box.height
	}
	// for (i = 0; i < wrappers.length; i++)
	// 	output.appendChild(wrappers[i])
	output.removeChild(source)
	return svgs;
}

function duplicateSvg(source) {
	var svgNS = "http://www.w3.org/2000/svg";
	var svg = document.createElementNS(svgNS, "svg");
	for (var i = 0; i < source.attributes.length; i++) {
		var attr = source.attributes[i];
		if (attr.name !== "height" && attr.name != "aria-label")
			svg.setAttribute(attr.name, attr.value)
	}
	return svg;
}

EngraverController.prototype.getDim = function (historyEl) {
	// Get the dimensions on demand because the getBBox call is expensive.
	if (!historyEl.dim) {
		var box = historyEl.svgEl.getBBox();
		historyEl.dim = { left: Math.round(box.x), top: Math.round(box.y), right: Math.round(box.x + box.width), bottom: Math.round(box.y + box.height) };
	}
	return historyEl.dim;
};

EngraverController.prototype.addSelectListener = function (clickListener) {
	this.listeners[this.listeners.length] = clickListener;
};

module.exports = EngraverController;
