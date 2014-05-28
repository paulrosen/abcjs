//    abc_write.js: Prints an abc file parsed by abc_parse.js
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


/*global window, ABCJS, Math */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

ABCJS.write.spacing = function() {};
ABCJS.write.spacing.FONTEM = 360;
ABCJS.write.spacing.FONTSIZE = 30;
ABCJS.write.spacing.STEP = ABCJS.write.spacing.FONTSIZE*(93)/720;
ABCJS.write.spacing.SPACE = 10;
ABCJS.write.spacing.TOPNOTE = 10; 
ABCJS.write.spacing.STAVEHEIGHT = 100;


//--------------------------------------------------------------------PRINTER

ABCJS.write.Printer = function(paper, params ) {
  params = params || {};
  this.y = 0;
  this.paper = paper;
  this.space = 3*ABCJS.write.spacing.SPACE;
  this.glyphs = new ABCJS.write.Glyphs();
  this.listeners = [];
  this.selected = [];
  this.ingroup = false;
  this.scale = params.scale || 1;
  this.staffwidth = params.staffwidth || 1024;
  this.paddingtop = params.paddingtop || 15;
  this.paddingbottom = params.paddingbottom || 30;
  this.paddingright = params.paddingright || 50;
  this.paddingleft = params.paddingleft || 15;
  this.editable = params.editable || false;
  //this.accordion = accordion;
  this.staffgroups = [];
};

// notify all listeners that a graphical element has been selected
ABCJS.write.Printer.prototype.notifySelect = function (abselem) {
  //this.selected = [abselem];
  this.selected[this.selected.length]=abselem;
  abselem.highlight();
  for (var i=0; i<this.listeners.length;i++) {
    this.listeners[i].highlight(abselem.abcelem);
  }
};

// notify all listeners that a graphical element has been selected
ABCJS.write.Printer.prototype.notifyClearNSelect = function (abselem) {
  this.clearSelection();
  this.notifySelect(abselem);
};

ABCJS.write.Printer.prototype.notifyChange = function (abselem) {
  for (var i=0; i<this.listeners.length;i++) {
    this.listeners[i].modelChanged();
  }
};

ABCJS.write.Printer.prototype.clearSelection = function () {
  for (var i=0;i<this.selected.length;i++) {
    this.selected[i].unhighlight();
  }
  this.selected = [];
};

ABCJS.write.Printer.prototype.addSelectListener = function (listener) {
  this.listeners[this.listeners.length] = listener;
};

ABCJS.write.Printer.prototype.rangeHighlight = function(start,end)
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

ABCJS.write.Printer.prototype.beginGroup = function () {
  this.path = [];
  this.lastM = [0,0];
  this.ingroup = true;
};

ABCJS.write.Printer.prototype.addPath = function (path) {
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

ABCJS.write.Printer.prototype.endGroup = function () {
  this.ingroup = false;
  if (this.path.length===0) return null;
  var ret = this.paper.path().attr({path:this.path, stroke:"none", fill:"#000000"});
  if (this.scale!==1) {
    ret.scale(this.scale, this.scale, 0, 0);
  }
  return ret;
};

ABCJS.write.Printer.prototype.printStave = function (startx, endx, staff ) {
    if(staff.numLines === 4) {
      // para 3 elementos  
      this.printStaveLine(startx,endx,2); // 2
      this.printStaveLine(startx,endx,8.5); // 8.5
      
      // para 1 ou 2 elementos
      //this.printStaveLine(startx,endx,0); 
      //this.printStaveLine(startx,endx,5); 
      
      this.printStaveLine(startx,endx,15); // 15
      this.printStaveLine(startx,endx,19.5); // 19.5
    } else {
      for (var i = 0; i < staff.numLines; i++) {
        this.printStaveLine(startx,endx,(i+1)*2);
      }
    }
};
ABCJS.write.Printer.prototype.printLedger = function (x1,x2, pitch) {
    x = this.abctune;
    return  this.doPrintStaveLine(x1,x2,pitch, true);
};

ABCJS.write.Printer.prototype.printStaveLine = function (x1,x2, pitch) {
    return  this.doPrintStaveLine(x1,x2,pitch, false);
};

ABCJS.write.Printer.prototype.printDebugLine = function (x1,x2, y, fill ) {
  var dy = 0.35;
  var pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y-dy, x2, y-dy, x2, y+dy, x1, y+dy);
  var ret = this.paper.path().attr({path:pathString, stroke:"none", fill:fill}).toBack();
    
  if (this.scale!==1) {
    ret.scale(this.scale, this.scale, 0, 0);
  }
  return ret;
    
};

ABCJS.write.Printer.prototype.doPrintStaveLine = function (x1,x2, pitch, isLedger ) {
  var isIE=/*@cc_on!@*/false;//IE detector
  var dy = 0.35;
  var fill = "#000000";
  if (isIE) {
    dy = 1;
    fill = "#666666";
  }
  
  var y = this.calcY(pitch);
  var pathString = ABCJS.write.sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y-dy, x2, y-dy, x2, y+dy, x1, y+dy);
  var ret;
  if( (!isLedger /*&& ( pitch >= 2 && pitch <= 10 )*/ ) || ( isLedger && (pitch < 2 || pitch > 10) ) ) {
    ret = this.paper.path().attr({path:pathString, stroke:"none", fill:fill}).toBack();
  } else {
    ret = null;
  }

  if (this.scale!==1) {
    ret.scale(this.scale, this.scale, 0, 0);
  }
  return ret;
};


ABCJS.write.Printer.prototype.printStem = function (x, dx, y1, y2) {
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
    var ret = this.paper.path().attr({path:pathArray, stroke:"none", fill:fill}).toBack();
    if (this.scale!==1) {
      ret.scale(this.scale, this.scale, 0, 0);
    }
    return ret;
  }
};

ABCJS.write.Printer.prototype.printTabText = function (x, offset, text, size, anchor) {
  anchor = anchor || "start";
  size = size || 14;
  if(text==="--->") anchor = "middle";
  var ret = this.paper.text(x*this.scale, this.calcY(offset)*this.scale, text).attr({"text-anchor":anchor, "font-size":size*this.scale});
  return ret;
};

ABCJS.write.Printer.prototype.printTabText2 = function (x, offset, text, size, anchor) {
    return this.printTabText(x, offset, text, 12, anchor);
};

ABCJS.write.Printer.prototype.printTabText3 = function (x, offset, text, size, anchor) {
    return this.printTabText(x, offset, text, 10, anchor);
};

ABCJS.write.Printer.prototype.printText = function (x, offset, text, anchor) {
  anchor = anchor || "start";
  var ret = this.paper.text(x*this.scale, this.calcY(offset)*this.scale, text).attr({"text-anchor":anchor, "font-size":12*this.scale});
  return ret;
};

// assumes this.y is set appropriately
// if symbol is a multichar string without a . (as in scripts.staccato) 1 symbol per char is assumed
// not scaled if not in printgroup
ABCJS.write.Printer.prototype.printSymbol = function(x, offset, symbol, scalex, scaley) {
	var el;
  if (!symbol) return null;
  if (symbol.length>0 && symbol.indexOf(".")<0) {
    var elemset = this.paper.set();
    var dx =0;
    for (var i=0; i<symbol.length; i++) {
      var ycorr = this.glyphs.getYCorr(symbol.charAt(i));
      el = this.glyphs.printSymbol(x+dx, this.calcY(offset+ycorr), symbol.charAt(i), this.paper);
      if (el) {
	elemset.push(el);
	dx+=this.glyphs.getSymbolWidth(symbol.charAt(i));
      } else {
	this.printDebugMsg(x, this.calcY(offset), "no symbol:" +symbol);
      }
    }
    if (this.scale!==1) {
      elemset.scale(this.scale, this.scale, 0, 0);
    }
    return elemset;
  } else {
    var ycorr = this.glyphs.getYCorr(symbol);
    if (this.ingroup) {
      this.addPath(this.glyphs.getPathForSymbol(x, this.calcY(offset+ycorr), symbol, scalex, scaley));
    } else {
      el = this.glyphs.printSymbol(x, this.calcY(offset+ycorr), symbol, this.paper);
      if (el) {
	if (this.scale!==1) {
	  el.scale(this.scale, this.scale, 0, 0);
	}
	return el;
      } else
	this.printDebugMsg(x, this.calcY(offset), "no symbol:" +symbol);
    }
    return null;    
  }
};

ABCJS.write.Printer.prototype.printPath = function (attrs) {
  var ret = this.paper.path().attr(attrs);
  if (this.scale!==1) ret.scale(this.scale, this.scale, 0, 0);
  return ret;
};

ABCJS.write.Printer.prototype.drawArc = function(x1, x2, pitch1, pitch2, above) {


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
  var ret = this.paper.path().attr({path:pathString, stroke:"none", fill:"#000000"});
  if (this.scale!==1) {
    ret.scale(this.scale, this.scale, 0, 0);
  }
  return ret;
};

ABCJS.write.Printer.prototype.printDebugMsg = function(x, y, msg ) {
  return this.paper.text(x, y, msg).scale(this.scale, this.scale, 0, 0);
};

ABCJS.write.Printer.prototype.printLyrics = function(x, ypos, msg) {
    var y = this.calcY(ypos);
    var el = this.paper.text(x, y, msg).attr({"font-family":"Times New Roman", "font-weight":'bold', "font-size":14, "text-anchor":"start"}).scale(this.scale, this.scale, 0, 0);
    el[0].setAttribute("class", "abc-lyric");
    return el;
};

ABCJS.write.Printer.prototype.calcY = function(ofs) {
  return this.y+((ABCJS.write.spacing.TOPNOTE-ofs)*ABCJS.write.spacing.STEP); // flavio
};

ABCJS.write.Printer.prototype.printABC = function(abctunes) {
  if (abctunes[0]===undefined) {
    abctunes = [abctunes];
  }
  this.y=0;

  for (var i = 0; i < abctunes.length; i++) {
    this.printTune(abctunes[i]);
  }

};

ABCJS.write.Printer.prototype.printTempo = function (tempo, paper, layouter, y, printer, x) {
	var fontStyle = {"text-anchor":"start", 'font-size':12*printer.scale, 'font-weight':'bold'};
	if (tempo.preString) {
		var text = paper.text(x*printer.scale, y*printer.scale + 20*printer.scale, tempo.preString).attr(fontStyle);
		x += (text.getBBox().width + 20*printer.scale);
	}
	if (tempo.duration) {
		var temposcale = 0.75 * printer.scale;
    		var tempopitch = 4.5; // flavio - was 14.5;
		var duration = tempo.duration[0]; // TODO when multiple durations
		var abselem = new ABCJS.write.AbsoluteElement(tempo, duration, 1);
		var durlog = Math.floor(Math.log(duration) / Math.log(2));
		var dot = 0;
		for (var tot = Math.pow(2, durlog), inc = tot / 2; tot < duration; dot++, tot += inc, inc /= 2);
		var c = ABCJS.write.chartable.note[-durlog];
		var flag = ABCJS.write.chartable.uflags[-durlog];
		var temponote = layouter.printNoteHead(abselem,
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
			var width = -0.6*printer.scale;
			abselem.addExtra(new ABCJS.write.RelativeElement(null, dx, 0, p1, {"type":"stem", "pitch2":p2, linewidth:width}));
		}
		abselem.x = x*(1/printer.scale); // TODO-PER: For some reason it scales this element twice, so just compensate.
		abselem.draw(printer, null);
		x += (abselem.w + 5*printer.scale);
		text = paper.text(x, y*printer.scale + 20*printer.scale, "= " + tempo.bpm).attr(fontStyle);
		x += text.getBBox().width + 10*printer.scale;
	}
	if (tempo.postString) {
		paper.text(x, y*printer.scale + 20*printer.scale, tempo.postString).attr(fontStyle);
	}
	y += 15*printer.scale;
	return y;
};

ABCJS.write.Printer.prototype.printTune = function(abctune) {
    
    if( abctune.lines.length === 0 ) return;
    
    this.layouter = new ABCJS.write.Layout( this, abctune.formatting.bagpipes );
    if (abctune.media === 'print') {
        // TODO create the page the size of
        //  tune.formatting.pageheight by tune.formatting.pagewidth
        // create margins the size of
        // TODO-PER: setting the defaults to 3/4" for now. What is the real value?
        var m = abctune.formatting.topmargin === undefined ? 54 : abctune.formatting.topmargin;
        this.y += m;
        // TODO tune.formatting.botmargin
        //    m = abctune.formatting.leftmargin === undefined ? 54 : abctune.formatting.leftmargin;
        //    this.paddingleft = m;
        //      m = abctune.formatting.rightmargin === undefined ? 54 : abctune.formatting.rightmargin;
        //    this.paddingright = m;
    }
    else
        this.y += this.paddingtop;

    // FIXED BELOW, NEEDS CHECKING if (abctune.formatting.stretchlast) { this.paper.text(200, this.y, "Format: stretchlast"); this.y += 20; }
    if (abctune.formatting.staffwidth) {
        this.width = abctune.formatting.staffwidth;
    } else {
        this.width = this.staffwidth;
    }

    this.width += this.paddingleft;

    if (abctune.formatting.scale) {
        this.scale = abctune.formatting.scale;
    }
    if (abctune.metaText.title) {
        this.y += 5 * this.scale;
        this.paper.text(this.width * this.scale / 2, this.y, abctune.metaText.title).attr({"font-size": 20 * this.scale, "font-family": "serif"});
        this.y += 20 * this.scale;
    }    

    if (abctune.lines[0].staffs[0].subtitle) {
        this.printSubtitleLine(abctune.lines[0].staffs[0].subtitle);
        this.y += 20 * this.scale;
    }

    if (abctune.metaText.rhythm) {
        this.paper.text(this.paddingleft, this.y, abctune.metaText.rhythm).attr({"text-anchor": "start", "font-style": "italic", "font-family": "serif", "font-size": 12 * this.scale});
        !(abctune.metaText.author || abctune.metaText.origin || abctune.metaText.composer) && (this.y += 15 * this.scale);
    }

    var composerLine = "";
    var meta = false;
    if (abctune.metaText.composer)
        composerLine += abctune.metaText.composer;
    if (abctune.metaText.origin)
        composerLine += ' (' + abctune.metaText.origin + ')';

    if (composerLine.length > 0) {
        this.paper.text(this.width * this.scale, this.y, composerLine).attr({"text-anchor": "end", "font-style": "italic", "font-family": "serif", "font-size": 12 * this.scale});
        //this.y += 15* this.scale;
        meta = true;
    }
    if (abctune.metaText.author) {
        this.paper.text(this.width * this.scale, this.y, abctune.metaText.author).attr({"text-anchor": "end", "font-style": "italic", "font-family": "serif", "font-size": 12 * this.scale});
        //this.y += 15* this.scale;
        meta = true;
    }

    if (abctune.metaText.tempo && !abctune.metaText.tempo.suppress) {
        this.y = this.printTempo(abctune.metaText.tempo, this.paper, this.layouter, this.y, this, this.paddingleft + 10);
        meta = true;
    }

    (meta) && (this.y += 15 * this.scale);

    var maxwidth = this.width;
    for (var line = 0; line < abctune.lines.length; line++) {
        var abcline = abctune.lines[line];
        var staffgroup = this.printStaffLine(abctune, line);
        if (staffgroup.w > maxwidth)
            maxwidth = staffgroup.w;
        if (abcline.text) {
            alert('abcline.text should should no longer exists!');
        }
    }

    var extraText = "";
    var text2;
    var height;
    if (abctune.metaText.partOrder)
        extraText += "Part Order: " + abctune.metaText.partOrder + "\n";
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
        text2 = this.paper.text(this.paddingleft * this.scale + 50 * this.scale, this.y * this.scale + 25 * this.scale, extraText).attr({"text-anchor": "start", "font-family": "serif", "font-size": 17 * this.scale});
        height = text2.getBBox().height + 17 * this.scale;
        text2.translate(0, height / 2);
        this.y += height;
        extraText = "";
    }
    if (abctune.metaText.book)
        extraText += "Book: " + abctune.metaText.book + "\n";
    if (abctune.metaText.source)
        extraText += "Source: " + abctune.metaText.source + "\n";
    if (abctune.metaText.discography)
        extraText += "Discography: " + abctune.metaText.discography + "\n";
    if (abctune.metaText.notes)
        extraText += "Notes: " + abctune.metaText.notes + "\n";
    if (abctune.metaText.transcription)
        extraText += "Transcription: " + abctune.metaText.transcription + "\n";
    if (abctune.metaText.history)
        extraText += "History: " + abctune.metaText.history + "\n";
    text2 = this.paper.text(this.paddingleft, this.y * this.scale + 25 * this.scale, extraText).attr({"text-anchor": "start", "font-family": "serif", "font-size": 17 * this.scale});
    height = text2.getBBox().height;
    if (!height)
        height = 25 * this.scale;	// TODO-PER: Hack! Don't know why Raphael chokes on this sometimes and returns NaN. Perhaps only when printing to PDF? Possibly if the SVG is hidden?
    text2.translate(0, height / 2);
    this.y += 25 * this.scale + height * this.scale;
    var sizetoset = {w: (maxwidth + this.paddingright) * this.scale, h: (this.y + this.paddingbottom) * this.scale};
    this.paper.setSize(sizetoset.w, sizetoset.h);
    // Correct for IE problem in calculating height
    var isIE = /*@cc_on!@*/false;//IE detector
    if (isIE) {
        this.paper.canvas.parentNode.style.width = sizetoset.w + "px";
        this.paper.canvas.parentNode.style.height = "" + sizetoset.h + "px";
    } else
        this.paper.canvas.parentNode.setAttribute("style", "width:" + sizetoset.w + "px");
};

ABCJS.write.Printer.prototype.printSubtitleLine = function(subtitle) {
  this.paper.text(this.width/2, this.y, subtitle).attr({"font-size":16}).scale(this.scale, this.scale, 0,0);
};

ABCJS.write.Printer.prototype.printStaffLine = function (abctune, line) {
        var n = this.staffgroups.length;
        this.staffgroups[n] = this.layouter.layoutABCLine(abctune, line);
        this.staffgroups[n].draw( this, line );
	return this.staffgroups[n];
};
