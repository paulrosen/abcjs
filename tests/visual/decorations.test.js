describe("Decorations", function() {

	var abcFermata = "X:1\n" +
		"L:1/8\n" +
		"M:4/4\n" +
		"%%score (S A) B\n" +
		"K:C\n" +
		"[V:S]!invertedfermata!EF !invertedfermata!G2 | !invertedfermata!ef !invertedfermata!g2 |!fermata!EF !fermata!G2 | !fermata!ef !fermata!g2 ||\n" +
		"[V:A]!invertedfermata!A,B, !invertedfermata!C2 | !invertedfermata!cd !invertedfermata!e2 |!fermata!A,B, !fermata!C2 | !fermata!cd !fermata!e2 ||\n" +
		"[V:B]!invertedfermata!A,B, !invertedfermata!C2 | !invertedfermata!cd !invertedfermata!e2 |!fermata!A,B, !fermata!C2 | !fermata!cd !fermata!e2 ||\n"
				

	it("fermata", function() {
		abcjs.renderAbc("paper", abcFermata, {add_classes: true});
		chai.assert.isAbove(2, 4, "TODO");
	})

})

