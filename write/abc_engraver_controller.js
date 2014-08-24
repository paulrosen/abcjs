//    abc_engraver_controller.js: Controls the engraving process of an ABCJS abstract syntax tree as produced by ABCJS/parse
//    Copyright (C) 2014 Gregory Dyke (gregdyke at gmail dot com)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.


/*global window, ABCJS, Math, Raphael */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

ABCJS.write.spacing = function() {};
ABCJS.write.spacing.FONTEM = 360;
ABCJS.write.spacing.FONTSIZE = 30;
ABCJS.write.spacing.STEP = ABCJS.write.spacing.FONTSIZE*93/720;
ABCJS.write.spacing.SPACE = 10;
ABCJS.write.spacing.TOPNOTE = 20;
ABCJS.write.spacing.STAVEHEIGHT = 100;
ABCJS.write.spacing.INDENT = 50;

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
ABCJS.write.EngraverController = function(paper, params) {
  params = params || {};
  this.space = 3*ABCJS.write.spacing.SPACE;
  this.glyphs = new ABCJS.write.Glyphs(); // we need the glyphs for layout information
  this.scale = params.scale || undefined;
  this.staffwidth = params.staffwidth || 680; // was:740; The number of pixels in 8.5", after 1cm of margin has been removed.
  this.editable = params.editable || false;

	// HACK-PER: Raphael doesn't support setting the class of an element, so this adds that support. This doesn't work on IE8 or less, though.
	this.usingSvg = (window.SVGAngle || document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? true : false); // Same test Raphael uses
	if (this.usingSvg && params.add_classes)
		Raphael._availableAttrs['class'] = "";
	Raphael._availableAttrs['text-decoration'] = "";

  //TODO-GD factor out all calls directly made to renderer.paper and fix all the coupling issues below
  this.renderer=new ABCJS.write.Renderer(paper, this.glyphs, params.regression);
	this.renderer.setPaddingOverride(params);
  this.renderer.controller = this; // TODO-GD needed for highlighting

	this.reset();
};

ABCJS.write.EngraverController.prototype.reset = function() {
	this.listeners = [];
	this.selected = [];
	this.ingroup = false;
	this.staffgroups = [];
	if (this.engraver)
		this.engraver.reset();
	this.engraver = null;
	this.renderer.reset();
};

/**
 * run the engraving process
 * @param {ABCJS.Tune|ABCJS.Tune[]} abctunes 
 */
ABCJS.write.EngraverController.prototype.engraveABC = function(abctunes) {
  if (abctunes[0]===undefined) {
    abctunes = [abctunes];
  }
	this.reset();

  for (var i = 0; i < abctunes.length; i++) {
    this.engraveTune(abctunes[i]);
  }
	if (this.renderer.doRegression)
		return this.renderer.regressionLines.join("\n");
};

/**
 * Some of the items on the page are not scaled, so adjust them in the opposite direction of scaling to cancel out the scaling.
 * @param {float} scale
 */
ABCJS.write.EngraverController.prototype.adjustNonScaledItems = function (scale) {
	this.width /= scale;
	this.renderer.adjustNonScaledItems(scale);
};

/**
 * Run the engraving process on a single tune
 * @param {ABCJS.Tune} abctune
 */
ABCJS.write.EngraverController.prototype.engraveTune = function (abctune) {
	this.renderer.lineNumber = null;
	this.renderer.abctune = abctune; // TODO-PER: this is just to get the font info.
	this.renderer.measureNumber = null;
	var scale = abctune.formatting.scale ? abctune.formatting.scale : this.scale;
	if (scale === undefined) scale = abctune.media === 'print' ? .75 : 1;
	this.renderer.setPrintMode(abctune.media === 'print');
	this.renderer.setPadding(abctune);
  this.engraver = new ABCJS.write.AbstractEngraver(this.glyphs, abctune.formatting.bagpipes);
	this.renderer.engraver = this.engraver; //TODO-PER: do we need this coupling? It's just used for the tempo
	if (abctune.formatting.staffwidth) {
		this.width=abctune.formatting.staffwidth;
	} else {
		this.width=this.staffwidth;
	}
	this.adjustNonScaledItems(scale);

	this.renderer.topMargin(abctune);
  this.renderer.engraveTopText(this.width, abctune);
	this.renderer.addMusicPadding();

  this.staffgroups = [];
  var maxwidth = this.width;
  for(var line=0; line<abctune.lines.length; line++) {
		this.renderer.lineNumber = line;
    var abcline = abctune.lines[line];
    if (abcline.staff) {
		var staffgroup = this.engraveStaffLine(abctune, abcline, line); //TODO-GD factor out generating the staffgroup, from laying it out, from rendering it
		if (staffgroup.w > maxwidth) maxwidth = staffgroup.w;
    } else if (abcline.subtitle && line!==0) {
		this.renderer.outputSubtitle(this.width, abcline.subtitle);
    } else if (abcline.text) {
		this.renderer.outputFreeText(abcline.text);
    }
  }

  this.renderer.engraveExtraText(this.width, abctune);
  

  this.renderer.setPaperSize(maxwidth, scale);
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
 * Engrave a single line (a group of related staffs)
 * @param {ABCJS.Tune} abctune an ABCJS AST
 * @param {Object} abcline an abcline from the AST, has a staff 
 * @param {number} line the line number
 * @private
 */
ABCJS.write.EngraverController.prototype.engraveStaffLine = function (abctune, abcline, line) {
  var staffgroup = this.engraver.createABCLine(abcline.staff);
  this.renderer.minY = this.engraver.minY; // use this value of minY to set things that need to be below everything else //TODO-GD fix it, horrible hack
  var newspace = this.space;
  for (var it = 0; it < 3; it++) { // TODO shouldn't need this triple pass any more
    staffgroup.layout(newspace, this.renderer, false);
		//console.log("STAFFGROUP:", line, staffgroup.w, this.width+this.renderer.padding.left, newspace, staffgroup.spacingunits, staffgroup.minspace);
	  var stretchLast = abctune.formatting.stretchlast ? abctune.formatting.stretchlast : false;
		newspace = calcHorizontalSpacing(line === abctune.lines.length - 1, stretchLast, this.width+this.renderer.padding.left, staffgroup.w, newspace, staffgroup.spacingunits, staffgroup.minspace);
		if (newspace === null) break;
  }
	centerWholeRests(staffgroup.voices);
	this.renderer.printHorizontalLine(this.width+this.renderer.padding.left+this.renderer.padding.right);
	var oldY = this.renderer.y; // The following call modifies the y position, so we need to save the old one to restore it.
  staffgroup.draw(this.renderer, this.renderer.y);
	this.renderer.y = oldY;
	this.renderer.printVerticalLine(this.width+this.renderer.padding.left, this.renderer.y, this.renderer.y+staffgroup.height);
  this.staffgroups[this.staffgroups.length] = staffgroup;
//  this.renderer.y = staffgroup.y + staffgroup.height;
//  this.renderer.y += ABCJS.write.spacing.STAVEHEIGHT * 0.2;
	this.renderer.y += staffgroup.height;
  return staffgroup;
};

/**
 * Called by the Abstract Engraving Structure or any other (e.g. midi playback) to say it was selected (notehead clicked on)
 * @protected
 */
ABCJS.write.EngraverController.prototype.notifySelect = function (abselem) {
  this.clearSelection();
  if (abselem.highlight) {
    this.selected = [abselem];
    abselem.highlight();
  }
  var abcelem = abselem.abcelem || {};
  for (var i=0; i<this.listeners.length;i++) {
    this.listeners[i].highlight(abcelem);
  }
};

/**
 * Called by the Abstract Engraving Structure to say it was modified (e.g. notehead dragged)
 * @protected
 */
ABCJS.write.EngraverController.prototype.notifyChange = function (/*abselem*/) {
  for (var i=0; i<this.listeners.length;i++) {
    this.listeners[i].modelChanged();
  }
};

/**
 *
 * @private
 */
ABCJS.write.EngraverController.prototype.clearSelection = function () {
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
ABCJS.write.EngraverController.prototype.addSelectListener = function (listener) {
  this.listeners[this.listeners.length] = listener;
};

/**
 * Tell the controller to highlight some noteheads of its engraved score
 * @param {number} start the character in the source abc where highlighting should start
 * @param {number} end the character in the source abc where highlighting should end
 */
ABCJS.write.EngraverController.prototype.rangeHighlight = function(start,end)
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

			}
		}
	}
}

