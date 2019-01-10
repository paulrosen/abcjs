//    abc_midi_controls.js: Handle the visual part of playing MIDI
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

function performanceOk() {
	if (!('performance' in window))
		return false;
	if (!('now' in window.performance))
		return false;
	return true;
}

// Unfortunately, a few versions of Safari don't support the performance interface. For those browsers, MIDI just won't work.
if (performanceOk()) {
	if (!('galactic' in window))
		window.galactic = {};
	window.galactic.loc = {
		isLocalUrl: function () { return false }
	};

	require('midi/inc/dom/request_xhr');
	require('midi/inc/dom/util')(window.galactic);
	require('midi/inc/AudioSupports');
	require('midi/inc/EventEmitter');
	require('midi/js/loader');
	require('midi/js/adaptors');
	require('midi/js/adaptors-Audio');
	require('midi/js/adaptors-AudioAPI');
	require('midi/js/adaptors-MIDI');
	require('midi/js/channels');
	require('midi/js/gm');
	require('midi/js/player');
}

var midi = {};

(function() {
	"use strict";
	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	midi.generateMidiDownloadLink = function(tune, midiParams, midi, index) {
		var divClasses = ['abcjs-download-midi', 'abcjs-midi-' + index]
		if (midiParams.downloadClass)
			divClasses.push(midiParams.downloadClass)
		var html = '<div class="' + divClasses.join(' ') + '">';
		if (midiParams.preTextDownload)
			html += midiParams.preTextDownload;
		var title = tune.metaText && tune.metaText.title ? tune.metaText.title : 'Untitled';
		var label;
		if (midiParams.downloadLabel && isFunction(midiParams.downloadLabel))
			label = midiParams.downloadLabel(tune, index);
		else if (midiParams.downloadLabel)
			label = midiParams.downloadLabel.replace(/%T/, title);
		else
			label = "Download MIDI for \"" + title + "\"";
		title = title.toLowerCase().replace(/'/g, '').replace(/\W/g, '_').replace(/__/g, '_');
		html += '<a download="' + title + '.midi" href="' + midi + '">' + label + '</a>';
		if (midiParams.postTextDownload)
			html += midiParams.postTextDownload;
		return html + "</div>";
	};

	function preprocessLabel(label, title) {
		return label.replace(/%T/g, title);
	}

	midi.deviceSupportsMidi = function() {
		if (!performanceOk())
			return false;
		if (midi.midiInlineInitialized === 'not loaded')
			return false;
		return true;
	};

	midi.generateMidiControls = function(tune, midiParams, midi, index, stopOld) {
		if (!performanceOk())
			return '<div class="abcjs-inline-midi abcjs-midi-' + index + '">ERROR: this browser doesn\'t support window.performance</div>';
		if (midi.midiInlineInitialized === 'not loaded')
			return '<div class="abcjs-inline-midi abcjs-midi-' + index + '">MIDI NOT PRESENT</div>';

		if (stopOld)
			stopCurrentlyPlayingTune();
		var title = tune.metaText && tune.metaText.title ? tune.metaText.title : 'Untitled';
		var options = midiParams.inlineControls || {};
		if (options.standard === undefined) options.standard = true;

		if (options.tooltipSelection === undefined) options.tooltipSelection = "Click to toggle play selection/play all.";
		if (options.tooltipLoop === undefined) options.tooltipLoop = "Click to toggle play once/repeat.";
		if (options.tooltipReset === undefined) options.tooltipReset = "Click to go to beginning.";
		if (options.tooltipPlay === undefined) options.tooltipPlay = "Click to play/pause.";
		if (options.tooltipProgress === undefined) options.tooltipProgress = "Click to change the playback position.";
		if (options.tooltipTempo === undefined) options.tooltipTempo = "Change the playback speed.";

		var style = "";
		if (options.hide)
			style = 'style="display:none;"';
		var html = '<div class="abcjs-inline-midi abcjs-midi-' + index + '" ' + style + '>';
		html += '<span class="abcjs-data" style="display:none;">' + JSON.stringify(midi) + '</span>';
		if (midiParams.preTextInline)
			html += '<span class="abcjs-midi-pre">' + preprocessLabel(midiParams.preTextInline, title) + '</span>';

		if (options.selectionToggle)
			html += '<button type="button" class="abcjs-midi-selection abcjs-btn" title="' + options.tooltipSelection + '"></button>';
		if (options.loopToggle)
			html += '<button type="button" class="abcjs-midi-loop abcjs-btn" title="' + options.tooltipLoop + '"></button>';
		if (options.standard)
			html += '<button type="button" class="abcjs-midi-reset abcjs-btn" title="' + options.tooltipReset + '"></button><button type="button" class="abcjs-midi-start abcjs-btn" title="' + options.tooltipPlay + '"></button><button type="button" class="abcjs-midi-progress-background" title="' + options.tooltipProgress + '"><span class="abcjs-midi-progress-indicator"></span></button><span class="abcjs-midi-clock"> 0:00</span>';
		if (options.tempo) {
			var startTempo = tune && tune.metaText && tune.metaText.tempo && tune.metaText.tempo.bpm ? tune.metaText.tempo.bpm : 180;
			html += '<span class="abcjs-tempo-wrapper"><input class="abcjs-midi-tempo" value="100" type="number" min="1" max="300" data-start-tempo="' + startTempo + '" title="' + options.tooltipTempo + '" />% (<span class="abcjs-midi-current-tempo">' + startTempo + '</span> BPM)</span>';
		}

		if (midiParams.postTextInline)
			html += '<span class="abcjs-midi-post">' + preprocessLabel(midiParams.postTextInline, title) + '</span>';
		return html + "</div>";
	};

	// The default location for the sound font files. Simply set this to a different value if the files are served in a different place.
	// midi.soundfontUrl = "node_modules/midi/examples/soundfont/";
	var soundfontUrl = "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/";
	midi.setSoundFont = function(url) {
		soundfontUrl = url;
	};

	var interactiveProgressBar = true;
	midi.setInteractiveProgressBar = function(interactive) {
		interactiveProgressBar = interactive;
	};

	function hasClass(element, cls) {
		if (!element)
			return false;
		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	}

	function addClass(element, cls) {
		if (!element)
			return;
		if (!hasClass(element, cls))
			element.className = element.className + " " + cls;
	}

	function removeClass(element, cls) {
		if (!element)
			return;
		element.className = element.className.replace(cls, "").trim().replace("  ", " ");
	}

	function toggleClass(element, cls) {
		if (!element)
			return;
		if (hasClass(element, cls))
			removeClass(element, cls);
		else
			addClass(element, cls);
	}

	function closest(element, cls) {
		// This finds the closest parent that contains the class passed in.
		if (!element)
			return null;
		while (element !== document.body) {
			if (hasClass(element, cls))
				return element;
			element = element.parentNode;
		}
		return null;
	}

	function find(element, cls) {
		if (!element)
			return null;
		var els = element.getElementsByClassName(cls);
		if (els.length === 0)
			return null;
		return els[0];
	}

	// function addLoadEvent(func) {
	// 	if (window.document.readyState === 'loading') {
	// 		window.addEventListener('load', func);
	// 	} else {
	// 		func();
	// 	}
	// }

	var midiJsInitialized = false;

	function afterSetup(timeWarp, data, onSuccess) {
		MIDI.player.currentTime = 0;
		MIDI.player.warp = timeWarp;

		MIDI.player.load({ events: data });
		onSuccess();
	}

	function listInstruments(data) {
		var instruments = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i][0] && data[i][0].event && data[i][0].event.programNumber) {
				instruments.push(data[i][0].event.programNumber);
			}
		}
		return instruments;
	}

	function setCurrentMidiTune(timeWarp, data, onSuccess) {
		if (!midiJsInitialized) {
			MIDI.setup({
				debug: false,
				soundfontUrl: soundfontUrl,
				instruments:  listInstruments(data)
			}).then(function() {
				midiJsInitialized = true;
				afterSetup(timeWarp, data, onSuccess);
			}).catch(function(e) {
				console.log("MIDI.setup failed:", e.message);
			});
		} else {
			afterSetup(timeWarp, data, onSuccess);
		}
	}

	function startCurrentlySelectedTune() {
		MIDI.player.start(MIDI.player.currentTime);
	}

	function stopCurrentlyPlayingTune() {
		MIDI.player.stop();
	}

	function pauseCurrentlyPlayingTune() {
		MIDI.player.pause();
	}

	function setMidiCallback(midiJsListener) {
		if(midiJsListener) {
			MIDI.player.setAnimation(midiJsListener);
		} else {
			MIDI.player.clearAnimation();
		}
	}

	function jumpToMidiPosition(play, offset, width) {
		var ratio = offset / width;
		var endTime = MIDI.player.duration; // MIDI.Player.endTime;
		if (play)
			pauseCurrentlyPlayingTune();
		MIDI.player.currentTime = endTime * ratio;
		if (play)
			startCurrentlySelectedTune();
		else if (midiJsListener) {
			var ret = MIDI.player;
			var progress = ret.currentTime/ret.duration;
			midiJsListener({ currentTime: ret.currentTime/1000, duration: ret.duration/1000, progress: progress });
		}
	}

	function setTimeWarp(percent) {
		// Time warp is a multiplier: the larger the number, the longer the time. Therefore,
		// it is opposite of the percentage. That is, playing at 50% is actually multiplying the time by 2.
		MIDI.player.warp = (percent > 0) ? 100 / percent : 1;
	}

	function loadMidi(target, onSuccess) {
		var dataEl = find(target, "abcjs-data");
		var data = JSON.parse(dataEl.innerHTML);

		// See if the tempo changer is present, and use that tempo if so.
		var timeWarp = 1;
		var tempoEl = find(target, "abcjs-midi-tempo");
		if (tempoEl) {
			// Time warp is a multiplier: the larger the number, the longer the time. Therefore,
			// it is opposite of the percentage. That is, playing at 50% is actually multiplying the time by 2.
			var percent = parseInt(tempoEl.value, 10);
			if (percent > 0)
				timeWarp = 100 / percent;
		}
		setCurrentMidiTune(timeWarp, data, onSuccess);
	}

	function deselectMidiControl() {
		var otherMidi = find(document, "abcjs-midi-current");
		if (otherMidi) {
			stopCurrentlyPlayingTune();
			removeClass(otherMidi, "abcjs-midi-current");
			var otherMidiStart = find(otherMidi, "abcjs-midi-start");
			removeClass(otherMidiStart, "abcjs-pushed");
		}
	}

	var lastNow;

	function findElements(visualItems, currentTime, epsilon) {

		var minIndex = 0;
		var maxIndex = visualItems.length - 1;
		var currentIndex;
		var currentElement;

		while (minIndex <= maxIndex) {
			currentIndex = Math.floor((minIndex + maxIndex) / 2);
			currentElement = visualItems[currentIndex];

			// A match is if the currentTime is within .1 seconds before the exact time.
			// We get callback events at somewhat random times, so they won't match up exactly.
			if (currentElement.milliseconds/1000 - epsilon < currentTime) {
				minIndex = currentIndex + 1;
			}
			else if (currentElement.milliseconds/1000 - epsilon > currentTime) {
				maxIndex = currentIndex - 1;
			}
			else {
				// We have a match.
				return currentIndex;
			}
		}

		// There was no match, so find the closest element that is less than the current time.
		while (visualItems[currentIndex].milliseconds/1000 - epsilon >= currentTime && currentIndex > 0)
			currentIndex--;
		// If the time is way before the first element, then we're not ready to select any of them.
		if (currentIndex === 0 && visualItems[currentIndex].milliseconds/1000 - epsilon >= currentTime)
			return -1;
		return currentIndex;
	}

	function midiJsListener(position) {
		// { currentTime: in seconds, duration: total length in seconds, progress: percent between 0 and 1 }
		var midiControl;
		if (position.duration > 0 && lastNow !== position.progress) {
			lastNow = position.progress;
			midiControl = find(document, "abcjs-midi-current");
			if (midiControl) {
				var startButton = find(midiControl, 'abcjs-midi-start');
				if (hasClass(startButton, 'abcjs-loaded')) {
					if(!isIndicatorPressed) {
						var progressBackground = find(midiControl, "abcjs-midi-progress-background");
						var totalWidth = progressBackground.offsetWidth;
						var progressIndicator = find(midiControl, "abcjs-midi-progress-indicator");
						var scaled = totalWidth * lastNow; // The number of pixels
						progressIndicator.style.left = scaled + "px";
					}
					var clock = find(midiControl, "abcjs-midi-clock");
					if (clock) {
						var seconds = Math.floor(position.currentTime);
						var minutes = Math.floor(seconds / 60);
						seconds = seconds % 60;
						if (seconds < 10) seconds = "0" + seconds;
						if (minutes < 10) minutes = " " + minutes;
						clock.innerHTML = minutes + ":" + seconds;
					}
					var tempo = midiControl.abcjsQpm;
					if (!tempo && midiControl.abcjsTune && midiControl.abcjsTune.metaText && midiControl.abcjsTune.metaText.tempo)
						tempo = midiControl.abcjsTune.metaText.tempo.bpm;
					if (!tempo)
						tempo = 180;
					var beatsPerSecond = parseInt(tempo, 10) / 60;
					var currentTime = position.currentTime;
					if (midiControl.abcjsListener) {
						var thisBeat = Math.floor(currentTime * beatsPerSecond);
						position.newBeat = thisBeat !== midiControl.abcjsLastBeat;
						position.thisBeat = thisBeat;
						midiControl.abcjsLastBeat = thisBeat;
						midiControl.abcjsListener(midiControl, position, midiControl.abcjsContext);
					}
					if (midiControl.abcjsAnimate) {
						var epsilon = beatsPerSecond / 64; // pick a small division to round to. This is called at small, random times.
						var index = findElements(midiControl.abcjsTune.noteTimings, currentTime, epsilon);
						if (index !== midiControl.abcjsLastIndex) {
							var last = midiControl.abcjsLastIndex >= 0 ? midiControl.abcjsTune.noteTimings[midiControl.abcjsLastIndex] : null;
							midiControl.abcjsAnimate(last,
								midiControl.abcjsTune.noteTimings[index], midiControl.abcjsContext);
							midiControl.abcjsLastIndex = index;
						}
					}
				}
			}
		}
		if (position.progress === 1) {
			// The playback is stopping. We need to either indicate that
			// it has stopped, or start over at the beginning.
			midiControl = find(document, "abcjs-midi-current");
			var loopControl = find(midiControl, "abcjs-midi-loop");

			var finishedResetting = function() {
				if (loopControl && hasClass(loopControl, "abcjs-pushed")) {
					onStart(find(midiControl, "abcjs-midi-start"));
				}
			};

			// midi.js is not quite finished: it still will process the last event, so we wait a minimum amount of time
			// before doing another action.
			setTimeout(function() {
				doReset(midiControl, finishedResetting);
				if (midiControl && midiControl.abcjsAnimate)
					midiControl.abcjsAnimate(midiControl.abcjsTune.noteTimings[midiControl.abcjsLastIndex], null, midiControl.abcjsContext);
			}, 1);
		}
	}

	function onStart(target) {
		var parent = closest(target, "abcjs-inline-midi");
		// If this midi is already playing,
		if (hasClass(target, 'abcjs-pushed')) {
			// Stop it.
			pauseCurrentlyPlayingTune();
			// Change the element so that the start icon is shown.
			removeClass(target, "abcjs-pushed");
			return;
		} else { // Else,
			// If some other midi is running, turn it off.

			// If this is the current midi, just continue.
			if (hasClass(parent, "abcjs-midi-current"))
			// Start this tune playing from wherever it had stopped.
				startCurrentlySelectedTune();
			else {
				deselectMidiControl();
				onLoadMidi(target, parent, function() {
					startCurrentlySelectedTune();
				});
			}
			addClass(target, "abcjs-pushed");
		}
	}

	function setCurrentMidiControl(el) {
		var els = document.querySelectorAll('.abcjs-midi-current');
		for (var i = 0; i < els.length; i++)
			removeClass(els[i], 'abcjs-midi-current');
		addClass(el, 'abcjs-midi-current');
	}

	function onLoadMidi(target, parent, cb) {
		// else, load this midi from scratch.
		var onSuccess = function() {
			removeClass(target, "abcjs-loading");
			setCurrentMidiControl(parent);
			addClass(target, 'abcjs-loaded');
			if(cb) {
				cb();
			}
		};
		addClass(target, "abcjs-loading");
		loadMidi(parent, onSuccess);
		parent.abcjsLastBeat = -1;
		parent.abcjsLastIndex = -1;
		setMidiCallback(midiJsListener);
	}

	midi.startPlaying = function(target) {
		// This can be called with the target being entire control, and if so, first find the start button.
		var btn = target;
		if (hasClass(target, "abcjs-inline-midi"))
			btn = target.querySelector('.abcjs-midi-start');
		onStart(btn);
	};

	midi.stopPlaying = function() {
		stopCurrentlyPlayingTune();
		var playingEl = document.querySelector(".abcjs-midi-current");
		if (playingEl) {
			resetProgress(playingEl);
			var startBtn = find(playingEl, "abcjs-midi-start");
			if (startBtn)
				removeClass(startBtn, "abcjs-pushed");
		}
	};
	midi.restartPlaying = function() {
		var target = document.querySelector(".abcjs-midi-current");
		onReset(target);
	};

	midi.setLoop = function(target, state) {
		var loop = target.querySelector('.abcjs-midi-loop');
		if (!loop)
			return;
		if (state)
			addClass(loop, 'abcjs-pushed');
		else
			removeClass(loop, 'abcjs-pushed');
	};

	midi.setRandomProgress = function(percent) {
		var target = document.querySelector(".abcjs-midi-current");
		var playEl = find(target, "abcjs-midi-start");
		var play = hasClass(playEl, "abcjs-pushed");
		var endTime = MIDI.player.duration;
		if (play)
			pauseCurrentlyPlayingTune();
		MIDI.player.currentTime = endTime * percent;
		if (play)
			startCurrentlySelectedTune();
	};

	function resetProgress(parent) {
		var progressIndicator = find(parent, "abcjs-midi-progress-indicator");
		progressIndicator.style.left = "0px";
		var clock = find(parent, "abcjs-midi-clock");
		clock.innerHTML = " 0:00";
	}

	function onSelection(target) {
		toggleClass(target, 'abcjs-pushed');
	}

	function onLoop(target) {
		toggleClass(target, 'abcjs-pushed');
	}

	function doReset(target, callback) {
		var parent = closest(target, "abcjs-inline-midi");

		function onSuccess() {
			setCurrentMidiControl(parent);
			resetProgress(parent);
			if (callback)
				callback();
		}

		// If the tune is playing, stop it.
		deselectMidiControl();
		if (parent) // parent can be null if the music was changed while the midi is playing. This is called to stop it, but the object is already gone.
			loadMidi(parent, onSuccess);
	}

	function onReset(target) {
		var parent = closest(target, "abcjs-inline-midi");
		var playEl = find(parent, "abcjs-midi-start");
		var play = hasClass(playEl, "abcjs-pushed");
		function keepPlaying() {
			if (play) {
				startCurrentlySelectedTune();
				addClass(playEl, 'abcjs-pushed');
			}
		}
		if (hasClass(parent, "abcjs-midi-current")) // Only listen to the reset for the currently playing tune.
			doReset(target, keepPlaying);
	}

	function relMouseX(target, event) {
		var totalOffsetX = 0;

		var width = target.offsetWidth;
		do {
			totalOffsetX += target.offsetLeft - target.scrollLeft;
			target = target.offsetParent;
		}
		while (target);

		var x = event.pageX - totalOffsetX;
		if (x < 0)
			x = 0;
		if (x > width)
			x = width - 1;
		return x;
	}

	function isPlaying(target) {
		var parent = closest(target, "abcjs-inline-midi");
		var play = find(parent, "abcjs-midi-start");
		if (hasClass(parent, "abcjs-midi-current")) {
			return hasClass(play, "abcjs-pushed");
		}
		return false;
	}

	function onProgress(target, event) {
		var parent = closest(target, "abcjs-inline-midi");
		var play = find(parent, "abcjs-midi-start");
		var width = target.offsetWidth;
		var offset = relMouseX(target, event);
		if (hasClass(parent, "abcjs-midi-current")) {
			jumpToMidiPosition(isPlaying(target), offset, width);
		} else {
			onLoadMidi(play, parent, function() {
				jumpToMidiPosition(false, offset, width);
			})
		}
	}

	function onTempo(el) {
		var percent = parseInt(el.value, 10);
		var startTempo = parseInt(el.getAttribute("data-start-tempo"), 10);

		while (el && !hasClass(el, 'abcjs-midi-current-tempo')) {
			el = el.nextSibling;
		}
		el.innerHTML = Math.floor(percent * startTempo / 100);
		setTimeWarp(percent);
	}
	var isIndicatorPressed = false;
	var dragIndicator, dragParent;
	var hasAddedMouseEvents = false;

	midi.attachListeners = function(parentElement) {
		var audioControls = parentElement.querySelectorAll(".abcjs-inline-midi");
		for (var a = 0; a < audioControls.length; a++) {
			var audioCtl = audioControls[a];

			audioCtl.addEventListener("click", function (event) {
				event = event || window.event;
				var target = event.target || event.srcElement;
				while (target && target !== document.body) {
					if (hasClass(target, 'abcjs-midi-start')) {
						onStart(target, event);
						return;
					} else if (hasClass(target, 'abcjs-midi-selection')) {
						onSelection(target, event);
						return;
					} else if (hasClass(target, 'abcjs-midi-loop')) {
						onLoop(target, event);
						return;
					} else if (hasClass(target, 'abcjs-midi-reset')) {
						onReset(target, event);
						return;
					} else if (hasClass(target, 'abcjs-midi-progress-background')) {
						if (interactiveProgressBar) {
							onProgress(target, event);
						}
						return;
					}
					target = target.parentNode;
				}
			});
			audioCtl.addEventListener("change", function (event) {
				event = event || window.event;
				var target = event.target || event.srcElement;
				while (target !== document.body) {
					if (hasClass(target, 'abcjs-midi-tempo'))
						onTempo(target, event);
					target = target.parentNode;
				}
			});

			audioCtl.addEventListener("mousedown", function (event) {
				if (interactiveProgressBar) {
					event = event || window.event;
					var target = event.target || event.srcElement;
					if (hasClass(target, 'abcjs-midi-progress-indicator')) {
						dragIndicator = target;
						isIndicatorPressed = true;
						dragParent = closest(target, 'abcjs-midi-progress-background');
					}
				}
			});
		}
		if (!hasAddedMouseEvents) {
			hasAddedMouseEvents = true;
			document.body.addEventListener('mousemove', function (event) {
				if (isIndicatorPressed) {
					event = event || window.event;
					event.preventDefault();
					var pos = relMouseX(dragParent, event);
					dragIndicator.style.left = pos + 'px';
				}
			}, true);

			document.body.addEventListener("mouseup", function (event) {
				if (isIndicatorPressed) {
					event = event || window.event;
					event.preventDefault();
					var pos = relMouseX(dragParent, event);
					var width = dragParent.offsetWidth;
					jumpToMidiPosition(isPlaying(dragParent), pos, width);
					onProgress(dragParent, event);
					isIndicatorPressed = false;
					dragIndicator = null;
					dragParent = null;
				}
			});
		}
		if (window.MIDI === undefined) {
			midi.midiInlineInitialized = 'not loaded';
			var els = document.getElementsByClassName('abcjs-inline-midi');
			for (var i = 0; i < els.length; i++)
				els[i].innerHTML = "MIDI NOT PRESENT";
		}
	}

	//addLoadEvent(addDelegates);

})();

module.exports = midi;
