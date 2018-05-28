var animation = require('./src/api/abc_animation');
var tunebook = require('./src/api/abc_tunebook');

var abcjs = {};

abcjs.signature = "abcjs-mei v5.1.2";

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tunebook).forEach(function (key) {
	abcjs[key] = tunebook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');
abcjs.renderMidi = require('./src/api/abc_tunebook_midi');
var mei = require('./src/api/mei_tunebook_svg');
abcjs.renderMei = mei.renderMei;
abcjs.parseMei = mei.parseMei;

var editor = require('./src/edit/abc_editor');
abcjs['Editor'] = editor;
require("./src/midi/abc_midi_ui_generator");

var midi = require('./src/midi/abc_midi_controls');
abcjs.midi = {
	setSoundFont: midi.setSoundFont,
	startPlaying: midi.startPlaying,
	restartPlaying: midi.restartPlaying,
	stopPlaying: midi.stopPlaying,
	setLoop: midi.setLoop,
	deviceSupportsMidi: midi.deviceSupportsMidi,
	setRandomProgress: midi.setRandomProgress,
};

var parserLint = require('./src/test/abc_parser_lint');
var verticalLint = require('./src/test/abc_vertical_lint');
var midiLint = require('./src/test/abc_midi_lint');
var midiSequencerLint = require('./src/test/abc_midi_sequencer_lint');
abcjs.test = { ParserLint: parserLint, verticalLint: verticalLint, midiLint: midiLint, midiSequencerLint: midiSequencerLint };

module.exports = abcjs;
