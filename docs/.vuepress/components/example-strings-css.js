
export const cssString = (hasAudio, hasCursor, hideMeasures, allowDragging, usingCallbacks) => {
	let css = [];
	if (hasAudio)
		css.push(`<link rel="stylesheet" type="text/css" href="abcjs-audio.css">`);
	if (hasCursor)
		css.push(`<style>
.abcjs-highlight {
fill: #0a9ecc;
}
.abcjs-cursor {
stroke: red;
}
</style>
`);
	if (hideMeasures) {
		css.push(`<style>
.hide-note {
opacity: 0;
transition: opacity .5s ease;
}
</style>
`)
	}
	if (allowDragging) {
		css.push(`<style>
#source {
font-size: 18px;
max-width: 700px;
overflow: auto;
font-family: "Lucida Console", Monaco, monospace;
white-space: nowrap;
}
.select {
background-color: #FCF9BB;
box-shadow: 0 0 1px black;
}
</style>
`)
	}
	if (usingCallbacks) {
		css.push(`<style>
.clicked-info {
height: 200px;
}
.instructions {
color: red;
font-size: 2em;
font-style: italic;
}
</style>
`)
}
	return css.join("\n");
};
