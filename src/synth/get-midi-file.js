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
		if (params.generateLink)
			return midi.generateMidiDownloadLink(tune, params, downloadMidi, index);
		return downloadMidi;
	}

	return tunebook.renderEngine(callback, "*", abcString, params);
};


module.exports = getMidiFile;
