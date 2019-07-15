// Load one mp3 file for one note.
// url = the base url for the soundfont
// instrument = the instrument name (e.g. "acoustic_grand_piano")
// name = the pitch name (e.g. "A3")
var soundsCache = require('./sounds-cache');

var getNote = function(url, instrument, name, audioContext) {
	return new Promise(function (resolve, reject) {
		if (!soundsCache[instrument])
			soundsCache[instrument] = {};
		var instrumentCache = soundsCache[instrument];

		if (instrumentCache[name] === 'error') {
			return reject(new Error("Unable to load sound font" + ' ' + url + ' ' + instrument + ' ' + name));
		}
		if (instrumentCache[name]) {
			return resolve({instrument: instrument, name: name});
		}

		// if (this.debugCallback)
		// 	this.debugCallback(`Loading sound: ${instrument} ${name}`);
		instrumentCache[name] = "pending"; // This can be called in parallel, so don't call it a second time before the first one has loaded.
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url+instrument+'-mp3/'+name+'.mp3', true);
		xhr.responseType = 'arraybuffer';

		var self = this;
		function onSuccess(audioBuffer) {
			instrumentCache[name] = audioBuffer;
			// if (self.debugCallback)
			// 	self.debugCallback(`Sound loaded: ${instrument} ${name} ${url}`);
			resolve({instrument: instrument, name: name});
		}

		function onFailure(error) {
			if (self.debugCallback)
				self.debugCallback(error);
			console.log(error);
			reject(error);
		}

		xhr.onload = function (e) {
			if (this.status === 200) {
				audioContext.decodeAudioData(this.response, onSuccess, onFailure);//.then(function() {
				// 	return resolve({instrument: instrument, name: name});
				// }).catch(function(error) {
				// 	return reject(new Error(cantLoadMp3 + error));
				// });
			} else {
				instrumentCache[name] = "error"; // To keep this from trying to load repeatedly.
				var cantLoadMp3 = "Onload error loading sound: " +  name + " " + url + " " + e.currentTarget.status + " " + e.currentTarget.statusText;
				if (self.debugCallback)
					self.debugCallback(cantLoadMp3);
				return reject(new Error(cantLoadMp3));
			}
		};
		xhr.addEventListener("error", function () {
			instrumentCache[name] = "error"; // To keep this from trying to load repeatedly.
			var cantLoadMp3 = "Error in loading sound: " + " " + url;
			if (self.debugCallback)
				self.debugCallback(cantLoadMp3);
			return reject(new Error(cantLoadMp3));
		}, false);
		xhr.send();
	});
};

module.exports = getNote;
