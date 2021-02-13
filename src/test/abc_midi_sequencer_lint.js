//    abc_vertical_lint.js: Analyzes the vertical position of the output object.

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
					if (element.decoration && element.decoration.length > 0)
						ret += '\t\tdecoration: ' + element.decoration.join(", ") + '\n';
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
						if (element.style && element.style !== "normal")
							ret += "\n\t\tstyle: " + element.style;
						if (element.noChordVoice)
							ret += "\n\t\tnoChordVoice";
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
				case "vol":
					ret += "\t\t";
					ret += element.volume;
					ret += '\n';
					break;
				case "volinc":
					ret += "\t\t";
					ret += element.volume;
					ret += '\n';
					break;
				case "beataccents":
					ret += "\t\t";
					ret += element.value;
					ret += '\n';
					break;
				case "drum":
					var params = element.params;
					ret += "\t\t";
					ret += "[" + params.pattern.join(" ") + "] bars=" + params.bars + " intro=" + params.intro + " on=" + params.on;
					ret += '\n';
					break;
				case "name":
					ret += "\t\t";
					ret += element.trackName;
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
