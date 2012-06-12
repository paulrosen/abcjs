//    abc2abc_write.js: Prints an abc file in text format parsed by abc_parse.js
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

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.transform)
	window.ABCJS.transform = {};


window.ABCJS.transform.TextPrinter = function(elem, reposition) {
    this.elem = elem;
    this.text = "";
    this.l = 1/8;
    this.reposition = reposition || false;
}

window.ABCJS.transform.TextPrinter.prototype.printString = function(str, elem) {
    if (this.reposition && elem) elem.startChar = this.text.length;
    this.text += str;
    if (this.reposition && elem) elem.endChar = this.text.length;
};

window.ABCJS.transform.TextPrinter.prototype.printNewLine = function () {
    this.text += "\n";
};

window.ABCJS.transform.TextPrinter.prototype.printSpace = function () {
    if (this.text[this.text.length-1].match(/\s/)) return; //TODO match whitespace
    this.text += " ";
};

window.ABCJS.transform.TextPrinter.prototype.printABC = function(abctune) {
    this.text = "";
    this.abctune = abctune;
    //TODO formatting
    this.printHeader();
    this.printBody();
    this.elem.value=this.text;
};

window.ABCJS.transform.TextPrinter.prototype.printHeader = function() {
    // much of this info is duplicated in metaTextHEaders in abc_parse_header.js
    this.printHeaderLine("x","X","1");
    this.printHeaderLine("title","T");
    this.printHeaderLine("composer","C");
    this.printHeaderLine("history","H");
    this.printHeaderLine("author","A");
    this.printHeaderLine("book","B");  
    this.printHeaderLine("discography","D");  
    this.printHeaderLine("url","F");
    this.printHeaderLine("group","G");
    this.printHeaderLine("instruction","I");
    this.printHeaderLine("notes","N");
    this.printHeaderLine("origin","O");
    this.printHeaderLine("rhythm","R");
    this.printHeaderLine("source","S");
    this.printHeaderLine("unalignedwords","W");
    this.printHeaderLine("transcription","Z");
    //TODO part order
    //TODO Q tempo
    //TODO textBlock
    this.printHeaderLine("NULL","L","1/8"); //TODO L

    this.printHeaderLine("NULL","M",this.getMeterString(this.abctune.lines[0].staff[0].meter));
    this.printHeaderLine("NULL","K",this.getKeyString(this.abctune.lines[0].staff[0].key));//TODO K
};

window.ABCJS.transform.TextPrinter.prototype.getKeyString = function(key) {
    return key.root+key.acc+key.mode;
};

window.ABCJS.transform.TextPrinter.prototype.getMeterString = function(meter) {
    switch (meter.type) {
    case "cut_time": return "C|";
    case "common_time": return "C";
    case "specified":
      if (meter.value[0].den)
		return meter.value[0].num+"/"+meter.value[0].den;
      else
	    return meter.value[0].num;
    }
    return "";
};

window.ABCJS.transform.TextPrinter.prototype.printHeaderLine = function(fieldname, abcfield, defaut) {
    var val = this.abctune.metaText[fieldname] || defaut;
    if (val !== undefined) {
	var valarray = val.split("\n");
	for (var i=0; i<valarray.length; i++) {
	    this.printString(abcfield+": "+valarray[i]);
	    this.printNewLine();
	} 
    }
};

window.ABCJS.transform.TextPrinter.prototype.getElem = function() {
    if (this.abcline.length <= this.pos)
	return null;
    return this.abcline[this.pos];
};

window.ABCJS.transform.TextPrinter.prototype.getNextElem = function() {
    if (this.abcline.length <= this.pos+1)
	return null;
    return this.abcline[this.pos+1];
};

window.ABCJS.transform.TextPrinter.prototype.printBody = function() {
    for(var line=0; line<this.abctune.lines.length; line++) {
	var abcline = this.abctune.lines[line];
	if (abcline.staff) {
	    this.printABCLine(abcline.staff);
	} else if (abcline.subtitle && line!==0) {
	    //TODO
	} else if (abcline.text) {
	    //TODO
	}
    }
};

window.ABCJS.transform.TextPrinter.prototype.printABCLine = function(staffs) {
    for (this.s = 0; this.s < staffs.length; this.s++) {
	this.printABCStaff(staffs[this.s]);
    }
};

window.ABCJS.transform.TextPrinter.prototype.printABCStaff = function(abcstaff) {
    
    // TODO if (abcstaff.bracket) header += "bracket "+abcstaff.bracket+" ";
    // TODO if (abcstaff.brace) header += "brace "+abcstaff.brace+" ";
    
    
    for (this.v = 0; this.v < abcstaff.voices.length; this.v++) {
	// TODO stuff about voices
	
	// TODO this is where key sig is this.voice.addChild(this.printClef(abcstaff.clef));
	// this.voice.addChild(this.printKeySignature(abcstaff.key));
	// if (abcstaff.meter) this.voice.addChild(this.printTimeSignature(abcstaff.meter));
	this.printABCVoice(abcstaff.voices[this.v]);
    }
    
};

window.ABCJS.transform.TextPrinter.prototype.printABCVoice = function(abcline) {
    this.abcline = abcline;
    for (this.pos=0; this.pos<this.abcline.length; this.pos++) {
	this.printABCElement();
    }
    this.printNewLine();
};

window.ABCJS.transform.TextPrinter.prototype.printABCElement = function() {
    var elem = this.getElem();
    switch (elem.el_type) {
    case "note":
	this.printBeam();
	break;
    case "bar":
	this.printBarLine(elem);
	break;
    case "meter":
	//TODO this.printTimeSignature(elem);
	break;
    case "clef":
	//TODO this.printClef(elem);
	break;
    case "key":
	//TODO this.printKeySignature(elem);
    case "stem":
	//TODO do nothing?
	break;
    case "part":
	//TODO print part
	break;
    default:
	//TODO show we're missing something
    }
};

window.ABCJS.transform.TextPrinter.prototype.printBeam = function() {
    this.printSpace();
    if (this.getElem().startBeam && !this.getElem().endBeam) {
	while (this.getElem()) {
	    this.printNote(this.getElem());
	    if (this.getElem().endBeam) {
		break;
	    }
	    this.pos++;
	}
    } else {
	this.printNote(this.getElem());
    }
    this.printSpace();
};

window.ABCJS.transform.TextPrinter.prototype.printNote = function(elem) {
    var str = "";
	var i;
    if (elem.chord !== undefined) {
	for (i=0; i<elem.chord.length; i++) {
	    str+= '"'+elem.chord[i].name+'"';
	}
    }
    
    //TODO unify map between names and symbols (to be used with abcparse?)
    var decorations = {
	"staccato" : ".",
	"upbow" : "u",
	"downbow" : "v",
	"roll" : "~",
	"fermata" : "H",
	"slide" : "J",
	"accent" : "L",
	"mordent" : "M",
	"pralltriller" : "P",
	"trill" : "T",
	"lower" : "."
    };

    if (elem.decoration !== undefined) {
	for (i=0; i<elem.decoration.length; i++) {
	    var dec = elem.decoration[i];
	    if (decorations[dec]) {
		str+=decorations[dec];
	    } else {
		str+="!"; //TODO hardcoded
		str+=dec;
		str+="!"; //TODO hardcoded
	    }
	}
    }

    if (elem.gracenotes !== undefined) {
	str+="{";
	for (i=0; i<elem.gracenotes.length; i++) {
	    str+=this.getNoteString(elem.gracenotes[i]);
	}
	str+="}";
    }

    var ignoreslur = false;
    if (elem.pitches.length === 1 && elem.pitches[0].startSlur) {
	ignoreslur = true;
	str+=this.multiplyString("(",elem.pitches[0].startSlur.length);
    }

    if (elem.startSlur) {
	str+=this.multiplyString("(",elem.startSlur.length);
    }

    if ((elem.pitches.length === 1 && elem.pitches[0].endSlur) || elem.endSlur) {
	ignoreslur = true;
    }

    if (elem.startTriplet) {
	str+="(3";
    }

    if (elem.pitches) {
	if (elem.pitches.length > 1) str+="[";
	for (i=0; i<elem.pitches.length; i++) {
	    elem.pitches[i].duration = elem.duration;
	    str+=this.getNoteString(elem.pitches[i], ignoreslur);
	}
	if (elem.pitches.length > 1) str+="]";
    } 

    if (elem.pitches.length === 1 && elem.pitches[0].endSlur) {
	str+=this.multiplyString(")",elem.pitches[0].endSlur.length);
    }

    if (elem.endSlur) {
	str+=this.multiplyString(")",elem.endSlur.length);
    }

    this.printString(str,elem);

};

// accidentals, ties and sometimes slurs, sometimes duration
window.ABCJS.transform.TextPrinter.prototype.getNoteString = function(pitchelem, ignoreslur) {
    var str = "";
    if (!ignoreslur && pitchelem.startSlur) {
	str+="(";
    }

    var symb = "";
    switch (pitchelem.accidental) {
    case "quartersharp":
	symb = "^/";
	break;
    case "dblsharp":
	symb = "^^";
	break;
    case "sharp":
	symb = "^";
	break;
    case "quarterflat":
	symb = "_/";
	break;
    case "flat":
	symb = "_";
	break;
    case "dblflat":
	symb = "__";
	break;
    case "natural":
	symb = "=";
    }
    str+=symb;

    var pitches = ["C","D","E","F","G","A","B"];
    var pitchstr = pitches[this.extractNote(pitchelem.pitch)];
    var octave = this.extractOctave(pitchelem.pitch);
    if (octave>0) {
	pitchstr = pitchstr.toLowerCase();
	octave--;
	while (octave>0) {
	    pitchstr+="'";
	    octave--;
	}
    } else {
	while (octave<0) {
	    pitchstr+=",";
	    octave++;
	}
    }
    
    str+=pitchstr;
    
    if (pitchelem.duration) {
	str+=this.getDurationString(pitchelem.duration);
    }

    if (!ignoreslur && pitchelem.endSlur) {
	str+=")";
    }

    if (pitchelem.startTie) {
	str+="-";
    }

    return str;
};

window.ABCJS.transform.TextPrinter.prototype.getDurationString = function(duration) {
    //TODO detect crooked rhythm
    if (duration/this.l > 1) {
	return duration/this.l;
    } 
    var ret = "";
    if (this.l/duration>1) {
	ret+="/";
	if (this.l/duration>2) {
	    ret+=this.l/duration;
	}   
    }
    return ret;
};

window.ABCJS.transform.TextPrinter.prototype.extractNote = function(pitch) {
    var pitch2 = pitch%7;
    if (pitch2<0) pitch2+=7;
    return pitch2;
};

window.ABCJS.transform.TextPrinter.prototype.extractOctave = function(pitch) {
    return Math.floor(pitch/7);
};

window.ABCJS.transform.TextPrinter.prototype.printBarLine = function(elem) {
    var barstr = "";
    switch (elem.type) {
    case "bar_thin": barstr+="|"; break;
    case "bar_thin_thick": barstr+="|]"; break;
    case "bar_thin_thin": barstr+="||"; break;
    case "bar_thick_thin": barstr+="[|"; break;
    case "bar_dbl_repeat": barstr+=":||:"; break;
    case "bar_left_repeat": barstr+="|:"; break;
    case "bar_right_repeat": barstr+=":|"; break;
    case "bar_invisible": barstr+=""; break;
    }
    this.printString(barstr,elem);
};

window.ABCJS.transform.TextPrinter.prototype.multiplyString = function (s, n) {
    var ret = "";
    for (;n>0;n--) ret+=s;
    return ret;
};