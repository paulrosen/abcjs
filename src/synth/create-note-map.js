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
					if (nextNote[ev.pitch]) { // If unisons are requested, then there might be two starts and two stops for the same note. Only use one of them.
						map[i].push({
							pitch: ev.pitch,
							instrument: nextNote[ev.pitch].instrument,
							start: nextNote[ev.pitch].time,
							end: currentTime,
							volume: nextNote[ev.pitch].volume
						});
						delete nextNote[ev.pitch];
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
					console.log("Unhanded midi event", ev);
			}
		});
	});
	return map;
};

module.exports = createNoteMap;
