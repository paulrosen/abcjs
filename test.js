import abcjs from './index'
import version from './version'

abcjs.signature = "abcjs-test v" + version;

import renderMidi from './src/api/abc_tunebook_midi'
abcjs.renderMidi = renderMidi

import parser from './src/parse/abc_parse'
abcjs.parse = { Parse: parser };

import engraverController from './src/write/abc_engraver_controller'
abcjs.write = { EngraverController: engraverController };

import midi from './src/midi/abc_midi_controls'
import sequence from './src/synth/abc_midi_sequencer'
import flatten from './src/synth/abc_midi_flattener'
import midiCreate from './src/midi/abc_midi_create'
import midiUiGenerator from './src/midi/abc_midi_ui_generator'
abcjs.midi = midi;
abcjs.midi.sequence = sequence;
abcjs.midi.flatten = flatten;
abcjs.midi.create = midiCreate;
abcjs.midi.midiUiGenerator = midiUiGenerator;

import parserLint from './src/test/abc_parser_lint'
import verticalLint from './src/test/abc_vertical_lint'
import midiLint from './src/test/abc_midi_lint'
import midiSequencerLint from './src/test/abc_midi_sequencer_lint'
import renderingLint from './src/test/rendering-lint'
abcjs.test = {
	ParserLint: parserLint,
	verticalLint: verticalLint,
	midiLint: midiLint,
	midiSequencerLint: midiSequencerLint,
	renderingLint: renderingLint
};

export default abcjs;
