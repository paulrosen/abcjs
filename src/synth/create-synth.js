var getNote = require('./load-note');
var createNoteMap = require('./create-note-map');
var registerAudioContext = require('./register-audio-context');
var activeAudioContext = require('./active-audio-context');
var supportsAudio = require('./supports-audio');
var pitchToNoteName = require('./pitch-to-note-name');
var instrumentIndexToName = require('./instrument-index-to-name');
var downloadBuffer = require('./download-buffer');
var placeNote = require('./place-note');
var soundsCache = require('./sounds-cache');

// TODO-PER: remove the midi tests from here: I don't think the object can be constructed unless it passes.
var notSupportedMessage = "MIDI is not supported in this browser.";

var originalSoundFontUrl = "https://paulrosen.github.io/midi-js-soundfonts/abcjs/";
// These are the original soundfonts supplied. They will need a volume boost:
var defaultSoundFontUrl = "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/";
var alternateSoundFontUrl = "https://paulrosen.github.io/midi-js-soundfonts/MusyngKite/";

function CreateSynth() {
	var self = this;
	self.audioBufferPossible = undefined;
	self.directSource = []; // type: AudioBufferSourceNode
	self.startTimeSec = undefined; // the time (in seconds) that the audio started: used for pause to get the pausedTimeSec.
	self.pausedTimeSec = undefined; // the position (in seconds) that the audio was paused: used for resume.
	self.audioBuffers = []; // cache of the buffers so starting play can be fast.
	self.duration = undefined; // the duration of the tune in seconds.
	self.isRunning = false; // whether there is currently a sound buffer running.
//	self.options = undefined

	// Load and cache all needed sounds
	self.init = function(options) {
		if (!options)
			options = {};
//		self.options = options
		registerAudioContext(options.audioContext); // This works no matter what - if there is already an ac it is a nop; if the context is not passed in, then it creates one.
		var startTime = activeAudioContext().currentTime;
		self.debugCallback = options.debugCallback;
		if (self.debugCallback)
			self.debugCallback("init called");
		self.audioBufferPossible = self._deviceCapable();
		if (!self.audioBufferPossible)
			return Promise.reject({ status: "NotSupported", message: notSupportedMessage});
		var params = options.options ? options.options : {};
		self.soundFontUrl = params.soundFontUrl ? params.soundFontUrl : defaultSoundFontUrl;
		if (self.soundFontUrl[self.soundFontUrl.length-1] !== '/')
			self.soundFontUrl += '/';
		if (params.soundFontVolumeMultiplier || params.soundFontVolumeMultiplier === 0)
			self.soundFontVolumeMultiplier = params.soundFontVolumeMultiplier;
		else if (self.soundFontUrl === defaultSoundFontUrl || self.soundFontUrl === alternateSoundFontUrl)
			self.soundFontVolumeMultiplier = 3.0;
		else if (self.soundFontUrl === originalSoundFontUrl)
			self.soundFontVolumeMultiplier = 0.4;
		else
			self.soundFontVolumeMultiplier = 1.0;
		if (params.programOffsets)
			self.programOffsets = params.programOffsets;
		else if (self.soundFontUrl === originalSoundFontUrl)
			self.programOffsets = {
				"bright_acoustic_piano": 20,
				"honkytonk_piano": 20,
				"electric_piano_1": 30,
				"electric_piano_2": 30,
				"harpsichord": 40,
				"clavinet": 20,
				"celesta": 20,
				"glockenspiel": 40,
				"vibraphone": 30,
				"marimba": 35,
				"xylophone": 30,
				"tubular_bells": 35,
				"dulcimer": 30,
				"drawbar_organ": 20,
				"percussive_organ": 25,
				"rock_organ": 20,
				"church_organ": 40,
				"reed_organ": 40,
				"accordion": 40,
				"harmonica": 40,
				"acoustic_guitar_nylon": 20,
				"acoustic_guitar_steel": 30,
				"electric_guitar_jazz": 25,
				"electric_guitar_clean": 15,
				"electric_guitar_muted": 35,
				"overdriven_guitar": 25,
				"distortion_guitar": 20,
				"guitar_harmonics": 30,
				"electric_bass_finger": 15,
				"electric_bass_pick": 30,
				"fretless_bass": 40,
				"violin": 105,
				"viola": 50,
				"cello": 40,
				"contrabass": 60,
				"trumpet": 10,
				"trombone": 90,
				"alto_sax": 20,
				"tenor_sax": 20,
				"clarinet": 20,
				"flute": 50,
				"banjo": 50,
				"woodblock": 20,
			};
		else
			self.programOffsets = {};
		var p = params.fadeLength !== undefined ? parseInt(params.fadeLength,10) : NaN;
		self.fadeLength = isNaN(p) ? 200 : p;
		p = params.noteEnd !== undefined ? parseInt(params.noteEnd,10) : NaN;
		self.noteEnd = isNaN(p) ? 0 : p;

		self.pan = params.pan;
		self.meterSize = 1;
		if (options.visualObj) {
			self.flattened = options.visualObj.setUpAudio(params);
			var meter = options.visualObj.getMeterFraction();
			if (meter.den)
				self.meterSize = options.visualObj.getMeterFraction().num / options.visualObj.getMeterFraction().den;
		} else if (options.sequence)
			self.flattened = options.sequence;
		else
			return Promise.reject(new Error("Must pass in either a visualObj or a sequence"));
		self.millisecondsPerMeasure = options.millisecondsPerMeasure ? options.millisecondsPerMeasure : (options.visualObj ? options.visualObj.millisecondsPerMeasure(self.flattened.tempo) : 1000);
		self.beatsPerMeasure = options.visualObj ? options.visualObj.getBeatsPerMeasure() : 4;
		self.sequenceCallback = params.sequenceCallback;
		self.callbackContext = params.callbackContext;
		self.onEnded = params.onEnded;

		var allNotes = {};
		var cached = [];
		var errorNotes = [];
		var currentInstrument = instrumentIndexToName[0];
		self.flattened.tracks.forEach(function(track) {
			track.forEach(function(event) {
				if (event.cmd === "program" && instrumentIndexToName[event.instrument])
					currentInstrument = instrumentIndexToName[event.instrument];
				if (event.pitch !== undefined) {
					var pitchNumber = event.pitch;
					var noteName = pitchToNoteName[pitchNumber];
					if (noteName) {
						if (!allNotes[currentInstrument])
							allNotes[currentInstrument] = {};
						if (!soundsCache[currentInstrument] || !soundsCache[currentInstrument][noteName])
							allNotes[currentInstrument][noteName] = true;
						else {
							var label2 = currentInstrument+":"+noteName
							if (cached.indexOf(label2) < 0)
								cached.push(label2);
						}
					} else {
						var label = currentInstrument+":"+noteName
						console.log("Can't find note: ", pitchNumber, label);
						if (errorNotes.indexOf(label) < 0)
							errorNotes.push(label)
					}
				}
			});
		});
		if (self.debugCallback)
			self.debugCallback("note gathering time = " + Math.floor((activeAudioContext().currentTime - startTime)*1000)+"ms");
		startTime = activeAudioContext().currentTime;

		var notes = [];
		Object.keys(allNotes).forEach(function(instrument) {
			Object.keys(allNotes[instrument]).forEach(function(note) {
				notes.push({ instrument: instrument, note: note });
			});
		});
		if (self.debugCallback)
			self.debugCallback("notes "+JSON.stringify(notes));

		// If there are lots of notes, load them in batches
		var batches = [];
		var CHUNK = 256;
		for (var i=0; i < notes.length; i += CHUNK) {
			batches.push(notes.slice(i, i + CHUNK));
		}

		return new Promise(function(resolve, reject) {
			var results = {
				cached: cached,
				error: errorNotes,
				loaded: []
			};

			var index = 0;
			var next = function() {
				if (self.debugCallback)
					self.debugCallback("loadBatch idx="+index+ " len="+batches.length);
	
				if (index < batches.length) {
					self._loadBatch(batches[index], self.soundFontUrl, startTime).then(function(data) {
						if (self.debugCallback)
							self.debugCallback("loadBatch then");
						startTime = activeAudioContext().currentTime;
						if (data) {
							if (data.error)
								results.error = results.error.concat(data.error);
							if (data.loaded)
								results.loaded = results.loaded.concat(data.loaded);
						}
						index++;
						next();
					}, reject);
				} else {
					if (self.debugCallback)
						self.debugCallback("resolve init");
		
					resolve(results);
				}
			};
			next();
		});
	};

	self._loadBatch = (function(batch, soundFontUrl, startTime, delay) {
		// This is called recursively to see if the sounds have loaded. The "delay" parameter is how long it has been since the original call.
		var promises = [];
		batch.forEach(function(item) {
			if (self.debugCallback)
				self.debugCallback("getNote " + item.instrument+':'+item.note);
			promises.push(getNote(soundFontUrl, item.instrument, item.note, activeAudioContext()));
		});
		return Promise.all(promises).then(function(response) {
			if (self.debugCallback)
				self.debugCallback("mp3 load time = " + Math.floor((activeAudioContext().currentTime - startTime)*1000)+"ms");
			var loaded = [];
			var cached = [];
			var pending = [];
			var error = [];
			for (var i = 0; i < response.length; i++) {
				var oneResponse = response[i];
				var which = oneResponse.instrument + ":" + oneResponse.name;
				if (oneResponse.status === "loaded")
					loaded.push(which);
				else if (oneResponse.status === "pending")
					pending.push(which);
				else if (oneResponse.status === "cached")
					cached.push(which);
				else
					error.push(which + ' ' + oneResponse.message);
			}
			if (pending.length > 0) {
				if (self.debugCallback)
					self.debugCallback("pending " + JSON.stringify(pending));
				// There was probably a second call for notes before the first one finished, so just retry a few times to see if they stop being pending.
				// Retry quickly at first so that there isn't an unnecessary delay, but increase the delay each time.
				if (!delay)
					delay = 50;
				else
					delay = delay * 2;
				if (delay < 90000) {
					return new Promise(function (resolve, reject) {
						setTimeout(function () {
							var newBatch = [];
							for (i = 0; i < pending.length; i++) {
								which = pending[i].split(":");
								newBatch.push({instrument: which[0], note: which[1]});
							}
							if (self.debugCallback)
								self.debugCallback("retry " + JSON.stringify(newBatch));
									self._loadBatch(newBatch, soundFontUrl, startTime, delay).then(function (response) {
								resolve(response);
							}).catch(function (error) {
								reject(error);
							});
						}, delay);
					});
				} else {
					var list = [];
					for (var j = 0; j < batch.length; j++)
						list.push(batch[j].instrument+'/'+batch[j].note)
						if (self.debugCallback)
							self.debugCallback("loadBatch timeout")
						return Promise.reject(new Error("timeout attempting to load: " + list.join(", ")));
				}
			} else {
				if (self.debugCallback)
					self.debugCallback("loadBatch resolve")
				return Promise.resolve({loaded: loaded, cached: cached, error: error});
			}
		}).catch(function (error) {
			if (self.debugCallback)
				self.debugCallback("loadBatch catch "+error.message)
		});
	});

	self.prime = function() {
		// At this point all of the notes are loaded. This function writes them into the output buffer.
		// Most music has a lot of repeating notes. If a note is the same pitch, volume, length, etc. as another one,
		// It saves a lot of time to just create it once and place it repeatedly where ever it needs to be.
		var fadeTimeSec = self.fadeLength/1000;
		self.isRunning = false;
		if (!self.audioBufferPossible)
			return Promise.reject(new Error(notSupportedMessage));
		if (self.debugCallback)
			self.debugCallback("prime called");
		return new Promise(function(resolve) {
			var startTime = activeAudioContext().currentTime;
			var tempoMultiplier = self.millisecondsPerMeasure / 1000 / self.meterSize;
			self.duration = self.flattened.totalDuration * tempoMultiplier;
			if(self.duration <= 0) {
				self.audioBuffers = [];
				return resolve({ status: "empty", seconds: 0});
			}
			self.duration += fadeTimeSec;
			var totalSamples = Math.floor(activeAudioContext().sampleRate * self.duration);

			// There might be a previous run that needs to be turned off.
			self.stop();

			var noteMapTracks = createNoteMap(self.flattened);
			// if (self.options.swing)
			// 	addSwing(noteMapTracks, self.options.swing, self.beatsPerMeasure)
			if (self.sequenceCallback)
				self.sequenceCallback(noteMapTracks, self.callbackContext);

			var panDistances = setPan(noteMapTracks.length, self.pan);

			// Create a simple list of all the unique sounds in this music and where they should be placed.
			// There appears to be a limit on how many audio buffers can be created at once so this technique limits the number needed.
			var uniqueSounds = {};
			noteMapTracks.forEach(function(noteMap, trackNumber) {
				var panDistance = panDistances && panDistances.length > trackNumber ? panDistances[trackNumber] : 0;
				noteMap.forEach(function(note) {
					var key = note.instrument + ':' + note.pitch + ':' +note.volume + ':' + Math.round((note.end-note.start)*1000)/1000 + ':' + panDistance + ':' + tempoMultiplier + ':' + (note.cents ? note.cents : 0);
					if (self.debugCallback)
						self.debugCallback("noteMapTrack "+key)
					if (!uniqueSounds[key])
						uniqueSounds[key] = [];
					uniqueSounds[key].push(note.start);
				});
			});

			// Now that we know what we are trying to create, construct the audio buffer by creating each sound and placing it.
			var allPromises = [];
			var audioBuffer = activeAudioContext().createBuffer(2, totalSamples, activeAudioContext().sampleRate);
			for (var key2 = 0; key2 < Object.keys(uniqueSounds).length; key2++) {
				var k = Object.keys(uniqueSounds)[key2];
				var parts = k.split(":");
				var cents = parts[6] !== undefined ? parseFloat(parts[6]) : 0;
				parts = {instrument: parts[0], pitch: parseInt(parts[1], 10), volume: parseInt(parts[2], 10), len: parseFloat(parts[3]), pan: parseFloat(parts[4]), tempoMultiplier: parseFloat(parts[5]), cents: cents};
				allPromises.push(placeNote(audioBuffer, activeAudioContext().sampleRate, parts, uniqueSounds[k], self.soundFontVolumeMultiplier, self.programOffsets[parts.instrument], fadeTimeSec, self.noteEnd/1000, self.debugCallback));
			}
			self.audioBuffers = [audioBuffer];

			if (self.debugCallback) {
				self.debugCallback("sampleRate = " + activeAudioContext().sampleRate);
				self.debugCallback("totalSamples = " + totalSamples);
				self.debugCallback("creationTime = " + Math.floor((activeAudioContext().currentTime - startTime)*1000) + "ms");
			}
			function resolveData(me) {
				var duration = me && me.audioBuffers && me.audioBuffers.length > 0 ? me.audioBuffers[0].duration : 0;
				return { status: activeAudioContext().state, duration: duration}
			}
			Promise.all(allPromises).then(function() {
				// Safari iOS can mess with the audioContext state, so resume if needed.
				if (activeAudioContext().state === "suspended") {
					activeAudioContext().resume().then(function () {
						resolve(resolveData(self));
					})
				} else if (activeAudioContext().state === "interrupted") {
					activeAudioContext().suspend().then(function () {
						activeAudioContext().resume().then(function () {
							resolve(resolveData(self));
						})
					})
				} else {
					resolve(resolveData(self));
				}
			});
		});
	};

	function setPan(numTracks, panParam) {
		// panParam, if it is set, can be either a number representing the separation between each track,
		// or an array, which is the absolute pan position for each track.
		if (panParam === null || panParam === undefined)
			return null;

		var panDistances = [];
		if (panParam.length) {
			// We received an array. If there are the same number of items in the pan array as the number of tracks,
			// it all lines up perfectly. If there are more items in the pan array than the tracks then the excess items are ignored.
			// If there are more tracks than items in the pan array then the remaining tracks are placed in the middle.
			// If any of the pan numbers are out of range then they are adjusted.
			for (var pp = 0; pp < numTracks; pp++) {
				if (pp < panParam.length) {
					var x = parseFloat(panParam[pp]);
					if (x < -1)
						x = -1;
					else if (x > 1)
						x = 1;
					panDistances.push(x);
				} else
					panDistances.push(0)
			}
			return panDistances;
		} else {
			var panNumber = parseFloat(panParam);
			// the separation needs to be no further than 2 (i.e. -1 to 1) so test to see if there are too many tracks for the passed in distance
			if (panNumber*(numTracks-1) > 2)
				return null;

			// If there are an even number of tracks, then offset so that the first two are centered around the middle
			var even = numTracks % 2 === 0;
			var currLow = even ? 0 - panNumber/2 : 0;
			var currHigh = currLow+panNumber;
			// Now add the tracks to either side
			for (var p = 0; p < numTracks; p++) {
				even = p % 2 === 0;
				if (even) {
					panDistances.push(currLow);
					currLow -= panNumber;
				} else {
					panDistances.push(currHigh);
					currHigh += panNumber;
				}
			}
			return panDistances;
		}
		// There was either no panning, or the parameters were illegal
		return null;
	}

	// This is called after everything is set up, so it can quickly make sound
	self.start = function() {
		if (!self.audioBufferPossible)
			throw new Error(notSupportedMessage);
		if (self.debugCallback)
			self.debugCallback("start called");

		var resumePosition = self.pausedTimeSec ? self.pausedTimeSec : 0;
		self._kickOffSound(resumePosition);
		self.startTimeSec = activeAudioContext().currentTime - resumePosition;
		self.pausedTimeSec = undefined;

		if (self.debugCallback)
			self.debugCallback("MIDI STARTED", self.startTimeSec);
	};

	self.pause = function() {
		if (!self.audioBufferPossible)
			throw new Error(notSupportedMessage);
		if (self.debugCallback)
			self.debugCallback("pause called");

		self.pausedTimeSec = self.stop();
		return self.pausedTimeSec;
	};

	self.resume = function() {
		self.start();
	};

	self.seek = function(position, units) {
		var offset;
		switch (units) {
			case "seconds":
				offset = position;
				break;
			case "beats":
				offset = position * self.millisecondsPerMeasure / self.beatsPerMeasure / 1000;
				break;
			default:
				// this is "percent" or any illegal value
				offset = (self.duration-self.fadeLength/1000) * position;
				break;
		}

		// TODO-PER: can seek when paused or when playing
		if (!self.audioBufferPossible)
			throw new Error(notSupportedMessage);
		if (self.debugCallback)
			self.debugCallback("seek called sec=" + offset);

		if (self.isRunning) {
			self.stop();
			self._kickOffSound(offset);
		} else {
			self.pausedTimeSec = offset;
		}
		self.pausedTimeSec = offset;
	};

	self.stop = function() {
		self.isRunning = false;
		self.pausedTimeSec = undefined;
		self.directSource.forEach(function(source) {
			try {
				source.stop();
			} catch (error) {
				// We don't care if self succeeds: it might fail if something else turned off the sound or it ended for some reason.
				console.log("direct source didn't stop:", error)
			}
		});
		self.directSource = [];
		var elapsed = activeAudioContext().currentTime - self.startTimeSec;
		return elapsed;
	};
	self.finished = function() {
		self.startTimeSec = undefined;
		self.pausedTimeSec = undefined;
		self.isRunning = false;
	};

	self.download = function() {
		return downloadBuffer(self);
	};

	self.getAudioBuffer = function() {
		return self.audioBuffers[0];
	};

	/////////////// Private functions //////////////

	self._deviceCapable = function() {
		if (!supportsAudio()) {
			console.warn(notSupportedMessage);
			if (self.debugCallback)
				self.debugCallback(notSupportedMessage);
			return false;
		}
		return true;
	};

	self._kickOffSound = function(seconds) {
		self.isRunning = true;
		self.directSource = [];
		self.audioBuffers.forEach(function(audioBuffer, trackNum) {
			self.directSource[trackNum] = activeAudioContext().createBufferSource(); // creates a sound source
			self.directSource[trackNum].buffer = audioBuffer; // tell the source which sound to play
			self.directSource[trackNum].connect(activeAudioContext().destination); // connect the source to the context's destination (the speakers)
		});
		self.directSource.forEach(function(source) {
			source.start(0, seconds);
		});
		if (self.onEnded) {
			self.directSource[0].onended = function () {
				self.onEnded(self.callbackContext);
			};
		}
	};

	// // this is a first attempt at adding a little bit of swing to the output, but the algorithm isn't correct.
	// function addSwing(noteMapTracks, swing, beatsPerMeasure) {
	// 	console.log("addSwing", noteMapTracks, swing, beatsPerMeasure)
	// 	// Swing should be between -0.9 and 0.9. Make sure the input is between them.
	// 	// Then that is the percentage to add to the first beat, so a negative number moves the second beat earlier.
	// 	// A value of zero is the same as no swing at all.
	// 	// This only works when there are an even number of beats in a measure.
	// 	if (beatsPerMeasure % 2 !== 0)
	// 		return;
	// 	swing = parseFloat(swing)
	// 	if (isNaN(swing))
	// 		return
	// 	if (swing < -0.9)
	// 		swing = -0.9
	// 	if (swing > 0.9)
	// 		swing = 0.9
	// 	var beatLength = (1 / beatsPerMeasure)*2
	// 	swing = beatLength * swing
	// 	for (var t = 0; t < noteMapTracks.length; t++) {
	// 		var track = noteMapTracks[t];
	// 		for (var i = 0; i < track.length; i++) {
	// 			var event = track[i];
	// 			if (event.start % beatLength) {
	// 				// This is the off beat
	// 				event.start += swing;
	// 			} else {
	// 				// This is the beat
	// 				event.end += swing;
	// 			}
	// 		}
	// 	}
	// }
}

module.exports = CreateSynth;
