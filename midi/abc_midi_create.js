//    abc_midi_create.js: Turn a linear series of events into a midi file.
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

		if (commands.instrument !== undefined) {
			midi.setInstrument(commands.instrument);
			midiJs.setInstrument(commands.instrument);
		}
		if (commands.channel !== undefined) {
			midi.setChannel(commands.channel);
			midiJs.setChannel(commands.channel);
		}
		for (var i = 0; i < commands.tracks.length; i++) {
			midi.startTrack();
			midiJs.startTrack();
			for (var j = 0; j < commands.tracks[i].length; j++) {
				var event = commands.tracks[i][j];
				switch (event.cmd) {
					case 'instrument':
						midi.setInstrument(event.instrument);
						midiJs.setInstrument(event.instrument);
						break;
					case 'channel':
						midi.setChannel(event.channel);
						midiJs.setChannel(event.channel);
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
