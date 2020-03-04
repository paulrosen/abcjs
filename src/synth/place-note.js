//    Copyright (C) 2019-2020 Paul Rosen (paul at paulrosen dot net)
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

var soundsCache = require('./sounds-cache');
var pitchToNoteName = require('./pitch-to-note-name');

var OfflineAC = window.OfflineAudioContext ||
	window.webkitOfflineAudioContext;

function placeNote(outputAudioBuffer, sampleRate, sound, startArray) {
	var len = sound.len * sound.tempoMultiplier;
	var offlineCtx = new OfflineAC(2,Math.floor((len+0.5)*sampleRate*2),sampleRate);
	var noteName = pitchToNoteName[sound.pitch+60];
	var noteBuffer = soundsCache[sound.instrument][noteName];
	if (noteBuffer === "error") { // If the note isn't available, just leave a blank spot
		console.log("Didn't load note: " + sound.instrument + " " + noteName);
		return;
	}

	// create audio buffer
	var source = offlineCtx.createBufferSource();
	source.buffer = noteBuffer;

	// add gain
	// volume can be between 1 to 127. This translation to gain is just trial and error.
	// The smaller the first number, the more dynamic range between the quietest to loudest.
	// The larger the second number, the louder it will be in general.
	var volume = (sound.volume / 96) * 3.0;
	source.gainNode = offlineCtx.createGain();

	// add pan if supported and present
	if (sound.pan && offlineCtx.createStereoPanner) {
		source.panNode = offlineCtx.createStereoPanner();
		source.panNode.pan.setValueAtTime(sound.pan, 0);
	}
	source.gainNode.gain.value = volume; // Math.min(2, Math.max(0, volume));
	source.gainNode.gain.linearRampToValueAtTime(source.gainNode.gain.value, len);
	source.gainNode.gain.linearRampToValueAtTime(0.0, len + 0.3);

	// connect all the nodes
	if (source.panNode) {
		source.panNode.connect(offlineCtx.destination);
		source.gainNode.connect(source.panNode);
	} else {
		source.gainNode.connect(offlineCtx.destination);
	}
	source.connect(source.gainNode);

	// Do the process of creating the sound and placing it in the buffer
	source.start(0);

	if (source.noteOff) {
		source.noteOff(len + 0.5);
	} else {
		source.stop(len + 0.5);
	}
	var fnResolve;
	offlineCtx.oncomplete = function(e) {
		if (e.renderedBuffer) { // If the system gets overloaded then this can start failing. Just drop the note if so.
			for (var i = 0; i < startArray.length; i++) {
				copyToChannel(outputAudioBuffer, e.renderedBuffer, Math.floor(startArray[i] * sound.tempoMultiplier * sampleRate));
			}
		}
		fnResolve();
	};
	offlineCtx.startRendering();
	return new Promise(function(resolve, reject) {
		fnResolve = resolve;
	});
}

var copyToChannel = function(toBuffer, fromBuffer, start) {
	for (var ch = 0; ch < 2; ch++) {
		var fromData = fromBuffer.getChannelData(ch);
		var toData = toBuffer.getChannelData(ch);

		// Mix the current note into the existing track
		for (var n = 0; n < fromData.length; n++) {
			toData[n + start] += fromData[n];
		}
	}
};

module.exports = placeNote;
