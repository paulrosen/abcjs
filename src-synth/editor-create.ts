var editorCreate = function(options: any) : any {
	var supportsAudio = require('./synth/supports-audio')
	var synthObject = require('../src-synth/synth-object')

	if (options.synth) {
		if (supportsAudio()) {
			synthObject(options.synth)
		}
	}
	console.log("editorCreate", options)
	return options
}

module.exports = editorCreate
