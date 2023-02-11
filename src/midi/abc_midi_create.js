//    abc_midi_create.js: Turn a linear series of events into a midi file.

var rendererFactory = require('../synth/abc_midi_renderer');

var create;

(function() {
	"use strict";

	var baseDuration = 480*4; // nice and divisible, equals 1 whole note

	create = function(abcTune, options) {
		if (options === undefined) options = {};
		var commands = abcTune.setUpAudio(options);
		var midi = rendererFactory();

		var title = abcTune.metaText ? abcTune.metaText.title : undefined;
		if (title && title.length > 128)
			title = title.substring(0,124) + '...';
		var key = abcTune.getKeySignature();
		var time = abcTune.getMeterFraction();
		var beatsPerSecond = commands.tempo / 60;
		//var beatLength = abcTune.getBeatLength();
		midi.setGlobalInfo(commands.tempo, title, key, time);

		for (var i = 0; i < commands.tracks.length; i++) {
			midi.startTrack();
			var notePlacement = {};
			for (var j = 0; j < commands.tracks[i].length; j++) {
				var event = commands.tracks[i][j];
				switch (event.cmd) {
					case 'text':
						midi.setText(event.type, event.text);
						break;
					case 'program':
						var pan = 0;
						if (options.pan && options.pan.length > i)
							pan = options.pan[i];
						if (event.instrument === 128) {
							// If we're using the percussion voice, change to Channel 10
							midi.setChannel(9, pan);
							midi.setInstrument(0);
						} else {
							midi.setChannel(event.channel, pan);
							midi.setInstrument(event.instrument);
						}
						break;
					case 'note':
						var gapLengthInBeats = event.gap * beatsPerSecond;
						var start = event.start;
						// The staccato and legato are indicated by event.gap.
						// event.gap is in seconds but the durations are in whole notes.
						var end = start + event.duration - gapLengthInBeats;
						if (!notePlacement[start])
							notePlacement[start] = [];
						notePlacement[start].push({ pitch: event.pitch, volume: event.volume, cents: event.cents });
						if (!notePlacement[end])
							notePlacement[end] = [];
						notePlacement[end].push({ pitch: event.pitch, volume: 0 });
						break;
					default:
						console.log("MIDI create Unknown: " + event.cmd);
				}
			}
			addNotes(midi, notePlacement, baseDuration);
			midi.endTrack();
		}

		return midi.getData();
	};

	function addNotes(midi, notePlacement, baseDuration) {
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
				lastTime = times[i];
			}
			for (var j = 0; j < events.length; j++) {
				var event = events[j];
				if (event.volume) {
					midi.startNote(event.pitch, event.volume, event.cents);
				} else {
					midi.endNote(event.pitch);
				}
			}
		}
	}

})();

module.exports = create;
