//    Copyright (C) 2019-2020 Paul Rosen (paul at paulrosen dot net)
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

var getNote = require('./load-note');
var createNoteMap = require('./create-note-map');
var registerAudioContext = require('./register-audio-context');
var activeAudioContext = require('./active-audio-context');
var supportsAudio = require('./supports-audio');
var pitchToNoteName = require('./pitch-to-note-name');
var instrumentIndexToName = require('./instrument-index-to-name');
var downloadBuffer = require('./download-buffer');
var sequence = require('../midi/abc_midi_sequencer');
var flatten = require('../midi/abc_midi_flattener');
var placeNote = require('./place-note');

// TODO-PER: remove the midi tests from here: I don't think the object can be constructed unless it passes.
var notSupportedMessage = "MIDI is not supported in this browser.";

var defaultSoundFontUrl = "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/";


function CreateSynth() {
	var self = this;
	self.audioBufferPossible = undefined;
	self.directSource = []; // type: AudioBufferSourceNode
	self.startTimeSec = undefined; // the time that the midi started: used for pause/resume.
	self.pausedTimeSec = undefined; // the time that the midi was paused: used for resume.
	self.audioBuffers = []; // cache of the buffers so starting play can be fast.
	self.duration = undefined; // the duration of the tune in seconds.
	self.isRunning = false; // whether there is currently a sound buffer running.

	// Load and cache all needed sounds
	self.init = function(options) {
		if (!options)
			options = {};
		registerAudioContext(options.audioContext); // This works no matter what - if there is already an ac it is a nop; if the context is not passed in, then it creates one.
		var startTime = activeAudioContext().currentTime;
		self.debugCallback = options.debugCallback;
		if (self.debugCallback)
			self.debugCallback("init called");
		self.audioBufferPossible = self._deviceCapable();
		if (!self.audioBufferPossible)
			return Promise.reject({ status: "NotSupported", message: notSupportedMessage});
		self.soundFontUrl = options.soundFontUrl ? options.soundFontUrl : defaultSoundFontUrl;
		self.millisecondsPerMeasure = options.millisecondsPerMeasure ? options.millisecondsPerMeasure : (options.visualObj ? options.visualObj.millisecondsPerMeasure() : 1000);
		var params = options.options ? options.options : {};
		self.pan = params.pan;
		self.meterSize = 1;
		if (options.visualObj) {
			var seq = sequence(options.visualObj, params);
			self.flattened = flatten(seq, params);
			self.meterSize = options.visualObj.getMeterFraction().num / options.visualObj.getMeterFraction().den;
		} else if (options.sequence)
			self.flattened = options.sequence;
		else
			return Promise.reject(new Error("Must pass in either a visualObj or a sequence"));
		self.sequenceCallback = params.sequenceCallback;
		self.callbackContext = params.callbackContext;
		self.onEnded = options.onEnded;

		var allNotes = {};
		var currentInstrument = instrumentIndexToName[0];
		self.flattened.tracks.forEach(function(track) {
			track.forEach(function(event) {
				if (event.cmd === "program" && instrumentIndexToName[event.instrument])
					currentInstrument = instrumentIndexToName[event.instrument];
				if (event.pitch !== undefined) {
					var pitchNumber = event.pitch + 60;
					var noteName = pitchToNoteName[pitchNumber];
					if (noteName) {
						if (!allNotes[currentInstrument])
							allNotes[currentInstrument] = {};
						allNotes[currentInstrument][pitchToNoteName[pitchNumber]] = true;
					} else
						console.log("Can't find note: ", pitchNumber);
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
		// If there are lots of notes, load them in batches
		var batches = [];
		var CHUNK = 256;
		for (var i=0; i < notes.length; i += CHUNK) {
			batches.push(notes.slice(i, i + CHUNK));
		}

		return new Promise(function(resolve, reject) {
			var results = [];

			var index = 0;
			var next = function() {
				if (index < batches.length) {
					self._loadBatch(batches[index], self.soundFontUrl, startTime).then(function(data) {
						startTime = activeAudioContext().currentTime;
						results.push(data);
						index++;
						next();
					}, reject);
				} else {
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
							self._loadBatch(newBatch, soundFontUrl, startTime, delay).then(function (response) {
								resolve(response);
							});
						}, delay);
					});
				} else
					return Promise.reject(new Error("time out attempting to load: " + batch.join("/")));
			} else
				return Promise.resolve({loaded: loaded, cached: cached, error: error});
		});
	});

	self.prime = function() {
		// At this point all of the notes are loaded. This function writes them into the output buffer.
		// Most music has a lot of repeating notes. If a note is the same pitch, volume, length, etc. as another one,
		// It saves a lot of time to just create it once and place it repeatedly where ever it needs to be.
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
			var totalSamples = Math.floor(activeAudioContext().sampleRate * self.duration);

			// There might be a previous run that needs to be turned off.
			self.stop();

			var noteMapTracks = createNoteMap(self.flattened);
			if (self.sequenceCallback)
				self.sequenceCallback(noteMapTracks, self.callbackContext);

			var panDistances = setPan(noteMapTracks.length, self.pan);

			// Create a simple list of all the unique sounds in this music and where they should be placed.
			// There appears to be a limit on how many audio buffers can be created at once so this technique limits the number needed.
			var uniqueSounds = {};
			noteMapTracks.forEach(function(noteMap, trackNumber) {
				var panDistance = panDistances && panDistances.length > trackNumber ? panDistances[trackNumber] : 0;
				noteMap.forEach(function(note) {
					var key = note.instrument + ':' + note.pitch + ':' +note.volume + ':' + (note.end-note.start) + ':' + panDistance + ':' + tempoMultiplier;
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
				parts = { instrument: parts[0], pitch: parseInt(parts[1],10), volume: parseInt(parts[2], 10), len: parseFloat(parts[3]), pan: parseFloat(parts[4]), tempoMultiplier: parseFloat(parts[5])};
				allPromises.push(placeNote(audioBuffer, activeAudioContext().sampleRate, parts, uniqueSounds[k]));
			}
			self.audioBuffers = [audioBuffer];

			if (self.debugCallback) {
				self.debugCallback("sampleRate = " + activeAudioContext().sampleRate);
				self.debugCallback("totalSamples = " + totalSamples);
				self.debugCallback("creationTime = " + Math.floor((activeAudioContext().currentTime - startTime)*1000) + "ms");
			}
			Promise.all(allPromises).then(function() {
				resolve({
					status: "ok",
					seconds: 0
				});
			});
		});
	};

	function setPan(numTracks, panParam) {
		if (panParam === null || panParam === undefined)
			return null;

		var panDistances = [];
		if (panParam.length) {
			if (numTracks === panParam.length) {
				var ok = true;
				for (var pp = 0; pp < panParam.length; pp++){
					var x = parseFloat(panParam[pp]);
					if (x >= -1 && x <= 1)
						panDistances.push(x);
					else
						ok = false;
				}
				if (ok)
					return panDistances;
			}
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
		if (self.pausedTimeSec) {
			self.resume();
			return;
		}

		if (!self.audioBufferPossible)
			throw new Error(notSupportedMessage);
		if (self.debugCallback)
			self.debugCallback("start called");

		self._kickOffSound(0);
		self.startTimeSec = activeAudioContext().currentTime;
		self.pausedTimeSec = undefined;

		if (self.debugCallback)
			self.debugCallback("MIDI STARTED", self.startTimeSec);
	};

	self.pause = function() {
		if (!self.audioBufferPossible)
			throw new Error(notSupportedMessage);
		if (self.debugCallback)
			self.debugCallback("pause called");

		if (!self.pausedTimeSec) { // ignore if self is already paused.
			self.stop();
			self.pausedTimeSec = activeAudioContext().currentTime;
		}
	};

	self.resume = function() {
		if (!self.audioBufferPossible)
			throw new Error(notSupportedMessage);
		if (self.debugCallback)
			self.debugCallback("resume called");

		var offset = self.pausedTimeSec - self.startTimeSec;
		self.startTimeSec = activeAudioContext().currentTime - offset; // We move the start time in case there is another pause/resume.
		self.pausedTimeSec = undefined;
		self._kickOffSound(offset);
	};

	self.seek = function(percent) {
		var offset = self.duration * percent;

		// TODO-PER: can seek when paused or when playing
		if (!self.audioBufferPossible)
			throw new Error(notSupportedMessage);
		if (self.debugCallback)
			self.debugCallback("seek called sec=" + offset);

		if (self.isRunning) {
			self.stop();
			self._kickOffSound(offset);
		}
		var pauseDistance = self.pausedTimeSec ? self.pausedTimeSec - self.startTimeSec : undefined;
		self.startTimeSec = activeAudioContext().currentTime - offset;
		if (self.pausedTimeSec)
			self.pausedTimeSec = self.startTimeSec + pauseDistance;
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
	};

	self.download = function() {
		return downloadBuffer(self);
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
}

module.exports = CreateSynth;
