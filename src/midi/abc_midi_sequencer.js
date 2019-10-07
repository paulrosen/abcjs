//    abc_midi_sequencer.js: Turn parsed abc into a linear series of events.
//    Copyright (C) 2010-2018 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

var sequence;

(function() {
	"use strict";

	var measureLength;
	// The abc is provided to us line by line. It might have repeats in it. We want to re arrange the elements to
	// be an array of voices with all the repeats embedded, and no lines. Then it is trivial to go through the events
	// one at a time and turn it into midi.

	var PERCUSSION_PROGRAM = 128;

	sequence = function(abctune, options) {
		// Global options
		options = options || {};
		var qpm = 180;	// The tempo if there isn't a tempo specified.
		var program = options.program || 0;	// The program if there isn't a program specified.
		var transpose = options.midiTranspose || 0;
		var channel = options.channel || 0;
		var drumPattern = options.drum || "";
		var drumBars = options.drumBars || 1;
		var drumIntro = options.drumIntro || 0;
		var drumOn = drumPattern !== "";

		// All of the above overrides need to be integers
		program = parseInt(program, 10);
		transpose = parseInt(transpose, 10);
		channel = parseInt(channel, 10);
		if (channel === 10)
			program = PERCUSSION_PROGRAM;
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
			if (globals.program && globals.program.length > 0) {
				program = globals.program[0];
				if (globals.program.length > 1) {
					program = globals.program[1];
					channel = globals.program[0];
				}
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
			if (channel === 10)
				program = PERCUSSION_PROGRAM;
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
							voices[voiceNumber] = [].concat(JSON.parse(JSON.stringify(startVoice)));
						}
						if (staff.clef && staff.clef.type === 'perc') {
							for (var cl = 0; cl < voices[voiceNumber].length; cl++) {
								if (voices[voiceNumber][cl].el_type === 'instrument')
									voices[voiceNumber][cl].program = PERCUSSION_PROGRAM;
							}
						} else if (staff.key) {
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
									var startRepeat = (elem.type === "bar_left_repeat" || elem.type === "bar_dbl_repeat" || elem.type === "bar_right_repeat");
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
										case "drummap":
											// This is handled before getting here so it can be ignored.
											break;
										case "program":
											voices[voiceNumber].push({ el_type: 'instrument', program: elem.params[0] });
											break;
										case "transpose":
											voices[voiceNumber].push({ el_type: 'transpose', transpose: elem.params[0] });
											break;
										case "gchordoff":
											voices[voiceNumber].push({ el_type: 'gchord', tacet: true });
											break;
										case "gchordon":
											voices[voiceNumber].push({ el_type: 'gchord', tacet: false });
											break;
										case "beat":
											voices[voiceNumber].push({ el_type: 'beat', beats: elem.params });
											break;
										default:
											console.log("MIDI seq: midi cmd not handled: ", elem.cmd, elem);
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
			var pickups = abctune.getPickupLength();
			// add some measures of rests to the start of each track.
			for (var vv = 0; vv < voices.length; vv++) {
				var insertPoint = 0;
				while (voices[vv][insertPoint].el_type !== "note" && voices[vv].length > insertPoint)
					insertPoint++;
				if (voices[vv].length > insertPoint) {
					for (var w = 0; w < drumIntro; w++) {
						// If it is the last measure of intro, subtract the pickups.
						if (pickups === 0 || w < drumIntro-1)
							voices[vv].splice(insertPoint, 0, {el_type: "note", rest: {type: "rest"}, duration: measureLength},
								{ el_type: "bar" });
						else {
							voices[vv].splice(insertPoint, 0, {el_type: "note", rest: {type: "rest"}, duration: measureLength-pickups});
						}
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
		// The tempo is defined with a beat of a 1/4 note, so we need to adjust it if the tempo is expressed with other than a quarter note.
		// expressedDuration * expressedBeatsPerMinute / lengthOfQuarterNote = quarterNotesPerMinute
		return duration * bpm / 0.25;
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
