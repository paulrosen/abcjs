function onEvent(type : string, data : any) : any {
	var editorCreate : (params: any) => any = require("./editor-create");
	var updateSynth : (params: any) => any = require("./update-synth");
	var registerSynth : (params: any) => any = require("./register-synth");

	switch (type) {
		case "register":
			registerSynth(data)
			break;
		case "editor-create":
			editorCreate(data.params)
			break;
		case "redraw":
			updateSynth(data)
			break;
	}
	return data
}

module.exports = onEvent
