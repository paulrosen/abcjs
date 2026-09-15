describe("Tuplet duration", function () {
	// The notes inside a tuplet don't have to be written the same length, so the
	// length of the tuplet can't be extrapolated from its first note. See issue #1117.
	var header = 'X:1\nM:4/4\nL:1/8\nQ:1/4=120\nK:C\n';

	// The durations of the first voice's notes, separated by spaces. A short string
	// rather than an array of objects so that a failure reads as a bar of music and
	// survives mocha's HTML reporter without being truncated. The notes are played
	// back to back, so the durations alone pin down the timing; the start times are
	// asserted in ticks by tuplet-midi.test.js.
	function durationsOf(abc) {
		var visualObj = abcjs.renderAbc("paper", header + abc + '\n', {});
		var flatten = visualObj[0].setUpAudio();
		var notes = [];
		for (var i = 0; i < flatten.tracks[0].length; i++) {
			var ev = flatten.tracks[0][i];
			if (ev.cmd === "note")
				notes.push(ev.duration.toFixed(6));
		}
		return { durations: notes.join(" "), total: flatten.totalDuration };
	}

	var cases = [
		// [ name, abc body, "duration duration ...", totalDuration ]
		["even triplet (unchanged)", '(3GFE|',
			"0.083333 0.083333 0.083334", 0.25],
		["broken rhythm on notes 2-3 (unchanged)", '(3GF>E|',
			"0.083333 0.125000 0.041667", 0.25],
		["(p:q:r with r < p (unchanged)", '(3:2:2 GF E|',
			"0.083333 0.083334 0.125000", 0.291667],
		["broken rhythm on notes 1-2", '(3G>FE|',
			"0.125000 0.041667 0.083333", 0.25],
		["reverse broken rhythm on notes 1-2", '(3G<FE|',
			"0.041667 0.125000 0.083333", 0.25],
		["long first note", '(3G2FE|',
			"0.166667 0.083333 0.083333", 0.333333],
		["one note tuplet doesn't leak", '(3:2:1 G FE|',
			"0.083333 0.125000 0.125000", 0.333333]
	];

	cases.forEach(function (c) {
		it(c[0], function () {
			var got = durationsOf(c[1]);
			chai.assert.equal(got.durations, c[2], c[1] + " note durations");
			chai.assert.equal(got.total, c[3], c[1] + " total duration");
		});
	});

	it("a tuplet doesn't push the rest of the voice out of sync", function () {
		// The bar is the same length in both voices, so both voices must end together.
		var abc = 'X:1\nM:4/4\nL:1/8\nQ:1/8=90\nK:G\n' +
			'V:1\n(3 D2E2F2 (3 D2>E2F2 |\n' +
			'V:2\nC2 C2C2C2 |\n';
		var visualObj = abcjs.renderAbc("paper", abc, {});
		var flatten = visualObj[0].setUpAudio();
		var ends = [];
		for (var t = 0; t < flatten.tracks.length; t++) {
			var last = null;
			for (var i = 0; i < flatten.tracks[t].length; i++) {
				if (flatten.tracks[t][i].cmd === "note")
					last = flatten.tracks[t][i];
			}
			if (last) ends.push(last.start + last.duration);
		}
		chai.assert.deepStrictEqual(ends, [1, 1], "the voices end at different times");
	});
});
