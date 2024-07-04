describe("Parsing", function () {
	var abc1 = "X:3\n{Azzz}e2\n"

	var expected1 = [{
		gracenotes: [{pitch: 5, name: 'A', duration: 0.125, verticalPos: 5}, {rest: {type: 'rest'}, duration: 0.125, verticalPos: 5}, {rest: {type: 'rest'}, duration: 0.125, verticalPos: 5}, {rest: {type: 'rest'}, duration: 0.125, verticalPos: 5}],
		pitches: [{pitch: 9, name: 'e', verticalPos: 9, highestVert: 9}],
		duration: 0.25,
		el_type: "note",
	}]


	var abc2 = "X: 789\nSx\n"

	var expected2 = [{
		duration: 0.125,
		el_type: "note",
		rest: { type: 'invisible' }
	}]

	var abc3 = "X: 360\n[V:1]f|\\\n[V:1]f|\n"

	var expected3 = []

	it("crashes", function () {
		testParser(abc1, expected1, "abc1");
	})

	it("crash2", function () {
		testParser(abc2, expected2, "abc2");
	})

	it("crash3", function () {
		testParser(abc3, expected3, "abc3");
	})

	function testParser(abc, expected, comment) {
		var visualObj = abcjs.renderAbc("paper", abc);
		var line1 = visualObj[0].lines[0].staff[0].voices[0]
		console.log(line1)
		for (var i = 0; i < expected.length; i++) {
			var expectedEl = expected[i]
			var keys = Object.keys(expectedEl)
			var foundEl = line1[i]
			var foundKeys = Object.keys(foundEl)
			foundKeys = foundKeys.filter(k => {
				return k !== 'averagepitch' && k !== 'endChar' && k !== 'maxpitch' && k !== 'minpitch' && k !== 'startChar' && k !== 'abselem'
			})
			console.log(foundKeys)
			chai.assert.deepStrictEqual(foundKeys, keys, 'keys mismatch ' +comment);
			for (var j = 0; j < keys.length; j++) {
				var expectedAttr = expectedEl[keys[j]]
				var foundAttr = line1[i][keys[j]]
				chai.assert.deepStrictEqual(foundAttr, expectedAttr, keys[j]+' '+i+' '+' '+' '+comment);
			}
		}
	}
})
