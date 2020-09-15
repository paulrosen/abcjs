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

var SynthSequence = function() {
	var self = this;
	self.tracks = [];
	self.totalDuration = 0;
	self.currentInstrument = [];
	self.starts = [];

	self.addTrack = function() {
		self.tracks.push([]);
		self.currentInstrument.push(0);
		self.starts.push(0);
		return self.tracks.length - 1;
	};

	self.setInstrument = function(trackNumber, instrumentNumber) {
		self.tracks[trackNumber].push({
			channel: 0,
			cmd: "program",
			instrument: instrumentNumber
		});
		self.currentInstrument[trackNumber] = instrumentNumber;
	};

	self.appendNote = function(trackNumber, pitch, durationInMeasures, volume) {
		self.tracks[trackNumber].push({
			cmd: "note",
			duration: durationInMeasures,
			gap: 0,
			instrument: self.currentInstrument[trackNumber],
			pitch: pitch,
			start: self.starts[trackNumber],
			volume: volume
		});
		self.starts[trackNumber] += durationInMeasures;

		self.totalDuration = Math.max(self.totalDuration, self.starts[trackNumber]);
	};
};

module.exports = SynthSequence;
