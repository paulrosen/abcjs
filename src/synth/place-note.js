var soundsCache = require('./sounds-cache');
var pitchToNoteName = require('./pitch-to-note-name');
var centsToFactor = require("./cents-to-factor");

function placeNote(outputAudioBuffer, sampleRate, sound, startArray, volumeMultiplier, ofsMs, fadeTimeSec, noteEndSec, debugCallback) {
	// sound contains { instrument, pitch, volume, len, pan, tempoMultiplier
	// len is in whole notes. Multiply by tempoMultiplier to get seconds.
	// ofsMs is an offset to subtract from the note to line up programs that have different length onsets.
	var OfflineAC = window.OfflineAudioContext ||
		window.webkitOfflineAudioContext;

	var len = sound.len * sound.tempoMultiplier;
	if (ofsMs)
		len +=ofsMs/1000;
	len -= noteEndSec;
	if (len < 0)
		len = 0.005; // Have some small audible length no matter how short the note is.
	var offlineCtx = new OfflineAC(2,Math.floor((len+fadeTimeSec)*sampleRate),sampleRate);
	var noteName = pitchToNoteName[sound.pitch];
	var noteBufferPromise = soundsCache[sound.instrument][noteName];

	if (!noteBufferPromise) {
		// if the note isn't present then just skip it - it will leave a blank spot in the audio.
		if (debugCallback)
			debugCallback('placeNote skipped: '+sound.instrument+':'+noteName)
		return Promise.resolve();
	}

	return noteBufferPromise
		.then(function (response) {
			// create audio buffer
			var source = offlineCtx.createBufferSource();
			source.buffer = response.audioBuffer;

			// add gain
			// volume can be between 1 to 127. This translation to gain is just trial and error.
			// The smaller the first number, the more dynamic range between the quietest to loudest.
			// The larger the second number, the louder it will be in general.
			var volume = (sound.volume / 96) * volumeMultiplier;
			source.gainNode = offlineCtx.createGain();

			// add pan if supported and present
			if (sound.pan && offlineCtx.createStereoPanner) {
				source.panNode = offlineCtx.createStereoPanner();
				source.panNode.pan.setValueAtTime(sound.pan, 0);
			}
			source.gainNode.gain.value = volume; // Math.min(2, Math.max(0, volume));
			source.gainNode.gain.linearRampToValueAtTime(source.gainNode.gain.value, len);
			source.gainNode.gain.linearRampToValueAtTime(0.0, len + fadeTimeSec);

			if (sound.cents) {
				source.playbackRate.value = centsToFactor(sound.cents);
			}

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
				source.noteOff(len + fadeTimeSec);
			} else {
				source.stop(len + fadeTimeSec);
			}
			var fnResolve;
			offlineCtx.oncomplete = function(e) {
				if (e.renderedBuffer && e.renderedBuffer.getChannelData) { // If the system gets overloaded or there are network problems then this can start failing. Just drop the note if so.
					for (var i = 0; i < startArray.length; i++) {
						//Math.floor(startArray[i] * sound.tempoMultiplier * sampleRate)
						var start = startArray[i] * sound.tempoMultiplier;
						if (ofsMs)
							start -=ofsMs/1000;
						if (start < 0)
							start = 0; // If the item that is moved back is at the very beginning of the buffer then don't move it back. To do that would be to push everything else forward. TODO-PER: this should probably be done at some point but then it would change timing in existing apps.
						start = Math.floor(start*sampleRate);
						copyToChannel(outputAudioBuffer, e.renderedBuffer, start);
					}
				}
				if (debugCallback)
					debugCallback('placeNote: '+sound.instrument+':'+noteName)
				fnResolve();
			};
			offlineCtx.startRendering();
			return new Promise(function(resolve) {
				fnResolve = resolve;
			});
		})
		.catch(function (error) {
			if (debugCallback)
				debugCallback('placeNote catch: '+error.message)
			return Promise.resolve()
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
