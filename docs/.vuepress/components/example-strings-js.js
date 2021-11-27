export function entryPoint(usingNode) {
	return usingNode ? 'abcjs' : 'ABCJS';
}

function target(sheetMusic) {
	return sheetMusic ? 'paper' : '*';
}

export const renderAbcString = (usingNode, hasRender, showMusic, visualOptions) => {
	if (!hasRender)
		return '';

	return `var visualOptions = ${visualOptions};
var visualObj = ${entryPoint(usingNode)}.renderAbc("${target(showMusic)}", abcString, visualOptions);`
};

export const editorJsString = (usingNode, hasEditor, showMusic) => {
	if (!hasEditor)
		return '';

	return `var options = {};
var editor = new ${entryPoint(usingNode)}.Editor("abc", {
  canvas_id: "${target(showMusic)}",
  warnings_id: "warnings",
  abcjsParams: options
});`
};

export const visualOptionsString = (responsive, callbacks, metronome, hideMeasures, jazzChords) => {
	let options = [];
	if (responsive)
		options.push("responsive: 'resize'");
	if (callbacks) {
		options.push("clickListener: clickListener");
	}
	if (callbacks || hideMeasures) {
		options.push("add_classes: true");
	}
	if (jazzChords) {
		options.push("jazzchords: true");
	}
	if (metronome)
		options.push("drum: 'dddd 76 77 77 77 60 30 30 30'");
	return "{ " + options.join(", ") + " }";
};

export const clickListenerJsString = (callbacks) => {
	if (!callbacks)
		return '';
	return `function clickListener(abcelem, tuneNumber, classes, analysis, drag, mouseEvent) {
var output = "abcelem: [Object]<br>tuneNumber: " + tuneNumber + "<br>classes: " + classes + "<br>analysis: " + JSON.stringify(analysis) + "<br>drag: " + JSON.stringify(drag) + "<br>mouseEvent: { clientX: " + mouseEvent.clientX + ", clientY: " + mouseEvent.clientY + " }";
document.querySelector(".clicked-info").innerHTML = "<div class='label'>Clicked info:</div>" + output;
}
`;
};


///////////////////////////

const replaceFunctionPlaceholders = (stringifiedObject) => {
	return stringifiedObject
		.replace("\"__FUNCTION_PLACEHOLDER_CLICK_LISTENER__\"", CLICK_LISTENER_FUNCTION);
}

const animationCode = (sandbox, animationOptions) => {
	if (sandbox.cursor || sandbox.hideMeasures) {
		if (sandbox.cursor) {
			animationOptions.showCursor = true;
		}
		if (sandbox.hideMeasures) {
			animationOptions.hideFinishedMeasures = true;
		}
		// TODO: startAnimation() is deprecated.
		return `
ABCJS.startAnimation(paper, abc_editor.tunes[0], ${JSON.stringify(animationOptions)});`
	}

	return '';
}
