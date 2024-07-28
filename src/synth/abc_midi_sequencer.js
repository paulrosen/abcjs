//    abc_midi_sequencer.js: Turn parsed abc into a linear series of events.

var sequence;
var parseCommon = require("../parse/abc_common");

(function() {
	"use strict";

	var measureLength = 1; // This should be set by the meter, but just in case that is missing, we'll take a guess.
	// The abc is provided to us line by line. It might have repeats in it. We want to re arrange the elements to
	// be an array of voices with all the repeats embedded, and no lines. Then it is trivial to go through the events
	// one at a time and turn it into midi.

	var PERCUSSION_PROGRAM = 128;

	sequence = function(abctune, options) {
		// Global options
		options = options || {};
		var qpm;
		var program = options.program || 0;	// The program if there isn't a program specified.
		var transpose = options.midiTranspose || 0;
		// If the tune has a visual transpose then that needs to be subtracted out because we are getting the visual object.
		if (abctune.visualTranspose)
			transpose -= abctune.visualTranspose;
		var channel = options.channel || 0;
		var channelExplicitlySet = false;
		var drumPattern = options.drum || "";
		var drumBars = options.drumBars || 1;
		var drumIntro = options.drumIntro || 0;
		var drumOn = drumPattern !== "";
		var drumOffAfterIntro = !!options.drumOff
		var style = []; // The note head style for each voice.
		var rhythmHeadThisBar = false; // Rhythm notation was detected.
		var crescendoSize = 50; // how much to increase or decrease volume when crescendo/diminuendo is encountered.

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

		var startingMidi = [];
		if (abctune.formatting.midi) {
			//console.log("MIDI Formatting:", abctune.formatting.midi);
			var globals = abctune.formatting.midi;
			if (globals.program && globals.program.length > 0) {
				program = globals.program[0];
				if (globals.program.length > 1) {
					program = globals.program[1];
					channel = globals.program[0];
				}
				channelExplicitlySet = true;
			}
			if (globals.transpose)
				transpose = globals.transpose[0];
			if (globals.channel) {
				channel = globals.channel[0];
				channelExplicitlySet = true;
			}
			if (globals.drum)
				drumPattern = globals.drum;
			if (globals.drumbars)
				drumBars = globals.drumbars[0];
			if (globals.drumon)
				drumOn = true;
			if (channel === 10)
				program = PERCUSSION_PROGRAM;
			if (globals.beat)
				startingMidi.push({ el_type: 'beat', beats: globals.beat })
			if (globals.nobeataccents)
				startingMidi.push({ el_type: 'beataccents', value: false });

		}

		// Specified options in abc string.

		// If the tempo was passed in, use that.
		// If the tempo is specified, use that.
		// If there is a default, use that.
		// Otherwise, use the default.
		if (options.qpm)
			qpm = parseInt(options.qpm, 10);
		else if (abctune.metaText.tempo)
			qpm = interpretTempo(abctune.metaText.tempo, abctune.getBeatLength());
		else if (options.defaultQpm)
			qpm = options.defaultQpm;
		else
			qpm = 180; 	// The tempo if there isn't a tempo specified.

		var startVoice = [];
		if (bagpipes)
			startVoice.push({ el_type: 'bagpipes' });
		startVoice.push({ el_type: 'instrument', program: program });
		if (channel)
			startVoice.push({ el_type: 'channel', channel: channel });
		if (transpose)
			startVoice.push({ el_type: 'transpose', transpose: transpose });
		startVoice.push({ el_type: 'tempo', qpm: qpm });
		for (var ss = 0; ss < startingMidi.length;ss++)
			startVoice.push(startingMidi[ss]);

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
		var inCrescendo = [];
		var inDiminuendo = [];
		var durationCounter = [0];
		var tempoChanges = {};
		tempoChanges["0"] = { el_type: 'tempo', qpm: qpm, timing: 0 };
		var currentVolume;
		var startRepeatPlaceholder = []; // There is a place holder for each voice.
		var skipEndingPlaceholder = []; // This is the place where the first ending starts.
		var startingDrumSet = false;
		var lines = abctune.lines; //abctune.deline(); TODO-PER: can switch to this, then simplify the loops below.
		for (var i = 0; i < lines.length; i++) {
			// For each group of staff lines in the tune.
			var line = lines[i];
			if (line.staff) {
				var staves = line.staff;
				var voiceNumber = 0;
				for (var j = 0; j < staves.length; j++) {
					var staff = staves[j];
					if (staff.clef && staff.clef.type === "TAB")
						continue;

					// For each staff line
					for (var k = 0; k < staff.voices.length; k++) {
						// For each voice in a staff line
						var voice = staff.voices[k];
						if (!voices[voiceNumber]) {
							voices[voiceNumber] = [].concat(JSON.parse(JSON.stringify(startVoice)));
							var voiceName = getTrackTitle(line.staff, voiceNumber);
							if (voiceName)
								voices[voiceNumber].unshift({el_type: "name", trackName: voiceName});
						}
						// Negate any transposition for the percussion staff.
						if (transpose && staff.clef.type === "perc")
							voices[voiceNumber].push({ el_type: 'transpose', transpose: 0 });

						if (staff.clef && staff.clef.type === 'perc' && !channelExplicitlySet) {
							for (var cl = 0; cl < voices[voiceNumber].length; cl++) {
								if (voices[voiceNumber][cl].el_type === 'instrument')
									voices[voiceNumber][cl].program = PERCUSSION_PROGRAM;
							}
						} else if (staff.key) {
							addKey(voices[voiceNumber], staff.key);
						}
						if (staff.meter) {
							addMeter(voices[voiceNumber], staff.meter);
						}
						if (!startingDrumSet && drumOn) { // drum information is only needed once, so use the first line and track 0.
							voices[voiceNumber].push({el_type: 'drum', params: {pattern: drumPattern, bars: drumBars, on: drumOn, intro: drumIntro}});
							startingDrumSet = true;
						}
						if (staff.clef && staff.clef.type !== "perc" && staff.clef.transpose) {
							staff.clef.el_type = 'clef';
							voices[voiceNumber].push({ el_type: 'transpose', transpose: staff.clef.transpose });
						}
						if (staff.clef && staff.clef.type) {
							if (staff.clef.type.indexOf("-8") >= 0)
								voices[voiceNumber].push({ el_type: 'transpose', transpose: -12 });
							else if (staff.clef.type.indexOf("+8") >= 0)
								voices[voiceNumber].push({ el_type: 'transpose', transpose: 12 });
						}

						if (abctune.formatting.midi && abctune.formatting.midi.drumoff) {
							// If there is a drum off command right at the beginning it is put in the metaText instead of the stream,
							// so we will just insert it here.
							voices[voiceNumber].push({ el_type: 'bar' });
							voices[voiceNumber].push({el_type: 'drum', params: {pattern: "", on: false }});
						}
						var noteEventsInBar = 0;
						var tripletMultiplier = 0;
						var tripletDurationTotal = 0; // try to mitigate the js rounding problems.
						var tripletDurationCount = 0;
						currentVolume = [105, 95, 85, 1];

						for (var v = 0; v < voice.length; v++) {
							// For each element in a voice
							var elem = voice[v];
							switch (elem.el_type) {
								case "note":
									if (inCrescendo[k]) {
										currentVolume[0] += inCrescendo[k];
										currentVolume[1] += inCrescendo[k];
										currentVolume[2] += inCrescendo[k];
										voices[voiceNumber].push({ el_type: 'beat', beats: currentVolume.slice(0) });
									}

									if (inDiminuendo[k]) {
										currentVolume[0] += inDiminuendo[k];
										currentVolume[1] += inDiminuendo[k];
										currentVolume[2] += inDiminuendo[k];
										voices[voiceNumber].push({ el_type: 'beat', beats: currentVolume.slice(0) });
									}
									setDynamics(elem);

									// regular items are just pushed.
									if (!elem.rest || elem.rest.type !== 'spacer') {
										var noteElem = { elem: elem, el_type: "note", timing: durationCounter[voiceNumber] }; // Make a copy so that modifications aren't kept except for adding the midiPitches
										if (elem.style)
											noteElem.style = elem.style;
										else if (style[voiceNumber])
											noteElem.style = style[voiceNumber];
										noteElem.duration = (elem.duration === 0) ? 0.25 : elem.duration;
										if (elem.startTriplet) {
											tripletMultiplier = elem.tripletMultiplier;
											tripletDurationTotal = elem.startTriplet * tripletMultiplier * elem.duration;
											if (elem.startTriplet !== elem.tripletR) { // most commonly (3:2:2
												if (v + elem.tripletR <= voice.length) {
													var durationTotal = 0;
													for (var w = v; w < v + elem.tripletR; w++) {
														durationTotal += voice[w].duration;
													}
													tripletDurationTotal = tripletMultiplier * durationTotal;
												}
											}
											noteElem.duration = noteElem.duration * tripletMultiplier;
											noteElem.duration = Math.round(noteElem.duration*1000000)/1000000;
											tripletDurationCount = noteElem.duration;
										} else if (tripletMultiplier) {
											if (elem.endTriplet) {
												tripletMultiplier = 0;
												noteElem.duration = Math.round((tripletDurationTotal - tripletDurationCount)*1000000)/1000000;
											} else {
												noteElem.duration = noteElem.duration * tripletMultiplier;
												noteElem.duration = Math.round(noteElem.duration*1000000)/1000000;
												tripletDurationCount += noteElem.duration;
											}
										}
										if (elem.rest) noteElem.rest = elem.rest;
										if (elem.decoration) noteElem.decoration = elem.decoration.slice(0);
										if (elem.pitches) noteElem.pitches = parseCommon.cloneArray(elem.pitches);
										if (elem.gracenotes) noteElem.gracenotes = parseCommon.cloneArray(elem.gracenotes);
										if (elem.chord) noteElem.chord = parseCommon.cloneArray(elem.chord);

										voices[voiceNumber].push(noteElem);
										if (elem.style === "rhythm") {
											rhythmHeadThisBar = true;
											chordVoiceOffThisBar(voices)
										}
										noteEventsInBar++;
										durationCounter[voiceNumber] += noteElem.duration;
									}
									break;
								case "key":
								case "keySignature":
									addKey(voices[voiceNumber], elem);
									break;
								case "meter":
									addMeter(voices[voiceNumber], elem);
									break;
								case "clef": // need to keep this to catch the "transpose" element.
									if (elem.transpose)
										voices[voiceNumber].push({ el_type: 'transpose', transpose: elem.transpose });
									if (elem.type) {
										if (elem.type.indexOf("-8") >= 0)
											voices[voiceNumber].push({ el_type: 'transpose', transpose: -12 });
										else if (elem.type.indexOf("+8") >= 0)
											voices[voiceNumber].push({ el_type: 'transpose', transpose: 12 });
									}
									break;
								case "tempo":
									qpm = interpretTempo(elem, abctune.getBeatLength());
									voices[voiceNumber].push({ el_type: 'tempo', qpm: qpm, timing: durationCounter[voiceNumber] });
									tempoChanges[''+durationCounter[voiceNumber]] = { el_type: 'tempo', qpm: qpm, timing: durationCounter[voiceNumber] };
									break;
								case "bar":
									if (noteEventsInBar > 0) // don't add two bars in a row.
										voices[voiceNumber].push({ el_type: 'bar' }); // We need the bar marking to reset the accidentals.
									setDynamics(elem);
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
										// duplicate each of the elements - this has to be a deep copy.
										for (var z = s; z < e; z++) {
											var item = Object.assign({},voices[voiceNumber][z]);
											if (item.pitches)
												item.pitches = parseCommon.cloneArray(item.pitches);
											voices[voiceNumber].push(item);
										}
										// reset these in case there is a second repeat later on.
										skipEndingPlaceholder[voiceNumber] = undefined;
										startRepeatPlaceholder[voiceNumber] = undefined;
									}
									if (startEnding)
										skipEndingPlaceholder[voiceNumber] = voices[voiceNumber].length;
									if (startRepeat)
										startRepeatPlaceholder[voiceNumber] = voices[voiceNumber].length;
									rhythmHeadThisBar = false;
									break;
								case 'style':
									style[voiceNumber] = elem.head;
									break;
								case 'timeSignature':
									voices[voiceNumber].push(interpretMeter(elem));
									break;
								case 'part':
									// TODO-PER: If there is a part section in the header, then this should probably affect the repeats.
									break;
								case 'stem':
								case 'scale':
								case 'break':
								case 'font':
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
										case "channel":
											// There's not much needed for the channel except to look out for the percussion channel
											if (elem.params[0] === 10)
												voices[voiceNumber].push({ el_type: 'instrument', program: PERCUSSION_PROGRAM });
											break;
										case "program":
											addIfDifferent(voices[voiceNumber], { el_type: 'instrument', program: elem.params[0] });
											channelExplicitlySet = true;
											break;
										case "transpose":
											voices[voiceNumber].push({ el_type: 'transpose', transpose: elem.params[0] });
											break;
										case "gchordoff":
											voices[voiceNumber].push({ el_type: 'gchordOn', tacet: true });
											break;
										case "gchordon":
											voices[voiceNumber].push({ el_type: 'gchordOn', tacet: false });
											break;
										case "beat":
											voices[voiceNumber].push({ el_type: 'beat', beats: elem.params });
											break;
										case "nobeataccents":
											voices[voiceNumber].push({ el_type: 'beataccents', value: false });
											break;
										case "beataccents":
											voices[voiceNumber].push({ el_type: 'beataccents', value: true });
											break;
										case "vol":
										case "volinc":
											voices[voiceNumber].push({ el_type: elem.cmd, volume: elem.params[0] });
											break;
										case "swing":
										case "gchord":
										case "bassvol":
										case "chordvol":
											voices[voiceNumber].push({ el_type: elem.cmd, param: elem.params[0] });
											break;

										case "bassprog": // MAE 22 May 2024
										case "chordprog": // MAE 22 May 2024
					                      voices[voiceNumber].push({
					                        el_type: elem.cmd,
					                        value: elem.params[0],
					                        octaveShift: elem.params[1]
					                      });
					                      break;

					                    // MAE 23 Jun 2024
					                    case "gchordbars":
					                        voices[voiceNumber].push({
					                          el_type: elem.cmd,
					                          param: elem.params[0]
					                        });
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
						if (!durationCounter[voiceNumber])
							durationCounter[voiceNumber] = 0;
					}
				}

				function setDynamics(elem) {
					var volumes = {
						'pppp': [15, 10, 5, 1],
						'ppp': [30, 20, 10, 1],
						'pp': [45, 35, 20, 1],
						'p': [60, 50, 35, 1],
						'mp': [75, 65, 50, 1],
						'mf': [90, 80, 65, 1],
						'f': [105, 95, 80, 1],
						'ff': [120, 110, 95, 1],
						'fff': [127, 125, 110, 1],
						'ffff': [127, 125, 110, 1]
					};

					var dynamicType;
					if (elem.decoration) {
						if (elem.decoration.indexOf('pppp') >= 0)
							dynamicType = 'pppp';
						else if (elem.decoration.indexOf('ppp') >= 0)
							dynamicType = 'ppp';
						else if (elem.decoration.indexOf('pp') >= 0)
							dynamicType = 'pp';
						else if (elem.decoration.indexOf('p') >= 0)
							dynamicType = 'p';
						else if (elem.decoration.indexOf('mp') >= 0)
							dynamicType = 'mp';
						else if (elem.decoration.indexOf('mf') >= 0)
							dynamicType = 'mf';
						else if (elem.decoration.indexOf('f') >= 0)
							dynamicType = 'f';
						else if (elem.decoration.indexOf('ff') >= 0)
							dynamicType = 'ff';
						else if (elem.decoration.indexOf('fff') >= 0)
							dynamicType = 'fff';
						else if (elem.decoration.indexOf('ffff') >= 0)
							dynamicType = 'ffff';

						if (dynamicType) {
							currentVolume = volumes[dynamicType].slice(0);
							voices[voiceNumber].push({ el_type: 'beat', beats: currentVolume.slice(0) });
							inCrescendo[k] = false;
							inDiminuendo[k] = false;
						}

						if (elem.decoration.indexOf("crescendo(") >= 0) {
							var n = numNotesToDecoration(voice, v, "crescendo)");
							var top = Math.min(127, currentVolume[0] + crescendoSize);
							var endDec = endingVolume(voice, v+n+1, Object.keys(volumes));
							if (endDec)
								top = volumes[endDec][0];
							if (n > 0)
								inCrescendo[k] = Math.floor((top - currentVolume[0]) / n);
							else
								inCrescendo[k] = false;
							inDiminuendo[k] = false;
						} else if (elem.decoration.indexOf("crescendo)") >= 0) {
							inCrescendo[k] = false;
						} else if (elem.decoration.indexOf("diminuendo(") >= 0) {
							var n2 = numNotesToDecoration(voice, v, "diminuendo)");
							var bottom = Math.max(15, currentVolume[0] - crescendoSize);
							var endDec2 = endingVolume(voice, v+n2+1, Object.keys(volumes));
							if (endDec2)
								bottom = volumes[endDec2][0];
							inCrescendo[k] = false;
							if (n2 > 0)
								inDiminuendo[k] = Math.floor((bottom - currentVolume[0]) / n2);
							else
								inDiminuendo[k] = false;
						} else if (elem.decoration.indexOf("diminuendo)") >= 0) {
							inDiminuendo[k] = false;
						}
					}
				}
			}
		}
		// If there are tempo changes, make sure they are in all the voices. This must be done post process because all the elements in all the voices need to be created first.
		insertTempoChanges(voices, tempoChanges);

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
						if (pickups === 0 || w < drumIntro-1) {
							voices[vv].splice(insertPoint, 0, 
								{el_type: "note", rest: {type: "rest"}, duration: measureLength},
								{ el_type: "bar" }
							);
							insertPoint += 2
						} else {
							voices[vv].splice(insertPoint++, 0, {el_type: "note", rest: {type: "rest"}, duration: measureLength-pickups});
						}
					}
					if (drumOffAfterIntro) {
						drumOn = false
						voices[vv].splice(insertPoint++, 0, {el_type: 'drum', params: { pattern: drumPattern, bars: drumBars, intro: drumIntro, on: drumOn}});
						drumOffAfterIntro = false
					}
				}
			}
		}
		if (voices.length > 0 && voices[0].length > 0) {
			voices[0][0].pickupLength = abctune.getPickupLength();
		}
		return voices;
	};

	function numNotesToDecoration(voice, start, decoration) {
		var counter = 0;
		for (var i = start+1; i < voice.length; i++) {
			if (voice[i].el_type === "note")
				counter++;
			if (voice[i].decoration && voice[i].decoration.indexOf(decoration) >= 0)
				return counter;
		}
		return counter;
	}
	function endingVolume(voice, start, volumeDecorations) {
		var end = Math.min(voice.length, start + 3); // If we have a volume within a couple notes of the end then assume that is the destination.
		for (var i = start; i < end; i++) {
			if (voice[i].el_type === "note") {
				if (voice[i].decoration) {
					for (var j = 0; j < voice[i].decoration.length; j++) {
						if (volumeDecorations.indexOf(voice[i].decoration[j]) >= 0)
							return voice[i].decoration[j];
					}
				}
			}
		}
		return null;
	}

	function insertTempoChanges(voices, tempoChanges) {
		if (!tempoChanges || tempoChanges.length === 0)
			return;
		var changePositions = Object.keys(tempoChanges);
		for (var i = 0; i < voices.length; i++) {
			var voice = voices[i];
			var lastTempo = tempoChanges['0'] ? tempoChanges['0'].qpm : 0; // Don't insert redundant changes. This happens normally when repeating from the beginning, but could happen anywhere that there is a tempo marking that is the same as the last one.
			for (var j = 0; j < voice.length; j++) {
				var el = voice[j];
				if (el.el_type === "tempo")
					lastTempo = el.qpm;
				if (changePositions.indexOf(''+el.timing) >= 0 && lastTempo !== tempoChanges[''+el.timing].qpm) {
					lastTempo = tempoChanges[''+el.timing].qpm;
					if (el.el_type === "tempo") {
						el.qpm = tempoChanges[''+el.timing].qpm;
						j++; // when there is a tempo element the next element has the same timing and we don't want it to match the second time.
					} else {
						//console.log("tempo position", i, j, el);
						voices[i].splice(j, 0, {el_type: "tempo", qpm: tempoChanges[''+el.timing].qpm, timing: el.timing});
						j +=2; // skip the element we just inserted.
					}
				}
			}
		}
	}

	function chordVoiceOffThisBar(voices) {
		for (var i = 0; i < voices.length; i++) {
			var voice = voices[i];
			var j = voice.length-1;
			while (j >= 0 && voice[j].el_type !== 'bar') {
				voice[j].noChordVoice = true;
				j--;
			}
		}
	}

	function getTrackTitle(staff, voiceNumber) {
		if (!staff || staff.length <= voiceNumber || !staff[voiceNumber].title)
			return undefined;
		return staff[voiceNumber].title.join(" ");
	}

	function interpretTempo(element, beatLength) {
		var duration = 1/4;
		if (element.duration) {
			duration = element.duration[0];
		}
		var bpm = 60;
		if (element.bpm) {
			bpm = element.bpm;
		}
		// The tempo is defined with a beat length of "duration". If that isn't the natural beat length then there is a translation.
		return duration * bpm / beatLength;
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

	function removeNaturals(accidentals) {
		var acc = [];
		for (var i = 0; i < accidentals.length; i++) {
			if (accidentals[i].acc !== "natural")
				acc.push(accidentals[i])
		}
		return acc;
	}
	function addKey(arr, key) {
		var newKey;
		if (key.root === 'HP')
			newKey = {el_type: 'key', accidentals: [{acc: 'natural', note: 'g'}, {acc: 'sharp', note: 'f'}, {acc: 'sharp', note: 'c'}]};
		else
			newKey = {el_type: 'key', accidentals: removeNaturals(key.accidentals) };
		addIfDifferent(arr, newKey);
	}
	function addMeter(arr, meter) {
		var newMeter = interpretMeter(meter);
		addIfDifferent(arr, newMeter);
	}
	function addIfDifferent(arr, item) {
		for (var i = arr.length-1; i >= 0; i--) {
			if (arr[i].el_type === item.el_type) {
				if (JSON.stringify(arr[i]) !== JSON.stringify(item))
					arr.push(item);
				return;
			}
		}
		arr.push(item);
	}

})();

module.exports = sequence;
