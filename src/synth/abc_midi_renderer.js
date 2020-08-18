//    abc_midi_renderer.js: Create the actual format for the midi.
//    Copyright (C) 2010-2020 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

var rendererFactory;

(function() {
	"use strict";
	function setAttributes(elm, attrs) {
		for (var attr in attrs)
			if (attrs.hasOwnProperty(attr))
				elm.setAttribute(attr, attrs[attr]);
		return elm;
	}

	function Midi() {
		this.trackstrings = "";
		this.trackcount = 0;
		this.noteOnAndChannel = "%90";
		this.noteOffAndChannel = "%80";
	}

	Midi.prototype.setTempo = function(qpm) {
		if (this.trackcount === 0) {
			this.startTrack();
			this.track += "%00%FF%51%03" + toHex(Math.round(60000000 / qpm), 6);
			this.endTrack();
		}
	};

	Midi.prototype.setGlobalInfo = function(qpm, name, key, time) {
		if (this.trackcount === 0) {
			this.startTrack();
			var divisions = Math.round(60000000 / qpm);
			this.track += "%00%FF%51%03" + toHex(divisions, 6);

			if (key)
				this.track += keySignature(key);
			if (time)
				this.track += timeSignature(time);
			if (name) {
				this.track += encodeString(name, "%01");
			}
			this.endTrack();
		}
	};

	Midi.prototype.startTrack = function() {
		this.track = "";
		this.trackName = "";
		this.trackInstrument = "";
		this.silencelength = 0;
		this.trackcount++;
		if (this.instrument) {
			this.setInstrument(this.instrument);
		}
	};

	Midi.prototype.endTrack = function() {
		this.track = this.trackName + this.trackInstrument + this.track;
		var tracklength = toHex(this.track.length / 3 + 4, 8);
		this.track = "MTrk" + tracklength + // track header
			this.track +
			'%00%FF%2F%00'; // track end
		this.trackstrings += this.track;
	};

	Midi.prototype.setText = function(type, text) {
		// MIDI defines the following types of events:
		//FF 01 len text Text Event
		//FF 02 len text Copyright Notice
		//FF 03 len text Sequence/Track Name
		//FF 04 len text Instrument Name
		//FF 05 len text Lyric
		//FF 06 len text Marker
		//FF 07 len text Cue Point
		switch(type) {
			case 'name':
				this.trackName = encodeString(text, "%03");
				break;
		}
	};

	Midi.prototype.setInstrument = function(number) {
		this.trackInstrument = "%00%C0" + toHex(number, 2);
		this.instrument = number;
	};

	Midi.prototype.setChannel = function(number) {
		this.channel = number;
		this.noteOnAndChannel = "%9" + this.channel.toString(16);
		this.noteOffAndChannel = "%8" + this.channel.toString(16);
	};

	Midi.prototype.startNote = function(pitch, loudness) {
		this.track += toDurationHex(this.silencelength); // only need to shift by amount of silence (if there is any)
		this.silencelength = 0;
		this.track += this.noteOnAndChannel;
		this.track += "%" + pitch.toString(16) + toHex(loudness, 2); //note
	};

	Midi.prototype.endNote = function(pitch) {
		this.track += toDurationHex(this.silencelength); // only need to shift by amount of silence (if there is any)
		this.silencelength = 0;
//		this.track += toDurationHex(length); //duration
		this.track += this.noteOffAndChannel;
		this.track += "%" + pitch.toString(16) + "%00";//end note
	};

	Midi.prototype.addRest = function(length) {
		this.silencelength += length;
		if (this.silencelength < 0)
			this.silencelength = 0;
	};

	Midi.prototype.getData = function() {
		return "data:audio/midi," +
			"MThd%00%00%00%06%00%01" + toHex(this.trackcount, 4) + "%01%e0" + // header
			this.trackstrings;
	};

	Midi.prototype.embed = function(parent, noplayer) {

		var data = this.getData();

		var link = setAttributes(document.createElement('a'), {
			href: data
		});
		link.innerHTML = "download midi";
		parent.insertBefore(link, parent.firstChild);

		if (noplayer) return;

		var embed = setAttributes(document.createElement('embed'), {
			src: data,
			type: 'video/quicktime',
			controller: 'true',
			autoplay: 'false',
			loop: 'false',
			enablejavascript: 'true',
			style: 'display:block; height: 20px;'
		});
		parent.insertBefore(embed, parent.firstChild);
	};

	function encodeString(str, cmdType) {
		// If there are multi-byte chars, we don't know how long the string will be until we create it.
		var nameArray = "";
		for (var i = 0; i < str.length; i++)
			nameArray += toHex(str.charCodeAt(i), 2);
		return "%00%FF" + cmdType + toHex(nameArray.length/3, 2) + nameArray; // Each byte is represented by three chars "%XX", so divide by 3 to get the length.
	}

	function keySignature(key) {
		//00 FF 5902 03 00 - key signature
		if (!key || !key.accidentals)
			return "";
		var hex = "%00%FF%59%02";
		var sharpCount = 0;
		var flatCount = 256;
		for (var i = 0; i < key.accidentals.length; i++) {
			if (key.accidentals[i].acc === "sharp") sharpCount++;
			else if (key.accidentals[i].acc === "flat") flatCount--;
		}
		var sig = flatCount !== 256 ? toHex(flatCount, 2) : toHex(sharpCount, 2);
		var mode = (key.mode === "m") ? "%01" : "%00";
		return hex + sig + mode;
	}

	function timeSignature(time) {
		//00 FF 58 04 04 02 30 08 - time signature
		var hex = "%00%FF%58%04" + toHex(time.num,2);
		var dens = { 1: 0, 2: 1, 4: 2, 8: 3, 16: 4, 32: 5 };
		var den = dens[time.den];
		if (!den)
			return ""; // the denominator is not supported, so just don't include this.
		hex += toHex(den, 2);

		var clocks;
		switch (time.num+"/"+time.den) {
			case "2/4":
			case "3/4":
			case "4/4":
			case "5/4":
				clocks = 24;
				break;
			case "6/4":
				clocks = 72;
				break;
			case "2/2":
			case "3/2":
			case "4/2":
				clocks = 48;
				break;
			case "3/8":
			case "6/8":
			case "9/8":
			case "12/8":
				clocks = 36;
				break;
		}
		if (!clocks)
			return ""; // time sig is not supported.
		hex += toHex(clocks, 2);
		return hex + "%08";
	}

	// s is assumed to be of even length
	function encodeHex(s) {
		var ret = "";
		for (var i = 0; i < s.length; i += 2) {
			ret += "%";
			ret += s.substr(i, 2);
		}
		return ret;
	}

	function toHex(n, padding) {
		var s = n.toString(16);
		while (s.length < padding) {
			s = "0" + s;
		}
		return encodeHex(s);
	}

	function toDurationHex(n) {
		var res = 0;
		var a = [];

		// cut up into 7 bit chunks;
		n = Math.round(n);
		while (n !== 0) {
			a.push(n & 0x7F);
			n = n >> 7;
		}

		// join the 7 bit chunks together, all but last chunk get leading 1
		for (var i = a.length - 1; i >= 0; i--) {
			res = res << 8;
			var bits = a[i];
			if (i !== 0) {
				bits = bits | 0x80;
			}
			res = res | bits;
		}

		var padding = res.toString(16).length;
		padding += padding % 2;

		return toHex(res, padding);
	}

	rendererFactory = function() {
		return new Midi();
	};
})();

export default rendererFactory;
