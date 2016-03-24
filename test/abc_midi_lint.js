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

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.test)
	window.ABCJS.test = {};

window.ABCJS.test.midiSequencerLint = function(tune) {
	"use strict";

	var breakSynonyms = [ 'break', '(break)', 'no chord', 'n.c.', 'tacet'];
	var ret = "";
	for (var i = 0; i < tune.length; i++) {
		var voice = tune[i];
		ret += 'Voice ' + (i+1) + ':\n';
		for (var j = 0; j < voice.length; j++) {
			var element = voice[j];
			ret += '\t' + element.el_type + '\n';
			switch (element.el_type) {
				case "note":
					ret += "\t\t";
					ret += 'duration: ' + element.duration + '\n';
					ret += "\t\t";
					if (element.chord) {
						ret += 'chord: ';
						for (var c = 0; c < element.chord.length; c++) {
							if (element.chord[c].position === 'default') {
								ret += element.chord[c].name + ' ';
							} else if (breakSynonyms.indexOf(element.chord[c].name.toLowerCase()) >= 0) {
								ret += element.chord[c].name + ' ';
							}
						}
						ret += "\n\t\t";
					}
					if (element.rest) {
						ret += 'rest: ' + element.rest.type;
					} else {
						if (element.startTriplet)
							ret += 'startTriplet\n\t\t';
						if (element.endTriplet)
							ret += 'endTriplet\n\t\t';
						if (element.gracenotes) {
							ret += 'grace: ';
							for (var g = 0; g < element.gracenotes.length; g++) {
								ret += '(' + element.gracenotes[g].pitch + ',' + element.gracenotes[g].duration + ') ';
							}
							ret += "\n\t\t";
						}
						ret += 'pitch:';
						for (var n = 0; n < element.pitches.length; n++) {
							ret += ' ' + element.pitches[n].pitch;
							if (element.pitches[n].accidental)
								ret += ' ' + element.pitches[n].accidental;
							if (element.pitches[n].startTie)
								ret += ' startTie';
							if (element.pitches[n].endTie)
								ret += ' endTie';
						}
					}
					ret += '\n';
					break;
				case "key":
					ret += "\t\t";
					for (var k = 0; k < element.accidentals.length; k++) {
						ret += '[' + element.accidentals[k].note + ' ' + element.accidentals[k].acc + '] ';
					}
					ret += '\n';
					break;
				case "meter":
					ret += "\t\t";
					ret += element.num + '/' + element.den;
					ret += '\n';
					break;
				case "tempo":
					ret += "\t\t";
					ret += element.qpm;
					ret += '\n';
					break;
				case "transpose":
					ret += "\t\t";
					ret += element.transpose;
					ret += '\n';
					break;
				case "bar":
					break;
				case "bagpipes":
					break;
				case "instrument":
					ret += "\t\t";
					ret += element.program;
					ret += '\n';
					break;
				case "channel":
					ret += "\t\t";
					ret += element.channel;
					ret += '\n';
					break;
				default:
					ret += "Unknown el_type: " + element.el_type + "\n";
					break;
			}
		}
	}
	return ret;
};

window.ABCJS.test.midiLint = function(tune) {
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
