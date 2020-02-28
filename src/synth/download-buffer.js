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

var downloadBuffer = function(buffer) {
	return window.URL.createObjectURL(bufferToWave(buffer.audioBuffers));
};

// Convert an AudioBuffer to a Blob using WAVE representation
function bufferToWave(audioBuffers) {
	var numOfChan = audioBuffers.length;
	var length = audioBuffers[0].length * numOfChan * 2 + 44;
	var buffer = new ArrayBuffer(length);
	var view = new DataView(buffer);
	var channels = [];
	var i;
	var sample;
	var offset = 0;
	var pos = 0;

	// write WAVE header
	setUint32(0x46464952);                         // "RIFF"
	setUint32(length - 8);                         // file length - 8
	setUint32(0x45564157);                         // "WAVE"

	setUint32(0x20746d66);                         // "fmt " chunk
	setUint32(16);                                 // length = 16
	setUint16(1);                                  // PCM (uncompressed)
	setUint16(numOfChan);
	setUint32(audioBuffers[0].sampleRate);
	setUint32(audioBuffers[0].sampleRate * 2 * numOfChan); // avg. bytes/sec
	setUint16(numOfChan * 2);                      // block-align
	setUint16(16);                                 // 16-bit (hardcoded in this demo)

	setUint32(0x61746164);                         // "data" - chunk
	setUint32(length - pos - 4);                   // chunk length

	// write interleaved data
	for(i = 0; i < audioBuffers.length; i++)
		channels.push(audioBuffers[i].getChannelData(0));

	while(pos < length) {
		for(i = 0; i < channels.length; i++) {             // interleave channels
			sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
			sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
			view.setInt16(pos, sample, true);          // write 16-bit sample
			pos += 2;
		}
		offset++; // next source sample
	}

	// create Blob
	return new Blob([buffer], {type: "audio/wav"});

	function setUint16(data) {
		view.setUint16(pos, data, true);
		pos += 2;
	}

	function setUint32(data) {
		view.setUint32(pos, data, true);
		pos += 4;
	}
}

module.exports = downloadBuffer;
