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
import version from "./version";
import animation from "./src/api/abc_animation";
import tuneBook from "./src/api/abc_tunebook";
import sequence from "./src/synth/abc_midi_sequencer";
import strTranspose from "./src/str/output";

var abcjs: { [key: string]: any } = {};

abcjs.signature = "abcjs-basic v" + version;

Object.keys(animation).forEach(function (key) {
  abcjs[key] = animation[key];
});

Object.keys(tuneBook).forEach(function (key) {
  abcjs[key] = tuneBook[key];
});

import renderAbc from "./src/api/abc_tunebook_svg";
abcjs.renderAbc = renderAbc;
import TimingCallbacks from "./src/api/abc_timing_callbacks";
abcjs.TimingCallbacks = TimingCallbacks;

import Glyphs from "./src/write/abc_glyphs";
abcjs.setGlyph = Glyphs.setSymbol;
abcjs.strTranspose = strTranspose;

import CreateSynth from "./src/synth/create-synth";
import instrumentIndexToName from "./src/synth/instrument-index-to-name";
import pitchToNoteName from "./src/synth/pitch-to-note-name";
import SynthSequence from "./src/synth/synth-sequence";
import CreateSynthControl from "./src/synth/create-synth-control";
import registerAudioContext from "./src/synth/register-audio-context";
import activeAudioContext from "./src/synth/active-audio-context";
import supportsAudio from "./src/synth/supports-audio";
import playEvent from "./src/synth/play-event";
import SynthController from "./src/synth/synth-controller";
import getMidiFile from "./src/synth/get-midi-file";

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
};

import Editor from "./src/edit/abc_editor";
abcjs["Editor"] = Editor;
import EditArea from "./src/edit/abc_editarea";
abcjs["EditArea"] = EditArea;

export default abcjs;
