var SynthSequence = require('./synth-sequence');
var CreateSynth = require('./create-synth');
var activeAudioContext = require("./active-audio-context");

function playEvent(midiPitches, midiGracePitches, millisecondsPerMeasure) {
	var sequence = new SynthSequence();

	for (var i = 0; i < midiPitches.length; i++) {
		var note = midiPitches[i];
		var trackNum = sequence.addTrack();
		sequence.setInstrument(trackNum, note.instrument);
		if (i === 0 && midiGracePitches) {
			for (var j = 0; j < midiGracePitches.length; j++) {
				var grace = midiGracePitches[j];
				sequence.appendNote(trackNum, grace.pitch, 1 / 64, grace.volume, grace.cents);
			}
		}
		sequence.appendNote(trackNum, note.pitch, note.duration, note.volume, note.cents);
	}

	var ac = activeAudioContext();
	if (ac.state === "suspended") {
		return ac.resume().then(function () {
			return doPlay(sequence, millisecondsPerMeasure);
		});
	} else {
		return doPlay(sequence, millisecondsPerMeasure);
	}
}

function doPlay(sequence, millisecondsPerMeasure) {
	var buffer = new CreateSynth();
	return buffer.init({
		sequence: sequence,
		millisecondsPerMeasure: millisecondsPerMeasure
	}).then(function () {
		return buffer.prime();
	}).then(function () {
		buffer.start();
		return Promise.resolve();
	});
}

module.exports = playEvent;
