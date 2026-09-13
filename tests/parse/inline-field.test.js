describe("Inline fields after decorations and chord symbols", function() {
	var abcTempoAfterDecoration = "X:1\n" +
		"M:4/4\n" +
		"L:1/4\n" +
		"Q:1/4=60\n" +
		"K:C\n" +
		"CD !mf![Q:1/4=88]EF|]\n";

	var abcKeyAfterChordSymbol = "X:1\n" +
		"L:1/4\n" +
		"K:C\n" +
		"\"G7\"[K:D]F2|]\n";

	var abcKeyAfterDecoration = "X:1\n" +
		"L:1/4\n" +
		"K:C\n" +
		"!mf![K:D]F2|]\n";

	var abcClefAfterDecoration = "X:1\n" +
		"L:1/4\n" +
		"K:C clef=bass\n" +
		"C,D,|!pp![K:treble]EF|]\n";

	it("tempo after a decoration", function() {
		var visualObj = abcjs.renderAbc("paper", abcTempoAfterDecoration, {});
		var voice = visualObj[0].lines[0].staff[0].voices[0];
		var tempos = voice.filter(function (el) { return el.el_type === "tempo"; });
		chai.assert.equal(tempos.length, 1, "number of tempo changes");
		chai.assert.equal(tempos[0].bpm, 88, "bpm");
		chai.assert.equal(visualObj[0].warnings, undefined, "warnings");
	})

	it("key after a chord symbol", function() {
		var visualObj = abcjs.renderAbc("paper", abcKeyAfterChordSymbol, {});
		chai.assert.equal(visualObj[0].lines[0].staff[0].key.root, "D", "key");
		chai.assert.equal(visualObj[0].warnings, undefined, "warnings");
	})

	it("key after a decoration", function() {
		var visualObj = abcjs.renderAbc("paper", abcKeyAfterDecoration, {});
		chai.assert.equal(visualObj[0].lines[0].staff[0].key.root, "D", "key");
		chai.assert.equal(visualObj[0].warnings, undefined, "warnings");
	})

	it("clef after a decoration", function() {
		var visualObj = abcjs.renderAbc("paper", abcClefAfterDecoration, {});
		var voice = visualObj[0].lines[0].staff[0].voices[0];
		var clefs = voice.filter(function (el) { return el.el_type === "clef"; });
		var notes = voice.filter(function (el) { return el.el_type === "note"; });
		chai.assert.equal(clefs.length, 1, "number of clef changes");
		chai.assert.equal(clefs[0].type, "treble", "clef");
		chai.assert.equal(notes.length, 4, "number of notes");
		chai.assert.equal(visualObj[0].warnings, undefined, "warnings");
	})
})
