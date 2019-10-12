// Call this when it is safe for the abcjs to produce sound. This is after the first user gesture on the page.
// If you call it with no parameters, then an AudioContext is created and stored.
// If you call it with a parameter, that is used as an already created AudioContext.

function registerAudioContext(ac) {
	if (!window.abcjsAudioContext) {
		if (!ac) {
			ac = window.AudioContext ||
				window.webkitAudioContext ||
				navigator.mozAudioContext ||
				navigator.msAudioContext;
			ac = new ac();
		}
		window.abcjsAudioContext = ac;
	}
	return window.abcjsAudioContext.state !== "suspended";
}

module.exports = registerAudioContext;
