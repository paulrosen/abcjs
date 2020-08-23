describe("Automatic line wrapping", function() {
	var abcSingleLine = "X:1\n" +
"L:1/4\n" +
"M:4/4\n" +
"K:Bb\n" +
"B,4|C2D2|E3F|GABc|d/e/f/g/ !marcato!D/ E/ F/ G/|B,4|C2D2|E3F|GABc|d/e/f/g/ D/ E/ F/ G/|\n";

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

	var abcShortMeasures = "%%stretchlast 1\nX:1\nQ:1/4=70\nM:2/4\nL:1/4\nK:C clef=bass\nC,D,|D,2|E,F,|G,2|\nG,2|F,E,|D,D,|C,2|]\n";

	var expectedShortMeasures740 = {
		"lineBreakPoint":383.24833333333333,
		"minLineSize":246.3739285714286,
		"minWidth":406,
		"measureWidths":
			[48.41500000000001,27.370000000000005,37.620000000000005,27.370000000000005,16.369999999999997,37.620000000000005,37.620000000000005,27.370000000000005],
		"voiceSizes":[[[10]],[[10]]]};

	it("wrap-short-measures", function() {
		doWrapTest(abcShortMeasures, expectedShortMeasures740, 740);
	});

	it("wrap-single-line400", function() {
		doWrapTest(abcSingleLine, expectedSingleLine400, 400);
	})

	it("wrap-single-line500", function() {
		doWrapTest(abcSingleLine, expectedSingleLine500, 500);
	})

	it("wrap-single-line600", function() {
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
