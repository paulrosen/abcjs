function supportsAudio() {
	return window.AudioContext ||
		window.webkitAudioContext ||
		navigator.mozAudioContext ||
		navigator.msAudioContext;
}

module.exports = supportsAudio;
