//    abc_midi_sequencer.js: Turn parsed abc into a linear series of events.
//    Copyright (C) 2010,2016 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

if (!window.ABCJS.midi)
	window.ABCJS.midi = {};

(function() {
	"use strict";

	// The abc is provided to us line by line. It might have repeats in it. We want to re arrange the elements to
	// be an array of voices with all the repeats embedded, and no lines. Then it is trivial to go through the events
	// one at a time and turn it into midi.

	window.ABCJS.midi.sequence = function(abctune, options) {
		// Global options
		options = options || {};
		var qpm = options.qpm || 180;	// The tempo if there isn't a tempo specified.
		var program = options.program || 0;	// The program if there isn't a program specified.
		var transpose = options.transpose || 0;
		var channel = options.channel || 0;
		// All of the above overrides need to be integers
		qpm = parseInt(qpm, 10);
		program = parseInt(program, 10);
		transpose = parseInt(transpose, 10);
		channel = parseInt(channel, 10);

		var bagpipes = abctune.formatting.bagpipes; // If it is bagpipes, then the gracenotes are played on top of the main note.
		if (bagpipes)
			program = 71;

		// %%MIDI formatting options
		if (abctune.formatting.midi) {
			if (abctune.formatting.midi.transpose)
				transpose = abctune.formatting.midi.transpose;

			// PER: changed format of the global midi commands from the parser. Using the new definition here.
			if (abctune.formatting.midi.program && abctune.formatting.midi.program.program)
				program = abctune.formatting.midi.program.program;
			if (abctune.formatting.midi.channel)
				channel = abctune.formatting.midi.channel;
		}

		// Specified options in abc string.

		if (abctune.metaText.tempo)
			qpm = interpretTempo(abctune.metaText.tempo);

		var startVoice = [];
		if (bagpipes)
			startVoice.push({ el_type: 'bagpipes' });
		startVoice.push({ el_type: 'instrument', program: program });
		if (channel)
			startVoice.push({ el_type: 'channel', channel: channel });
		if (transpose)
			startVoice.push({ el_type: 'transpose', transpose: transpose });
		startVoice.push({ el_type: 'tempo', qpm: qpm });

		// the relevant part of the input structure is:
		// abctune
		//		array lines
		//			array staff
		//				object key
		//				object meter
		//				array voices
		//					array abcelem

		// visit each voice completely in turn
		var voices = [];
		var startRepeatPlaceholder = []; // There is a place holder for each voice.
		var skipEndingPlaceholder = []; // This is the place where the first ending starts.
		for (var i = 0; i < abctune.lines.length; i++) {
			// For each group of staff lines in the tune.
			var line = abctune.lines[i];
			if (line.staff) {
				var staves = line.staff;
				var voiceNumber = 0;
				for (var j = 0; j < staves.length; j++) {
					var staff = staves[j];
					// For each staff line
					for (var k = 0; k < staff.voices.length; k++) {
						// For each voice in a staff line
						var voice = staff.voices[k];
						if (!voices[voiceNumber])
							voices[voiceNumber] = [].concat(startVoice);
						if (staff.key) {
							if (staff.key.root === 'HP')
								voices[voiceNumber].push({el_type: 'key', accidentals: [{acc: 'natural', note: 'g'}, {acc: 'sharp', note: 'f'}, {acc: 'sharp', note: 'c'}]});
							else
								voices[voiceNumber].push({el_type: 'key', accidentals: staff.key.accidentals });
						}
						if (staff.meter) {
							voices[voiceNumber].push(interpretMeter(staff.meter));
						}
						if (staff.clef && staff.clef.transpose) {
							staff.clef.el_type = 'clef';
							voices[voiceNumber].push({ el_type: 'transpose', transpose: staff.clef.transpose });
						}
						var noteEventsInBar = 0;
						for (var v = 0; v < voice.length; v++) {
							// For each element in a voice
							var elem = voice[v];
							switch (elem.el_type) {
								case "note":
									// regular items are just pushed.
									if (!elem.rest || elem.rest.type !== 'spacer') {
										voices[voiceNumber].push(elem);
										noteEventsInBar++;
									}
									break;
								case "key":
									if (elem.root === 'HP')
										voices[voiceNumber].push({el_type: 'key', accidentals: [{acc: 'natural', note: 'g'}, {acc: 'sharp', note: 'f'}, {acc: 'sharp', note: 'c'}]});
									else
										voices[voiceNumber].push({el_type: 'key', accidentals: elem.accidentals });
									break;
								case "meter":
									voices[voiceNumber].push(interpretMeter(elem));
									break;
								case "clef": // need to keep this to catch the "transpose" element.
									if (elem.transpose)
										voices[voiceNumber].push({ el_type: 'transpose', transpose: elem.transpose });
									break;
								case "tempo":
									qpm = interpretTempo(elem);
									voices[voiceNumber].push({ el_type: 'tempo', qpm: qpm });
									break;
								case "bar":
									if (noteEventsInBar > 0) // don't add two bars in a row.
										voices[voiceNumber].push({ el_type: 'bar' }); // We need the bar marking to reset the accidentals.
									noteEventsInBar = 0;
									// figure out repeats and endings --
									// The important part is where there is a start repeat, and end repeat, or a first ending.
									var endRepeat = (elem.type === "bar_right_repeat" || elem.type === "bar_dbl_repeat");
									var startEnding = (elem.startEnding === '1');
									var startRepeat = (elem.type === "bar_left_repeat" || elem.type === "bar_dbl_repeat" || elem.type === "bar_thick_thin" || elem.type === "bar_thin_thick" || elem.type === "bar_thin_thin" || elem.type === "bar_right_repeat");
									if (endRepeat) {
										var s = startRepeatPlaceholder[voiceNumber];
										if (!s) s = 0; // If there wasn't a left repeat, then we repeat from the beginning.
										var e = skipEndingPlaceholder[voiceNumber];
										if (!e) e = voices[voiceNumber].length; // If there wasn't a first ending marker, then we copy everything.
										voices[voiceNumber] = voices[voiceNumber].concat(voices[voiceNumber].slice(s, e));
										// reset these in case there is a second repeat later on.
										skipEndingPlaceholder[voiceNumber] = undefined;
										startRepeatPlaceholder[voiceNumber] = undefined;
									}
									if (startEnding)
										skipEndingPlaceholder[voiceNumber] = voices[voiceNumber].length;
									if (startRepeat)
										startRepeatPlaceholder[voiceNumber] = voices[voiceNumber].length;
									break;
								case 'style':
									// TODO-PER: If this is set to rhythm heads, then it should use the percussion channel.
									break;
								case 'part':
									// TODO-PER: If there is a part section in the header, then this should probably affect the repeats.
									break;
								case 'stem':
								case 'scale':
									// These elements don't affect sound
									break;
								default:
									console.log("MIDI: element type " + elem.el_type + " not handled.");
							}
						}
						voiceNumber++;
					}
				}
			}
		}
		return voices;
	};

	function interpretTempo(element) {
		var duration = 1/4;
		if (element.duration) {
			duration = element.duration[0];
		}
		var bpm = 60;
		if (element.bpm) {
			bpm = element.bpm;
		}
		return bpm*duration*4;
	}

	function interpretMeter(element) {
		switch (element.type) {
			case "common_time":
				return { el_type: 'meter', num: 4, den: 4 };
			case "cut_time":
				return { el_type: 'meter', num: 2, den: 2 };
			case "specified":
				// TODO-PER: only taking the first meter, so the complex meters are not handled.
				return { el_type: 'meter', num: element.value[0].num, den: element.value[0].den };
			default:
				// This should never happen.
				return { el_type: 'meter' };
		}
	}
})();
