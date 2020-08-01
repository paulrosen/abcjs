describe("Automatic line wrapping", () => {
	var abcSingleLine = `X:1
L:1/4
M:4/4
K:Bb
B,4|C2D2|E3F|GABc|d/e/f/g/ !marcato!D/ E/ F/ G/|B,4|C2D2|E3F|GABc|d/e/f/g/ D/ E/ F/ G/|
`;

	var expectedSingleLine400 = {
		"lineBreakPoint": 180.805,
		"minLineSize": 116.23178571428572,
		"minWidth": 191,
		"measureWidths": [42.78, 38.74000000000002, 44.629999999999995, 59.24000000000001, 126.84799999999996, 31.985000000000014, 38.74000000000001, 44.629999999999995, 59.23999999999978, 126.84799999999996],
		"voiceSizes": [[[8]], [[5]], [[11]], [[11]], [[9]]]
	};

	var expectedSingleLine500 = {
		"lineBreakPoint": 236.36055555555555,
		"minLineSize": 151.94607142857143,
		"minWidth": 250,
		"measureWidths": [42.78, 38.74000000000002, 44.629999999999995, 59.24000000000001, 126.84799999999996, 31.985000000000014, 38.74000000000001, 44.629999999999995, 59.23999999999978, 126.84799999999996],
		"voiceSizes": [[[13]], [[9]], [[13]], [[9]]]
	};

	var expectedSingleLine600 = {
		"lineBreakPoint": 291.9161111111111,
		"minLineSize": 187.66035714285715,
		"minWidth": 309,
		"measureWidths": [42.78, 38.74000000000002, 44.629999999999995, 59.24000000000001, 126.84799999999996, 31.985000000000014, 38.74000000000001, 44.629999999999995, 59.23999999999978, 126.84799999999996],
		"voiceSizes": [[[13]], [[17]], [[14]]]
	};

	it("wrap-single-line", () => {
		doWrapTest(abcSingleLine, expectedSingleLine400, 400);
		doWrapTest(abcSingleLine, expectedSingleLine500, 500);
		doWrapTest(abcSingleLine, expectedSingleLine600, 600);
	})
})

//////////////////////////////////////////////////////////

function doWrapTest(abc, expected, width) {
	var visualObj = abcjs.renderAbc("paper", abc, {
		staffwidth: width,
		wrap: {
			minSpacing: 1.8,
			maxSpacing: 2.8,
			preferredMeasuresPerLine: 4
		}
	});
	var lines = [];
	for (var i = 0; i < visualObj[0].lines.length; i++) {
		var staves = visualObj[0].lines[i].staff;
		if (!staves)
			continue;
		var line = [];
		for (var j = 0; j < staves.length; j++) {
			var staff = [];
			for (var k = 0; k < staves[j].voices.length; k++) {
				staff.push(staves[j].voices[k].length);
			}
			line.push(staff);
		}
		lines.push(line);
	}

	var explanation = {};
	explanation.lineBreakPoint = visualObj[0].explanation.lineBreakPoint;
	explanation.minLineSize = visualObj[0].explanation.minLineSize;
	explanation.minWidth = visualObj[0].explanation.minWidth;
	explanation.measureWidths = visualObj[0].explanation.widths.measureWidths;
	explanation.voiceSizes = lines;

	console.log(JSON.stringify(explanation))
	var msg = "\nrcv: " + JSON.stringify(explanation) + "\n" +
		"exp: " + JSON.stringify(expected) + "\n";
	chai.assert.deepStrictEqual(explanation, expected, msg);
}
