var registerAudioContext = require('./register-audio-context');
var loopImage = require('./loop.svg');
var playImage = require('./play.svg');
var pauseImage = require('./pause.svg');
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

	buildDom(self.parent, self.options);
	attachListeners(self.parent, self.options);

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
}

function buildDom(parent, options) {
	var hasLoop = !!options.loopHandler;
	var hasRestart = !!options.restartHandler;
	var hasPlay = !!options.playHandler;
	var hasProgress = !!options.progressHandler;
	var hasWarp = !!options.warpHandler;
	var hasClock = options.hasClock !== false;

	var acReady = false;
	if (options.ac)
		acReady = registerAudioContext(options.ac);
	var tooEarlyStyle = acReady ? 'style="display:none;"' : '';
	var controlStyle = acReady ? '' : 'style="display:none;"';
	// TODO-PER: Why even have this message? Instead, the first click on the control does the loading. (Perhaps have an overlay on
	// TODO the control that takes every mouse click and is the only thing focusable at first?)

	var suspendText = options.suspendText ? options.suspendText : "Browsers won't allow audio to work unless the audio is started in response to a user action. This prevents auto-playing web sites. Therefore, the following button is needed to do the initialization:";
	var activateAudioContext = options.activateAudioContext ? options.activateAudioContext : "Activate Audio Context";

	var html = '<div class="abcjs-too-early" ' + tooEarlyStyle + '>\n';
	html += '<p class="abcjs-suspend-explanation">' + suspendText + '</p>\n';
	html += '<button class="abcjs-activate-audio">' + activateAudioContext + '</button>\n';
	html += '</div>\n';
	html += '<div class="abcjs-inline-midi" ' + controlStyle + '>\n';
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
		html += '<button type="button" class="abcjs-midi-start abcjs-btn" title="' + playTitle + '" aria-label="' + playAria + '">' + playImage + pauseImage + '</button>\n';
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
		html += '<span class="abcjs-tempo-wrapper"><label><input class="abcjs-midi-tempo" type="number" min="1" max="300" value="100" title="' + warpTitle + '" aria-label="' + warpAria + '">%</label> (<span class="abcjs-midi-current-tempo"></span> ' + bpm + ')</span>\n';
	}
	html += '</div>\n';
	parent.innerHTML = html;
	if (acReady && options.afterResume)
		options.afterResume(window.abcjsAudioContext);
}

function attachListeners(parent, options) {
	var hasLoop = !!options.loopHandler;
	var hasRestart = !!options.restartHandler;
	var hasPlay = !!options.playHandler;
	var hasProgress = !!options.progressHandler;
	var hasWarp = !!options.warpHandler;

	if (hasLoop)
		parent.querySelector(".abcjs-midi-loop").addEventListener("click", options.loopHandler);
	if (hasRestart)
		parent.querySelector(".abcjs-midi-reset").addEventListener("click", options.restartHandler);
	if (hasPlay)
		parent.querySelector(".abcjs-midi-start").addEventListener("click", options.playHandler);
	if (hasProgress)
		parent.querySelector(".abcjs-midi-progress-background").addEventListener("click", options.progressHandler);
	if (hasWarp)
		parent.querySelector(".abcjs-midi-tempo").addEventListener("change", options.warpHandler);

	parent.querySelector(".abcjs-activate-audio").addEventListener("click", function() {
		registerAudioContext();
		parent.querySelector(".abcjs-too-early").setAttribute("style", "display:none;");
		parent.querySelector(".abcjs-inline-midi").setAttribute("style", "");

		if (options.afterResume)
			options.afterResume(window.abcjsAudioContext);
	});
}
module.exports = CreateSynthControl;
