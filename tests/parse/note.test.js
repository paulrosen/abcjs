describe("Parser Note", function() {
	var abcZeroLength = "X:1\n" +
	"C0 D1 [EG]0 [FA]1\n"

	var expectedZeroLength = [
		0, 0.125, 0, 0.125
	]

	it("zero-length", function() {
		doNoteLengthTest(abcZeroLength, expectedZeroLength)
	})

	var abcMultiDigitTuplets = [
		{ abc: "(11:6:11 !2!bc'd'!1!=a!4!ba^g!1!a!5!c'b_g)", p: 11, q: 6, r: 11 },
		{ abc: "(10:8abcdefgabc", p: 10, q: 8, r: 10 },
		{ abc: "(12:8:6abcdef", p: 12, q: 8, r: 6 },
		{ abc: "(3:2:2ab", p: 3, q: 2, r: 2 },
		{ abc: "(5::3abc", p: 5, q: 2, r: 3 },
	]

	it("multi-digit-tuplets", function() {
		for (var i = 0; i < abcMultiDigitTuplets.length; i++)
			doTupletTest(abcMultiDigitTuplets[i])
	})

	function doTupletTest(tuplet) {
		var visualObj = abcjs.renderAbc("paper", "X:1\nL:1/16\nK:C\n" + tuplet.abc + "|\n", {});
		var notes = visualObj[0].lines[0].staff[0].voices[0].filter(function (el) { return el.el_type === "note" })
		chai.assert.equal(visualObj[0].warnings, undefined, tuplet.abc + " warnings")
		chai.assert.equal(notes[0].startTriplet, tuplet.p, tuplet.abc + " p")
		chai.assert.equal(notes[0].tripletMultiplier, tuplet.q / tuplet.p, tuplet.abc + " q")
		chai.assert.equal(notes[0].tripletR, tuplet.r, tuplet.abc + " r")
		chai.assert.isTrue(notes[tuplet.r - 1].endTriplet, tuplet.abc + " end of tuplet")
	}

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
