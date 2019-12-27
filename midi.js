var version = require('./version');
var animation = require('./src/api/abc_animation');
var tunebook = require('./src/api/abc_tunebook');

var abcjs = {};

abcjs.signature = "abcjs-midi v" + version;

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tunebook).forEach(function (key) {
	abcjs[key] = tunebook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');
abcjs.renderMidi = require('./src/api/abc_tunebook_midi');
abcjs.TimingCallbacks = require('./src/api/abc_timing_callbacks');

var glyphs = require('./src/write/abc_glyphs');
abcjs.setGlyph = glyphs.setSymbol;

var CreateSynth = require('./src/synth/create-synth');
var instrumentIndexToName = require('./src/synth/instrument-index-to-name');
var pitchToNoteName = require('./src/synth/pitch-to-note-name');
var SynthSequence = require('./src/synth/synth-sequence');
var CreateSynthControl = require('./src/synth/create-synth-control');
var registerAudioContext = require('./src/synth/register-audio-context');
var activeAudioContext = require('./src/synth/active-audio-context');
var playEvent = require('./src/synth/play-event');
var SynthController = require('./src/synth/synth-controller');

abcjs.synth = {
	CreateSynth: CreateSynth,
	instrumentIndexToName: instrumentIndexToName,
	pitchToNoteName: pitchToNoteName,
	SynthController: SynthController,
	SynthSequence: SynthSequence,
	CreateSynthControl: CreateSynthControl,
	activeAudioContext: activeAudioContext,
	playEvent: playEvent
};

var editor = require('./src/edit/abc_editor');
abcjs['Editor'] = editor;
require("./src/midi/abc_midi_ui_generator");

var midi = require('./src/midi/abc_midi_controls');
abcjs.midi = {
	setSoundFont: midi.setSoundFont,
	startPlaying: midi.startPlaying,
	restartPlaying: midi.restartPlaying,
	stopPlaying: midi.stopPlaying,
	setLoop: midi.setLoop,
	deviceSupportsMidi: midi.deviceSupportsMidi,
	setRandomProgress: midi.setRandomProgress,
	setInteractiveProgressBar: midi.setInteractiveProgressBar
};

module.exports = abcjs;
