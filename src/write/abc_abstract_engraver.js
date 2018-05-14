// abc_abstract_engraver.js: Creates a data structure suitable for printing a line of abc
// Copyright (C) 2010-2018 Gregory Dyke (gregdyke at gmail dot com)
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*global window */

var AbsoluteElement = require('./abc_absolute_element');
var BeamElem = require('./abc_beam_element');
var BraceElem = require('./abc_brace_element');
var createClef = require('./abc_create_clef');
var createKeySignature = require('./abc_create_key_signature');
var createTimeSignature = require('./abc_create_time_signature');
var Decoration = require('./abc_decoration');
var EndingElem = require('./abc_ending_element');
var glyphs = require('./abc_glyphs');
var RelativeElement = require('./abc_relative_element');
var spacing = require('./abc_spacing');
var StaffGroupElement = require('./abc_staff_group_element');
var TempoElement = require('./abc_tempo_element');
var TieElem = require('./abc_tie_element');
var TripletElem = require('./abc_triplet_element');
var VoiceElement = require('./abc_voice_element');

var parseCommon = require('../parse/abc_common');

var AbstractEngraver;

(function() {
	"use strict";

var getDuration = function(elem) {
  var d = 0;
  if (elem.duration) {
    d = elem.duration;
  }
  return d;
};

var hint = false;

AbstractEngraver = function(bagpipes, renderer, tuneNumber) {
	this.decoration = new Decoration();
	this.renderer = renderer;
	this.tuneNumber = tuneNumber;
  this.isBagpipes = bagpipes;
  this.chartable = {rest:{0:"rests.whole", 1:"rests.half", 2:"rests.quarter", 3:"rests.8th", 4: "rests.16th",5: "rests.32nd", 6: "rests.64th", 7: "rests.128th", "multi": "rests.multimeasure"},
                 note:{"-1": "noteheads.dbl", 0:"noteheads.whole", 1:"noteheads.half", 2:"noteheads.quarter", 3:"noteheads.quarter", 4:"noteheads.quarter", 5:"noteheads.quarter", 6:"noteheads.quarter", 7:"noteheads.quarter", 'nostem':"noteheads.quarter"},
                 rhythm:{"-1": "noteheads.slash.whole", 0:"noteheads.slash.whole", 1:"noteheads.slash.whole", 2:"noteheads.slash.quarter", 3:"noteheads.slash.quarter", 4:"noteheads.slash.quarter", 5:"noteheads.slash.quarter", 6:"noteheads.slash.quarter", 7:"noteheads.slash.quarter", nostem: "noteheads.slash.nostem"},
                 x:{"-1": "noteheads.indeterminate", 0:"noteheads.indeterminate", 1:"noteheads.indeterminate", 2:"noteheads.indeterminate", 3:"noteheads.indeterminate", 4:"noteheads.indeterminate", 5:"noteheads.indeterminate", 6:"noteheads.indeterminate", 7:"noteheads.indeterminate", nostem: "noteheads.indeterminate"},
                 harmonic:{"-1": "noteheads.harmonic.quarter", 0:"noteheads.harmonic.quarter", 1:"noteheads.harmonic.quarter", 2:"noteheads.harmonic.quarter", 3:"noteheads.harmonic.quarter", 4:"noteheads.harmonic.quarter", 5:"noteheads.harmonic.quarter", 6:"noteheads.harmonic.quarter", 7:"noteheads.harmonic.quarter", nostem: "noteheads.harmonic.quarter"},
                 uflags:{3:"flags.u8th", 4:"flags.u16th", 5:"flags.u32nd", 6:"flags.u64th"},
                 dflags:{3:"flags.d8th", 4:"flags.d16th", 5:"flags.d32nd", 6:"flags.d64th"}};
	this.reset();
};

AbstractEngraver.prototype.reset = function() {
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

AbstractEngraver.prototype.setStemHeight = function(heightInPixels) {
	this.stemHeight = heightInPixels / spacing.STEP;
};

AbstractEngraver.prototype.getCurrentVoiceId = function() {
  return "s"+this.s+"v"+this.v;
};

AbstractEngraver.prototype.pushCrossLineElems = function() {
  this.slursbyvoice[this.getCurrentVoiceId()] = this.slurs;
  this.tiesbyvoice[this.getCurrentVoiceId()] = this.ties;
  this.endingsbyvoice[this.getCurrentVoiceId()] = this.partstartelem;
};

AbstractEngraver.prototype.popCrossLineElems = function() {
  this.slurs = this.slursbyvoice[this.getCurrentVoiceId()] || {};
  this.ties = this.tiesbyvoice[this.getCurrentVoiceId()] || [];
  this.partstartelem = this.endingsbyvoice[this.getCurrentVoiceId()];
};

AbstractEngraver.prototype.getElem = function() {
  if (this.abcline.length <= this.pos)
    return null;
  return this.abcline[this.pos];
};

AbstractEngraver.prototype.getNextElem = function() {
        if (this.abcline.length <= this.pos+1)
                return null;
    return this.abcline[this.pos+1];
};

	AbstractEngraver.prototype.containsLyrics = function(staves) {
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

AbstractEngraver.prototype.createABCLine = function(staffs, tempo) {
    this.minY = 2; // PER: This is the lowest that any note reaches. It will be used to set the dynamics row.
	// See if there are any lyrics on this line.
	this.containsLyrics(staffs);
  this.staffgroup = new StaffGroupElement();
	this.tempoSet = false;
  for (this.s = 0; this.s < staffs.length; this.s++) {
	  if (hint)
		  this.restoreState();
	  hint = false;
    this.createABCStaff(staffs[this.s], tempo);
  }
  return this.staffgroup;
};

AbstractEngraver.prototype.createABCStaff = function(abcstaff, tempo) {
// If the tempo is passed in, then the first element should get the tempo attached to it.
  for (this.v = 0; this.v < abcstaff.voices.length; this.v++) {
    this.voice = new VoiceElement(this.v,abcstaff.voices.length);
    if (this.v===0) {
      this.voice.barfrom = (abcstaff.connectBarLines==="start" || abcstaff.connectBarLines==="continue");
      this.voice.barto = (abcstaff.connectBarLines==="continue" || abcstaff.connectBarLines==="end");
    } else {
      this.voice.duplicate = true; // bar lines and other duplicate info need not be created
    }
    if (abcstaff.title && abcstaff.title[this.v]) this.voice.header=abcstaff.title[this.v];
	  var clef = createClef(abcstaff.clef, this.tuneNumber);
	  if (clef) {
		  if (this.v ===0 && abcstaff.barNumber) {
			  this.addMeasureNumber(abcstaff.barNumber, clef);
		  }
		  this.voice.addChild(clef);
	  }
	  var keySig = createKeySignature(abcstaff.key, this.tuneNumber);
	  if (keySig) {
		  this.voice.addChild(keySig);
		  this.startlimitelem = keySig; // limit ties here
	  }
    if (abcstaff.meter) {
		var ts = createTimeSignature(abcstaff.meter, this.tuneNumber);
		this.voice.addChild(ts);
		this.startlimitelem = ts; // limit ties here
	}
	  if (this.voice.duplicate)
	  	this.voice.children = []; // we shouldn't reprint the above if we're reusing the same staff. We just created them to get the right spacing.
    var staffLines = abcstaff.clef.stafflines || abcstaff.clef.stafflines === 0 ? abcstaff.clef.stafflines : 5;
    this.staffgroup.addVoice(this.voice,this.s,staffLines);
	  this.createABCVoice(abcstaff.voices[this.v],tempo);
	  this.staffgroup.setStaffLimits(this.voice);
            //Tony: Here I am following what staves need to be surrounded by the brace, by incrementing the length of the brace class.
            //So basically this keeps incrementing the number of staff surrounded by the brace until it sees "end".
            //This then gets processed in abc_staff_group_element.js, so that it will have the correct top and bottom coordinates for the brace.
			if(abcstaff.brace === "start"){
				this.staffgroup.brace = new BraceElem(1, true);
			}
			else if(abcstaff.brace === "end" && this.staffgroup.brace) {
				this.staffgroup.brace.increaseStavesIncluded();
			}
			else if(abcstaff.brace === "continue" && this.staffgroup.brace){
				this.staffgroup.brace.increaseStavesIncluded();
			}
  }
};

AbstractEngraver.prototype.createABCVoice = function(abcline, tempo) {
  this.popCrossLineElems();
  this.stemdir = (this.isBagpipes)?"down":null;
  this.abcline = abcline;
  if (this.partstartelem) {
    this.partstartelem = new EndingElem("", null, null);
    this.voice.addOther(this.partstartelem);
  }
  for (var slur in this.slurs) {
    if (this.slurs.hasOwnProperty(slur)) {
      this.slurs[slur]= new TieElem(null, null, this.slurs[slur].above, this.slurs[slur].force, false);
		if (hint) this.slurs[slur].setHint();
        this.voice.addOther(this.slurs[slur]);
    }
  }
  for (var i=0; i<this.ties.length; i++) {
    this.ties[i]=new TieElem(null, null, this.ties[i].above, this.ties[i].force, true);
	  if (hint) this.ties[i].setHint();
    this.voice.addOther(this.ties[i]);
  }

  for (this.pos=0; this.pos<this.abcline.length; this.pos++) {
    var abselems = this.createABCElement();
	  if (abselems) {
    for (i=0; i<abselems.length; i++) {
      if (!this.tempoSet && tempo && !tempo.suppress) {
        this.tempoSet = true;
        abselems[i].addChild(new TempoElement(tempo, this.tuneNumber));
      }
      this.voice.addChild(abselems[i]);
    }
    }
  }
  this.pushCrossLineElems();
};

	AbstractEngraver.prototype.saveState = function() {
		this.tiesSave = parseCommon.cloneArray(this.ties);
		this.slursSave = parseCommon.cloneHashOfHash(this.slurs);
		this.slursbyvoiceSave = parseCommon.cloneHashOfHash(this.slursbyvoice);
		this.tiesbyvoiceSave = parseCommon.cloneHashOfArrayOfHash(this.tiesbyvoice);
	};

	AbstractEngraver.prototype.restoreState = function() {
		this.ties = parseCommon.cloneArray(this.tiesSave);
		this.slurs = parseCommon.cloneHashOfHash(this.slursSave);
		this.slursbyvoice = parseCommon.cloneHashOfHash(this.slursbyvoiceSave);
		this.tiesbyvoice = parseCommon.cloneHashOfArrayOfHash(this.tiesbyvoiceSave);
	};

// return an array of AbsoluteElement
AbstractEngraver.prototype.createABCElement = function() {
  var elemset = [];
  var elem = this.getElem();
  switch (elem.el_type) {
  case "note":
    elemset = this.createBeam();
    break;
  case "bar":
    elemset[0] = this.createBarLine(elem);
    if (this.voice.duplicate && elemset.length > 0) elemset[0].invisible = true;
    break;
  case "meter":
    elemset[0] = createTimeSignature(elem, this.tuneNumber);
	  this.startlimitelem = elemset[0]; // limit ties here
    if (this.voice.duplicate && elemset.length > 0) elemset[0].invisible = true;
    break;
  case "clef":
    elemset[0] = createClef(elem, this.tuneNumber);
	  if (!elemset[0]) return null;
    if (this.voice.duplicate && elemset.length > 0) elemset[0].invisible = true;
    break;
  case "key":
	  var absKey = createKeySignature(elem, this.tuneNumber);
	  if (absKey) {
		  elemset[0] = absKey;
		  this.startlimitelem = elemset[0]; // limit ties here
	  }
    if (this.voice.duplicate && elemset.length > 0) elemset[0].invisible = true;
    break;
  case "stem":
    this.stemdir=elem.direction;
    break;
  case "part":
    var abselem = new AbsoluteElement(elem,0,0, 'part', this.tuneNumber);
	  var dim = this.renderer.getTextSize(elem.title, 'partsfont', "part");
    abselem.addChild(new RelativeElement(elem.title, 0, 0, undefined, {type:"part", height: dim.height/spacing.STEP}));
    elemset[0] = abselem;
    break;
  case "tempo":
    var abselem3 = new AbsoluteElement(elem,0,0, 'tempo', this.tuneNumber);
    abselem3.addChild(new TempoElement(elem, this.tuneNumber));
    elemset[0] = abselem3;
    break;
	  case "style":
		  if (elem.head === "normal")
			  delete this.style;
		  else
			  this.style = elem.head;
		  break;
	  case "hint":
		  hint = true;
		  this.saveState();
		  break;
	  case "midi":
		// This has no effect on the visible music, so just skip it.
		break;

  default:
    var abselem2 = new AbsoluteElement(elem,0,0, 'unsupported', this.tuneNumber);
    abselem2.addChild(new RelativeElement("element type "+elem.el_type, 0, 0, undefined, {type:"debug"}));
    elemset[0] = abselem2;
  }

  return elemset;
};

AbstractEngraver.prototype.calcBeamDir = function() {
	if (this.stemdir) // If the user or voice is forcing the stem direction, we already know the answer.
		return this.stemdir;
	var beamelem = new BeamElem(this.stemHeight, this.stemdir);
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

AbstractEngraver.prototype.createBeam = function() {
  var abselemset = [];

  if (this.getElem().startBeam && !this.getElem().endBeam) {
	  var dir = this.calcBeamDir();
         var beamelem = new BeamElem(this.stemHeight, dir);
	  if (hint) beamelem.setHint();
         var oldDir = this.stemdir;
         this.stemdir = dir;
	  while (this.getElem()) {
		  var abselem = this.createNote(this.getElem(), true);
		  abselemset.push(abselem);
		  beamelem.add(abselem);
		  if (this.triplet && this.triplet.isClosed()) {
			  this.voice.addOther(this.triplet);
			  this.triplet = null;
			  this.tripletmultiplier = 1;
		  }
		  if (this.getElem().endBeam) {
			  break;
		  }
		  this.pos++;
	  }
         this.stemdir = oldDir;
    this.voice.addBeam(beamelem);
  } else {
    abselemset[0] = this.createNote(this.getElem());
	  if (this.triplet && this.triplet.isClosed()) {
		  this.voice.addOther(this.triplet);
		  this.triplet = null;
		  this.tripletmultiplier = 1;
	  }
  }
  return abselemset;
};

var sortPitch = function(elem) {
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

var ledgerLines = function(abselem, minPitch, maxPitch, isRest, c, additionalLedgers, dir, dx, scale) {
	for (var i=maxPitch; i>11; i--) {
		if (i%2===0 && !isRest) {
			abselem.addChild(new RelativeElement(null, dx, (glyphs.getSymbolWidth(c)+4)*scale, i, {type:"ledger"}));
		}
	}

	for (i=minPitch; i<1; i++) {
		if (i%2===0 && !isRest) {
			abselem.addChild(new RelativeElement(null, dx, (glyphs.getSymbolWidth(c)+4)*scale, i, {type:"ledger"}));
		}
	}

	for (i = 0; i < additionalLedgers.length; i++) { // PER: draw additional ledgers
		var ofs = glyphs.getSymbolWidth(c);
		if (dir === 'down') ofs = -ofs;
		abselem.addChild(new RelativeElement(null, ofs+dx, (glyphs.getSymbolWidth(c)+4)*scale, additionalLedgers[i], {type:"ledger"}));
	}
};

AbstractEngraver.prototype.createNote = function(elem, nostem, dontDraw) { //stem presence: true for drawing stemless notehead
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

  var duration = getDuration(elem);
	var zeroDuration = false;
  if (duration === 0) { zeroDuration = true; duration = 0.25; nostem = true; }        //PER: zero duration will draw a quarter note head.
  var durlog = Math.floor(Math.log(duration)/Math.log(2)); //TODO use getDurlog
  var dot=0;

  for (var tot = Math.pow(2,durlog), inc=tot/2; tot<duration; dot++,tot+=inc,inc/=2);


	if (elem.startTriplet && !dontDraw) {
		this.tripletmultiplier = elem.tripletMultiplier;
	}

  var durationForSpacing = duration * this.tripletmultiplier;
  if (elem.rest && elem.rest.type === 'multimeasure')
  	durationForSpacing = 1;
  var absType = elem.rest ? "rest" : "note";
  var abselem = new AbsoluteElement(elem, durationForSpacing, 1, absType, this.tuneNumber, { durationClassOveride: elem.duration * this.tripletmultiplier});
  if (hint) abselem.setHint();

  if (elem.rest) {
    var restpitch = 7;
    if (this.voice.voicetotal > 1) {
	    if (this.stemdir === "down") restpitch = 3;
	    if (this.stemdir === "up") restpitch = 11;
    }
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
	    if (elem.style === "rhythm") // special case for rhythm: rests are a handy way to express the rhythm.
		    c = this.chartable.rhythm[-durlog];
	    else
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
		break;
	    case "multimeasure":
	    	c = this.chartable.rest['multi'];
		    elem.averagepitch=restpitch;
		    elem.minpitch=restpitch;
		    elem.maxpitch=restpitch;
		    dot = 0;
		    var mmWidth = glyphs.getSymbolWidth(c);
		    abselem.addHead(new RelativeElement(c, -mmWidth, mmWidth*2, 7 ));
		    var numMeasures = new RelativeElement(""+elem.duration, 0, mmWidth, 16, {type:"multimeasure-text"});
		    abselem.addExtra(numMeasures);
    }
         if (!dontDraw && elem.rest.type !== "multimeasure")
    notehead = this.createNoteHead(abselem, c, {verticalPos:restpitch}, null, 0, -this.roomtaken, null, dot, 0, 1);
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
         this.roomtaken = glyphs.getSymbolWidth(noteSymbol)+2;
        } else {
         dotshiftx = glyphs.getSymbolWidth(noteSymbol)+2;
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
	    if (elem.pitches[p].style) { // There is a style for the whole group of pitches, but there could also be an override for a particular pitch.
		    c = this.chartable[elem.pitches[p].style][-durlog];
	    } else
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
      if (notehead) {
      	if (elem.gracenotes && elem.gracenotes.length > 0)
			notehead.bottom = notehead.bottom - 1;	 // If there is a tie to the grace notes, leave a little more room for the note to avoid collisions.
		  abselem.addHead(notehead);
	  }
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
      abselem.addExtra(new RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2":p2, linewidth: width}));
        this.minY = Math.min(p1, this.minY);
        this.minY = Math.min(p2, this.minY);
    }

  }

  if (elem.lyric !== undefined) {
    var lyricStr = "";
         parseCommon.each(elem.lyric, function(ly) {
         	var div = ly.divider === ' ' ? "" : ly.divider;
         lyricStr += ly.syllable + div + "\n";
      });
	  var lyricDim = this.renderer.getTextSize(lyricStr, 'vocalfont', "lyric");
	  var position = elem.positioning ? elem.positioning.vocalPosition : 'below';
    abselem.addCentered(new RelativeElement(lyricStr, 0, lyricDim.width, undefined, {type:"lyric", position: position, height: lyricDim.height / spacing.STEP }));
  }

  if (!dontDraw && elem.gracenotes !== undefined) {
    var gracescale = 3/5;
    var graceScaleStem = 3.5/5; // TODO-PER: empirically found constant.
    var gracebeam = null;
    if (elem.gracenotes.length>1) {
      gracebeam = new BeamElem(this.stemHeight*graceScaleStem, "grace",this.isBagpipes);
		if (hint) gracebeam.setHint();
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
                        abselem.addRight(new RelativeElement("flags.ugrace", -graceoffsets[i]+dAcciaccatura, 0, pos, {scalex:gracescale, scaley: gracescale}));
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
        abselem.addExtra(new RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2":p2, linewidth: width}));
      }
		ledgerLines(abselem, gracepitch, gracepitch, false, "noteheads.quarter", [], true, grace.dx-1, 0.6);

      if (i===0 && !this.isBagpipes && !(elem.rest && (elem.rest.type==="spacer"||elem.rest.type==="invisible"))) {
      	var isTie = (elem.gracenotes.length === 1 && grace.pitch === notehead.pitch);
      	this.voice.addOther(new TieElem(grace, notehead, false, true, isTie));
	  }
    }

    if (gracebeam) {
      this.voice.addBeam(gracebeam);
    }
  }

  if (!dontDraw && elem.decoration) {
	  this.decoration.createDecoration(this.voice, elem.decoration, abselem.top, (notehead)?notehead.w:0, abselem, this.roomtaken, dir, abselem.bottom, elem.positioning, this.hasVocals);
  }

  if (elem.barNumber) {
    abselem.addChild(new RelativeElement(elem.barNumber, -10, 0, 0, {type:"barNumber"}));
  }

  // ledger lines
	ledgerLines(abselem, elem.minpitch, elem.maxpitch, elem.rest, c, additionalLedgers, dir, -2, 1);

	var chordMargin = 8; // If there are chords next to each other, this is how close they can get.
  if (elem.chord !== undefined) {
    for (i = 0; i < elem.chord.length; i++) {
      var x = 0;
      var y;
		var dim = this.renderer.getTextSize(elem.chord[i].name, 'annotationfont', "annotation");
		var chordWidth = dim.width;
		var chordHeight = dim.height / spacing.STEP;
      switch (elem.chord[i].position) {
      case "left":
        this.roomtaken+=chordWidth+7;
        x = -this.roomtaken;        // TODO-PER: This is just a guess from trial and error
        y = elem.averagepitch;
        abselem.addExtra(new RelativeElement(elem.chord[i].name, x, chordWidth+4, y, {type:"text", height: chordHeight}));
        break;
      case "right":
        this.roomtakenright+=4;
        x = this.roomtakenright;// TODO-PER: This is just a guess from trial and error
        y = elem.averagepitch;
        abselem.addRight(new RelativeElement(elem.chord[i].name, x, chordWidth+4, y, {type:"text", height: chordHeight}));
        break;
      case "below":
		  // setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
		  abselem.addRight(new RelativeElement(elem.chord[i].name, 0, chordWidth+chordMargin, undefined, {type: "text", position: "below", height: chordHeight}));
    break;
		case "above":
			// setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
			abselem.addRight(new RelativeElement(elem.chord[i].name, 0, chordWidth+chordMargin, undefined, {type: "text", height: chordHeight}));
			break;
      default:
		if (elem.chord[i].rel_position) {
			var relPositionY = elem.chord[i].rel_position.y + 3*spacing.STEP; // TODO-PER: this is a fudge factor to make it line up with abcm2ps
			abselem.addChild(new RelativeElement(elem.chord[i].name, x + elem.chord[i].rel_position.x, 0, elem.minpitch + relPositionY / spacing.STEP, {type: "text", height: chordHeight}));
		} else {
			// setting the y-coordinate to undefined for now: it will be overwritten later on, after we figure out what the highest element on the line is.
			var pos2 = 'above';
			if (elem.positioning && elem.positioning.chordPosition)
				pos2 = elem.positioning.chordPosition;

			dim = this.renderer.getTextSize(elem.chord[i].name, 'gchordfont', "chord");
			chordHeight = dim.height / spacing.STEP;
			chordWidth = dim.width; // Since the chord is centered, we only use half the width.
			abselem.addCentered(new RelativeElement(elem.chord[i].name, x, chordWidth, undefined, {type: "chord", position: pos2, height: chordHeight }));
		}
      }
    }
  }


  if (elem.startTriplet && !dontDraw) {
    this.triplet = new TripletElem(elem.startTriplet, notehead); // above is opposite from case of slurs
  }

  if (elem.endTriplet && this.triplet && !dontDraw) {
    this.triplet.setCloseAnchor(notehead);
  }

  return abselem;
};




AbstractEngraver.prototype.createNoteHead = function(abselem, c, pitchelem, dir, headx, extrax, flag, dot, dotshiftx, scale) {

  // TODO scale the dot as well
  var pitch = pitchelem.verticalPos;
  var notehead;
  var i;
  this.accidentalshiftx = 0;
  this.dotshiftx = 0;
  if (c === undefined)
    abselem.addChild(new RelativeElement("pitch is undefined", 0, 0, 0, {type:"debug"}));
  else if (c==="") {
    notehead = new RelativeElement(null, 0, 0, pitch);
  } else {
    var shiftheadx = headx;
    if (pitchelem.printer_shift) {
      var adjust = (pitchelem.printer_shift==="same")?1:0;
      shiftheadx = (dir==="down")?-glyphs.getSymbolWidth(c)*scale+adjust:glyphs.getSymbolWidth(c)*scale-adjust;
    }
	  var opts = {scalex:scale, scaley: scale, thickness: glyphs.symbolHeightInPitches(c)*scale };
	  //if (dir)
	  //	opts.stemHeight = ((dir==="down")?-this.stemHeight:this.stemHeight);
    notehead = new RelativeElement(c, shiftheadx, glyphs.getSymbolWidth(c)*scale, pitch, opts);
    if (flag) {
      var pos = pitch+((dir==="down")?-7:7)*scale;
      if (scale===1 && (dir==="down")?(pos>6):(pos<6)) pos=6;
      var xdelta = (dir==="down")?headx:headx+notehead.w-0.6;
      abselem.addRight(new RelativeElement(flag, xdelta, glyphs.getSymbolWidth(flag)*scale, pos, {scalex:scale, scaley: scale}));
    }
    this.dotshiftx = notehead.w+dotshiftx-2+5*dot;
    for (;dot>0;dot--) {
      var dotadjusty = (1-Math.abs(pitch)%2); //PER: take abs value of the pitch. And the shift still happens on ledger lines.
      abselem.addRight(new RelativeElement("dots.dot", notehead.w+dotshiftx-2+5*dot, glyphs.getSymbolWidth("dots.dot"), pitch+dotadjusty));
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
                 accPlace -= (glyphs.getSymbolWidth(symb)*scale+2);
                 this.accidentalSlot.push([pitch,accPlace]);
                 this.accidentalshiftx = (glyphs.getSymbolWidth(symb)*scale+2);
         }
    abselem.addExtra(new RelativeElement(symb, accPlace, glyphs.getSymbolWidth(symb), pitch, {scalex:scale, scaley: scale}));
  }

  if (pitchelem.endTie) {
    if (this.ties[0]) {
      this.ties[0].setEndAnchor(notehead);
      this.ties = this.ties.slice(1,this.ties.length);
    }
  }

  if (pitchelem.startTie) {
    //PER: bug fix: var tie = new TieElem(notehead, null, (this.stemdir=="up" || dir=="down") && this.stemdir!="down",(this.stemdir=="down" || this.stemdir=="up"));
    var tie = new TieElem(notehead, null, (this.stemdir==="down" || dir==="down") && this.stemdir!=="up",(this.stemdir==="down" || this.stemdir==="up"), true);
	  if (hint) tie.setHint();

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
        slur = new TieElem(null, notehead, dir==="down",(this.stemdir==="up" || dir==="down") && this.stemdir!=="down", false);
		  if (hint) slur.setHint();
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
      //PER: bug fix: var slur = new TieElem(notehead, null, (this.stemdir=="up" || dir=="down") && this.stemdir!="down", this.stemdir);
      var slur = new TieElem(notehead, null, (this.stemdir==="down" || dir==="down") && this.stemdir!=="up", false, false);
		if (hint) slur.setHint();
      this.slurs[slurid]=slur;
      this.voice.addOther(slur);
    }
  }

  return notehead;

};

AbstractEngraver.prototype.addMeasureNumber = function (number, abselem) {
	var measureNumHeight = this.renderer.getTextSize(number, "measurefont", 'bar-number');
	abselem.addChild(new RelativeElement(number, 0, 0, 11+measureNumHeight.height / spacing.STEP, {type:"barNumber"}));
};

AbstractEngraver.prototype.createBarLine = function (elem) {
// bar_thin, bar_thin_thick, bar_thin_thin, bar_thick_thin, bar_right_repeat, bar_left_repeat, bar_double_repeat

  var abselem = new AbsoluteElement(elem, 0, 10, 'bar', this.tuneNumber);
  var anchor = null; // place to attach part lines
  var dx = 0;

	if (elem.barNumber) {
		this.addMeasureNumber(elem.barNumber, abselem);
	}


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
    abselem.addRight(new RelativeElement("dots.dot", dx, 1, 7));
    abselem.addRight(new RelativeElement("dots.dot", dx, 1, 5));
    dx+=6; //2 hardcoded, twice;
  }

  if (firstthin) {
    anchor = new RelativeElement(null, dx, 1, 2, {"type": "bar", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor);
  }

  if (elem.type==="bar_invisible") {
    anchor = new RelativeElement(null, dx, 1, 2, {"type": "none", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor);
  }

  if (elem.decoration) {
    this.decoration.createDecoration(this.voice, elem.decoration, 12, (thick)?3:1, abselem, 0, "down", 2, elem.positioning, this.hasVocals);
  }

  if (thick) {
    dx+=4; //3 hardcoded;
    anchor = new RelativeElement(null, dx, 4, 2, {"type": "bar", "pitch2":10, linewidth:4});
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
    anchor = new RelativeElement(null, dx, 1, 2, {"type": "bar", "pitch2":10, linewidth:0.6});
    abselem.addRight(anchor); // 3 is hardcoded
  }

  if (seconddots) {
    dx+=3; //3 hardcoded;
    abselem.addRight(new RelativeElement("dots.dot", dx, 1, 7));
    abselem.addRight(new RelativeElement("dots.dot", dx, 1, 5));
  } // 2 is hardcoded

  if (elem.startEnding && this.s === 0) { // only put the first & second ending marks on the first staff
	  var textWidth = this.renderer.getTextSize(elem.startEnding, "repeatfont", '').width;
	  abselem.minspacing += textWidth + 10; // Give plenty of room for the ending number.
    this.partstartelem = new EndingElem(elem.startEnding, anchor, null);
    this.voice.addOther(this.partstartelem);
  }

  return abselem;

};


})();

module.exports = AbstractEngraver;
