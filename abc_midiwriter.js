function setAttributes(elm, attrs){
  for(var attr in attrs)
    elm.setAttribute(attr, attrs[attr]);
  return elm;
}


function Midi() {
  this.tracks=[];
  this.track = "%00%90";
  this.first = true;
}

// length as a log value, 1 is shortest
Midi.prototype.addNote = function (pitch, loudness, length) {
  if (this.first) {
    this.first = false;
  } else {
    this.track+= "%00"; // already at the right position;
  }
  this.track += "%"+pitch.toString(16)+"%"+loudness; //note
  this.track += "%8"+length+"%00" //duration
  this.track += "%"+pitch.toString(16)+"%00";//end note
};

Midi.prototype.play = function() {
  var tracklength = toHex(this.track.length/3+4,4);
  var data="data:audio/midi," + 
  "MThd%00%00%00%06%00%01%00%01%00%C0"+
  "MTrk%00%00%"+tracklength.substr(0,2)+"%" + tracklength.substr(2,2) +
  this.track + 
  '%00%FF%2F%00';

//   var embedContainer = document.createElement("div");
//   embedContainer.className = "embedContainer";
//   document.body.appendChild(embedContainer);
//   embedContainer.innerHTML = '<object id="embed1" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" codebase="http://www.apple.com/qtactivex/qtplugin.cab"><param name="src" value="' + data + '"></param><param name="Autoplay" value="false"></param><embed name="embed1" src="' + data + '" autostart="false" enablejavascript="true" /></object>';
//   embed = document["embed1"];

  

  embed = setAttributes(document.createElement('embed'), {
      src : data,
	  type : 'video/quicktime',
	  controller : 'false',
	  autoplay : 'true', 
	  loop : 'false',
	  width : '1px',
	  height : '1px',
	  enablejavascript: 'true' 
	});
  document.body.appendChild(embed);
//   window.setTimeout(function() {
//       embed.Stop();
//       embed.Rewind();
//       embed.Play();

//   }, 200);
};

function toHex(n, padding) {
  var s = n.toString(16);
  while (s.length<padding) {
    s="0"+s;
  }
  return s;
}


function ABCMidiWriter() {

};

ABCMidiWriter.prototype.writeABC = function(abctune) {
  this.midi = new Midi();

  for(var line=0; line<abctune.lines.length; line++) {
    var abcline = abctune.lines[line];
    if (abcline.staff) {
      this.writeABCLine(abcline.staff);
    }
  }
  this.midi.play();
};

ABCMidiWriter.prototype.writeABCLine = function(staffs) {
  this.setKeySignature(staffs[0].key);
  this.writeABCVoiceLine(staffs[0].voices[0]);
};

ABCMidiWriter.prototype.writeABCVoiceLine = function (abcline) {
  for (this.pos=0; this.pos<abcline.length; this.pos++) {
    this.writeABCElement(abcline[this.pos]);
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
    
  case "meter":
    
  case "clef":
  default: 
    
  }
  
};


ABCMidiWriter.prototype.writeNote = function(elem) {
  var note = elem.pitches[0];
  var pitch= note.pitch;
  var midipitch = 60 + 12*this.extractOctave(pitch)+this.scale[this.extractNote(pitch)];
  if (note.accidental) {
    switch(note.accidental) {
    case "sharp": midipitch++; break;
    case "flat": midipitch--; break;
    }
  }
  var mididuration = elem.duration*8;
  this.midi.addNote(midipitch,64,mididuration);

};


ABCMidiWriter.prototype.setKeySignature = function(elem) {
  this.scale = [0,2,4,5,7,9,11];
  if (!elem.extraAccidentals) return;
  elem.extraAccidentals.each(function(acc) {
		var d = (acc.acc === "sharp") ? 1 : (acc.acc === "natural") ?0 : -1;
		var note = this.extractNote(acc.note.charCodeAt(0)-'c'.charCodeAt(0));
		this.scale[note]+=d;
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
