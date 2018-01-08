//    abc_vertical_lint.js: Analyzes the vertical position of the output object.
//    Copyright (C) 2015-2018 Paul Rosen (paul at paulrosen dot net)
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

//This file takes as input the output structure of the writing routine and lists the vertical position of all the elements.

/*globals toString */

var midiLint = function(tune) {
	"use strict";

	var ret = "Tempo: " + tune.tempo + "\nInstrument: " + tune.instrument + "\n";
	for (var i = 0; i < tune.tracks.length; i++) {
		ret += "Track " + (i+1) + "\n";
		for (var j = 0; j < tune.tracks[i].length; j++) {
			var event = tune.tracks[i][j];
			switch (event.cmd) {
				case 'program':
					ret += "\tProgram: ch=" + event.channel + " inst=" + event.instrument + "\n";
					break;
				case 'start':
					ret += "\tStart: " + event.pitch + " Volume: " + event.volume + "\n";
					break;
				case 'stop':
					ret += "\tStop: " + event.pitch + "\n";
					break;
				case 'move':
					ret += "\tMove: " + event.duration + "\n";
					break;
				default:
					ret += "\tUnknown: " + event.cmd + "\n";
			}
		}
	}
	return ret;
};

module.exports = midiLint;