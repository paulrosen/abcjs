function abcjs(usingNode) {
	return usingNode ? 'abcjs' : 'ABCJS';
}

function target(sheetMusic) {
	return sheetMusic ? 'paper' : '*';
}

export const renderAbcString = (usingNode, hasRender, showMusic) => {
	if (!hasRender)
		return '';

	return `var visualOptions = {};
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
