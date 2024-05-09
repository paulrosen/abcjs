describe("Slurs", function() {

	var abcSlurBeams = "X:1\n" +
		"L:1/8\n" +
		"M:4/4\n" +
		"%%score (S A)\n" +
		"K:C\n" +
		"[V:S]G2 cc3 ||\n" +
		"[V:A]E2E (EFG) ||";

	var abcSlurBeams2 = "X:1\n" +
		"L:1/8\n" +
		"M:4/4\n" +
		"%%score (S A) (T B)\n" +
		"K:C\n" +
		"[V:S](EFGCF2) (EF) | (E2D2) C4 | (f2e)c ||\n" +
		"[V:A](C4CB,) C2 | (C2B,2) C4 | (c2G)E ||\n" +
		"[V:T](G,4 A,F,) (G,F,) | G,2>F,2 E,4 | f(e c2) ||\n" +
		"[V:B](C,D, E,2 D,2) (C,A,,) | G,,4 C,4 | c(G E2) ||\n"


	it("slur around beams", function() {
		abcjs.renderAbc("paper", abcSlurBeams, {add_classes: true});
		var slur = document.querySelector('.abcjs-slur')
		var beam = document.querySelector('.abcjs-beam-elem')
		var slurPos = slur.getBBox()
		var beamPos = beam.getBBox()
		chai.assert.isAbove(slurPos.y, beamPos.y, "slur should be underneath beam");
	})

	it("slurs-around-beams2", function() {
		var visualObj = abcjs.renderAbc("paper", abcSlurBeams2, {add_classes: true});
		var slurY = []
		for (var i = 0; i < visualObj[0].lines[0].staffGroup.voices.length; i++) {
			var voice = visualObj[0].lines[0].staffGroup.voices[i]
			for (var s = 0; s < voice.otherchildren.length; s++) {
				var slur = voice.otherchildren[s]
				if (slur.type === 'TieElem') {
					slurY.push({s: Math.round(slur.startY), e: Math.round(slur.endY)})
				}
			}
		}
		var expected = [
			{s: 13, e: 3},
			{s: 10, e: 11},
			{s: 5, e: 4},
			{s: 13, e: 12},
			{s: 0, e: -8},
			{s: 0, e: -1},
			{s: 7, e: 4},
			{s: 0, e: 5},
			{s: 6, e: 6},
			{s: 12, e: 10},
			{s: -14, e: -6},
			{s: -15, e: -16},
			{s: 4, e: 2},
		]
		chai.assert.deepStrictEqual(slurY, expected, "Vertical placement of slurs");
	})

})
