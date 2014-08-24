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
 * @param {ABCJS.write.Glyphs} glyphs
 * @param {bool} doRegression
 */
ABCJS.write.Renderer = function(paper, glyphs, doRegression) {
  this.paper = paper;
  this.glyphs = glyphs;
  this.controller = null; //TODO-GD only used when drawing the ABCJS ARS to connect the controller with the elements for highlighting

	this.space = 3*ABCJS.write.spacing.SPACE;
  this.minY = null; // set at each drawing of a stave by the controller - place for lyrics, crescendo and other dynamics
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
		this.paper.canvas.style['-ms-tranform'] = "scale("+scale+","+scale+")";
		this.paper.canvas.style['-webkit-tranform'] = "scale("+scale+","+scale+")";
		this.paper.canvas.style['transform-origin'] = "0 0";
		this.paper.canvas.style['-ms-transform-origin-x'] = "0";
		this.paper.canvas.style['-ms-transform-origin-y'] = "0";
		this.paper.canvas.style['-webkit-transform-origin-x'] = "0";
		this.paper.canvas.style['-webkit-transform-origin-y'] = "0";
	} else {
		this.paper.canvas.style.transform = "";
		this.paper.canvas.style['-ms-tranform'] = "";
		this.paper.canvas.style['-webkit-tranform'] = "";
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
};

/**
 * Set the the values for all the configurable vertical space options.
 */
ABCJS.write.Renderer.prototype.initVerticalSpace = function() {
	// conversion: 37.7953 = conversion factor for cm to px
	this.spacing = {
		composer: 7.56, // Set the vertical space above the composer.
		graceBefore: 8.67, // Define the space before, inside and after the grace notes.
		graceInside: 10.67,
		graceAfter: 16,
		info: 0, // Set the vertical space above the infoline.
		lineSkipFactor: 1.1, // Set the factor for spacing between lines of text. (multiply this by the font size)
		music: 7.56, // Set the vertical space above the first staff.
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
		paragraphSkipFactor: 0.4, // Set the factor for spacing between text paragraphs. (multiply this by the font size)
		parts: 11.33, // Set the vertical space above a new part.
		slurHeight: 1.0, // Set the slur height factor.
		staffSeparation: 61.33, // Do not put a staff system closer than <unit> from the previous system.
		stemHeight: 26.67, // Set the stem height.
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

	 noteSpacingFactor: 1.414, // Set the note spacing factor to <float> (range 1..2).

scale <float> Default: 0.75 Set the page scale factor. Note that the header and footer are not scaled.

stretchlast <float>Default: 0.8
Stretch the last music line of a tune when it exceeds
the <float> fraction of the page width.
<float> range is 0.0 to 1.0.
	 */
};

/**
 * Leave space at the top of the paper
 * @param {object} abctune
 */
ABCJS.write.Renderer.prototype.topMargin = function(abctune) {
		this.skipSpaceY(this.padding.top);
};

/**
 * Text that goes above the score
 * @param {number} width
 * @param {object} abctune
 */
ABCJS.write.Renderer.prototype.engraveTopText = function(width, abctune) {
	var space;
	if (abctune.metaText.header && this.isPrint) {
		// Note: whether there is a header or not doesn't change any other positioning, so this doesn't change the Y-coordinate.
		this.outputTextIf(this.padding.left, abctune.metaText.header.left, 'headerfont', 'header meta-top', null, 'start');
		this.outputTextIf(this.padding.left + width / 2, abctune.metaText.header.center, 'headerfont', 'header meta-top', null, 'middle');
		this.outputTextIf(this.padding.left + width, abctune.metaText.header.right, 'headerfont', 'header meta-top', null, 'end');
	}
	this.outputTextIf(this.padding.left + width / 2, abctune.metaText.title, 'titlefont', 'title meta-top', 0);
	if (abctune.lines[0])
		this.outputTextIf(this.padding.left + width / 2, abctune.lines[0].subtitle, 'subtitlefont', 'text meta-top', 0);

	if (abctune.metaText.rhythm || abctune.metaText.origin || abctune.metaText.composer) {
		this.outputTextIf(this.padding.left, abctune.metaText.rhythm, 'infofont', 'meta-top', null, "start");

		var composerLine = "";
		if (abctune.metaText.composer) composerLine += abctune.metaText.composer;
		if (abctune.metaText.origin) composerLine += ' (' + abctune.metaText.origin + ')';
		space = this.outputTextIf(this.padding.left + width, composerLine, 'composerfont', 'meta-top', null, "end");
		this.moveY(space[1], 1);
	}

	this.outputTextIf(this.padding.left + width, abctune.metaText.author, 'composerfont', 'meta-top', 0, "end");
	this.skipSpaceY();

	this.outputTextIf(this.padding.left, abctune.metaText.partOrder, 'partsfont', 'meta-bottom', 0, "start");

	this.engraveTempo(this.padding.left + ABCJS.write.spacing.INDENT, abctune.metaText.tempo);
};

/**
 * Text that goes below the score
 * @param {number} width
 * @param {object} abctune
 */
ABCJS.write.Renderer.prototype.engraveExtraText = function(width, abctune) {
	this.lineNumber = null;
	this.measureNumber = null;

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
		this.outputTextIf(this.padding.left + ABCJS.write.spacing.INDENT, extraText, 'wordsfont', 'meta-bottom', 2, "start");
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
	this.outputTextIf(this.padding.left, extraText, 'historyfont', 'meta-bottom', 0, "start");

	if (abctune.metaText.footer && this.isPrint) {
		var space = this.outputTextIf(this.padding.left, abctune.metaText.footer.left, 'footerfont', 'header meta-bottom', null, 'start');
		var space2 = this.outputTextIf(this.padding.left + width / 2, abctune.metaText.footer.center, 'footerfont', 'header meta-bottom', null, 'middle');
		var space3 = this.outputTextIf(this.padding.left + width, abctune.metaText.footer.right, 'footerfont', 'header meta-bottom', null, 'end');
		this.y += Math.max(space[1], space2[1], space3[1]);
	}
};

/**
 *
 * The tempo marking
 * @param {number} x
 * @param {object} tempo
 */
ABCJS.write.Renderer.prototype.engraveTempo = function (x, tempo) {
	if (!tempo || tempo.suppress) return;

	var text;
	var noteHeight = 20; // the note height of 20 was just determined empirically.
	var totalHeight = noteHeight;
	if (tempo.preString) {
		text = this.renderText(x, this.y+noteHeight, tempo.preString, 'tempofont', 'tempo',"start");
		var preWidth = text.getBBox().width;
		var charWidth = preWidth / tempo.preString.length; // Just get some average number to increase the spacing.
		x += preWidth + charWidth;
		totalHeight = Math.max(totalHeight, text.getBBox().height);
	}
	if (tempo.duration) {
		var temposcale = 0.75;
		var tempopitch = 11;
		var duration = tempo.duration[0]; // TODO when multiple durations
		var abselem = new ABCJS.write.AbsoluteElement(tempo, duration, 1, 'tempo');
		var durlog = Math.floor(Math.log(duration) / Math.log(2));
		var dot = 0;
		for (var tot = Math.pow(2, durlog), inc = tot / 2; tot < duration; dot++, tot += inc, inc /= 2);
		var c = this.engraver.chartable.note[-durlog];
		var flag = this.engraver.chartable.uflags[-durlog];
		var temponote = this.engraver.createNoteHead(abselem,
			c,
			{verticalPos:tempopitch},
			"up",
			0,
			0,
			flag,
			dot,
			0,
			temposcale
		);
		abselem.addHead(temponote);
		if (duration < 1) {
			var p1 = tempopitch + 1 / 3 * temposcale;
			var p2 = tempopitch + 7 * temposcale;
			var dx = temponote.dx + temponote.w;
			var width = -0.6;
			abselem.addExtra(new ABCJS.write.RelativeElement(null, dx, 0, p1, {"type":"stem", "pitch2":p2, linewidth:width}));
		}
		abselem.x = x;
		abselem.draw(this, null);
		x += (abselem.w + 5);
		var str = "= " + tempo.bpm;
		text = this.renderText(x, this.y+noteHeight, str, 'tempofont', 'tempo',"start");
		var postWidth = text.getBBox().width;
		var charWidth2 = postWidth / str.length; // Just get some average number to increase the spacing.
		x += postWidth + charWidth2;
		totalHeight = Math.max(totalHeight, text.getBBox().height);
	}
	if (tempo.postString) {
		this.renderText(x, this.y+noteHeight, tempo.postString, 'tempofont', 'tempo',"start");
		totalHeight = Math.max(totalHeight, text.getBBox().height);
	}
	this.moveY(totalHeight, 2.5);
};

/**
 * Output text defined with %%text.
 * @param {array or string} text
 */
ABCJS.write.Renderer.prototype.outputFreeText = function (text) {
	if (typeof text === 'string')
		this.outputTextIf(this.padding.left, text, 'textfont', 'defined-text', 1, "start");
	else {
		var str = "";
		for (var i = 0; i < text.length; i++) {
			str += " FONT " + text[i].text;
		}
		this.outputTextIf(this.padding.left, str, 'textfont', 'defined-text', 1, "start");
	}
};

/**
 * Output an extra subtitle that is defined later in the tune.
 */
ABCJS.write.Renderer.prototype.outputSubtitle = function (width, subtitle) {
	this.renderer.outputTextIf(this.padding.left + width / 2, subtitle, 'subtitlefont', 'text meta-top', 0);
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
ABCJS.write.Renderer.prototype.printStaveLine = function (x1,x2, pitch) {
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
  var ret = this.paper.path().attr({path:pathString, stroke:"none", fill:fill, 'class': this.addClasses('staff')}).toBack();
  if (this.doRegression) this.addToRegression(ret);

  return ret;
};

/**
 * gets scaled if not in a group
 * @param {number} x1 x coordinate of the stem
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
      ycorr = this.glyphs.getYCorr(symbol.charAt(i));
      el = this.glyphs.printSymbol(x+dx, this.calcY(offset+ycorr), symbol.charAt(i), this.paper, klass);
      if (el) {
	if (this.doRegression) this.addToRegression(el);
	elemset.push(el);
	dx+=this.glyphs.getSymbolWidth(symbol.charAt(i));
      } else {
				this.renderText(x, this.y, "no symbol:" +symbol, "debugfont", 'debug-msg', 'start');
      }
    }
    return elemset;
  } else {
    ycorr = this.glyphs.getYCorr(symbol);
    if (this.ingroup) {
      this.addPath(this.glyphs.getPathForSymbol(x, this.calcY(offset+ycorr), symbol, scalex, scaley));
    } else {
      el = this.glyphs.printSymbol(x, this.calcY(offset+ycorr), symbol, this.paper, klass);
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

ABCJS.write.Renderer.prototype.drawArc = function(x1, x2, pitch1, pitch2, above) {


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
  var ret = this.paper.path().attr({path:pathString, stroke:"none", fill:"#000000", 'class': this.addClasses('slur')});
  if (this.doRegression) this.addToRegression(ret);

  return ret;
};
/**
 * Calculates the y for a given pitch value (relative to the stave the renderer is currently printing)
 * @param {number} ofs pitch value (bottom C on a G clef = 0, D=1, etc.)
 */
ABCJS.write.Renderer.prototype.calcY = function(ofs) {
  return this.y+((ABCJS.write.spacing.TOPNOTE-ofs)*ABCJS.write.spacing.STEP);
};

/**
 * Print @param {number} numLines. If there is 1 line it is the B line. Otherwise the bottom line is the E line.
 */
ABCJS.write.Renderer.prototype.printStave = function (startx, endx, numLines) {
	// If there is one line, it is the B line. Otherwise, the bottom line is the E line.
	if (numLines === 1) {
		this.printStaveLine(startx,endx,6);
		return;
	}
	for (var i = 0; i < numLines; i++) {
		this.printStaveLine(startx,endx,(i+1)*2);
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
	return ret.join(' ');
};

ABCJS.write.Renderer.prototype.getFontAndAttr = function(type, klass) {
	var font = this.abctune.formatting[type];
	// Raphael deliberately changes the font units to pixels for some reason, so we need to change points to pixels here.
	if (!font)
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

ABCJS.write.Renderer.prototype.renderText = function(x, y, text, type, klass, anchor) {
	var hash = this.getFontAndAttr(type, klass);
	if (anchor)
		hash.attr["text-anchor"] = anchor;
	text = text.replace(/\n\n/g, "\n \n");
	var el = this.paper.text(x, y, text).attr(hash.attr);
	// The text will be placed centered in vertical alignment, so we need to move the box down so that
	// the top of the text is where we've requested.
	var size = el.getBBox();
	el.attr({ "y": y+size.height/2 });
	if (hash.font.box) {
		this.paper.rect(size.x-1,size.y-1,size.width+2,size.height+2).attr({"stroke":"#cccccc"});
	}
	if (type === 'debugfont') {
		console.log("Debug msg: " + text);
		el.attr({ stroke: "#ff0000"});
	}
	if (this.doRegression) this.addToRegression(el);
	return el;
};

ABCJS.write.Renderer.prototype.moveY = function (em, numLines) {
	this.y += em*numLines;
};

ABCJS.write.Renderer.prototype.skipSpaceY = function () {
	this.y += this.space;
};

// Call with 'kind' being the font type to use,
// if margin === null then don't increment the Y after printing, otherwise that is the extra number of em's to leave below the line.
// and alignment being "start", "middle", or "end".
ABCJS.write.Renderer.prototype.outputTextIf = function(x, str, kind, klass, margin, alignment) {
	if (str) {
		var el = this.renderText(x, this.y, str, kind, klass, alignment);
		if (margin !== null) {
			var numLines = str.split("\n").length;
			this.moveY(el.getBBox().height/numLines, (numLines + margin));
		}
		return [el.getBBox().width, el.getBBox().height];
	}
	return [0,0];
};

// For debugging, it is sometimes useful to know where you are vertically.
ABCJS.write.Renderer.prototype.printHorizontalLine = function (width) {
	var dy = 0.35;
	var fill = "#0000aa";
	var y = this.y;
	this.paper.text(10, y, ""+Math.round(y)).attr({"text-anchor": "start", "font-size":"18px", fill: fill, stroke: fill });
	var x1 = 50;
	var x2 = width;
	var pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y-dy, x2, y-dy,
		x2, y+dy, x1, y+dy);
	this.paper.path().attr({path:pathString, stroke:"none", fill:fill, 'class': this.addClasses('staff')}).toBack();
	for (var i = 1; i < width/100; i++) {
		pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", i*100-dy, y-5, i*100-dy, y+5,
			i*100+dy, y-5, i*100+dy, y+5);
		this.paper.path().attr({path:pathString, stroke:"none", fill:fill, 'class': this.addClasses('staff')}).toBack();
	}
};

ABCJS.write.Renderer.prototype.printVerticalLine = function (x, y1, y2) {
	var dy = 0.35;
	var fill = "#0000aa";
	var pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", x - dy, y1, x - dy, y2,
			x + dy, y1, x + dy, y2);
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
