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
		"[V:S](EFGCF2) (EF) | (E2D2) C4 ||\n" +
		"[V:A](C4CB,) C2 | (C2B,2) C4 ||\n" +
		"[V:T](G,4 A,F,) (G,F,) | G,2>F,2 E,4 ||\n" +
		"[V:B](C,D, E,2 D,2) (C,A,,) | G,,4 C,4 ||\n"


	it("slur around beams", function() {
		abcjs.renderAbc("paper", abcSlurBeams, {add_classes: true});
		var slur = document.querySelector('.abcjs-slur')
		var beam = document.querySelector('.abcjs-beam-elem')
		var slurPos = slur.getBBox()
		var beamPos = beam.getBBox()
		chai.assert.isAbove(slurPos.y, beamPos.y, "slur should be underneath beam");
	})

	it("slur around beams2", function() {
		abcjs.renderAbc("paper", abcSlurBeams2, {add_classes: true});
		var slurs = document.querySelectorAll('.abcjs-slur')
		var beams = document.querySelectorAll('.abcjs-beam-elem')
		for (var i = 0; i < slurs.length; i++) {
			console.log("slur", i, slurs[i].classList, slurs[i].getBBox())
		}
		for (var i = 0; i < beams.length; i++) {
			console.log("beam", i, beams[i].classList, beams[i].getBBox())
		}
		chai.assert.isAbove(2, 4, "TODO");
	})

})
