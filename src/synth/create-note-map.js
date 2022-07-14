// Convert the input structure to a more useful structure where each item has a length of its own.

var instrumentIndexToName = require('./instrument-index-to-name');

var createNoteMap = function(sequence) {
	var map = [];
	for (var i = 0; i < sequence.tracks.length; i++)
		map.push([]);

	// TODO-PER: handle more than one note in a track
	var nextNote = {};
	var currentInstrument = instrumentIndexToName[0];
	// ev.start and ev.duration are in whole notes. Need to turn them into
	sequence.tracks.forEach(function(track, i) {
		track.forEach(function(ev) {
			switch (ev.cmd) {
				case "note":
					// ev contains:
					// {"cmd":"note","pitch":72,"volume":95,"start":0.125,"duration":0.25,"instrument":0,"gap":0}
					// where start and duration are in whole notes, gap is in 1/1920 of a second (i.e. MIDI ticks)
					if (ev.duration > 0) {
						var gap = ev.gap ? ev.gap : 0;
						var len = ev.duration;
						gap = Math.min(gap, len * 2 / 3);
						var obj = {
							pitch: ev.pitch,
							instrument: currentInstrument,
							start: Math.round((ev.start) * 1000000)/1000000,
							end: Math.round((ev.start + len - gap) * 1000000)/1000000,
							volume: ev.volume
						};
						if (ev.startChar)
							obj.startChar = ev.startChar;
						if (ev.endChar)
							obj.endChar = ev.endChar;
						if (ev.style)
							obj.style = ev.style;
						if (ev.cents)
							obj.cents = ev.cents;
						map[i].push(obj);
					}
					break;
				case "program":
					currentInstrument = instrumentIndexToName[ev.instrument];
					break;
				case "text":
					// Ignore the track names - that is just for midi files.
					break;
				default:
					// TODO-PER: handle other event types
					console.log("Unhandled midi event", ev);
			}
		});
	});
	return map;
};

module.exports = createNoteMap;
