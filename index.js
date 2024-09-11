/**!
Copyright (c) 2009-2024 Paul Rosen and Gregory Dyke

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 **This text is from: http://opensource.org/licenses/MIT**
!**/
var version = require('./version');
var animation = require('./src/api/abc_animation');
var tuneBook = require('./src/api/abc_tunebook');
var sequence = require('./src/synth/abc_midi_sequencer');
var strTranspose = require('./src/str/output');

var abcjs = {};

abcjs.signature = "abcjs-basic v" + version;

Object.keys(animation).forEach(function (key) {
	abcjs[key] = animation[key];
});

Object.keys(tuneBook).forEach(function (key) {
	abcjs[key] = tuneBook[key];
});

abcjs.renderAbc = require('./src/api/abc_tunebook_svg');
abcjs.tuneMetrics = require('./src/api/tune-metrics');
abcjs.TimingCallbacks = require('./src/api/abc_timing_callbacks');

var glyphs = require('./src/write/creation/glyphs');
abcjs.setGlyph = glyphs.setSymbol;
abcjs.strTranspose = strTranspose;

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
var getMidiFile = require('./src/synth/get-midi-file');
var midiRenderer = require('./src/synth/abc_midi_renderer');

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
	sequence: sequence,
	midiRenderer: midiRenderer,
};

abcjs['Editor'] = require('./src/edit/abc_editor');
abcjs['EditArea'] = require('./src/edit/abc_editarea');

module.exports = abcjs;
