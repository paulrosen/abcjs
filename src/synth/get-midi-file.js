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

var tunebook = require('../api/abc_tunebook');
var midiCreate = require('../midi/abc_midi_create');

var getMidiFile = function(abcString, options) {
	var params = {};
	if (options) {
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				params[key] = options[key];
			}
		}
	}
	params.generateInline = false;

	function callback(div, tune, index, abcString) {
		var downloadMidi = midiCreate(tune, params);
		switch (params.midiOutputType) {
			case "encoded":
				return downloadMidi;
			case "binary":
				var decoded = downloadMidi.replace("data:audio/midi,", "");
				decoded = decoded.replace(/MThd/g,"%4d%54%68%64");
				decoded = decoded.replace(/MTrk/g,"%4d%54%72%6b");
				var buffer = new ArrayBuffer(decoded.length/3);
				var output = new Uint8Array(buffer);
				for (var i = 0; i < decoded.length/3; i++) {
					var p = i*3+1;
					var d = parseInt(decoded.substring(p, p+2), 16);
					output[i] = d;
				}
				return output;
			case "link":
			default:
				return generateMidiDownloadLink(tune, params, downloadMidi, index);
		}
		return downloadMidi;
	}

	return tunebook.renderEngine(callback, "*", abcString, params);
};

var generateMidiDownloadLink = function(tune, midiParams, midi, index) {
	var divClasses = ['abcjs-download-midi', 'abcjs-midi-' + index]
	if (midiParams.downloadClass)
		divClasses.push(midiParams.downloadClass)
	var html = '<div class="' + divClasses.join(' ') + '">';
	if (midiParams.preTextDownload)
		html += midiParams.preTextDownload;
	var title = tune.metaText && tune.metaText.title ? tune.metaText.title : 'Untitled';
	var label;
	if (midiParams.downloadLabel && isFunction(midiParams.downloadLabel))
		label = midiParams.downloadLabel(tune, index);
	else if (midiParams.downloadLabel)
		label = midiParams.downloadLabel.replace(/%T/, title);
	else
		label = "Download MIDI for \"" + title + "\"";
	title = title.toLowerCase().replace(/'/g, '').replace(/\W/g, '_').replace(/__/g, '_');
	html += '<a download="' + title + '.midi" href="' + midi + '">' + label + '</a>';
	if (midiParams.postTextDownload)
		html += midiParams.postTextDownload;
	return html + "</div>";
};


module.exports = getMidiFile;
