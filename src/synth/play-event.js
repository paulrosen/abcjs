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
