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

/*global sprintf */
/*global ABCLineLayout */
/*extern ABCPrinter */


var AbcSpacing = function() {};
AbcSpacing.FONTEM = 360;
AbcSpacing.FONTSIZE = 30;
AbcSpacing.STEP = AbcSpacing.FONTSIZE*93/720;
AbcSpacing.SPACE = 10;
AbcSpacing.TOPNOTE = 20;
AbcSpacing.STAVEHEIGHT = 100;



//--------------------------------------------------------------------PRINTER

function ABCPrinter(paper) {
  this.y = 0;
  this.paper = paper;
  this.space = 3*AbcSpacing.SPACE;
  this.glyphs = new ABCGlyphs();
  this.listeners = [];
  this.selected = [];
}

ABCPrinter.prototype.setY = function(y) {
  this.backupy=this.y;
  this.y = y;
}

ABCPrinter.prototype.unSetY = function(y) {
  this.y = this.backupy;
}

ABCPrinter.prototype.notifySelect = function (abselem) {
  this.clearSelection();
  this.selected = [abselem];
  abselem.highlight();
  for (var i=0; i<this.listeners.length;i++) {
    this.listeners[i].highlight(abselem.abcelem);
  }
};

ABCPrinter.prototype.clearSelection = function () {
  for (var i=0;i<this.selected.length;i++) {
    this.selected[i].unhighlight();
  }
  this.selected = [];
};

ABCPrinter.prototype.addSelectListener = function (listener) {
  this.listeners[this.listeners.length] = listener;
};

ABCPrinter.prototype.rangeHighlight = function(start,end)
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
		  if ((elStart <= start && start <= elEnd) || (elStart <= end && end <= elEnd) ||
			  (start <= elStart && elStart <= end) || (start <= elEnd && elEnd <= end)) {
//		if (elems[elem].abcelem.startChar>=start && elems[elem].abcelem.endChar<=end) {
		  this.selected[this.selected.length]=elems[elem];
		  elems[elem].highlight();
		}
      }
    }
  }
};

ABCPrinter.prototype.printStaveLine = function (x1,x2, pitch) {
  var dy = 0.35;
  var y = this.calcY(pitch);
  return printer.paper.path(sprintf("M %f %f L %f %f L %f %f L %f %f z", x1, y-dy, x2, y-dy,
		       x2, y+dy, x1, y+dy)).attr({stroke:"none",fill: "#000000"});
};

ABCPrinter.prototype.printStem = function (x, dx, y1, y2) {
  return printer.paper.path(sprintf("M %f %f L %f %f L %f %f L %f %f z", x-0.3, y1, x-0.3, y2,
		       x+dx, y2, x+dx, y1)).attr({stroke:"none",fill: "#000000"});

};

ABCPrinter.prototype.printText = function (x, offset, text, anchor) {
  anchor = anchor || "start";
  this.paper.text(x, this.calcY(offset), text).attr({"text-anchor":anchor});
};

// assumes this.y is set appropriately
// if symbol is a multichar string without a . (as in scripts.staccato) 1 symbol per char is assumed
ABCPrinter.prototype.printSymbol = function(x, offset, symbol, start, end) {
  if (!symbol) return null;
  if (symbol.length>0 && symbol.indexOf(".")<0) {
    var elemset = this.paper.set();
    dx =0;
    for (var i=0; i<symbol.length; i++) {
      var ycorr = this.glyphs.getYCorr(symbol[i]);
      el = this.glyphs.printSymbol(x+dx, this.calcY(offset+ycorr), symbol[i], this.paper);
      if (el) {
	elemset.push(el);
	dx+=this.glyphs.getSymbolWidth(symbol[i]);
      } else {
	this.debugMsg(x,"no symbol:" +symbol);
      }
    }
    return elemset;
  } else {
    var ycorr = this.glyphs.getYCorr(symbol);
    var el = this.glyphs.printSymbol(x, this.calcY(offset+ycorr), symbol, this.paper);
    if (el) {
      return el;
    } else
      this.debugMsg(x,"no symbol:" +symbol);
    return null;    
  }
};

ABCPrinter.prototype.drawArc = function(x1, x2, pitch1, pitch2, above) {
  x1 = x1 + 6;
  x2 = x2 + 4;
  pitch1 = pitch1 + ((above)?1.5:-1.5);
  pitch2 = pitch2 + ((above)?1.5:-1.5);
  var y1 = this.calcY(pitch1);
  var y2 = this.calcY(pitch2);
  var dy = Math.max(4, (x2-x1)/5);
  var controlx1 = x1+(x2-x1)/5;
  var controly1 = y1+ ((above)?-dy:dy);
  var controlx2 = x2-(x2-x1)/5;
  var controly2 = y2+ ((above)?-dy:dy);
  var thickness = 2;
  return this.paper.path(sprintf("M %f %f C %f %f %f %f %f %f C %f %f %f %f %f %f z", x1, y1, 
				 controlx1, controly1, controlx2, controly2, x2, y2, 
				 controlx2, controly2+thickness, controlx1, controly1+thickness, x1, y1)).attr({stroke:"none", fill: "#000000"});
}

ABCPrinter.prototype.debugMsg = function(x, msg) {
  this.paper.text(x, this.y, msg);
}

ABCPrinter.prototype.debugMsgLow = function(x, msg) {
  this.paper.text(x, this.y+80, msg);
}

ABCPrinter.prototype.calcY = function(ofs) {
  return this.y+((AbcSpacing.TOPNOTE-ofs)*AbcSpacing.STEP);
};

ABCPrinter.prototype.printStave = function (width) {
  this.printStaveLine(0,width,2);
  this.printStaveLine(0,width,4);
  this.printStaveLine(0,width,6);
  this.printStaveLine(0,width,8);
  this.printStaveLine(0,width,10);
};

ABCPrinter.prototype.printABC = function(abctune) {
  this.layouter = new ABCLayout(this.glyphs);
  this.y = 15;
  if (abctune.formatting.stretchlast) { this.paper.text(200, this.y, "Format: stretchlast"); this.y += 20; }
  if (abctune.formatting.staffwidth) { 
    this.width=abctune.formatting.staffwidth; 
  } else {
    this.width=700;
  }
  if (abctune.formatting.scale) { this.paper.text(200, this.y, "Format: scale="+abctune.formatting.scale); this.y += 20; }
  this.paper.text(350, this.y, abctune.metaText.title).attr({"font-size":20});
  this.y+=20;
  if (abctune.metaText.author) {this.paper.text(500, this.y, abctune.metaText.author, "end"); this.y+=15;}
  if (abctune.metaText.origin) {this.paper.text(500, this.y, "(" + abctune.metaText.origin + ")", "end");this.y+=15;}
  if (abctune.metaText.tempo) {
	  var tempo = "";
	  if (abctune.metaText.tempo.preString) tempo += abctune.metaText.tempo.preString;
	  tempo += ' | ';
	  if (abctune.metaText.tempo.duration) {
		  tempo += abctune.metaText.tempo.duration.join(' ');
		  tempo += " = " + abctune.metaText.tempo.bpm + " ";
	  }
	  tempo += ' | ';
	  if (abctune.metaText.tempo.postString) tempo += abctune.metaText.tempo.postString;
	  this.paper.text(100, this.y+20, "Tempo: " + tempo);
	  this.y+=15;
  }
  this.y+=15;
  this.staffgroups = [];

  for(var line=0; line<abctune.lines.length; line++) {
    var abcline = abctune.lines[line];
    if (abcline.staff) {
      var staffgroup = this.layouter.printABCLine(abcline.staff, this.y);
      staffgroup.layout(this.space);
      var prop = Math.min(1,this.width/staffgroup.w);
      staffgroup.layout(this.space*prop);
      staffgroup.draw(this);
      this.staffgroups[this.staffgroups.length] = staffgroup;
      this.y = this.layouter.y;
      this.y+=AbcSpacing.STAVEHEIGHT;
    } else if (abcline.subtitle) {
      this.printSubtitleLine(abcline);
      this.y+=20; //hardcoded
    } else if (abcline.text) {
      this.paper.text(100, this.y, "TEXT: " + abcline.text);
      this.y+=20; //hardcoded
    }
  }
  var extraText = "";	// TODO-PER: This is just an easy way to display this info for now.
  if (abctune.metaText.partOrder) extraText += "Part Order: " + abctune.metaText.partOrder + "\n";
  if (abctune.metaText.notes) extraText += "Notes:\n" + abctune.metaText.notes + "\n";
  if (abctune.metaText.book) extraText += "Book: " + abctune.metaText.book + "\n";
  if (abctune.metaText.source) extraText += "Source: " + abctune.metaText.source + "\n";
  if (abctune.metaText.transcription) extraText += "Transcription: " + abctune.metaText.transcription + "\n";
  if (abctune.metaText.rhythm) extraText += "Rhythm: " + abctune.metaText.rhythm + "\n";
  if (abctune.metaText.discography) extraText += "Discography: " + abctune.metaText.discography + "\n";
  if (abctune.metaText.history) extraText += "History: " + abctune.metaText.history + "\n";
  if (abctune.metaText.unalignedWords) extraText += "Words:\n" + abctune.metaText.unalignedWords + "\n";
  var text = this.paper.text(10, this.y+30, extraText);
  text.translate(0,text.getBBox().height/2);
};

ABCPrinter.prototype.printSubtitleLine = function(abcline) {
  this.paper.text(100, this.y, abcline.subtitle);
};


