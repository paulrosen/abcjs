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

ABCJS.write.AbstractEngraver = function(glyphs, bagpipes) {
  this.glyphs = glyphs;
  this.isBagpipes = bagpipes;
  this.chartable = {rest:{0:"rests.whole", 1:"rests.half", 2:"rests.quarter", 3:"rests.8th", 4: "rests.16th",5: "rests.32nd", 6: "rests.64th", 7: "rests.128th"},
                 note:{"-1": "noteheads.dbl", 0:"noteheads.whole", 1:"noteheads.half", 2:"noteheads.quarter", 3:"noteheads.quarter", 4:"noteheads.quarter", 5:"noteheads.quarter", 6:"noteheads.quarter"},
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

ABCJS.write.AbstractEngraver.prototype.createABCLine = function(staffs) {
    this.minY = 2; // PER: This is the lowest that any note reaches. It will be used to set the dynamics row.
  this.staffgroup = new ABCJS.write.StaffGroupElement();
  for (this.s = 0; this.s < staffs.length; this.s++) {
    this.createABCStaff(staffs[this.s]);
  }
  return this.staffgroup;
};

//function adjustChordVerticalPosition(staffgroup) {
//	var yPlacement = 16; // no lower than high E
//	var chordList = [];
//	for (var i = 0; i < staffgroup.voices.length; i++) {
//		for (var j = 0; j < staffgroup.voices[i].children.length; j++) {
//			var absElem = staffgroup.voices[i].children[j];
//			if (absElem.top+5 > yPlacement)
//				yPlacement = absElem.top+5;
//			for (var k = 0; k < absElem.children.length; k++) {
//				var relElem = absElem.children[k];
//				if (relElem.type === 'chord')
//					chordList.push(relElem);
//			}
//		}
//	}
//	for (i = 0; i < chordList.length; i++) {
//		var elem = chordList[i];
//		if (elem.top < yPlacement) {
//			elem.top = yPlacement;
//			elem.pitch = yPlacement;
//			elem.bottom = yPlacement;
//			if (elem.parent.top < yPlacement)
//				elem.parent.top = yPlacement;
//		}
//	}
//}

function setUpperAndLowerElements(staffgroup) {
	// Each staff already has the top and bottom set, now we see if there are elements that are always on top and bottom, and resolve their pitch.
	// Also, get the overall height of the all the staves in this group.
	var heightInPitches = 0;
	for (var i = 0; i < staffgroup.staffs.length; i++) {
		var staff = staffgroup.staffs[i];
		// hasHighest1 is the top most position, hasHighest2 is the second topmost, so resolve them in that order. Likewise for hasLowest1, hasLowest2
		var highest1Pitch;
		var highest2Pitch;
		var lowest1Pitch;
		var lowest2Pitch;
		var ySpacing = 7;
		if (staff.hasHighest2) {
			highest2Pitch = staff.top + ySpacing;
			staff.top += ySpacing;
		}
		if (staff.hasHighest1) {
			highest1Pitch = staff.top + ySpacing;
			staff.top += ySpacing;
		}
		if (staff.hasLowest2) {
			lowest2Pitch = staff.bottom - ySpacing;
			staff.bottom -= ySpacing;
		}
		if (staff.hasLowest1) {
			lowest1Pitch = staff.bottom - ySpacing;
			staff.bottom -= ySpacing;
		}
		for (var j = 0; j < staff.voices.length; j++) {
			var voice = staffgroup.voices[staff.voices[j]];
			voice.setUpperAndLowerElements(lowest1Pitch, lowest2Pitch, highest1Pitch, highest2Pitch);
		}
		// Now we need a little margin on the top, so we'll just throw that in.
		staff.top += 4;
		heightInPitches += staff.top - staff.bottom;
	}
	// TODO-PER: also add the space between staves.
	staffgroup.height = heightInPitches * ABCJS.write.spacing.STEP;
}

ABCJS.write.AbstractEngraver.prototype.createABCStaff = function(abcstaff) {

  var header = "";
  if (abcstaff.bracket) header += "bracket "+abcstaff.bracket+" ";
  if (abcstaff.brace) header += "brace "+abcstaff.brace+" ";

  
  for (this.v = 0; this.v < abcstaff.voices.length; this.v++) {
    this.voice = new ABCJS.write.VoiceElement(this.v,abcstaff.voices.length);
    if (this.v===0) {
      this.voice.barfrom = (abcstaff.connectBarLines==="start" || abcstaff.connectBarLines==="continue");
      this.voice.barto = (abcstaff.connectBarLines==="continue" || abcstaff.connectBarLines==="end");
    } else {
      this.voice.duplicate = true; // bar lines and other duplicate info need not be created
    }
    if (abcstaff.title && abcstaff.title[this.v]) this.voice.header=abcstaff.title[this.v];
    // TODO make invisible if voice is duplicate
    this.voice.addChild(this.createClef(abcstaff.clef));
    this.voice.addChild(this.createKeySignature(abcstaff.key));
    if (abcstaff.meter) this.voice.addChild(this.createTimeSignature(abcstaff.meter));
    this.createABCVoice(abcstaff.voices[this.v]);
    var staffLines = abcstaff.clef.stafflines ? abcstaff.clef.stafflines : 5;
    this.staffgroup.addVoice(this.voice,this.s,staffLines);
  }
	setUpperAndLowerElements(this.staffgroup);
 
};

ABCJS.write.AbstractEngraver.prototype.createABCVoice = function(abcline) {
  this.popCrossLineElems();
  this.stemdir = (this.isBagpipes)?"down":null;
  this.abcline = abcline;
  if (this.partstartelem) {
    this.partstartelem = new ABCJS.write.EndingElem("", null, null);
    this.voice.addOther(this.partstartelem);
  }
  for (var slur in this.slurs) {
    if (this.slurs.hasOwnProperty(slur)) {
      this.slurs[slur]= new ABCJS.write.TieElem(null, null, this.slurs[slur].above, this.slurs[slur].force);
        this.voice.addOther(this.slurs[slur]);
    }
  }
  for (var i=0; i<this.ties.length; i++) {
    this.ties[i]=new ABCJS.write.TieElem(null, null, this.ties[i].above, this.ties[i].force);
    this.voice.addOther(this.ties[i]);
  }

  for (this.pos=0; this.pos<this.abcline.length; this.pos++) {
    var abselems = this.createABCElement();
    for (i=0; i<abselems.length; i++) {
      this.voice.addChild(abselems[i]);
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
    elemset[0] = this.createTimeSignature(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "clef":
    elemset[0] = this.createClef(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "key":
    elemset[0] = this.createKeySignature(elem);
    if (this.voice.duplicate) elemset[0].invisible = true;
    break;
  case "stem":
    this.stemdir=elem.direction;
    break;
  case "part":
    var abselem = new ABCJS.write.AbsoluteElement(elem,0,0, 'part');
    abselem.addChild(new ABCJS.write.RelativeElement(elem.title, 0, 0, undefined, {type:"part"}));
    elemset[0] = abselem;
    break;
//         case "tempo":
//                this.printer.y = this.printer.printTempo(elem, this.printer.paper, this.printer.layouter, this.printer.y, this.printer, this.printer.x);
//                break;
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
	var beamelem = new ABCJS.write.BeamElem(this.stemdir);
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
         var beamelem = new ABCJS.write.BeamElem(dir);
	  beamelem.setStemHeight(this.stemHeight);
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
  if (duration === 0) { duration = 0.25; nostem = true; }        //PER: zero duration will draw a quarter note head.
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
         this.roomtaken = this.glyphs.getSymbolWidth(this.chartable.note[-durlog])+2;
        } else {
         dotshiftx = this.glyphs.getSymbolWidth(this.chartable.note[-durlog])+2;
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
        c = this.chartable.note[-durlog];
      } else {
        c="noteheads.quarter";
      }

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

                if (!dontDraw)
      notehead = this.createNoteHead(abselem, c, elem.pitches[p], dir, 0, -this.roomtaken, flag, dot, dotshiftx, 1);
      if (notehead) abselem.addHead(notehead);
      this.roomtaken += this.accidentalshiftx;
      this.roomtakenright = Math.max(this.roomtakenright,this.dotshiftx);
    }
      
    // draw stem from the furthest note to a pitch above/below the stemmed note
    if (!nostem && durlog<=-1) {
      p1 = (dir==="down") ? elem.minpitch-7 : elem.minpitch+1/3;
                // PER added stemdir test to make the line meet the note.
      if (p1>6 && !this.stemdir) p1=6;
      p2 = (dir==="down") ? elem.maxpitch-1/3 : elem.maxpitch+7;
                // PER added stemdir test to make the line meet the note.
      if (p2<6 && !this.stemdir) p2=6;
      dx = (dir==="down" || abselem.heads.length === 0)?0:abselem.heads[0].w;
      width = (dir==="down")?1:-1;
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
	  // TODO-PER: get the width of the lyric and use that for "0, lyricStr.length*5" below.
    abselem.addRight(new ABCJS.write.RelativeElement(lyricStr, 0, lyricStr.length*5, undefined, {type:"lyric"}));
  }
  
  if (!dontDraw && elem.gracenotes !== undefined) {
    var gracescale = 3/5;
    var gracebeam = null;
    if (elem.gracenotes.length>1) {
      gracebeam = new ABCJS.write.BeamElem("grace",this.isBagpipes);
		gracebeam.setStemHeight(this.stemHeight*gracescale);
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
      
      if (i===0 && !this.isBagpipes && !(elem.rest && (elem.rest.type==="spacer"||elem.rest.type==="invisible"))) this.voice.addOther(new ABCJS.write.TieElem(grace, notehead, false, true));
    }

    if (gracebeam) {
      this.voice.addOther(gracebeam);
    }
  }

  if (!dontDraw && elem.decoration) {
    this.createDecoration(elem.decoration, elem.maxpitch, (notehead)?notehead.w:0, abselem, this.roomtaken, dir, elem.minpitch);
  }
  
  if (elem.barNumber) {
    abselem.addChild(new ABCJS.write.RelativeElement(elem.barNumber, -10, 0, 0, {type:"barNumber"}));
  }
  
  // ledger lines
  for (i=elem.maxpitch; i>11; i--) {
    if (i%2===0 && !elem.rest) {
      abselem.addChild(new ABCJS.write.RelativeElement(null, -2, this.glyphs.getSymbolWidth(c)+4, i, {type:"ledger"}));
    }
  }
  
  for (i=elem.minpitch; i<1; i++) {
    if (i%2===0 && !elem.rest) {
      abselem.addChild(new ABCJS.write.RelativeElement(null, -2, this.glyphs.getSymbolWidth(c)+4, i, {type:"ledger"}));
    }
  }

  for (i = 0; i < additionalLedgers.length; i++) { // PER: draw additional ledgers
    var ofs = this.glyphs.getSymbolWidth(c);
    if (dir === 'down') ofs = -ofs;
    abselem.addChild(new ABCJS.write.RelativeElement(null, ofs-2, this.glyphs.getSymbolWidth(c)+4, additionalLedgers[i], {type:"ledger"}));
  }

  if (elem.chord !== undefined) {
    for (i = 0; i < elem.chord.length; i++) {
      var x = 0;
      var y;
      switch (elem.chord[i].position) {
      case "left":
        this.roomtaken+=7;
        x = -this.roomtaken;        // TODO-PER: This is just a guess from trial and error
        y = elem.averagepitch;
		  // TODO-PER: get the width of the lyric and use that for "0, lyricStr.length*5" below.
        abselem.addExtra(new ABCJS.write.RelativeElement(elem.chord[i].name, x, this.glyphs.getSymbolWidth(elem.chord[i].name[0])+4, y, {type:"text"}));
        break;
      case "right":
        this.roomtakenright+=4;
        x = this.roomtakenright;// TODO-PER: This is just a guess from trial and error
        y = elem.averagepitch;
		  // TODO-PER: get the width of the lyric and use that for "0, lyricStr.length*5" below.
        abselem.addRight(new ABCJS.write.RelativeElement(elem.chord[i].name, x, this.glyphs.getSymbolWidth(elem.chord[i].name[0])+4, y, {type:"text"}));
        break;
      case "below":
        y = elem.minpitch-4;
                         if (y > -3) y = -3;
                         var eachLine = elem.chord[i].name.split("\n");
                         for (var ii = 0; ii < eachLine.length; ii++) {
                                abselem.addChild(new ABCJS.write.RelativeElement(eachLine[ii], x, 0, y, {type:"text"}));
                                 y -= 3;        // TODO-PER: This should actually be based on the font height.
                         }
    break;
      default:
                         if (elem.chord[i].rel_position)
                                 abselem.addChild(new ABCJS.write.RelativeElement(elem.chord[i].name, x+elem.chord[i].rel_position.x, 0, elem.minpitch+elem.chord[i].rel_position.y/ABCJS.write.spacing.STEP, {type:"text"}));
			  else {
				  // setting the y-coordinate to zero for now: it will be overwritten later one, after we figure out what the highest element on the line is.
				  abselem.addChild(new ABCJS.write.RelativeElement(elem.chord[i].name, x, 0, undefined, {type: "chord"}));
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
    this.triplet.anchor2 = notehead;
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
      shiftheadx = (dir==="down")?-this.glyphs.getSymbolWidth(c)*scale+adjust:this.glyphs.getSymbolWidth(c)*scale-adjust;
    }
    notehead = new ABCJS.write.RelativeElement(c, shiftheadx, this.glyphs.getSymbolWidth(c)*scale, pitch, {scalex:scale, scaley: scale, stemHeight: ((dir==="down")?-this.stemHeight:this.stemHeight)});
    if (flag) {
      var pos = pitch+((dir==="down")?-7:7)*scale;
      if (scale===1 && (dir==="down")?(pos>6):(pos<6)) pos=6;
      var xdelta = (dir==="down")?headx:headx+notehead.w-0.6;
      abselem.addRight(new ABCJS.write.RelativeElement(flag, xdelta, this.glyphs.getSymbolWidth(flag)*scale, pos, {scalex:scale, scaley: scale}));
    }
    this.dotshiftx = notehead.w+dotshiftx-2+5*dot;
    for (;dot>0;dot--) {
      var dotadjusty = (1-Math.abs(pitch)%2); //PER: take abs value of the pitch. And the shift still happens on ledger lines.
      abselem.addRight(new ABCJS.write.RelativeElement("dots.dot", notehead.w+dotshiftx-2+5*dot, this.glyphs.getSymbolWidth("dots.dot"), pitch+dotadjusty));
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
                 accPlace -= (this.glyphs.getSymbolWidth(symb)*scale+2);
                 this.accidentalSlot.push([pitch,accPlace]);
                 this.accidentalshiftx = (this.glyphs.getSymbolWidth(symb)*scale+2);
         }
    abselem.addExtra(new ABCJS.write.RelativeElement(symb, accPlace, this.glyphs.getSymbolWidth(symb), pitch, {scalex:scale, scaley: scale}));
  }
  
  if (pitchelem.endTie) {
    if (this.ties[0]) {
      this.ties[0].anchor2=notehead;
      this.ties = this.ties.slice(1,this.ties.length);
    }
  }
  
  if (pitchelem.startTie) {
    //PER: bug fix: var tie = new ABCJS.write.TieElem(notehead, null, (this.stemdir=="up" || dir=="down") && this.stemdir!="down",(this.stemdir=="down" || this.stemdir=="up"));
    var tie = new ABCJS.write.TieElem(notehead, null, (this.stemdir==="down" || dir==="down") && this.stemdir!=="up",(this.stemdir==="down" || this.stemdir==="up"));
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
        slur = this.slurs[slurid].anchor2=notehead;
        delete this.slurs[slurid];
      } else {
        slur = new ABCJS.write.TieElem(null, notehead, dir==="down",(this.stemdir==="up" || dir==="down") && this.stemdir!=="down", this.stemdir);
        this.voice.addOther(slur);
      }
      if (this.startlimitelem) {
        slur.startlimitelem = this.startlimitelem;
      }
    }
  }
  
  if (pitchelem.startSlur) {
    for (i=0; i<pitchelem.startSlur.length; i++) {
      var slurid = pitchelem.startSlur[i].label;
      //PER: bug fix: var slur = new ABCJS.write.TieElem(notehead, null, (this.stemdir=="up" || dir=="down") && this.stemdir!="down", this.stemdir);
      var slur = new ABCJS.write.TieElem(notehead, null, (this.stemdir==="down" || dir==="down") && this.stemdir!=="up", false);
      this.slurs[slurid]=slur;
      this.voice.addOther(slur);
    }
  }
  
  return notehead;

};

ABCJS.write.AbstractEngraver.prototype.createDecoration = function(decoration, pitch, width, abselem, roomtaken, dir, minPitch) {
  var dec;
  var compoundDec;        // PER: for decorations with two symbols
  var diminuendo;
    var crescendo;
  var textDecs = [];
  var unknowndecs = [];
  var yslot = (pitch>9) ? pitch+3 : 12;
  var ypos;
        //var dir = (this.stemdir==="down" || pitch>=6) && this.stemdir!=="up";
        var below = false;        // PER: whether decoration goes above or below.
        var isText = false;        // PER: whether decoration is just rendered as regular text
        var yslotB = this.minY - 4; // (pitch<1) ? pitch-9 : -6;
  var i;
  roomtaken = roomtaken || 0;
  if (pitch===5) yslot=14; // avoid upstem of the A

  for (i=0;i<decoration.length; i++) { // treat staccato, accent, and tenuto first (may need to shift other markers)
    if (decoration[i]==="staccato" || decoration[i]==="tenuto" || decoration[i] === "accent") {
		var symbol = "scripts." + decoration[i];
		if (decoration[i] === "accent") symbol = "scripts.sforzato";
		if (ypos === undefined)
	      ypos = (dir==="down") ? pitch+2:minPitch-2;
		else
			ypos = (dir==="down") ? ypos+2:ypos-2;
		if (decoration[i] === "accent") {
			// Always place the accent three pitches away, no matter whether that is a line or space.
			if (dir === "up") ypos--;
			else ypos++;
		} else {
                // don't place on a stave line. The stave lines are 2,4,6,8,10
                switch (ypos) {
                        case 2:
                        case 4:
                        case 6:
                        case 8:
                        case 10:
                                        if (dir === "up") ypos--;
                                        else ypos++;
                                break;
                }
		}
      if (pitch>9) yslot++; // take up some room of those that are above
      var deltax = width/2;
      if (this.glyphs.getSymbolAlign(symbol)!=="center") {
        deltax -= (this.glyphs.getSymbolWidth(dec)/2);
      }
      abselem.addChild(new ABCJS.write.RelativeElement(symbol, deltax, this.glyphs.getSymbolWidth(symbol), ypos));
    }
    if (decoration[i]==="slide" && abselem.heads[0]) {
      var ypos2 = abselem.heads[0].pitch;
      var blank1 = new ABCJS.write.RelativeElement("", -roomtaken-15, 0, ypos2-1);
      var blank2 = new ABCJS.write.RelativeElement("", -roomtaken-5, 0, ypos2+1);
      abselem.addChild(blank1);
      abselem.addChild(blank2);
      this.voice.addOther(new ABCJS.write.TieElem(blank1, blank2, false));
    }
  }
	// If ypos is set at this point it means that there were "close" decorations. Those might be encroaching on where the rest of the decorations go, so they need to be bumped up.
	if (ypos+2 > yslot) yslot = ypos+2;

  for (i=0;i<decoration.length; i++) {
         below = false;
         isText = false;
    switch(decoration[i]) {
		case "0":
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "D.C.":
		case "D.S.":
			dec = decoration[i];
			isText = true;
			break;
		case "fine":
			dec = "FINE";
			isText = true;
			break;
		case "+":dec="scripts.stopped";break;
		case "open":dec="scripts.open";break;
		case "snap":dec="scripts.snap";break;
		case "wedge":dec="scripts.wedge";break;
		case "thumb":dec="scripts.thumb";break;
		case "shortphrase":dec="scripts.shortphrase";break;
		case "mediumphrase":dec="scripts.mediumphrase";break;
		case "longphrase":dec="scripts.longphrase";break;

    case "trill":dec="scripts.trill";break;
    case "roll": dec="scripts.roll"; break; //TODO put abc2ps roll in here
    case "irishroll": dec="scripts.roll"; break;
    case "marcato": dec="scripts.umarcato"; break;
    case "dmarcato": dec="scripts.dmarcato"; break;//other marcato
    case "turn": dec="scripts.turn"; break;
    case "uppermordent": dec="scripts.prall"; break;
    case "pralltriller": dec="scripts.prall"; break;
    case "mordent":
    case "lowermordent": dec="scripts.mordent"; break;
    case "staccato":
    case "accent":
    case "tenuto":
    case "slide": continue;
    case "downbow": dec="scripts.downbow";break;
    case "upbow": dec="scripts.upbow";break;
    case "fermata": dec="scripts.ufermata"; break;
    case "invertedfermata": below = true; dec="scripts.dfermata"; break;
    case "breath": dec=","; break;
//    case "accent": dec="scripts.sforzato"; break;
    case "umarcato": dec="scripts.umarcato"; break;
    case "coda": dec="scripts.coda"; break;
    case "segno": dec="scripts.segno"; break;
    case "/": compoundDec=["flags.ugrace", 1]; continue;        // PER: added new decorations
    case "//": compoundDec=["flags.ugrace", 2]; continue;
    case "///": compoundDec=["flags.ugrace", 3]; continue;
    case "////": compoundDec=["flags.ugrace", 4]; continue;
    case "p":
    case "mp":
    case "pp":
    case "ppp":
    case "pppp":
    case "f":
    case "ff":
    case "fff":
    case "ffff":
    case "sfz":
    case "mf":
        var ddelem = new ABCJS.write.DynamicDecoration(abselem, decoration[i]);
        this.voice.addOther(ddelem);
        continue;
                case "mark": abselem.klass = "mark"; continue;
        case "diminuendo(":
                        ABCJS.write.AbstractEngraver.prototype.startDiminuendoX = abselem;
            diminuendo = undefined;
            continue;
        case "diminuendo)":
            diminuendo = { start: ABCJS.write.AbstractEngraver.prototype.startDiminuendoX, stop: abselem};
                        ABCJS.write.AbstractEngraver.prototype.startDiminuendoX = undefined;
            continue;
        case "crescendo(":
                        ABCJS.write.AbstractEngraver.prototype.startCrescendoX = abselem;
            crescendo = undefined;
            continue;
        case "crescendo)":
            crescendo = { start: ABCJS.write.AbstractEngraver.prototype.startCrescendoX, stop: abselem};
                        ABCJS.write.AbstractEngraver.prototype.startCrescendoX = undefined;
            continue;
    default:
    unknowndecs[unknowndecs.length]=decoration[i];
    continue;
    }
         if (below) {
                 ypos = yslotB;
		  yslotB -= 5;
         } else {
                 ypos=yslot;
		  yslot+=5;
         }
    var deltax = width/2;
	  if (isText) {
		  abselem.addChild(new ABCJS.write.RelativeElement(dec, 0, 0, ypos+2, {type:"decoration"})); // TODO-PER: This is just approximate placement for this type of element.
	  } else {
		  if (this.glyphs.getSymbolAlign(dec) !== "center") {
			  deltax -= (this.glyphs.getSymbolWidth(dec) / 2);
		  }
		  abselem.addChild(new ABCJS.write.RelativeElement(dec, deltax, this.glyphs.getSymbolWidth(dec), ypos));
	  }
  }
  if (compoundDec) {        // PER: added new decorations
         ypos = (dir === 'down') ? pitch+1:pitch+9;
         deltax = width/2;
         deltax += (dir === 'down') ? -5 : 3;
         for (var xx = 0; xx < compoundDec[1]; xx++) {
                 ypos -= 1;
                 abselem.addChild(new ABCJS.write.RelativeElement(compoundDec[0], deltax, this.glyphs.getSymbolWidth(compoundDec[0]), ypos));
         }
  }
    if (diminuendo) {
        var delem = new ABCJS.write.CrescendoElem(diminuendo.start, diminuendo.stop, ">");
        this.voice.addOther(delem);
    }
    if (crescendo) {
        var celem = new ABCJS.write.CrescendoElem(crescendo.start, crescendo.stop, "<");
        this.voice.addOther(celem);
    }
  if (unknowndecs.length>0)
      abselem.addChild(new ABCJS.write.RelativeElement(unknowndecs.join(','), 0, 0, undefined, {type:"debug"}));
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
        this.slurs[slur].endlimitelem = abselem;
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
    this.createDecoration(elem.decoration, 12, (thick)?3:1, abselem, 0, "down", 2);
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
    this.partstartelem = new ABCJS.write.EndingElem(elem.startEnding, anchor, null);
    this.voice.addOther(this.partstartelem);
  }

  return abselem;        

};

ABCJS.write.AbstractEngraver.prototype.createClef = function(elem) {
  var clef = "clefs.G";
  var octave = 0;
  var abselem = new ABCJS.write.AbsoluteElement(elem,0,10, 'staff-extra');
  switch (elem.type) {
  case "treble": break;
  case "tenor": clef="clefs.C"; break;
  case "alto": clef="clefs.C"; break;
  case "bass": clef="clefs.F"; break;
  case 'treble+8': octave = 1; break;
  case 'tenor+8':clef="clefs.C"; octave = 1; break;
  case 'bass+8': clef="clefs.F"; octave = 1; break;
  case 'alto+8': clef="clefs.C"; octave = 1; break;
  case 'treble-8': octave = -1; break;
  case 'tenor-8':clef="clefs.C"; octave = -1; break;
  case 'bass-8': clef="clefs.F"; octave = -1; break;
  case 'alto-8': clef="clefs.C"; octave = -1; break;
  case 'none': clef=""; break;
  case 'perc': clef="clefs.perc"; break;
  default: abselem.addChild(new ABCJS.write.RelativeElement("clef="+elem.type, 0, 0, undefined, {type:"debug"}));
  }
// if (elem.verticalPos) {
// pitch = elem.verticalPos;
// }
  var dx =5;
  if (clef!=="") {
    abselem.addRight(new ABCJS.write.RelativeElement(clef, dx, this.glyphs.getSymbolWidth(clef), elem.clefPos));
  }
  if (octave!==0) {
    var scale= 2/3;
    var adjustspacing = (this.glyphs.getSymbolWidth(clef)-this.glyphs.getSymbolWidth("8")*scale)/2;
    abselem.addRight(new ABCJS.write.RelativeElement("8", dx+adjustspacing, this.glyphs.getSymbolWidth("8")*scale, (octave>0)?16:-2, {scalex:scale, scaley:scale}));
  }

  return abselem;
};


ABCJS.write.AbstractEngraver.prototype.createKeySignature = function(elem) {
  var abselem = new ABCJS.write.AbsoluteElement(elem,0,10, 'staff-extra');
  var dx = 0;
  if (elem.accidentals) {
         window.ABCJS.parse.each(elem.accidentals, function(acc) {
                var symbol = (acc.acc === "sharp") ? "accidentals.sharp" : (acc.acc === "natural") ? "accidentals.nat" : "accidentals.flat";
                //var notes = { 'A': 5, 'B': 6, 'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G':4, 'a': 12, 'b': 13, 'c': 7, 'd': 8, 'e': 9, 'f': 10, 'g':11 };
                abselem.addRight(new ABCJS.write.RelativeElement(symbol, dx, this.glyphs.getSymbolWidth(symbol), acc.verticalPos));
                dx += this.glyphs.getSymbolWidth(symbol)+2;
         }, this);
  }
  this.startlimitelem = abselem; // limit ties here
  return abselem;
};

ABCJS.write.AbstractEngraver.prototype.createTimeSignature= function(elem) {

  var abselem = new ABCJS.write.AbsoluteElement(elem,0,10, 'staff-extra');
  if (elem.type === "specified") {
    //TODO make the alignment for time signatures centered
    for (var i = 0; i < elem.value.length; i++) {
      if (i !== 0)
        abselem.addRight(new ABCJS.write.RelativeElement('+', i*20-9, this.glyphs.getSymbolWidth("+"), 7));
      if (elem.value[i].den) {
		  // TODO-PER: get real widths here, also center the num and den.
        abselem.addRight(new ABCJS.write.RelativeElement(elem.value[i].num, i*20, this.glyphs.getSymbolWidth(elem.value[i].num.charAt(0))*elem.value[i].num.length, 9));
        abselem.addRight(new ABCJS.write.RelativeElement(elem.value[i].den, i*20, this.glyphs.getSymbolWidth(elem.value[i].den.charAt(0))*elem.value[i].den.length, 5));
      } else {
        abselem.addRight(new ABCJS.write.RelativeElement(elem.value[i].num, i*20, this.glyphs.getSymbolWidth(elem.value[i].num.charAt(0))*elem.value[i].num.length, 7));
      }
    }
  } else if (elem.type === "common_time") {
    abselem.addRight(new ABCJS.write.RelativeElement("timesig.common", 0, this.glyphs.getSymbolWidth("timesig.common"), 7));
    
  } else if (elem.type === "cut_time") {
    abselem.addRight(new ABCJS.write.RelativeElement("timesig.cut", 0, this.glyphs.getSymbolWidth("timesig.cut"), 7));
  }
  this.startlimitelem = abselem; // limit ties here
  return abselem;
};
