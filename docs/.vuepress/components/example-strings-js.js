function abcjs(usingNode) {
	return usingNode ? 'abcjs' : 'ABCJS';
}

function target(sheetMusic) {
	return sheetMusic ? 'paper' : '*';
}

export const renderAbcString = (usingNode, hasRender, showMusic, visualOptions) => {
	if (!hasRender)
		return '';

	return `var visualOptions = ${visualOptions};
var visualObj = ${abcjs(usingNode)}.renderAbc("${target(showMusic)}", abcString, visualOptions);`
};

export const editorJsString = (usingNode, hasEditor, showMusic) => {
	if (!hasEditor)
		return '';

	return `var options = {};
var editor = new ${abcjs(usingNode)}.Editor("abc", {
  canvas_id: "${target(showMusic)}",
  warnings_id: "warnings",
  abcjsParams: options
});`
};

export const visualOptionsString = (responsive, callbacks, metronome) => {
	let options = [];
	if (responsive)
		options.push("responsive: 'resize'");
	if (callbacks) {
		options.push("clickListener: clickListener");
		options.push("add_classes: true");
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

export const timingCallbacksString = (usingNode) => {
`var timingCallbacks = new ${abcjs(usingNode)}.TimingCallbacks(visualObj[0], {
beatCallback: cursorControl.onBeat,
eventCallback: cursorControl.onEvent
});
`
};

const CLICK_LISTENER_FUNCTION = ` function(abcelem, tuneNumber, classes, analysis, drag, mouseEvent) {  
  // modify the ABC string and rerender 
}`

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

const changesCode = (sandbox, visualOptions) => {
	// TODO: Change these radio-button options to checkboxes, as they are not mutually exclusive.
	switch (sandbox.changes) {
		case 'editor':
			return `
var abc_editor = new window.ABCJS.Editor("abc", {
  paper_id: "paper",
  warnings_id:"warnings",
  abcjsParams: {
    add_classes: true
  }
});`;
		case 'drag':
			visualOptions.dragging = true;
			visualOptions.clickListener = "__FUNCTION_PLACEHOLDER_CLICK_LISTENER__"
			return '';
		default:
			'';
	}
}
