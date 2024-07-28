describe("Parser Note", function() {
	var abcZeroLength = "X:1\n" +
	"C0 D1 [EG]0 [FA]1\n"

	var expectedZeroLength = [
		0, 0.125, 0, 0.125
	]

	it("zero-length", function() {
		doNoteLengthTest(abcZeroLength, expectedZeroLength)
	})

	function doNoteLengthTest(abc, expected) {
		var visualObj = abcjs.renderAbc("paper", abc, {});
		var warnings = visualObj[0].warnings
		var voice = visualObj[0].lines[0].staff[0].voices[0]
		for (var i = 0; i < voice.length; i++) {
			chai.assert.equal(voice[i].duration, expected[i], "element # "+i)
		}
		chai.assert.equal(warnings, undefined, "warnings")
	}
})
