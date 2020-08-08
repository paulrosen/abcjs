//    Copyright (C) 2019-2020 Paul Rosen (paul at paulrosen dot net)
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
						map[i].push({
							pitch: ev.pitch,
							instrument: currentInstrument,
							start: Math.round((ev.start) * 1000000)/1000000,
							end: Math.round((ev.start + len - gap) * 1000000)/1000000,
							volume: ev.volume
						});
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
