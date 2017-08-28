var animation = require('./api/abc_animation');
var tunebook = require('./api/abc_tunebook');

var abcjs = {};

Object.keys(animation).forEach(function (key) {
  abcjs[key] = animation[key];
});

Object.keys(tunebook).forEach(function (key) {
  abcjs[key] = tunebook[key];
});

abcjs.renderAbc = require('./api/abc_tunebook_svg');
abcjs.renderMidi = require('./api/abc_tunebook_midi');

var parser = require('./parse/abc_parse');
abcjs['parse'] = { Parse: parser };

var engraverController = require('./write/abc_engraver_controller');
abcjs['write'] = { EngraverController: engraverController };

// TODO-PER: Temporary
var editor = require('./edit/abc_editor');
abcjs['Editor'] = editor;

// TODO-PER: Temporary
var midi = require('./midi/abc_midi_controls');
var sequence = require('./midi/abc_midi_sequencer');
var flatten = require('./midi/abc_midi_flattener');
var midiCreate = require('./midi/abc_midi_create');
abcjs['midi'] = midi;
abcjs['midi'].sequence = sequence;
abcjs['midi'].flatten = flatten;
abcjs['midi'].create = midiCreate;

// TODO-PER: Temporary
var parserLint = require('./test/abc_parser_lint');
var verticalLint = require('./test/abc_vertical_lint');
var midiLint = require('./test/abc_midi_lint');
var midiSequencerLint = require('./test/abc_midi_sequencer_lint');
abcjs['test'] = { ParserLint: parserLint, verticalLint: verticalLint, midiLint: midiLint, midiSequencerLint: midiSequencerLint };

module.exports = abcjs;
