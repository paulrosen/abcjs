//#######################################
//# 
//# Written by sk89q <http://sk89q.therisenrealm.com>
//# Copyright 2008 sk89q. All rights reserved.
//# 
//# Redistribution and use in source and binary forms, with or without 
//# modification, are permitted provided that the following conditions 
//# are met:
//# 
//# 1. Redistributions of source code must retain the above 
//#    copyright notice, this list of conditions and the following 
//#    disclaimer.
//# 2. Redistributions in binary form must reproduce the above
//#    copyright notice, this list of conditions and the following 
//#    disclaimer in the documentation and/or other materials provided 
//#    with the distribution.
//# 
//# THIS SOFTWARE IS PROVIDED BY SK89Q "AS IS" AND ANY EXPRESS 
//# OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
//# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//# ARE DISCLAIMED. IN NO EVENT SHALL SK89Q BE LIABLE FOR ANY DIRECT, 
//# INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES 
//# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
//# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
//# HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
//# STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) 
//# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF 
//# ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//#
//######################################

PlayTune = Class.create();

PlayTune.prototype = {
	
	// Store references to the players
	_players : [],
	_playerI : 0,
	
	// For keeping track of the notes to play
	_songLines : [],
	_songLineIndex : 0,
	_isPlaying : false,
	
	initialize: function () {
		var but = $('stopButton');
		if (but)
	    	but.disabled = true;
		but = $('playButton');
		if (but)
		    but.disabled = false;
	},
	

	// Plays a frequency
	_playFreq: function(frequency, seconds) {
		var channels = 1;
		var sampleRate = 4024;
		var bitsPerSample = 16;
		var volume = 32767;
		
	    var data = [];
	    var samples = 0;
	    
	    // Generate the sine waveform
	    for (var i = 0; i < sampleRate * seconds; i++) {
	        for (var c = 0; c < channels; c++) {
	            var v = volume * Math.sin((2 * Math.PI) * (i / sampleRate) * frequency);
	            data.push(pack("v", v));
	            samples++;
	        }
	    }
	    
	    data = data.join('');
	    
	    // Format sub-chunk
	    var chunk1 = [
	        "fmt ", // Sub-chunk identifier
	        pack("V", 16), // Chunk length
	        pack("v", 1), // Audio format (1 is linearr quantization)
	        pack("v", channels),
	        pack("V", sampleRate),
	        pack("V", sampleRate * channels * bitsPerSample / 8), // Byte rate
	        pack("v", channels * bitsPerSample / 8),
	        pack("v", bitsPerSample)
	    ].join('');
	
	    // Data sub-chunk (contains the sound)
	    var chunk2 = [
	        "data", // Sub-chunk identifier
	        pack("V", samples * channels * bitsPerSample / 8), // Chunk length
	        data
	    ].join('');
	    
	    // Header
	    var header = [
	        "RIFF",
	        pack("V", 4 + (8 + chunk1.length) + (8 + chunk2.length)), // Length
	        "WAVE"
	    ].join('');
	
	    var out = [header, chunk1, chunk2].join('');
	    var dataURI = "data:audio/wav;base64," + escape(btoa(out));
	
	    // Append embed player
	    if (this._playerI % 2 == 0) {
	        if (this._players[0] && this._players[0].parentNode) {
	            this._players[0].parentNode.removeChild(this._players[0]);
	        }
	        this._players[0] = document.createElement("embed");
	        this._players[0].setAttribute("src", dataURI);
	        this._players[0].setAttribute("width", 100);
	        this._players[0].setAttribute("height", 70);
	        this._players[0].setAttribute("autostart", true);
	        document.getElementById('players').appendChild(this._players[0]);
	    } else {
	        if (this._players[1] && this._players[1].parentNode) {
	            this._players[1].parentNode.removeChild(this._players[1]);
	        }
	        this._players[1] = document.createElement("embed");
	        this._players[1].setAttribute("src", dataURI);
	        this._players[1].setAttribute("width", 100);
	        this._players[1].setAttribute("height", 70);
	        this._players[1].setAttribute("autostart", true);
	        document.getElementById('players').appendChild(this._players[1]);
	    }
	    this._playerI++;
	},

	play: function(tune, tempo) {
		// The first item is the C 4 octaves below middle C
		var frequencies = [
			 16.35, 17.32, 18.35, 19.45, 20.60, 21.83, 23.12, 24.50, 25.96, 27.5, 29.14, 30.87,
			 32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 49.00, 51.91, 55, 58.27, 61.74, 
			 65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.8, 110, 116.5, 123.5, 
			 130.8, 138.6, 146.8, 155.6, 164.8, 174.6, 185, 196, 207.7, 220, 233.1, 246.9,
			 261.6, 277.2, 293.7, 311.1, 329.6, 349.2, 370, 392, 415.3, 440, 466.2, 493.9, 
			 523.3, 554.4, 587.3, 622.3, 659.3, 698.5, 740, 784, 830.6, 880, 932.3, 987.8, 
			 1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976, 
			 2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951, 
			 4186, 4435, 4699, 4978, 5274, 5588, 5920, 6272, 6645, 7040, 7459, 7902, 
			 8372, 8870, 9397, 9956, 10548, 11175, 11840, 12544, 13290, 14080, 14917, 15804
			];
		
		var ms = 60. / tempo * 1000;
	
		var eighthNoteLen = 250;
		    
	    // Reset
	    this._songLines = [];
	    this._songLineIndex = 0;
	    
	    for (var i = 0; i < tune.length; i++) {
	        var freq = frequencies[tune[i][0]];
			var noteLength = eighthNoteLen*ms*tune[i][1]/1000/500;
	        this._songLines[this._songLines.length] = [freq, noteLength];
	    }
	    
        this._isPlaying = true;
        this._consumeLine(this);
        $('stopButton').disabled = false;
        $('playButton').disabled = true;
	},

	// Stop play
	stop: function() {
	    this._isPlaying = false; // will stop once the note ends
	    $('stopButton').disabled = true;
	},

	// This is triggered at intervals to consume a song line and
	// play it at the proper pace
	_consumeLine: function(This) {
	    // User wants to stop playing or we ran out of song
	    if (!This._isPlaying || This._songLineIndex >= This._songLines.length) {
	        This._isPlaying = false;
		    $('stopButton').disabled = true;
		    $('playButton').disabled = false;
	        return;
	    }
		
	    // Play the note
	    var songLine = This._songLines[This._songLineIndex];
	    This._playFreq(songLine[0], songLine[1]);
	    
	    // Start the next note
	    This._songLineIndex++;
	    setTimeout(function() { This._consumeLine(This); }, songLine[1]*1000);
	},
};

// Base 64 encoding function, for browsers that do not support btoa()
// by Tyler Akins (http://rumkin.com), available in the public domain
if (!window.btoa) {
    function btoa(input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
                     keyStr.charAt(enc3) + keyStr.charAt(enc4);
        } while (i < input.length);

        return output;
    }
}

// pack() emulation (from the PHP version), for binary crunching
function pack(fmt) {
    var output = '';
    
    var argi = 1;
    for (var i = 0; i < fmt.length; i++) {
        var c = fmt.charAt(i);
        var arg = arguments[argi];
        argi++;
        
        switch (c) {
            case "a":
                output += arg[0] + "\0";
                break;
            case "A":
                output += arg[0] + " ";
                break;
            case "C":
            case "c":
                output += String.fromCharCode(arg);
                break;
            case "n":
                output += String.fromCharCode((arg >> 8) & 255, arg & 255);
                break;
            case "v":
                output += String.fromCharCode(arg & 255, (arg >> 8) & 255);
                break;
            case "N":
                output += String.fromCharCode((arg >> 24) & 255, (arg >> 16) & 255, (arg >> 8) & 255, arg & 255);
                break;
            case "V":
                output += String.fromCharCode(arg & 255, (arg >> 8) & 255, (arg >> 16) & 255, (arg >> 24) & 255);
                break;
            case "x":
                argi--;
                output += "\0";
                break;
            default:
                throw new Error("Unknown pack format character '"+c+"'");
        }
    }
    
    return output;
}

