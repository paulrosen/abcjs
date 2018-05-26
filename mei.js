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
abcjs.renderMei = require('./src/api/mei_tunebook_svg');

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

module.exports = abcjs;
