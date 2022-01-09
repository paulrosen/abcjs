var editorCreate : (params: any) => any = require("./src-synth/editor-create");

function onEvent(type : string, data : any) : any {
	switch (type) {
		case "editor-create":
			return editorCreate(data.params)
	}
	return data
}

module.exports = onEvent
