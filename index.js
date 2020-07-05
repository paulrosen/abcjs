var version = require('./version');
var animation = require('./lib/api/abc_animation');
var tuneBook = require('./lib/api/abc_tunebook');

var abcjs = {};

abcjs.signature = "abcjs-basic v" + version;

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tuneBook).forEach(function (key) {
	abcjs[key] = tuneBook[key];
});

abcjs.renderAbc = require('./lib/api/abc_tunebook_svg');
abcjs.TimingCallbacks = require('./lib/api/abc_timing_callbacks');

var glyphs = require('./lib/write/abc_glyphs');
abcjs.setGlyph = glyphs.setSymbol;

var CreateSynth = require('./lib/synth/create-synth');
var instrumentIndexToName = require('./lib/synth/instrument-index-to-name');
var pitchToNoteName = require('./lib/synth/pitch-to-note-name');
var SynthSequence = require('./lib/synth/synth-sequence');
var CreateSynthControl = require('./lib/synth/create-synth-control');
var registerAudioContext = require('./lib/synth/register-audio-context');
var activeAudioContext = require('./lib/synth/active-audio-context');
var supportsAudio = require('./lib/synth/supports-audio');
var playEvent = require('./lib/synth/play-event');
var SynthController = require('./lib/synth/synth-controller');
var getMidiFile = require('./lib/synth/get-midi-file');

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
	playEvent: playEvent,
	getMidiFile: getMidiFile,
};

abcjs['Editor'] = require('./lib/edit/abc_editor');
abcjs['EditArea'] = require('./lib/edit/abc_editarea');

module.exports = abcjs;
