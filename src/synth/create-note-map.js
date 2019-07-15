// Convert the input structure to a more useful structure where each item has a length of its own.

var instrumentIndexToName = require('./instrument-index-to-name');

var createNoteMap = function(sequence) {
	var map = [];
	for (var i = 0; i < sequence.tracks.length; i++)
		map.push([]);

	// TODO-PER: handle more than one note in a track
	var nextNote = {};
	var currentInstrument = instrumentIndexToName[0];
	sequence.tracks.forEach(function(track, i) {
		var currentTime = 0;
		track.forEach(function(ev) {
			switch (ev.cmd) {
				case "start":
					nextNote[ev.pitch] = { time: currentTime, instrument: currentInstrument, volume: ev.volume };
					break;
				case "move":
					currentTime += ev.duration;
					break;
				case "stop":
					map[i].push({pitch: ev.pitch, instrument: nextNote[ev.pitch].instrument, start: nextNote[ev.pitch].time, end: currentTime, volume: nextNote[ev.pitch].volume});
					delete nextNote[ev.pitch];
					break;
				case "program":
					currentInstrument = instrumentIndexToName[ev.instrument];
					break;
				default:
					// TODO-PER: handle other event types
					console.log("Unhanded midi event", ev);
			}
		});
	});
	return map;
};

module.exports = createNoteMap;
