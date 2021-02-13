//    abc_vertical_lint.js: Analyzes the vertical position of the output object.

//This file takes as input the output structure of the writing routine and lists the vertical position of all the elements.

var pitchToNoteName = require('../synth/pitch-to-note-name');

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
				case 'note':
					ret += "\tNote: pitch=" + pitchToNoteName[event.pitch] + " (" + event.pitch + ") start=" + event.start + " dur=" + event.duration + " gap=" + event.gap + " vol=" + event.volume + " inst=" + event.instrument + "\n";
					break;
				case 'text':
					ret += "\tText: " + event.type + '=' + event.text + "\n";
					break;
				default:
					ret += "\tUnknown: " + event.cmd + "\n";
			}
		}
	}
	return ret;
};

module.exports = midiLint;
