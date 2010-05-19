function setAttributes(elm, attrs){
  for(var attr in attrs)
    elm.setAttribute(attr, attrs[attr]);
  return elm;
}


function Midi() {
  this.tracks=[];
  this.track = "%00%90";
  this.first = true;
  this.silencelength = "%00";
}

Midi.prototype.setInstrument = function (number) {
  this.track = "%00%C0"+toHex(number,2)+this.track;
}

// length as a log value, 1 is shortest
Midi.prototype.addNote = function (pitch, loudness, length) {
  this.startNote(pitch,loudness);
  this.endNote(pitch,length);
};

Midi.prototype.startNote = function (pitch, loudness) {
  if (this.first) {
    this.first = false;
  } else {
    this.track+=this.silencelength; // only need to shift by amout of silence
    this.silencelength = "%00";
  }
  this.track += "%"+pitch.toString(16)+"%"+loudness; //note
};

Midi.prototype.endNote = function (pitch, length) {
  this.track += toDurationHex(length); //duration
  this.track += "%"+pitch.toString(16)+"%00";//end note
};

Midi.prototype.addRest = function (length) {
  this.silencelength = toDurationHex(length);
};

Midi.prototype.embed = function(parent) {
  var tracklength = toHex(this.track.length/3+4,8);
  var data="data:audio/midi," + 
  "MThd%00%00%00%06%00%01%00%01%00%C0"+ // header
  "MTrk"+tracklength+ // track header
  this.track +  
  '%00%FF%2F%00'; // track end

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
  this.baseduration = 384;

  if (abctune.formatting.midi) {
    this.midi.setInstrument(Number(abctune.formatting.midi.substring(8)));
  } else {
    this.midi.setInstrument(this.program);
  }

  var wholeduration = (60/this.qpm)*4;
  if (abctune.metaText.tempo) {
    var duration = 1/4;
    if (abctune.metaText.tempo.duration) {
      duration = abctune.metaText.tempo.duration[0];
    }
    var bpm = 60;
    if (abctune.metaText.tempo.bpm) {
      bpm = abctune.metaText.tempo.bpm;
    }
    var wholeduration = (60/bpm)/duration;
    
  } 
  this.baseduration = this.baseduration*wholeduration;
  for(this.line=0; this.line<abctune.lines.length; this.line++) {
    var abcline = abctune.lines[this.line];
    if (this.getLine().staff) {
      this.writeABCLine();
    }
  }
  this.midi.embed(this.parent);
  } catch (e) {
    this.parent.innerHTML="Couldn't write midi: "+e;
  }
};

ABCMidiWriter.prototype.writeABCLine = function() {
  this.staff=0;
  this.voice=0;
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
    var note = elem.pitches[0];
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

    var midipitch = 60 + 12*this.extractOctave(pitch)+this.scale[this.extractNote(pitch)];

    if (this.baraccidentals[pitch]!==undefined) {
      midipitch += this.baraccidentals[pitch];
    } else { // use normal accidentals
      midipitch += this.accidentals[this.extractNote(pitch)]
    }
    
    if (note.startTie) {
      this.midi.startNote(midipitch,64);
      this.tieduration=mididuration;
    } else if (note.endTie) {
      this.midi.endNote(midipitch,mididuration+this.tieduration);
      this.tieduration=0;
    } else {
      this.midi.addNote(midipitch,64,mididuration);
    }
  } else {
    this.midi.addRest(mididuration);
  }

  if (elem.startTriplet) {
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
