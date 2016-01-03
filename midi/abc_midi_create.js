//    abc_midi_create.js: Turn a linear series of events into a midi file.
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

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.midi)
	window.ABCJS.midi = {};

(function() {
	"use strict";

	var baseDuration = 480*4; // nice and divisible, equals 1 whole note

	window.ABCJS.midi.create = function(abcTune, options) {
		if (options === undefined) options = {};
		var sequence = window.ABCJS.midi.sequence(abcTune, options);
		var commands = window.ABCJS.midi.flatten(sequence);
		var midi = window.ABCJS.midi.rendererFactory();

		if (commands.instrument !== undefined)
			midi.setInstrument(commands.instrument);
		if (commands.channel !== undefined)
			midi.setChannel(commands.channel);
		var title = abcTune.metaText ? abcTune.metaText.title : undefined;
		if (title && title.length > 128)
			title = title.substring(0,124) + '...';
		midi.setGlobalInfo(commands.tempo, title);

		for (var i = 0; i < commands.tracks.length; i++) {
			midi.startTrack();
			for (var j = 0; j < commands.tracks[i].length; j++) {
				var event = commands.tracks[i][j];
				switch (event.cmd) {
					case 'instrument':
						midi.setInstrument(event.instrument);
						break;
					case 'start':
						midi.startNote(convertPitch(event.pitch), event.volume);
						break;
					case 'stop':
						midi.endNote(convertPitch(event.pitch), 0); // TODO-PER: Refactor: the old midi used a duration here.
						break;
					case 'move':
						midi.addRest(event.duration * baseDuration);
						break;
					default:
						console.log("MIDI create Unknown: " + event.cmd);
				}
			}
			midi.endTrack();
		}

		// TODO-PER: probably do this backwards: change the midi generation to NOT escape, then call escape for the download version.
		var midiFile = midi.getData();
		var midiInline = unescape(midiFile.substring(16));
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
		return "<div>MIDICONTROLS</div>";
	};
})();
