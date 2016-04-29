//    abc_renderer.js: API to render to SVG/Raphael/whatever rendering engine
//    Copyright (C) 2010 Gregory Dyke (gregdyke at gmail dot com)
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


/*global window, ABCJS, Math, console */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

/**
 * Implements the API for rendering ABCJS Abstract Rendering Structure to a canvas/paper (e.g. SVG, Raphael, etc)
 * @param {Object} paper
 * @param {bool} doRegression
 */
ABCJS.write.Renderer = function(paper, doRegression) {
	this.paper = paper;
	this.controller = null; //TODO-GD only used when drawing the ABCJS ARS to connect the controller with the elements for highlighting

	this.space = 3*ABCJS.write.spacing.SPACE;
	this.padding = {}; // renderer's padding is managed by the controller
	this.doRegression = doRegression;
	if (this.doRegression)
		this.regressionLines = [];
	this.reset();
};

ABCJS.write.Renderer.prototype.reset = function() {

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

/**
 * Set whether we are formatting this for the screen, or as a preview for creating a PDF version.
 * @param {bool} isPrint
 */
ABCJS.write.Renderer.prototype.setPrintMode = function (isPrint) {
	this.isPrint = isPrint;
};

/**
 * Set the size of the canvas.
 * @param {object} maxwidth
 * @param {object} scale
 */
ABCJS.write.Renderer.prototype.setPaperSize = function (maxwidth, scale) {
	var w = (maxwidth+this.padding.right)*scale;
	var h = (this.y+this.padding.bottom)*scale;
	if (this.isPrint)
		h = Math.max(h, 1056); // 11in x 72pt/in x 1.33px/pt
	// TODO-PER: We are letting the page get as long as it needs now, but eventually that should go to a second page.
	if (this.doRegression)
		this.regressionLines.push("PAPER SIZE: ("+w+","+h+")");

	this.paper.setSize(w/scale,h/scale);
	// Correct for IE problem in calculating height
	var isIE=/*@cc_on!@*/false;//IE detector
	if (isIE) {
		this.paper.canvas.parentNode.style.width=w+"px";
		this.paper.canvas.parentNode.style.height=""+h+"px";
	} else
		this.paper.canvas.parentNode.setAttribute("style","width:"+w+"px");
	if (scale !== 1) {
		this.paper.canvas.style.transform = "scale("+scale+","+scale+")";
		this.paper.canvas.style['-ms-transform'] = "scale("+scale+","+scale+")";
		this.paper.canvas.style['-webkit-transform'] = "scale("+scale+","+scale+")";
		this.paper.canvas.style['transform-origin'] = "0 0";
		this.paper.canvas.style['-ms-transform-origin-x'] = "0";
		this.paper.canvas.style['-ms-transform-origin-y'] = "0";
		this.paper.canvas.style['-webkit-transform-origin-x'] = "0";
		this.paper.canvas.style['-webkit-transform-origin-y'] = "0";
	} else {
		this.paper.canvas.style.transform = "";
		this.paper.canvas.style['-ms-transform'] = "";
		this.paper.canvas.style['-webkit-transform'] = "";
	}
	this.paper.canvas.parentNode.style.overflow="hidden";
	this.paper.canvas.parentNode.style.height=""+h+"px";
};

/**
 * Set the padding
 * @param {object} params
 */
ABCJS.write.Renderer.prototype.setPaddingOverride = function(params) {
	this.paddingOverride = { top: params.paddingtop, bottom: params.paddingbottom,
		right: params.paddingright, left: params.paddingleft };
};

/**
 * Set the padding
 * @param {object} params
 */
ABCJS.write.Renderer.prototype.setPadding = function(abctune) {
	// If the padding is set in the tune, then use that.
	// Otherwise, if the padding is set in the override, use that.
	// Otherwise, use the defaults (there are a different set of defaults for screen and print.)
	function setPaddingVariable(self, paddingKey, formattingKey, printDefault, screenDefault) {
		if (abctune.formatting[formattingKey] !== undefined)
			self.padding[paddingKey] = abctune.formatting[formattingKey];
		else if (self.paddingOverride[paddingKey] !== undefined)
			self.padding[paddingKey] = self.paddingOverride[paddingKey];
		else if (abctune.media === 'print')
			self.padding[paddingKey] = printDefault;
		else
			self.padding[paddingKey] = screenDefault;
	}
	// 1cm x 0.393701in/cm x 72pt/in x 1.33px/pt = 38px
	// 1.8cm x 0.393701in/cm x 72pt/in x 1.33px/pt = 68px
	setPaddingVariable(this, 'top', 'topmargin', 38, 15);
	setPaddingVariable(this, 'bottom', 'bottommargin', 38, 15);
	setPaddingVariable(this, 'left', 'leftmargin', 68, 15);
	setPaddingVariable(this, 'right', 'rightmargin', 68, 15);
};

/**
 * Some of the items on the page are not scaled, so adjust them in the opposite direction of scaling to cancel out the scaling.
 * @param {float} scale
 */
ABCJS.write.Renderer.prototype.adjustNonScaledItems = function (scale) {
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
ABCJS.write.Renderer.prototype.initVerticalSpace = function() {
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

ABCJS.write.Renderer.prototype.setVerticalSpace = function(formatting) {
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
ABCJS.write.Renderer.prototype.topMargin = function(abctune) {
	this.moveY(this.padding.top);
};

/**
 * Leave space before printing the music
 */
ABCJS.write.Renderer.prototype.addMusicPadding = function() {
	this.moveY(this.spacing.music);
};

/**
 * Leave space before printing a staff system
 */
ABCJS.write.Renderer.prototype.addStaffPadding = function(lastStaffGroup, thisStaffGroup) {
	var lastStaff = lastStaffGroup.staffs[lastStaffGroup.staffs.length-1];
	var lastBottomLine = -(lastStaff.bottom - 2); // The 2 is because the scale goes to 2 below the last line.
	var nextTopLine = thisStaffGroup.staffs[0].top - 10; // Because 10 represents the top line.
	var naturalSeparation = nextTopLine + lastBottomLine; // This is how far apart they'd be without extra spacing
	var separationInPixels = naturalSeparation * ABCJS.write.spacing.STEP;
	if (separationInPixels < this.spacing.staffSeparation)
		this.moveY(this.spacing.staffSeparation-separationInPixels);
};

/**
 * Text that goes above the score
 * @param {number} width
 * @param {object} abctune
 */
ABCJS.write.Renderer.prototype.engraveTopText = function(width, abctune) {
	if (abctune.metaText.header && this.isPrint) {
		// Note: whether there is a header or not doesn't change any other positioning, so this doesn't change the Y-coordinate.
		// This text goes above the margin, so we'll temporarily move up.
		var headerTextHeight = this.getTextSize("XXXX", "headerfont", 'header meta-top').height;
		this.y -=headerTextHeight;
		this.outputTextIf(this.padding.left, abctune.metaText.header.left, 'headerfont', 'header meta-top', 0, null, 'start');
		this.outputTextIf(this.padding.left + width / 2, abctune.metaText.header.center, 'headerfont', 'header meta-top', 0, null, 'middle');
		this.outputTextIf(this.padding.left + width, abctune.metaText.header.right, 'headerfont', 'header meta-top', 0, null, 'end');
		this.y += headerTextHeight;
	}
	if (this.isPrint)
		this.moveY(this.spacing.top);
	this.outputTextIf(this.padding.left + width / 2, abctune.metaText.title, 'titlefont', 'title meta-top', this.spacing.title, 0, 'middle');
	if (abctune.lines[0])
		this.outputTextIf(this.padding.left + width / 2, abctune.lines[0].subtitle, 'subtitlefont', 'text meta-top', this.spacing.subtitle, 0, 'middle');

	if (abctune.metaText.rhythm || abctune.metaText.origin || abctune.metaText.composer) {
		this.moveY(this.spacing.composer);
		var rSpace = this.outputTextIf(this.padding.left, abctune.metaText.rhythm, 'infofont', 'meta-top', 0, null, "start");

		var composerLine = "";
		if (abctune.metaText.composer) composerLine += abctune.metaText.composer;
		if (abctune.metaText.origin) composerLine += ' (' + abctune.metaText.origin + ')';
		if (composerLine.length > 0) {
			var space = this.outputTextIf(this.padding.left + width, composerLine, 'composerfont', 'meta-top', 0, null, "end");
			this.moveY(space[1]);
		} else {
			this.moveY(rSpace[1]);
		}
		// TODO-PER: The following is a hack to make the elements line up with abcm2ps. Don't know where the extra space is coming from.
		this.moveY(-6);
		//} else if (this.isPrint) {
		//	// abcm2ps adds this space whether there is anything to write or not.
		//	this.moveY(this.spacing.composer);
		//	var space2 = this.getTextSize("M", 'composerfont', 'meta-top');
		//	this.moveY(space2.height);
	}

	this.outputTextIf(this.padding.left + width, abctune.metaText.author, 'composerfont', 'meta-top', 0, 0, "end");
	//this.skipSpaceY();

	this.outputTextIf(this.padding.left, abctune.metaText.partOrder, 'partsfont', 'meta-bottom', 0, 0, "start");
};

/**
 * Text that goes below the score
 * @param {number} width
 * @param {object} abctune
 */
ABCJS.write.Renderer.prototype.engraveExtraText = function(width, abctune) {
	this.lineNumber = null;
	this.measureNumber = null;
	this.voiceNumber = null;

	var extraText;
	if (abctune.metaText.unalignedWords) {
		extraText = "";
		for (var j = 0; j < abctune.metaText.unalignedWords.length; j++) {
			if (typeof abctune.metaText.unalignedWords[j] === 'string')
				extraText += abctune.metaText.unalignedWords[j] + "\n";
			else {
				for (var k = 0; k < abctune.metaText.unalignedWords[j].length; k++) {
					extraText += " FONT " + abctune.metaText.unalignedWords[j][k].text;
				}
				extraText += "\n";
			}
		}
		this.outputTextIf(this.padding.left + ABCJS.write.spacing.INDENT, extraText, 'wordsfont', 'meta-bottom', this.spacing.words, 2, "start");
	}

	extraText = "";
	if (abctune.metaText.book) extraText += "Book: " + abctune.metaText.book + "\n";
	if (abctune.metaText.source) extraText += "Source: " + abctune.metaText.source + "\n";
	if (abctune.metaText.discography) extraText += "Discography: " + abctune.metaText.discography + "\n";
	if (abctune.metaText.notes) extraText += "Notes: " + abctune.metaText.notes + "\n";
	if (abctune.metaText.transcription) extraText += "Transcription: " + abctune.metaText.transcription + "\n";
	if (abctune.metaText.history) extraText += "History: " + abctune.metaText.history + "\n";
	if (abctune.metaText['abc-copyright']) extraText += "Copyright: " + abctune.metaText['abc-copyright'] + "\n";
	if (abctune.metaText['abc-creator']) extraText += "Creator: " + abctune.metaText['abc-creator'] + "\n";
	if (abctune.metaText['abc-edited-by']) extraText += "Edited By: " + abctune.metaText['abc-edited-by'] + "\n";
	this.outputTextIf(this.padding.left, extraText, 'historyfont', 'meta-bottom', this.spacing.info, 0, "start");

	if (abctune.metaText.footer && this.isPrint) {
		// Note: whether there is a footer or not doesn't change any other positioning, so this doesn't change the Y-coordinate.
		this.outputTextIf(this.padding.left, abctune.metaText.footer.left, 'footerfont', 'header meta-bottom', 0, null, 'start');
		this.outputTextIf(this.padding.left + width / 2, abctune.metaText.footer.center, 'footerfont', 'header meta-bottom', 0, null, 'middle');
		this.outputTextIf(this.padding.left + width, abctune.metaText.footer.right, 'footerfont', 'header meta-bottom', 0, null, 'end');
	}
};

/**
 * Output text defined with %%text.
 * @param {array or string} text
 */
ABCJS.write.Renderer.prototype.outputFreeText = function (text) {
	if (typeof text === 'string')
		this.outputTextIf(this.padding.left, text, 'textfont', 'defined-text', 0, 1, "start");
	else {
		var str = "";
		for (var i = 0; i < text.length; i++) {
			str += " FONT " + text[i].text;
		}
		this.outputTextIf(this.padding.left, str, 'textfont', 'defined-text', 0, 1, "start");
	}
};

/**
 * Output an extra subtitle that is defined later in the tune.
 */
ABCJS.write.Renderer.prototype.outputSubtitle = function (width, subtitle) {
	this.outputTextIf(this.padding.left + width / 2, subtitle, 'subtitlefont', 'text meta-top', this.spacing.subtitle, 0, 'middle');
};

/**
 * Begin a group of glyphs that will always be moved, scaled and highlighted together
 */
ABCJS.write.Renderer.prototype.beginGroup = function () {
	this.path = [];
	this.lastM = [0,0];
	this.ingroup = true;
};

/**
 * Add a path to the current group
 * @param {Array} path
 * @private
 */
ABCJS.write.Renderer.prototype.addPath = function (path) {
	path = path || [];
	if (path.length===0) return;
	path[0][0]="m";
	path[0][1]-=this.lastM[0];
	path[0][2]-=this.lastM[1];
	this.lastM[0]+=path[0][1];
	this.lastM[1]+=path[0][2];
	this.path.push(path[0]);
	for (var i=1,ii=path.length;i<ii;i++) {
		if (path[i][0]==="m") {
			this.lastM[0]+=path[i][1];
			this.lastM[1]+=path[i][2];
		}
		this.path.push(path[i]);
	}
};

/**
 * End a group of glyphs that will always be moved, scaled and highlighted together
 */
ABCJS.write.Renderer.prototype.endGroup = function (klass) {
	this.ingroup = false;
	if (this.path.length===0) return null;
	var ret = this.paper.path().attr({path:this.path, stroke:"none", fill:"#000000", 'class': this.addClasses(klass)});
	this.path = [];
	if (this.doRegression) this.addToRegression(ret);

	return ret;
};

/**
 * gets scaled
 * @param {number} x1 start x
 * @param {number} x2 end x
 * @param {number} pitch pitch the stave line is drawn at
 */
ABCJS.write.Renderer.prototype.printStaveLine = function (x1,x2, pitch, klass) {
	var extraClass = "staff";
	if (klass !== undefined)
		extraClass += " " + klass;
	var isIE=/*@cc_on!@*/false;//IE detector
	var dy = 0.35;
	var fill = "#000000";
	if (isIE) {
		dy = 1;
		fill = "#666666";
	}
	var y = this.calcY(pitch);
	var pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y-dy, x2, y-dy,
		x2, y+dy, x1, y+dy);
	var ret = this.paper.path().attr({path:pathString, stroke:"none", fill:fill, 'class': this.addClasses(extraClass)}).toBack();
	if (this.doRegression) this.addToRegression(ret);

	return ret;
};

/**
 * gets scaled if not in a group
 * @param {number} x x coordinate of the stem
 * @param {number} dx stem width
 * @param {number} y1 y coordinate of the stem bottom
 * @param {number} y2 y coordinate of the stem top
 */
ABCJS.write.Renderer.prototype.printStem = function (x, dx, y1, y2) {
	if (dx<0) { // correct path "handedness" for intersection with other elements
		var tmp = y2;
		y2 = y1;
		y1 = tmp;
	}
	var isIE=/*@cc_on!@*/false;//IE detector
	var fill = "#000000";
	if (isIE && dx<1) {
		dx = 1;
		fill = "#666666";
	}
	if (~~x === x) x+=0.05; // raphael does weird rounding (for VML)
	var pathArray = [["M",x,y1],["L", x, y2],["L", x+dx, y2],["L",x+dx,y1],["z"]];
	if (!isIE && this.ingroup) {
		this.addPath(pathArray);
	} else {
		var ret = this.paper.path().attr({path:pathArray, stroke:"none", fill:fill, 'class': this.addClasses('stem')}).toBack();
		if (this.doRegression) this.addToRegression(ret);

		return ret;
	}
};

function kernSymbols(lastSymbol, thisSymbol, lastSymbolWidth) {
	// This is just some adjustments to make it look better.
	var width = lastSymbolWidth;
	if (lastSymbol === 'f' && thisSymbol === 'f')
		width = width*2/3;
	if (lastSymbol === 'p' && thisSymbol === 'p')
		width = width*5/6;
	if (lastSymbol === 'f' && thisSymbol === 'z')
		width = width*5/8;
	return width;
}

/**
 * assumes this.y is set appropriately
 * if symbol is a multichar string without a . (as in scripts.staccato) 1 symbol per char is assumed
 * not scaled if not in printgroup
 */
ABCJS.write.Renderer.prototype.printSymbol = function(x, offset, symbol, scalex, scaley, klass) {
	var el;
	var ycorr;
	if (!symbol) return null;
	if (symbol.length>0 && symbol.indexOf(".")<0) {
		var elemset = this.paper.set();
		var dx =0;
		for (var i=0; i<symbol.length; i++) {
			var s = symbol.charAt(i);
			ycorr = ABCJS.write.glyphs.getYCorr(s);
			el = ABCJS.write.glyphs.printSymbol(x+dx, this.calcY(offset+ycorr), s, this.paper, klass);
			if (el) {
				if (this.doRegression) this.addToRegression(el);
				elemset.push(el);
				if (i < symbol.length-1)
					dx+= kernSymbols(s, symbol.charAt(i+1), ABCJS.write.glyphs.getSymbolWidth(s));
			} else {
				this.renderText(x, this.y, "no symbol:" +symbol, "debugfont", 'debug-msg', 'start');
			}
		}
		return elemset;
	} else {
		ycorr = ABCJS.write.glyphs.getYCorr(symbol);
		if (this.ingroup) {
			this.addPath(ABCJS.write.glyphs.getPathForSymbol(x, this.calcY(offset+ycorr), symbol, scalex, scaley));
		} else {
			el = ABCJS.write.glyphs.printSymbol(x, this.calcY(offset+ycorr), symbol, this.paper, klass);
			if (el) {
				if (this.doRegression) this.addToRegression(el);
				return el;
			} else
				this.renderText(x, this.y, "no symbol:" +symbol, "debugfont", 'debug-msg', 'start');
		}
		return null;
	}
};


ABCJS.write.Renderer.prototype.printPath = function (attrs) {
	var ret = this.paper.path().attr(attrs);
	if (this.doRegression) this.addToRegression(ret);
	return ret;
};

ABCJS.write.Renderer.prototype.drawBrace = function(y1, y2) {//Tony
	// Here we draw the first half of the brace, this will be drawn from the top to the mid point between staves
	var x1 =12;
	var x2 = 5;
	var y3 = y2; //This is now the bottom of the staves
	var y2 = (y1+y2)/2; //Get the mid point between the staves
	var controlx1 = x1-15;
	var controly1 = y1+20;
	var controlx2 = x2+20;
	var controly2 = y2-15;
	var thickness = 2.5;
	var pathString = ABCJS.write.sprintf("M %f %f C %f %f %f %f %f %f C %f %f %f %f %f %f z", x1, y1,
		controlx1, controly1, controlx2, controly2, x2, y2,
		controlx2-thickness, controly2+thickness, controlx1-thickness, controly1+thickness, x1, y1);
	var ret1 = this.paper.path().attr({path:pathString, stroke:"#000000", fill:"#000000", 'class': this.addClasses('brace')});

	//Now we draw the second half of the brace, this will be drawn from the bottom to the mid point between the staves
	var controlx1 = x2+18;
	var controly1 = y2+20;
	var controlx2 = x1-15;
	var controly2 = y3-20;
	var thickness = 2.5;
	var pathString = ABCJS.write.sprintf("M %f %f C %f %f %f %f %f %f C %f %f %f %f %f %f z", x2, y2,
		controlx1, controly1, controlx2, controly2, x1, y3,
		controlx2+thickness, controly2+thickness, controlx1+thickness, controly1+thickness, x2, y2);
	var ret2 = this.paper.path().attr({path:pathString, stroke:"#000000", fill:"#000000", 'class': this.addClasses('brace')});


	if (this.doRegression){
		this.addToRegression(ret1);
		this.addToRegression(ret2);
	}
	return ret1 + ret2;
};//var pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", 5, y1, 5, y2, 5+thickness, y2, 5+thickness, y1 );

ABCJS.write.Renderer.prototype.drawArc = function(x1, x2, pitch1, pitch2, above, klass) {


	x1 = x1 + 6;
	x2 = x2 + 4;
	pitch1 = pitch1 + ((above)?1.5:-1.5);
	pitch2 = pitch2 + ((above)?1.5:-1.5);
	var y1 = this.calcY(pitch1);
	var y2 = this.calcY(pitch2);

	//unit direction vector
	var dx = x2-x1;
	var dy = y2-y1;
	var norm= Math.sqrt(dx*dx+dy*dy);
	var ux = dx/norm;
	var uy = dy/norm;

	var flatten = norm/3.5;
	var curve = ((above)?-1:1)*Math.min(25, Math.max(4, flatten));

	var controlx1 = x1+flatten*ux-curve*uy;
	var controly1 = y1+flatten*uy+curve*ux;
	var controlx2 = x2-flatten*ux-curve*uy;
	var controly2 = y2-flatten*uy+curve*ux;
	var thickness = 2;
	var pathString = ABCJS.write.sprintf("M %f %f C %f %f %f %f %f %f C %f %f %f %f %f %f z", x1, y1,
		controlx1, controly1, controlx2, controly2, x2, y2,
		controlx2-thickness*uy, controly2+thickness*ux, controlx1-thickness*uy, controly1+thickness*ux, x1, y1);
	if (klass)
		klass += ' slur';
	else
		klass = 'slur';
	var ret = this.paper.path().attr({path:pathString, stroke:"none", fill:"#000000", 'class': this.addClasses(klass)});
	if (this.doRegression) this.addToRegression(ret);

	return ret;
};
/**
 * Calculates the y for a given pitch value (relative to the stave the renderer is currently printing)
 * @param {number} ofs pitch value (bottom C on a G clef = 0, D=1, etc.)
 */
ABCJS.write.Renderer.prototype.calcY = function(ofs) {
	return this.y - ofs*ABCJS.write.spacing.STEP;
};

/**
 * Print @param {number} numLines. If there is 1 line it is the B line. Otherwise the bottom line is the E line.
 */
ABCJS.write.Renderer.prototype.printStave = function (startx, endx, numLines) {
	var klass = "top-line";
	// If there is one line, it is the B line. Otherwise, the bottom line is the E line.
	if (numLines === 1) {
		this.printStaveLine(startx,endx,6, klass);
		return;
	}
	for (var i = numLines-1; i >= 0; i--) {
		this.printStaveLine(startx,endx,(i+1)*2, klass);
		klass = undefined;
	}
};

/**
 *
 * @private
 */
ABCJS.write.Renderer.prototype.addClasses = function (c) {
	var ret = [];
	if (c.length > 0) ret.push(c);
	if (this.lineNumber !== null) ret.push("l"+this.lineNumber);
	if (this.measureNumber !== null) ret.push("m"+this.measureNumber);
	if (this.voiceNumber !== null) ret.push("v"+this.voiceNumber);
	return ret.join(' ');
};

ABCJS.write.Renderer.prototype.getFontAndAttr = function(type, klass) {
	var font = this.abctune.formatting[type];
	// Raphael deliberately changes the font units to pixels for some reason, so we need to change points to pixels here.
	if (font)
		font = { face: font.face, size: font.size*4/3, decoration: font.decoration, style: font.style, weight: font.weight };
	else
		font = { face: "Arial", size: 12*4/3, decoration: "underline", style: "normal", weight: "normal" };

	var attr = {"font-size": font.size, 'font-style': font.style,
		"font-family": font.face, 'font-weight': font.weight, 'text-decoration': font.decoration,
		'class': this.addClasses(klass) };
	attr.font = "";	// There is a spurious font definition that is put on all text elements. This overwrites it.
	return { font: font, attr: attr };
};

ABCJS.write.Renderer.prototype.getTextSize = function(text, type, klass) {
	var hash = this.getFontAndAttr(type, klass);
	var el = this.paper.text(0,0, text).attr(hash.attr);
	var size = el.getBBox();
	el.remove();
	return size;
};

ABCJS.write.Renderer.prototype.renderText = function(x, y, text, type, klass, anchor, centerVertically) {
	var hash = this.getFontAndAttr(type, klass);
	if (anchor)
		hash.attr["text-anchor"] = anchor;
	text = text.replace(/\n\n/g, "\n \n");
	var el = this.paper.text(x, y, text).attr(hash.attr);
	if (!centerVertically) {
		// The text will be placed centered in vertical alignment, so we need to move the box down so that
		// the top of the text is where we've requested.
		var size = el.getBBox();
		el.attr({ "y": y + size.height / 2 });
		if (hash.font.box) {
			this.paper.rect(size.x - 1, size.y - 1, size.width + 2, size.height + 2).attr({"stroke": "#cccccc"});
		}
	}
	if (type === 'debugfont') {
		console.log("Debug msg: " + text);
		el.attr({ stroke: "#ff0000"});
	}
	if (this.doRegression) this.addToRegression(el);
	return el;
};

ABCJS.write.Renderer.prototype.moveY = function (em, numLines) {
	if (numLines === undefined) numLines = 1;
	this.y += em*numLines;
};

ABCJS.write.Renderer.prototype.skipSpaceY = function () {
	this.y += this.space;
};

// Call with 'kind' being the font type to use,
// if marginBottom === null then don't increment the Y after printing, otherwise that is the extra number of em's to leave below the line.
// and alignment being "start", "middle", or "end".
ABCJS.write.Renderer.prototype.outputTextIf = function(x, str, kind, klass, marginTop, marginBottom, alignment) {
	if (str) {
		if (marginTop)
			this.moveY(marginTop);
		var el = this.renderText(x, this.y, str, kind, klass, alignment);
		if (marginBottom !== null) {
			var numLines = str.split("\n").length;
			this.moveY(el.getBBox().height/numLines, (numLines + marginBottom));
		}
		return [el.getBBox().width, el.getBBox().height];
	}
	return [0,0];
};

// For debugging, it is sometimes useful to know where you are vertically.
ABCJS.write.Renderer.prototype.printHorizontalLine = function (width, vertical, comment) {
	var dy = 0.35;
	var fill = "rgba(0,0,255,.4)";
	var y = this.y;
	if (vertical) y = vertical;
	y = Math.round(y);
	this.paper.text(10, y, ""+Math.round(y)).attr({"text-anchor": "start", "font-size":"18px", fill: fill, stroke: fill });
	var x1 = 50;
	var x2 = width;
	var pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y-dy, x1+x2, y-dy,
		x2, y+dy, x1, y+dy);
	this.paper.path().attr({path:pathString, stroke:"none", fill:fill, 'class': this.addClasses('staff')}).toBack();
	for (var i = 1; i < width/100; i++) {
		pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", i*100-dy, y-5, i*100-dy, y+5,
			i*100+dy, y-5, i*100+dy, y+5);
		this.paper.path().attr({path:pathString, stroke:"none", fill:fill, 'class': this.addClasses('staff')}).toBack();
	}
	if (comment)
		this.paper.text(width+70, y, comment).attr({"text-anchor": "start", "font-size":"18px", fill: fill, stroke: fill });
};

ABCJS.write.Renderer.prototype.printShadedBox = function (x, y, width, height, color, comment) {
	var box = this.paper.rect(x, y, width, height).attr({fill: color, stroke: color });
	if (comment)
		this.paper.text(0, y+7, comment).attr({"text-anchor": "start", "font-size":"14px", fill: "rgba(0,0,255,.4)", stroke: "rgba(0,0,255,.4)" });
	return box;
};

ABCJS.write.Renderer.prototype.printVerticalLine = function (x, y1, y2) {
	var dy = 0.35;
	var fill = "#00aaaa";
	var pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", x - dy, y1, x - dy, y2,
		x + dy, y1, x + dy, y2);
	this.paper.path().attr({path: pathString, stroke: "none", fill: fill, 'class': this.addClasses('staff')}).toBack();
	pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", x - 20, y1, x - 20, y1+3,
		x, y1, x, y1+3);
	this.paper.path().attr({path: pathString, stroke: "none", fill: fill, 'class': this.addClasses('staff')}).toBack();
	pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", x + 20, y2, x + 20, y2+3,
		x, y2, x, y2+3);
	this.paper.path().attr({path: pathString, stroke: "none", fill: fill, 'class': this.addClasses('staff')}).toBack();

};

/**
 * @private
 */
ABCJS.write.Renderer.prototype.addToRegression = function (el) {
	var box = el.getBBox();
	//var str = "("+box.x+","+box.y+")["+box.width+","+box.height+"] "
	var str = el.type + ' ' + box.toString() + ' ';
	var attrs = [];
	for (var key in el.attrs) {
		if (el.attrs.hasOwnProperty(key)) {
			if (key === 'class')
				str = el.attrs[key] + " " + str;
			else
				attrs.push(key+": "+el.attrs[key]);
		}
	}
	attrs.sort();
	str += "{ " +attrs.join(" ") + " }";
	this.regressionLines.push(str);
};
