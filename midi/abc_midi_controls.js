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

	window.ABCJS.midi.generateMidiControls = function(tune, midiParams, midi, index) {
		if (window.ABCJS.midiInlineInitialized === 'failed')
			return '<div class="abcjs-inline-midi abcjs-midi-' + index + '">ERROR</div>';
		if (window.ABCJS.midiInlineInitialized === 'not loaded')
			return '<div class="abcjs-inline-midi abcjs-midi-' + index + '">MIDI NOT PRESENT</div>';

		var options = midiParams.inlineControls || {};
		if (options.standard === undefined) options.standard = true;

		var html = '<div class="abcjs-inline-midi abcjs-midi-' + index + '">';
		html += '<span class="abcjs-data" style="display:none;">' + escape(midi) + '</span>';
		if (midiParams.preTextInline)
			html += midiParams.preTextInline;

		if (options.selectionToggle)
			html += '<button class="abcjs-midi-selection abcjs-btn"></button>';
		if (options.loopToggle)
			html += '<button class="abcjs-midi-loop abcjs-btn"></button>';
		if (options.standard)
			html += '<button class="abcjs-midi-reset abcjs-btn"></button><button class="abcjs-midi-start abcjs-btn"></button><button class="abcjs-midi-progress-background"><span class="abcjs-midi-progress-indicator"></span></button>';
		if (options.tempo) {
			var startTempo = tune && tune.metaText && tune.metaText.tempo ? tune.metaText.tempo.bpm : 180;
			html += '<span class="abcjs-tempo-wrapper"><input class="abcjs-midi-tempo" value="100" type="number" min="1" max="300" />% (<span class="abcjs-midi-current-tempo"></span>' + startTempo + ' BPM)</span>';
		}

		if (midiParams.postTextInline)
			html += midiParams.postTextInline;
		return html + "</div>";
	};

	window.ABCJS.midi.soundfontUrl = "/soundfont/";

	function hasClass(element, cls) {
		return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	}

	function addClass(element, cls) {
		if (!hasClass(element, cls))
			element.className = element.className + " "+cls;
	}

	function removeClass(element, cls) {
		element.className = element.className.replace(cls, "").trim().replace("  ", " ");
	}

	function closest(element, cls) {
		// This finds the closest parent that contains the class passed in.
		while (element !== document.body) {
			if (hasClass(element, cls))
				return element;
			element = element.parentNode;
		}
		return null;
	}

	function find(element, cls) {
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

	function loadMidi(target) {
		function onsuccess() {
			MIDI.Player.start();
			addClass(target, 'abcjs-midi-current');
		}
		function onprogress(/*state, progress*/) {
		}
		function onerror(e) {
			console.error("loadMidi: " + e);
		}

		var dataEl = find(target, "abcjs-data");
		var data = dataEl.innerHTML;
		MIDI.Player.currentData = unescape(data);
		MIDI.Player.currentTime = 0;
		MIDI.Player.restart = 0;

		MIDI.Player.loadMidiFile(onsuccess, onprogress, onerror);
	}

	function onStart(target) {
		// If this midi is already playing,
		if (hasClass(target, 'abcjs-pause')) {
			// Stop it.
			MIDI.Player.pause();
			// Change the element so that the start icon is shown.
			removeClass(target, "abcjs-pause");
		} else { // Else,
			// If some other midi is running, turn it off.
			var parent = closest(target, "abcjs-inline-midi");
			// If this is the current midi, just continue.
			if (hasClass(parent, "abcjs-midi-current"))
				// Start this tune playing from wherever it had stopped.
				MIDI.Player.start();
			else {
				var otherMidi = find(document, "abcjs-midi-current");
				if (otherMidi) {
					MIDI.Player.stop();
					removeClass(otherMidi, "abcjs-midi-current");
					var otherMidiStart = find(otherMidi, "abcjs-midi-start");
					removeClass(otherMidiStart, "abcjs-pause");
				}
				// else, load this midi from scratch.
				loadMidi(parent);
			}
			// Change the element so that the pause icon is shown.
			addClass(target, "abcjs-pause");
		}
	}

	function onSelection() {

	}

	function onLoop() {

	}

	function onReset() {

	}

	function onProgress() {

	}

	function onTempo() {

	}

	function addDelegates() {
		document.body.addEventListener("click", function(event) {
			event = event || window.event;
			var target = event.target || event.srcElement;
			while (target !== document.body) {
				if (hasClass(target, 'abcjs-midi-start'))
					onStart(target);
				else if (hasClass(target, 'abcjs-midi-selection'))
					onSelection(target);
				else if (hasClass(target, 'abcjs-midi-loop'))
					onLoop(target);
				else if (hasClass(target, 'abcjs-midi-reset'))
					onReset(target);
				else if (hasClass(target, 'abcjs-midi-progress-background'))
					onProgress(target);
				target = target.parentNode;
			}
		});
		document.body.addEventListener("change", function(event) {
			event = event || window.event;
			var target = event.target || event.srcElement;
			while (target !== document.body) {
				if (hasClass(target, 'abcjs-midi-tempo'))
					onTempo(target);
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
