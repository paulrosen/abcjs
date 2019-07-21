function SynthControl() {
	var self = this;
	self.warp = 100;
	self.cursorControl = null;

	self.abcOptions = {
		add_classes: true,
		clickListener: self.clickListener
	};
	self.load = function (abc, cursorControl) {
		self.cursorControl = cursorControl;
		self.visualObj = ABCJS.renderAbc("paper", abc, self.abcOptions)[0];
	};

	self.onWarp = function (ev) {
		var newWarp = ev.target.value;
		if (parseInt(newWarp, 10) > 0) {
			self.warp = parseInt(newWarp, 10);
			var wasPlaying = self.isStarted();
			var startPercent = self.percent;
			self.destroy();
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

	self.addListeners = function () {
		self.control = document.querySelector(".abcjs-inline-midi");
		var el = document.querySelector(".abcjs-midi-loop");
		el.addEventListener("click", self.toggleLoop);
		el = document.querySelector(".abcjs-midi-reset");
		el.addEventListener("click", self.restart);
		el = document.querySelector(".abcjs-midi-start");
		el.addEventListener("click", self.play);
		el = document.querySelector(".abcjs-midi-progress-background");
		el.addEventListener("click", self.randomAccess);
		el = document.querySelector(".abcjs-midi-tempo");
		el.addEventListener("change", self.onWarp);
	};

	self.init = function (audioContext) {
		self.audioContext = audioContext;
		if (self.visualObj)
			return self.go();
		else
			return Promise.resolve({ status: "no-buffer"});
	};

	self.setTunes = function(visualObjs) {
		// TODO-PER: how to handle multiple tunes?
		self.visualObj = visualObjs[0];
		if (self.audioContext)
			return self.go();
		else
			return Promise.resolve({ status: "no-audio-context"});
	};

	self.go = function () {
		self.midiBuffer = new ABCJS.synth.CreateSynth();
		var millisecondsPerMeasure = self.visualObj.millisecondsPerMeasure() * 100 / self.warp;
		self.currentTempo = Math.round(self.visualObj.getBeatsPerMeasure() / millisecondsPerMeasure * 60000);
		document.querySelector(".abcjs-midi-current-tempo").innerHTML = self.currentTempo;
		self.percent = 0;

		return self.midiBuffer.init({
			//debugCallback: debugCallback,
			//soundFontUrl: soundFontUrl,
			visualObj: self.visualObj,
			options: self.options,
			audioContext: self.audioContext,
			millisecondsPerMeasure: millisecondsPerMeasure
		}).then(function () {
			return self.midiBuffer.prime();
		}).then(function () {
			// Need to create the TimingCallbacks after priming the midi so that the midi data is available for the callbacks.
			self.timer = new ABCJS.TimingCallbacks(self.visualObj, {
				beatCallback: self.beatCallback,
				eventCallback: self.eventCallback,
				beatSubdivisions: 16,
				qpm: self.currentTempo
			});
			return Promise.resolve({ status: "created" });
		}).catch(function (error) {
			console.warn("synth error", error);
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
		var pushedButtons = self.control.querySelectorAll(".abcjs-pushed");
		for (var i = 0; i < pushedButtons.length; i++) {
			var button = pushedButtons[i];
			button.classList.remove("abcjs-pushed");
		}
	};

	self.play = function () {
		var startButton = self.control.querySelector(".abcjs-midi-start");
		if (self.isStarted()) {
			self.timer.pause();
			self.midiBuffer.pause();
			startButton.classList.remove("abcjs-pushed");
		} else {
			if (self.cursorControl)
				self.cursorControl.onStart();
			self.midiBuffer.start();
			self.timer.start();
			startButton.classList.add("abcjs-pushed");
		}
	};

	self.toggleLoop = function () {
		var loopButton = self.control.querySelector(".abcjs-midi-loop");
		var isLooping = loopButton.classList.contains('abcjs-pushed');
		if (isLooping) {
			loopButton.classList.remove("abcjs-pushed");
		} else {
			loopButton.classList.add("abcjs-pushed");
		}
	};

	self.restart = function () {
		self.timer.reset();
		self.midiBuffer.seek(0);
	};

	self.randomAccess = function (ev) {
		var background = (ev.target.classList.contains('abcjs-midi-progress-indicator')) ? ev.target.parentNode : ev.target;
		var percent = (ev.x - background.offsetLeft) / background.offsetWidth;
		if (percent < 0)
			percent = 0;
		if (percent > 100)
			percent = 100;
		self.timer.setProgress(percent);
		self.midiBuffer.seek(percent);
	};

	self.setProgress = function (percent, totalTime) {
		self.percent = percent;
		var progressBackground = self.control.querySelector(".abcjs-midi-progress-background");
		var progressThumb = self.control.querySelector(".abcjs-midi-progress-indicator");
		var width = progressBackground.clientWidth;
		var left = width * percent;
		progressThumb.style.left = left + "px";
		self.setClock(percent, totalTime);
	};

	self.setClock = function (percent, totalTime) {
		var clock = self.control.querySelector(".abcjs-midi-clock");
		var totalSeconds = (totalTime * percent) / 1000;
		var minutes = Math.floor(totalSeconds / 60);
		var seconds = Math.floor(totalSeconds % 60);
		var secondsFormatted = seconds < 10 ? "0" + seconds : seconds;
		clock.innerHTML = minutes + ":" + secondsFormatted;
	};

	self.finished = function () {
		self.timer.reset();
		var loopButton = self.control.querySelector(".abcjs-midi-loop");
		var isLooping = loopButton.classList.contains('abcjs-pushed');
		if (isLooping) {
			self.timer.start();
			self.midiBuffer.start();
		} else {
			self.timer.stop();
			if (self.isStarted()) {
				var startButton = self.control.querySelector(".abcjs-midi-start");
				startButton.classList.toggle("abcjs-pushed");
				if (self.cursorControl)
					self.cursorControl.onFinished();
				self.setProgress(0, 1);
			}
		}
	};

	self.beatCallback = function (beatNumber, totalBeats, totalTime) {
		var percent = beatNumber / totalBeats;
		self.setProgress(percent, totalTime);
	};

	self.eventCallback = function (event) {
		if (event) {
			if (self.cursorControl)
				self.cursorControl.onEvent(event);
		} else {
			self.finished();
		}
	};

	self.getUrl = function () {
		return self.midiBuffer.download();
	};

	self.isStarted = function () {
		var startButton = self.control.querySelector(".abcjs-midi-start");
		return startButton.classList.contains('abcjs-pushed');
	};

	self.clickListener = function(abcElem) {
		var lastClicked = abcElem.midiPitches;
		if (!lastClicked)
			return;

		var sequence = new ABCJS.synth.SynthSequence();

		for (var i = 0; i < lastClicked.length; i++) {
			var note = lastClicked[i];
			var trackNum = sequence.addTrack();
			sequence.setInstrument(trackNum, note.instrument);
			sequence.appendNote(trackNum, note.pitch, note.durationInMeasures, note.volume);
		}

		var buffer = new ABCJS.synth.CreateSynth();
		return buffer.init({
			sequence: sequence,
			audioContext: self.audioContext,
			millisecondsPerMeasure: self.visualObj.millisecondsPerMeasure()
		}).then(function () {
			return buffer.prime();
		}).then(function () {
			return buffer.start();
		}).catch(function (error) {
			console.warn("synth error", error);
		});
	};
}

