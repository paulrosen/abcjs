import {AbcVisualParams, AudioTracks, SynthOptions, TuneObjectArray} from "abcjs";

var updateSynth = function(data: { visualObj: TuneObjectArray, options: AbcVisualParams}) : any {
	var SynthController = require('../src-synth/synth/synth-controller')
	var synthObject = require('../src-synth/synth-object')

	var supportsAudio = require('./synth/supports-audio')
	const self = synthObject()
	if (self) {
		var userAction = self.synthControl; // Can't really tell if there was a user action before drawing, but we assume that if the synthControl was created already there was a user action.
		if (!self.synthControl) {
			self.synthControl = new SynthController();
			self.synthControl.load(self.el, self.cursorControl, self.options.options);
		}
		self.synthControl.setTune(data.visualObj[0], userAction, self.options.options);
	}
	data.visualObj[0].setUpAudio = setUpAudio;

	console.log("updateSynth", data)
	return data
}

function setUpAudio(options: SynthOptions) : AudioTracks {
	var sequence = require('../src-synth/synth/abc_midi_sequencer')
	var flatten = require('../src-synth/synth/abc_midi_flattener')
	if (!options) options = {};
	var seq = sequence(this, options);
	return flatten(seq, options, this.formatting.percmap);
}


module .exports = updateSynth
