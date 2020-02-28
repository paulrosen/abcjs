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

var SynthSequence = require('./synth-sequence');
var CreateSynth = require('./create-synth');

function playEvent(midiPitches, midiGracePitches, millisecondsPerMeasure) {
	var sequence = new SynthSequence();

	for (var i = 0; i < midiPitches.length; i++) {
		var note = midiPitches[i];
		var trackNum = sequence.addTrack();
		sequence.setInstrument(trackNum, note.instrument);
		if (i === 0 && midiGracePitches) {
			for (var j = 0; j < midiGracePitches.length; j++) {
				var grace = midiGracePitches[j];
				sequence.appendNote(trackNum, grace.pitch, 1 / 64, grace.volume);
			}
		}
		sequence.appendNote(trackNum, note.pitch, note.durationInMeasures, note.volume);
	}

	var buffer = new CreateSynth();
	return buffer.init({
		sequence: sequence,
		millisecondsPerMeasure: millisecondsPerMeasure
	}).then(function () {
		return buffer.prime();
	}).then(function () {
		return buffer.start();
	});
}
module.exports = playEvent;
