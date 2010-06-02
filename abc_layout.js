//    abc_layout.js: Creates a data structure suitable for printing a line of abc
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

/*global ABCVoiceElement */
/*global ABCRelativeElement */
/*global ABCAbsoluteElement */
/*global ABCBeamElem */
/*global ABCEndingElem */
/*global ABCTripletElem */
/*global ABCTieElem */
/*global ABCStaffGroupElement */ 
/*global AbcSpacing */
/*extern ABCLayout getDuration getDurlog */

var getDuration = function(elem) {
  var d = 0;
  if (elem.duration) {
    d = elem.duration;
  }
  return d;
};

var getDurlog = function(duration) {
  return Math.floor(Math.log(duration)/Math.log(2));
};

function ABCLayout(glyphs, bagpipes) {
  this.glyphs = glyphs;
  this.isBagpipes = bagpipes;
  this.chartable = {rest:{0:"rests.whole", 1:"rests.half", 2:"rests.quarter", 3:"rests.8th", 4: "rests.16th",5: "rests.32nd", 6: "rests.64th", 7: "rests.128th"},
		   note:{"-1": "noteheads.dbl", 0:"noteheads.whole", 1:"noteheads.half", 2:"noteheads.quarter", 3:"noteheads.quarter", 4:"noteheads.quarter", 5:"noteheads.quarter", 6:"noteheads.quarter"},
		   uflags:{3:"flags.u8th", 4:"flags.u16th", 5:"flags.u32nd", 6:"flags.u64th"},
		   dflags:{3:"flags.d8th", 4:"flags.d16th", 5:"flags.d32nd", 6:"flags.d64th"}};
  this.slurs = {};
  this.ties = [];
  this.slursbyvoice = {};
  this.tiesbyvoice = {};
  this.endingsbyvoice = {};
  this.s = 0; // current staff number
  this.v = 0; // current voice number on current staff
}

ABCLayout.prototype.getCurrentVoiceId = function() {
  return "s"+this.s+"v"+this.v;
};

ABCLayout.prototype.pushCrossLineElems = function() {
  this.slursbyvoice[this.getCurrentVoiceId()] = this.slurs;
  this.tiesbyvoice[this.getCurrentVoiceId()] = this.ties;
  this.endingsbyvoice[this.getCurrentVoiceId()] = this.partstartelem;
};

ABCLayout.prototype.popCrossLineElems = function() {
  this.slurs = this.slursbyvoice[this.getCurrentVoiceId()] || {};
  this.ties = this.tiesbyvoice[this.getCurrentVoiceId()] || [];
  this.partstartelem = this.endingsbyvoice[this.getCurrentVoiceId()];
};

ABCLayout.prototype.getElem = function() {
  if (this.abcline.length <= this.pos)
    return null;
  return this.abcline[this.pos];
};

ABCLayout.prototype.getNextElem = function() {
	if (this.abcline.length <= this.pos+1)
		return null;
    return this.abcline[this.pos+1];
};

ABCLayout.prototype.printABCLine = function(staffs) {
  this.staffgroup = new ABCStaffGroupElement();
  for (this.s = 0; this.s < staffs.length; this.s++) {
    this.printABCStaff(staffs[this.s]);
  }
  return this.staffgroup;
};

ABCLayout.prototype.printABCStaff = function(abcstaff) {

  var header = "";
  if (abcstaff.bracket) header += "bracket "+abcstaff.bracket+" ";
  if (abcstaff.brace) header += "brace "+abcstaff.brace+" ";

  
  for (this.v = 0; this.v < abcstaff.voices.length; this.v++) {
    this.voice = new ABCVoiceElement(this.v,abcstaff.voices.length);
    if (this.v===0) {
      this.voice.barfrom = (abcstaff.connectBarLines==="start" || abcstaff.connectBarLines==="continue");
      this.voice.barto = (abcstaff.connectBarLines==="continue" || abcstaff.connectBarLines==="end");
    } else {
      this.voice.duplicate = true; // barlines and other duplicate info need not be printed
    }
    if (abcstaff.title && abcstaff.title[this.v]) this.voice.header=abcstaff.title[this.v];
    // TODO make invisible if voice is duplicate
    this.voice.addChild(this.printClef(abcstaff.clef));
    this.voice.addChild(this.printKeySignature(abcstaff.key));
    if (abcstaff.meter) this.voice.addChild(this.printTimeSignature(abcstaff.meter));
    this.printABCVoice(abcstaff.voices[this.v]);
    this.staffgroup.addVoice(this.voice,this.s);
  }
 
};

ABCLayout.prototype.printABCVoice = function(abcline) {
  this.popCrossLineElems();
  this.stemdir = (this.isBagpipes)?"down":null;
  this.abcline = abcline;
  if (this.partstartelem) {
    this.partstartelem = new ABCEndingElem("", null, null);
    this.voice.addOther(this.partstartelem);
  }
  for (var slur in this.slurs) {
    if (this.slurs.hasOwnProperty(slur)) {
      this.slurs[slur]= new ABCTieElem(null, null, this.slurs[slur].above, this.slurs[slur].force);
	this.voice.addOther(this.slurs[slur]);
    }
  }
  for (var i=0; i<this.ties.length; i++) {
    this.ties[i]=new ABCTieElem(null, null, this.ties[i].above, this.ties[i].force);
    this.voice.addOther(this.ties[i]);
  }

  for (this.pos=0; this.pos<this.abcline.length; this.pos++) {
    var abselems = this.printABCElement();
    for (var i=0; i<abselems.length; i++) {
      this.voice.addChild(abselems[i]);
    }
  }
  this.pushCrossLineElems();
};


// return an array of ABCAbsoluteElement
ABCLayout.prototype.printABCElement = function() {
  var elemset = [];
  var elem = this.getElem();
  switch (elem.el_type) {
  case "note":
    elemset = this.printBeam();
    break;
  case "bar":
    elemset[0] = this.printBarLine(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "meter":
    elemset[0] = this.printTimeSignature(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "clef":
    elemset[0] = this.printClef(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "key":
    elemset[0] = this.printKeySignature(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "stem":
    this.stemdir=elem.direction;
    break;
  case "part":
    var abselem = new ABCAbsoluteElement(elem,0,0);
    abselem.addChild(new ABCRelativeElement(elem.title, 0, 0, 18, {type:"text", attributes:{"font-weight":"bold", "font-size":"16px", "font-family":"serif"}}));
    elemset[0] = abselem;
    break;
  default: 
    var abselem = new ABCAbsoluteElement(elem,0,0);
    abselem.addChild(new ABCRelativeElement("element type "+elem.el_type, 0, 0, 0, {type:"debug"}));
    elemset[0] = abselem;
  }

  return elemset;
};

ABCLayout.prototype.printBeam = function() {
  var abselemset = [];
  
  if (this.getElem().startBeam && !this.getElem().endBeam) {
    var beamelem = new ABCBeamElem(this.stemdir);
    while (this.getElem()) {
      var abselem = this.printNote(this.getElem(),true);
      abselemset.push(abselem);
      beamelem.add(abselem);
      if (this.getElem().endBeam) {
		break;
      }
      this.pos++;
    }
    this.voice.addOther(beamelem);
  } else {
    abselemset[0] = this.printNote(this.getElem());
  }
  return abselemset;
};

function sortPitch(elem) {
  var sorted;
  do {
    sorted = true;
    for (var p = 0; p<elem.pitches.length-1; p++) {
      if (elem.pitches[p].pitch>elem.pitches[p+1].pitch) {
	sorted = false;
	var tmp = elem.pitches[p];
	elem.pitches[p] = elem.pitches[p+1];
	elem.pitches[p+1] = tmp;
      }     
    }
  } while (!sorted);
}

ABCLayout.prototype.printNote = function(elem, nostem) { //stem presence: true for drawing stemless notehead
  var notehead = null;
  var grace= null;
  this.roomtaken = 0; // room needed to the left of the note
  this.roomtakenright = 0; // room needed to the right of the note
  var dotshiftx = 0; // room taken by chords with displaced noteheads which cause dots to shift
  var c="";
  var flag = null;
  
  var p, i, pp;
  var width, p1, p2, dx;

  var duration = getDuration(elem);
  var durlog = Math.floor(Math.log(duration)/Math.log(2));
  var dot=0;

  for (var tot = Math.pow(2,durlog), inc=tot/2; tot<duration; dot++,tot+=inc,inc/=2);
  
  var abselem = new ABCAbsoluteElement(elem, duration, 1);

  
  if (elem.rest) {
    var restpitch = 7;
    if (this.stemdir=="down") restpitch = 3;
    if (this.stemdir=="up") restpitch = 11;
    switch(elem.rest.type) {
    case "rest": 
      c = this.chartable["rest"][-durlog]; 
      elem.averagepitch=restpitch; 
      elem.minpitch=restpitch;
      elem.maxpitch=restpitch;
      break; // TODO rests in bars is now broken
    case "invisible":
    case "spacer":
      c="";
    }
    notehead = this.printNoteHead(abselem, c, {verticalPos:restpitch}, null, 0, -this.roomtaken, null, dot, 0, 1);
    if (notehead) abselem.addHead(notehead);
    this.roomtaken+=this.accidentalshiftx;
    this.roomtakenright = Math.max(this.roomtakenright,this.dotshiftx);

  } else {
    sortPitch(elem);
    
    // determine averagepitch, minpitch, maxpitch and stem direction
    var sum=0;
    for (p=0, pp=elem.pitches.length; p<pp; p++) {
      sum += elem.pitches[p].verticalPos;
    }
    elem.averagepitch = sum/elem.pitches.length;
    elem.minpitch = elem.pitches[0].verticalPos;
    elem.maxpitch = elem.pitches[elem.pitches.length-1].verticalPos;
    var dir = (elem.averagepitch>=6) ? "down": "up";
    if (this.stemdir) dir=this.stemdir;
    
    // determine elements of chords which should be shifted
    for (p=(dir=="down")?elem.pitches.length-2:1; (dir=="down")?p>=0:p<elem.pitches.length; p=(dir=="down")?p-1:p+1) {
      var prev = elem.pitches[(dir=="down")?p+1:p-1];
      var curr = elem.pitches[p];
      var delta = (dir=="down")?prev.pitch-curr.pitch:curr.pitch-prev.pitch;
      if (delta<=1 && !prev.printer_shift) {
	curr.printer_shift=(delta)?"different":"same";
	if (dir=="down") {
	  this.roomtaken = this.glyphs.getSymbolWidth(this.chartable["note"][-durlog])+2;
	} else {
	  dotshiftx = this.glyphs.getSymbolWidth(this.chartable["note"][-durlog])+2;
	}
      }
    }
    
    
    for (p=0; p<elem.pitches.length; p++) {
      
      if (!nostem) {
	if ((dir=="down" && p!==0) || (dir=="up" && p!=pp-1)) { // not the stemmed elem of the chord
	  flag = null;
	} else {
	  flag = this.chartable[(dir=="down")?"dflags":"uflags"][-durlog];
	}
	c = this.chartable["note"][-durlog];
      } else {
	c="noteheads.quarter";
      }

      if (((this.stemdir=="up" || dir=="down") && p==pp-1) || ((this.stemdir=="down" || dir=="up") && p==0)) { // place to put slurs if not already on pitches
	if (elem.startSlur) {
	  elem.pitches[p].startSlur = elem.startSlur;
	}

	if (elem.endSlur) {
	  elem.pitches[p].endSlur = elem.endSlur; // TODO what if there is a mixture of slurs on elem and slurs on pitches?
	}
      }

      notehead = this.printNoteHead(abselem, c, elem.pitches[p], dir, 0, -this.roomtaken, flag, dot, dotshiftx, 1);
      if (notehead) abselem.addHead(notehead);
      this.roomtaken += this.accidentalshiftx;
      this.roomtakenright = Math.max(this.roomtakenright,this.dotshiftx); 
    }
      
    // draw stem from the furthest note to a pitch above/below the stemmed note
    if (!nostem && durlog<=-1) {
      p1 = (dir=="down") ? elem.minpitch-7 : elem.minpitch+1/3;
      p2 = (dir=="down") ? elem.maxpitch-1/3 : elem.maxpitch+7;
      dx = (dir=="down")?0:abselem.heads[0].w;
      width = (dir=="down")?1:-1;
      abselem.addExtra(new ABCRelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2":p2, linewidth: width}));
    }
    
  }
  
  if (elem.lyric !== undefined) {
    var lyricStr = "";
    elem.lyric.each(function(ly) {
	      lyricStr += ly.syllable + ly.divider + "\n";
      });
    abselem.addRight(new ABCRelativeElement(lyricStr, 0, lyricStr.length*5, 0, {type:"debugLow"}));
  }
  
  if (elem.gracenotes !== undefined) {
    var gracescale = 3/5;
    var gracebeam = null;
    if (elem.gracenotes.length>1) {
      gracebeam = new ABCBeamElem("grace",this.isBagpipes);
    }

    var graceoffsets = [];
    for (i=elem.gracenotes.length-1; i>=0; i--) { // figure out where to place each gracenote
      this.roomtaken+=10;
      graceoffsets[i] = this.roomtaken;
      if (elem.gracenotes[i].accidental) {
	this.roomtaken+=7;
      }
    }

    for (i=0; i<elem.gracenotes.length; i++) {
      var gracepitch = elem.gracenotes[i].verticalPos;

      flag = (gracebeam) ? null : this.chartable["uflags"][(this.isBagpipes)?5:3]; 
      grace = this.printNoteHead(abselem, "noteheads.quarter",  elem.gracenotes[i], "up", -graceoffsets[i], -graceoffsets[i], flag, 0, 0, gracescale);
      abselem.addExtra(grace);

      if (gracebeam) { // give the beam the necessary info
	var pseudoabselem = {heads:[grace], 
			     abcelem:{averagepitch: gracepitch, minpitch: gracepitch, maxpitch: gracepitch},
			     duration:(this.isBagpipes)?1/32:1/16};
	gracebeam.add(pseudoabselem);
      } else { // draw the stem
	p1 = gracepitch+1/3*gracescale;
	p2 = gracepitch+7*gracescale;
	dx = grace.dx + grace.w;
	width = -0.6;
	abselem.addExtra(new ABCRelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2":p2, linewidth: width}));
      }
      
      if (i==0 && !this.isBagpipes) this.voice.addOther(new ABCTieElem(grace, notehead, false, true));
    }

    if (gracebeam) {
      this.voice.addOther(gracebeam);
    } 
  }
  
  if (elem.decoration) {
    this.printDecoration(elem.decoration, elem.maxpitch, (notehead)?notehead.w:0, abselem, this.roomtaken);
  }
  
  if (elem.barNumber) {
    abselem.addChild(new ABCRelativeElement(elem.barNumber, -10, 0, 0, {type:"debug"}));
  }
  
  // ledger lines
  for (i=elem.maxpitch; i>11; i--) {
    if (i%2===0 && !elem.rest) {
      abselem.addChild(new ABCRelativeElement(null, -2, this.glyphs.getSymbolWidth(c)+4, i, {type:"ledger"}));
    }
  }
  
  for (i=elem.minpitch; i<1; i++) {
    if (i%2===0 && !elem.rest) {
      abselem.addChild(new ABCRelativeElement(null, -2, this.glyphs.getSymbolWidth(c)+4, i, {type:"ledger"}));
    }
  }
  
  if (elem.chord !== undefined) { //16 -> high E.
    for (i = 0; i < elem.chord.length; i++) {
      var x = 0;
      var y = 16;
      switch (elem.chord[i].position) {
      case "left":
	this.roomtaken+=7;
	x = -this.roomtaken;	// TODO-PER: This is just a guess from trial and error
	y = elem.averagepitch;
	abselem.addExtra(new ABCRelativeElement(elem.chord[i].name, x, this.glyphs.getSymbolWidth(elem.chord[i].name[0])+4, y, {type:"text"}));
	break;
      case "right":
	this.roomtakenright+=4;
	x = this.roomtakenright;// TODO-PER: This is just a guess from trial and error
	y = elem.averagepitch;
	abselem.addRight(new ABCRelativeElement(elem.chord[i].name, x, this.glyphs.getSymbolWidth(elem.chord[i].name[0])+4, y, {type:"text"}));
	break;
      case "below":
	y = -3;
      default:
	abselem.addChild(new ABCRelativeElement(elem.chord[i].name, x, 0, y, {type:"text"}));
      }
    }
  }
    

  if (elem.startTriplet) {
    this.triplet = new ABCTripletElem(elem.startTriplet, notehead, null, true); // above is opposite from case of slurs
    this.voice.addOther(this.triplet);
  }

  if (elem.endTriplet) {
    this.triplet.anchor2 = notehead;
    this.triplet = null;
  }

  return abselem;
};




ABCLayout.prototype.printNoteHead = function(abselem, c, pitchelem, dir, headx, extrax, flag, dot, dotshiftx, scale) {

  // TODO scale the dot as well
  var pitch = pitchelem.verticalPos;
  var notehead;
  var i;
  this.accidentalshiftx = 0;
  this.dotshiftx = 0;
  if (c === undefined)
    abselem.addChild(new ABCRelativeElement("pitch is undefined", 0, 0, 0, {type:"debug"}));
  else if (c==="") {
    notehead = new ABCRelativeElement(null, 0, 0, pitch);
  } else {
    var shiftheadx = headx;
    if (pitchelem.printer_shift) {
      var adjust = (pitchelem.printer_shift=="same")?1:0;
      shiftheadx = (dir=="down")?-this.glyphs.getSymbolWidth(c)*scale+adjust:this.glyphs.getSymbolWidth(c)*scale-adjust;
    }
    notehead = new ABCRelativeElement(c, shiftheadx, this.glyphs.getSymbolWidth(c)*scale, pitch, {scalex:scale, scaley: scale, extreme: ((dir=="down")?"below":"above")});
    if (flag) {
      var pos = pitch+((dir=="down")?-7:7)*scale;
      var xdelta = (dir=="down")?headx:headx+notehead.w-0.6;
      abselem.addRight(new ABCRelativeElement(flag, xdelta, this.glyphs.getSymbolWidth(flag)*scale, pos, {scalex:scale, scaley: scale}));
    }
    this.dotshiftx = notehead.w+dotshiftx-2+5*dot;
    for (;dot>0;dot--) {
      var dotadjusty = (1-pitch%2); //TODO don't adjust when above or below stave?
      abselem.addRight(new ABCRelativeElement("dots.dot", notehead.w+dotshiftx-2+5*dot, this.glyphs.getSymbolWidth("dots.dot"), pitch+dotadjusty));
    }
  }
  
  if (pitchelem.accidental) {
    var symb; 
    switch (pitchelem.accidental) {
    case "quartersharp":
      symb = "accidentals.halfsharp";
	break;
    case "dblsharp":
      symb = "accidentals.dblsharp";
      break;
    case "sharp":
      symb = "accidentals.sharp";
      break;
    case "quarterflat":
      symb = "accidentals.halfflat";
      break;
    case "flat":
      symb = "accidentals.flat";
      break;
    case "dblflat":
      symb = "accidentals.dblflat";
      break;
    case "natural":
      symb = "accidentals.nat";
    }
    this.accidentalshiftx = (this.glyphs.getSymbolWidth(symb)*scale+2);
    abselem.addExtra(new ABCRelativeElement(symb, extrax-this.accidentalshiftx, this.glyphs.getSymbolWidth(symb), pitch, {scalex:scale, scaley: scale}));
  }
  
  if (pitchelem.endTie) {
    if (this.ties[0]) {
      this.ties[0].anchor2=notehead;
      this.ties = this.ties.slice(1,this.ties.length);
    }
  }
  
  if (pitchelem.startTie) {
    var tie = new ABCTieElem(notehead, null, (this.stemdir=="up" || dir=="down") && this.stemdir!="down",(this.stemdir=="down" || this.stemdir=="up"));
    this.ties[this.ties.length]=tie;
    this.voice.addOther(tie);
  }

  if (pitchelem.endSlur) {
    for (i=0; i<pitchelem.endSlur.length; i++) {
      var slurid = pitchelem.endSlur[i];
      var slur;
      if (this.slurs[slurid]) {
	slur = this.slurs[slurid].anchor2=notehead;
	delete this.slurs[slurid];
      } else {
	slur = new ABCTieElem(null, notehead, dir=="down",(this.stemdir=="up" || dir=="down") && this.stemdir!="down", this.stemdir);
	this.voice.addOther(slur);
      }
      if (this.startlimitelem) {
	slur.startlimitelem = this.startlimitelem;
      }
    }
  }
  
  if (pitchelem.startSlur) {
    for (i=0; i<pitchelem.startSlur.length; i++) {
      var slurid = pitchelem.startSlur[i];
      var slur = new ABCTieElem(notehead, null, (this.stemdir=="up" || dir=="down") && this.stemdir!="down", this.stemdir);
      this.slurs[slurid]=slur;
      this.voice.addOther(slur);
    }
  }
  
  return notehead;

};

ABCLayout.prototype.printDecoration = function(decoration, pitch, width, abselem, roomtaken) {
  var dec;
  var unknowndecs = [];
  var yslot = (pitch>9) ? pitch+3 : 12;
  var ypos;
  var i;
  roomtaken = roomtaken || 0;
  (pitch===5) && (yslot=14); // avoid upstem of the A

  for (i=0;i<decoration.length; i++) { // treat staccato first (may need to shift other markers) //TODO, same with tenuto?
    if (decoration[i]==="staccato") {
      ypos = ((this.stemdir=="down" || pitch>=6) && this.stemdir!=="up") ? pitch+2:pitch-2;
      (pitch===4) && ypos--; // don't place on a stave line
      ((pitch===6) || (pitch===8)) && ypos++;
      (pitch>9) && yslot++; // take up some room of those that are above
      var deltax = width/2;
      if (this.glyphs.getSymbolAlign("scripts.staccato")!=="center") {
	deltax -= (this.glyphs.getSymbolWidth(dec)/2);
      }
      abselem.addChild(new ABCRelativeElement("scripts.staccato", deltax, this.glyphs.getSymbolWidth("scripts.staccato"), ypos));
    }
    if (decoration[i]==="slide" && abselem.heads[0]) {
      ypos = abselem.heads[0].pitch;
      var blank1 = new ABCRelativeElement("", -roomtaken-15, 0, ypos-1);
      var blank2 = new ABCRelativeElement("", -roomtaken-5, 0, ypos+1);
      abselem.addChild(blank1);
      abselem.addChild(blank2);
      this.voice.addOther(new ABCTieElem(blank1, blank2, false));
    }
  }

  for (i=0;i<decoration.length; i++) {
    switch(decoration[i]) {
    case "trill":dec="scripts.trill";break;
    case "roll": dec="scripts.roll"; break;
    case "marcato": dec="scripts.umarcato"; break;
    case "marcato2": dec="scriopts.dmarcato"; break;//other marcato
    case "turn": dec="scripts.turn"; break;
    case "uppermordent": dec="scripts.prall"; break;
    case "mordent":
    case "lowermordent": dec="scripts.mordent"; break;
    case "staccato":
    case "slide": continue;
    case "downbow": dec="scripts.downbow";break;
    case "upbow": dec="scripts.upbow";break;
    case "fermata": dec="scripts.ufermata"; break;
    case "invertedfermata": dec="scripts.dfermata"; break;
    case "breath": dec=","; break;
    case "accent": dec="scripts.sforzato"; break;
    case "tenuto": dec="scripts.tenuto"; break;
    case "coda": dec="scripts.coda"; break;
    case "segno": dec="scripts.segno"; break;
    case "p": 
    case "mp": 
    case "ppp": 
    case "pppp": 
    case "f":
    case "ff": 
    case "fff": 
    case "ffff":
    case "sfz": 
    case "mf": dec = decoration[i]; break;
    default:
    unknowndecs[unknowndecs.length]=decoration[i];
    continue;
    }
    ypos=yslot;
    yslot+=3;
    var deltax = width/2;
    if (this.glyphs.getSymbolAlign(dec)!=="center") {
      deltax -= (this.glyphs.getSymbolWidth(dec)/2);
    }
    abselem.addChild(new ABCRelativeElement(dec, deltax, this.glyphs.getSymbolWidth(dec), ypos));
  }
  (unknowndecs.length>0) && abselem.addChild(new ABCRelativeElement(unknowndecs.join(','), 0, 0, 0, {type:"debug"}));
};

ABCLayout.prototype.printBarLine = function (elem) {
// bar_thin, bar_thin_thick, bar_thin_thin, bar_thick_thin, bar_right_repeat, bar_left_repeat, bar_double_repeat

  var abselem = new ABCAbsoluteElement(elem, 0, 10);
  var anchor = null; // place to attach part lines
  var dx = 0;



  var firstdots = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat");
  var firstthin = (elem.type!="bar_left_repeat" && elem.type!="bar_thick_thin" && elem.type!="bar_invisible");
  var thick = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat" || elem.type==="bar_left_repeat" ||
	       elem.type==="bar_thin_thick" || elem.type==="bar_thick_thin");
  var secondthin = (elem.type==="bar_left_repeat" || elem.type==="bar_thick_thin" || elem.type==="bar_thin_thin" || elem.type==="bar_dbl_repeat");
  var seconddots = (elem.type==="bar_left_repeat" || elem.type==="bar_dbl_repeat");

  // limit positionning of slurs
  if (firstdots || seconddots) {
    for (var slur in this.slurs) {
      if (this.slurs.hasOwnProperty(slur)) {
	this.slurs[slur].endlimitelem = abselem;
      }
    }
    this.startlimitelem = abselem;
  }

  if (firstdots) {
    abselem.addRight(new ABCRelativeElement("dots.dot", dx, 1, 7));
    abselem.addRight(new ABCRelativeElement("dots.dot", dx, 1, 5));
    dx+=6; //2 hardcoded, twice;
  }

  if (firstthin) {
    anchor = new ABCRelativeElement(null, dx, 1, 2, {"type": "bar", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor);
  }

  if (elem.type==="bar_invisible") {
    anchor = new ABCRelativeElement(null, dx, 1, 2, {"type": "none", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor);
  }

  if (elem.decoration) {
    this.printDecoration(elem.decoration, 12, (thick)?3:1, abselem);
  }

  if (thick) {
    dx+=4; //3 hardcoded;    
    anchor = new ABCRelativeElement(null, dx, 4, 2, {"type": "bar", "pitch2":10, linewidth:4});
    abselem.addRight(anchor);
    dx+=5;
  }
  
//   if (this.partstartelem && (thick || (firstthin && secondthin))) { // means end of nth part
//     this.partstartelem.anchor2=anchor;
//     this.partstartelem = null;
//   }

  if (this.partstartelem && elem.endEnding) {
    this.partstartelem.anchor2=anchor;
    this.partstartelem = null;
  }

  if (secondthin) {
    dx+=3; //3 hardcoded;
    anchor = new ABCRelativeElement(null, dx, 1, 2, {"type": "bar", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor); // 3 is hardcoded
  }

  if (seconddots) {
    dx+=3; //3 hardcoded;
    abselem.addRight(new ABCRelativeElement("dots.dot", dx, 1, 7));
    abselem.addRight(new ABCRelativeElement("dots.dot", dx, 1, 5));
  } // 2 is hardcoded

  if (elem.startEnding) {
    this.partstartelem = new ABCEndingElem(elem.startEnding, anchor, null);
    this.voice.addOther(this.partstartelem);
  } 

  return abselem;	

};

ABCLayout.prototype.printClef = function(elem) {
  var clef = "clefs.G";
  var pitch = 4;
  var abselem = new ABCAbsoluteElement(elem,0,10);
  switch (elem.type) {
  case "treble": break;
  case "tenor": clef="clefs.C"; pitch=8; break;
  case "alto": clef="clefs.C"; pitch=6; break;
  case "bass": clef="clefs.F"; pitch=8; break;
  case 'treble+8': break;
  case 'tenor+8':clef="clefs.C"; pitch=8; break;
  case 'bass+8': clef="clefs.F"; pitch=8; break;
  case 'alto+8': clef="clefs.C"; pitch=6; break;
  case 'treble-8': break;
  case 'tenor-8':clef="clefs.C"; pitch=8; break;
  case 'bass-8': clef="clefs.F"; pitch=8; break;
  case 'alto-8': clef="clefs.C"; pitch=6; break;
  default: abselem.addChild(new ABCRelativeElement("clef="+elem.type, 0, 0, 0, {type:"debug"}));
  }    
  if (elem.verticalPos) {
    pitch = elem.verticalPos;
  }

  
  var dx =10;
  abselem.addRight(new ABCRelativeElement(clef, dx, this.glyphs.getSymbolWidth(clef), pitch));
  return abselem;
};
ABCLayout.prototype.printKeySignature = function(elem) {
  var abselem = new ABCAbsoluteElement(elem,0,10);
  var dx = 0;
  if (elem.accidentals) {
	  elem.accidentals.each(function(acc) {
		var symbol = (acc.acc === "sharp") ? "accidentals.sharp" : (acc.acc === "natural") ? "accidentals.nat" : "accidentals.flat";
		//var notes = { 'A': 5, 'B': 6, 'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G':4, 'a': 12, 'b': 13, 'c': 7, 'd': 8, 'e': 9, 'f': 10, 'g':11 };
		abselem.addRight(new ABCRelativeElement(symbol, dx, this.glyphs.getSymbolWidth(symbol), acc.verticalPos));
		dx += this.glyphs.getSymbolWidth(symbol)+2;
	  }, this);
  }
  this.startlimitelem = abselem; // limit ties here
  return abselem;
};

ABCLayout.prototype.printTimeSignature= function(elem) {

  var abselem = new ABCAbsoluteElement(elem,0,20);
  if (elem.type === "specified") {
    //TODO make the alignment for time signatures centered
    for (var i = 0; i < elem.value.length; i++) {
      if (i !== 0)
        abselem.addRight(new ABCRelativeElement('+', i*20-9, this.glyphs.getSymbolWidth("+"), 7));
      abselem.addRight(new ABCRelativeElement(elem.value[i].num, i*20, this.glyphs.getSymbolWidth(elem.value[i].num.charAt(0))*elem.value[i].num.length, 9));
      abselem.addRight(new ABCRelativeElement(elem.value[i].den, i*20, this.glyphs.getSymbolWidth(elem.value[i].den.charAt(0))*elem.value[i].den.length, 5));
    }
  } else if (elem.type === "common_time") {
    abselem.addRight(new ABCRelativeElement("timesig.common", 0, this.glyphs.getSymbolWidth("timesig.common"), 7));

  } else if (elem.type === "cut_time") {
    abselem.addRight(new ABCRelativeElement("timesig.cut", 0, this.glyphs.getSymbolWidth("timesig.cut"), 7));
  }
  this.startlimitelem = abselem; // limit ties here
  return abselem;
};
