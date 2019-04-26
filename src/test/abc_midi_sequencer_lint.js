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

var midiSequencerLint = function(tune) {
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
							if (element.pitches[n].midipitch)
								ret += ' ' + element.pitches[n].midipitch + ' (midi)';
							else {
								ret += ' ' + element.pitches[n].pitch;
								if (element.pitches[n].accidental)
									ret += ' ' + element.pitches[n].accidental;
							}
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
				case "gchord":
					ret += "\t\t";
					ret += element.tacet ? 'tacet' : 'on';
					ret += '\n';
					break;
				case "beat":
					ret += "\t\t";
					ret += element.beats.join(",");
					ret += '\n';
					break;
				case "drum":
					var params = element.params;
					ret += "\t\t";
					ret += "[" + params.pattern.join(" ") + "] bars=" + params.bars + " intro=" + params.intro + " on=" + params.on;
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

module.exports = midiSequencerLint;