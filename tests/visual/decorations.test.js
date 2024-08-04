describe("Decorations", function() {

	var abcFermata = "X:1\n" +
		"L:1/8\n" +
		"M:4/4\n" +
		"%%score (S A) B\n" +
		"K:C\n" +
		"[V:S]!invertedfermata!EF !invertedfermata!G2 | !invertedfermata!ef !invertedfermata!g2 |!fermata!EF !fermata!G2 | !fermata!ef !fermata!g2 ||\n" +
		"[V:A]!invertedfermata!A,B, !invertedfermata!C2 | !invertedfermata!cd !invertedfermata!e2 |!fermata!A,B, !fermata!C2 | !fermata!cd !fermata!e2 ||\n" +
		"[V:B]!invertedfermata!A,B, !invertedfermata!C2 | !invertedfermata!cd !invertedfermata!e2 |!fermata!A,B, !fermata!C2 | !fermata!cd !fermata!e2 ||\n"

	var expectedFermata = [
		{ "pitch": -1, "note": "E" },
		{ "pitch": 1, "note": "G" },
		{ "pitch": 6, "note": "e" },
		{ "pitch": 8, "note": "g" },
		{ "pitch": 14, "note": "E" },
		{ "pitch": 14, "note": "G" },
		{ "pitch": 20, "note": "e" },
		{ "pitch": 20, "note": "g" },
		{ "pitch": -11, "note": "A," },
		{ "pitch": -10, "note": "C" },
		{ "pitch": -5, "note": "c" },
		{ "pitch": -1, "note": "e" },
		{ "pitch": 14, "note": "A," },
		{ "pitch": 14, "note": "C" },
		{ "pitch": 14, "note": "c" },
		{ "pitch": 14, "note": "e" },
		{ "pitch": -5, "note": "A," },
		{ "pitch": -3, "note": "C" },
		{ "pitch": -5, "note": "c" },
		{ "pitch": -1, "note": "e" },
		{ "pitch": 14, "note": "A," },
		{ "pitch": 14, "note": "C" },
		{ "pitch": 14, "note": "c" },
		{ "pitch": 14, "note": "e" }
	]

	it("fermata", function() {
		var visualObj = abcjs.renderAbc("paper", abcFermata, {add_classes: true});
		var fermatas = []
		for (var i = 0; i < visualObj[0].lines.length; i++) {
			var line = visualObj[0].lines[i]
			for (var j = 0; j < line.staffGroup.voices.length; j++) {
				var voice = line.staffGroup.voices[j];
				for (var k = 0; k < voice.children.length; k++) {
					var absElem = voice.children[k]
					for (var ii = 0; ii < absElem.children.length; ii++) {
						var relElem = absElem.children[ii]
						if (relElem.c === 'scripts.dfermata' || relElem.c === 'scripts.ufermata') {
							fermatas.push({pitch: Math.round(relElem.pitch), note: relElem.parent.children[0].name})
						}
					}
				}
			}
		}
		console.log(fermatas)
		chai.assert.deepStrictEqual(fermatas, expectedFermata);
	})

})

