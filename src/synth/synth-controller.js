var CreateSynthControl = require('./create-synth-control');
var CreateSynth = require('./create-synth');
var TimingCallbacks = require('../api/abc_timing_callbacks');

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
	};

	self.setTune = function(visualObj, userAction, audioParams) {
		self.isLoaded = false;
		self.visualObj = visualObj;
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
		var millisecondsPerMeasure = self.visualObj.millisecondsPerMeasure() * 100 / self.warp;
		self.currentTempo = Math.round(self.visualObj.getBeatsPerMeasure() / millisecondsPerMeasure * 60000);
		if (self.control)
			self.control.setTempo(self.currentTempo);
		self.percent = 0;

		if (!self.midiBuffer)
			self.midiBuffer = new CreateSynth();
		return self.midiBuffer.init({
			visualObj: self.visualObj,
			options: self.options,
			millisecondsPerMeasure: millisecondsPerMeasure
		}).then(function () {
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
				lineEndAnticipation: self.cursorControl ? self.cursorControl.lineEndAnticipation : undefined,
				beatSubdivisions: subdivisions,
			});
			if (self.cursorControl && self.cursorControl.onReady && typeof self.cursorControl.onReady  === 'function')
				self.cursorControl.onReady(self);
			self.isLoaded = true;
			return Promise.resolve({ status: "created" });
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
		if (!self.isLoaded) {
			return self.go().then(function() {
				return self._play();
			});
		} else
			return self._play();
	};

	self._play = function () {
		self.isStarted = !self.isStarted;
		if (self.isStarted) {
			if (self.cursorControl && self.cursorControl.onStart && typeof self.cursorControl.onStart  === 'function')
				self.cursorControl.onStart();
			self.midiBuffer.start();
			self.timer.start();
			if (self.control)
				self.control.pushPlay(true);
		} else {
			self.pause();
		}
		return Promise.resolve({ status: "ok" });
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
		if (!self.isLoaded) {
			return self.go().then(function() {
				return self._randomAccess(ev);
			});
		} else
			return self._randomAccess(ev);
	};

	self._randomAccess = function (ev) {
		var background = (ev.target.classList.contains('abcjs-midi-progress-indicator')) ? ev.target.parentNode : ev.target;
		var percent = (ev.x - background.offsetLeft) / background.offsetWidth;
		if (percent < 0)
			percent = 0;
		if (percent > 100)
			percent = 100;
		self.timer.setProgress(percent);
		self.midiBuffer.seek(percent);
	};

	self.onWarp = function (ev) {
		var newWarp = ev.target.value;
		if (parseInt(newWarp, 10) > 0) {
			self.warp = parseInt(newWarp, 10);
			var wasPlaying = self.isStarted;
			var startPercent = self.percent;
			self.destroy();
			self.isStarted = false;
			self.go().then(function () {
				self.setProgress(startPercent, self.midiBuffer.duration * 1000);
				if (wasPlaying) {
					self.play();
				}
				self.timer.setProgress(startPercent);
				self.midiBuffer.seek(startPercent);
			});
		}
	};

	self.setProgress = function (percent, totalTime) {
		self.percent = percent;
		if (self.control)
			self.control.setProgress(percent, totalTime);
	};

	self.finished = function () {
		self.timer.reset();
		if (self.isLooping) {
			self.timer.start();
			self.midiBuffer.start();
		} else {
			self.timer.stop();
			if (self.isStarted) {
				if (self.control)
					self.control.pushPlay(false);
				self.isStarted = false;
				if (self.cursorControl && self.cursorControl.onFinished && typeof self.cursorControl.onFinished  === 'function')
					self.cursorControl.onFinished();
				self.setProgress(0, 1);
			}
		}
	};

	self.beatCallback = function (beatNumber, totalBeats, totalTime) {
		var percent = beatNumber / totalBeats;
		self.setProgress(percent, totalTime);
		if (self.cursorControl && self.cursorControl.onBeat && typeof self.cursorControl.onBeat  === 'function')
			self.cursorControl.onBeat(beatNumber, totalBeats, totalTime);
	};

	self.eventCallback = function (event) {
		if (event) {
			if (self.cursorControl && self.cursorControl.onEvent && typeof self.cursorControl.onEvent  === 'function')
				self.cursorControl.onEvent(event);
		} else {
			self.finished();
		}
	};

	self.lineEndCallback = function (data) {
		if (self.cursorControl && self.cursorControl.onLineEnd && typeof self.cursorControl.onLineEnd  === 'function')
			self.cursorControl.onLineEnd(data);
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
