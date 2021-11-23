describe("Miscellaneous", function() {
	var abcJazzChords = "X:1\n" +
		"%%jazzchords\n" +
		"K:C\n" +
		"\"C7\"C \"C/B\"B \"x\"A \"x/C\"G \"/E\"E|";

	var expectedJazzChords = [
		{input: 'C7', output: 'C\x037\x03'},
		{input: 'C/B', output: 'C\x03\x03/B'},
		{input: 'x', output: '\x03x\x03'},
		{input: 'x/C', output: '\x03x\x03/C'},
		{input: '/E', output: '\x03\x03/E'},
	]

	it("jazz chords", function() {
		extractChords(abcJazzChords, expectedJazzChords);
	})
})

function extractChords(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc);
	var line = visualObj[0].lines[0];
	var staff = line.staff[0];
	var voice = staff.voices[0];
	var chords = [];
	for (var i = 0; i < voice.length; i++) {
		var el = voice[i];
		if (el.chord) {
			var output = el.abselem.extra[0]
			chords.push({input: el.chord[0].name, output: output.c})
		}
	}
	//console.log(chords)
	chai.assert.equal(chords.length, expected.length, "wrong number of chords");
	for (i = 0; i < chords.length; i++) {
		chai.assert.equal(chords[i].input, expected[i].input, i + ": Inputs different");
		chai.assert.equal(chords[i].output, expected[i].output, i + ": Outputs different");
	}
}

