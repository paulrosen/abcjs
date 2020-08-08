//    abc_midi_create.js: Turn a linear series of events into a midi file.
//    Copyright (C) 2010-2020 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

var Preparer = require('./abc_midi_js_preparer');
var rendererFactory = require('../synth/abc_midi_renderer');

var create;

(function() {
	"use strict";

	var baseDuration = 480*4; // nice and divisible, equals 1 whole note

	create = function(abcTune, options) {
		if (options === undefined) options = {};
		var commands = abcTune.setUpAudio(options);
		var midi = rendererFactory();
		var midiJs = new Preparer();

		var title = abcTune.metaText ? abcTune.metaText.title : undefined;
		if (title && title.length > 128)
			title = title.substring(0,124) + '...';
		var key = abcTune.getKeySignature();
		var time = abcTune.getMeterFraction();
		midi.setGlobalInfo(commands.tempo, title, key, time);
		midiJs.setGlobalInfo(commands.tempo, title);

		for (var i = 0; i < commands.tracks.length; i++) {
			midi.startTrack();
			midiJs.startTrack();
			var notePlacement = {};
			for (var j = 0; j < commands.tracks[i].length; j++) {
				var event = commands.tracks[i][j];
				switch (event.cmd) {
					case 'text':
						midi.setText(event.type, event.text);
						break;
					case 'program':
						midi.setChannel(event.channel);
						midi.setInstrument(event.instrument);
						midiJs.setChannel(event.channel);
						midiJs.setInstrument(event.instrument);
						break;
					case 'note':
						var start = event.start;
						var end = start + event.duration;
						// TODO: end is affected by event.gap, too.
						if (!notePlacement[start])
							notePlacement[start] = [];
						notePlacement[start].push({ pitch: event.pitch, volume: event.volume });
						if (!notePlacement[end])
							notePlacement[end] = [];
						notePlacement[end].push({ pitch: event.pitch, volume: 0 });
						break;
					default:
						console.log("MIDI create Unknown: " + event.cmd);
				}
			}
			addNotes(midi, midiJs, notePlacement, baseDuration);
			midi.endTrack();
			midiJs.endTrack();
		}

		var midiFile = midi.getData();
		var midiInline = midiJs.getData();
		if (options.generateInline === undefined) // default is to generate inline controls.
			options.generateInline = true;
		if (options.generateInline && options.generateDownload)
			return { download: midiFile, inline: midiInline };
		else if (options.generateInline)
			return midiInline;
		else
			return midiFile;
	};

	function addNotes(midi, midiJs, notePlacement, baseDuration) {
		var times = Object.keys(notePlacement);
		for (var h = 0; h < times.length; h++)
			times[h] = parseFloat(times[h]);
		times.sort(function(a,b) {
			return a - b;
		});
		var lastTime = 0;
		for (var i = 0; i < times.length; i++) {
			var events = notePlacement[times[i]];
			if (times[i] > lastTime) {
				var distance = (times[i] - lastTime) * baseDuration;
				midi.addRest(distance);
				midiJs.addRest(distance);
				lastTime = times[i];
			}
			for (var j = 0; j < events.length; j++) {
				var event = events[j];
				if (event.volume) {
					midi.startNote(event.pitch, event.volume);
					midiJs.startNote(event.pitch, event.volume);
				} else {
					midi.endNote(event.pitch);
					midiJs.endNote(event.pitch);
				}
			}
		}
	}

})();

module.exports = create;
