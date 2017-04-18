//    abc_vertical_lint.js: Analyzes the vertical position of the output object.
//    Copyright (C) 2015-2016 Paul Rosen (paul at paulrosen dot net)
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

//This file takes as input the output structure of the writing routine and lists the vertical position of all the elements.

/*globals toString */

var midiLint = function(tune) {
	"use strict";

	var ret = "Tempo: " + tune.tempo + "\nInstrument: " + tune.instrument + "\nChannel: " + tune.channel + "\n";
	for (var i = 0; i < tune.tracks.length; i++) {
		ret += "Track " + (i+1) + "\n";
		for (var j = 0; j < tune.tracks[i].length; j++) {
			var event = tune.tracks[i][j];
			switch (event.cmd) {
				case 'instrument':
					ret += "\tInstrument: " + event.instrument + "\n";
					break;
				case 'channel':
					ret += "\tChannel: " + event.channel + "\n";
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