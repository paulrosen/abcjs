//    abc_midi_create.js: Turn a linear series of events into a midi file.
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

var flatten = require('./abc_midi_flattener');
var Preparer = require('./abc_midi_js_preparer');
var rendererFactory = require('./abc_midi_renderer');
var sequence = require('./abc_midi_sequencer');

var create;

(function() {
	"use strict";

	var baseDuration = 480*4; // nice and divisible, equals 1 whole note

	create = function(abcTune, options) {
		if (options === undefined) options = {};
		var sequenceInst = sequence(abcTune, options);
		var commands = flatten(sequenceInst, options);
		var midi = rendererFactory();
		var midiJs = new Preparer();

		var title = abcTune.metaText ? abcTune.metaText.title : undefined;
		if (title && title.length > 128)
			title = title.substring(0,124) + '...';
		midi.setGlobalInfo(commands.tempo, title);
		midiJs.setGlobalInfo(commands.tempo, title);

		for (var i = 0; i < commands.tracks.length; i++) {
			midi.startTrack();
			midiJs.startTrack();
			for (var j = 0; j < commands.tracks[i].length; j++) {
				var event = commands.tracks[i][j];
				switch (event.cmd) {
					case 'program':
						midi.setChannel(event.channel);
						midi.setInstrument(event.instrument);
						midiJs.setChannel(event.channel);
						midiJs.setInstrument(event.instrument);
						break;
					case 'start':
						midi.startNote(convertPitch(event.pitch), event.volume);
						midiJs.startNote(convertPitch(event.pitch), event.volume);
						break;
					case 'stop':
						midi.endNote(convertPitch(event.pitch), 0); // TODO-PER: Refactor: the old midi used a duration here.
						midiJs.endNote(convertPitch(event.pitch));
						break;
					case 'move':
						midi.addRest(event.duration * baseDuration);
						midiJs.addRest(event.duration * baseDuration);
						break;
					default:
						console.log("MIDI create Unknown: " + event.cmd);
				}
			}
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

	function convertPitch(pitch) {
		return 60 + pitch;
	}
})();

module.exports = create;
