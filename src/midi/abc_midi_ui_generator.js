//    abc_midi_ui_generator.js: Used by the editor to automatically generate the correct midi elements.

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
