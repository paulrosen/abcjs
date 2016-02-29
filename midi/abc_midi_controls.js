//    abc_midi_controls.js: Handle the visual part of playing MIDI
//    Copyright (C) 2010,2015 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

/*globals MIDI */
if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.midi)
	window.ABCJS.midi = {};

(function() {
	"use strict";
	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	window.ABCJS.midi.generateMidiDownloadLink = function(tune, midiParams, midi, index) {
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
			label = "Download MIDI for \"" + title +  "\"";
		title = title.toLowerCase().replace(/'/g, '').replace(/\W/g, '_').replace(/__/g, '_');
		html += '<a download="' + title + '.midi" href="' + midi + '">' + label + '</a>';
		if (midiParams.postTextDownload)
			html += midiParams.postTextDownload;
		return html + "</div>";
	};

	function preprocessLabel(label, title) {
		return label.replace(/%T/g, title);
	}

	window.ABCJS.midi.generateMidiControls = function(tune, midiParams, midi, index) {
		if (window.ABCJS.midiInlineInitialized === 'failed')
			return '<div class="abcjs-inline-midi abcjs-midi-' + index + '">ERROR</div>';
		if (window.ABCJS.midiInlineInitialized === 'not loaded')
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
			style = ' style="display:none;"';
		var html = '<div class="abcjs-inline-midi abcjs-midi-' + index + '"' + style + '>';
		html += '<span class="abcjs-data" style="display:none;">' + JSON.stringify(midi) + '</span>';
		if (midiParams.preTextInline)
			html += '<span class="abcjs-midi-pre">'+ preprocessLabel(midiParams.preTextInline, title) + '</span>';

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
			html += '<span class="abcjs-midi-post">'+ preprocessLabel(midiParams.postTextInline, title) + '</span>';
		return html + "</div>";
	};

	window.ABCJS.midi.soundfontUrl = "/soundfont/";

	function hasClass(element, cls) {
		if (!element)
			return false;
		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	}

	function addClass(element, cls) {
		if (!element)
			return;
		if (!hasClass(element, cls))
			element.className = element.className + " "+cls;
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
		var oldonload = window.onload;
		if (typeof window.onload !== 'function') {
			window.onload = func;
		} else {
			window.onload = function() {
				if (oldonload) {
					oldonload();
				}
				func();
			};
		}
	}

	var getLength = function(data) {
		var length = data.length;
		var totalTime = 0.5;
		for (var n = 0; n < length; n++) {
			totalTime += data[n][1];
		}
		return totalTime;
	};

	var getFileInstruments = function(data) {
		var instruments = {};
		var programs = {};
		for (var n = 0; n < data.length; n ++) {
			var event = data[n][0].event;
			if (event.type !== 'channel') {
				continue;
			}
			var channel = event.channel;
			switch(event.subtype) {
				case 'programChange':
					programs[channel] = event.programNumber;
					break;
				case 'noteOn':
					var program = programs[channel];
					var gm = MIDI.GM.byId[isFinite(program) ? program : channel];
					instruments[gm.id] = true;
					break;
			}
		}
		var ret = [];
		for (var key in instruments) {
			if (instruments.hasOwnProperty(key))
				ret.push(key);
		}
		return ret;
	};

	function loadMidi(target, onsuccess) {
		function onprogress(/*state, progress*/) {
		}
		function onerror(e) {
			console.error("loadMidi: " + e);
		}

		var dataEl = find(target, "abcjs-data");
		var data = JSON.parse(dataEl.innerHTML);
//		MIDI.Player.currentData = unescape(data);
		MIDI.Player.currentTime = 0;
		MIDI.Player.restart = 0;
		MIDI.Player.BPM = undefined; // This fixes the problem with the tempo. We don't want to override.

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
		MIDI.Player.timeWarp = timeWarp;

		//var what = MidiFile(unescape(data));
		//var replayer = new Replayer(what, MIDI.Player.timeWarp, null);
		//var whatWhat = replayer.getData();
		//console.log(JSON.stringify(what));
		//console.log(JSON.stringify(whatWhat));
//		MIDI.Player.loadMidiFile(onsuccess, onprogress, onerror);
//		MIDI.Player.replayer = new Replayer(data, MIDI.Player.timeWarp, null, undefined);
		MIDI.Player.data = data;
		MIDI.Player.replayer = {
			getData: function() {
				return MIDI.Player.data;
			}
		};
		onsuccess();
//		MIDI.Player.endTime = getLength(whatWhat);

		//MIDI.loadPlugin({
		//	instruments: getFileInstruments(whatWhat),
		//	onsuccess: onsuccess,
		//	onprogress: onprogress,
		//	onerror: onerror
		//});
	}

	function deselectMidiControl() {
		var otherMidi = find(document, "abcjs-midi-current");
		if (otherMidi) {
			MIDI.Player.stop();
			removeClass(otherMidi, "abcjs-midi-current");
			var otherMidiStart = find(otherMidi, "abcjs-midi-start");
			removeClass(otherMidiStart, "abcjs-pushed");
		}
	}

	var lastNow;
	var tempSelection = 109;
	function midiJsListener(currentNote) {
		// currentNote is a hash containing: { channel, end, message, note, now, velocity }
		var midiControl;
		if (currentNote.end > 0 && lastNow !== currentNote.now) {
			lastNow = currentNote.now;
			var currentPosition = currentNote.now / currentNote.end; // This returns a number between 0 and 1.
			midiControl = find(document, "abcjs-midi-current");
			if (midiControl) {
				var progressBackground = find(midiControl, "abcjs-midi-progress-background");
				var totalWidth = progressBackground.offsetWidth;
				var progressIndicator = find(midiControl, "abcjs-midi-progress-indicator");
				var scaled = totalWidth * currentPosition; // The number of pixels
				progressIndicator.style.left = scaled + "px";
				var clock = find(midiControl, "abcjs-midi-clock");
				if (clock) {
					var seconds = Math.floor(currentNote.now / 1000);
					var minutes = Math.floor(seconds / 60);
					seconds = seconds % 60;
					if (seconds < 10) seconds = "0" + seconds;
					if (minutes < 10) minutes = " " + minutes;
					clock.innerHTML = minutes + ":" + seconds;
				}
				if (midiControl.abcjsListener)
					midiControl.abcjsListener(midiControl, currentNote);
				if (midiControl.abcjsAnimate) {
					if (currentNote.velocity > 0) {
						midiControl.abcjsTune.engraver.rangeHighlight(tempSelection, tempSelection + 1);
						tempSelection++;
						if (tempSelection > 343)
							tempSelection = 109;
					}
				}
			}
		}
		if (currentNote.now === currentNote.end) {
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
			}, 1);
		}
	}

	function onStart(target) {
		// If this midi is already playing,
		if (hasClass(target, 'abcjs-pushed')) {
			// Stop it.
			MIDI.Player.pause();
			// Change the element so that the start icon is shown.
			removeClass(target, "abcjs-pushed");
		} else { // Else,
			// If some other midi is running, turn it off.
			var parent = closest(target, "abcjs-inline-midi");
			// If this is the current midi, just continue.
			if (hasClass(parent, "abcjs-midi-current"))
				// Start this tune playing from wherever it had stopped.
				MIDI.Player.start();
			else {
				deselectMidiControl();

				// else, load this midi from scratch.
				var onsuccess = function() {
					MIDI.Player.start();
					addClass(parent, 'abcjs-midi-current');
				};
				loadMidi(parent, onsuccess);
			}
			// Change the element so that the pause icon is shown.
			addClass(target, "abcjs-pushed");
		}
		// This replaces the old callback. It really only needs to be called once, but it doesn't hurt to set it every time.
		MIDI.Player.addListener(midiJsListener);
	}

	window.ABCJS.midi.startPlaying = function(target) {
		onStart(target);
	};

	function onSelection(target) {
		toggleClass(target, 'abcjs-pushed');
	}

	function onLoop(target) {
		toggleClass(target, 'abcjs-pushed');
	}

	function doReset(target, callback) {
		var parent = closest(target, "abcjs-inline-midi");
		function onsuccess() {
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
		loadMidi(parent, onsuccess);
	}

	function onReset(target) {
		doReset(target);
	}

	function relMouseX(target, event){
		var totalOffsetX = 0;
		var canvasX = 0;

		do{
			totalOffsetX += target.offsetLeft - target.scrollLeft;
		}
		while(target = target.offsetParent);

		canvasX = event.pageX - totalOffsetX;

		return canvasX;
	}

	function onProgress(target, event) {
		var parent = closest(target, "abcjs-inline-midi");
		if (hasClass(parent, "abcjs-midi-current")) {
			var play = find(parent, "abcjs-midi-start");
			play = hasClass(play, "abcjs-pushed");
			var width = target.offsetWidth;
			var offset = relMouseX(target, event);
			var ratio = offset / width;
			var endTime = MIDI.Player.endTime;
			if (play)
				MIDI.Player.pause();
			MIDI.Player.currentTime = endTime * ratio;
			// TODO-PER: if the control is currently paused, then the thumb won't jump to the right place: move it manually.
			if (play)
				MIDI.Player.start();
		}
	}

	function onTempo(el) {
		var percent = parseInt(el.value, 10);
		var startTempo = parseInt(el.getAttribute("data-start-tempo", 10));

		while (el && !hasClass(el, 'abcjs-midi-current-tempo')) {
			el = el.nextSibling;
		}
		el.innerHTML = Math.floor(percent*startTempo/100);
		// Time warp is a multiplier: the larger the number, the longer the time. Therefore,
		// it is opposite of the percentage. That is, playing at 50% is actually multiplying the time by 2.
		if (percent > 0)
			MIDI.Player.timeWarp = 100 / percent;
		else
			MIDI.Player.timeWarp = 1;
		//var saveTime = MIDI.Player.currentTime;
		//var saveRestart = MIDI.Player.restart;
		//loadMidi(closest(el, "abcjs-inline-midi", onsuccess));
		//MIDI.Player.currentTime = saveTime;
		//MIDI.Player.restart = saveRestart;
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
		function midiLoaded() {
			window.ABCJS.midi.midiInlineInitialized = 'succeeded';
		}
		function midiNotLoaded(e) {
			console.error(e);
			//var xhr = this;
			//console.log("onerror: " + xhr.status + " " + xhr.statusText);

			window.ABCJS.midi.midiInlineInitialized = 'failed';
			var els = document.getElementsByClassName('abcjs-inline-midi');
			for (var i = 0; i < els.length; i++)
				els[i].innerHTML = "ERROR";
		}
		if (window.MIDI === undefined) {
			window.ABCJS.midi.midiInlineInitialized = 'not loaded';
			var els = document.getElementsByClassName('abcjs-inline-midi');
			for (var i = 0; i < els.length; i++)
				els[i].innerHTML = "MIDI NOT PRESENT";
		} else
			MIDI.loadPlugin({ soundfontUrl: window.ABCJS.midi.soundfontUrl, onsuccess: midiLoaded, onerror: midiNotLoaded });
	}

	addLoadEvent(addDelegates);

})();
