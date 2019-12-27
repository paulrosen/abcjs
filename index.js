var version = require('./version');
var animation = require('./src/api/abc_animation');
var tuneBook = require('./src/api/abc_tunebook');

var abcjs = {};

abcjs.signature = "abcjs-basic v" + version;

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tuneBook).forEach(function (key) {
	abcjs[key] = tuneBook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');
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

var editor = require('./src/edit/abc_editor');
abcjs['Editor'] = editor;

module.exports = abcjs;
