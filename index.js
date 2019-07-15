var animation = require('./src/api/abc_animation');
var tuneBook = require('./src/api/abc_tunebook');

var abcjs = {};

abcjs.signature = "abcjs-basic v5.8.0";

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tuneBook).forEach(function (key) {
	abcjs[key] = tuneBook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');
abcjs.TimingCallbacks = require('./src/api/abc_timing_callbacks');

var CreateSynth = require('./src/synth/create-synth');
var instrumentIndexToName = require('./src/synth/instrument-index-to-name');
var pitchToNoteName = require('./src/synth/pitch-to-note-name');
var SynthSequence = require('./src/synth/synth-sequence');

abcjs.synth = {
	CreateSynth: CreateSynth,
	instrumentIndexToName: instrumentIndexToName,
	pitchToNoteName: pitchToNoteName,
	SynthSequence: SynthSequence
};

var editor = require('./src/edit/abc_editor');
abcjs['Editor'] = editor;

module.exports = abcjs;
