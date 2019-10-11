var version = require('./version');
var animation = require('./src/api/abc_animation');
var tuneBook = require('./src/api/abc_tunebook');

var abcjs = {};

abcjs.signature = "abcjs-test v" + version;

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tuneBook).forEach(function (key) {
	abcjs[key] = tuneBook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');
abcjs.renderMidi = require('./src/api/abc_tunebook_midi');
abcjs.TimingCallbacks = require('./src/api/abc_timing_callbacks');

var CreateSynth = require('./src/synth/create-synth');
var instrumentIndexToName = require('./src/synth/instrument-index-to-name');
var pitchToNoteName = require('./src/synth/pitch-to-note-name');
var SynthSequence = require('./src/synth/synth-sequence');
var CreateSynthControl = require('./src/synth/create-synth-control');
var registerAudioContext = require('./src/synth/register-audio-context');
var activeAudioContext = require('./src/synth/active-audio-context');
var supportsAudio = require('./src/synth/supports-audio');
var playEvent = require('./src/synth/play-event');
var SynthController = require('./src/synth/synth-controller');

abcjs.synth = {
	CreateSynth: CreateSynth,
	instrumentIndexToName: instrumentIndexToName,
	pitchToNoteName: pitchToNoteName,
	SynthController: SynthController,
	SynthSequence: SynthSequence,
	CreateSynthControl: CreateSynthControl,
	registerAudioContext: registerAudioContext,
	activeAudioContext: activeAudioContext,
	supportsAudio: supportsAudio,
	playEvent: playEvent
};

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
