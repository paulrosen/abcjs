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

var sequence;

(function() {
	"use strict";

	var measureLength;
	// The abc is provided to us line by line. It might have repeats in it. We want to re arrange the elements to
	// be an array of voices with all the repeats embedded, and no lines. Then it is trivial to go through the events
	// one at a time and turn it into midi.

	sequence = function(abctune, options) {
		// Global options
		options = options || {};
		var qpm = 180;	// The tempo if there isn't a tempo specified.
		var program = options.program || 0;	// The program if there isn't a program specified.
		var transpose = options.transpose || 0;
		var channel = options.channel || 0;
		var drumPattern = options.drum || "";
		var drumBars = options.drumBars || 1;
		var drumIntro = options.drumIntro || 0;
		var drumOn = drumPattern !== "";

		// All of the above overrides need to be integers
		program = parseInt(program, 10);
		transpose = parseInt(transpose, 10);
		channel = parseInt(channel, 10);
		drumPattern = drumPattern.split(" ");
		drumBars = parseInt(drumBars, 10);
		drumIntro = parseInt(drumIntro, 10);

		var bagpipes = abctune.formatting.bagpipes; // If it is bagpipes, then the gracenotes are played on top of the main note.
		if (bagpipes)
			program = 71;

		// %%MIDI fermatafixed
		// %%MIDI fermataproportional
		// %%MIDI deltaloudness n
		// %%MIDI gracedivider b
		// %%MIDI ratio n m
		// %%MIDI beat a b c n
		// %%MIDI grace a/b
		// %%MIDI trim x/y

		// %MIDI gchordon
		// %MIDI gchordoff
		// %%MIDI bassprog 45
		// %%MIDI chordprog 24
		// %%MIDI chordname name n1 n2 n3 n4 n5 n6

		//%%MIDI beat ⟨int1⟩ ⟨int2⟩ ⟨int3⟩ ⟨int4⟩: controls the volumes of the notes in a measure. The first note in a bar has volume ⟨int1⟩; other ‘strong’ notes have volume ⟨int2⟩ and all the rest have volume ⟨int3⟩. These values must be in the range 0–127. The parameter ⟨int4⟩ determines which notes are ‘strong’. If the time signature is x/y, then each note is given a position number k = 0, 1, 2. . . x-1 within each bar. If k is a multiple of ⟨int4⟩, then the note is ‘strong’.

		if (abctune.formatting.midi) {
			//console.log("MIDI Formatting:", abctune.formatting.midi);
			var globals = abctune.formatting.midi;
			if (globals.program) {
				program = globals.program[0];
				if (globals.program.length > 1)
					channel = globals.program[1];
			}
			if (globals.transpose)
				transpose = globals.transpose[0];
			if (globals.channel)
				channel = globals.channel[0];
			if (globals.drum)
				drumPattern = globals.drum;
			if (globals.drumbars)
				drumBars = globals.drumbars[0];
			if (globals.drumon)
				drumOn = true;
		}

		// Specified options in abc string.

		// If the tempo was passed in, use that. If the tempo is specified, use that. Otherwise, use the default.
		if (abctune.metaText.tempo)
			qpm = interpretTempo(abctune.metaText.tempo);
		if (options.qpm)
			qpm = parseInt(options.qpm, 10);

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
		var startingDrumSet = false;
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
						if (!voices[voiceNumber]) {
							voices[voiceNumber] = [].concat(startVoice);
						}
						if (staff.key) {
							if (staff.key.root === 'HP')
								voices[voiceNumber].push({el_type: 'key', accidentals: [{acc: 'natural', note: 'g'}, {acc: 'sharp', note: 'f'}, {acc: 'sharp', note: 'c'}]});
							else
								voices[voiceNumber].push({el_type: 'key', accidentals: staff.key.accidentals });
						}
						if (staff.meter) {
							voices[voiceNumber].push(interpretMeter(staff.meter));
						}
						if (!startingDrumSet && drumOn) { // drum information is only needed once, so use the first line and track 0.
							voices[voiceNumber].push({el_type: 'drum', params: {pattern: drumPattern, bars: drumBars, on: drumOn, intro: drumIntro}});
							startingDrumSet = true;
						}
						if (staff.clef && staff.clef.transpose) {
							staff.clef.el_type = 'clef';
							voices[voiceNumber].push({ el_type: 'transpose', transpose: staff.clef.transpose });
						}
						if (abctune.formatting.midi && abctune.formatting.midi.drumoff) {
							// If there is a drum off command right at the beginning it is put in the metaText instead of the stream,
							// so we will just insert it here.
							voices[voiceNumber].push({ el_type: 'bar' });
							voices[voiceNumber].push({el_type: 'drum', params: {pattern: "", on: false }});
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
								case 'midi':
									//console.log("MIDI inline", elem); // TODO-PER: for debugging. Remove this.
									var drumChange = false;
									switch (elem.cmd) {
										case "drumon": drumOn = true; drumChange = true; break;
										case "drumoff": drumOn = false; drumChange = true; break;
										case "drum": drumPattern = elem.params; drumChange = true; break;
										case "drumbars": drumBars = elem.params[0]; drumChange = true; break;
									}
									if (drumChange) {
										voices[0].push({el_type: 'drum', params: { pattern: drumPattern, bars: drumBars, intro: drumIntro, on: drumOn}});
										startingDrumSet = true;
									}
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
		if (drumIntro) {
			// add some measures of rests to the start of each track.
			for (var vv = 0; vv < voices.length; vv++) {
				var insertPoint = 0;
				while (voices[vv][insertPoint].el_type !== "note" && voices[vv].length > insertPoint)
					insertPoint++;
				if (voices[vv].length > insertPoint) {
					for (var w = 0; w < drumIntro; w++) {
						voices[vv].splice(insertPoint, 0, {el_type: "note", rest: {type: "rest"}, duration: measureLength},
							{ el_type: "bar" });
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
		var meter;
		switch (element.type) {
			case "common_time":
				meter = { el_type: 'meter', num: 4, den: 4 };
				break;
			case "cut_time":
				meter = { el_type: 'meter', num: 2, den: 2 };
				break;
			case "specified":
				// TODO-PER: only taking the first meter, so the complex meters are not handled.
				meter = { el_type: 'meter', num: element.value[0].num, den: element.value[0].den };
				break;
			default:
				// This should never happen.
				meter = { el_type: 'meter' };
		}
		measureLength = meter.num/meter.den;
		return meter;
	}
})();

module.exports = sequence;
