describe("Parsing", function () {
	var abc1 = "X:3\n{Azzz}e2\n"

	var expected1 = [[{
		gracenotes: [{pitch: 5, name: 'A', duration: 0.125, verticalPos: 5}],
		pitches: [{pitch: 9, name: 'e', verticalPos: 9, highestVert: 9}],
		duration: 0.25,
		el_type: "note",
	}]]


	var abc2 = "X: 789\nSx\n"

	var expected2 = [[{
		rest: { type: 'invisible' },
		duration: 0.125,
		el_type: "note",
	}]]

	var abc3 = "X: 360\n[V:1]f|\\\n[V:1]f|\n"

	var expected3 = [[
		{ pitches:[{ pitch: 10, name: 'f', verticalPos: 10, highestVert: 10}], duration: 0.125, el_type: 'note'},
		{ type: 'bar_thin', el_type: 'bar'},
		{ pitches:[{ pitch: 10, name: 'f', verticalPos: 10, highestVert: 10}], duration: 0.125, el_type: 'note'},
		{ type: 'bar_thin', el_type: 'bar'},
	]]

	var abc4 = "X: 360\n[V:T]c|\\\n[V:B]A|\\\n[V:T]d|\n"

	var expected4 = [
		[
			{ duration: 0.125, el_type: 'note', pitches: [{pitch: 7, name: 'c', verticalPos: 7, highestVert: 7}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ duration: 0.125, el_type: 'note', pitches: [{pitch: 5, name: 'A', verticalPos: 5, highestVert: 11}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ duration: 0.125, el_type: 'note', pitches: [{pitch: 8, name: 'd', verticalPos: 8, highestVert: 8}]},
			{ el_type: 'bar', type: 'bar_thin'},
		]
	]

	var abc5 = "X: 360\n[V:T]c|[V:B]A|[V:T]d|\n"

	var expected5 = [
		[
			{ duration: 0.125, el_type: 'note', pitches: [{pitch: 7, name: 'c', verticalPos: 7, highestVert: 7}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ duration: 0.125, el_type: 'note', pitches: [{pitch: 5, name: 'A', verticalPos: 5, highestVert: 11}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ duration: 0.125, el_type: 'note', pitches: [{pitch: 8, name: 'd', verticalPos: 8, highestVert: 8}]},
			{ el_type: 'bar', type: 'bar_thin'},
		]
	]

	var abc6 = "X: 360\n%%score (T B)\n[V:T]c|\\\n[V:B]A|\\\n[V:T]d|\n"

	var expected6 = [
		[
			{ direction: 'up', el_type: 'stem'},
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":7,"name":"c","verticalPos":7,"highestVert":13}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ direction: 'down', el_type: 'stem'},
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":5,"name":"A","verticalPos":5,"highestVert":5}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":8,"name":"d","verticalPos":8,"highestVert":8}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ duration: 0.125, el_type: 'note', pitches: [{pitch: 8, name: 'd', verticalPos: 8, highestVert: 8}]},
			{ el_type: 'bar', type: 'bar_thin'},
		]
	]


	var abc7 = "X: 360\n%%score (T B)\n[V:T]c|[V:B]A|[V:T]d|\n"

	var expected7 = [
		[
			{ direction: 'up', el_type: 'stem'},
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":7,"name":"c","verticalPos":7,"highestVert":13}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ direction: 'down', el_type: 'stem'},
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":5,"name":"A","verticalPos":5,"highestVert":5}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":8,"name":"d","verticalPos":8,"highestVert":8}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ duration: 0.125, el_type: 'note', pitches: [{pitch: 8, name: 'd', verticalPos: 8, highestVert: 8}]},
			{ el_type: 'bar', type: 'bar_thin'},
		]
	]

	var abc8 = "X: 360\n%%score (T B)\n[V:T]a|\n[V:T]b|\n[V:T]c|\n[V:B]A|\n[V:B]B|\n[V:B]C|\n"

	var expected8 = [
		[
			{ direction: 'up', el_type: 'stem'},
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":12,"name":"a","verticalPos":12,"highestVert":18}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ direction: 'down', el_type: 'stem'},
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":5,"name":"A","verticalPos":5,"highestVert":5}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ direction: 'up', el_type: 'stem'},
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":13,"name":"b","verticalPos":13,"highestVert":19}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ direction: 'down', el_type: 'stem'},
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":6,"name":"B","verticalPos":6,"highestVert":6}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ direction: 'up', el_type: 'stem'},
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":7,"name":"c","verticalPos":7,"highestVert":13}]},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ direction: 'down', el_type: 'stem'},
			{ duration: 0.125, el_type: 'note', pitches: [{"pitch":0,"name":"C","verticalPos":0,"highestVert":0}]},
			{ el_type: 'bar', type: 'bar_thin'},
		]
	]

	var abc9 = "X: 360\n%%score (T B)\n[V:T]a|\\\n[V:T]b|\\\n[V:T]c|\\\n[V:B]A|\\\n[V:B]B|\\\n[V:B]C|\n"

	var expected9 = [
		[
			{ el_type: 'stem', direction: 'up'},
			{ el_type: 'note', pitches: [{ pitch: 12, name: 'a', verticalPos: 12, highestVert: 18}], duration: 0.125},
			{ el_type: 'bar', type: 'bar_thin'},
			{ el_type: 'note', pitches: [{ pitch: 13, name: 'b', verticalPos: 13, highestVert: 19}], duration: 0.125},
			{ el_type: 'bar', type: 'bar_thin'},
			{ el_type: 'note', pitches: [{ pitch: 7, name: 'c', verticalPos: 7, highestVert: 13}], duration: 0.125},
			{ el_type: 'bar', type: 'bar_thin'},
		], [
			{ el_type: 'stem', direction: 'down'},
			{ el_type: 'note', pitches: [{ pitch: 5, name: 'A', verticalPos: 5, highestVert: 5}], duration: 0.125},
			{ el_type: 'bar', type: 'bar_thin'},
			{ el_type: 'note', pitches: [{ pitch: 6, name: 'B', verticalPos: 6, highestVert: 6}], duration: 0.125},
			{ el_type: 'bar', type: 'bar_thin'},
			{ el_type: 'note', pitches: [{ pitch: 0, name: 'C', verticalPos: 0, highestVert: 0}], duration: 0.125},
			{ el_type: 'bar', type: 'bar_thin'},
		]
	]

	var abcKeyWarn = "K:Gm\n" +
		"G8|\n" +
		"%%keywarn 0\n" +
		"K:F\n" +
		"F8|\n" +
		"%%keywarn 1\n" +
		"K:G\n" +
		"G8| [K:F]F8|\n" +
		"%%keywarn 0\n" +
		"F8| [K:A]A8|\n"

	var expectedKeyWarn = [
		{"line":0,"staff":0,"type":"initial-clef","style":"treble"},
		{"line":0,"staff":0,"type":"initial-key","name":"Gm","accidentals":"B flat,e flat"},
		{"line":0,"staff":0,"type":"note","duration":1,"pitches":"G"},
		{"line":0,"staff":0,"type":"bar","style":"bar_thin"},
		{"line":1,"staff":0,"type":"initial-clef","style":"treble"},
		{"line":1,"staff":0,"type":"initial-key","name":"F","accidentals":"B flat"},
		{"line":1,"staff":0,"type":"note","duration":1,"pitches":"F"},
		{"line":1,"staff":0,"type":"bar","style":"bar_thin"},
		{"line":1,"staff":0,"type":"key","name":"G","accidentals":"B natural,f sharp"},
		{"line":2,"staff":0,"type":"initial-clef","style":"treble"},
		{"line":2,"staff":0,"type":"initial-key","name":"G","accidentals":"f sharp,B natural"},
		{"line":2,"staff":0,"type":"note","duration":1,"pitches":"G"},
		{"line":2,"staff":0,"type":"bar","style":"bar_thin"},
		{"line":2,"staff":0,"type":"key","name":"F","accidentals":"f natural,B flat"},
		{"line":2,"staff":0,"type":"note","duration":1,"pitches":"F"},
		{"line":2,"staff":0,"type":"bar","style":"bar_thin"},
		{"line":3,"staff":0,"type":"initial-clef","style":"treble"},
		{"line":3,"staff":0,"type":"initial-key","name":"F","accidentals":"B flat,f natural"},
		{"line":3,"staff":0,"type":"note","duration":1,"pitches":"F"},
		{"line":3,"staff":0,"type":"bar","style":"bar_thin"},
		{"line":3,"staff":0,"type":"key","name":"A","accidentals":"f sharp,c sharp,g sharp"},
		{"line":3,"staff":0,"type":"note","duration":1,"pitches":"A"},
		{"line":3,"staff":0,"type":"bar","style":"bar_thin"}
	]


	var abcBarNumberSubtitle = "X:1\n" +
		"T:song\n" +
		"T:subtitle\n" +
		"C:composer\n" +
		"L:1/4\n" +
		"M:2/4\n" +
		"K:BbMaj\n" +
		"%%barnumbers 5\n" +
		"%%setbarnb 24\n" +
		"Z24 | F2 |\n" +
		"\n"

	var expectedBarNumberSubtitle = [
		[
			{ el_type: 'note', duration: 12, rest: { type: 'multimeasure', text: 24 } },
			{ el_type: 'bar', type: 'bar_thin'},
			{ el_type: 'note', pitches: [{ pitch: 3, name: 'F', verticalPos: 3, highestVert: 9}], duration: 0.5},
			{ el_type: 'bar', type: 'bar_thin'},
		]
	]

	it("crashes", function () {
		testParser(abc1, expected1, "abc1");
	})

	it("crash2", function () {
		testParser(abc2, expected2, "abc2");
	})

	it("crash3", function () {
		testParser(abc3, expected3, "abc3");
	})

	it("crash4", function () {
		testParser(abc4, expected4, "abc4");
	})

	it("crash5", function () {
		testParser(abc5, expected5, "abc5");
	})

	it("crash6", function () {
		testParser(abc6, expected6, "abc6");
	})

	it("crash7", function () {
		testParser(abc7, expected7, "abc7");
	})

	it("crash8", function () {
		testParser(abc8, expected8, "abc8");
	})

	it("crash9", function () {
		testParser(abc9, expected9, "abc9");
	})

	it("barNumSubtitle", function () {
		testParser(abcBarNumberSubtitle, expectedBarNumberSubtitle, "BarNumberSubtitle");
	})

	it("keyWarn", function () {
		const ret = flattenResults(abcKeyWarn)
		//console.log(JSON.stringify(ret))
		chai.assert.deepStrictEqual(ret, expectedKeyWarn, "KeyWarn");
	})

	function testParser(abc, expectedLines, comment) {
		var visualObj = abcjs.renderAbc("paper", abc);
		var testIndex = 0
		for (var lineNum = 0; lineNum < visualObj[0].lines.length; lineNum++) {
			var line = visualObj[0].lines[lineNum]
			for (var staffNum = 0; line.staff && staffNum < line.staff.length; staffNum++) {
				for (var voiceNum = 0; voiceNum < line.staff[staffNum].voices.length; voiceNum++) {
					var line1 = line.staff[staffNum].voices[voiceNum]
					var expected = expectedLines[testIndex++]
					console.log(lineNum, staffNum, line1)
					chai.assert.equal(line1.length, expected.length, "number of elements doesn't match")
					for (var i = 0; i < expected.length; i++) {
						var expectedEl = expected[i]
						var keys = Object.keys(expectedEl).sort()
						var foundEl = line1[i]
						var foundKeys = Object.keys(foundEl).sort()
						foundKeys = foundKeys.filter(k => {
							return k !== 'averagepitch' && k !== 'endChar' && k !== 'maxpitch' && k !== 'minpitch' && k !== 'startChar' && k !== 'abselem'
						})
						console.log(foundKeys)
						chai.assert.deepStrictEqual(foundKeys, keys, 'keys mismatch ' +comment);
						for (var j = 0; j < keys.length; j++) {
							var expectedAttr = expectedEl[keys[j]]
							var foundAttr = line1[i][keys[j]]
							console.log(JSON.stringify(foundAttr))
							chai.assert.deepStrictEqual(foundAttr, expectedAttr, keys[j]+' '+i+' '+' '+' '+comment);
						}
					}
				}
			}
		}
	}
})
