var tunebook = require('../api/abc_tunebook');
var midiCreate = require('../midi/abc_midi_create');

var getMidiFile = function(source, options) {
	var params = {};
	if (options) {
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				params[key] = options[key];
			}
		}
	}
	params.generateInline = false;

	function callback(div, tune, index) {
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
	}

	if (typeof source === "string")
		return tunebook.renderEngine(callback, "*", source, params);
	else
		return callback(null, source, 0);
};

function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

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
	var filename = (midiParams.fileName) ? midiParams.fileName :  title + '.midi';
	html += '<a download="' + filename + '" href="' + midi + '">' + label + '</a>';
	if (midiParams.postTextDownload)
		html += midiParams.postTextDownload;
	return html + "</div>";
};


module.exports = getMidiFile;
