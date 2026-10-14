describe("Automatic line wrapping", function() {
	var abcSingleLine = "X:1\n" +
"L:1/4\n" +
"M:4/4\n" +
"K:Bb\n" +
"B,4|C2D2|E3F|GABc|d/e/f/g/ !marcato!D/ E/ F/ G/|B,4|C2D2|E3F|GABc|d/e/f/g/ D/ E/ F/ G/|\n";

	var expectedSingleLine400 = [{"widths":{"left":74.6,"measureWidths":[42.8,38.7,44.6,59.2,126.8,32,38.7,44.6,59.2,126.8],"total":613.7},"lineBreakPoint":180.8,"minLineSize":116.2,"staffWidth":400,"minWidth":191}];

	var expectedSingleLine400LineBreaks = [{"ogLine":0,"line":0,"staff":0,"voice":0,"start":0,"end":12},{"ogLine":0,"line":1,"staff":0,"voice":0,"start":13,"end":21},{"ogLine":0,"line":2,"staff":0,"voice":0,"start":22,"end":34},{"ogLine":0,"line":3,"staff":0,"voice":0,"start":35,"end":44}]
	;

	var expectedSingleLine500 = [{"widths":{"left":74.6,"measureWidths":[42.8,38.7,44.6,59.2,126.8,32,38.7,44.6,59.2,126.8],"total":613.7},"lineBreakPoint":236.4,"minLineSize":151.9,"staffWidth":500,"minWidth":250}];

	var expectedSingleLine500LineBreaks = [{"ogLine":0,"line":0,"staff":0,"voice":0,"start":0,"end":12},{"ogLine":0,"line":1,"staff":0,"voice":0,"start":13,"end":26},{"ogLine":0,"line":2,"staff":0,"voice":0,"start":27,"end":44}]
	;

	var expectedSingleLine600 = [{"widths":{"left":74.6,"measureWidths":[42.8,38.7,44.6,59.2,126.8,32,38.7,44.6,59.2,126.8],"total":613.7},"lineBreakPoint":291.9,"minLineSize":187.7,"staffWidth":600,"minWidth":309}];

	var expectedSingleLine600LineBreaks = [{"ogLine":0,"line":0,"staff":0,"voice":0,"start":0,"end":12},{"ogLine":0,"line":1,"staff":0,"voice":0,"start":13,"end":29},{"ogLine":0,"line":2,"staff":0,"voice":0,"start":30,"end":44}];

	var abcShortMeasures = "%%stretchlast 1\nX:1\nQ:1/4=70\nM:2/4\nL:1/4\nK:C clef=bass\nC,D,|D,2|E,F,|G,2|\nG,2|F,E,|D,D,|C,2|]\n";

	var expectedShortMeasures740 = [{"widths":{"left":50.2,"measureWidths":[48.4,27.4,37.6,27.4,20.4,41.3,41.3,31.4],"total":275.2},"lineBreakPoint":383.2,"minLineSize":246.4,"staffWidth":740,"minWidth":406}];

	var expectedShortMeasures740LineBreaks = [{"ogLine":0,"line":0,"staff":0,"voice":0,"start":0,"end":9},{"ogLine":0,"line":1,"staff":0,"voice":0,"start":10,"end":20}];

	var abcSplitByText =
		"M: 4/4\n" +
		"L: 1/8\n" +
		"R: reel\n" +
		"K: Emin\n" +
		"EB{c}BA B2 EB|\n" +
		"~B2 AB dBAG|\n" +
		"FDAD BDAD|\n" +
		"FDAD dAFD|\n" +
		"%%text Here is some text\n" +
		"eB B2 eBgB|\n" +
		"eB B2 defg|\n" +
		"afe^c dBAF|\n" +
		"DEFD E2|]\n";

	var expectedSplitByText = [{"widths":{"left":67.3,"measureWidths":[112.5,113.1,114.2,115.7],"total":455.5},"lineBreakPoint":240.4,"minLineSize":154.5,"staffWidth":500,"minWidth":255},{"widths":{"left":67.3,"measureWidths":[115.9,115.9,116.5,109.5],"total":457.9},"lineBreakPoint":240.4,"minLineSize":154.5,"staffWidth":500,"minWidth":255}];

	var expectedSplitByTextLineBreaks = [{"ogLine":0,"line":0,"staff":0,"voice":0,"start":0,"end":15},{"ogLine":0,"line":1,"staff":0,"voice":0,"start":16,"end":34},{"ogLine":1,"line":2},{"ogLine":2,"line":3,"staff":0,"voice":0,"start":0,"end":15},{"ogLine":2,"line":4,"staff":0,"voice":0,"start":16,"end":31}]
	;

	var abcPiano = "X:1\n" +
		"T:piano_wrap\n" +
		"M:4/4\n" +
		"L:1/16\n" +
		"%%staves {(RH) (LH)}\n" +
		"%%barnumbers -1\n" +
		"V:RH clef=treble\n" +
		"V:LH clef=bass\n" +
		"K:C\n" +
		"[V: RH]c4 f4 e8| fede g8 e4|g16|\n" +
		"[V: LH] E,12 F,4| z4 G,F,A,G, z4 G,F,A,G, | G,16| \n" +
		"[V: RH]c4 f4 e8| fede g8 e4|\n" +
		"[V: LH] E,12 F,4| z4 G,F,A,G, z4 G,F,A,G, |\n" +
		"[V: RH]c4 f4 e8| fede g8 e4|\n" +
		"[V: LH] E,12 F,4| z4 G,F,A,G, z4 G,F,A,G, |\n" +
		"[V: RH]c4 f4 e8| fede g8 e4|\n" +
		"[V: LH] E,12 F,4| z4 G,F,A,G, z4 G,F,A,G, |\n" +
		"[V: RH]c4 f4 e8| fede g8 e4|\n" +
		"[V: LH] E,12 F,4| z4 G,F,A,G, z4 G,F,A,G, |\n" +
		"[V: RH]c4 f4 e8| fede g8 e4|]\n" +
		"[V: LH] E,12 F,4| z4 G,F,A,G, z4 G,F,A,G, |]";

	var expectedPiano = [{"widths":{"left":60.2,"measureWidths":[59.8,154.6,32,74.1,164.2,74.1,164.2,74.1,164.2,74.1,164.2,68,162.7],"total":1430.3},"lineBreakPoint":244.4,"minLineSize":157.1,"staffWidth":500,"minWidth":259}];

	var expectedPianoLineBreaks = [{"ogLine":0,"line":0,"staff":0,"voice":0,"start":0,"end":12},{"ogLine":0,"line":1,"staff":0,"voice":0,"start":13,"end":23},{"ogLine":0,"line":2,"staff":0,"voice":0,"start":24,"end":34},{"ogLine":0,"line":3,"staff":0,"voice":0,"start":35,"end":45},{"ogLine":0,"line":4,"staff":0,"voice":0,"start":46,"end":56},{"ogLine":0,"line":5,"staff":0,"voice":0,"start":57,"end":68},{"ogLine":0,"line":0,"staff":1,"voice":0,"start":0,"end":15},{"ogLine":0,"line":1,"staff":1,"voice":0,"start":16,"end":29},{"ogLine":0,"line":2,"staff":1,"voice":0,"start":30,"end":43},{"ogLine":0,"line":3,"staff":1,"voice":0,"start":44,"end":57},{"ogLine":0,"line":4,"staff":1,"voice":0,"start":58,"end":71},{"ogLine":0,"line":5,"staff":1,"voice":0,"start":72,"end":86}]

	;

	var expectedBarNumbers = {
		bars: [2, 3, undefined, 5, 6, undefined, 8, undefined, 10, 11, undefined, 13, undefined],
		lines: [undefined, 4, 7, 9, 12]
	}

	var abcQuartet = "X:1\n" +
		"T: wrap quartet\n" +
		"%%score (1 2) 3 4\n" +
		"K: C\n" +
		"V:1 name=\"Violin I\"    snm=\"Vl.1\" clef=treble\n" +
		"V:2 name=\"Violin II\"   snm=\"Vl.2\" clef=treble\n" +
		"V:3 name=\"Viola\"       snm=\"Va\"   clef=alto\n" +
		"V:4 name=\"Violoncello\" snm=\"Vc\"   clef=bass\n" +
		"%\n" +
		"[V:1] CDEF GABc | cdef gabc' |\n" +
		"[V:2] E2G2 B2d2 | cBAG FEDC |\n" +
		"[V:3] C2E2 G2B2 | C2E2 G2B2 |\n" +
		"[V:4] C,8 | E,4 G,4 |\n" +
		"[V:1] CDEF GABc | cdef gabc' |\n" +
		"[V:2] EFGA Bcde | cBAG FEDC |\n" +
		"[V:3] C2E2 G2B2 | C2E2 G2B2 |\n" +
		"[V:4] C,8 | E,4 G,4 |\n" +
		"[V:1] C8 | E8 |\n" +
		"[V:2] E8 | G8 |\n" +
		"[V:3] G,8 | G,8 |\n" +
		"[V:4] C,8 | E,8 |\n" +
		"[V:1] C8 | E8 |\n" +
		"[V:2] E8 | G8 |\n" +
		"[V:3] G,8 | G,8 |\n" +
		"[V:4] C,8 | E,8 |\n" +
		"[V:1] C8 | E8 |\n" +
		"[V:2] E8 | G8 |\n" +
		"[V:3] G,8 | G,8 |\n" +
		"[V:4] C,8 | E,8 |\n" +
		"[V:1] CDEF GABc | cdef gabc' |\n" +
		"[V:2] EFGA Bcde | cBAG FEDC |\n" +
		"[V:3] C2E2 G2B2 | C2E2 G2B2 |\n" +
		"[V:4] C,8 | E,4 G,4 |\n" +
		"[V:1] CDEF GABc | cdef gabc' |\n" +
		"[V:2] EFGA Bcde | cBAG FEDC |\n" +
		"[V:3] C2E2 G2B2 | C2E2 G2B2 |\n" +
		"[V:4] C,8 | E,4 G,4 |\n";

	var expectedQuartet = [{"widths":{"left":92.3,"measureWidths":[91.5,102.5,91.5,102.5,70.5,81.5,70.5,81.5,70.5,81.5,91.5,102.5,91.5,102.5],"total":1231.6},"lineBreakPoint":226.5,"minLineSize":145.6,"staffWidth":500,"minWidth":240}]
	;

	var expectedQuartetLineBreaks = [{"ogLine":0,"line":0,"staff":0,"voice":0,"start":0,"end":18},{"ogLine":0,"line":1,"staff":0,"voice":0,"start":19,"end":37},{"ogLine":0,"line":2,"staff":0,"voice":0,"start":38,"end":45},{"ogLine":0,"line":3,"staff":0,"voice":0,"start":46,"end":52},{"ogLine":0,"line":4,"staff":0,"voice":0,"start":53,"end":71},{"ogLine":0,"line":5,"staff":0,"voice":0,"start":72,"end":91},{"ogLine":0,"line":0,"staff":0,"voice":1,"start":0,"end":14},{"ogLine":0,"line":1,"staff":0,"voice":1,"start":15,"end":33},{"ogLine":0,"line":2,"staff":0,"voice":1,"start":34,"end":41},{"ogLine":0,"line":3,"staff":0,"voice":1,"start":42,"end":48},{"ogLine":0,"line":4,"staff":0,"voice":1,"start":49,"end":67},{"ogLine":0,"line":5,"staff":0,"voice":1,"start":68,"end":87},{"ogLine":0,"line":0,"staff":1,"voice":0,"start":0,"end":9},{"ogLine":0,"line":1,"staff":1,"voice":0,"start":10,"end":19},{"ogLine":0,"line":2,"staff":1,"voice":0,"start":20,"end":25},{"ogLine":0,"line":3,"staff":1,"voice":0,"start":26,"end":31},{"ogLine":0,"line":4,"staff":1,"voice":0,"start":32,"end":41},{"ogLine":0,"line":5,"staff":1,"voice":0,"start":42,"end":52},{"ogLine":0,"line":0,"staff":2,"voice":0,"start":0,"end":4},{"ogLine":0,"line":1,"staff":2,"voice":0,"start":5,"end":9},{"ogLine":0,"line":2,"staff":2,"voice":0,"start":10,"end":15},{"ogLine":0,"line":3,"staff":2,"voice":0,"start":16,"end":21},{"ogLine":0,"line":4,"staff":2,"voice":0,"start":22,"end":26},{"ogLine":0,"line":5,"staff":2,"voice":0,"start":27,"end":32}]



	var abcVoicesShareStaff = "X:0\n" +
		"%%score { ( 1 2 ) | ( 3 4 ) }\n" +
		"L:1/4\n" +
		"M:4/4\n" +
		"K:Bb\n" +
		"V:1 treble\n" +
		"V:2 treble\n" +
		"V:3 bass\n" +
		"V:4 bass\n" +
		"V:1\n" +
		"G A B G | ^F A G B | A G F2 |]\n" +
		"V:2\n" +
		"D F F E | D ^F G =F | F B,/C/ D2 |]\n" +
		"V:3\n" +
		"B, C D C/B,/ | A, D B, D | D G,/A,/ B,2 |] \n" +
		"V:4\n" +
		"G, F, B,, C, | D, D, G, B,,/C,/ | D, E, B,,2 |]";

	var expectedVoicesShareStaff = [
		[
			[{"el_type":"stem","direction":"up"},{"el_type":"note","pitches":[4]},{"el_type":"note","pitches":[5]},{"el_type":"note","pitches":[6]},{"el_type":"note","pitches":[4]},{"el_type":"bar"}],
			[{"el_type":"stem","direction":"down"},{"el_type":"note","pitches":[1]},{"el_type":"note","pitches":[3]},{"el_type":"note","pitches":[3]},{"el_type":"note","pitches":[2]},{"el_type":"bar"}],
			[{"el_type":"stem","direction":"up"},{"el_type":"note","pitches":[-1]},{"el_type":"note","pitches":[0]},{"el_type":"note","pitches":[1]},{"el_type":"note","pitches":[0]},{"el_type":"note","pitches":[-1]},{"el_type":"bar"}],
			[{"el_type":"stem","direction":"down"},{"el_type":"note","pitches":[-3]},{"el_type":"note","pitches":[-4]},{"el_type":"note","pitches":[-8]},{"el_type":"note","pitches":[-7]},{"el_type":"bar"}]
		],
		[
			[{"el_type":"stem","direction":"up"},{"el_type":"note","pitches":[3]},{"el_type":"note","pitches":[5]},{"el_type":"note","pitches":[4]},{"el_type":"note","pitches":[6]},{"el_type":"bar"}],
			[{"el_type":"stem","direction":"down"},{"el_type":"note","pitches":[1]},{"el_type":"note","pitches":[3]},{"el_type":"note","pitches":[4]},{"el_type":"note","pitches":[3]},{"el_type":"bar"}],
			[{"el_type":"stem","direction":"up"},{"el_type":"note","pitches":[-2]},{"el_type":"note","pitches":[1]},{"el_type":"note","pitches":[-1]},{"el_type":"note","pitches":[1]},{"el_type":"bar"}],
			[{"el_type":"stem","direction":"down"},{"el_type":"note","pitches":[-6]},{"el_type":"note","pitches":[-6]},{"el_type":"note","pitches":[-3]},{"el_type":"note","pitches":[-8]},{"el_type":"note","pitches":[-7]},{"el_type":"bar"}]
		],
		[
			[{"el_type":"stem","direction":"up"},{"el_type":"note","pitches":[5]},{"el_type":"note","pitches":[4]},{"el_type":"note","pitches":[3]},{"el_type":"bar"}],
			[{"el_type":"stem","direction":"down"},{"el_type":"note","pitches":[3]},{"el_type":"note","pitches":[-1]},{"el_type":"note","pitches":[0]},{"el_type":"note","pitches":[1]},{"el_type":"bar"}],
			[{"el_type":"stem","direction":"up"},{"el_type":"note","pitches":[1]},{"el_type":"note","pitches":[-3]},{"el_type":"note","pitches":[-2]},{"el_type":"note","pitches":[-1]},{"el_type":"bar"}],
			[{"el_type":"stem","direction":"down"},{"el_type":"note","pitches":[-6]},{"el_type":"note","pitches":[-5]},{"el_type":"note","pitches":[-8]},{"el_type":"bar"}]
		],
	];

	//////////////////////////////////////////////////////////////

	it("wrap-short-measures", function() {
		doWrapTest(abcShortMeasures, expectedShortMeasures740, expectedShortMeasures740LineBreaks, 740);
	});

	it("wrap-single-line400", function() {
		doWrapTest(abcSingleLine, expectedSingleLine400, expectedSingleLine400LineBreaks, 400);
	})

	it("wrap-single-line500", function() {
		doWrapTest(abcSingleLine, expectedSingleLine500, expectedSingleLine500LineBreaks, 500);
	})

	it("wrap-single-line600", function() {
		doWrapTest(abcSingleLine, expectedSingleLine600,  expectedSingleLine600LineBreaks, 600);
	})

	it("split-by-text", function() {
		doWrapTest(abcSplitByText, expectedSplitByText, expectedSplitByTextLineBreaks, 500);
	})

	it("piano-wrap", function() {
		doWrapTest(abcPiano, expectedPiano, expectedPianoLineBreaks, 500);
	})

	it("quartet-wrap", function() {
		doWrapTest(abcQuartet, expectedQuartet, expectedQuartetLineBreaks, 500);
	})

	it("share-staff", function() {
		doWrapTestContents(abcVoicesShareStaff, expectedVoicesShareStaff, 300);
	})

	it("measure-numbers", function() {
		var visualObj = abcjs.renderAbc("paper", abcPiano, {
			staffwidth: 500,
			wrap: {
				minSpacing: 1.8,
				maxSpacing: 2.8,
				preferredMeasuresPerLine: 4
			}
		});
		var bars = []
		var lines = []
		for (var i = 0; i < visualObj[0].lines.length; i++) {
			var line = visualObj[0].lines[i]
			var voice = line.staff[0].voices[0]
			bars = bars.concat(voice.filter(function (v) { return v.el_type === "bar" }).map(function(v) { return v.barNumber }))
			lines.push(line.staff[0].barNumber)
		}
		chai.assert.deepEqual(bars, expectedBarNumbers.bars, "Bar number incorrect on bar element\n" + JSON.stringify(bars) + "\n" + JSON.stringify(expectedBarNumbers.bars))
		chai.assert.deepEqual(lines, expectedBarNumbers.lines, "Bar number incorrect on line\n" + JSON.stringify(lines) + "\n" + JSON.stringify(expectedBarNumbers.lines))
	})

})

//////////////////////////////////////////////////////////

function doWrapTestContents(abc, expected, width) {
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
			for (var k = 0; k < staves[j].voices.length; k++) {
				var els = [];
				for (var kk = 0; kk < staves[j].voices[k].length; kk++) {
					var el = {el_type: staves[j].voices[k][kk].el_type};
					if (el.el_type === "stem")
						el.direction = staves[j].voices[k][kk].direction;
					else if (el.el_type === "note") {
						el.pitches = [];
						for (var ii = 0; ii < staves[j].voices[k][kk].pitches.length; ii++)
							el.pitches.push(staves[j].voices[k][kk].pitches[ii].pitch)
					}
					els.push(el);
				}
				line.push(els);
			}
		}
		lines.push(line);
	}
	console.log(lines)
	for (i = 0; i < lines.length; i++) {
		for (j = 0; j < lines[i].length; j++) {
			for (k = 0; k < lines[i][j].length; k++) {
				var msg = "\nrcv: " + JSON.stringify(lines[i][j][k]) + "\n" +
					"exp: " + JSON.stringify(expected[i][j][k]) + "\nLine: " + i + '  Voice: ' + j + '  Element: ' + k + '\n';
				chai.assert.deepStrictEqual(lines[i][j][k], expected[i][j][k], msg);
			}
		}
	}
}

function doWrapTest(abc, expected, expectedLineBreaks, width) {
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
				console.log(staves[j].voices[k])
				staff.push(staves[j].voices[k].length);
			}
			line.push(staff);
		}
		lines.push(line);
	}

	for (var e = 0; e < visualObj[0].explanation.length; e++) {
		var line = visualObj[0].explanation[e]
		delete line.attempts;
		if (line.lineBreakPoint)
			line.lineBreakPoint = Math.round(line.lineBreakPoint*10)/10
		if (line.minLineSize)
			line.minLineSize = Math.round(line.minLineSize*10)/10
		if (line.widths) {
			if (line.widths.left)
				line.widths.left = Math.round(line.widths.left*10)/10
			if (line.widths.total)
				line.widths.total = Math.round(line.widths.total*10)/10
			if (line.widths.measureWidths) {
				for (var f = 0; f < line.widths.measureWidths.length; f++)
					line.widths.measureWidths[f] = Math.round(line.widths.measureWidths[f]*10)/10
			}
		}
	}

	// console.log(JSON.stringify(visualObj[0].explanation))
	// console.log(JSON.stringify(visualObj[0].lineBreaks))
	var msg = "\nrcv: " + JSON.stringify(visualObj[0].explanation) + "\n" +
		"exp: " + JSON.stringify(expected) + "\n";
	chai.assert.deepStrictEqual(visualObj[0].explanation, expected, msg);
	msg = "\nrcv: " + JSON.stringify(visualObj[0].lineBreaks) + "\n" +
		"exp: " + JSON.stringify(expectedLineBreaks) + "\n";
	chai.assert.deepStrictEqual(visualObj[0].lineBreaks, expectedLineBreaks, msg);
}
