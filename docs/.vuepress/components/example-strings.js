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
	}
	return audio;
};

export const midiString = (showMidi) => {
	return showMidi ? '<div id="midi-download"></div>' : '';
};

export const preampleString = (hasEditor, title) => {
	const abcString = hasEditor ? '' : `var abcString = "T: Cooley's\\n" +
"M: 4/4\\n" +
"L: 1/8\\n" +
"R: reel\\n" +
"K: Emin\\n" +
"|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|\\n" +
"EBBA B2 EB|B2 AB defg|afe^c dBAF|DEFD E2:|\\n" +
"|:gf|eB B2 efge|eB B2 gedB|A2 FA DAFA|A2 FA defg|\\n" +
"eB B2 eBgB|eB B2 defg|afe^c dBAF|DEFD E2:|";`;

	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>${title}</title>
<script src="abcjs-basic.js" type="text/javascript"></script>
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

