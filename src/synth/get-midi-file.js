var tunebook = require('../api/abc_tunebook');
var midi = require('../midi/abc_midi_controls');
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
			case "link":
				return midi.generateMidiDownloadLink(tune, params, downloadMidi, index);
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
		}
		return downloadMidi;
	}

	return tunebook.renderEngine(callback, "*", abcString, params);
};


module.exports = getMidiFile;
