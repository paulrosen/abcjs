//    abc_graphelements.js: All the drawable and layoutable datastructures to be printed by ABCJS.write.Printer
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

/*global window, ABCJS */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

ABCJS.write.StaffGroupElement = function() {
  this.voices = [];
  this.staffs = [];
  this.stafflines = [];
};

ABCJS.write.StaffGroupElement.prototype.addVoice = function (voice, staffnumber, stafflines) {
  this.voices[this.voices.length] = voice;
  if (!this.staffs[staffnumber]) {
    this.staffs[this.staffs.length] = {top:0, highest: 7, lowest: 7};
    this.stafflines[this.stafflines.length] = stafflines;
  }
  voice.staff = this.staffs[staffnumber];
};

ABCJS.write.StaffGroupElement.prototype.finished = function() {
  for (var i=0;i<this.voices.length;i++) {
    if (!this.voices[i].layoutEnded()) return false;
  }
  return true;
};

ABCJS.write.StaffGroupElement.prototype.layout = function(spacing, controller, debug) {
  this.spacingunits = 0; // number of times we will have ended up using the spacing distance (as opposed to fixed width distances)
  this.minspace = 1000; // a big number to start off with - used to find out what the smallest space between two notes is -- GD 2014.1.7
  var x = controller.paddingleft*controller.scale;

  // find out how much space will be taken up by voice headers
  var voiceheaderw = 0;
  for (var i=0;i<this.voices.length;i++) {
    if(this.voices[i].header) {
      var t = controller.renderer.paper.text(100*controller.scale, -10*controller.scale, this.voices[i].header).attr({"font-size":12*controller.scale, "font-family":"serif", 'font-weight':'bold'}); // code duplicated below  // don't scale this as we ask for the bbox
     voiceheaderw = Math.max(voiceheaderw,t.getBBox().width);
      t.remove();
    }
  }
  x=x+voiceheaderw*(1/controller.scale)*1.1; // 10% of 0 is 0
  this.startx=x;

  var currentduration = 0;
  if (debug) console.log("init layout");
  for (i=0;i<this.voices.length;i++) {
    this.voices[i].beginLayout(x);
  }

  while (!this.finished()) {
    // find first duration level to be laid out among candidates across voices
    currentduration= null; // candidate smallest duration level
    for (i=0;i<this.voices.length;i++) {
      if (!this.voices[i].layoutEnded() && (!currentduration || this.voices[i].getDurationIndex()<currentduration)) 
	currentduration=this.voices[i].getDurationIndex();
    }
    if (debug) console.log("currentduration: ",currentduration);


    // isolate voices at current duration level
    var currentvoices = [];
    var othervoices = [];
    for (i=0;i<this.voices.length;i++) {
      if (this.voices[i].getDurationIndex() !== currentduration) {
	othervoices.push(this.voices[i]);
	//console.log("out: voice ",i);
      } else {
	currentvoices.push(this.voices[i]);
	if (debug) console.log("in: voice ",i);
      }
    }

    // among the current duration level find the one which needs starting furthest right
    var spacingunit = 0; // number of spacingunits coming from the previously laid out element to this one
    var spacingduration = 0;
    for (i=0;i<currentvoices.length;i++) {
      if (currentvoices[i].getNextX()>x) {
	x=currentvoices[i].getNextX();
	spacingunit=currentvoices[i].getSpacingUnits();
	spacingduration = currentvoices[i].spacingduration;
      }
    }
    this.spacingunits+=spacingunit;
    this.minspace = Math.min(this.minspace,spacingunit);

    for (i=0;i<currentvoices.length;i++) {
      var voicechildx = currentvoices[i].layoutOneItem(x,spacing);
      var dx = voicechildx-x;
      if (dx>0) {
	x = voicechildx; //update x
	for (var j=0;j<i;j++) { // shift over all previously laid out elements
	  currentvoices[j].shiftRight(dx);
	}
      } 
    }

    // remove the value of already counted spacing units in other voices (e.g. if a voice had planned to use up 5 spacing units but is not in line to be laid out at this duration level - where we've used 2 spacing units - then we must use up 3 spacing units, not 5)
    for (i=0;i<othervoices.length;i++) {
      othervoices[i].spacingduration-=spacingduration;
      othervoices[i].updateNextX(x,spacing); // adjust other voices expectations
    }
    
    // update indexes of currently laid out elems
    for (i=0;i<currentvoices.length;i++) {
      var voice = currentvoices[i]; 
      voice.updateIndices();
    }
  } // finished laying out


  // find the greatest remaining x as a base for the width
  for (i=0;i<this.voices.length;i++) {
    if (this.voices[i].getNextX()>x) {
      x=this.voices[i].getNextX();
      spacingunit=this.voices[i].getSpacingUnits();
    }
  }
  this.spacingunits+=spacingunit;
  this.w = x;

  for (i=0;i<this.voices.length;i++) {
    this.voices[i].w=this.w;
  }
};

ABCJS.write.StaffGroupElement.prototype.draw = function (renderer, y) {

  this.y = y;
  for (var i=0;i<this.staffs.length;i++) {
    var shiftabove = this.staffs[i].highest - ((i===0)? 20 : 15);
    var shiftbelow = this.staffs[i].lowest - ((i===this.staffs.length-1)? 0 : 0);
    this.staffs[i].top = y;
    if (shiftabove > 0) y+= shiftabove*ABCJS.write.spacing.STEP;
    this.staffs[i].y = y;
    y+= ABCJS.write.spacing.STAVEHEIGHT*0.9; // position of the words
    if (shiftbelow < 0) y-= shiftbelow*ABCJS.write.spacing.STEP;
    this.staffs[i].bottom = y;
  }
  this.height = y-this.y;

  var bartop = 0;
  for (i=0;i<this.voices.length;i++) {
    this.voices[i].draw(renderer, bartop);
    bartop = this.voices[i].barbottom;
  }

  if (this.staffs.length>1) {
    renderer.y = this.staffs[0].y;
    var top = renderer.calcY(10);
    renderer.y = this.staffs[this.staffs.length-1].y;
    var bottom = renderer.calcY(2);
    renderer.printStem(this.startx, 0.6, top, bottom);
  }

  for (i=0;i<this.staffs.length;i++) {
    if (this.stafflines[i] === 0) continue;
    renderer.y = this.staffs[i].y;
    // TODO-PER: stafflines should always have been set somewhere, so this shouldn't be necessary.
    if (this.stafflines[i] === undefined)
      this.stafflines[i] = 5;
    renderer.printStave(this.startx,this.w, this.stafflines[i]);
  }
  
};

ABCJS.write.VoiceElement = function(voicenumber, voicetotal) {
  this.children = [];
  this.beams = []; 
  this.otherchildren = []; // ties, slurs, triplets
  this.w = 0;
  this.duplicate = false;
  this.voicenumber = voicenumber; //number of the voice on a given stave (not staffgroup)
  this.voicetotal = voicetotal;
};

ABCJS.write.VoiceElement.prototype.addChild = function (child) {
  this.children[this.children.length] = child;
};

ABCJS.write.VoiceElement.prototype.addOther = function (child) {
  if (child instanceof ABCJS.write.BeamElem) {
    this.beams.push(child);
  } else {
    this.otherchildren.push(child);
  }
};

ABCJS.write.VoiceElement.prototype.updateIndices = function () {
  if (!this.layoutEnded()) {
    this.durationindex += this.children[this.i].duration;
    if (this.children[this.i].duration===0) this.durationindex = Math.round(this.durationindex*64)/64; // everytime we meet a barline, do rounding to nearest 64th
    this.i++;
  }
}; 

ABCJS.write.VoiceElement.prototype.layoutEnded = function () {
  return (this.i>=this.children.length);
};

ABCJS.write.VoiceElement.prototype.getDurationIndex = function () {
  return this.durationindex - (this.children[this.i] && (this.children[this.i].duration>0)?0:0.0000005); // if the ith element doesn't have a duration (is not a note), its duration index is fractionally before. This enables CLEF KEYSIG TIMESIG PART, etc. to be laid out before we get to the first note of other voices
};

// number of spacing units expected for next positioning
ABCJS.write.VoiceElement.prototype.getSpacingUnits = function () {
  return (this.minx<this.nextx) ? Math.sqrt(this.spacingduration*8) : 0; // we haven't used any spacing units if we end up using minx
};

//
ABCJS.write.VoiceElement.prototype.getNextX = function () {
  return Math.max(this.minx, this.nextx);
};

ABCJS.write.VoiceElement.prototype.beginLayout = function (startx) {
  this.i=0;
  this.durationindex=0;
  this.ii=this.children.length;
  this.startx=startx;
  this.minx=startx; // furthest left to where negatively positioned elements are allowed to go
  this.nextx=startx; // x position where the next element of this voice should be placed assuming no other voices and no fixed width constraints
  this.spacingduration=0; // duration left to be laid out in current iteration (omitting additional spacing due to other aspects, such as bars, dots, sharps and flats)
};

// Try to layout the element at index this.i
// x - position to try to layout the element at
// spacing - base spacing
// can't call this function more than once per iteration
ABCJS.write.VoiceElement.prototype.layoutOneItem = function (x, spacing) {
  var child = this.children[this.i];
  if (!child) return 0;
  var er = x - this.minx; // available extrawidth to the left
  if (er<child.getExtraWidth()) { // shift right by needed amount
    x+=child.getExtraWidth()-er;
  }
  child.x=x; // place child at x

  this.spacingduration = child.duration;
  //update minx
  this.minx = x+child.getMinWidth(); // add necessary layout space
  if (this.i!==this.ii-1) this.minx+=child.minspacing; // add minimumspacing except on last elem
  
  this.updateNextX(x, spacing);

  // contribute to staff y position
  this.staff.highest = Math.max(child.top,this.staff.highest);
  this.staff.lowest = Math.min(child.bottom,this.staff.lowest);

  return x; // where we end up having placed the child
};

// call when spacingduration has been updated
ABCJS.write.VoiceElement.prototype.updateNextX = function (x, spacing) {
  this.nextx= x + (spacing*Math.sqrt(this.spacingduration*8));
};

ABCJS.write.VoiceElement.prototype.shiftRight = function (dx) {
  var child = this.children[this.i];
  if (!child) return;
  child.x+=dx;
  this.minx+=dx;
  this.nextx+=dx;
};

ABCJS.write.VoiceElement.prototype.draw = function (renderer, bartop) {
  var width = this.w-1;
  renderer.y = this.staff.y;
  this.barbottom = renderer.calcY(2);

  if (this.header) { // print voice name
    var textpitch = 12 - (this.voicenumber+1)*(12/(this.voicetotal+1));
    var headerX = (this.startx-renderer.paddingleft)/2+renderer.paddingleft;
    headerX = headerX*renderer.scale;
    renderer.paper.text(headerX, renderer.calcY(textpitch)*renderer.scale, this.header).attr({"font-size":12*renderer.scale, "font-family":"serif", 'font-weight':'bold'}); // code duplicated above
  }

  for (var i=0, ii=this.children.length; i<ii; i++) {
    this.children[i].draw(renderer, (this.barto || i===ii-1)?bartop:0);
  }
	window.ABCJS.parse.each(this.beams, function(beam) {
      beam.draw(renderer); // beams must be drawn first for proper printing of triplets, slurs and ties.
    });
	window.ABCJS.parse.each(this.otherchildren, function(child) {
      child.draw(renderer,this.startx+10,width);
    });

};

// duration - actual musical duration - different from notehead duration in triplets. refer to abcelem to get the notehead duration
// minspacing - spacing which must be taken on top of the width defined by the duration
ABCJS.write.AbsoluteElement = function(abcelem, duration, minspacing) { 
  this.abcelem = abcelem;
  this.duration = duration;
  this.minspacing = minspacing || 0;
  this.x = 0;
  this.children = [];
  this.heads = [];
  this.extra = [];
  this.extraw = 0;
  this.decs = [];
  this.w = 0;
  this.right = [];
  this.invisible = false;
  this.bottom = 7;
  this.top = 7;
};

ABCJS.write.AbsoluteElement.prototype.getMinWidth = function () { // absolute space taken to the right of the note
  return this.w;
};

ABCJS.write.AbsoluteElement.prototype.getExtraWidth = function () { // space needed to the left of the note
  return -this.extraw;
};

ABCJS.write.AbsoluteElement.prototype.addExtra = function (extra) {
  if (extra.dx<this.extraw) this.extraw = extra.dx;
  this.extra[this.extra.length] = extra;
  this.addChild(extra);
};

ABCJS.write.AbsoluteElement.prototype.addHead = function (head) {
  if (head.dx<this.extraw) this.extraw = head.dx;
  this.heads[this.heads.length] = head;
  this.addRight(head);
};

ABCJS.write.AbsoluteElement.prototype.addRight = function (right) {
  if (right.dx+right.w>this.w) this.w = right.dx+right.w;
  this.right[this.right.length] = right;
  this.addChild(right);
};

ABCJS.write.AbsoluteElement.prototype.addChild = function (child) {
  child.parent = this;
  this.children[this.children.length] = child;
  this.pushTop(child.top);
  this.pushBottom(child.bottom);
};

ABCJS.write.AbsoluteElement.prototype.pushTop = function (top) {
  this.top = Math.max(top, this.top);
};

ABCJS.write.AbsoluteElement.prototype.pushBottom = function (bottom) {
  this.bottom = Math.min(bottom, this.bottom);
};

ABCJS.write.AbsoluteElement.prototype.draw = function (renderer, bartop) {
  this.elemset = renderer.paper.set();
  if (this.invisible) return;
  renderer.beginGroup();
  for (var i=0; i<this.children.length; i++) {
    this.elemset.push(this.children[i].draw(renderer,this.x, bartop));
  }
  this.elemset.push(renderer.endGroup());
	if (this.klass)
		this.setClass("mark", "", "#00ff00");
  var self = this;
  var controller = renderer.controller;
  this.elemset.mouseup(function (e) {
    controller.notifySelect(self);
    });
  this.abcelem.abselem = this;
  
  var spacing = ABCJS.write.spacing.STEP*renderer.scale;

  var start = function () {
    // storing original relative coordinates
    this.dy = 0;
  },
  move = function (dx, dy) {
    // move will be called with dx and dy
    dy = Math.round(dy/spacing)*spacing;
    this.translate(0, -this.dy);
    this.dy = dy;
    this.translate(0,this.dy);
  },
  up = function () {
    var delta = -Math.round(this.dy/spacing);
    self.abcelem.pitches[0].pitch += delta;
    self.abcelem.pitches[0].verticalPos += delta;
    controller.notifyChange();
  };
  if (this.abcelem.el_type==="note" && controller.editable)
    this.elemset.drag(move, start, up);
};

ABCJS.write.AbsoluteElement.prototype.isIE=/*@cc_on!@*/false;//IE detector

ABCJS.write.AbsoluteElement.prototype.setClass = function (addClass, removeClass, color) {
  this.elemset.attr({fill:color});
	if (!this.isIE) {
		for (var i = 0; i < this.elemset.length; i++) {
			if (this.elemset[i][0].setAttribute) {
				var kls = this.elemset[i][0].getAttribute("class");
				if (!kls) kls = "";
				kls = kls.replace(removeClass, "");
				kls = kls.replace(addClass, "");
				if (addClass.length > 0) {
					if (kls.length > 0 && kls.charAt(kls.length-1) !== ' ') kls += " ";
					kls += addClass;
				}
				this.elemset[i][0].setAttribute("class", kls);
			}
		}
	}
};

ABCJS.write.AbsoluteElement.prototype.highlight = function () {
	this.setClass("note_selected", "", "#ff0000");
};

ABCJS.write.AbsoluteElement.prototype.unhighlight = function () {
	this.setClass("", "note_selected", "#000000");
};

ABCJS.write.RelativeElement = function(c, dx, w, pitch, opt) {
  opt = opt || {};
  this.x = 0;
  this.c = c;      // character or path or string
  this.dx = dx;    // relative x position
  this.w = w;      // minimum width taken up by this element (can include gratuitous space)
  this.pitch = pitch; // relative y position by pitch
  this.scalex = opt.scalex || 1; // should the character/path be scaled?
  this.scaley = opt.scaley || 1; // should the character/path be scaled?
  this.type = opt.type || "symbol"; // cheap types.
  this.pitch2 = opt.pitch2;
  this.linewidth = opt.linewidth;
  this.attributes = opt.attributes; // only present on textual elements
  this.top = pitch + ((opt.extreme==="above")? 7 : 0);
  this.bottom = pitch - ((opt.extreme==="below")? 7 : 0);
};

ABCJS.write.RelativeElement.prototype.draw = function (renderer, x, bartop) {
  this.x = x+this.dx;
  switch(this.type) {
  case "symbol":
    if (this.c===null) return null;
    this.graphelem = renderer.printSymbol(this.x, this.pitch, this.c, this.scalex, this.scaley); break;
  case "debug":
    this.graphelem = renderer.debugMsg(this.x, this.c); break;
  case "debugLow":
    this.graphelem = renderer.debugMsgLow(this.x, this.c); break; //TODO-GD print lyrics at the "correct" pitch
  case "text":
    this.graphelem = renderer.printText(this.x, this.pitch, this.c); 
    break;
  case "bar":
    this.graphelem = renderer.printStem(this.x, this.linewidth, renderer.calcY(this.pitch), (bartop)?bartop:renderer.calcY(this.pitch2)); break; // bartop can't be 0
  case "stem":
    this.graphelem = renderer.printStem(this.x, this.linewidth, renderer.calcY(this.pitch), renderer.calcY(this.pitch2)); break;
  case "ledger":
    this.graphelem = renderer.printStaveLine(this.x, this.x+this.w, this.pitch); break;
  }
  if (this.scalex!==1 && this.graphelem) {
    this.graphelem.scale(this.scalex, this.scaley, this.x, renderer.calcY(this.pitch));
  }
  if (this.attributes) {
    this.graphelem.attr(this.attributes);
  }
  return this.graphelem;
};

ABCJS.write.EndingElem = function(text, anchor1, anchor2) {
  this.text = text; // text to be displayed top left
  this.anchor1 = anchor1; // must have a .x property or be null (means starts at the "beginning" of the line - after keysig)
  this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
};

ABCJS.write.EndingElem.prototype.draw = function (renderer, linestartx, lineendx) {
  var pathString;
  if (this.anchor1) {
    linestartx = this.anchor1.x+this.anchor1.w;
    pathString = ABCJS.write.sprintf("M %f %f L %f %f",
			     linestartx, renderer.y, linestartx, renderer.y+10); 
    renderer.printPath({path:pathString, stroke:"#000000", fill:"#000000"}); //TODO scale
    renderer.printText(linestartx+5*renderer.scale, 18.5, this.text).attr({"font-size":""+10*renderer.scale+"px"});
  }

  if (this.anchor2) {
    lineendx = this.anchor2.x;
    pathString = ABCJS.write.sprintf("M %f %f L %f %f",
			 lineendx, renderer.y, lineendx, renderer.y+10); 
    renderer.printPath({path:pathString, stroke:"#000000", fill:"#000000"}); // TODO scale
  }


  pathString = ABCJS.write.sprintf("M %f %f L %f %f",
				  linestartx, renderer.y, lineendx, renderer.y); 
  renderer.printPath({path:pathString, stroke:"#000000", fill:"#000000"});  // TODO scale
};

ABCJS.write.TieElem = function(anchor1, anchor2, above, forceandshift) {
  this.anchor1 = anchor1; // must have a .x and a .pitch, and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
  this.anchor2 = anchor2; // must have a .x and a .pitch property or be null (means ends at the end of the line)
  this.above = above; // true if the arc curves above
  this.force = forceandshift; // force the arc curve, regardless of beaming if true
                      // move by +7 "up" by -7 if "down"
};

ABCJS.write.TieElem.prototype.draw = function (renderer, linestartx, lineendx) {
  var startpitch;
  var endpitch;

  if (this.startlimitelem) {
    linestartx = this.startlimitelem.x+this.startlimitelem.w;
  } 

  if (this.endlimitelem) {
    lineendx = this.endlimitelem.x;
  } 
	// PER: We might have to override the natural slur direction if the first and last notes are not in the
	// save direction. We always put the slur up in this case. The one case that works out wrong is that we always
	// want the slur to be up when the last note is stem down. We can tell the stem direction if the top is
	// equal to the pitch: if so, there is no stem above it.
	if (!this.force && this.anchor2 && this.anchor2.pitch === this.anchor2.top)
		this.above = true;

  if (this.anchor1) {
    linestartx = this.anchor1.x;
    startpitch = this.above ? this.anchor1.highestVert : this.anchor1.pitch;
    if (!this.anchor2) {
      endpitch = this.above ? this.anchor1.highestVert : this.anchor1.pitch;
    }
  }

  if (this.anchor2) {
    lineendx = this.anchor2.x;
    endpitch = this.above ? this.anchor2.highestVert : this.anchor2.pitch;
    if (!this.anchor1) {
      startpitch = this.above ? this.anchor2.highestVert : this.anchor2.pitch;
    }
  }

//  if (this.anchor1 && this.anchor2) {
//    if ((!this.force && this.anchor1.parent.beam && this.anchor2.parent.beam &&
//	 this.anchor1.parent.beam.asc===this.anchor2.parent.beam.asc) ||
//	((this.force==="up") || this.force==="down") && this.anchor1.parent.beam && this.anchor2.parent.beam && this.anchor1.parent.beam===this.anchor2.parent.beam) {
//      this.above = !this.anchor1.parent.beam.asc;
//      preservebeamdir = true;
//    }
//  }

//  var pitchshift = 0;
//  if (this.force==="up" && !preservebeamdir) pitchshift = 7;
//  if (this.force==="down" && !preservebeamdir) pitchshift = -7;

//	renderer.debugMsgLow(linestartx, debugMsg);
  renderer.drawArc(linestartx, lineendx, startpitch, endpitch,  this.above);

};

ABCJS.write.DynamicDecoration = function(anchor, dec) {
    this.anchor = anchor;
    this.dec = dec;
};

ABCJS.write.DynamicDecoration.prototype.draw = function(renderer, linestartx, lineendx) {
    var ypos = renderer.minY - 7;
    var scalex = 1; // TODO-PER: do the scaling
    var scaley = 1;
    renderer.printSymbol(this.anchor.x, ypos, this.dec, scalex, scaley);
};

ABCJS.write.CrescendoElem = function(anchor1, anchor2, dir) {
    this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
    this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
    this.dir = dir; // either "<" or ">"
};

ABCJS.write.CrescendoElem.prototype.draw = function (renderer, linestartx, lineendx) {
    if (this.dir === "<") {
        this.drawLine(renderer, 0, -4);
        this.drawLine(renderer, 0, 4);
    } else {
        this.drawLine(renderer, -4, 0);
        this.drawLine(renderer, 4, 0);
    }
};

ABCJS.write.CrescendoElem.prototype.drawLine = function (renderer, y1, y2) {
    var ypos = renderer.minY - 7;
    var pathString = ABCJS.write.sprintf("M %f %f L %f %f",
        this.anchor1.x, renderer.calcY(ypos)+y1-4, this.anchor2.x, renderer.calcY(ypos)+y2-4);
    renderer.printPath({path:pathString, stroke:"#000000"});
};

ABCJS.write.TripletElem = function(number, anchor1, anchor2, above) {
  this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
  this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
  this.above = above;
  this.number = number;
};

ABCJS.write.TripletElem.prototype.draw = function (renderer, linestartx, lineendx) {
  // TODO end and beginning of line
  if (this.anchor1 && this.anchor2) {
    var ypos = this.above?16:-1;	// PER: Just bumped this up from 14 to make (3z2B2B2 (3B2B2z2 succeed. There's probably a better way.
    
    if (this.anchor1.parent.beam && 
	this.anchor1.parent.beam===this.anchor2.parent.beam) {
      var beam = this.anchor1.parent.beam;
      this.above = beam.asc;
      ypos = beam.pos;     
    } else {
      this.drawLine(renderer,renderer.calcY(ypos));
    }
    var xsum = this.anchor1.x+this.anchor2.x;
    var ydelta = 0;
    if (beam) {
      if (this.above) {
	xsum += (this.anchor2.w + this.anchor1.w);
	ydelta = 4;
      } else {
	ydelta = -4;
      }
    } else {
      xsum += this.anchor2.w;
    }
    
    
    renderer.printText(xsum/2, ypos+ydelta, this.number, "middle").attr({"font-size":"10px", 'font-style': 'italic' });

  }
};

ABCJS.write.TripletElem.prototype.drawLine = function (renderer, y) {
  var pathString;
  var linestartx = this.anchor1.x;
  pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		       linestartx, y, linestartx, y+5); 
  renderer.printPath({path:pathString, stroke:"#000000"});
  
  var lineendx = this.anchor2.x+this.anchor2.w;
  pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		       lineendx, y, lineendx, y+5); 
  renderer.printPath({path:pathString, stroke:"#000000"});
  
  pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		       linestartx, y, (linestartx+lineendx)/2-5, y); 
  renderer.printPath({path:pathString, stroke:"#000000"});


  pathString = ABCJS.write.sprintf("M %f %f L %f %f",
		       (linestartx+lineendx)/2+5, y, lineendx, y); 
  renderer.printPath({path:pathString, stroke:"#000000"});

};

ABCJS.write.BeamElem = function(type, flat) {
  this.isflat = (flat);
  this.isgrace = (type && type==="grace");
  this.forceup = (type && type==="up");
  this.forcedown = (type && type==="down");
  this.elems = []; // all the ABCJS.write.AbsoluteElements
  this.total = 0;
  this.dy = (this.asc)?ABCJS.write.spacing.STEP*1.2:-ABCJS.write.spacing.STEP*1.2;
  if (this.isgrace) this.dy = this.dy*0.4;
  this.allrests = true;
};

ABCJS.write.BeamElem.prototype.add = function(abselem) {
  var pitch = abselem.abcelem.averagepitch;
  if (pitch===undefined) return; // don't include elements like spacers in beams
  this.allrests = this.allrests && abselem.abcelem.rest;
  abselem.beam = this;
  this.elems.push(abselem);
  //var pitch = abselem.abcelem.averagepitch;
  this.total += pitch; // TODO CHORD (get pitches from abselem.heads)
  if (!this.min || abselem.abcelem.minpitch<this.min) {
    this.min = abselem.abcelem.minpitch;
  }
  if (!this.max || abselem.abcelem.maxpitch>this.max) {
    this.max = abselem.abcelem.maxpitch;
  }
};

ABCJS.write.BeamElem.prototype.average = function() {
  try {
    return this.total/this.elems.length;
  } catch (e) {
    return 0;
  }
};

ABCJS.write.BeamElem.prototype.draw = function(renderer) {
  if (this.elems.length === 0 || this.allrests) return;
  this.drawBeam(renderer);
  this.drawStems(renderer);
};

ABCJS.write.BeamElem.prototype.calcDir = function() {
	var average = this.average();
//	var barpos = (this.isgrace)? 5:7;
	this.asc = (this.forceup || this.isgrace || average<6) && (!this.forcedown); // hardcoded 6 is B
	return this.asc;
};

ABCJS.write.BeamElem.prototype.drawBeam = function(renderer) {
	var average = this.average();
	var barpos = (this.isgrace)? 5:7;
	this.calcDir();

  var barminpos = this.asc ? 5 : 8;	//PER: I just bumped up the minimum height for notes with descending stems to clear a rest in the middle of them.
  this.pos = Math.round(this.asc ? Math.max(average+barpos,this.max+barminpos) : Math.min(average-barpos,this.min-barminpos));
  var slant = this.elems[0].abcelem.averagepitch-this.elems[this.elems.length-1].abcelem.averagepitch;
  if (this.isflat) slant=0;
  var maxslant = this.elems.length/2;

  if (slant>maxslant) slant = maxslant;
  if (slant<-maxslant) slant = -maxslant;
  this.starty = renderer.calcY(this.pos+Math.floor(slant/2));
  this.endy = renderer.calcY(this.pos+Math.floor(-slant/2));

  var starthead = this.elems[0].heads[(this.asc)? 0: this.elems[0].heads.length-1];
  var endhead = this.elems[this.elems.length-1].heads[(this.asc)? 0: this.elems[this.elems.length-1].heads.length-1];
  this.startx = starthead.x;
  if(this.asc) this.startx+=starthead.w-0.6;
  this.endx = endhead.x;
  if(this.asc) this.endx+=endhead.w;

	// PER: if the notes are too high or too low, make the beam go down to the middle
	if (this.asc && this.pos < 6) {
		this.starty = renderer.calcY(6);
		this.endy = renderer.calcY(6);
	} else if (!this.asc && this.pos > 6) {
		this.starty = renderer.calcY(6);
		this.endy = renderer.calcY(6);
	}

  var pathString = "M"+this.startx+" "+this.starty+" L"+this.endx+" "+this.endy+
  "L"+this.endx+" "+(this.endy+this.dy) +" L"+this.startx+" "+(this.starty+this.dy)+"z";
  renderer.printPath({path:pathString, stroke:"none", fill:"#000000"});
};

ABCJS.write.BeamElem.prototype.drawStems = function(renderer) {
  var auxbeams = [];  // auxbeam will be {x, y, durlog, single} auxbeam[0] should match with durlog=-4 (16th) (j=-4-durlog)
  renderer.beginGroup();
  for (var i=0,ii=this.elems.length; i<ii; i++) {
    if (this.elems[i].abcelem.rest)
      continue;
    var furthesthead = this.elems[i].heads[(this.asc)? 0: this.elems[i].heads.length-1];
    var ovaldelta = (this.isgrace)?1/3:1/5;
    var pitch = furthesthead.pitch + ((this.asc) ? ovaldelta : -ovaldelta);
    var y = renderer.calcY(pitch);
    var x = furthesthead.x + ((this.asc) ? furthesthead.w: 0);
    var bary=this.getBarYAt(x);
    var dx = (this.asc) ? -0.6 : 0.6;
    renderer.printStem(x,dx,y,bary);

    var sy = (this.asc) ? 1.5*ABCJS.write.spacing.STEP: -1.5*ABCJS.write.spacing.STEP;
    if (this.isgrace) sy = sy*2/3;
    for (var durlog=ABCJS.write.getDurlog(this.elems[i].abcelem.duration); durlog<-3; durlog++) { // get the duration via abcelem because of triplets
      if (auxbeams[-4-durlog]) {
	auxbeams[-4-durlog].single = false;
      } else {
	auxbeams[-4-durlog] = {x:x+((this.asc)?-0.6:0), y:bary+sy*(-4-durlog+1), 
			       durlog:durlog, single:true};
      }
    }
    
    for (var j=auxbeams.length-1;j>=0;j--) {
      if (i===ii-1 || ABCJS.write.getDurlog(this.elems[i+1].abcelem.duration)>(-j-4)) {
	
	var auxbeamendx = x;
	var auxbeamendy = bary + sy*(j+1);


	if (auxbeams[j].single) {
	  auxbeamendx = (i===0) ? x+5 : x-5;
	  auxbeamendy = this.getBarYAt(auxbeamendx) + sy*(j+1);
	}
	// TODO I think they are drawn from front to back, hence the small x difference with the main beam

	var pathString ="M"+auxbeams[j].x+" "+auxbeams[j].y+" L"+auxbeamendx+" "+auxbeamendy+
	  "L"+auxbeamendx+" "+(auxbeamendy+this.dy) +" L"+auxbeams[j].x+" "+(auxbeams[j].y+this.dy)+"z";
	renderer.printPath({path:pathString, stroke:"none", fill:"#000000"});
	auxbeams = auxbeams.slice(0,j);
      }
    }
  }
  renderer.endGroup();
};

ABCJS.write.BeamElem.prototype.getBarYAt = function(x) {
  return this.starty + (this.endy-this.starty)/(this.endx-this.startx)*(x-this.startx);
};
