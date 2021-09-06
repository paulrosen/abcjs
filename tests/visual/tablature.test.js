describe("Tablature", function() {
	var violinAllNotes = "L:1/4\nM:4/4\nG,^G,A,^A,|B,^B,C^C|D^DE^E|F^FG^G|\n" +
		"A^AB^B|c^cd^d|e^ef^f|g^ga^a|\n" +
		"b^bc'^c'|d'^d'e'^e'|f'^f'g'^g'|_A,_B,_C_D|\n" +
		"_E_F_G_A|_B_c_d_e|_f_g_a_b|_c'_d'_e'_f'|";

	var violinAllNotesOutput = [
		// line 0
		[
			{ text: "0", x: 70.85, y: 135.74, classes: "abcjs-text abcjs-l0 abcjs-v0"} // TODO-PER: this is a made up format, but it might be close to what makes sense.
		],
		// line 1
		[

		],
		// line 2
		[

		],
		// line 3
		[

		],
	]

	var violinParams = [[
		"ViolinTab" ,
		{
			name : 'Violin' ,
			tuning : ['G,', 'D', 'A' , 'e']
		}
	]];

	it("accidentals", function() {
		doTest(violinAllNotes, violinAllNotesOutput, violinParams)
	})
})

function doTest(abc, expected, params) {
	var visualObj = abcjs.renderAbc("paper", abc, { add_classes: true, tablatures: params});
	console.log(visualObj[0].lines)
	for (var i = 0; i < visualObj[0].lines.length; i++) {
		var line = visualObj[0].lines[i];
		for (var j = 0; j < line.staff[0].voices[0].length; j++) { // TODO-PER: this should be staff[1] to get the tab output
			var el = line.staff[0].voices[0][j];
			var msg = "\nrcv: " + JSON.stringify(el.pitches) + "\n" + // TODO-PER: get the real data here
				"exp: " + JSON.stringify(expected[i][j]) + "\n";
			chai.assert.deepStrictEqual(el.pitches, expected[i][j], msg);
		}
	}
}
