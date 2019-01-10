//    abc_midi_ui_generator.js: Used by the editor to automatically generate the correct midi elements.
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

var midi = require('./abc_midi_controls');
var midiCreate = require('./abc_midi_create');
var abcMidiUiGenerator;

(function () {
	"use strict";

	abcMidiUiGenerator = function(tunes, abcjsParams, downloadMidiEl, inlineMidiEl, engravingEl) {
		var downloadMidiHtml = "";
		var inlineMidiHtml = "";
		for (var i = 0; i < tunes.length; i++) {
			var midiInst = midiCreate(tunes[i], abcjsParams);

			var stopOld = !inlineMidiEl || inlineMidiEl.innerHTML.indexOf("abcjs-midi-current") >= 0;

			if (abcjsParams.generateInline && abcjsParams.generateDownload) {
				downloadMidiHtml += midi.generateMidiDownloadLink(tunes[i], abcjsParams, midiInst.download, i);
				inlineMidiHtml += midi.generateMidiControls(tunes[i], abcjsParams, midiInst.inline, i, stopOld);
			} else if (abcjsParams.generateInline)
				inlineMidiHtml += midi.generateMidiControls(tunes[i], abcjsParams, midiInst, i);
			else
				downloadMidiHtml += midi.generateMidiDownloadLink(tunes[i], abcjsParams, midiInst, i, stopOld);
		}
		if (abcjsParams.generateDownload) {
			if (downloadMidiEl)
				downloadMidiEl.innerHTML = downloadMidiHtml;
			else
				engravingEl.innerHTML += downloadMidiHtml;
		}
		var find = function (element, cls) {
			var els = element.getElementsByClassName(cls);
			if (els.length === 0)
				return null;
			return els[0];
		};
		if (abcjsParams.generateInline) {
			var inlineDiv;
			if (inlineMidiEl) {
				inlineMidiEl.innerHTML = inlineMidiHtml;
				inlineDiv = inlineMidiEl;
			} else {
				engravingEl.innerHTML += inlineMidiHtml;
				inlineDiv = engravingEl;
			}
			midi.attachListeners(inlineMidiEl);

			if (abcjsParams.animate || abcjsParams.midiListener) {
				for (i = 0; i < tunes.length; i++) {
					var parent = find(inlineDiv, "abcjs-midi-" + i);
					parent.abcjsTune = tunes[i];
					parent.abcjsListener = abcjsParams.midiListener;
					parent.abcjsQpm = abcjsParams.qpm;
					parent.abcjsContext = abcjsParams.context;
					if (abcjsParams.animate) {
						var drumIntro = abcjsParams.drumIntro ? abcjsParams.drumIntro : 0;
						parent.abcjsAnimate = abcjsParams.animate.listener;
						parent.abcjsTune.setTiming(abcjsParams.qpm, drumIntro);
					}
				}
			}
		}
	};

	window.addEventListener("generateMidi", function (e) {
		var options = e.detail;
		abcMidiUiGenerator(options.tunes, options.abcjsParams, options.downloadMidiEl, options.inlineMidiEl, options.engravingEl);
	});
})();

module.exports = abcMidiUiGenerator;
