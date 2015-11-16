if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.midi)
	window.ABCJS.midi = {};

(function() {

ABCJS.midi.MidiWriter = function(parent, options) {
  options = options || {};
  this.parent = parent;
  this.scale = [0,2,4,5,7,9,11];
  this.restart = {line:0, staff:0, voice:0, pos:0};
  this.visited = {};
  this.multiplier =1;
  this.next = null;
  this.qpm = options.qpm || 180;
  this.program = options.program || 2;
	this.noteOnAndChannel = "%90";
  this.javamidi = options.type ==="java" || false;
  this.listeners = [];
  this.transpose = 0;	// PER
  if (this.javamidi) {
	  window.ABCJS.javamidi.initializeJava();
  }
  
};

ABCJS.midi.MidiWriter.prototype.addListener = function(listener) {
  this.listeners.push(listener);
};

ABCJS.midi.MidiWriter.prototype.notifySelect = function (abcelem) {
  for (var i=0; i<this.listeners.length;i++) {
    this.listeners[i].notifySelect(abcelem.abselem);
  }
};

ABCJS.midi.MidiWriter.prototype.getMark = function() {
  return {line:this.line, staff:this.staff, 
	  voice:this.voice, pos:this.pos};
};

ABCJS.midi.MidiWriter.prototype.getMarkString = function(mark) {
  mark = mark || this;
  return "line"+mark.line+"staff"+mark.staff+ 
	  "voice"+mark.voice+"pos"+mark.pos;
};

ABCJS.midi.MidiWriter.prototype.goToMark = function(mark) {
  this.line=mark.line;
  this.staff=mark.staff;
  this.voice=mark.voice;
  this.pos=mark.pos;
};

ABCJS.midi.MidiWriter.prototype.markVisited = function() {
  this.lastmark = this.getMarkString();
  this.visited[this.lastmark] = true;
};

ABCJS.midi.MidiWriter.prototype.isVisited = function() {
  if (this.visited[this.getMarkString()]) return true;
  return false;
};

ABCJS.midi.MidiWriter.prototype.setJumpMark = function(mark) {
  this.visited[this.lastmark] = mark;
};

ABCJS.midi.MidiWriter.prototype.getJumpMark = function() {
  return this.visited[this.getMarkString()];
};

ABCJS.midi.MidiWriter.prototype.getLine = function() {
  return this.abctune.lines[this.line];
};

ABCJS.midi.MidiWriter.prototype.getStaff = function() {
  try {
  return this.getLine().staff[this.staff];
  } catch (e) {

  }
};

ABCJS.midi.MidiWriter.prototype.getVoice = function() {
  return this.getStaff().voices[this.voice];
};

ABCJS.midi.MidiWriter.prototype.getElem = function() {
  return this.getVoice()[this.pos];
};

	ABCJS.midi.MidiWriter.prototype.lookAheadToNextNote = function() {
		// look ahead to find the next rest or the next note. This might be on the next line, but it will be on the same staff number and same voice.
		var voice = this.getVoice();
		var pos = this.pos + 1;
		while (voice.length > pos) {
			if (voice[pos].el_type === 'note')
				return voice[pos];
			pos++;
		}
		// If we got this far, then we didn't find a following note. There may be one on the next line.
		var nextLine = this.abctune.lines[this.line+1];
		if (!nextLine || !nextLine.staff)
			return null;
		var nextStaff = nextLine.staff[this.staff];
		if (!nextStaff)
			return null;
		voice = nextStaff[this.voice];
		if (!voice)
			return null;
		pos = 0;
		while (voice.length > pos) {
			if (voice[pos].el_type === 'note')
				return voice[pos];
			pos++;
		}
		return null;
	};

ABCJS.midi.MidiWriter.prototype.writeABC = function(abctune) {
  try {
    this.midi = window.ABCJS.midi.rendererFactory(this.javamidi);
    this.baraccidentals = [];
    this.abctune = abctune;
    this.baseduration = 480*4; // nice and divisible, equals 1 whole note
	  this.bagpipes = abctune.formatting.bagpipes; // If it is bagpipes, then the gracenotes are played on top of the main note.

	  // PER: add global transposition.
	  if (abctune.formatting.midi && abctune.formatting.midi.transpose)
		  this.transpose = abctune.formatting.midi.transpose;

	  // PER: changed format of the global midi commands from the parser. Using the new definition here.
    if (abctune.formatting.midi && abctune.formatting.midi.program && abctune.formatting.midi.program.program) {
      this.midi.setInstrument(abctune.formatting.midi.program.program);
    } else {
      this.midi.setInstrument(this.program);
    }
    if (abctune.formatting.midi && abctune.formatting.midi.channel) {
      this.midi.setChannel(abctune.formatting.midi.channel);
    }

    if (abctune.metaText.tempo) {
      var duration = 1/4;
      if (abctune.metaText.tempo.duration) {
	duration = abctune.metaText.tempo.duration[0];
      }
      var bpm = 60;
      if (abctune.metaText.tempo.bpm) {
	bpm = abctune.metaText.tempo.bpm;
      }
      this.qpm = bpm*duration*4;
    } 
    this.midi.setTempo(this.qpm);
    
    // visit each voice completely in turn
    // "problematic" because it means visiting only one staff+voice for each line each time
    this.staffcount=1; // we'll know the actual number once we enter the code
    for(this.staff=0;this.staff<this.staffcount;this.staff++) {
      this.voicecount=1;
      for(this.voice=0;this.voice<this.voicecount;this.voice++) {
	this.midi.startTrack();
	this.restart = {line:0, staff:this.staff, voice:this.voice, pos:0};
	this.next= null;
	for(this.line=0; this.line<abctune.lines.length; this.line++) {
	  var abcline = abctune.lines[this.line];
	  if (this.getLine().staff) {
	    this.writeABCLine();
	  }
	}
	this.midi.endTrack();
      }
    }
    
    this.midi.embed(this.parent);
  } catch (e) {
    this.parent.innerHTML="Couldn't write midi: "+e;
  }
};

ABCJS.midi.MidiWriter.prototype.writeABCLine = function() {
  this.staffcount = this.getLine().staff.length;
  this.voicecount = this.getStaff().voices.length;
  this.setKeySignature(this.getStaff().key);
  this.writeABCVoiceLine();
};

ABCJS.midi.MidiWriter.prototype.writeABCVoiceLine = function () {
  this.pos=0;
  while (this.pos<this.getVoice().length) {
    this.writeABCElement(this.getElem());
    if (this.next) {
      this.goToMark(this.next);
      this.next = null;
      if (!this.getLine().staff) return;
    } else {
      this.pos++;
    }
  }
};

ABCJS.midi.MidiWriter.prototype.writeABCElement = function(elem) {
  var foo;
  switch (elem.el_type) {
  case "note":
    this.writeNote(elem);
    break;
    
  case "key":
    this.setKeySignature(elem);
    break;
  case "bar":
    this.handleBar(elem);
	  break;
  case "meter":
  case "clef":
    break;
  default:
    
  }
  
};


ABCJS.midi.MidiWriter.prototype.writeNote = function(elem) {

  if (elem.startTriplet) {
	  if (elem.startTriplet === 2)
		  this.multiplier = 3/2;
	  else
	    this.multiplier=(elem.startTriplet-1)/elem.startTriplet;
  }

  var mididuration = elem.duration*this.baseduration*this.multiplier;
  if (elem.pitches) {
    var midipitches = [];
    for (var i=0; i<elem.pitches.length; i++) {
      var note = elem.pitches[i];
      var pitch= note.pitch;
      if (note.accidental) {
	switch(note.accidental) { // change that pitch (not other octaves) for the rest of the bar
	case "sharp": 
	  this.baraccidentals[pitch]=1; break;
	case "flat": 
	  this.baraccidentals[pitch]=-1; break;
	case "natural":
	  this.baraccidentals[pitch]=0; break;
		case "dblsharp":
			this.baraccidentals[pitch]=2; break;
		case "dblflat":
			this.baraccidentals[pitch]=-2; break;
	}
      }
      
      midipitches[i] = 60 + 12*this.extractOctave(pitch)+this.scale[this.extractNote(pitch)];
      
      if (this.baraccidentals[pitch]!==undefined) {
	midipitches[i] += this.baraccidentals[pitch];
      } else { // use normal accidentals
	midipitches[i] += this.accidentals[this.extractNote(pitch)];
      }
    midipitches[i] += this.transpose;	// PER
      
      this.midi.startNote(midipitches[i], 64, elem);

      if (note.startTie) {
	this.tieduration=mididuration;
      } 
    }

	  // if there are grace notes, then also play them.
	  // I'm not sure there is an exact rule for the length of the notes. My rule, unless I find
	  // a better one is: the grace notes cannot take more than 1/2 of the main note's value.
	  // A grace note (of 1/8 note duration) takes 1/8 of the main note's value.
	  // If there are grace notes on the next note, then end this note early.
	  var nextNote = this.lookAheadToNextNote();
	  var graceDuration;
	  if (nextNote && nextNote.gracenotes && nextNote.gracenotes.length > 0) {
		  // shorten this note so that the grace notes can fit in.
		  var numGraces = nextNote.gracenotes.length;
		  graceDuration = numGraces < 4 ? mididuration/8 : mididuration/2 / numGraces;
		  mididuration -= (graceDuration*numGraces);
	  }

    for (i=0; i<elem.pitches.length; i++) {
      var note = elem.pitches[i];
      //var pitch= note.pitch+this.transpose;	// PER
      if (note.startTie) continue; // don't terminate it
      if (note.endTie) {
	this.midi.endNote(midipitches[i],mididuration+this.tieduration);
      } else {
	this.midi.endNote(midipitches[i],mididuration);
      }
      mididuration = 0; // put these to zero as we've moved forward in the midi
      this.tieduration=0;
    }
	  // Do the grace notes now to fill out the time.
	  if (nextNote && nextNote.gracenotes && nextNote.gracenotes.length > 0) {
		  for (var g = 0; g < nextNote.gracenotes.length; g++) {
			  var gn = nextNote.gracenotes[g];
			  var gpitch = 60 + 12*this.extractOctave(gn.pitch+this.transpose)+this.scale[this.extractNote(gn.pitch+this.transpose)];
			  this.midi.startNote(gpitch, 64, elem);
			  this.midi.endNote(gpitch,graceDuration);
		  }
	  }
  } else if (elem.rest && elem.rest.type !== 'spacer') {
    this.midi.addRest(mididuration);
  }

  if (elem.endTriplet) {
    this.multiplier=1;
  }

};

ABCJS.midi.MidiWriter.prototype.handleBar = function (elem) {
  this.baraccidentals = [];
  
  
  var repeat = (elem.type==="bar_right_repeat" || elem.type==="bar_dbl_repeat");
  var skip = (elem.startEnding)?true:false;
  var setvisited = (repeat || skip);
  var setrestart = (elem.type==="bar_left_repeat" || elem.type==="bar_dbl_repeat" || elem.type==="bar_thick_thin" || elem.type==="bar_thin_thick" || elem.type==="bar_thin_thin" || elem.type==="bar_right_repeat");

  var next = null;

  if (this.isVisited()) {
    next = this.getJumpMark();
  } else {

    if (skip || repeat) {
      if (this.visited[this.lastmark] === true) {
	this.setJumpMark(this.getMark());
      }  
    }

    if (setvisited) {
      this.markVisited();
    }

    if (repeat) {
      next = this.restart;
      this.setJumpMark(this.getMark());
    }
  }

  if (setrestart) {
    this.restart = this.getMark();
  }

  if (next && this.getMarkString(next)!==this.getMarkString()) {
    this.next = next;
  }

};

ABCJS.midi.MidiWriter.prototype.setKeySignature = function(elem) {
  this.accidentals = [0,0,0,0,0,0,0];
  if (this.abctune.formatting.bagpipes) {
    elem.accidentals=[{acc: 'natural', note: 'g'}, {acc: 'sharp', note: 'f'}, {acc: 'sharp', note: 'c'}];
  }
  if (!elem.accidentals) return;
	window.ABCJS.parse.each(elem.accidentals, function(acc) {
		var d = (acc.acc === "sharp") ? 1 : (acc.acc === "natural") ?0 : -1;

		var lowercase = acc.note.toLowerCase();
		var note = this.extractNote(lowercase.charCodeAt(0)-'c'.charCodeAt(0));
		this.accidentals[note]+=d;
	  }, this);

};

ABCJS.midi.MidiWriter.prototype.extractNote = function(pitch) {
  pitch = pitch%7;
  if (pitch<0) pitch+=7;
  return pitch;
};

ABCJS.midi.MidiWriter.prototype.extractOctave = function(pitch) {
  return Math.floor(pitch/7);
};
})();
