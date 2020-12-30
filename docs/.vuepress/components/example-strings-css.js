
export const cssString = (hasAudio, hasCursor) => {
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
	return css.join("\n");
};
