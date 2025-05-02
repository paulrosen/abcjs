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

	var abcTrills = "L:1/1\n" +
		"K:none clef=none\n" +
		"tD tE tF !trillh!G !trillh!A !trillh!B  !uppermordent!c !lowermordent!d !mordent!e Tf \n"

	var expectedTrills = [
		{"pitch":1,"note":"D","c":"noteheads.whole"},
		{"pitch":15,"note":"D","c":"scripts.trill"},
		{"pitch":2,"note":"E","c":"noteheads.whole"},
		{"pitch":15,"note":"E","c":"scripts.trill"},
		{"pitch":3,"note":"F","c":"noteheads.whole"},
		{"pitch":15,"note":"F","c":"scripts.trill"},
		{"pitch":4,"note":"G","c":"noteheads.whole"},
		{"pitch":15,"note":"G","c":"scripts.trill"},
		{"pitch":5,"note":"A","c":"noteheads.whole"},
		{"pitch":15,"note":"A","c":"scripts.trill"},
		{"pitch":6,"note":"B","c":"noteheads.whole"},
		{"pitch":15,"note":"B","c":"scripts.trill"},
		{"pitch":7,"note":"c","c":"noteheads.whole"},
		{"pitch":13,"note":"c","c":"scripts.prall"},
		{"pitch":8,"note":"d","c":"noteheads.whole"},
		{"pitch":14,"note":"d","c":"scripts.mordent"},
		{"pitch":9,"note":"e","c":"noteheads.whole"},
		{"pitch":14,"note":"e","c":"scripts.mordent"},
		{"pitch":10,"note":"f","c":"noteheads.whole"},
		{"pitch":15,"note":"f","c":"scripts.trill"}
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

	it("trills", function() {
		var visualObj = abcjs.renderAbc("paper", abcTrills, {add_classes: true});
		var trills = []
		for (var i = 0; i < visualObj[0].lines.length; i++) {
			var line = visualObj[0].lines[i]
			for (var j = 0; j < line.staffGroup.voices.length; j++) {
				var voice = line.staffGroup.voices[j];
				for (var k = 0; k < voice.children.length; k++) {
					var absElem = voice.children[k]
					for (var ii = 0; ii < absElem.children.length; ii++) {
						var relElem = absElem.children[ii]
						trills.push({pitch: Math.round(relElem.pitch), note: relElem.parent.children[0].name, c: relElem.c})
					}
				}
			}
		}
		console.log(JSON.stringify(trills))
		chai.assert.deepStrictEqual(trills, expectedTrills);
	})

})
