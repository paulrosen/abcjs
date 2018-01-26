const animation = require('./src/api/abc_animation');
const tunebook = require('./src/api/abc_tunebook');

let abcjs = {};

abcjs.signature = "abcjs-midi v3.3.1";

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tunebook).forEach(function (key) {
	abcjs[key] = tunebook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');
abcjs.renderMidi = require('./src/api/abc_tunebook_midi');

const editor = require('./src/edit/abc_editor');
abcjs['Editor'] = editor;
require("./src/midi/abc_midi_ui_generator");

const midi = require('./src/midi/abc_midi_controls');
abcjs.midi = { setSoundFont: midi.setSoundFont };

module.exports = abcjs;
