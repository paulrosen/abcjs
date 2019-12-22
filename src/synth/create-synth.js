var getNote = require('./load-note');
var soundsCache = require('./sounds-cache');
var createNoteMap = require('./create-note-map');
var registerAudioContext = require('./register-audio-context');
var activeAudioContext = require('./active-audio-context');
var supportsAudio = require('./supports-audio');
var pitchToNoteName = require('./pitch-to-note-name');
var instrumentIndexToName = require('./instrument-index-to-name');
var downloadBuffer = require('./download-buffer');
var sequence = require('../midi/abc_midi_sequencer');
var flatten = require('../midi/abc_midi_flattener');

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

	self._loadBatch = (function(batch, soundFontUrl, startTime) {
		var promises = [];
		batch.forEach(function(item) {
			promises.push(getNote(soundFontUrl, item.instrument, item.note, activeAudioContext()));
		});
		return Promise.all(promises).then(function(response) {
			if (self.debugCallback)
				self.debugCallback("mp3 load time = " + Math.floor((activeAudioContext().currentTime - startTime)*1000)+"ms");
			return Promise.resolve(response);
		});
	});

	self.prime = function() {
		self.isRunning = false;
		if (!self.audioBufferPossible)
			return Promise.reject(new Error(notSupportedMessage));
		if (self.debugCallback)
			self.debugCallback("prime called");
		return new Promise(function(resolve) {
			var startTime = activeAudioContext().currentTime;
			var tempoMultiplier = self.millisecondsPerMeasure / 1000 / self.meterSize;
			self.duration = self.flattened.totalDuration * tempoMultiplier;
			var totalSamples = Math.floor(activeAudioContext().sampleRate * self.duration);

			// There might be a previous run that needs to be turned off.
			self.stop();

			var noteMapTracks = createNoteMap(self.flattened);
			if (self.sequenceCallback)
				self.sequenceCallback(noteMapTracks, self.callbackContext);
			//console.log(noteMapTracks);

			self.audioBuffers = [];
			noteMapTracks.forEach(function(noteMap) {
				var audioBuffer = activeAudioContext().createBuffer(1, totalSamples, activeAudioContext().sampleRate);
				var chanData = audioBuffer.getChannelData(0);

				noteMap.forEach(function(note) {
					self._placeNote(chanData, note, tempoMultiplier, soundsCache);
				});

				self.audioBuffers.push(audioBuffer);
			});

			if (self.debugCallback) {
				self.debugCallback("sampleRate = " + activeAudioContext().sampleRate);
				self.debugCallback("totalSamples = " + totalSamples);
				self.debugCallback("creationTime = " + Math.floor((activeAudioContext().currentTime - startTime)*1000) + "ms");
			}
			resolve({
				status: "ok",
				seconds: 0
			});
		});
	};

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

	self._placeNote = function(chanData, note, tempoMultiplier, soundsCache) {
		var start = Math.floor(note.start*activeAudioContext().sampleRate * tempoMultiplier);
		var numBeats = note.end - note.start;
		var noteTimeSec = numBeats * tempoMultiplier;
		var noteName = pitchToNoteName[note.pitch+60];
		if (noteName) { // Just ignore pitches that don't exist.
			var pitch = soundsCache[note.instrument][noteName].getChannelData(0);
			var duration = Math.min(pitch.length, Math.floor(noteTimeSec * activeAudioContext().sampleRate));
			//console.log(pitchToNote[note.pitch+''], start, numBeats, noteTimeSec, duration);
			for (var i = 0; i < duration; i++) {
				var thisSample = pitch[i] * note.volume / 128;
				if (chanData[start + i])
					chanData[start + i] = (chanData[start + i] + thisSample) *0.75;
				else
					chanData[start + i] = thisSample;
			}
		}
	};
}

module.exports = CreateSynth;
