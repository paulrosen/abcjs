describe("Parser Lyrics", function() {
	// ABC 2.1: standalone _ in w: extends the melisma/continuation line under the note
	var abcMelismaUnderscore =
		"X:1\n" +
		"K:C\n" +
		"C D C\n" +
		"w: ka-TON_ _\n"

	it("standalone _ extends continuation line (divider is _)", function() {
		var visualObj = abcjs.renderAbc("paper", abcMelismaUnderscore, {});
		var voice = visualObj[0].lines[0].staff[0].voices[0];
		var notes = voice.filter(function(el) { return el.el_type === 'note'; });

		chai.assert.equal(notes.length, 3, "should have 3 notes");

		// Note 1 (C): "ka" with hyphen divider
		chai.assert.deepEqual(notes[0].lyric, [{syllable: "ka", divider: "-"}], "note 1 lyric");

		// Note 2 (D): "TON" with underscore divider (start of extension line)
		chai.assert.deepEqual(notes[1].lyric, [{syllable: "TON", divider: "_"}], "note 2 lyric");

		// Note 3 (C): empty syllable with underscore divider (extension line continues)
		chai.assert.deepEqual(notes[2].lyric, [{syllable: "", divider: "_"}], "note 3 lyric should extend the line");
	});

	var abcMelismaMultipleUnderscores =
		"X:1\n" +
		"K:C\n" +
		"C D E F\n" +
		"w: word_ _ _\n"

	it("multiple consecutive _ each extend the continuation line", function() {
		var visualObj = abcjs.renderAbc("paper", abcMelismaMultipleUnderscores, {});
		var voice = visualObj[0].lines[0].staff[0].voices[0];
		var notes = voice.filter(function(el) { return el.el_type === 'note'; });

		chai.assert.equal(notes.length, 4, "should have 4 notes");

		chai.assert.deepEqual(notes[0].lyric, [{syllable: "word", divider: "_"}], "note 1 lyric");
		chai.assert.deepEqual(notes[1].lyric, [{syllable: "", divider: "_"}], "note 2 lyric should extend");
		chai.assert.deepEqual(notes[2].lyric, [{syllable: "", divider: "_"}], "note 3 lyric should extend");
		chai.assert.deepEqual(notes[3].lyric, [{syllable: "", divider: "_"}], "note 4 lyric should extend");
	});
});
