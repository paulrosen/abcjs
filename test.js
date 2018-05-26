var animation = require('./src/api/abc_animation');
var tunebook = require('./src/api/abc_tunebook');

var abcjs = {};

abcjs.signature = "abcjs-test v5.1.2";

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tunebook).forEach(function (key) {
	abcjs[key] = tunebook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');
abcjs.renderMidi = require('./src/api/abc_tunebook_midi');

var parser = require('./src/parse/abc_parse');
abcjs['parse'] = { Parse: parser };

var engraverController = require('./src/write/abc_engraver_controller');
abcjs['write'] = { EngraverController: engraverController };

var editor = require('./src/edit/abc_editor');
abcjs['Editor'] = editor;

var midi = require('./src/midi/abc_midi_controls');
var sequence = require('./src/midi/abc_midi_sequencer');
var flatten = require('./src/midi/abc_midi_flattener');
var midiCreate = require('./src/midi/abc_midi_create');
var midiUiGenerator = require('./src/midi/abc_midi_ui_generator');
abcjs['midi'] = midi;
abcjs['midi'].sequence = sequence;
abcjs['midi'].flatten = flatten;
abcjs['midi'].create = midiCreate;
abcjs['midi'].midiUiGenerator = midiUiGenerator;

var parserLint = require('./src/test/abc_parser_lint');
var verticalLint = require('./src/test/abc_vertical_lint');
var midiLint = require('./src/test/abc_midi_lint');
var midiSequencerLint = require('./src/test/abc_midi_sequencer_lint');
abcjs['test'] = { ParserLint: parserLint, verticalLint: verticalLint, midiLint: midiLint, midiSequencerLint: midiSequencerLint };

module.exports = abcjs;
