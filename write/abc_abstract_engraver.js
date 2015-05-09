// abc_abstract_engraver.js: Creates a data structure suitable for printing a line of abc
// Copyright (C) 2010 Gregory Dyke (gregdyke at gmail dot com)
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

/*global window, ABCJS */

if (!window.ABCJS)
        window.ABCJS = {};

if (!window.ABCJS.write)
        window.ABCJS.write = {};

(function() {
	"use strict";

ABCJS.write.getDuration = function(elem) {
  var d = 0;
  if (elem.duration) {
    d = elem.duration;
  }
  return d;
};

ABCJS.write.getDurlog = function(duration) {
        // TODO-PER: This is a hack to prevent a Chrome lockup. Duration should have been defined already,
        // but there's definitely a case where it isn't. [Probably something to do with triplets.]
        if (duration === undefined) {
                return 0;
        }
//        console.log("getDurlog: " + duration);
  return Math.floor(Math.log(duration)/Math.log(2));
};

ABCJS.write.AbstractEngraver = function(bagpipes, renderer) {
	this.decoration = new ABCJS.write.Decoration();
	this.renderer = renderer;
  this.isBagpipes = bagpipes;
  this.chartable = {rest:{0:"rests.whole", 1:"rests.half", 2:"rests.quarter", 3:"rests.8th", 4: "rests.16th",5: "rests.32nd", 6: "rests.64th", 7: "rests.128th"},
                 note:{"-1": "noteheads.dbl", 0:"noteheads.whole", 1:"noteheads.half", 2:"noteheads.quarter", 3:"noteheads.quarter", 4:"noteheads.quarter", 5:"noteheads.quarter", 6:"noteheads.quarter", 7:"noteheads.quarter", 'nostem':"noteheads.quarter"},
                 rhythm:{"-1": "noteheads.slash.whole", 0:"noteheads.slash.whole", 1:"noteheads.slash.whole", 2:"noteheads.slash.quarter", 3:"noteheads.slash.quarter", 4:"noteheads.slash.quarter", 5:"noteheads.slash.quarter", 6:"noteheads.slash.quarter", 7:"noteheads.slash.quarter", nostem: "noteheads.slash.nostem"},
                 x:{"-1": "noteheads.indeterminate", 0:"noteheads.indeterminate", 1:"noteheads.indeterminate", 2:"noteheads.indeterminate", 3:"noteheads.indeterminate", 4:"noteheads.indeterminate", 5:"noteheads.indeterminate", 6:"noteheads.indeterminate", 7:"noteheads.indeterminate", nostem: "noteheads.indeterminate"},
                 harmonic:{"-1": "noteheads.harmonic.quarter", 0:"noteheads.harmonic.quarter", 1:"noteheads.harmonic.quarter", 2:"noteheads.harmonic.quarter", 3:"noteheads.harmonic.quarter", 4:"noteheads.harmonic.quarter", 5:"noteheads.harmonic.quarter", 6:"noteheads.harmonic.quarter", 7:"noteheads.harmonic.quarter", nostem: "noteheads.harmonic.quarter"},
                 uflags:{3:"flags.u8th", 4:"flags.u16th", 5:"flags.u32nd", 6:"flags.u64th"},
                 dflags:{3:"flags.d8th", 4:"flags.d16th", 5:"flags.d32nd", 6:"flags.d64th"}};
	this.reset();
};

ABCJS.write.AbstractEngraver.prototype.reset = function() {
	this.slurs = {};
	this.ties = [];
	this.slursbyvoice = {};
	this.tiesbyvoice = {};
	this.endingsbyvoice = {};
	this.s = 0; // current staff number
	this.v = 0; // current voice number on current staff
	this.tripletmultiplier = 1;

	this.abcline = undefined;
	this.accidentalSlot = undefined;
	this.accidentalshiftx = undefined;
	this.dotshiftx = undefined;
	this.hasVocals = false;
	this.minY = undefined;
	this.partstartelem = undefined;
	this.pos = undefined;
	this.roomtaken = undefined;
	this.roomtakenright = undefined;
	this.staffgroup = undefined;
	this.startlimitelem = undefined;
	this.stemdir = undefined;
	this.voice = undefined;
};

ABCJS.write.AbstractEngraver.prototype.setStemHeight = function(heightInPixels) {
	this.stemHeight = heightInPixels / ABCJS.write.spacing.STEP;
};

ABCJS.write.AbstractEngraver.prototype.getCurrentVoiceId = function() {
  return "s"+this.s+"v"+this.v;
};

ABCJS.write.AbstractEngraver.prototype.pushCrossLineElems = function() {
  this.slursbyvoice[this.getCurrentVoiceId()] = this.slurs;
  this.tiesbyvoice[this.getCurrentVoiceId()] = this.ties;
  this.endingsbyvoice[this.getCurrentVoiceId()] = this.partstartelem;
};

ABCJS.write.AbstractEngraver.prototype.popCrossLineElems = function() {
  this.slurs = this.slursbyvoice[this.getCurrentVoiceId()] || {};
  this.ties = this.tiesbyvoice[this.getCurrentVoiceId()] || [];
  this.partstartelem = this.endingsbyvoice[this.getCurrentVoiceId()];
};

ABCJS.write.AbstractEngraver.prototype.getElem = function() {
  if (this.abcline.length <= this.pos)
    return null;
  return this.abcline[this.pos];
};

ABCJS.write.AbstractEngraver.prototype.getNextElem = function() {
        if (this.abcline.length <= this.pos+1)
                return null;
    return this.abcline[this.pos+1];
};

	ABCJS.write.AbstractEngraver.prototype.containsLyrics = function(staves) {
		for (var i = 0; i < staves.length; i++) {
			for (var j = 0; j < staves[i].voices.length; j++) {
				for (var k = 0; k < staves[i].voices[j].length; k++) {
					var el = staves[i].voices[j][k];
					if (el.lyric) {
						// We just want to see if there are vocals below the music to know where to put the dynamics.
						if (!el.positioning || el.positioning.vocalPosition === 'below')
							this.hasVocals = true;
						return;
					}
				}
			}
		}
	};

ABCJS.write.AbstractEngraver.prototype.createABCLine = function(staffs, tempo) {
    this.minY = 2; // PER: This is the lowest that any note reaches. It will be used to set the dynamics row.
	// See if there are any lyrics on this line.
	this.containsLyrics(staffs);
  this.staffgroup = new ABCJS.write.StaffGroupElement();
	this.tempoSet = false;
  for (this.s = 0; this.s < staffs.length; this.s++) {
    this.createABCStaff(staffs[this.s], tempo);
  }

  return this.staffgroup;
};

ABCJS.write.AbstractEngraver.prototype.createABCStaff = function(abcstaff, tempo) {
// If the tempo is passed in, then the first element should get the tempo attached to it.
  for (this.v = 0; this.v < abcstaff.voices.length; this.v++) {
    this.voice = new ABCJS.write.VoiceElement(this.v,abcstaff.voices.length);
    if (this.v===0) {
      this.voice.barfrom = (abcstaff.connectBarLines==="start" || abcstaff.connectBarLines==="continue");
      this.voice.barto = (abcstaff.connectBarLines==="continue" || abcstaff.connectBarLines==="end");
    } else {
      this.voice.duplicate = true; // bar lines and other duplicate info need not be created
    }
    if (abcstaff.title && abcstaff.title[this.v]) this.voice.header=abcstaff.title[this.v];
	  var clef = ABCJS.write.createClef(abcstaff.clef);
	  if (clef)
    this.voice.addChild(clef);
	  var keySig = ABCJS.write.createKeySignature(abcstaff.key);
	  if (keySig) {
		  this.voice.addChild(keySig);
		  this.startlimitelem = keySig; // limit ties here
	  }
    if (abcstaff.meter) {
		var ts = ABCJS.write.createTimeSignature(abcstaff.meter);
		this.voice.addChild(ts);
		this.startlimitelem = ts; // limit ties here
	}
	  if (this.voice.duplicate)
	  	this.voice.children = []; // we shouldn't reprint the above if we're reusing the same staff. We just created them to get the right spacing.
    var staffLines = abcstaff.clef.stafflines || abcstaff.clef.stafflines === 0 ? abcstaff.clef.stafflines : 5;
    this.staffgroup.addVoice(this.voice,this.s,staffLines);
	  this.createABCVoice(abcstaff.voices[this.v],tempo);
	  this.staffgroup.setStaffLimits(this.voice);
  }
};

ABCJS.write.AbstractEngraver.prototype.createABCVoice = function(abcline, tempo) {
  this.popCrossLineElems();
  this.stemdir = (this.isBagpipes)?"down":null;
  this.abcline = abcline;
  if (this.partstartelem) {
    this.partstartelem = new ABCJS.write.EndingElem("", null, null);
    this.voice.addOther(this.partstartelem);
  }
  for (var slur in this.slurs) {
    if (this.slurs.hasOwnProperty(slur)) {
      this.slurs[slur]= new ABCJS.write.TieElem(null, null, this.slurs[slur].above, this.slurs[slur].force, false);
        this.voice.addOther(this.slurs[slur]);
    }
  }
  for (var i=0; i<this.ties.length; i++) {
    this.ties[i]=new ABCJS.write.TieElem(null, null, this.ties[i].above, this.ties[i].force, true);
    this.voice.addOther(this.ties[i]);
  }

  for (this.pos=0; this.pos<this.abcline.length; this.pos++) {
    var abselems = this.createABCElement();
	  if (abselems) {
    for (i=0; i<abselems.length; i++) {
      if (!this.tempoSet && tempo && !tempo.suppress) {
        this.tempoSet = true;
        abselems[i].addChild(new ABCJS.write.TempoElement(tempo));
      }
      this.voice.addChild(abselems[i]);
    }
    }
  }
  this.pushCrossLineElems();
};


// return an array of ABCJS.write.AbsoluteElement
ABCJS.write.AbstractEngraver.prototype.createABCElement = function() {
  var elemset = [];
  var elem = this.getElem();
  switch (elem.el_type) {
  case "note":
    elemset = this.createBeam();
    break;
  case "bar":
    elemset[0] = this.createBarLine(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "meter":
    elemset[0] = ABCJS.write.createTimeSignature(elem);
	  this.startlimitelem = elemset[0]; // limit ties here
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "clef":
    elemset[0] = ABCJS.write.createClef(elem);
	  if (!elemset[0]) return null;
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "key":
	  var absKey = ABCJS.write.createKeySignature(elem);
	  if (absKey) {
		  elemset[0] = absKey;
		  this.startlimitelem = elemset[0]; // limit ties here
	  }
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "stem":
    this.stemdir=elem.direction;
    break;
  case "part":
    var abselem = new ABCJS.write.AbsoluteElement(elem,0,0, 'part');
	  var dim = this.renderer.getTextSize(elem.title, 'partsfont', "part");
    abselem.addChild(new ABCJS.write.RelativeElement(elem.title, 0, 0, undefined, {type:"part", height: dim.height/ABCJS.write.spacing.STEP}));
    elemset[0] = abselem;
    break;
  case "tempo":
    var abselem3 = new ABCJS.write.AbsoluteElement(elem,0,0, 'tempo');
    abselem3.addChild(new ABCJS.write.TempoElement(elem));
    elemset[0] = abselem3;
    break;
	  case "style":
		  if (elem.head === "normal")
			  delete this.style;
		  else
			  this.style = elem.head;
		  break;
  default:
    var abselem2 = new ABCJS.write.AbsoluteElement(elem,0,0, 'unsupported');
    abselem2.addChild(new ABCJS.write.RelativeElement("element type "+elem.el_type, 0, 0, undefined, {type:"debug"}));
    elemset[0] = abselem2;
  }

  return elemset;
};

ABCJS.write.AbstractEngraver.prototype.calcBeamDir = function() {
	if (this.stemdir) // If the user or voice is forcing the stem direction, we already know the answer.
		return this.stemdir;
	var beamelem = new ABCJS.write.BeamElem(this.stemHeight, this.stemdir);
	// PER: need two passes: the first one decides if the stems are up or down.
	var oldPos = this.pos;
	var abselem;
	while (this.getElem()) {
		abselem = this.createNote(this.getElem(), true, true);
		beamelem.add(abselem);
		if (this.getElem().endBeam)
			break;
		this.pos++;
	}
	var dir = beamelem.calcDir();
	this.pos = oldPos;
	return dir ? "up" : "down";
};

ABCJS.write.AbstractEngraver.prototype.createBeam = function() {
  var abselemset = [];
  
  if (this.getElem().startBeam && !this.getElem().endBeam) {
	  var dir = this.calcBeamDir();
         var beamelem = new ABCJS.write.BeamElem(this.stemHeight, dir);
         var oldDir = this.stemdir;
         this.stemdir = dir;
    while (this.getElem()) {
      var abselem = this.createNote(this.getElem(),true);
      abselemset.push(abselem);
                beamelem.add(abselem);
      if (this.getElem().endBeam) {
                break;
      }
      this.pos++;
    }
         this.stemdir = oldDir;
    this.voice.addOther(beamelem);
  } else {
    abselemset[0] = this.createNote(this.getElem());
  }
  return abselemset;
};

ABCJS.write.sortPitch = function(elem) {
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
};

ABCJS.write.AbstractEngraver.prototype.createNote = function(elem, nostem, dontDraw) { //stem presence: true for drawing stemless notehead
  var notehead = null;
  var grace= null;
  this.roomtaken = 0; // room needed to the left of the note
  this.roomtakenright = 0; // room needed to the right of the note
  var dotshiftx = 0; // room taken by chords with displaced noteheads which cause dots to shift
  var c="";
  var flag = null;
  var additionalLedgers = []; // PER: handle the case of [bc'], where the b doesn't have a ledger line

  var p, i, pp;
  var width, p1, p2, dx;

  var duration = ABCJS.write.getDuration(elem);
	var zeroDuration = false;
  if (duration === 0) { zeroDuration = true; duration = 0.25; nostem = true; }        //PER: zero duration will draw a quarter note head.
  var durlog = Math.floor(Math.log(duration)/Math.log(2)); //TODO use getDurlog
  var dot=0;

  for (var tot = Math.pow(2,durlog), inc=tot/2; tot<duration; dot++,tot+=inc,inc/=2);
  
  
  if (elem.startTriplet) {
         if (elem.startTriplet === 2)
         this.tripletmultiplier = 3/2;
         else
         this.tripletmultiplier=(elem.startTriplet-1)/elem.startTriplet;
  }
  

  var abselem = new ABCJS.write.AbsoluteElement(elem, duration * this.tripletmultiplier, 1, 'note');
  

  if (elem.rest) {
    var restpitch = 7;
    if (this.stemdir==="down") restpitch = 3;
    if (this.stemdir==="up") restpitch = 11;
	  // There is special placement for the percussion staff. If there is one staff line, then move the rest position.
	  var numLines = this.staffgroup.staffs[this.staffgroup.staffs.length-1].lines;
	  if (numLines === 1) {
		  // The half and whole rests are attached to different lines normally, so we need to tweak their position to get them to both be attached to the same one.
		  if (duration < 0.5)
			  restpitch = 7;
		  else if (duration < 1)
			restpitch = 6.8;	// half rest
		  else
		  	restpitch = 4.8; // whole rest
	  }
    switch(elem.rest.type) {
		case "whole":
			c = this.chartable.rest[0];
			elem.averagepitch=restpitch;
			elem.minpitch=restpitch;
			elem.maxpitch=restpitch;
			dot = 0;
			break;
    case "rest":
      c = this.chartable.rest[-durlog];
      elem.averagepitch=restpitch;
      elem.minpitch=restpitch;
      elem.maxpitch=restpitch;
      break;
    case "invisible":
    case "spacer":
      c="";
		elem.averagepitch=restpitch;
		elem.minpitch=restpitch;
		elem.maxpitch=restpitch;
    }
         if (!dontDraw)
    notehead = this.createNoteHead(abselem, c, {verticalPos:restpitch}, null, 0, -this.roomtaken, null, dot, 0, 1);
    if (notehead) abselem.addHead(notehead);
    this.roomtaken+=this.accidentalshiftx;
    this.roomtakenright = Math.max(this.roomtakenright,this.dotshiftx);

  } else {
         ABCJS.write.sortPitch(elem);
    
    // determine averagepitch, minpitch, maxpitch and stem direction
    var sum=0;
    for (p=0, pp=elem.pitches.length; p<pp; p++) {
      sum += elem.pitches[p].verticalPos;
    }
    elem.averagepitch = sum/elem.pitches.length;
    elem.minpitch = elem.pitches[0].verticalPos;
      this.minY = Math.min(elem.minpitch, this.minY);
    elem.maxpitch = elem.pitches[elem.pitches.length-1].verticalPos;
    var dir = (elem.averagepitch>=6) ? "down": "up";
    if (this.stemdir) dir=this.stemdir;

	  var style = elem.style ? elem.style : this.style; // get the style of note head.
	  if (!style || style === "normal") style = "note";
	  var noteSymbol;
	  if (zeroDuration)
		  noteSymbol = this.chartable[style].nostem;
		else
		  noteSymbol = this.chartable[style][-durlog];
	  if (!noteSymbol)
	  	console.log("noteSymbol:", style, durlog, zeroDuration);

    // determine elements of chords which should be shifted
    for (p=(dir==="down")?elem.pitches.length-2:1; (dir==="down")?p>=0:p<elem.pitches.length; p=(dir==="down")?p-1:p+1) {
      var prev = elem.pitches[(dir==="down")?p+1:p-1];
      var curr = elem.pitches[p];
      var delta = (dir==="down")?prev.pitch-curr.pitch:curr.pitch-prev.pitch;
      if (delta<=1 && !prev.printer_shift) {
        curr.printer_shift=(delta)?"different":"same";
        if (curr.verticalPos > 11 || curr.verticalPos < 1) {        // PER: add extra ledger line
          additionalLedgers.push(curr.verticalPos - (curr.verticalPos%2));
        }
        if (dir==="down") {
         this.roomtaken = ABCJS.write.glyphs.getSymbolWidth(noteSymbol)+2;
        } else {
         dotshiftx = ABCJS.write.glyphs.getSymbolWidth(noteSymbol)+2;
        }
      }
    }
    
           // The accidentalSlot will hold a list of all the accidentals on this chord. Each element is a vertical place,
           // and contains a pitch, which is the last pitch that contains an accidental in that slot. The slots are numbered
         // from closest to the note to farther left. We only need to know the last accidental we placed because
         // we know that the pitches are sorted by now.
    this.accidentalSlot = [];

    for (p=0; p<elem.pitches.length; p++) {

      if (!nostem) {
        if ((dir==="down" && p!==0) || (dir==="up" && p!==pp-1)) { // not the stemmed elem of the chord
         flag = null;
        } else {
         flag = this.chartable[(dir==="down")?"dflags":"uflags"][-durlog];
        }
      }
		c = noteSymbol;
                // The highest position for the sake of placing slurs is itself if the slur is internal. It is the highest position possible if the slur is for the whole chord.
                // If the note is the only one in the chord, then any slur it has counts as if it were on the whole chord.
                elem.pitches[p].highestVert = elem.pitches[p].verticalPos;
                var isTopWhenStemIsDown = (this.stemdir==="up" || dir==="up") && p===0;
                var isBottomWhenStemIsUp = (this.stemdir==="down" || dir==="down") && p===pp-1;
      if (!dontDraw && (isTopWhenStemIsDown || isBottomWhenStemIsUp)) { // place to put slurs if not already on pitches

                 if (elem.startSlur || pp === 1) {
                 elem.pitches[p].highestVert = elem.pitches[pp-1].verticalPos;
                 if (this.stemdir==="up" || dir==="up")
                                        elem.pitches[p].highestVert += 6;        // If the stem is up, then compensate for the length of the stem
                 }
                         if (elem.startSlur) {
          if (!elem.pitches[p].startSlur) elem.pitches[p].startSlur = []; //TODO possibly redundant, provided array is not optional
         for (i=0; i<elem.startSlur.length; i++) {
         elem.pitches[p].startSlur.push(elem.startSlur[i]);
         }
        }

        if (!dontDraw && elem.endSlur) {
                        elem.pitches[p].highestVert = elem.pitches[pp-1].verticalPos;
                        if (this.stemdir==="up" || dir==="up")
                                elem.pitches[p].highestVert += 6;        // If the stem is up, then compensate for the length of the stem
          if (!elem.pitches[p].endSlur) elem.pitches[p].endSlur = []; //TODO possibly redundant, provided array is not optional
         for (i=0; i<elem.endSlur.length; i++) {
         elem.pitches[p].endSlur.push(elem.endSlur[i]);
         }
        }
      }

		var hasStem = !nostem && durlog<=-1;
                if (!dontDraw)
      notehead = this.createNoteHead(abselem, c, elem.pitches[p], hasStem ? dir : null, 0, -this.roomtaken, flag, dot, dotshiftx, 1);
      if (notehead) abselem.addHead(notehead);
      this.roomtaken += this.accidentalshiftx;
      this.roomtakenright = Math.max(this.roomtakenright,this.dotshiftx);
    }
      
    // draw stem from the furthest note to a pitch above/below the stemmed note
    if (hasStem) {
      p1 = (dir==="down") ? elem.minpitch-7 : elem.minpitch+1/3;
                // PER added stemdir test to make the line meet the note.
      if (p1>6 && !this.stemdir) p1=6;
      p2 = (dir==="down") ? elem.maxpitch-1/3 : elem.maxpitch+7;
                // PER added stemdir test to make the line meet the note.
      if (p2<6 && !this.stemdir) p2=6;
      dx = (dir==="down" || abselem.heads.length === 0)?0:abselem.heads[0].w;
      width = (dir==="down")?1:-1;
		// TODO-PER-HACK: One type of note head has a different placement of the stem. This should be more generically calculated:
		if (notehead.c === 'noteheads.slash.quarter') {
			if (dir === 'down')
				p2 -= 1;
			else
				p1 += 1;
		}
      abselem.addExtra(new ABCJS.write.RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2":p2, linewidth: width}));
        this.minY = Math.min(p1, this.minY);
        this.minY = Math.min(p2, this.minY);
    }
    
  }
  
  if (elem.lyric !== undefined) {
    var lyricStr = "";
         window.ABCJS.parse.each(elem.lyric, function(ly) {
         lyricStr += ly.syllable + ly.divider + "\n";
      });
	  var lyricDim = this.renderer.getTextSize(lyricStr, 'vocalfont', "abc-lyric");
	  var position = elem.positioning ? elem.positioning.vocalPosition : 'below';
    abselem.addCentered(new ABCJS.write.RelativeElement(lyricStr, 0, lyricDim.width, undefined, {type:"lyric", position: position, height: lyricDim.height / ABCJS.write.spacing.STEP }));
  }
  
  if (!dontDraw && elem.gracenotes !== undefined) {
    var gracescale = 3/5;
    var graceScaleStem = 3.5/5; // TODO-PER: empirically found constant.
    var gracebeam = null;
    if (elem.gracenotes.length>1) {
      gracebeam = new ABCJS.write.BeamElem(this.stemHeight*graceScaleStem, "grace",this.isBagpipes);
		gracebeam.mainNote = abselem;	// this gives us a reference back to the note this is attached to so that the stems can be attached somewhere.
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

      flag = (gracebeam) ? null : this.chartable.uflags[(this.isBagpipes)?5:3];
      grace = this.createNoteHead(abselem, "noteheads.quarter", elem.gracenotes[i], "up", -graceoffsets[i], -graceoffsets[i], flag, 0, 0, gracescale);
      abselem.addExtra(grace);
                // PER: added acciaccatura slash
                if (elem.gracenotes[i].acciaccatura) {
                        var pos = elem.gracenotes[i].verticalPos+7*gracescale;        // the same formula that determines the flag position.
                        var dAcciaccatura = gracebeam ? 5 : 6;        // just an offset to make it line up correctly.
                        abselem.addRight(new ABCJS.write.RelativeElement("flags.ugrace", -graceoffsets[i]+dAcciaccatura, 0, pos, {scalex:gracescale, scaley: gracescale}));
                }
      if (gracebeam) { // give the beam the necessary info
          var graceDuration = elem.gracenotes[i].duration / 2;
          if (this.isBagpipes) graceDuration /= 2;
        var pseudoabselem = {heads:[grace],
                         abcelem:{averagepitch: gracepitch, minpitch: gracepitch, maxpitch: gracepitch, duration: graceDuration }};
        gracebeam.add(pseudoabselem);
      } else { // draw the stem
        p1 = gracepitch+1/3*gracescale;
        p2 = gracepitch+7*gracescale;
        dx = grace.dx + grace.w;
        width = -0.6;
        abselem.addExtra(new ABCJS.write.RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2":p2, linewidth: width}));
      }
      
      if (i===0 && !this.isBagpipes && !(elem.rest && (elem.rest.type==="spacer"||elem.rest.type==="invisible"))) this.voice.addOther(new ABCJS.write.TieElem(grace, notehead, false, true, false));
    }

    if (gracebeam) {
      this.voice.addOther(gracebeam);
    }
  }

  if (!dontDraw && elem.decoration) {
	  this.decoration.createDecoration(this.voice, elem.decoration, abselem.top, (notehead)?notehead.w:0, abselem, this.roomtaken, dir, abselem.bottom, elem.positioning, this.hasVocals);
  }
  
  if (elem.barNumber) {
    abselem.addChild(new ABCJS.write.RelativeElement(elem.barNumber, -10, 0, 0, {type:"barNumber"}));
  }
  
  // ledger lines
  for (i=elem.maxpitch; i>11; i--) {
    if (i%2===0 && !elem.rest) {
      abselem.addChild(new ABCJS.write.RelativeElement(null, -2, ABCJS.write.glyphs.getSymbolWidth(c)+4, i, {type:"ledger"}));
    }
  }
  
  for (i=elem.minpitch; i<1; i++) {
    if (i%2===0 && !elem.rest) {
      abselem.addChild(new ABCJS.write.RelativeElement(null, -2, ABCJS.write.glyphs.getSymbolWidth(c)+4, i, {type:"ledger"}));
    }
  }

  for (i = 0; i < additionalLedgers.length; i++) { // PER: draw additional ledgers
    var ofs = ABCJS.write.glyphs.getSymbolWidth(c);
    if (dir === 'down') ofs = -ofs;
    abselem.addChild(new ABCJS.write.RelativeElement(null, ofs-2, ABCJS.write.glyphs.getSymbolWidth(c)+4, additionalLedgers[i], {type:"ledger"}));
  }
	var chordMargin = 8; // If there are chords next to each other, this is how close they can get.
  if (elem.chord !== undefined) {
    for (i = 0; i < elem.chord.length; i++) {
      var x = 0;
      var y;
		var dim = this.renderer.getTextSize(elem.chord[i].name, 'annotationfont', "annotation");
		var chordWidth = dim.width;
		var chordHeight = dim.height / ABCJS.write.spacing.STEP;
      switch (elem.chord[i].position) {
      case "left":
        this.roomtaken+=chordWidth+7;
        x = -this.roomtaken;        // TODO-PER: This is just a guess from trial and error
        y = elem.averagepitch;
        abselem.addExtra(new ABCJS.write.RelativeElement(elem.chord[i].name, x, chordWidth+4, y, {type:"text", height: chordHeight}));
        break;
      case "right":
        this.roomtakenright+=4;
        x = this.roomtakenright;// TODO-PER: This is just a guess from trial and error
        y = elem.averagepitch;
        abselem.addRight(new ABCJS.write.RelativeElement(elem.chord[i].name, x, chordWidth+4, y, {type:"text", height: chordHeight}));
        break;
      case "below":
		  // setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
                         var eachLine = elem.chord[i].name.split("\n");
                         for (var ii = 0; ii < eachLine.length; ii++) {
                                abselem.addRight(new ABCJS.write.RelativeElement(eachLine[ii], x, chordWidth+chordMargin, undefined, {type:"text", position: "below", height: chordHeight}));
                         }
    break;
		case "above":
			// setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
			abselem.addRight(new ABCJS.write.RelativeElement(elem.chord[i].name, 0, chordWidth+chordMargin, undefined, {type: "text", height: chordHeight}));
			break;
      default:
		if (elem.chord[i].rel_position) {
			var relPositionY = elem.chord[i].rel_position.y + 3*ABCJS.write.spacing.STEP; // TODO-PER: this is a fudge factor to make it line up with abcm2ps
			abselem.addChild(new ABCJS.write.RelativeElement(elem.chord[i].name, x + elem.chord[i].rel_position.x, 0, elem.minpitch + relPositionY / ABCJS.write.spacing.STEP, {type: "text", height: chordHeight}));
		} else {
			// setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
			var pos2 = 'above';
			if (elem.positioning && elem.positioning.chordPosition)
				pos2 = elem.positioning.chordPosition;

			dim = this.renderer.getTextSize(elem.chord[i].name, 'gchordfont', "chord");
			chordHeight = dim.height / ABCJS.write.spacing.STEP;
			chordWidth = dim.width; // Since the chord is centered, we only use half the width.
			abselem.addCentered(new ABCJS.write.RelativeElement(elem.chord[i].name, x, chordWidth, undefined, {type: "chord", position: pos2, height: chordHeight }));
		}
      }
    }
  }
    

  if (elem.startTriplet) {
    this.triplet = new ABCJS.write.TripletElem(elem.startTriplet, notehead, null, true); // above is opposite from case of slurs
         if (!dontDraw)
    this.voice.addOther(this.triplet);
  }

  if (elem.endTriplet && this.triplet) {
    this.triplet.setCloseAnchor(notehead);
    this.triplet = null;
    this.tripletmultiplier = 1;
  }

  return abselem;
};




ABCJS.write.AbstractEngraver.prototype.createNoteHead = function(abselem, c, pitchelem, dir, headx, extrax, flag, dot, dotshiftx, scale) {

  // TODO scale the dot as well
  var pitch = pitchelem.verticalPos;
  var notehead;
  var i;
  this.accidentalshiftx = 0;
  this.dotshiftx = 0;
  if (c === undefined)
    abselem.addChild(new ABCJS.write.RelativeElement("pitch is undefined", 0, 0, 0, {type:"debug"}));
  else if (c==="") {
    notehead = new ABCJS.write.RelativeElement(null, 0, 0, pitch);
  } else {
    var shiftheadx = headx;
    if (pitchelem.printer_shift) {
      var adjust = (pitchelem.printer_shift==="same")?1:0;
      shiftheadx = (dir==="down")?-ABCJS.write.glyphs.getSymbolWidth(c)*scale+adjust:ABCJS.write.glyphs.getSymbolWidth(c)*scale-adjust;
    }
	  var opts = {scalex:scale, scaley: scale, thickness: ABCJS.write.glyphs.symbolHeightInPitches(c)*scale };
	  //if (dir)
	  //	opts.stemHeight = ((dir==="down")?-this.stemHeight:this.stemHeight);
    notehead = new ABCJS.write.RelativeElement(c, shiftheadx, ABCJS.write.glyphs.getSymbolWidth(c)*scale, pitch, opts);
    if (flag) {
      var pos = pitch+((dir==="down")?-7:7)*scale;
      if (scale===1 && (dir==="down")?(pos>6):(pos<6)) pos=6;
      var xdelta = (dir==="down")?headx:headx+notehead.w-0.6;
      abselem.addRight(new ABCJS.write.RelativeElement(flag, xdelta, ABCJS.write.glyphs.getSymbolWidth(flag)*scale, pos, {scalex:scale, scaley: scale}));
    }
    this.dotshiftx = notehead.w+dotshiftx-2+5*dot;
    for (;dot>0;dot--) {
      var dotadjusty = (1-Math.abs(pitch)%2); //PER: take abs value of the pitch. And the shift still happens on ledger lines.
      abselem.addRight(new ABCJS.write.RelativeElement("dots.dot", notehead.w+dotshiftx-2+5*dot, ABCJS.write.glyphs.getSymbolWidth("dots.dot"), pitch+dotadjusty));
    }
  }
        if (notehead)
                notehead.highestVert = pitchelem.highestVert;
  
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
         // if a note is at least a sixth away, it can share a slot with another accidental
         var accSlotFound = false;
         var accPlace = extrax;
         for (var j = 0; j < this.accidentalSlot.length; j++) {
                 if (pitch - this.accidentalSlot[j][0] >= 6) {
                         this.accidentalSlot[j][0] = pitch;
                         accPlace = this.accidentalSlot[j][1];
                         accSlotFound = true;
                         break;
                 }
         }
         if (accSlotFound === false) {
                 accPlace -= (ABCJS.write.glyphs.getSymbolWidth(symb)*scale+2);
                 this.accidentalSlot.push([pitch,accPlace]);
                 this.accidentalshiftx = (ABCJS.write.glyphs.getSymbolWidth(symb)*scale+2);
         }
    abselem.addExtra(new ABCJS.write.RelativeElement(symb, accPlace, ABCJS.write.glyphs.getSymbolWidth(symb), pitch, {scalex:scale, scaley: scale}));
  }
  
  if (pitchelem.endTie) {
    if (this.ties[0]) {
      this.ties[0].setEndAnchor(notehead);
      this.ties = this.ties.slice(1,this.ties.length);
    }
  }
  
  if (pitchelem.startTie) {
    //PER: bug fix: var tie = new ABCJS.write.TieElem(notehead, null, (this.stemdir=="up" || dir=="down") && this.stemdir!="down",(this.stemdir=="down" || this.stemdir=="up"));
    var tie = new ABCJS.write.TieElem(notehead, null, (this.stemdir==="down" || dir==="down") && this.stemdir!=="up",(this.stemdir==="down" || this.stemdir==="up"), true);
    this.ties[this.ties.length]=tie;
    this.voice.addOther(tie);
	  // HACK-PER: For the animation, we need to know if a note is tied to the next one, so here's a flag.
	  // Unfortunately, only some of the notes in the current event might be tied, but this will consider it
	  // tied if any one of them is. That will work for most cases.
	  abselem.startTie = true;
  }

  if (pitchelem.endSlur) {
    for (i=0; i<pitchelem.endSlur.length; i++) {
      var slurid = pitchelem.endSlur[i];
      var slur;
      if (this.slurs[slurid]) {
        slur = this.slurs[slurid];
		  slur.setEndAnchor(notehead);
        delete this.slurs[slurid];
      } else {
        slur = new ABCJS.write.TieElem(null, notehead, dir==="down",(this.stemdir==="up" || dir==="down") && this.stemdir!=="down", false);
        this.voice.addOther(slur);
      }
      if (this.startlimitelem) {
        slur.setStartX(this.startlimitelem);
      }
    }
  }
  
  if (pitchelem.startSlur) {
    for (i=0; i<pitchelem.startSlur.length; i++) {
      var slurid = pitchelem.startSlur[i].label;
      //PER: bug fix: var slur = new ABCJS.write.TieElem(notehead, null, (this.stemdir=="up" || dir=="down") && this.stemdir!="down", this.stemdir);
      var slur = new ABCJS.write.TieElem(notehead, null, (this.stemdir==="down" || dir==="down") && this.stemdir!=="up", false, false);
      this.slurs[slurid]=slur;
      this.voice.addOther(slur);
    }
  }
  
  return notehead;

};

ABCJS.write.AbstractEngraver.prototype.createBarLine = function (elem) {
// bar_thin, bar_thin_thick, bar_thin_thin, bar_thick_thin, bar_right_repeat, bar_left_repeat, bar_double_repeat

  var abselem = new ABCJS.write.AbsoluteElement(elem, 0, 10, 'bar');
  var anchor = null; // place to attach part lines
  var dx = 0;



  var firstdots = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat");
  var firstthin = (elem.type!=="bar_left_repeat" && elem.type!=="bar_thick_thin" && elem.type!=="bar_invisible");
  var thick = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat" || elem.type==="bar_left_repeat" ||
         elem.type==="bar_thin_thick" || elem.type==="bar_thick_thin");
  var secondthin = (elem.type==="bar_left_repeat" || elem.type==="bar_thick_thin" || elem.type==="bar_thin_thin" || elem.type==="bar_dbl_repeat");
  var seconddots = (elem.type==="bar_left_repeat" || elem.type==="bar_dbl_repeat");

  // limit positioning of slurs
  if (firstdots || seconddots) {
    for (var slur in this.slurs) {
      if (this.slurs.hasOwnProperty(slur)) {
        this.slurs[slur].setEndX(abselem);
      }
    }
    this.startlimitelem = abselem;
  }

  if (firstdots) {
    abselem.addRight(new ABCJS.write.RelativeElement("dots.dot", dx, 1, 7));
    abselem.addRight(new ABCJS.write.RelativeElement("dots.dot", dx, 1, 5));
    dx+=6; //2 hardcoded, twice;
  }

  if (firstthin) {
    anchor = new ABCJS.write.RelativeElement(null, dx, 1, 2, {"type": "bar", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor);
  }

  if (elem.type==="bar_invisible") {
    anchor = new ABCJS.write.RelativeElement(null, dx, 1, 2, {"type": "none", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor);
  }

  if (elem.decoration) {
    this.decoration.createDecoration(this.voice, elem.decoration, 12, (thick)?3:1, abselem, 0, "down", 2, elem.positioning, this.hasVocals);
  }

  if (thick) {
    dx+=4; //3 hardcoded;
    anchor = new ABCJS.write.RelativeElement(null, dx, 4, 2, {"type": "bar", "pitch2":10, linewidth:4});
    abselem.addRight(anchor);
    dx+=5;
  }
  
// if (this.partstartelem && (thick || (firstthin && secondthin))) { // means end of nth part
// this.partstartelem.anchor2=anchor;
// this.partstartelem = null;
// }

  if (this.partstartelem && elem.endEnding) {
    this.partstartelem.anchor2=anchor;
    this.partstartelem = null;
  }

  if (secondthin) {
    dx+=3; //3 hardcoded;
    anchor = new ABCJS.write.RelativeElement(null, dx, 1, 2, {"type": "bar", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor); // 3 is hardcoded
  }

  if (seconddots) {
    dx+=3; //3 hardcoded;
    abselem.addRight(new ABCJS.write.RelativeElement("dots.dot", dx, 1, 7));
    abselem.addRight(new ABCJS.write.RelativeElement("dots.dot", dx, 1, 5));
  } // 2 is hardcoded

  if (elem.startEnding) {
	  var textWidth = this.renderer.getTextSize(elem.startEnding, "repeatfont", '').width;
	  abselem.minspacing += textWidth + 10; // Give plenty of room for the ending number.
    this.partstartelem = new ABCJS.write.EndingElem(elem.startEnding, anchor, null);
    this.voice.addOther(this.partstartelem);
  }

  return abselem;        

};


})();
