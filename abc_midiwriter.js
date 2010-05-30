function setAttributes(elm, attrs){
  for(var attr in attrs)
    elm.setAttribute(attr, attrs[attr]);
  return elm;
}


function Midi() {
  this.trackstrings="";
  this.trackcount = 0;
}

Midi.prototype.setTempo = function (qpm) {
  if (this.trackcount==0) {
    this.startTrack();
    this.track+="%00%FF%51%03"+toHex(Math.round(60000000/qpm),6);
    this.endTrack();
  }
}

Midi.prototype.startTrack = function () {
  this.track = "";
  this.silencelength = 0;
  this.trackcount++;
  this.first=true;
  if (this.instrument) {
    this.setInstrument(this.instrument);
  }
};

Midi.prototype.endTrack = function () {
  var tracklength = toHex(this.track.length/3+4,8);
  this.track = "MTrk"+tracklength+ // track header
  this.track +  
  '%00%FF%2F%00'; // track end
  this.trackstrings += this.track;
}

Midi.prototype.setInstrument = function (number) {
  this.track = "%00%C0"+toHex(number,2)+this.track;
  this.instrument=number;
};

Midi.prototype.startNote = function (pitch, loudness) {
  this.track+=toDurationHex(this.silencelength); // only need to shift by amout of silence (if there is any)
  this.silencelength = 0;
  if (this.first) {
    this.first = false;
    this.track+="%90";
  }
  this.track += "%"+pitch.toString(16)+"%"+loudness; //note
};

Midi.prototype.endNote = function (pitch, length) {
  this.track += toDurationHex(length); //duration
  this.track += "%"+pitch.toString(16)+"%00";//end note
};

Midi.prototype.addRest = function (length) {
  this.silencelength += length;
};

Midi.prototype.embed = function(parent) {

  var data="data:audio/midi," + 
  "MThd%00%00%00%06%00%01"+toHex(this.trackcount,4)+"%01%e0"+ // header
  this.trackstrings;

//   var embedContainer = document.createElement("div");
//   embedContainer.className = "embedContainer";
//   document.body.appendChild(embedContainer);
//   embedContainer.innerHTML = '<object id="embed1" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab"><param name="src" value="' + data + '"></param><param name="Autoplay" value="false"></param><embed name="embed1" src="' + data + '" autostart="false" enablejavascript="true" /></object>';
//   embed = document["embed1"];

  
  
  embed = setAttributes(document.createElement('embed'), {
    src : data,
	type : 'video/quicktime',
	controller : 'true',
	autoplay : 'false', 
	loop : 'false',
	enablejavascript: 'true',
	style:'display:block; height: 20px;'
	});
  parent.insertBefore(embed,parent.firstChild);
//   window.setTimeout(function() {
//       embed.Stop();
//       embed.Rewind();
//       embed.Play();

//   }, 200);
};

// s is assumed to be of even length
function encodeHex(s) {
  var ret = "";
  for (var i=0; i<s.length; i+=2) {
    ret += "%"
    ret += s.substr(i,2);
  }
  return ret;
}

function toHex(n, padding) {
  var s = n.toString(16);
  while (s.length<padding) {
    s="0"+s;
  }
  return encodeHex(s);
}

function toDurationHex(n) {
  var res = 0;
  var a = [];

  // cut up into 7 bit chunks;
  while (n!=0) {
    a.push(n & 0x7F);
    n = n>>7;
  }

  // join the 7 bit chunks together, all but last chunk get leading 1
  for (var i=a.length-1;i>=0;i--) {
    res = res << 8;
    var bits = a[i];
    if (i!==0) {
      bits = bits | 0x80;
    }
    res = res | bits;
  }

  var padding = res.toString(16).length;
  padding += padding%2;

  return toHex(res, padding);
}

function ABCMidiWriter(parent, options) {
  var options = options || {};
  this.parent = parent;
  this.scale = [0,2,4,5,7,9,11];
  this.restart = {line:0, staff:0, voice:0, pos:0};
  this.visited = {};
  this.multiplier =1;
  this.next = null;
  this.qpm = options["qpm"] || 180;
  this.program = options["program"] || 2;
};

ABCMidiWriter.prototype.getMark = function() {
  return {line:this.line, staff:this.staff, 
	  voice:this.voice, pos:this.pos};
};

ABCMidiWriter.prototype.getMarkString = function(mark) {
  mark = mark || this;
  return "line"+mark.line+"staff"+mark.staff+ 
	  "voice"+mark.voice+"pos"+mark.pos;
};

ABCMidiWriter.prototype.goToMark = function(mark) {
  this.line=mark.line;
  this.staff=mark.staff;
  this.voice=mark.voice;
  this.pos=mark.pos;
};

ABCMidiWriter.prototype.markVisited = function() {
  this.lastmark = this.getMarkString();
  this.visited[this.lastmark] = true;
};

ABCMidiWriter.prototype.isVisited = function() {
  if (this.visited[this.getMarkString()]) return true;
  return false;
};

ABCMidiWriter.prototype.setJumpMark = function(mark) {
  this.visited[this.lastmark] = mark;
};

ABCMidiWriter.prototype.getJumpMark = function() {
  return this.visited[this.getMarkString()];
};

ABCMidiWriter.prototype.getLine = function() {
  return this.abctune.lines[this.line];
};

ABCMidiWriter.prototype.getStaff = function() {
  try {
  return this.getLine().staff[this.staff];
  } catch (e) {

  }
};

ABCMidiWriter.prototype.getVoice = function() {
  return this.getStaff().voices[this.voice];
};

ABCMidiWriter.prototype.getElem = function() {
  return this.getVoice()[this.pos];
};

ABCMidiWriter.prototype.writeABC = function(abctune) {
  try {
  this.midi = new Midi();
  this.baraccidentals = [];
  this.abctune = abctune;
  this.baseduration = 480*4; // nice and divisible

  if (abctune.formatting.midi) {
    this.midi.setInstrument(Number(abctune.formatting.midi.substring(8)));
  } else {
    this.midi.setInstrument(this.program);
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

ABCMidiWriter.prototype.writeABCLine = function() {
  this.staffcount = this.getLine().staff.length;
  this.voicecount = this.getStaff().voices.length;
  this.setKeySignature(this.getStaff().key);
  this.writeABCVoiceLine();
};

ABCMidiWriter.prototype.writeABCVoiceLine = function () {
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

ABCMidiWriter.prototype.writeABCElement = function(elem) {
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
  case "meter":
    
  case "clef":
  default: 
    
  }
  
};


ABCMidiWriter.prototype.writeNote = function(elem) {

  if (elem.startTriplet) {
    this.multiplier=2/3;
  }

  var mididuration = elem.duration*this.baseduration*this.multiplier;
  if (elem.pitches) {
    var midipitches = [];
    for (var i=0; i<elem.pitches.length; i++) {
      var note = elem.pitches[i];
      var pitch= note.pitch;
      if (note.accidental) {
	switch(note.accidental) {
	case "sharp": 
	  this.baraccidentals[pitch]=1; break;
	case "flat": 
	  this.baraccidentals[pitch]=-1; break;
	case "nat":
	  this.baraccidentals[pitch]=0; break;
	}
      }
      
      midipitches[i] = 60 + 12*this.extractOctave(pitch)+this.scale[this.extractNote(pitch)];
      
      if (this.baraccidentals[pitch]!==undefined) {
	midipitches[i] += this.baraccidentals[pitch];
      } else { // use normal accidentals
	midipitches[i] += this.accidentals[this.extractNote(pitch)];
      }
      
      this.midi.startNote(midipitches[i],64);

      if (note.startTie) {
	this.tieduration=mididuration;
      } 
    }

    for (i=0; i<elem.pitches.length; i++) {
      var note = elem.pitches[i];
      var pitch= note.pitch;
      if (note.startTie) continue; // don't terminate it
      if (note.endTie) {
	this.midi.endNote(midipitches[i],mididuration+this.tieduration);
      } else {
	this.midi.endNote(midipitches[i],mididuration)
      }
      mididuration = 0; // put these to zero as we've moved forward in the midi
      this.tieduration=0;
    }
  } else {
    this.midi.addRest(mididuration);
  }

  if (elem.endTriplet) {
    this.multiplier=1;
  }

};

ABCMidiWriter.prototype.handleBar = function (elem) {
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

}

ABCMidiWriter.prototype.setKeySignature = function(elem) {
  this.accidentals = [0,0,0,0,0,0,0];
  if (this.abctune.formatting.bagpipes) {
    elem.accidentals=[{acc: 'natural', note: 'g'}, {acc: 'sharp', note: 'f'}, {acc: 'sharp', note: 'c'}];
  }
  if (!elem.accidentals) return;
  elem.accidentals.each(function(acc) {
		var d = (acc.acc === "sharp") ? 1 : (acc.acc === "natural") ?0 : -1;

		var lowercase = acc.note.toLowerCase();
		var note = this.extractNote(lowercase.charCodeAt(0)-'c'.charCodeAt(0));
		this.accidentals[note]+=d;
	  }, this);

};

ABCMidiWriter.prototype.extractNote = function(pitch) {
  var pitch = pitch%7;
  if (pitch<0) pitch+=7;
  return pitch;
};

ABCMidiWriter.prototype.extractOctave = function(pitch) {
  return Math.floor(pitch/7);
};
