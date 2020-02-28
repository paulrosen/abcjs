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
			return resolve({instrument: instrument, name: name, status: "error", message: "Unable to load sound font" + ' ' + url + ' ' + instrument + ' ' + name });
		}
		if (instrumentCache[name] === 'pending') {
			return resolve({instrument: instrument, name: name, status: "pending"});
		}
		if (instrumentCache[name]) {
			return resolve({instrument: instrument, name: name, status: "cached"});
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
			resolve({instrument: instrument, name: name, status: "loaded"});
		}

		function onFailure(error) {
			error = "Can't decode sound. " + url + ' ' + instrument + ' ' + name + error;
			if (self.debugCallback)
				self.debugCallback(error);
			console.log(error);
			return resolve({instrument: instrument, name: name, status: "error", message: error });
		}

		xhr.onload = function (e) {
			if (this.status === 200) {
				audioContext.decodeAudioData(this.response, onSuccess, onFailure);
			} else {
				instrumentCache[name] = "error"; // To keep this from trying to load repeatedly.
				var cantLoadMp3 = "Onload error loading sound: " +  name + " " + url + " " + e.currentTarget.status + " " + e.currentTarget.statusText;
				if (self.debugCallback)
					self.debugCallback(cantLoadMp3);
				return resolve({instrument: instrument, name: name, status: "error", message: cantLoadMp3 });
			}
		};
		xhr.addEventListener("error", function () {
			instrumentCache[name] = "error"; // To keep this from trying to load repeatedly.
			var cantLoadMp3 = "Error in loading sound: " + " " + url;
			if (self.debugCallback)
				self.debugCallback(cantLoadMp3);
			return resolve({instrument: instrument, name: name, status: "error", message: cantLoadMp3 });
		}, false);
		xhr.send();
	});
};

module.exports = getNote;
