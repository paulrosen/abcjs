// Call this when it is safe for the abcjs to produce sound. This is after the first user gesture on the page.
// If you call it with no parameters, then an AudioContext is created and stored.
// If you call it with a parameter, that is used as an already created AudioContext.

function registerAudioContext(ac) {
	// If one is passed in, that is the one to use even if there was already one created.
	if (ac)
		window.abcjsAudioContext = ac;
	else {
		// no audio context passed in, so create it unless there is already one from before.
		if (!window.abcjsAudioContext) {
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			if (AudioContext)
				window.abcjsAudioContext = new AudioContext();
			else
				return false;
		}
	}
	return window.abcjsAudioContext.state !== "suspended";
}

module.exports = registerAudioContext;
