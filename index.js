import version from './version'
import animation from './src/api/abc_animation'
import tuneBook from './src/api/abc_tunebook'
import renderAbc from './src/api/abc_tunebook_svg'
import TimingCallbacks from './src/api/abc_timing_callbacks'
import Editor from './src/edit/abc_editor'
import EditArea from './src/edit/abc_editarea'
import glyphs from './src/write/abc_glyphs'
import CreateSynth from './src/synth/create-synth'
import instrumentIndexToName from './src/synth/instrument-index-to-name'
import pitchToNoteName from './src/synth/pitch-to-note-name'
import SynthSequence from './src/synth/synth-sequence'
import CreateSynthControl from './src/synth/create-synth-control'
import registerAudioContext from './src/synth/register-audio-context'
import activeAudioContext from './src/synth/active-audio-context'
import supportsAudio from './src/synth/supports-audio'
import playEvent from './src/synth/play-event'
import SynthController from './src/synth/synth-controller'
import getMidiFile from './src/synth/get-midi-file'

const abcjs = {
	signature: "abcjs-basic v" + version,
	Editor: Editor,
	EditArea: EditArea,
	setGlyph: glyphs.setSymbol,
	renderAbc: renderAbc,
	TimingCallbacks: TimingCallbacks,
	synth: {
		CreateSynth: CreateSynth,
		instrumentIndexToName: instrumentIndexToName,
		pitchToNoteName: pitchToNoteName,
		SynthController: SynthController,
		SynthSequence: SynthSequence,
		CreateSynthControl: CreateSynthControl,
		registerAudioContext: registerAudioContext,
		activeAudioContext: activeAudioContext,
		supportsAudio: supportsAudio,
		playEvent: playEvent,
		getMidiFile: getMidiFile,
	}
};

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tuneBook).forEach(function (key) {
	abcjs[key] = tuneBook[key];
});

export default abcjs
