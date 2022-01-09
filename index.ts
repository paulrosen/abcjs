/**!
Copyright (c) 2009-2022 Paul Rosen and Gregory Dyke

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

module.exports = {
	signature: "abcjs-basic v" + require('./version'),
	renderAbc: require('./src/api/abc_tunebook_svg'),
	TimingCallbacks: require('./src/api/abc_timing_callbacks'),
	setGlyph: require('./src/write/abc_glyphs').setSymbol,
	registerPlugin: require("./src/api/plugins").registerPlugin,
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
