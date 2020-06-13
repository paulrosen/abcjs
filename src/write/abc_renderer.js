//    abc_renderer.js: API to render to SVG/Raphael/whatever rendering engine
//    Copyright (C) 2010-2020 Gregory Dyke (gregdyke at gmail dot com)
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


/*global Math, console */

var spacing = require('./abc_spacing');
var Svg = require('./svg');
var AbsoluteElement = require('./abc_absolute_element');
var renderText = require('./draw/text');

/**
 * Implements the API for rendering ABCJS Abstract Rendering Structure to a canvas/paper (e.g. SVG, Raphael, etc)
 * @param {Object} paper
 * @param {bool} doRegression
 */
var Renderer = function(paper, doRegression) {
  this.paper = new Svg(paper);
  this.controller = null; //TODO-GD only used when drawing the ABCJS ARS to connect the controller with the elements for highlighting

	this.space = 3*spacing.SPACE;
  this.padding = {}; // renderer's padding is managed by the controller
  this.doRegression = doRegression;
  if (this.doRegression)
    this.regressionLines = [];
	this.reset();
};

Renderer.prototype.reset = function() {

	this.paper.clear();
	this.y = 0;
	this.abctune = null;
	this.lastM = null;
	this.ingroup = false;
	this.path = null;
	this.isPrint = false;
	this.initVerticalSpace();
	if (this.doRegression)
		this.regressionLines = [];
	// HACK-PER: There was a problem in Raphael where every path string that was sent to it was cached.
	// That was causing the browser's memory to steadily grow until the browser went slower and slower until
	// it crashed. The fix to that was a patch to Raphael, so it is only patched on the versions of this library that
	// bundle Raphael with it. Also, if Raphael gets an update, then that patch will be lost. On version 2.1.2 of Raphael,
	// the patch is on line 1542 and 1545 and it is:
	//             p[ps].sleep = 1;
};

Renderer.prototype.newTune = function(abcTune) {
	this.abctune = abcTune; // TODO-PER: this is just to get the font info.
	this.setVerticalSpace(abcTune.formatting);
	//this.measureNumber = null;
	//this.noteNumber = null;
	this.setPrintMode(abcTune.media === 'print');
	this.setPadding(abcTune);
};

/**
 * Set whether we are formatting this for the screen, or as a preview for creating a PDF version.
 * @param {bool} isPrint
 */
Renderer.prototype.setPrintMode = function (isPrint) {
	this.isPrint = isPrint;
};

/**
 * Set the padding
 * @param {object} params
 */
Renderer.prototype.setPaddingOverride = function(params) {
	this.paddingOverride = { top: params.paddingtop, bottom: params.paddingbottom,
		right: params.paddingright, left: params.paddingleft };
};

/**
 * Set the padding
 * @param {object} params
 */
Renderer.prototype.setPadding = function(abctune) {
	// If the padding is set in the tune, then use that.
	// Otherwise, if the padding is set in the override, use that.
	// Otherwise, use the defaults (there are a different set of defaults for screen and print.)
	function setPaddingVariable(self, paddingKey, formattingKey, printDefault, screenDefault) {
		if (abctune.formatting[formattingKey] !== undefined)
			self.padding[paddingKey] = abctune.formatting[formattingKey];
		else if (self.paddingOverride[paddingKey] !== undefined)
			self.padding[paddingKey] = self.paddingOverride[paddingKey];
		else if (self.isPrint)
			self.padding[paddingKey] = printDefault;
		else
			self.padding[paddingKey] = screenDefault;
	}
	// 1cm x 0.393701in/cm x 72pt/in x 1.33px/pt = 38px
	// 1.8cm x 0.393701in/cm x 72pt/in x 1.33px/pt = 68px
	setPaddingVariable(this, 'top', 'topmargin', 38, 15);
	setPaddingVariable(this, 'bottom', 'botmargin', 38, 15);
	setPaddingVariable(this, 'left', 'leftmargin', 68, 15);
	setPaddingVariable(this, 'right', 'rightmargin', 68, 15);
};

/**
 * Some of the items on the page are not scaled, so adjust them in the opposite direction of scaling to cancel out the scaling.
 * @param {float} scale
 */
Renderer.prototype.adjustNonScaledItems = function (scale) {
	this.padding.top /= scale;
	this.padding.bottom /= scale;
	this.padding.left /= scale;
	this.padding.right /= scale;
	this.abctune.formatting.headerfont.size /= scale;
	this.abctune.formatting.footerfont.size /= scale;
};

/**
 * Set the the values for all the configurable vertical space options.
 */
Renderer.prototype.initVerticalSpace = function() {
	// conversion: 37.7953 = conversion factor for cm to px.
	// All of the following values are in px.
	this.spacing = {
		composer: 7.56, // Set the vertical space above the composer.
		graceBefore: 8.67, // Define the space before, inside and after the grace notes.
		graceInside: 10.67,
		graceAfter: 16,
		info: 0, // Set the vertical space above the infoline.
		lineSkipFactor: 1.1, // Set the factor for spacing between lines of text. (multiply this by the font size)
		music: 7.56, // Set the vertical space above the first staff.
		paragraphSkipFactor: 0.4, // Set the factor for spacing between text paragraphs. (multiply this by the font size)
		parts: 11.33, // Set the vertical space above a new part.
		slurHeight: 1.0, // Set the slur height factor.
		staffSeparation: 61.33, // Do not put a staff system closer than <unit> from the previous system.
		stemHeight: 26.67+10, // Set the stem height.
		subtitle: 3.78, // Set the vertical space above the subtitle.
		systemStaffSeparation: 48, // Do not place the staves closer than <unit> inside a system. * This values applies to all staves when in the tune header. Otherwise, it applies to the next staff
		text: 18.9, // Set the vertical space above the history.
		title: 7.56, // Set the vertical space above the title.
		top: 30.24, //Set the vertical space above the tunes and on the top of the continuation pages.
		vocal: 30.67, // Set the vertical space above the lyrics under the staves.
		words: 0 // Set the vertical space above the lyrics at the end of the tune.
	};
	/*
	TODO-PER: Handle the x-coordinate spacing items, too.
maxshrink <float>Default: 0.65
Set how much to compress horizontally when music line breaks
are automatic.
<float> must be between 0 (natural spacing)
and 1 (max shrinking).

// This next value is used to compute the natural spacing of
// the notes. The base spacing of the crotchet is always
// 40 pts. When the duration of a note type is twice the
// duration of an other note type, its spacing is multiplied
// by this factor.
// The default value causes the note spacing to be multiplied
// by 2 when its duration is multiplied by 4, i.e. the
// space of the semibreve is 80 pts and the space of the
// semiquaver is 20 pts.
// Setting this value to 1 sets all note spacing to 40 pts.
noteSpacingFactor: 1.414, // Set the note spacing factor to <float> (range 1..2).

scale <float> Default: 0.75 Set the page scale factor. Note that the header and footer are not scaled.

stretchlast <float>Default: 0.8
Stretch the last music line of a tune when it exceeds
the <float> fraction of the page width.
<float> range is 0.0 to 1.0.
	 */
};

Renderer.prototype.setVerticalSpace = function(formatting) {
	// conversion from pts to px 4/3
	if (formatting.staffsep !== undefined)
		this.spacing.staffSeparation = formatting.staffsep *4/3;
	if (formatting.composerspace !== undefined)
		this.spacing.composer = formatting.composerspace *4/3;
	if (formatting.partsspace !== undefined)
		this.spacing.parts = formatting.partsspace *4/3;
	if (formatting.textspace !== undefined)
		this.spacing.text = formatting.textspace *4/3;
	if (formatting.musicspace !== undefined)
		this.spacing.music = formatting.musicspace *4/3;
	if (formatting.titlespace !== undefined)
		this.spacing.title = formatting.titlespace *4/3;
	if (formatting.sysstaffsep !== undefined)
		this.spacing.systemStaffSeparation = formatting.sysstaffsep *4/3;
	if (formatting.subtitlespace !== undefined)
		this.spacing.subtitle = formatting.subtitlespace *4/3;
	if (formatting.topspace !== undefined)
		this.spacing.top = formatting.topspace *4/3;
	if (formatting.vocalspace !== undefined)
		this.spacing.vocal = formatting.vocalspace *4/3;
	if (formatting.wordsspace !== undefined)
		this.spacing.words = formatting.wordsspace *4/3;
};

/**
 * Leave space at the top of the paper
 * @param {object} abctune
 */
Renderer.prototype.topMargin = function(abctune) {
		this.moveY(this.padding.top);
};

/**
 * Leave space before printing the music
 */
Renderer.prototype.addMusicPadding = function() {
		this.moveY(this.spacing.music);
};

/**
 * Leave space before printing a staff system
 */
Renderer.prototype.addStaffPadding = function(lastStaffGroup, thisStaffGroup) {
	var lastStaff = lastStaffGroup.staffs[lastStaffGroup.staffs.length-1];
	var lastBottomLine = -(lastStaff.bottom - 2); // The 2 is because the scale goes to 2 below the last line.
	var nextTopLine = thisStaffGroup.staffs[0].top - 10; // Because 10 represents the top line.
	var naturalSeparation = nextTopLine + lastBottomLine; // This is how far apart they'd be without extra spacing
	var separationInPixels = naturalSeparation * spacing.STEP;
	if (separationInPixels < this.spacing.staffSeparation)
		this.moveY(this.spacing.staffSeparation-separationInPixels);
};

/**
 * Text that goes above the score
 * @param {number} width
 * @param {object} abctune
 */
Renderer.prototype.engraveTopText = function(width, abctune) {
	var el;
	if (abctune.metaText.header && this.isPrint) {
		// Note: whether there is a header or not doesn't change any other positioning, so this doesn't change the Y-coordinate.
		// This text goes above the margin, so we'll temporarily move up.
		var headerTextHeight = this.controller.getTextSize.calc("XXXX", "headerfont", 'abcjs-header abcjs-meta-top').height;
		this.y -=headerTextHeight;
		this.outputTextIf(this.padding.left, abctune.metaText.header.left, 'headerfont', 'header meta-top', 0, null, 'start');
		this.outputTextIf(this.padding.left + width / 2, abctune.metaText.header.center, 'headerfont', 'header meta-top', 0, null, 'middle');
		this.outputTextIf(this.padding.left + width, abctune.metaText.header.right, 'headerfont', 'header meta-top', 0, null, 'end');
		this.y += headerTextHeight;
	}
	if (this.isPrint)
		this.moveY(this.spacing.top);
	if (abctune.metaText.title) {
		this.wrapInAbsElem({el_type: "title", startChar: -1, endChar: -1, text: abctune.metaText.title}, 'title meta-top', function() {
			return this.outputTextIf(this.padding.left + width / 2, abctune.metaText.title, 'titlefont', 'title meta-top', this.spacing.title, 0, 'middle')[2];
		});
	}
	if (abctune.lines[0] && abctune.lines[0].subtitle) {
		this.wrapInAbsElem({el_type: "subtitle", startChar: -1, endChar: -1, text: abctune.lines[0].subtitle}, 'text meta-top subtitle', function() {
			return this.outputTextIf(this.padding.left + width / 2, abctune.lines[0].subtitle, 'subtitlefont', 'text meta-top subtitle', this.spacing.subtitle, 0, 'middle')[2];
		});
	}

	if (abctune.metaText.rhythm || abctune.metaText.origin || abctune.metaText.composer) {
		this.moveY(this.spacing.composer);
		var rSpace;
		if (abctune.metaText.rhythm && abctune.metaText.rhythm.length > 0) {
			this.wrapInAbsElem({el_type: "rhythm", startChar: -1, endChar: -1, text: abctune.metaText.rhythm}, 'meta-top rhythm', function() {
				rSpace = this.outputTextIf(this.padding.left, abctune.metaText.rhythm, 'infofont', 'meta-top rhythm', 0, null, "start");
				return rSpace[2];
			});
		}
		var composerLine = "";
		if (abctune.metaText.composer) composerLine += abctune.metaText.composer;
		if (abctune.metaText.origin) composerLine += ' (' + abctune.metaText.origin + ')';
		if (composerLine.length > 0) {
			var space;
			this.wrapInAbsElem({el_type: "composer", startChar: -1, endChar: -1, text: composerLine}, 'meta-top rhythm', function() {
				space = this.outputTextIf(this.padding.left + width, composerLine, 'composerfont', 'meta-top composer', 0, null, "end");
				return space[2];
			});
			this.moveY(space[1]);
		} else {
			this.moveY(rSpace[1]);
		}
		// TODO-PER: The following is a hack to make the elements line up with abcm2ps. Don't know where the extra space is coming from.
		this.moveY(-6);
	//} else if (this.isPrint) {
	//	// abcm2ps adds this space whether there is anything to write or not.
	//	this.moveY(this.spacing.composer);
	//	var space2 = this.controller.getTextSize.calc("M", 'composerfont', 'meta-top');
	//	this.moveY(space2.height);
	}

	if (abctune.metaText.author && abctune.metaText.author.length > 0) {
		var space3;
		this.wrapInAbsElem({el_type: "author", startChar: -1, endChar: -1, text: abctune.metaText.author}, 'meta-top author', function() {
			space3 = this.outputTextIf(this.padding.left + width, abctune.metaText.author, 'composerfont', 'meta-top author', 0, 0, "end");
			return space3[2];
		});
	}

	if (abctune.metaText.partOrder && abctune.metaText.partOrder.length > 0) {
		var space4;
		this.wrapInAbsElem({el_type: "partOrder", startChar: -1, endChar: -1, text: abctune.metaText.partOrder}, 'meta-top part-order', function() {
			space4 = this.outputTextIf(this.padding.left, abctune.metaText.partOrder, 'partsfont', 'meta-top part-order', 0, 0, "start");
			return space4[2];
		});
	}
};

Renderer.prototype.wrapInAbsElem = function(abcelem, klass, creator) {
	this.controller.currentAbsEl = new AbsoluteElement(abcelem, 0, 0, klass, this.controller.engraver.tuneNumber, {});
	var el = creator.bind(this)();
	this.controller.currentAbsEl.elemset = [el];
	return el;
};

/**
 * Text that goes below the score
 * @param {number} width
 * @param {object} abctune
 */
Renderer.prototype.engraveExtraText = function(width, abctune) {
	this.controller.classes.reset();

	if (abctune.metaText.unalignedWords && abctune.metaText.unalignedWords.length > 0) {
		this.wrapInAbsElem({el_type: "unalignedWords", startChar: -1, endChar: -1}, 'meta-bottom extra-text', function () {
			var hash = this.controller.getFontAndAttr.calc("wordsfont", 'meta-bottom unaligned-words');
			var space = this.controller.getTextSize.calc("i", 'wordsfont', 'meta-bottom unaligned-words');

			this.moveY(this.spacing.words, 1);
			var historyLen = this.controller.history.length;
			this.paper.openGroup({klass: "abcjs-meta-bottom abcjs-unaligned-words"});
			for (var j = 0; j < abctune.metaText.unalignedWords.length; j++) {
				if (abctune.metaText.unalignedWords[j] === '')
					this.moveY(hash.font.size, 1);
				else if (typeof abctune.metaText.unalignedWords[j] === 'string') {
					this.outputTextIf(this.padding.left + spacing.INDENT, abctune.metaText.unalignedWords[j], 'wordsfont', 'meta-bottom unaligned-words', 0, 0, "start", true);
				} else {
					var largestY = 0;
					var offsetX = 0;
					for (var k = 0; k < abctune.metaText.unalignedWords[j].length; k++) {
						var thisWord = abctune.metaText.unalignedWords[j][k];
						var type = (thisWord.font) ? thisWord.font : "wordsfont";
						renderText(this, {x: this.padding.left + spacing.INDENT + offsetX, y: this.y, text: thisWord.text, type: type, klass: 'meta-bottom unaligned-words', anchor: 'start', noClass: true});
						var size = this.controller.getTextSize.calc(thisWord.text, type, 'meta-bottom unaligned-words');
						largestY = Math.max(largestY, size.height);
						offsetX += size.width;
						// If the phrase ends in a space, then that is not counted in the width, so we need to add that in ourselves.
						if (thisWord.text[thisWord.text.length - 1] === ' ') {
							offsetX += space.width;
						}
					}
					this.moveY(largestY, 1);
				}
			}
			this.moveY(hash.font.size, 2);
			var g = this.paper.closeGroup();
			this.controller.combineHistory(this.controller.history.length-historyLen, g);
			return g;
		});
	}

	var extraText = "";
	if (abctune.metaText.book) extraText += "Book: " + abctune.metaText.book + "\n";
	if (abctune.metaText.source) extraText += "Source: " + abctune.metaText.source + "\n";
	if (abctune.metaText.discography) extraText += "Discography: " + abctune.metaText.discography + "\n";
	if (abctune.metaText.notes) extraText += "Notes: " + abctune.metaText.notes + "\n";
	if (abctune.metaText.transcription) extraText += "Transcription: " + abctune.metaText.transcription + "\n";
	if (abctune.metaText.history) extraText += "History: " + abctune.metaText.history + "\n";
	if (abctune.metaText['abc-copyright']) extraText += "Copyright: " + abctune.metaText['abc-copyright'] + "\n";
	if (abctune.metaText['abc-creator']) extraText += "Creator: " + abctune.metaText['abc-creator'] + "\n";
	if (abctune.metaText['abc-edited-by']) extraText += "Edited By: " + abctune.metaText['abc-edited-by'] + "\n";
	if (extraText.length > 0) {
		this.wrapInAbsElem({el_type: "extraText", startChar: -1, endChar: -1}, 'meta-bottom extra-text', function() {
			var el = this.outputTextIf(this.padding.left, extraText, 'historyfont', 'meta-bottom extra-text', this.spacing.info, 0, "start");
			return el[2];
		});
	}

	if (abctune.metaText.footer && this.isPrint) {
		this.controller.currentAbsEl = { tuneNumber: this.controller.engraver.tuneNumber, elemset: [], abcelem: { el_type: "footer", startChar: -1, endChar: -1, text: "" }};
		// Note: whether there is a footer or not doesn't change any other positioning, so this doesn't change the Y-coordinate.
		el = this.outputTextIf(this.padding.left, abctune.metaText.footer.left, 'footerfont', 'header meta-bottom', 0, null, 'start');
		if (el[2])
			this.controller.currentAbsEl.elemset.push(el[2]);
		el = this.outputTextIf(this.padding.left + width / 2, abctune.metaText.footer.center, 'footerfont', 'header meta-bottom', 0, null, 'middle');
		if (el[2])
			this.controller.currentAbsEl.elemset.push(el[2]);
		el = this.outputTextIf(this.padding.left + width, abctune.metaText.footer.right, 'footerfont', 'header meta-bottom', 0, null, 'end');
		if (el[2])
			this.controller.currentAbsEl.elemset.push(el[2]);
	}
};

Renderer.prototype.outputFreeText = function (text, vskip) {
	this.controller.currentAbsEl = { tuneNumber: this.controller.engraver.tuneNumber, elemset: [], abcelem: { el_type: "freeText", startChar: -1, endChar: -1, text: text }};
	if (vskip)
		this.moveY(vskip);
	var hash = this.controller.getFontAndAttr.calc('textfont', 'defined-text');
	if (text === "") {	// we do want to print out blank lines if they have been specified.
		this.moveY(hash.attr['font-size'] * 2); // move the distance of the line, plus the distance of the margin, which is also one line.
	} else if (typeof text === 'string') {
		this.moveY(hash.attr['font-size']/2); // TODO-PER: move down some - the y location should be the top of the text, but we output text specifying the center line.
		this.outputTextIf(this.padding.left, text, 'textfont', 'defined-text', 0, 0, "start");
	} else {
		var str = "";
		var isCentered = false; // The structure is wrong here: it requires an array to do centering, but it shouldn't have.
		for (var i = 0; i < text.length; i++) {
			if (text[i].font)
				str += "FONT(" + text[i].font + ")";
			str += text[i].text;
			if (text[i].center)
				isCentered = true;
		}
		var alignment = isCentered ? 'middle' : 'start';
		var x = isCentered ? this.controller.width / 2 : this.padding.left;
		this.outputTextIf(x, str, 'textfont', 'defined-text', 0, 1, alignment);
	}
};

/**
 * Output an extra subtitle that is defined later in the tune.
 */
Renderer.prototype.outputSubtitle = function (width, subtitle) {
	this.outputTextIf(this.padding.left + width / 2, subtitle, 'subtitlefont', 'text subtitle', this.spacing.subtitle, 0, 'middle');
};

/**
 * Calculates the y for a given pitch value (relative to the stave the renderer is currently printing)
 * @param {number} ofs pitch value (bottom C on a G clef = 0, D=1, etc.)
 */
Renderer.prototype.calcY = function(ofs) {
  return this.y - ofs*spacing.STEP;
};

/**
 *
 * @private
 */


Renderer.prototype.moveY = function (em, numLines) {
	if (numLines === undefined) numLines = 1;
	this.y += em*numLines;
};

Renderer.prototype.skipSpaceY = function () {
	this.y += this.space;
};

// Call with 'kind' being the font type to use,
// if marginBottom === null then don't increment the Y after printing, otherwise that is the extra number of em's to leave below the line.
// and alignment being "start", "middle", or "end".
Renderer.prototype.outputTextIf = function(x, str, kind, klass, marginTop, marginBottom, alignment, noClass) {
	if (str) {
		if (marginTop)
			this.moveY(marginTop);
		var el = renderText(this, {x: x, y: this.y, text: str, type: kind, klass: klass, anchor: alignment, noClass: noClass});
		var bb = this.controller.getTextSize.calc(str, kind, klass, el);
		var width = isNaN(bb.width) ? 0 : bb.width;
		var height = isNaN(bb.height) ? 0 : bb.height;
		var hash = this.controller.getFontAndAttr.calc(kind, klass);
		if (hash.font.box) {
			width += 8;
			height += 8;
		}
		if (marginBottom !== null) {
			var numLines = str.split("\n").length;
			if (!isNaN(bb.height))
				this.moveY(height/numLines, (numLines + marginBottom));
		}
		return [width, height, el];
	}
	return [0,0];
};

module.exports = Renderer;
