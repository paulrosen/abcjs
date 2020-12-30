
export const cssString = (hasAudio, hasCursor, hideMeasures) => {
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
	return css.join("\n");
};
