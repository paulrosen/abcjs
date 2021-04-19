var CreateSynthControl = require('./create-synth-control');
var CreateSynth = require('./create-synth');
var TimingCallbacks = require('../api/abc_timing_callbacks');
var activeAudioContext = require('./active-audio-context');

function SynthController() {
	var self = this;
	self.warp = 100;
	self.cursorControl = null;
	self.visualObj = null;
	self.timer = null;
	self.midiBuffer = null;
	self.options = null;
	self.currentTempo = null;
	self.control = null;
	self.isLooping = false;
	self.isStarted = false;
	self.isLoaded = false;
	self.isLoading = false;

	self.load = function (selector, cursorControl, visualOptions) {
		if (!visualOptions)
			visualOptions = {};
		self.control = new CreateSynthControl(selector, {
			loopHandler: visualOptions.displayLoop ? self.toggleLoop : undefined,
			restartHandler: visualOptions.displayRestart ? self.restart : undefined,
			playPromiseHandler: visualOptions.displayPlay ? self.play : undefined,
			progressHandler: visualOptions.displayProgress ? self.randomAccess : undefined,
			warpHandler: visualOptions.displayWarp ? self.onWarp : undefined,
			afterResume: self.init
		});
		self.cursorControl = cursorControl;
		self.disable(true);
	};

	self.disable = function(isDisabled) {
		if (self.control)
			self.control.disable(isDisabled);
	};

	self.setTune = function(visualObj, userAction, audioParams) {
		self.visualObj = visualObj;
		self.disable(false);
		self.options = audioParams;

		if (self.control) {
			self.pause();
			self.setProgress(0, 1);
			self.control.resetAll();
			self.restart();
			self.isStarted = false;
		}
		self.isLooping = false;

		if (userAction)
			return self.go();
		else {
			return Promise.resolve({status: "no-audio-context"});
		}
	};

	self.go = function () {
		self.isLoading = true;
		var millisecondsPerMeasure = self.visualObj.millisecondsPerMeasure() * 100 / self.warp;
		self.currentTempo = Math.round(self.visualObj.getBeatsPerMeasure() / millisecondsPerMeasure * 60000);
		if (self.control)
			self.control.setTempo(self.currentTempo);
		self.percent = 0;
		var loadingResponse;

		if (!self.midiBuffer)
			self.midiBuffer = new CreateSynth();
		return activeAudioContext().resume().then(function (response) {
			return self.midiBuffer.init({
				visualObj: self.visualObj,
				options: self.options,
				millisecondsPerMeasure: millisecondsPerMeasure
			});
		}).then(function (response) {
			loadingResponse = response;
			return self.midiBuffer.prime();
		}).then(function () {
			var subdivisions = 16;
			if (self.cursorControl &&
				self.cursorControl.beatSubdivisions !== undefined &&
				parseInt(self.cursorControl.beatSubdivisions, 10) >= 1 &&
				parseInt(self.cursorControl.beatSubdivisions, 10) <= 64)
				subdivisions = parseInt(self.cursorControl.beatSubdivisions, 10);

			// Need to create the TimingCallbacks after priming the midi so that the midi data is available for the callbacks.
			self.timer = new TimingCallbacks(self.visualObj, {
				beatCallback: self.beatCallback,
				eventCallback: self.eventCallback,
				lineEndCallback: self.lineEndCallback,
				qpm: self.currentTempo,

				extraMeasuresAtBeginning: self.cursorControl ? self.cursorControl.extraMeasuresAtBeginning : undefined,
				lineEndAnticipation: self.cursorControl ? self.cursorControl.lineEndAnticipation : 0,
				beatSubdivisions: subdivisions,
			});
			if (self.cursorControl && self.cursorControl.onReady && typeof self.cursorControl.onReady  === 'function')
				self.cursorControl.onReady(self);
			self.isLoaded = true;
			self.isLoading = false;
			return Promise.resolve({ status: "created", notesStatus: loadingResponse });
		});
	};

	self.destroy = function () {
		if (self.timer) {
			self.timer.reset();
			self.timer.stop();
			self.timer = null;
		}
		if (self.midiBuffer) {
			self.midiBuffer.stop();
			self.midiBuffer = null;
		}
		self.setProgress(0, 1);
		if (self.control)
			self.control.resetAll();
	};

	self.play = function () {
		return self.runWhenReady(self._play, undefined);
	};

	function sleep(ms) {
		return new Promise(function (resolve) {
			setTimeout(resolve, ms)
		});
	}

	self.runWhenReady = function(fn, arg1) {
		if (!self.visualObj)
			return Promise.resolve({status: "loading"});
		if (self.isLoading) {
			// Some other promise is waiting for the tune to be loaded, so just wait.
			return sleep(500).then(function() {
				if (self.isLoading)
					return self.runWhenReady(fn, arg1);
				return fn(arg1);
			})
		} else if (!self.isLoaded) {
			return self.go().then(function () {
				return fn(arg1);
			});
		} else {
			return fn(arg1);
		}
	};

	self._play = function () {
		return activeAudioContext().resume().then(function () {
			self.isStarted = !self.isStarted;
			if (self.isStarted) {
				if (self.cursorControl && self.cursorControl.onStart && typeof self.cursorControl.onStart === 'function')
					self.cursorControl.onStart();
				self.midiBuffer.start();
				self.timer.start(self.percent);
				if (self.control)
					self.control.pushPlay(true);
			} else {
				self.pause();
			}
			return Promise.resolve({status: "ok"});
		})
	};

	self.pause = function() {
		if (self.timer) {
			self.timer.pause();
			self.midiBuffer.pause();
			if (self.control)
				self.control.pushPlay(false);
		}
	};

	self.toggleLoop = function () {
		self.isLooping = !self.isLooping;
		if (self.control)
			self.control.pushLoop(self.isLooping);
	};

	self.restart = function () {
		if (self.timer) {
			self.timer.setProgress(0);
			self.midiBuffer.seek(0);
		}
	};

	self.randomAccess = function (ev) {
		return self.runWhenReady(self._randomAccess, ev);
	};

	self._randomAccess = function (ev) {
		var background = (ev.target.classList.contains('abcjs-midi-progress-indicator')) ? ev.target.parentNode : ev.target;
		var percent = (ev.x - background.offsetLeft) / background.offsetWidth;
		if (percent < 0)
			percent = 0;
		if (percent > 1)
			percent = 1;
		self.seek(percent);
		return Promise.resolve({status: "ok"});
	};

	self.seek = function (percent, units) {
		if (self.timer && self.midiBuffer) {
			self.timer.setProgress(percent, units);
			self.midiBuffer.seek(percent, units);
		}
	};

	self.setWarp = function (newWarp) {
		if (parseInt(newWarp, 10) > 0) {
			self.warp = parseInt(newWarp, 10);
			var wasPlaying = self.isStarted;
			var startPercent = self.percent;
			self.destroy();
			self.isStarted = false;
			return self.go().then(function () {
				self.setProgress(startPercent, self.midiBuffer.duration * 1000);
				if (self.control)
					self.control.setWarp(self.currentTempo, self.warp);
				if (wasPlaying) {
					return self.play().then(function () {
						self.seek(startPercent);
						return Promise.resolve();
					});
				}
				self.seek(startPercent);
				return Promise.resolve();
			});
		}
		return Promise.resolve();
	};

	self.onWarp = function (ev) {
		var newWarp = ev.target.value;
		return self.setWarp(newWarp);
	};

	self.setProgress = function (percent, totalTime) {
		self.percent = percent;
		if (self.control)
			self.control.setProgress(percent, totalTime);
	};

	self.finished = function () {
		self.timer.reset();
		if (self.isLooping) {
			self.timer.start(0);
			self.midiBuffer.finished();
			self.midiBuffer.start();
			return "continue";
		} else {
			self.timer.stop();
			if (self.isStarted) {
				if (self.control)
					self.control.pushPlay(false);
				self.isStarted = false;
				self.midiBuffer.finished();
				if (self.cursorControl && self.cursorControl.onFinished && typeof self.cursorControl.onFinished  === 'function')
					self.cursorControl.onFinished();
				self.setProgress(0, 1);
			}
		}
	};

	self.beatCallback = function (beatNumber, totalBeats, totalTime, position) {
		var percent = beatNumber / totalBeats;
		self.setProgress(percent, totalTime);
		if (self.cursorControl && self.cursorControl.onBeat && typeof self.cursorControl.onBeat  === 'function')
			self.cursorControl.onBeat(beatNumber, totalBeats, totalTime, position);
	};

	self.eventCallback = function (event) {
		if (event) {
			if (self.cursorControl && self.cursorControl.onEvent && typeof self.cursorControl.onEvent  === 'function')
				self.cursorControl.onEvent(event);
		} else {
			return self.finished();
		}
	};

	self.lineEndCallback = function (lineEvent, leftEvent) {
		if (self.cursorControl && self.cursorControl.onLineEnd && typeof self.cursorControl.onLineEnd  === 'function')
			self.cursorControl.onLineEnd(lineEvent, leftEvent);
	};

	self.getUrl = function () {
		return self.midiBuffer.download();
	};

	self.download = function(fileName) {
		var url = self.getUrl();
		var link = document.createElement('a');
		document.body.appendChild(link);
		link.setAttribute("style","display: none;");
		link.href = url;
		link.download = fileName ? fileName : 'output.wav';
		link.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(link);
	};
}

module.exports = SynthController;
