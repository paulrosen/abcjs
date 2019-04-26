//    abc_midi_js_preparer.js: Create the structure that MIDI.js expects.
//    Copyright (C) 2010-2018 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var Preparer;

(function() {
	"use strict";

	Preparer = function() {
		this.tempo = 0;
		this.timeFactor = 0;
		this.output = [];
		this.currentChannel = 0;
		this.currentInstrument = 0;
		this.track = 0;
		this.nextDuration = 0;
		this.tracks = [ [] ];
	};

	Preparer.prototype.setInstrument = function(instrument) {
		this.currentInstrument = instrument;

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
		this.currentChannel = channel;
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
		// First sort by time. If the time is the same, sort by channel, if the channel is the same, put the programChange first.
		return output.sort(function(a,b) {
			if (a.absTime > b.absTime) return 1;
			if (a.absTime === b.absTime) {
				if (a.length > 0 && b.length > 0 && a[0].event && b[0].event) {		// I think that there will always be at least one event, but testing just in case.
					var aChannel = a[0].event.channel;
					var bChannel = b[0].event.channel;
					if (aChannel > bChannel)
						return 1;
					else if (aChannel < bChannel)
						return -1;
					else {
						var bIsPreferred = b[0].event.subtype === "programChange";
						if (bIsPreferred)
							return 1;
					}
				}
			}
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

module.exports = Preparer;
