var registerAudioContext = require('./register-audio-context.js');

function activeAudioContext() {
	if (!window.abcjsAudioContext)
		registerAudioContext();
	return window.abcjsAudioContext;
}

module.exports = activeAudioContext;
