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
/*extern ABCLayout getDuration getDurlog */

var getDuration = function(elem) {
  var d = 0;
  if (elem) {
    if (elem.duration) 
      d = elem.duration;
    else if (elem.pitches && elem.pitches[0])
      d = elem.pitches[0].duration;
  } 
  return d;
};

var getDurlog = function(duration) {
  return Math.floor(Math.log(duration)/Math.log(2));
}

function ABCLayout(glyphs, space, width) {
  this.glyphs = glyphs;
  this.space = space;
  this.width = width;
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

ABCLayout.prototype.printABCLine = function(staffs, y) {
  this.y = y;
  this.staffgroup = new ABCStaffGroupElement();
  for (var s = 0; s < staffs.length; s++) {
    this.printABCStaff(staffs[s]);
    if (s !== staffs.length-1)
      this.y+= (AbcSpacing.STAVEHEIGHT*0.8); // staffgroups a bit closer than others
  }
  return this.staffgroup;
};

ABCLayout.prototype.printABCStaff = function(abcstaff) {

  var header = "";
  if (abcstaff.bracket) header += "bracket "+abcstaff.bracket+" ";
  if (abcstaff.brace) header += "brace "+abcstaff.brace+" ";
  if (abcstaff.connectBarLines) header += "bar "+abcstaff.connectBarLines+" ";
  if (abcstaff.title) {
    abcstaff.title.each(function(t) { header += t; });
  }
  
  for (var v = 0; v < abcstaff.voices.length; v++) {
    this.staff = new ABCVoiceElement(this.y);
    if (v==0) {
      this.staff.header=header;
      this.staff.addChild(this.printClef(abcstaff.clef));
      this.staff.addChild(this.printKeySignature(abcstaff.key));
      if (abcstaff.meter)
	this.staff.addChild(this.printTimeSignature(abcstaff.meter));
    } else {
      this.staff.addInvisibleChild(this.printClef(abcstaff.clef));
      this.staff.addInvisibleChild(this.printKeySignature(abcstaff.key));
      if (abcstaff.meter)
	this.staff.addInvisibleChild(this.printTimeSignature(abcstaff.meter));
    }
    this.staffgroup.addVoice(this.printABCVoice(abcstaff.voices[v]));
  }
 
};

ABCLayout.prototype.printABCVoice = function(abcline) {
  this.stemdir = null;
  this.abcline = abcline;
  if (this.partstartelem) {
    this.partstartelem = new ABCEndingElem("", null, null);
    this.staff.addOther(this.partstartelem);
  }
  this.slurs = [];
  this.ties = [];
  for (this.pos=0; this.pos<this.abcline.length; this.pos++) {
    var abselems = this.printABCElement();
    for (var i=0; i<abselems.length; i++) {
      this.staff.addChild(abselems[i]);
    }
  }
  return this.staff;
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
    break;
  case "meter":
    elemset[0] = this.printTimeSignature(elem);
    break;
  case "clef":
    elemset[0] = this.printClef(elem);
    break;
  case "key":
    elemset[0] = this.printKeySignature(elem);
    break;
  case "stem":
    this.stemdir=elem.direction;
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
  
  if (this.getElem().startBeam) {
    var beamelem = new ABCBeamElem(this.stemdir);
    while (this.getElem()) {
      abselem = this.printNote(this.getElem(),true);
      abselemset[abselemset.length] = abselem;
      beamelem.add(abselem);
      if (this.getElem().endBeam) {
		break;
      }
      this.pos++;
    }
    this.staff.addOther(beamelem);
  } else if (this.getNextElem() && this.getNextElem().el_type=="note" && !this.getElem().end_beam) {
    var beamelem = new ABCBeamElem(this.stemdir);

    while (this.getElem()) {
      abselem = this.printNote(this.getElem(),true);
      abselemset[abselemset.length] = abselem;
      beamelem.add(abselem);
      if (!this.getNextElem() || this.getNextElem().el_type!=="note" || this.getElem().end_beam) {
		break;
      }
      this.pos++;
    }
    this.staff.addOther(beamelem);
  } else {
    abselemset[0] = this.printNote(this.getElem());
  }
  return abselemset;
};

function sortPitch(elem) {
  do {
    var sorted = true;
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
  var roomtaken = 0; // room needed to the left of the note
  var dotshift = 0; // room taken by chords with displaced noteheads which cause dots to shift
  if (elem.pitches==undefined) {
    elem.pitches=[{accidental:elem.accidental, pitch:elem.pitch, duration:elem.duration, startTie: elem.startTie,
		   endTie: elem.endTie, startSlur: elem.startSlur, endSlur: elem.endSlur}]
  }

  var duration = getDuration(elem);
  var durlog = Math.floor(Math.log(duration)/Math.log(2));
  
  var chartable = {rest:{0:"rests.whole", 1:"rests.half", 2:"rests.quarter", 3:"rests.8th", 4: "rests.16th",5: "rests.32nd", 6: "rests.64th", 7: "rests.128th"},
		   note:{"-1": "noteheads.dbl", 0:"noteheads.whole", 1:"noteheads.half", 2:"noteheads.quarter", 3:"noteheads.quarter", 4:"noteheads.quarter", 5:"noteheads.quarter", 6:"noteheads.quarter"},
		   uflags:{3:"flags.u8th", 4:"flags.u16th", 5:"flags.u32nd", 6:"flags.u64th"},
		   dflags:{3:"flags.d8th", 4:"flags.d16th", 5:"flags.d32nd", 6:"flags.d64th"}};
              
  sortPitch(elem);
  abselem = new ABCAbsoluteElement(elem, duration, 1);
  
  var sum=0
  for (var p=0, pp=elem.pitches.length; p<pp; p++) {
    sum += elem.pitches[p].pitch;
  }

  elem.averagepitch = sum/elem.pitches.length;
  var dir = (elem.averagepitch>=6) ? "down": "up";
  if (this.stemdir) dir=this.stemdir;

  // determine elements of chords which should be shifted
  for (var p=(dir=="down")?elem.pitches.length-2:1; (dir=="down")?p>=0:p<elem.pitches.length; p=(dir=="down")?p-1:p+1) {
    var prev = elem.pitches[(dir=="down")?p+1:p-1];
    var curr = elem.pitches[p];
    var delta = (dir=="down")?prev.pitch-curr.pitch:curr.pitch-prev.pitch;
    if (delta<=1 && !prev.printer_shift) {
      curr.printer_shift=(delta)?"different":"same";
      if (dir=="down") {
	roomtaken = this.glyphs.getSymbolWidth(chartable["note"][-durlog])+2
      } else {
	dotshift = this.glyphs.getSymbolWidth(chartable["note"][-durlog])+2
      }
    }
  }

  for (var p=0; p<elem.pitches.length; p++) {
    var pitch = elem.pitches[p].pitch;
    var extraflags = false;

    var dot=0;
    for (var tot = Math.pow(2,durlog), inc=tot/2; tot<duration; dot++,tot+=inc,inc/=2);

    var c = "";
    if (elem.rest) {
      pitch = 7;
      switch(elem.rest.type) {
      case "rest": c = chartable["rest"][-durlog]; elem.averagepitch=7; break; // TODO rests in bars is now broken
      case "invisible":
      case "spacer":
	c="";
      }
    } else if (!nostem) {
      if ((dir=="down" && p!=0) || (dir=="up" && p!=pp-1)) { // not the stemmed elem of the chord
	extraflags = false;
      } else {
	extraflags = true;
      }
      c = chartable["note"][-durlog];
    } else {
      c="noteheads.quarter";
    }
    
    
    
    
    if (c === undefined)
      abselem.addChild(new ABCRelativeElement("chartable[??][" + (-durlog) + '] is undefined', 0, 0, 0, {type:"debug"}));
    else if (c==="") {
      notehead = new ABCRelativeElement(null, 0, 0, pitch);
      abselem.addHead(notehead);
    } else {
      var headx = 0;
      if (elem.pitches[p].printer_shift) {
	adjust = (elem.pitches[p].printer_shift="same")?1:0;
	headx = (dir=="down")?-this.glyphs.getSymbolWidth(c)+adjust:this.glyphs.getSymbolWidth(c)-adjust;
      }
      notehead = new ABCRelativeElement(c, headx, this.glyphs.getSymbolWidth(c), pitch);
      abselem.addHead(notehead);
      if (extraflags) {
	var pos = pitch+((dir=="down")?-7:7);
	var flag = chartable[(dir=="down")?"dflags":"uflags"][-durlog];
	var xdelta = (dir=="down")?0:this.glyphs.getSymbolWidth(c)-0.6;
	if (flag) abselem.addRight(new ABCRelativeElement(flag, xdelta, this.glyphs.getSymbolWidth(flag), pos));
      }
      for (;dot>0;dot--) {
	var dotadjust = (1-pitch%2); //TODO don't adjust when above or below stave?
	abselem.addRight(new ABCRelativeElement("dots.dot", notehead.w+dotshift-2+5*dot, this.glyphs.getSymbolWidth("dots.dot"), pitch+dotadjust));
      }
    }

    if (elem.pitches[p].accidental !== undefined && elem.pitches[p].accidental !== 'none') {
      var symb; 
      switch (elem.pitches[p].accidental) {
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
      roomtaken += (this.glyphs.getSymbolWidth(symb)+2);
      abselem.addExtra(new ABCRelativeElement(symb, -roomtaken, this.glyphs.getSymbolWidth(symb), pitch));
    }

    if (elem.pitches[p].endTie) {
      if (this.ties[0]) {
        this.ties[0].anchor2=notehead;
        this.ties = this.ties.slice(1,this.ties.length);
	  }
    }

    if (elem.pitches[p].startTie) {
      var tie = new ABCTieElem(notehead, null, (dir=="down"));
      this.ties[this.ties.length]=tie;
      this.staff.addOther(tie);
    }

  }
  
  // draw stem from the furthest note to a pitch above/below the stemmed note
  if (!nostem && durlog<=-1 && !elem.rest) {
    var p1 = (dir=="down") ? elem.pitches[0].pitch-7 : elem.pitches[0].pitch+1/3;
    var p2 = (dir=="down") ? elem.pitches[elem.pitches.length-1].pitch-1/3 : elem.pitches[elem.pitches.length-1].pitch+7;
    var dx = (dir=="down")?0:abselem.heads[0].w;
    var width = (dir=="down")?1:-1;
    abselem.addExtra(new ABCRelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2":p2, linewidth: width}));
  }

  
  if (elem.lyric !== undefined) {
	  var lyricStr = "";
	  elem.lyric.each(function(ly) {
	      lyricStr += ly.syllable + ly.divider + "\n";
	    });
    abselem.addChild(new ABCRelativeElement(lyricStr, 0, 0, 0, {type:"debugLow"}));
  }
  
  if (elem.gracenotes !== undefined) {
    var gracescale = 3/5;
    var gracebeam = null;
    if (elem.gracenotes.length>1) {
      gracebeam = new ABCBeamElem("grace");
    }
    for (var i=elem.gracenotes.length-1; i>=0; i--) {
      var gracepitch = elem.gracenotes[i].pitch
      roomtaken +=10; // hardcoded
      var grace = new ABCRelativeElement("noteheads.quarter", -roomtaken, this.glyphs.getSymbolWidth("noteheads.quarter")*gracescale, gracepitch, {scalex:gracescale, scaley: gracescale});
      abselem.addExtra(grace);
      if (gracebeam) {
	var pseudoabselem = {heads:[grace], 
			     abcelem:{duration: 1/16, pitches:[{pitch:gracepitch}], averagepitch: gracepitch},
			     duration:1/16};
	gracebeam.add(pseudoabselem);
      }
      
      
      if (elem.gracenotes[i].accidental) {
	var symb; 
	switch (elem.gracenotes[i].accidental) {
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
	roomtaken += (this.glyphs.getSymbolWidth(symb)*gracescale+2);
	abselem.addExtra(new ABCRelativeElement(symb, -roomtaken, 
						this.glyphs.getSymbolWidth(symb)*gracescale, elem.gracenotes[i].pitch, {scalex:gracescale, scaley: gracescale}));
      }
      if (i==0) this.staff.addOther(new ABCTieElem(grace, notehead, false));
    }
    if (gracebeam) {
      this.staff.addOther(gracebeam);
    } else {
      
      var p1 = gracepitch+1/5;
      var p2 = gracepitch+5;
      var dx = grace.dx + grace.w;
      var width = -0.6;
      abselem.addExtra(new ABCRelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2":p2, linewidth: width}));
      var pos = p2;
      var flag = chartable["uflags"][3];
      var xdelta = grace.dx+grace.w+width;
      abselem.addChild(new ABCRelativeElement(flag, xdelta, this.glyphs.getSymbolWidth(flag)*gracescale, pos, {scalex:gracescale, scaley: gracescale}));
      
    }
  }
  
  if (elem.decoration) {
    this.printDecoration(elem.decoration, pitch, (notehead)?notehead.w:0, abselem, roomtaken);
  }
  
  if (elem.barNumber) {
    abselem.addChild(new ABCRelativeElement(elem.barNumber, -10, 0, 0, {type:"debug"}));
  }
  
  // ledger lines
  for (i=elem.pitches[elem.pitches.length-1].pitch; i>11; i--) {
    if (i%2===0 && !elem.rest) {
      abselem.addChild(new ABCRelativeElement(null, -2, this.glyphs.getSymbolWidth(c)+4, i, {type:"ledger"}));
    }
  }
  
  for (i=elem.pitches[0].pitch; i<1; i++) {
    if (i%2===0 && !elem.rest) {
      abselem.addChild(new ABCRelativeElement(null, -2, this.glyphs.getSymbolWidth(c)+4, i, {type:"ledger"}));
    }
  }
  
  if (elem.chord !== undefined) { //16 -> high E.
    abselem.addChild(new ABCRelativeElement(elem.chord.name, 0, 0, (elem.chord.position=="below")?-3:16, {type:"text"}));
  }

  for (var i=elem.endSlur;i>0;i--) {
    if (this.slurs.length==0) {
      abselem.addChild(new ABCRelativeElement("missing begin slur", 0, 0, 0, {type:"debug"}));
      continue;
    }
    this.slurs[this.slurs.length-1].anchor2=notehead;
    this.slurs = this.slurs.slice(0,this.slurs.length-1);
  }

  for (var i=elem.startSlur;i>0;i--) {
    var slur = new ABCTieElem(notehead, null, (dir=="down"));
    this.slurs[this.slurs.length]=slur;
    this.staff.addOther(slur);
  }
  

    


  if (elem.startTriplet) {
    this.triplet = new ABCTripletElem(elem.startTriplet, notehead, null, true); // above is opposite from case of slurs
    this.staff.addOther(this.triplet);
  }

  if (elem.endTriplet) {
    this.triplet.anchor2 = notehead;
    this.triplet = null;
  }

  return abselem;
};

ABCLayout.prototype.printDecoration = function(decoration, pitch, width, abselem, roomtaken) {
  var dec;
  var unknowndecs = [];
  var yslot = (pitch>9) ? pitch+3 : 12;
  var ypos;
  roomtaken = roomtaken || 0;
  (pitch===5) && (yslot=14); // avoid upstem of the A

  for (var i=0;i<decoration.length; i++) { // treat staccato first (may need to shift other markers) //TODO, same with tenuto?
    if (decoration[i]==="staccato") {
      ypos = ((this.stemdir=="down" || pitch>=6) && !this.stemdir=="up") ? pitch+2:pitch-2;
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
      blank1 = new ABCRelativeElement("", -roomtaken-15, 0, ypos-1);
      blank2 = new ABCRelativeElement("", -roomtaken-5, 0, ypos+1);
      abselem.addChild(blank1);
      abselem.addChild(blank2);
      this.staff.addOther(new ABCTieElem(blank1, blank2, false))
    }
  }

  for (var i=0;i<decoration.length; i++) {
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
}

ABCLayout.prototype.printBarLine = function (elem) {
// bar_thin, bar_thin_thick, bar_thin_thin, bar_thick_thin, bar_right_repeat, bar_left_repeat, bar_double_repeat

  var abselem = new ABCAbsoluteElement(elem, 0, 10);
  var anchor = null; // place to attach part lines
  var dx = 0;

  var firstdots = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat");
  var firstthin = (elem.type!="bar_left_repeat" && elem.type!="bar_thick_thin");
  var thick = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat" || elem.type==="bar_left_repeat" ||
	       elem.type==="bar_thin_thick" || elem.type==="bar_thick_thin");
  var secondthin = (elem.type==="bar_left_repeat" || elem.type==="bar_thick_thin" || elem.type==="bar_thin_thin" || elem.type==="bar_dbl_repeat");
  var seconddots = (elem.type==="bar_left_repeat" || elem.type==="bar_dbl_repeat");

  if (firstdots) {
    abselem.addRight(new ABCRelativeElement("dots.dot", dx, 1, 7));
    abselem.addRight(new ABCRelativeElement("dots.dot", dx, 1, 5));
    dx+=6; //2 hardcoded, twice;
  }

  if (firstthin) {
    anchor = new ABCRelativeElement(null, dx, 1, 2, {"type": "stem", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor);
    symbscale = 1;
  }

  if (elem.decoration) {
    this.printDecoration(elem.decoration, 12, (thick)?3:1, abselem);
  }

  if (thick) {
    dx+=6; //3 hardcoded;    
    anchor = new ABCRelativeElement(null, dx, 4, 2, {"type": "stem", "pitch2":10, scalex:6, linewidth:0.6});
    abselem.addRight(anchor);
    dx+=4;
  }
  
  if (this.partstartelem && (thick || (firstthin && secondthin))) { // means end of nth part
    this.partstartelem.anchor2=anchor;
    this.partstartelem = null;
  }


  if (secondthin) {
    dx+=3; //3 hardcoded;
    anchor = new ABCRelativeElement(null, dx, 1, 2, {"type": "stem", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor); // 3 is hardcoded
  }

  if (seconddots) {
    dx+=3; //3 hardcoded;
    abselem.addRight(new ABCRelativeElement("dots.dot", dx, 1, 7));
    abselem.addRight(new ABCRelativeElement("dots.dot", dx, 1, 5));
  } // 2 is hardcoded

  if (elem.ending) {
    this.partstartelem = new ABCEndingElem(elem.ending, anchor, null);
    this.staff.addOther(this.partstartelem);
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
  default: abselem.addChild(new ABCRelativeElement("clef="+elem.type, 0, 0, 0, {type:"debug"}));
  }    
  if (elem.pitch) {
    pitch = elem.pitch;
  }

  
  var dx =10;
  abselem.addRight(new ABCRelativeElement(clef, dx, this.glyphs.getSymbolWidth(clef), pitch));
  return abselem;
};
ABCLayout.prototype.printKeySignature = function(elem) {
  var abselem = new ABCAbsoluteElement(elem,0,10);
  var dx = 0;
  if (elem.regularKey) {
	  var FLATS = [6,9,5,8,4,7];
	  var SHARPS = [10,7,11,8,5,9];
	  var accidentals = (elem.regularKey.acc !== "sharp") ? FLATS : SHARPS;
	  var number = elem.regularKey.num;
	  var symbol = (elem.regularKey.acc !== "sharp") ? "accidentals.flat" : "accidentals.sharp";
	  for (var i=0; i<number; i++) {
		abselem.addRight(new ABCRelativeElement(symbol, dx, this.glyphs.getSymbolWidth(symbol), accidentals[i]));
		dx += this.glyphs.getSymbolWidth(symbol)+2;
	  }
  }
  if (elem.extraAccidentals) {
	  elem.extraAccidentals.each(function(acc) {
		var symbol = (acc.acc === "sharp") ? "accidentals.sharp" : (acc.acc === "natural") ? "accidentals.nat" : "accidentals.flat";
		var notes = { 'A': 5, 'B': 6, 'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G':4, 'a': 12, 'b': 13, 'c': 7, 'd': 8, 'e': 9, 'f': 10, 'g':11 };
		abselem.addRight(new ABCRelativeElement(symbol, dx, this.glyphs.getSymbolWidth(symbol), notes[acc.note]));
		dx += this.glyphs.getSymbolWidth(symbol)+2;
	  }, this);
  }
  return abselem;
};

ABCLayout.prototype.printTimeSignature= function(elem) {

  var abselem = new ABCAbsoluteElement(elem,0,20);
  if (elem.type === "specified") {
    //TODO make the alignment for time signatures centered
    for (var i = 0; i < elem.value.length; i++) {
      if (i !== 0)	// TODO-PER: I used '9' where it should be + to make if visible for now.
        abselem.addRight(new ABCRelativeElement('+', i*20-9, this.glyphs.getSymbolWidth("+"), 7));
      abselem.addRight(new ABCRelativeElement(elem.value[i].num, i*20, this.glyphs.getSymbolWidth(elem.value[i].num[0])*elem.value[i].num.length, 9));
      abselem.addRight(new ABCRelativeElement(elem.value[i].den, i*20, this.glyphs.getSymbolWidth(elem.value[i].den[0])*elem.value[i].den.length, 5));
    }
  } else if (elem.type === "common_time") {
    abselem.addRight(new ABCRelativeElement("timesig.common", 0, this.glyphs.getSymbolWidth("timesig.common"), 7));

  } else if (elem.type === "cut_time") {
    abselem.addRight(new ABCRelativeElement("timesig.cut", 0, this.glyphs.getSymbolWidth("timesig.cut"), 7));
  }
  return abselem;
};
