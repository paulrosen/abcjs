function supportsAudio() {
	if (!window.Promise)
		return false;

	return window.AudioContext ||
		window.webkitAudioContext ||
		navigator.mozAudioContext ||
		navigator.msAudioContext;
}

module.exports = supportsAudio;
