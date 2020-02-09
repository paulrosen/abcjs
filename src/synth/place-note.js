var soundsCache = require('./sounds-cache');
var pitchToNoteName = require('./pitch-to-note-name');

var OfflineAC = window.OfflineAudioContext ||
	window.webkitOfflineAudioContext;

function placeNote(outputAudioBuffer, note, tempoMultiplier, sampleRate, panDistance) {
	var start = note.start * tempoMultiplier;
	var len = (note.end - note.start) * tempoMultiplier;
	var offlineCtx = new OfflineAC(2,Math.floor((len+0.5)*sampleRate*2),sampleRate);
	var noteName = pitchToNoteName[note.pitch+60];
	var noteBuffer = soundsCache[note.instrument][noteName];
	if (noteBuffer === "error") { // If the note isn't available, just leave a blank spot
		console.log("Didn't load note: " + note.instrument + " " + noteName);
		return;
	}

	// create audio buffer
	var source = offlineCtx.createBufferSource();
	source.buffer = noteBuffer;

	// add gain
	var volume = (note.volume / 127) * 2.0;
	source.gainNode = offlineCtx.createGain();

	// add pan if supported and present
	if (panDistance && offlineCtx.createStereoPanner) {
		source.panNode = offlineCtx.createStereoPanner();
		source.panNode.pan.setValueAtTime(panDistance, 0);
	}
	source.gainNode.gain.value = Math.min(1.0, Math.max(-1.0, volume));
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
		copyToChannel(outputAudioBuffer, e.renderedBuffer, Math.floor(start*sampleRate));
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
			toData[n + start] = toData[n + start] * 0.5 + fromData[n] * 0.5;
		}
	}
};

module.exports = placeNote;
