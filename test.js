var abcjs = require('./index');
var version = require('./version');
var Parse = require('./src/parse/abc_parse');
var EngraverController = require('./src/write/abc_engraver_controller')

abcjs.signature = "abcjs-test v" + version;

var parserLint = require('./src/test/abc_parser_lint');
var verticalLint = require('./src/test/abc_vertical_lint');
var midiLint = require('./src/test/abc_midi_lint');
var midiSequencerLint = require('./src/test/abc_midi_sequencer_lint');
var renderingLint = require('./src/test/rendering-lint');
abcjs['test'] = { Parse: Parse, EngraverController: EngraverController, ParserLint: parserLint, verticalLint: verticalLint, midiLint: midiLint, midiSequencerLint: midiSequencerLint, renderingLint: renderingLint };

module.exports = abcjs;
