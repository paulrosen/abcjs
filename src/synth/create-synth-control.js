var registerAudioContext = require('./register-audio-context');
var activeAudioContext = require('./active-audio-context');
var loopImage = require('./loop.svg');
var playImage = require('./play.svg');
var pauseImage = require('./pause.svg');
var loadingImage = require('./loading.svg');
var resetImage = require('./reset.svg');

function CreateSynthControl(parent, options) {
	var self = this;
	// parent is either an element or a selector.
	if (typeof parent === "string") {
		var selector = parent;
		parent = document.querySelector(selector);
		if (!parent)
			throw new Error("Cannot find element \"" + selector + "\" in the DOM.");
	} else if (!(parent instanceof HTMLElement))
		throw new Error("The first parameter must be a valid element or selector in the DOM.");

	self.parent = parent;
	self.options = {};
	if (options)
		self.options = Object.assign({}, options);

	// This can be called in the following cases:
	// AC already registered and not suspended
	// AC already registered and suspended
	// AC not registered and not passed in
	// AC not registered but passed in (but suspended)
	// AC not registered but passed in (not suspended)
	// If the AC is already registered, then just use it - ignore what is passed in
	// Create the AC if necessary if there isn't one already.
	// We don't care right now if the AC is suspended - whenever a button is clicked then we check it.
	if (self.options.ac)
		registerAudioContext(self.options.ac);
	buildDom(self.parent, self.options);
	attachListeners(self);

	self.setTempo = function(tempo) {
		self.parent.querySelector(".abcjs-midi-current-tempo").innerHTML = tempo;
	};
	self.resetAll = function() {
		var pushedButtons = self.parent.querySelectorAll(".abcjs-pushed");
		for (var i = 0; i < pushedButtons.length; i++) {
			var button = pushedButtons[i];
			button.classList.remove("abcjs-pushed");
		}
	};
	self.pushPlay = function(push) {
		var startButton = self.parent.querySelector(".abcjs-midi-start");
		if (push)
			startButton.classList.add("abcjs-pushed");
		else
			startButton.classList.remove("abcjs-pushed");
	};
	self.pushLoop = function(push) {
		var loopButton = self.parent.querySelector(".abcjs-midi-loop");
		if (push)
			loopButton.classList.add("abcjs-pushed");
		else
			loopButton.classList.remove("abcjs-pushed");
	};

	self.setProgress = function (percent, totalTime) {
		var progressBackground = self.parent.querySelector(".abcjs-midi-progress-background");
		var progressThumb = self.parent.querySelector(".abcjs-midi-progress-indicator");
		var width = progressBackground.clientWidth;
		var left = width * percent;
		progressThumb.style.left = left + "px";

		var clock = self.parent.querySelector(".abcjs-midi-clock");
		var totalSeconds = (totalTime * percent) / 1000;
		var minutes = Math.floor(totalSeconds / 60);
		var seconds = Math.floor(totalSeconds % 60);
		var secondsFormatted = seconds < 10 ? "0" + seconds : seconds;
		clock.innerHTML = minutes + ":" + secondsFormatted;
	};

	if (self.options.afterResume) {
		var isResumed = false;
		if (self.options.ac) {
			isResumed = self.options.ac.state !== "suspended";
		} else if (activeAudioContext()) {
			isResumed = activeAudioContext().state !== "suspended";
		}
		if (isResumed)
			self.options.afterResume();
	}
}

function buildDom(parent, options) {
	var hasLoop = !!options.loopHandler;
	var hasRestart = !!options.restartHandler;
	var hasPlay = !!options.playHandler;
	var hasProgress = !!options.progressHandler;
	var hasWarp = !!options.warpHandler;
	var hasClock = options.hasClock !== false;

	var html = '<div class="abcjs-inline-audio">\n';
	if (hasLoop) {
		var repeatTitle = options.repeatTitle ? options.repeatTitle : "Click to toggle play once/repeat.";
		var repeatAria = options.repeatAria ? options.repeatAria : repeatTitle;
		html += '<button type="button" class="abcjs-midi-loop abcjs-btn" title="' + repeatTitle + '" aria-label="' + repeatAria + '">' + loopImage + '</button>\n';
	}
	if (hasRestart) {
		var restartTitle = options.restartTitle ? options.restartTitle : "Click to go to beginning.";
		var restartAria = options.restartAria ? options.restartAria : restartTitle;
		html += '<button type="button" class="abcjs-midi-reset abcjs-btn" title="' + restartTitle + '" aria-label="' + restartAria + '">' + resetImage + '</button>\n';
	}
	if (hasPlay) {
		var playTitle = options.playTitle ? options.playTitle : "Click to play/pause.";
		var playAria = options.playAria ? options.playAria : playTitle;
		html += '<button type="button" class="abcjs-midi-start abcjs-btn" title="' + playTitle + '" aria-label="' + playAria + '">' + playImage + pauseImage + loadingImage + '</button>\n';
	}
	if (hasProgress) {
		var randomTitle = options.randomTitle ? options.randomTitle : "Click to change the playback position.";
		var randomAria = options.randomAria ? options.randomAria : randomTitle;
		html += '<button type="button" class="abcjs-midi-progress-background" title="' + randomTitle + '" aria-label="' + randomAria + '"><span class="abcjs-midi-progress-indicator"></span></button>\n';
	}
	if (hasClock) {
		html += '<span class="abcjs-midi-clock"></span>\n';
	}
	if (hasWarp) {
		var warpTitle = options.warpTitle ? options.warpTitle : "Change the playback speed.";
		var warpAria = options.warpAria ? options.warpAria : warpTitle;
		var bpm = options.bpm ? options.bpm : "BPM";
		html += '<span class="abcjs-tempo-wrapper"><label><input class="abcjs-midi-tempo" type="number" min="1" max="300" value="100" title="' + warpTitle + '" aria-label="' + warpAria + '">%</label><span>&nbsp;(<span class="abcjs-midi-current-tempo"></span> ' + bpm + ')</span></span>\n';
	}
	html += '</div>\n';
	parent.innerHTML = html;
}

function acResumerMiddleWare(next, ev, playBtn, afterResume) {
	var needsInit = true;
	if (!activeAudioContext()) {
		registerAudioContext();
	} else {
		needsInit = activeAudioContext().state === "suspended";
	}
	if (needsInit) {
		if (playBtn)
			playBtn.classList.add("abcjs-loading");
		activeAudioContext().resume().then(function () {
			if (afterResume) {
				afterResume().then(function (response) {
					playBtn.classList.remove("abcjs-loading");
					next(ev);
				});
			} else
				next(ev);
		});
	} else {
		next(ev);
	}
}

function attachListeners(self) {
	var hasLoop = !!self.options.loopHandler;
	var hasRestart = !!self.options.restartHandler;
	var hasPlay = !!self.options.playHandler;
	var hasProgress = !!self.options.progressHandler;
	var hasWarp = !!self.options.warpHandler;
	var playBtn = self.parent.querySelector(".abcjs-midi-start");

	if (hasLoop)
		self.parent.querySelector(".abcjs-midi-loop").addEventListener("click", function(ev){acResumerMiddleWare(self.options.loopHandler, ev, playBtn, self.options.afterResume)});
	if (hasRestart)
		self.parent.querySelector(".abcjs-midi-reset").addEventListener("click", function(ev){acResumerMiddleWare(self.options.restartHandler, ev, playBtn, self.options.afterResume)});
	if (hasPlay)
		playBtn.addEventListener("click", function(ev){acResumerMiddleWare(self.options.playHandler, ev, playBtn, self.options.afterResume)});
	if (hasProgress)
		self.parent.querySelector(".abcjs-midi-progress-background").addEventListener("click", function(ev){acResumerMiddleWare(self.options.progressHandler, ev, playBtn, self.options.afterResume)});
	if (hasWarp)
		self.parent.querySelector(".abcjs-midi-tempo").addEventListener("change", function(ev){acResumerMiddleWare(self.options.warpHandler, ev, playBtn, self.options.afterResume)});
}
module.exports = CreateSynthControl;
