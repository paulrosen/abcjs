require('./license')

module.exports = {
	signature: "abcjs-basic v" + require('./version'),
	renderAbc: require('./src/api/abc_tunebook_svg'),
	TimingCallbacks: require('./src/api/abc_timing_callbacks'),
	setGlyph: require('./src/write/abc_glyphs').setSymbol,
	synth: {
		CreateSynth: require('./src/synth/create-synth'),
		instrumentIndexToName: require('./src/synth/instrument-index-to-name'),
		pitchToNoteName: require('./src/synth/pitch-to-note-name'),
		SynthController: require('./src/synth/synth-controller'),
		SynthSequence: require('./src/synth/synth-sequence'),
		CreateSynthControl: require('./src/synth/create-synth-control'),
		registerAudioContext: require('./src/synth/register-audio-context'),
		activeAudioContext: require('./src/synth/active-audio-context'),
		supportsAudio: require('./src/synth/supports-audio'),
		playEvent: require('./src/synth/play-event'),
		getMidiFile: require('./src/synth/get-midi-file'),
		sequence: require('./src/synth/abc_midi_sequencer'),
	},
	Editor: require('./src/edit/abc_editor'),
	EditArea: require('./src/edit/abc_editarea'),
	...require('./src/api/abc_animation'),
	...require('./src/api/abc_tunebook'),
};
