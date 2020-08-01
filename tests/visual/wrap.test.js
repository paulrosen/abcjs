describe("Automatic line wrapping", () => {
	var abcSingleLine = `X:1
L:1/4
M:4/4
K:Bb
B,4|C2D2|E3F|GABc|d/e/f/g/ !marcato!D/ E/ F/ G/|B,4|C2D2|E3F|GABc|d/e/f/g/ D/ E/ F/ G/|
`;

	var expectedSingleLine = "";

	it("wrap-single-line", () => {
		doWrapTest(abcSingleLine, expectedSingleLine);
	})
})

//////////////////////////////////////////////////////////

function doWrapTest(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc, {
		staffwidth: 400,
		wrap: {
			minSpacing: 1.8,
			maxSpacing: 2.8,
			preferredMeasuresPerLine: 4
		}
	});
	console.log(visualObj[0])
	var msg = "\nrcv: " + 1 + "\n" +
		"exp: " + 2 + "\n";
	chai.assert.deepStrictEqual(1,2, msg)
}
