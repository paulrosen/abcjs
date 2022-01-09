var supportsAudio = require('../src/synth/supports-audio')

var editorCreate = function(params: any) : any {
	if (params.synth) {
		if (supportsAudio()) {
			this.synth = {
				el: params.synth.el,
				cursorControl: params.synth.cursorControl,
				options: params.synth.options
			}
		}
	}
	console.log("editorCreate", params)
	return params
}

module .exports = editorCreate
