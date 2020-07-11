var abcjs = require('./index');
var version = require('./version');

abcjs.signature = "abcjs-midi v" + version;

abcjs.renderMidi = require('./src/api/abc_tunebook_midi');
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
	setInteractiveProgressBar: midi.setInteractiveProgressBar
};

module.exports = abcjs;
