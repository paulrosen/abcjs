export const setupString = (isNode) => {
	if (isNode)
		return 'import abcjs from "abcjs"';
	else
		return '<script src="abcjs-basic.js" type="text/javascript"></script>';
};

export const paperString = (showMusic) => {
	return showMusic ? '<div id="paper"></div>' : '';
};

export const editorString = (showEditor) => {
	return showEditor ? '<textarea id="abc" cols="80" rows="12" spellcheck="false">X: 1\n' +
	'T: Cooley\'s\n' +
	'M: 4/4\n' +
	'L: 1/8\n' +
	'R: reel\n' +
	'K: Emin\n' +
	'|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|\n' +
	'EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|\n' +
	'|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|\n' +
	'eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|\n' +
	'</textarea>\n' +
	'\n' +
	'<div id="warnings">No errors</div>' : '';
};

export const audioString = (showAudio, isLarge) => {
	let audio = '';
	if (showAudio) {
		if (isLarge) {
			audio = `<div id="audio" class="abcjs-large"></div>`;
		}
		else audio = '<div id="audio"></div>';
		audio += `<button class="activate-audio">Activate Audio</button>`
	}
	return audio;
};

export const midiString = (showMidi) => {
	return showMidi ? '<div id="midi-download"></div>' : '';
};

export const clickListenerHtmlString = (clickListener) => {
	return clickListener ? '<div class="clicked-info"><div class="instructions">Click on a note to see information about that note.</div></div>' : '';
};

export const dragExplanationHtmlString = (allowDragging) => {
	return allowDragging ? '<p>Drag a note up and down and watch the source code change to match it.</p>' : '';
};

export const dragHtmlString = (allowDragging) => {
	return allowDragging ? '<h2>Source</h2>\n' +
		'<div id="source"></div>' : '';
};

export const startTimerHtmlString = (hasTimer) => {
	if (!hasTimer)
		return '';
	return '<button class="start">Start</button>';
};

export const preambleString = (title) => {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${title}</title>
`
};

export const preamble2String = (hasEditor) => {
	const abcString = hasEditor ? '' : `var abcString = "T: Cooley's\\n" +
"M: 4/4\\n" +
"L: 1/8\\n" +
"R: reel\\n" +
"K: Emin\\n" +
"|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|\\n" +
"EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|\\n" +
"|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|\\n" +
"eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|";`;

	return `<script src="abcjs-basic.js" type="text/javascript"></script>
<script type="text/javascript">
${abcString}

function load() {
`
};

export const middleString = (title) => `}\n</script>
</head>
<body onload="load()">
<header>
<h1>${title}</h1>
</header>
<div class="container">
`;

export const postAmbleString = () => `</div>
</body>
</html>
`;

