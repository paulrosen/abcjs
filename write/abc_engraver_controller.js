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

/**
 * @class
 * Controlls the engraving process, from ABCJS Abstract Syntax Tree (ABCJS AST) to rendered score sheet
 *
 * Call engraveABC to run the process. This creates a graphelems ABCJS Abstract Rendering Structure (ABCJS ARS) that can be accessed through this.staffgroups
 * this data structure is first laid out (giving the graphelems x and y coordinates) and then drawn onto the renderer
 * each ABCJS ARS represents a single staffgroup - all elements that are not in a staffgroup are rendered directly by the controller
 *
 * elements in ABCJS ARS know their "source data" in the ABCJS AST, and their "target shape" 
 * in the renderer for highlighting purposes
 *
 * renderer - API onto SVG/Raphael/whatever mechanism does the final rendering
 * params - all the params TODO-GD Document them. 
 */

ABCJS.write.EngraverController = function(paper, params) {
  params = params || {};
  this.space = 3*ABCJS.write.spacing.SPACE;
  this.glyphs = new ABCJS.write.Glyphs(); // we need the glyphs for layout information
  this.listeners = [];
  this.selected = [];
  this.ingroup = false;
  this.scale = params.scale || 1;
  this.staffwidth = params.staffwidth || 740;
  this.paddingtop = params.paddingtop || 15;
  this.paddingbottom = params.paddingbottom || 30;
  this.paddingright = params.paddingright || 50;
  this.paddingleft = params.paddingleft || 15;
  this.editable = params.editable || false;
  this.staffgroups = null;

  //TODO-GD factor out all calls directly made to renderer.paper and fix all the coupling issues below
  this.renderer=new ABCJS.write.Renderer(paper, this.glyphs);
  this.renderer.y = 0; // TODO-GD should manage renderer's y through an API
  this.renderer.scale = this.scale; // TODO-GD should manage scale in only one place (probably renderer)
  this.renderer.controller = this; // TODO-GD needed for highlighting
  this.renderer.paddingleft = this.paddingleft; //TODO-GD used in VoiceElement.draw
};

/**
 * run the engraving process on abctunes (can be a single or array of ABCJS AST)
 *
 */
ABCJS.write.EngraverController.prototype.engraveABC = function(abctunes) {
  if (abctunes[0]===undefined) {
    abctunes = [abctunes];
  }
  this.renderer.y=0;

  for (var i = 0; i < abctunes.length; i++) {
    this.engraveTune(abctunes[i]);
  }
};

ABCJS.write.EngraverController.prototype.engraveTune = function (abctune) {
  this.engraver = new ABCJS.write.AbstractEngraver(this.glyphs, abctune.formatting.bagpipes);
  this.engraver.controller = this;	// TODO-PER: this is a hack to get access, but it tightens the coupling.

  // FIXED BELOW, NEEDS CHECKING if (abctune.formatting.stretchlast) { this.renderer.paper.text(200, this.renderer.y, "Format: stretchlast"); this.renderer.y += 20; }
  this.width = abctune.formatting.staffwidth || this.staffwidth;
  this.width+=this.paddingleft;
  this.scale = abctune.formatting.scale || this.scale;
  this.renderer.scale = this.scale;

  this.engraveTopText(abctune);

  this.staffgroups = [];
  var maxwidth = this.width;
  for(var line=0; line<abctune.lines.length; line++) {
    var abcline = abctune.lines[line];
    if (abcline.staff) {
		staffgroup = this.engraveStaffLine(abctune, abcline, line); //TODO-GD factor out generating the staffgroup, from laying it out, from rendering it
		if (staffgroup.w > maxwidth) maxwidth = staffgroup.w;
    } else if (abcline.subtitle && line!==0) {
      this.engraveSubtitleLine(abcline);
      this.renderer.y+=20*this.scale; //hardcoded
    } else if (abcline.text) {
		if (typeof abcline.text === 'string')
	      this.renderer.paper.text(100, this.renderer.y, "TEXT: " + abcline.text);
	  else {
		  var str = "";
		  for (var i = 0; i < abcline.text.length; i++) {
			  str += " FONT " + abcline.text[i].text;
		  }
	      this.renderer.paper.text(100, this.renderer.y, "TEXT: " + str);
	  }
      this.renderer.y+=20*this.scale; //hardcoded
    }
  }

  this.engraveExtraText(abctune);
  

  var sizetoset = {w: (maxwidth+this.paddingright)*this.scale,h: (this.renderer.y+this.paddingbottom)*this.scale};
  this.renderer.paper.setSize(sizetoset.w,sizetoset.h);
  // Correct for IE problem in calculating height
  var isIE=/*@cc_on!@*/false;//IE detector
  if (isIE) {
    this.renderer.paper.canvas.parentNode.style.width=sizetoset.w+"px";
    this.renderer.paper.canvas.parentNode.style.height=""+sizetoset.h+"px";
  } else
    this.renderer.paper.canvas.parentNode.setAttribute("style","width:"+sizetoset.w+"px");
};

ABCJS.write.EngraverController.prototype.engraveStaffLine = function (abctune, abcline, line) {
  var staffgroup = this.engraver.createABCLine(abcline.staff);
  this.renderer.minY = this.engraver.minY; // use this value of minY to set things that need to be below everything else //TODO-GD fix it, horrible hack
  var newspace = this.space;
  for (var it = 0; it < 3; it++) { // TODO shouldn't need this triple pass any more
    staffgroup.layout(newspace, this, false);
    if (line && line === abctune.lines.length - 1 && staffgroup.w / this.width < 0.66 && !abctune.formatting.stretchlast) break; // don't stretch last line too much unless it is 1st
    var relspace = staffgroup.spacingunits * newspace;
    var constspace = staffgroup.w - relspace;
    if (staffgroup.spacingunits > 0) {
      newspace = (this.width - constspace) / staffgroup.spacingunits;
      if (newspace * staffgroup.minspace > 50) {
	newspace = 50 / staffgroup.minspace;
      }
    }
  }
  staffgroup.draw(this.renderer, this.renderer.y);
  this.staffgroups[this.staffgroups.length] = staffgroup;
  this.renderer.y = staffgroup.y + staffgroup.height;
  this.renderer.y += ABCJS.write.spacing.STAVEHEIGHT * 0.2;
  return staffgroup;
};

ABCJS.write.EngraverController.prototype.engraveTopText = function(abctune) {
 if (abctune.media === 'print') {
       // TODO create the page the size of
    //  tune.formatting.pageheight by tune.formatting.pagewidth
       // create margins the size of
      // TODO-PER: setting the defaults to 3/4" for now. What is the real value?
    var m = abctune.formatting.topmargin === undefined ? 54 : abctune.formatting.topmargin;
    this.renderer.y+=m;
    // TODO tune.formatting.botmargin
//    m = abctune.formatting.leftmargin === undefined ? 54 : abctune.formatting.leftmargin;
//    this.paddingleft = m;
//      m = abctune.formatting.rightmargin === undefined ? 54 : abctune.formatting.rightmargin;
//    this.paddingright = m;
  }
  else {
      this.renderer.y+=this.paddingtop;
  }

  if (abctune.metaText.title) {
    this.renderer.paper.text(this.width*this.scale/2, this.renderer.y, abctune.metaText.title).attr({"font-size":20*this.scale, "font-family":"serif"});
  }
  this.renderer.y+=20*this.scale;
  if (abctune.lines[0] && abctune.lines[0].subtitle) {
    this.engraveSubtitleLine(abctune.lines[0]);
    this.renderer.y+=20*this.scale;
  }
  if (abctune.metaText.rhythm) {
    this.renderer.paper.text(this.paddingleft, this.renderer.y, abctune.metaText.rhythm).attr({"text-anchor":"start","font-style":"italic","font-family":"serif", "font-size":12*this.scale});
    !(abctune.metaText.author || abctune.metaText.origin || abctune.metaText.composer) && (this.renderer.y+=15*this.scale);
  }
	var composerLine = "";
	if (abctune.metaText.composer) composerLine += abctune.metaText.composer;
	if (abctune.metaText.origin) composerLine += ' (' + abctune.metaText.origin + ')';
  if (composerLine.length > 0) {this.renderer.paper.text(this.width*this.scale, this.renderer.y, composerLine).attr({"text-anchor":"end","font-style":"italic","font-family":"serif", "font-size":12*this.scale});this.renderer.y+=15;}
	if (abctune.metaText.author) {this.renderer.paper.text(this.width*this.scale, this.renderer.y, abctune.metaText.author).attr({"text-anchor":"end","font-style":"italic","font-family":"serif", "font-size":12*this.scale}); this.renderer.y+=15;}
  if (abctune.metaText.tempo && !abctune.metaText.tempo.suppress) {
	  this.renderer.y = this.engraveTempo(abctune.metaText.tempo, this.renderer.y, 50);
	  this.renderer.y += 20*this.scale;
  }

};

ABCJS.write.EngraverController.prototype.engraveExtraText = function(abctune) {
  var extraText = "";
  var text2;
  var height;
  if (abctune.metaText.partOrder) extraText += "Part Order: " + abctune.metaText.partOrder + "\n";
  if (abctune.metaText.unalignedWords) {
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
    text2 = this.renderer.paper.text(this.paddingleft*this.scale+50*this.scale, this.renderer.y*this.scale+25*this.scale, extraText).attr({"text-anchor":"start", "font-family":"serif", "font-size":17*this.scale});
    height = text2.getBBox().height + 17*this.scale;
    text2.translate(0,height/2);
    this.renderer.y+=height;
    extraText = "";
  }
  if (abctune.metaText.book) extraText += "Book: " + abctune.metaText.book + "\n";
  if (abctune.metaText.source) extraText += "Source: " + abctune.metaText.source + "\n";
  if (abctune.metaText.discography) extraText += "Discography: " + abctune.metaText.discography + "\n";
  if (abctune.metaText.notes) extraText += "Notes: " + abctune.metaText.notes + "\n";
  if (abctune.metaText.transcription) extraText += "Transcription: " + abctune.metaText.transcription + "\n";
  if (abctune.metaText.history) extraText += "History: " + abctune.metaText.history + "\n";
  text2 = this.renderer.paper.text(this.paddingleft, this.renderer.y*this.scale+25*this.scale, extraText).attr({"text-anchor":"start", "font-family":"serif", "font-size":17*this.scale});
  height = text2.getBBox().height;
  if (!height) height = 25*this.scale;	// TODO-PER: Hack! Don't know why Raphael chokes on this sometimes and returns NaN. Perhaps only when printing to PDF? Possibly if the SVG is hidden?
  text2.translate(0,height/2);
  this.renderer.y+=25*this.scale+height*this.scale;
};

ABCJS.write.EngraverController.prototype.engraveTempo = function (tempo, y, x) {
	var fontStyle = {"text-anchor":"start", 'font-size':12*this.scale, 'font-weight':'bold'};
	if (tempo.preString) {
		var text = this.renderer.paper.text(x*this.scale, y*this.scale + 20*this.scale, tempo.preString).attr(fontStyle);
		x += (text.getBBox().width + 20*this.scale);
	}
	if (tempo.duration) {
		var temposcale = 0.75*this.scale;
		var tempopitch = 14.5;
		var duration = tempo.duration[0]; // TODO when multiple durations
		var abselem = new ABCJS.write.AbsoluteElement(tempo, duration, 1);
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
			var width = -0.6*this.scale;
			abselem.addExtra(new ABCJS.write.RelativeElement(null, dx, 0, p1, {"type":"stem", "pitch2":p2, linewidth:width}));
		}
		abselem.x = x*(1/this.scale); // TODO-PER: For some reason it scales this element twice, so just compensate.
		abselem.draw(this.renderer, null);
		x += (abselem.w + 5*this.scale);
		text = this.renderer.paper.text(x, y*this.scale + 20*this.scale, "= " + tempo.bpm).attr(fontStyle);
		x += text.getBBox().width + 10*this.scale;
	}
	if (tempo.postString) {
		this.renderer.paper.text(x, y*this.scale + 20*this.scale, tempo.postString).attr(fontStyle);
	}
	y += 15*this.scale;
	return y;
};

ABCJS.write.EngraverController.prototype.engraveSubtitleLine = function(abcline) {
  this.renderer.paper.text(this.width/2, this.renderer.y, abcline.subtitle).attr({"font-size":16}).scale(this.scale, this.scale, 0,0);
};

// below, methods dealing with hightlighting
// notify all listeners that a graphical element has been selected
ABCJS.write.EngraverController.prototype.notifySelect = function (abselem) {
  this.clearSelection();
  this.selected = [abselem];
  abselem.highlight();
  for (var i=0; i<this.listeners.length;i++) {
    this.listeners[i].highlight(abselem.abcelem);
  }
};

ABCJS.write.EngraverController.prototype.notifyChange = function (abselem) {
  for (var i=0; i<this.listeners.length;i++) {
    this.listeners[i].modelChanged();
  }
};

ABCJS.write.EngraverController.prototype.clearSelection = function () {
  for (var i=0;i<this.selected.length;i++) {
    this.selected[i].unhighlight();
  }
  this.selected = [];
};

ABCJS.write.EngraverController.prototype.addSelectListener = function (listener) {
  this.listeners[this.listeners.length] = listener;
};

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