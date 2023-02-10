export const waitForAbcjs = async function() {
	while (!window.ABCJS) {
		await sleep(100)
	}
	window.abcjs = ABCJS
}

export const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};
