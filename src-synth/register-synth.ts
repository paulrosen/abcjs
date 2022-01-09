var registerSynth = function(abcjs: any) : any {
	abcjs.synth = {
		CreateSynth: require('./synth/create-synth'),
		instrumentIndexToName: require('./synth/instrument-index-to-name'),
		pitchToNoteName: require('./synth/pitch-to-note-name'),
		SynthController: require('./synth/synth-controller'),
		SynthSequence: require('./synth/synth-sequence'),
		CreateSynthControl: require('./synth/create-synth-control'),
		registerAudioContext: require('./synth/register-audio-context'),
		activeAudioContext: require('./synth/active-audio-context'),
		supportsAudio: require('./synth/supports-audio'),
		playEvent: require('./synth/play-event'),
		getMidiFile: require('./synth/get-midi-file'),
		sequence: require('./synth/abc_midi_sequencer'),
	}
	console.log("registerSynth", abcjs)
	var onEvent = require('./on-event')
	abcjs.registerPlugin(onEvent)

}

module.exports = registerSynth
