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

var activeAudioContext = require('./active-audio-context');

//
// Support for audio depends on three things: support for Promise, support for AudioContext, and support for AudioContext.resume.
// Unfortunately, AudioContext.resume cannot be detected unless an AudioContext is created, and creating an AudioContext can't
// be done until a user click, so there is no way to know for sure if audio is supported until the user tries.
// We can get close, though - we can test for Promises and AudioContext - there are just a few evergreen browsers that supported
// that before supporting resume, so we'll test what we can.

// The best use of this routine is to call it before doing any audio related stuff to decide whether to bother.
// But then, call it again after a user interaction to test for resume.

function supportsAudio() {
	var aac = activeAudioContext();
	if (aac)
		return aac.resume !== undefined;

	if (!window.Promise)
		return false;

	return window.AudioContext ||
		window.webkitAudioContext ||
		navigator.mozAudioContext ||
		navigator.msAudioContext;
}

module.exports = supportsAudio;
