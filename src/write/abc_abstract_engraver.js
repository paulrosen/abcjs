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

	var chartable = {
		rest:{0:"rests.whole", 1:"rests.half", 2:"rests.quarter", 3:"rests.8th", 4: "rests.16th",5: "rests.32nd", 6: "rests.64th", 7: "rests.128th", "multi": "rests.multimeasure"},
		note:{"-1": "noteheads.dbl", 0:"noteheads.whole", 1:"noteheads.half", 2:"noteheads.quarter", 3:"noteheads.quarter", 4:"noteheads.quarter", 5:"noteheads.quarter", 6:"noteheads.quarter", 7:"noteheads.quarter", 'nostem':"noteheads.quarter"},
		rhythm:{"-1": "noteheads.slash.whole", 0:"noteheads.slash.whole", 1:"noteheads.slash.whole", 2:"noteheads.slash.quarter", 3:"noteheads.slash.quarter", 4:"noteheads.slash.quarter", 5:"noteheads.slash.quarter", 6:"noteheads.slash.quarter", 7:"noteheads.slash.quarter", nostem: "noteheads.slash.nostem"},
		x:{"-1": "noteheads.indeterminate", 0:"noteheads.indeterminate", 1:"noteheads.indeterminate", 2:"noteheads.indeterminate", 3:"noteheads.indeterminate", 4:"noteheads.indeterminate", 5:"noteheads.indeterminate", 6:"noteheads.indeterminate", 7:"noteheads.indeterminate", nostem: "noteheads.indeterminate"},
		harmonic:{"-1": "noteheads.harmonic.quarter", 0:"noteheads.harmonic.quarter", 1:"noteheads.harmonic.quarter", 2:"noteheads.harmonic.quarter", 3:"noteheads.harmonic.quarter", 4:"noteheads.harmonic.quarter", 5:"noteheads.harmonic.quarter", 6:"noteheads.harmonic.quarter", 7:"noteheads.harmonic.quarter", nostem: "noteheads.harmonic.quarter"},
		uflags:{3:"flags.u8th", 4:"flags.u16th", 5:"flags.u32nd", 6:"flags.u64th"},
		dflags:{3:"flags.d8th", 4:"flags.d16th", 5:"flags.d32nd", 6:"flags.d64th"}
	};

AbstractEngraver = function(renderer, tuneNumber, options) {
	this.decoration = new Decoration();
	this.renderer = renderer;
	this.tuneNumber = tuneNumber;
	this.isBagpipes = options.bagpipes;
	this.flatBeams = options.flatbeams;
	this.reset();
};

AbstractEngraver.prototype.reset = function() {
	this.slurs = {};
	this.ties = [];
	this.voiceScale = 1;
	this.slursbyvoice = {};
	this.tiesbyvoice = {};
	this.endingsbyvoice = {};
	this.scaleByVoice = {};
	this.tripletmultiplier = 1;

	this.abcline = undefined;
	this.accidentalSlot = undefined;
	this.accidentalshiftx = undefined;
	this.dotshiftx = undefined;
	this.hasVocals = false;
	this.minY = undefined;
	this.partstartelem = undefined;
	this.startlimitelem = undefined;
	this.stemdir = undefined;
};

AbstractEngraver.prototype.setStemHeight = function(heightInPixels) {
	this.stemHeight = heightInPixels / spacing.STEP;
};

AbstractEngraver.prototype.getCurrentVoiceId = function(s,v) {
  return "s"+s+"v"+v;
};

AbstractEngraver.prototype.pushCrossLineElems = function(s,v) {
  this.slursbyvoice[this.getCurrentVoiceId(s,v)] = this.slurs;
  this.tiesbyvoice[this.getCurrentVoiceId(s,v)] = this.ties;
  this.endingsbyvoice[this.getCurrentVoiceId(s,v)] = this.partstartelem;
  this.scaleByVoice[this.getCurrentVoiceId(s,v)] = this.voiceScale;
};

AbstractEngraver.prototype.popCrossLineElems = function(s,v) {
  this.slurs = this.slursbyvoice[this.getCurrentVoiceId(s,v)] || {};
  this.ties = this.tiesbyvoice[this.getCurrentVoiceId(s,v)] || [];
  this.partstartelem = this.endingsbyvoice[this.getCurrentVoiceId(s,v)];
  this.voiceScale = this.scaleByVoice[this.getCurrentVoiceId(s,v)];
  if (this.voiceScale === undefined) this.voiceScale = 1;
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
    this.minY = 2; // PER: This will be the lowest that any note reaches. It will be used to set the dynamics row.
	// See if there are any lyrics on this line.
	this.containsLyrics(staffs);
  var staffgroup = new StaffGroupElement();
	this.tempoSet = false;
  for (var s = 0; s < staffs.length; s++) {
	  if (hint)
		  this.restoreState();
	  hint = false;
    this.createABCStaff(staffgroup, staffs[s], tempo, s);
  }
  return staffgroup;
};

AbstractEngraver.prototype.createABCStaff = function(staffgroup, abcstaff, tempo, s) {
// If the tempo is passed in, then the first element should get the tempo attached to it.
  for (var v = 0; v < abcstaff.voices.length; v++) {
    var voice = new VoiceElement(v,abcstaff.voices.length);
    if (v===0) {
	    voice.barfrom = (abcstaff.connectBarLines==="start" || abcstaff.connectBarLines==="continue");
	    voice.barto = (abcstaff.connectBarLines==="continue" || abcstaff.connectBarLines==="end");
    } else {
	    voice.duplicate = true; // bar lines and other duplicate info need not be created
    }
    if (abcstaff.title && abcstaff.title[v]) voice.header=abcstaff.title[v];
	  var clef = createClef(abcstaff.clef, this.tuneNumber);
	  if (clef) {
		  if (v ===0 && abcstaff.barNumber) {
			  this.addMeasureNumber(abcstaff.barNumber, clef);
		  }
		  voice.addChild(clef);
	  }
	  var keySig = createKeySignature(abcstaff.key, this.tuneNumber);
	  if (keySig) {
		  voice.addChild(keySig);
		  this.startlimitelem = keySig; // limit ties here
	  }
    if (abcstaff.meter) {
    	if (abcstaff.meter.type === 'specified') {
    		this.measureLength = abcstaff.meter.value[0].num / abcstaff.meter.value[0].den;
	    } else
	    	this.measureLength = 1;
		var ts = createTimeSignature(abcstaff.meter, this.tuneNumber);
	    voice.addChild(ts);
		this.startlimitelem = ts; // limit ties here
	}
	  if (voice.duplicate)
		  voice.children = []; // we shouldn't reprint the above if we're reusing the same staff. We just created them to get the right spacing.
    var staffLines = abcstaff.clef.stafflines || abcstaff.clef.stafflines === 0 ? abcstaff.clef.stafflines : 5;
    staffgroup.addVoice(voice,s,staffLines);
	  var isSingleLineStaff = staffLines === 1;
	  this.createABCVoice(abcstaff.voices[v],tempo, s, v, isSingleLineStaff, voice);
	  staffgroup.setStaffLimits(voice);
            //Tony: Here I am following what staves need to be surrounded by the brace, by incrementing the length of the brace class.
            //So basically this keeps incrementing the number of staff surrounded by the brace until it sees "end".
            //This then gets processed in abc_staff_group_element.js, so that it will have the correct top and bottom coordinates for the brace.
			if(abcstaff.brace === "start"){
				staffgroup.brace = new BraceElem(1, true);
			}
			else if(abcstaff.brace === "end" && staffgroup.brace) {
				staffgroup.brace.increaseStavesIncluded();
			}
			else if(abcstaff.brace === "continue" && staffgroup.brace){
				staffgroup.brace.increaseStavesIncluded();
			}
  }
};

function getBeamGroup(abcline, pos) {
	// If there are notes beamed together, they are handled as a group, so find all of them here.
	var elem = abcline[pos];
	if (elem.el_type !== 'note' || !elem.startBeam || elem.endBeam)
		return { count: 1, elem: elem };

	var group = [];
	while (pos < abcline.length && abcline[pos].el_type === 'note') {
		group.push(abcline[pos]);
		if (abcline[pos].endBeam)
			break;
		pos++;
	}
	return { count: group.length, elem: group };
}

AbstractEngraver.prototype.createABCVoice = function(abcline, tempo, s, v, isSingleLineStaff, voice) {
  this.popCrossLineElems(s,v);
  this.stemdir = (this.isBagpipes)?"down":null;
  this.abcline = abcline;
  if (this.partstartelem) {
    this.partstartelem = new EndingElem("", null, null);
	  voice.addOther(this.partstartelem);
  }
	var voiceNumber = voice.voicetotal < 2 ? -1 : voice.voicenumber;
  for (var slur in this.slurs) {
    if (this.slurs.hasOwnProperty(slur)) {
	    // this is already a slur element, but it was created for the last line, so recreate it.
      this.slurs[slur]= new TieElem({force: this.slurs[slur].force, voiceNumber: voiceNumber, stemDir: this.slurs[slur].stemDir});
		if (hint) this.slurs[slur].setHint();
	    voice.addOther(this.slurs[slur]);
    }
  }
  for (var i=0; i<this.ties.length; i++) {
  	// this is already a tie element, but it was created for the last line, so recreate it.
    this.ties[i]=new TieElem({ force: this.ties[i].force, stemDir: this.ties[i].stemDir, voiceNumber: voiceNumber });
	  if (hint) this.ties[i].setHint();
	  voice.addOther(this.ties[i]);
  }

  for (var j = 0; j < this.abcline.length; j++) {
	  setAveragePitch(this.abcline[j]);
	  this.minY = Math.min(this.abcline[j].minpitch, this.minY);
  }

	var isFirstStaff = (s === 0);
	var pos = 0;
	while (pos < this.abcline.length) {
		var ret = getBeamGroup(this.abcline, pos);
		var abselems = this.createABCElement(isFirstStaff, isSingleLineStaff, voice, ret.elem);
		if (abselems) {
			for (i = 0; i < abselems.length; i++) {
				if (!this.tempoSet && tempo && !tempo.suppress) {
					this.tempoSet = true;
					var tempoElement = new AbsoluteElement(ret.elem, 0, 0, "tempo", this.tuneNumber, {});
					tempoElement.addChild(new TempoElement(tempo, this.tuneNumber, createNoteHead));
					voice.addChild(tempoElement);
				}
				voice.addChild(abselems[i]);
			}
		}
		pos += ret.count;
	}
	this.pushCrossLineElems(s, v);
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

	// function writeMeasureWidth(voice) {
	// 	var width = 0;
	// 	for (var i = voice.children.length-1; i >= 0; i--) {
	// 		var elem = voice.children[i];
	// 		if (elem.abcelem.el_type === 'bar')
	// 			break;
	// 		width += elem.w;
	// 	}
	// 	return new RelativeElement(width.toFixed(2), -70, 0, undefined, {type:"debug"});
	// }

	// return an array of AbsoluteElement
AbstractEngraver.prototype.createABCElement = function(isFirstStaff, isSingleLineStaff, voice, elem) {
  var elemset = [];
  switch (elem.el_type) {
	  case undefined:
	  	// it is undefined if we were passed an array in - an array means a set of notes that should be beamed together.
		  elemset = this.createBeam(isSingleLineStaff, voice, elem);
	  	break;
  case "note":
	  elemset[0] = this.createNote(elem, false, isSingleLineStaff, voice);
	  if (this.triplet && this.triplet.isClosed()) {
		  voice.addOther(this.triplet);
		  this.triplet = null;
		  this.tripletmultiplier = 1;
	  }
    break;
  case "bar":
    elemset[0] = this.createBarLine(voice, elem, isFirstStaff);
    if (voice.duplicate && elemset.length > 0) elemset[0].invisible = true;
//	  elemset[0].addChild(writeMeasureWidth(voice));
    break;
  case "meter":
    elemset[0] = createTimeSignature(elem, this.tuneNumber);
	  this.startlimitelem = elemset[0]; // limit ties here
    if (voice.duplicate && elemset.length > 0) elemset[0].invisible = true;
    break;
  case "clef":
    elemset[0] = createClef(elem, this.tuneNumber);
	  if (!elemset[0]) return null;
    if (voice.duplicate && elemset.length > 0) elemset[0].invisible = true;
    break;
  case "key":
	  var absKey = createKeySignature(elem, this.tuneNumber);
	  if (absKey) {
		  elemset[0] = absKey;
		  this.startlimitelem = elemset[0]; // limit ties here
	  }
    if (voice.duplicate && elemset.length > 0) elemset[0].invisible = true;
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
    abselem3.addChild(new TempoElement(elem, this.tuneNumber, createNoteHead));
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
	  case "scale":
	  	this.voiceScale = elem.size;
	  	break;

  default:
    var abselem2 = new AbsoluteElement(elem,0,0, 'unsupported', this.tuneNumber);
    abselem2.addChild(new RelativeElement("element type "+elem.el_type, 0, 0, undefined, {type:"debug"}));
    elemset[0] = abselem2;
  }

  return elemset;
};

	function setAveragePitch(elem) {
		if (elem.pitches) {
			sortPitch(elem);
			var sum = 0;
			for (var p = 0; p < elem.pitches.length; p++) {
				sum += elem.pitches[p].verticalPos;
			}
			elem.averagepitch = sum / elem.pitches.length;
			elem.minpitch = elem.pitches[0].verticalPos;
			elem.maxpitch = elem.pitches[elem.pitches.length - 1].verticalPos;
		}
	}

	AbstractEngraver.prototype.calcBeamDir = function (isSingleLineStaff, voice, elems) {
		if (this.stemdir) // If the user or voice is forcing the stem direction, we already know the answer.
			return this.stemdir;
		var beamelem = new BeamElem(this.stemHeight * this.voiceScale, this.stemdir, this.flatBeams);
		for (var i = 0; i < elems.length; i++) {
			beamelem.add({abcelem: elems[i]}); // This is a hack to call beam elem with just a minimum of processing: for our purposes, we don't need to construct the whole note.
		}

		var dir = beamelem.calcDir();
		return dir ? "up" : "down";
	};

	AbstractEngraver.prototype.createBeam = function (isSingleLineStaff, voice, elems) {
		var abselemset = [];

		var dir = this.calcBeamDir(isSingleLineStaff, voice, elems);
		var beamelem = new BeamElem(this.stemHeight * this.voiceScale, dir, this.flatBeams);
		if (hint) beamelem.setHint();
		var oldDir = this.stemdir;
		this.stemdir = dir;
		for (var i = 0; i < elems.length; i++) {
			var elem = elems[i];
			var abselem = this.createNote(elem, true, isSingleLineStaff, voice);
			abselemset.push(abselem);
			beamelem.add(abselem);
			if (this.triplet && this.triplet.isClosed()) {
				voice.addOther(this.triplet);
				this.triplet = null;
				this.tripletmultiplier = 1;
			}
		}
		this.stemdir = oldDir;
		voice.addBeam(beamelem);
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

var ledgerLines = function(abselem, minPitch, maxPitch, isRest, symbolWidth, additionalLedgers, dir, dx, scale) {
	for (var i=maxPitch; i>11; i--) {
		if (i%2===0 && !isRest) {
			abselem.addChild(new RelativeElement(null, dx, (symbolWidth+4)*scale, i, {type:"ledger"}));
		}
	}

	for (i=minPitch; i<1; i++) {
		if (i%2===0 && !isRest) {
			abselem.addChild(new RelativeElement(null, dx, (symbolWidth+4)*scale, i, {type:"ledger"}));
		}
	}

	for (i = 0; i < additionalLedgers.length; i++) { // PER: draw additional ledgers
		var ofs = symbolWidth;
		if (dir === 'down') ofs = -ofs;
		abselem.addChild(new RelativeElement(null, ofs+dx, (symbolWidth+4)*scale, additionalLedgers[i], {type:"ledger"}));
	}
};

	AbstractEngraver.prototype.addGraceNotes = function (elem, voice, abselem, notehead, stemHeight, isBagpipes, roomtaken) {
		var gracescale = 3 / 5;
		var graceScaleStem = 3.5 / 5; // TODO-PER: empirically found constant.
		var gracebeam = null;
		var flag;

		if (elem.gracenotes.length > 1) {
			gracebeam = new BeamElem(stemHeight * graceScaleStem, "grace", isBagpipes);
			if (hint) gracebeam.setHint();
			gracebeam.mainNote = abselem;	// this gives us a reference back to the note this is attached to so that the stems can be attached somewhere.
		}

		var graceoffsets = [];
		for (i = elem.gracenotes.length - 1; i >= 0; i--) { // figure out where to place each gracenote
			roomtaken += 10;
			graceoffsets[i] = roomtaken;
			if (elem.gracenotes[i].accidental) {
				roomtaken += 7;
			}
		}

		var i;
		for (i = 0; i < elem.gracenotes.length; i++) {
			var gracepitch = elem.gracenotes[i].verticalPos;

			flag = (gracebeam) ? null : chartable.uflags[(isBagpipes) ? 5 : 3];
			var accidentalSlot = [];
			var ret = createNoteHead(abselem, "noteheads.quarter", elem.gracenotes[i], "up", -graceoffsets[i], -graceoffsets[i], flag, 0, 0, gracescale*this.voiceScale, accidentalSlot, false);
			ret.notehead.highestVert = ret.notehead.pitch + stemHeight * graceScaleStem;
			var grace = ret.notehead;
			this.addSlursAndTies(abselem, elem.gracenotes[i], grace, voice, "up", true);

			abselem.addExtra(grace);
			// PER: added acciaccatura slash
			if (elem.gracenotes[i].acciaccatura) {
				var pos = elem.gracenotes[i].verticalPos + 7 * gracescale;        // the same formula that determines the flag position.
				var dAcciaccatura = gracebeam ? 5 : 6;        // just an offset to make it line up correctly.
				abselem.addRight(new RelativeElement("flags.ugrace", -graceoffsets[i] + dAcciaccatura, 0, pos, {scalex: gracescale, scaley: gracescale}));
			}
			if (gracebeam) { // give the beam the necessary info
				var graceDuration = elem.gracenotes[i].duration / 2;
				if (isBagpipes) graceDuration /= 2;
				var pseudoabselem = {
					heads: [grace],
					abcelem: {averagepitch: gracepitch, minpitch: gracepitch, maxpitch: gracepitch, duration: graceDuration}
				};
				gracebeam.add(pseudoabselem);
			} else { // draw the stem
				var p1 = gracepitch + 1 / 3 * gracescale;
				var p2 = gracepitch + 7 * gracescale;
				var dx = grace.dx + grace.w;
				var width = -0.6;
				abselem.addExtra(new RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2": p2, linewidth: width}));
			}
			ledgerLines(abselem, gracepitch, gracepitch, false, glyphs.getSymbolWidth("noteheads.quarter"), [], true, grace.dx - 1, 0.6);

			if (i === 0 && !isBagpipes && !(elem.rest && (elem.rest.type === "spacer" || elem.rest.type === "invisible"))) {
				// This is the overall slur that is under the grace notes.
				var isTie = (elem.gracenotes.length === 1 && grace.pitch === notehead.pitch);
				voice.addOther(new TieElem({ anchor1: grace, anchor2: notehead, isGrace: true}));
			}
		}

		if (gracebeam) {
			voice.addBeam(gracebeam);
		}
		return roomtaken;
	};

	function addRestToAbsElement(abselem, elem, duration, dot, isMultiVoice, stemdir, isSingleLineStaff, durlog, voiceScale) {
		var c;
		var restpitch = 7;
		var noteHead;
		var roomTaken;
		var roomTakenRight;

		if (isMultiVoice) {
			if (stemdir === "down") restpitch = 3;
			if (stemdir === "up") restpitch = 11;
		}
		// There is special placement for the percussion staff. If there is one staff line, then move the rest position.
		if (isSingleLineStaff) {
			// The half and whole rests are attached to different lines normally, so we need to tweak their position to get them to both be attached to the same one.
			if (duration < 0.5)
				restpitch = 7;
			else if (duration < 1)
				restpitch = 7;	// half rest
			else
				restpitch = 5; // whole rest
		}
		switch (elem.rest.type) {
			case "whole":
				c = chartable.rest[0];
				elem.averagepitch = restpitch;
				elem.minpitch = restpitch;
				elem.maxpitch = restpitch;
				dot = 0;
				break;
			case "rest":
				if (elem.style === "rhythm") // special case for rhythm: rests are a handy way to express the rhythm.
					c = chartable.rhythm[-durlog];
				else
					c = chartable.rest[-durlog];
				elem.averagepitch = restpitch;
				elem.minpitch = restpitch;
				elem.maxpitch = restpitch;
				break;
			case "invisible":
			case "spacer":
				c = "";
				elem.averagepitch = restpitch;
				elem.minpitch = restpitch;
				elem.maxpitch = restpitch;
				break;
			case "multimeasure":
				c = chartable.rest['multi'];
				elem.averagepitch = restpitch;
				elem.minpitch = restpitch;
				elem.maxpitch = restpitch;
				dot = 0;
				var mmWidth = glyphs.getSymbolWidth(c);
				abselem.addHead(new RelativeElement(c, -mmWidth, mmWidth * 2, 7));
				var numMeasures = new RelativeElement("" + elem.duration, 0, mmWidth, 16, {type: "multimeasure-text"});
				abselem.addExtra(numMeasures);
		}
		if (elem.rest.type !== "multimeasure") {
			var ret = createNoteHead(abselem, c, {verticalPos: restpitch}, null, 0, 0, null, dot, 0, voiceScale, [], false);
			noteHead = ret.notehead;
			if (noteHead) {
				abselem.addHead(noteHead);
				roomTaken = ret.accidentalshiftx;
				roomTakenRight = ret.dotshiftx;
			}
		}
		return { noteHead: noteHead, roomTaken: roomTaken, roomTakenRight: roomTakenRight };
	}

	function addIfNotExist(arr, item) {
		for (var i = 0; i < arr.length; i++) {
			if (JSON.stringify(arr[i]) === JSON.stringify(item))
				return;
		}
		arr.push(item);
	}

	AbstractEngraver.prototype.addNoteToAbcElement = function(abselem, elem, dot, stemdir, style, zeroDuration, durlog, nostem, voice) {
		var dotshiftx = 0; // room taken by chords with displaced noteheads which cause dots to shift
		var noteHead;
		var roomTaken = 0;
		var roomTakenRight = 0;
		var min;
		var i;
		var additionalLedgers = [];
		// The accidentalSlot will hold a list of all the accidentals on this chord. Each element is a vertical place,
		// and contains a pitch, which is the last pitch that contains an accidental in that slot. The slots are numbered
		// from closest to the note to farther left. We only need to know the last accidental we placed because
		// we know that the pitches are sorted by now.
		var accidentalSlot = [];
		var symbolWidth = 0;

		var dir = (elem.averagepitch>=6) ? "down": "up";
		if (stemdir) dir=stemdir;

		style = elem.style ? elem.style : style; // get the style of note head.
		if (!style || style === "normal") style = "note";
		var noteSymbol;
		if (zeroDuration)
			noteSymbol = chartable[style].nostem;
		else
			noteSymbol = chartable[style][-durlog];
		if (!noteSymbol)
			console.log("noteSymbol:", style, durlog, zeroDuration);

		// determine elements of chords which should be shifted
		var p;
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
					roomTaken = glyphs.getSymbolWidth(noteSymbol)+2;
				} else {
					dotshiftx = glyphs.getSymbolWidth(noteSymbol)+2;
				}
			}
		}

		var pp = elem.pitches.length;
		for (p=0; p<elem.pitches.length; p++) {

			if (!nostem) {
				var flag;
				if ((dir==="down" && p!==0) || (dir==="up" && p!==pp-1)) { // not the stemmed elem of the chord
					flag = null;
				} else {
					flag = chartable[(dir==="down")?"dflags":"uflags"][-durlog];
				}
			}
			var c;
			if (elem.pitches[p].style) { // There is a style for the whole group of pitches, but there could also be an override for a particular pitch.
				c = chartable[elem.pitches[p].style][-durlog];
			} else
				c = noteSymbol;
			// The highest position for the sake of placing slurs is itself if the slur is internal. It is the highest position possible if the slur is for the whole chord.
			// If the note is the only one in the chord, then any slur it has counts as if it were on the whole chord.
			elem.pitches[p].highestVert = elem.pitches[p].verticalPos;
			var isTopWhenStemIsDown = (stemdir==="up" || dir==="up") && p===0;
			var isBottomWhenStemIsUp = (stemdir==="down" || dir==="down") && p===pp-1;
			if (isTopWhenStemIsDown || isBottomWhenStemIsUp) { // place to put slurs if not already on pitches

				if (elem.startSlur || pp === 1) {
					elem.pitches[p].highestVert = elem.pitches[pp-1].verticalPos;
					if (getDuration(elem) < 1 && (stemdir==="up" || dir==="up"))
						elem.pitches[p].highestVert += 6;        // If the stem is up, then compensate for the length of the stem
				}
				if (elem.startSlur) {
					if (!elem.pitches[p].startSlur) elem.pitches[p].startSlur = []; //TODO possibly redundant, provided array is not optional
					for (i=0; i<elem.startSlur.length; i++) {
						addIfNotExist(elem.pitches[p].startSlur, elem.startSlur[i]);
					}
				}

				if (elem.endSlur) {
					elem.pitches[p].highestVert = elem.pitches[pp-1].verticalPos;
					if (getDuration(elem) < 1 && (stemdir==="up" || dir==="up"))
						elem.pitches[p].highestVert += 6;        // If the stem is up, then compensate for the length of the stem
					if (!elem.pitches[p].endSlur) elem.pitches[p].endSlur = []; //TODO possibly redundant, provided array is not optional
					for (i=0; i<elem.endSlur.length; i++) {
						addIfNotExist(elem.pitches[p].endSlur, elem.endSlur[i]);
					}
				}
			}

			var hasStem = !nostem && durlog<=-1;
			var ret = createNoteHead(abselem, c, elem.pitches[p], dir, 0, -roomTaken, flag, dot, dotshiftx, this.voiceScale, accidentalSlot, !stemdir);
			symbolWidth = Math.max(glyphs.getSymbolWidth(c), symbolWidth);
			abselem.extraw -= ret.extraLeft;
			noteHead = ret.notehead;
			if (noteHead) {
				this.addSlursAndTies(abselem, elem.pitches[p], noteHead, voice, hasStem ? dir : null, false);

				if (elem.gracenotes && elem.gracenotes.length > 0)
					noteHead.bottom = noteHead.bottom - 1;	 // If there is a tie to the grace notes, leave a little more room for the note to avoid collisions.
				abselem.addHead(noteHead);
			}
			roomTaken += ret.accidentalshiftx;
			roomTakenRight = Math.max(roomTakenRight,ret.dotshiftx);
		}

		// draw stem from the furthest note to a pitch above/below the stemmed note
		if (hasStem) {
			var stemHeight = 7 * this.voiceScale;
			var p1 = (dir==="down") ? elem.minpitch-stemHeight : elem.minpitch+1/3;
			// PER added stemdir test to make the line meet the note.
			if (p1>6 && !stemdir) p1=6;
			var p2 = (dir==="down") ? elem.maxpitch-1/3 : elem.maxpitch+stemHeight;
			// PER added stemdir test to make the line meet the note.
			if (p2<6 && !stemdir) p2=6;
			var dx = (dir==="down" || abselem.heads.length === 0)?0:abselem.heads[0].w;
			var width = (dir==="down")?1:-1;
			// TODO-PER-HACK: One type of note head has a different placement of the stem. This should be more generically calculated:
			if (noteHead.c === 'noteheads.slash.quarter') {
				if (dir === 'down')
					p2 -= 1;
				else
					p1 += 1;
			}
			abselem.addExtra(new RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2":p2, linewidth: width}));
			//var RelativeElement = function RelativeElement(c, dx, w, pitch, opt) {
			min = Math.min(p1, p2);
		}
		return { noteHead: noteHead, roomTaken: roomTaken, roomTakenRight: roomTakenRight, min: min, additionalLedgers: additionalLedgers, dir: dir, symbolWidth: symbolWidth };
	};

	AbstractEngraver.prototype.addLyric = function(abselem, elem) {
		var lyricStr = "";
		parseCommon.each(elem.lyric, function(ly) {
			var div = ly.divider === ' ' ? "" : ly.divider;
			lyricStr += ly.syllable + div + "\n";
		});
		var lyricDim = this.renderer.getTextSize(lyricStr, 'vocalfont', "lyric");
		var position = elem.positioning ? elem.positioning.vocalPosition : 'below';
		abselem.addCentered(new RelativeElement(lyricStr, 0, lyricDim.width, undefined, {type:"lyric", position: position, height: lyricDim.height / spacing.STEP }));
	};

	AbstractEngraver.prototype.addChord = function(abselem, elem, roomTaken, roomTakenRight) {
		var chordMargin = 8; // If there are chords next to each other, this is how close they can get.
		for (var i = 0; i < elem.chord.length; i++) {
			var x = 0;
			var y;
			var dim = this.renderer.getTextSize(elem.chord[i].name, 'annotationfont', "annotation");
			var chordWidth = dim.width;
			var chordHeight = dim.height / spacing.STEP;
			switch (elem.chord[i].position) {
				case "left":
					roomTaken+=chordWidth+7;
					x = -roomTaken;        // TODO-PER: This is just a guess from trial and error
					y = elem.averagepitch;
					abselem.addExtra(new RelativeElement(elem.chord[i].name, x, chordWidth+4, y, {type:"text", height: chordHeight}));
					break;
				case "right":
					roomTakenRight+=4;
					x = roomTakenRight;// TODO-PER: This is just a guess from trial and error
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
		return { roomTaken: roomTaken, roomTakenRight: roomTakenRight };
	};

AbstractEngraver.prototype.createNote = function(elem, nostem, isSingleLineStaff, voice) { //stem presence: true for drawing stemless notehead
  var notehead = null;
  var roomtaken = 0; // room needed to the left of the note
  var roomtakenright = 0; // room needed to the right of the note
  var symbolWidth = 0;
  var additionalLedgers = []; // PER: handle the case of [bc'], where the b doesn't have a ledger line

  var i;
  var dir;

	var duration = getDuration(elem);
	var zeroDuration = false;
  if (duration === 0) { zeroDuration = true; duration = 0.25; nostem = true; }        //PER: zero duration will draw a quarter note head.
  var durlog = Math.floor(Math.log(duration)/Math.log(2)); //TODO use getDurlog
  var dot=0;

  for (var tot = Math.pow(2,durlog), inc=tot/2; tot<duration; dot++,tot+=inc,inc/=2);


	if (elem.startTriplet) {
		this.tripletmultiplier = elem.tripletMultiplier;
	}

  var durationForSpacing = duration * this.tripletmultiplier;
  if (elem.rest && elem.rest.type === 'multimeasure')
  	durationForSpacing = 1;
  var absType = elem.rest ? "rest" : "note";
  var abselem = new AbsoluteElement(elem, durationForSpacing, 1, absType, this.tuneNumber, { durationClassOveride: elem.duration * this.tripletmultiplier});
  if (hint) abselem.setHint();

  if (elem.rest) {
  	if (this.measureLength === duration && elem.rest.type !== 'invisible' && elem.rest.type !== 'spacer')
	    elem.rest.type = 'whole'; // If the rest is exactly a measure, always use a whole rest
	  var ret1 = addRestToAbsElement(abselem, elem, duration, dot, voice.voicetotal > 1, this.stemdir, isSingleLineStaff, durlog, this.voiceScale);
	  notehead = ret1.noteHead;
	  roomtaken = ret1.roomTaken;
	  roomtakenright = ret1.roomTakenRight;
  } else {
	  var ret2 = this.addNoteToAbcElement(abselem, elem, dot, this.stemdir, this.style, zeroDuration, durlog, nostem, voice);
	  if (ret2.min !== undefined)
		  this.minY = Math.min(ret2.min, this.minY);
	  notehead = ret2.noteHead;
	  roomtaken = ret2.roomTaken;
	  roomtakenright = ret2.roomTakenRight;
	  additionalLedgers = ret2.additionalLedgers;
	  dir = ret2.dir;
	  symbolWidth = ret2.symbolWidth;
  }

  if (elem.lyric !== undefined) {
  	this.addLyric(abselem, elem);
  }

  if (elem.gracenotes !== undefined) {
	roomtaken += this.addGraceNotes(elem, voice, abselem, notehead, this.stemHeight * this.voiceScale, this.isBagpipes, roomtaken);
  }

  if (elem.decoration) {
	  this.decoration.createDecoration(voice, elem.decoration, abselem.top, (notehead)?notehead.w:0, abselem, roomtaken, dir, abselem.bottom, elem.positioning, this.hasVocals);
  }

  if (elem.barNumber) {
    abselem.addChild(new RelativeElement(elem.barNumber, -10, 0, 0, {type:"barNumber"}));
  }

  // ledger lines
	ledgerLines(abselem, elem.minpitch, elem.maxpitch, elem.rest, symbolWidth, additionalLedgers, dir, -2, 1);

  if (elem.chord !== undefined) {
  	var ret3 = this.addChord(abselem, elem, roomtaken, roomtakenright);
	  roomtaken = ret3.roomTaken;
	  roomtakenright = ret3.roomTakenRight;
  }


  if (elem.startTriplet) {
    this.triplet = new TripletElem(elem.startTriplet, notehead, { flatBeams: this.flatBeams }); // above is opposite from case of slurs
  }

  if (elem.endTriplet && this.triplet) {
    this.triplet.setCloseAnchor(notehead);
  }

  if (this.triplet && !elem.startTriplet && !elem.endTriplet) {
  	this.triplet.middleNote(notehead);
  }


  return abselem;
};




var createNoteHead = function(abselem, c, pitchelem, dir, headx, extrax, flag, dot, dotshiftx, scale, accidentalSlot, shouldExtendStem) {
  // TODO scale the dot as well
  var pitch = pitchelem.verticalPos;
  var notehead;
  var i;
  var accidentalshiftx = 0;
  var newDotShiftX = 0;
  var extraLeft = 0;
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
    notehead = new RelativeElement(c, shiftheadx, glyphs.getSymbolWidth(c)*scale, pitch, opts);
    notehead.stemDir = dir;
    if (flag) {
      var pos = pitch+((dir==="down")?-7:7)*scale;
      // if this is a regular note, (not grace or tempo indicator) then the stem will have been stretched to the middle line if it is far from the center.
	    if (shouldExtendStem) {
	    	if (dir==="down" && pos > 6)
	    		pos = 6;
	    	if (dir==="up" && pos < 6)
	    		pos = 6;
	    }
      //if (scale===1 && (dir==="down")?(pos>6):(pos<6)) pos=6;
      var xdelta = (dir==="down")?headx:headx+notehead.w-0.6;
      abselem.addRight(new RelativeElement(flag, xdelta, glyphs.getSymbolWidth(flag)*scale, pos, {scalex:scale, scaley: scale}));
    }
	  newDotShiftX = notehead.w+dotshiftx-2+5*dot;
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
         for (var j = 0; j < accidentalSlot.length; j++) {
                 if (pitch - accidentalSlot[j][0] >= 6) {
                         accidentalSlot[j][0] = pitch;
                         accPlace = accidentalSlot[j][1];
                         accSlotFound = true;
                         break;
                 }
         }
         if (accSlotFound === false) {
                 accPlace -= (glyphs.getSymbolWidth(symb)*scale+2);
                 accidentalSlot.push([pitch,accPlace]);
                 accidentalshiftx = (glyphs.getSymbolWidth(symb)*scale+2);
         }
    abselem.addExtra(new RelativeElement(symb, accPlace, glyphs.getSymbolWidth(symb), pitch, {scalex:scale, scaley: scale}));
	  extraLeft = glyphs.getSymbolWidth(symb) / 2; // TODO-PER: We need a little extra width if there is an accidental, but I'm not sure why it isn't the full width of the accidental.
  }

  return { notehead: notehead, accidentalshiftx: accidentalshiftx, dotshiftx: newDotShiftX, extraLeft: extraLeft };

};

	AbstractEngraver.prototype.addSlursAndTies = function(abselem, pitchelem, notehead, voice, dir, isGrace) {
		if (pitchelem.endTie) {
			if (this.ties.length > 0) {
				// If there are multiple open ties, find the one that applies by matching the pitch, if possible.
				var found = false;
				for (var j = 0; j < this.ties.length; j++) {
					if (this.ties[j].anchor1 && this.ties[j].anchor1.pitch === notehead.pitch) {
						this.ties[j].setEndAnchor(notehead);
						this.ties.splice(j, 1);
						found = true;
						break;
					}
				}
				if (!found) {
					this.ties[0].setEndAnchor(notehead);
					this.ties.splice(0, 1);
				}
			}
		}

		var voiceNumber = voice.voicetotal < 2 ? -1 : voice.voicenumber;
		if (pitchelem.startTie) {
			var tie = new TieElem({ anchor1: notehead, force: (this.stemdir==="down" || this.stemdir==="up"), stemDir: this.stemdir, isGrace: isGrace, voiceNumber: voiceNumber});
			if (hint) tie.setHint();

			this.ties[this.ties.length]=tie;
			voice.addOther(tie);
			// HACK-PER: For the animation, we need to know if a note is tied to the next one, so here's a flag.
			// Unfortunately, only some of the notes in the current event might be tied, but this will consider it
			// tied if any one of them is. That will work for most cases.
			abselem.startTie = true;
		}

		if (pitchelem.endSlur) {
			for (var i=0; i<pitchelem.endSlur.length; i++) {
				var slurid = pitchelem.endSlur[i];
				var slur;
				if (this.slurs[slurid]) {
					slur = this.slurs[slurid];
					slur.setEndAnchor(notehead);
					delete this.slurs[slurid];
				} else {
					slur = new TieElem({ anchor2: notehead, stemDir: this.stemdir, voiceNumber: voiceNumber});
					if (hint) slur.setHint();
					voice.addOther(slur);
				}
				if (this.startlimitelem) {
					slur.setStartX(this.startlimitelem);
				}
			}
		} else if (!isGrace) {
			for (var s in this.slurs) {
				if (this.slurs.hasOwnProperty(s)) {
					this.slurs[s].addInternalNote(notehead);
				}
			}
		}

		if (pitchelem.startSlur) {
			for (i=0; i<pitchelem.startSlur.length; i++) {
				var slurid = pitchelem.startSlur[i].label;
				var slur = new TieElem({ anchor1: notehead, stemDir: this.stemdir, voiceNumber: voiceNumber});
				if (hint) slur.setHint();
				this.slurs[slurid]=slur;
				voice.addOther(slur);
			}
		}
	};

AbstractEngraver.prototype.addMeasureNumber = function (number, abselem) {
	var measureNumHeight = this.renderer.getTextSize(number, "measurefont", 'bar-number');
	abselem.addChild(new RelativeElement(number, 0, 0, 11+measureNumHeight.height / spacing.STEP, {type:"barNumber"}));
};

AbstractEngraver.prototype.createBarLine = function (voice, elem, isFirstStaff) {
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
    this.decoration.createDecoration(voice, elem.decoration, 12, (thick)?3:1, abselem, 0, "down", 2, elem.positioning, this.hasVocals);
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

  if (elem.startEnding && isFirstStaff) { // only put the first & second ending marks on the first staff
	  var textWidth = this.renderer.getTextSize(elem.startEnding, "repeatfont", '').width;
	  abselem.minspacing += textWidth + 10; // Give plenty of room for the ending number.
    this.partstartelem = new EndingElem(elem.startEnding, anchor, null);
	  voice.addOther(this.partstartelem);
  }

  // Add a little space to the left of the bar line so that nothing can crowd it.
	abselem.extraw -= 5;

	return abselem;

};


})();

module.exports = AbstractEngraver;
