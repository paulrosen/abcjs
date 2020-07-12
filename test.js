var abcjs = require('./index');
var version = require('./version');

abcjs.signature = "abcjs-test v" + version;

abcjs.renderMidi = require('./src/api/abc_tunebook_midi');

var parser = require('./src/parse/abc_parse');
abcjs['parse'] = { Parse: parser };

var engraverController = require('./src/write/abc_engraver_controller');
abcjs['write'] = { EngraverController: engraverController };

var midi = require('./src/midi/abc_midi_controls');
var sequence = require('./src/synth/abc_midi_sequencer');
var flatten = require('./src/synth/abc_midi_flattener');
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
var renderingLint = require('./src/test/rendering-lint');
abcjs['test'] = { ParserLint: parserLint, verticalLint: verticalLint, midiLint: midiLint, midiSequencerLint: midiSequencerLint, renderingLint: renderingLint };

module.exports = abcjs;
