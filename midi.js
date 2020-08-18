import abcjs from './index'
import version from './version'

abcjs.signature = "abcjs-midi v" + version;

import renderMidi from './src/api/abc_tunebook_midi'
abcjs.renderMidi = renderMidi
require("./src/midi/abc_midi_ui_generator");

import midi from './src/midi/abc_midi_controls'
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

export default abcjs
