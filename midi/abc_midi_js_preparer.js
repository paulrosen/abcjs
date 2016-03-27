//    abc_midi_js_preparer.js: Create the structure that MIDI.js expects.
//    Copyright (C) 2010,2016 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.midi)
	window.ABCJS.midi = {};

(function() {
	"use strict";

	window.ABCJS.midi.Preparer = function() {
		this.tempo = 0;
		this.timeFactor = 0;
		this.output = [];
		this.currentChannel = 0;
		this.currentInstrument = 0;
		this.track = 0;
		this.nextDuration = 0;
		this.tracks = [ [] ];
	};

	var Preparer = window.ABCJS.midi.Preparer;

	Preparer.prototype.setInstrument = function(instrument) {
		// TODO-PER: for the first version, there are no channel or instrument changes.
		//this.currentInstrument = instrument;

		var ev = [
			{
				ticksToEvent: 0,
				track: this.track,
				event: {
					channel: this.currentChannel,
					deltaTime: 0,
					programNumber: this.currentInstrument,
					subtype: 'programChange',
					type: 'channel'
				}
			},
			this.nextDuration * this.timeFactor
		];
		this.tracks[this.track].push(ev);
	};

	Preparer.prototype.setChannel = function(channel) {
		// TODO-PER: for the first version, there are no channel or instrument changes.
		//this.currentChannel = channel;
	};

	Preparer.prototype.startTrack = function() {
		this.track++;
		this.tracks[this.track] = [];
		this.nextDuration = 0;
	};

	Preparer.prototype.setGlobalInfo = function(tempo, title) {
		this.tempo = tempo;
		var mspb = Math.round((1.0/tempo)*60000000);
		this.timeFactor = mspb / 480000;
		var ev = [
			{
				ticksToEvent: 0,
				track: this.track,
				event: {
					deltaTime: 0,
					microsecondsPerBeat: mspb,
					subtype: 'setTempo',
					type: 'meta'
				}
			},
			this.nextDuration * this.timeFactor
		];
//		this.tracks[this.track].push(ev);

		ev = [
			{
				ticksToEvent: 0,
				track: this.track,
				event: {
					deltaTime: 0,
					subtype: 'trackName',
					text: title,
					type: 'meta'
				}
			},
			this.nextDuration * this.timeFactor
		];
//		this.tracks[this.track].push(ev);

		ev = [
			{
				ticksToEvent: 0,
				track: this.track,
				event: {
					deltaTime: 0,
					subtype: 'endOfTrack',
					type: 'meta'
				}
			},
			this.nextDuration * this.timeFactor
		];
//		this.tracks[this.track].push(ev);
	};

	Preparer.prototype.startNote = function(pitch, volume) {
		var deltaTime = Math.floor(this.nextDuration / 5) * 5;
		var ev = [
			{
				ticksToEvent: deltaTime,
				track: this.track,
				event: {
					deltaTime: deltaTime,
					channel: this.currentChannel,
					type: "channel",
					noteNumber: pitch,
					velocity: volume,
					subtype: "noteOn"
				}
			},
			this.nextDuration * this.timeFactor
		];
		this.tracks[this.track].push(ev);
		this.nextDuration = 0;
	};

	Preparer.prototype.endNote = function(pitch) {
		var deltaTime = Math.floor(this.nextDuration / 5) * 5;
		var ev = [
			{
				ticksToEvent: deltaTime,
				track: this.track,
				event: {
					deltaTime: deltaTime,
					channel: this.currentChannel,
					type: "channel",
					noteNumber: pitch,
					velocity: 0,
					subtype: "noteOff"
				}
			},
			this.nextDuration * this.timeFactor
		];
		this.tracks[this.track].push(ev);
		this.nextDuration = 0;
	};

	Preparer.prototype.addRest = function(duration) {
		this.nextDuration += duration;
	};

	Preparer.prototype.endTrack = function() {
		var ev = [
			{
				ticksToEvent: 0,
				track: this.track,
				event: {
					deltaTime: 0,
					type: "meta",
					subtype: "endOfTrack"
				}
			},
			0
		];
//		this.tracks[this.track].push(ev);
	};

	function addAbsoluteTime(tracks) {
		for (var i = 0; i < tracks.length; i++) {
			var absTime = 0;
			for (var j = 0; j < tracks[i].length; j++) {
				absTime += tracks[i][j][1];
				tracks[i][j].absTime = absTime;
			}
		}
	}

	function combineTracks(tracks) {
		var output = [];
		for (var i = 0; i < tracks.length; i++) {
			for (var j = 0; j < tracks[i].length; j++) {
				output.push(tracks[i][j]);
			}
		}
		return output;
	}

	function sortTracks(output) {
		return output.sort(function(a,b) {
			if (a.absTime > b.absTime) return 1;
			return -1;
		});
	}

	function adjustTime(output) {
		var lastTime = 0;
		for (var i = 0; i < output.length; i++) {
			var thisTime = output[i].absTime;
			output[i][1] = thisTime - lastTime;
			lastTime = thisTime;
		}
	}

	function weaveTracks(tracks) {
		// Each track has a progression of delta times. To combine them, first assign an absolute time to each event,
		// then make one large track of all the tracks, sort it by absolute time, then adjust the amount of time each
		// event causes time to move. That is, the movement was figured out as the distance from the last note in the track,
		// but now we want the distance from the last note on ANY track.
		addAbsoluteTime(tracks);
		var output = combineTracks(tracks);
		output = sortTracks(output);
		adjustTime(output);
		return output;
	}

	Preparer.prototype.getData = function() {
		return weaveTracks(this.tracks);
	};
})();