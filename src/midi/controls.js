//    abc_midi_controls.js: Handle the visual part of playing MIDI
//    Copyright (C) 2010,2016 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

if (typeof galactic === 'undefined') galactic = {};
galactic.loc = {
  isLocalUrl: function () { return false }
};

// require('midi/inc/shim/Base64');
// require('midi/inc/shim/WebAudioAPI');
// require('midi/inc/shim/WebMIDIAPI');
// require('midi/inc/dom/request_script');
require('midi/inc/dom/request_xhr');
require('midi/inc/dom/util')(galactic);
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

var midi = {};

(function() {
	"use strict";
	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	midi.generateMidiDownloadLink = function(tune, midiParams, midi, index) {
		var html = '<div class="download-midi midi-' + index + '">';
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

	midi.generateMidiControls = function(tune, midiParams, midi, index) {
		if (midi.midiInlineInitialized === 'failed')
			return '<div class="abcjs-inline-midi abcjs-midi-' + index + '">ERROR</div>';
		if (midi.midiInlineInitialized === 'not loaded')
			return '<div class="abcjs-inline-midi abcjs-midi-' + index + '">MIDI NOT PRESENT</div>';

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
			html += '<button class="abcjs-midi-selection abcjs-btn" title="' + options.tooltipSelection + '"></button>';
		if (options.loopToggle)
			html += '<button class="abcjs-midi-loop abcjs-btn" title="' + options.tooltipLoop + '"></button>';
		if (options.standard)
			html += '<button class="abcjs-midi-reset abcjs-btn" title="' + options.tooltipReset + '"></button><button class="abcjs-midi-start abcjs-btn" title="' + options.tooltipPlay + '"></button><button class="abcjs-midi-progress-background" title="' + options.tooltipProgress + '"><span class="abcjs-midi-progress-indicator"></span></button><span class="abcjs-midi-clock"> 0:00</span>';
		if (options.tempo) {
			var startTempo = tune && tune.metaText && tune.metaText.tempo ? tune.metaText.tempo.bpm : 180;
			html += '<span class="abcjs-tempo-wrapper"><input class="abcjs-midi-tempo" value="100" type="number" min="1" max="300" data-start-tempo="' + startTempo + '" title="' + options.tooltipTempo + '" />% (<span class="abcjs-midi-current-tempo">' + startTempo + '</span> BPM)</span>';
		}

		if (midiParams.postTextInline)
			html += '<span class="abcjs-midi-post">' + preprocessLabel(midiParams.postTextInline, title) + '</span>';
		return html + "</div>";
	};

	// The default location for the sound font files. Simply set this to a different value if the files are served in a different place.
	// midi.soundfontUrl = "node_modules/midi/examples/soundfont/";
	midi.soundfontUrl = "/soundfont/";

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

	function addLoadEvent(func) {
		if (window.document.readyState === 'loading') {
			window.addEventListener('load', func);
		} else {
			func();
		}
	}

	var midiJsInitialized = false;

	function afterSetup(timeWarp, data, onSuccess) {
		MIDI.player.currentTime = 0;
		MIDI.player.warp = timeWarp;

		MIDI.player.load({ events: data });
		onSuccess();
	}

	function setCurrentMidiTune(timeWarp, data, onSuccess) {
		if (!midiJsInitialized) {
			MIDI.setup({
				debug: true,
				soundfontUrl: midi.soundfontUrl
			}).then(function() {
				midiJsInitialized = true;
				afterSetup(timeWarp, data, onSuccess);
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
		MIDI.player.setAnimation(midiJsListener);
	}

	function jumpToMidiPosition(play, offset, width) {
		var ratio = offset / width;
		var endTime = MIDI.player.duration; // MIDI.Player.endTime;
		if (play)
			pauseCurrentlyPlayingTune();
		MIDI.player.currentTime = endTime * ratio;
		if (play)
			startCurrentlySelectedTune();
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
			currentIndex = (minIndex + maxIndex) / 2 | 0;
			currentElement = visualItems[currentIndex];

			// A match is if the currentTime is within .1 seconds before the exact time.
			// We get callback events at somewhat random times, so they won't match up exactly.
			if (currentElement.seconds - epsilon < currentTime) {
				minIndex = currentIndex + 1;
			}
			else if (currentElement.seconds - epsilon > currentTime) {
				maxIndex = currentIndex - 1;
			}
			else {
				// We have a match!
				return currentIndex;
			}
		}

		// There was no match, so find the closest element that is less than the current time.
		while (visualItems[currentIndex].seconds - epsilon >= currentTime && currentIndex > 0)
			currentIndex--;
		// If the time is way before the first element, then we're not ready to select any of them.
		if (currentIndex === 0 && visualItems[currentIndex].seconds - epsilon >= currentTime)
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
				if (hasClass(startButton, 'abcjs-pushed')) {
					var progressBackground = find(midiControl, "abcjs-midi-progress-background");
					var totalWidth = progressBackground.offsetWidth;
					var progressIndicator = find(midiControl, "abcjs-midi-progress-indicator");
					var scaled = totalWidth * lastNow; // The number of pixels
					progressIndicator.style.left = scaled + "px";
					var clock = find(midiControl, "abcjs-midi-clock");
					if (clock) {
						var seconds = Math.floor(position.currentTime);
						var minutes = Math.floor(seconds / 60);
						seconds = seconds % 60;
						if (seconds < 10) seconds = "0" + seconds;
						if (minutes < 10) minutes = " " + minutes;
						clock.innerHTML = minutes + ":" + seconds;
					}
					var beatsPerSecond = parseInt(midiControl.abcjsQpm, 10) / 60;
					var currentTime = position.currentTime;
					if (midiControl.abcjsListener) {
						var thisBeat = Math.floor(currentTime / beatsPerSecond);
						position.newBeat = thisBeat !== midiControl.abcjsLastBeat;
						midiControl.abcjsLastBeat = thisBeat;
						midiControl.abcjsListener(midiControl, position);
					}
					if (midiControl.abcjsAnimate) {
						var epsilon = beatsPerSecond / 64; // pick a small division to round to. This is called at small, random times.
						var index = findElements(midiControl.abcjsTune.noteTimings, currentTime, epsilon);
						if (index !== midiControl.abcjsLastIndex) {
							var last = midiControl.abcjsLastIndex >= 0 ? midiControl.abcjsTune.noteTimings[midiControl.abcjsLastIndex] : null;
							midiControl.abcjsAnimate(last,
								midiControl.abcjsTune.noteTimings[index]);
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
				if (midiControl.abcjsAnimate)
					midiControl.abcjsAnimate(midiControl.abcjsTune.noteTimings[midiControl.abcjsLastIndex], null);
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
		} else { // Else,
			// If some other midi is running, turn it off.

			// If this is the current midi, just continue.
			if (hasClass(parent, "abcjs-midi-current"))
			// Start this tune playing from wherever it had stopped.
				startCurrentlySelectedTune();
			else {
				deselectMidiControl();

				// else, load this midi from scratch.
				var onSuccess = function() {
					startCurrentlySelectedTune();
					addClass(parent, 'abcjs-midi-current');
				};
				loadMidi(parent, onSuccess);
			}
			// Change the element so that the pause icon is shown.
			addClass(target, "abcjs-pushed");
		}
		// This replaces the old callback. It really only needs to be called once, but it doesn't hurt to set it every time.
		parent.abcjsLastBeat = -1;
		parent.abcjsLastIndex = -1;
		setMidiCallback(midiJsListener);
	}

	midi.startPlaying = function(target) {
		onStart(target);
	};

	midi.stopPlaying = function() {
		stopCurrentlyPlayingTune();
	};

	function onSelection(target) {
		toggleClass(target, 'abcjs-pushed');
	}

	function onLoop(target) {
		toggleClass(target, 'abcjs-pushed');
	}

	function doReset(target, callback) {
		var parent = closest(target, "abcjs-inline-midi");

		function onSuccess() {
			addClass(parent, 'abcjs-midi-current');
			var progressIndicator = find(parent, "abcjs-midi-progress-indicator");
			progressIndicator.style.left = "0px";
			var clock = find(parent, "abcjs-midi-clock");
			clock.innerHTML = " 0:00";
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

		do {
			totalOffsetX += target.offsetLeft - target.scrollLeft;
			target = target.offsetParent;
		}
		while (target);

		return event.pageX - totalOffsetX;
	}

	function onProgress(target, event) {
		var parent = closest(target, "abcjs-inline-midi");
		if (hasClass(parent, "abcjs-midi-current")) {
			var play = find(parent, "abcjs-midi-start");
			play = hasClass(play, "abcjs-pushed");
			var width = target.offsetWidth;
			var offset = relMouseX(target, event);
			jumpToMidiPosition(play, offset, width);
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

	function addDelegates() {
		document.body.addEventListener("click", function(event) {
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
					onProgress(target, event);
					return;
				}
				target = target.parentNode;
			}
		});
		document.body.addEventListener("change", function(event) {
			event = event || window.event;
			var target = event.target || event.srcElement;
			while (target !== document.body) {
				if (hasClass(target, 'abcjs-midi-tempo'))
					onTempo(target, event);
				target = target.parentNode;
			}
		});
		if (window.MIDI === undefined) {
			midi.midiInlineInitialized = 'not loaded';
			var els = document.getElementsByClassName('abcjs-inline-midi');
			for (var i = 0; i < els.length; i++)
				els[i].innerHTML = "MIDI NOT PRESENT";
		}
	}

	addLoadEvent(addDelegates);

})();

module.exports = midi;
