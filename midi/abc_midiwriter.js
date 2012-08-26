/*global window, document, setTimeout */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.midi)
	window.ABCJS.midi = {};

(function() {
function setAttributes(elm, attrs){
  for(var attr in attrs)
    if (attrs.hasOwnProperty(attr))
      elm.setAttribute(attr, attrs[attr]);
  return elm;
}

//TODO-PER: put this back in when the MIDIPlugin works again.
//window.oldunload = window.onbeforeunload;
//window.onbeforeunload = function() {
//    if (window.oldunload)
//        window.oldunload();
//  if (typeof(MIDIPlugin) !== "undefined" && MIDIPlugin) { // PER: take care of crash in IE 8
//    MIDIPlugin.closePlugin();
//  }
//};


function MidiProxy(javamidi,qtmidi) {
  this.javamidi = javamidi;
  this.qtmidi = qtmidi;
}

MidiProxy.prototype.setTempo = function (qpm) {
  this.javamidi.setTempo(qpm);
  this.qtmidi.setTempo(qpm);
};

MidiProxy.prototype.startTrack = function () {
  this.javamidi.startTrack();
  this.qtmidi.startTrack();
};

MidiProxy.prototype.endTrack = function () {
  this.javamidi.endTrack();
  this.qtmidi.endTrack();
};

MidiProxy.prototype.setInstrument = function (number) {
  this.javamidi.setInstrument(number);
  this.qtmidi.setInstrument(number);
};

MidiProxy.prototype.startNote = function (pitch, loudness, abcelem) {
  this.javamidi.startNote(pitch, loudness, abcelem);
  this.qtmidi.startNote(pitch, loudness, abcelem);
};

MidiProxy.prototype.endNote = function (pitch, length) {
  this.javamidi.endNote(pitch, length);
  this.qtmidi.endNote(pitch, length);
};

MidiProxy.prototype.addRest = function (length) {
  this.javamidi.addRest(length);
  this.qtmidi.addRest(length);
};

MidiProxy.prototype.embed = function(parent) {
  this.javamidi.embed(parent);
  this.qtmidi.embed(parent,true);
};

function JavaMidi(midiwriter) {
  this.playlist = []; // contains {time:t,funct:f} pairs
  this.trackcount = 0;
  this.timecount = 0;
  this.tempo = 60;
  this.midiapi = MIDIPlugin;
  this.midiwriter = midiwriter;
	this.noteOnAndChannel = "%90";
}

JavaMidi.prototype.setTempo = function (qpm) {
  this.tempo = qpm;
};

JavaMidi.prototype.startTrack = function () {
  this.silencelength = 0;
  this.trackcount++;
  this.timecount=0;
  this.playlistpos=0;
  this.first=true;
  if (this.instrument) {
    this.setInstrument(this.instrument);
  }
	if (this.channel) {
	  this.setChannel(this.channel);
	}
};

JavaMidi.prototype.endTrack = function () {
  // need to do anything?
};

JavaMidi.prototype.setInstrument = function (number) {
  this.instrument=number;
  this.midiapi.setInstrument(number);
  //TODO push this into the playlist?
};

JavaMidi.prototype.setChannel = function (number) {
  this.channel=number;
  this.midiapi.setChannel(number);
};

JavaMidi.prototype.updatePos = function() {
  while(this.playlist[this.playlistpos] && 
	this.playlist[this.playlistpos].time<this.timecount) {
    this.playlistpos++;
  }
};

JavaMidi.prototype.startNote = function (pitch, loudness, abcelem) {
  this.timecount+=this.silencelength;
  this.silencelength = 0;
  if (this.first) {
    //nothing special if first?
  }
  this.updatePos();
  var self=this;
  this.playlist.splice(this.playlistpos,0, {   
    time:this.timecount,
	funct:function() {
	self.midiapi.playNote(pitch);
	self.midiwriter.notifySelect(abcelem);
      }
    });
};

JavaMidi.prototype.endNote = function (pitch, length) {
  this.timecount+=length;
  this.updatePos();
  var self=this;
  this.playlist.splice(this.playlistpos, 0, {   
    time:this.timecount,
	funct:	function() {
	self.midiapi.stopNote(pitch);
      }
    });
};

JavaMidi.prototype.addRest = function (length) {
  this.silencelength += length;
};

JavaMidi.prototype.embed = function(parent) {

  
  this.playlink = setAttributes(document.createElement('a'), {
    style: "border:1px solid black; margin:3px;"
    });  
  this.playlink.innerHTML = "play";
  var self = this;
  this.playlink.onmousedown = function() {
    if (self.playing) {
      this.innerHTML = "play";
      self.pausePlay();
    } else {
      this.innerHTML = "pause";
      self.startPlay();
    }
  };
  parent.appendChild(this.playlink);

  var stoplink = setAttributes(document.createElement('a'), {
    style: "border:1px solid black; margin:3px;"
    });  
  stoplink.innerHTML = "stop";
  //var self = this;
  stoplink.onmousedown = function() {
    self.stopPlay(); 
  };
  parent.appendChild(stoplink);
  this.i=0;
  this.currenttime=0;
  this.playing = false;
};

JavaMidi.prototype.stopPlay = function() {
  this.i=0;
  this.currenttime=0;
  this.pausePlay();
  this.playlink.innerHTML = "play";
};

JavaMidi.prototype.startPlay = function() {
  this.playing = true;
  var self = this;
  // repeat every 16th note TODO see the min in the piece
  this.ticksperinterval = 480/4;
  this.doPlay();
  this.playinterval = window.setInterval(function() {self.doPlay(); },
					 (60000/(this.tempo*4)));
};

JavaMidi.prototype.pausePlay = function() {
  this.playing = false;
  window.clearInterval(this.playinterval);
  this.midiapi.stopAllNotes();
};

JavaMidi.prototype.doPlay = function() {
  while(this.playlist[this.i] && 
	this.playlist[this.i].time <= this.currenttime) {
    this.playlist[this.i].funct();
    this.i++;
  } 
  if (this.playlist[this.i]) {
    this.currenttime+=this.ticksperinterval;
  } else {
    this.stopPlay();
  }
};

function Midi() {
  this.trackstrings="";
  this.trackcount = 0;
	this.noteOnAndChannel = "%90";
}

Midi.prototype.setTempo = function (qpm) {
  if (this.trackcount===0) {
    this.startTrack();
    this.track+="%00%FF%51%03"+toHex(Math.round(60000000/qpm),6);
    this.endTrack();
  }
};

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
};

Midi.prototype.setInstrument = function (number) {
	if (this.track)
	  this.track = "%00%C0"+toHex(number,2)+this.track;
	else
		this.track = "%00%C0"+toHex(number,2);
  this.instrument=number;
};

Midi.prototype.setChannel = function (number) {
	this.channel=number - 1;
	this.noteOnAndChannel = "%9" + this.channel.toString(16);
};

Midi.prototype.startNote = function (pitch, loudness) {
  this.track+=toDurationHex(this.silencelength); // only need to shift by amount of silence (if there is any)
  this.silencelength = 0;
  if (this.first) {
    this.first = false;
    this.track+=this.noteOnAndChannel;
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

Midi.prototype.embed = function(parent, noplayer) {

  var data="data:audio/midi," + 
  "MThd%00%00%00%06%00%01"+toHex(this.trackcount,4)+"%01%e0"+ // header
  this.trackstrings;

//   var embedContainer = document.createElement("div");
//   embedContainer.className = "embedContainer";
//   document.body.appendChild(embedContainer);
//   embedContainer.innerHTML = '<object id="embed1" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab"><param name="src" value="' + data + '"></param><param name="Autoplay" value="false"></param><embed name="embed1" src="' + data + '" autostart="false" enablejavascript="true" /></object>';
//   embed = document["embed1"];

  
  var link = setAttributes(document.createElement('a'), {
    href: data
    });  
  link.innerHTML = "download midi";
  parent.insertBefore(link,parent.firstChild);

  if (noplayer) return;

  var embed = setAttributes(document.createElement('embed'), {
    src : data,
	type : 'video/quicktime',
	controller : 'true',
	autoplay : 'false', 
	loop : 'false',
	enablejavascript: 'true',
	style:'display:block; height: 20px;'
	});
  parent.insertBefore(embed,parent.firstChild);
};

// s is assumed to be of even length
function encodeHex(s) {
  var ret = "";
  for (var i=0; i<s.length; i+=2) {
    ret += "%";
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
  while (n!==0) {
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
    MIDIPlugin = document.MIDIPlugin;
    setTimeout(function() { // run on next event loop (once MIDIPlugin is loaded)
	try { // activate MIDIPlugin
	  MIDIPlugin.openPlugin();
       
	} catch(e) { // plugin not supported (download externals)
	  var a = document.createElement("a");
	  a.href = "http://java.sun.com/products/java-media/sound/soundbanks.html";
	  a.target = "_blank";
	  a.appendChild(document.createTextNode("Download Soundbank"));
	  parent.appendChild(a);
	}
      }, 0);
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

ABCJS.midi.MidiWriter.prototype.writeABC = function(abctune) {
  try {
    this.midi = (this.javamidi) ? new MidiProxy(new JavaMidi(this), new Midi()) : new Midi();
    this.baraccidentals = [];
    this.abctune = abctune;
    this.baseduration = 480*4; // nice and divisible, equals 1 whole note

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

    for (i=0; i<elem.pitches.length; i++) {
      var note = elem.pitches[i];
      var pitch= note.pitch+this.transpose;	// PER
      if (note.startTie) continue; // don't terminate it
      if (note.endTie) {
	this.midi.endNote(midipitches[i],mididuration+this.tieduration);
      } else {
	this.midi.endNote(midipitches[i],mididuration);
      }
      mididuration = 0; // put these to zero as we've moved forward in the midi
      this.tieduration=0;
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
