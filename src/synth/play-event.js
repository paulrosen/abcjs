var SynthSequence = require('./synth-sequence');
var CreateSynth = require('./create-synth');

function playEvent(midiPitches, millisecondsPerMeasure) {
	var sequence = new SynthSequence();

	for (var i = 0; i < midiPitches.length; i++) {
		var note = midiPitches[i];
		var trackNum = sequence.addTrack();
		sequence.setInstrument(trackNum, note.instrument);
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
