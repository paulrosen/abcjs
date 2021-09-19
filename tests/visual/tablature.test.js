describe("Tablature", function () {
	var violinAllNotes = "L:1/4\nM:4/4\nG,^G,A,^A,|B,^B,C^C|D^DE^E|F^FG^G|\n" +
		"A^AB^B|c^cd^d|e^ef^f|g^ga^a|\n" +
		"b^bc'^c'|d'^d'e'^e'|f'^f'g'^g'|_A,_B,_C_D|\n" +
		"_E_F_G_A|_B_c_d_e|_f_g_a_b|_c'_d'_e'_f'|";

	var violinAllNotesOutput = [
		// line 0
		[
			{ "el_type": "note", "startChar": 12, "endChar": 14, "notes": [{ "num": 0, "str": 3, "pitch": "G," }] },
			{ "el_type": "note", "startChar": 14, "endChar": 17, "notes": [{ "num": 1, "str": 3, "pitch": "^G," }] },
			{ "el_type": "note", "startChar": 17, "endChar": 19, "notes": [{ "num": 2, "str": 3, "pitch": "A," }] },
			{ "el_type": "note", "startChar": 19, "endChar": 22, "notes": [{ "num": 3, "str": 3, "pitch": "^A," }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 23, "startChar": 22 },
			{ "el_type": "note", "startChar": 23, "endChar": 25, "notes": [{ "num": 4, "str": 3, "pitch": "B," }] },
			{ "el_type": "note", "startChar": 25, "endChar": 28, "notes": [{ "num": 5, "str": 3, "pitch": "^B," }] },
			{ "el_type": "note", "startChar": 28, "endChar": 29, "notes": [{ "num": 5, "str": 3, "pitch": "C" }] },
			{ "el_type": "note", "startChar": 29, "endChar": 31, "notes": [{ "num": 6, "str": 3, "pitch": "^C" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 32, "startChar": 31 },
			{ "el_type": "note", "startChar": 32, "endChar": 33, "notes": [{ "num": 0, "str": 2, "pitch": "D" }] },
			{ "el_type": "note", "startChar": 33, "endChar": 35, "notes": [{ "num": 1, "str": 2, "pitch": "^D" }] },
			{ "el_type": "note", "startChar": 35, "endChar": 36, "notes": [{ "num": 2, "str": 2, "pitch": "E" }] },
			{ "el_type": "note", "startChar": 36, "endChar": 38, "notes": [{ "num": 3, "str": 2, "pitch": "^E" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 39, "startChar": 38 },
			{ "el_type": "note", "startChar": 39, "endChar": 40, "notes": [{ "num": 3, "str": 2, "pitch": "F" }] },
			{ "el_type": "note", "startChar": 40, "endChar": 42, "notes": [{ "num": 4, "str": 2, "pitch": "^F" }] },
			{ "el_type": "note", "startChar": 42, "endChar": 43, "notes": [{ "num": 5, "str": 2, "pitch": "G" }] },
			{ "el_type": "note", "startChar": 43, "endChar": 45, "notes": [{ "num": 6, "str": 2, "pitch": "^G" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 46, "startChar": 45 }
		],
		// line 1
		[
			{ "el_type": "note", "startChar": 47, "endChar": 48, "notes": [{ "num": 0, "str": 1, "pitch": "A" }] },
			{ "el_type": "note", "startChar": 48, "endChar": 50, "notes": [{ "num": 1, "str": 1, "pitch": "^A" }] },
			{ "el_type": "note", "startChar": 50, "endChar": 51, "notes": [{ "num": 2, "str": 1, "pitch": "B" }] },
			{ "el_type": "note", "startChar": 51, "endChar": 53, "notes": [{ "num": 3, "str": 1, "pitch": "^B" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 54, "startChar": 53 },
			{ "el_type": "note", "startChar": 54, "endChar": 55, "notes": [{ "num": 3, "str": 1, "pitch": "c" }] },
			{ "el_type": "note", "startChar": 55, "endChar": 57, "notes": [{ "num": 4, "str": 1, "pitch": "^c" }] },
			{ "el_type": "note", "startChar": 57, "endChar": 58, "notes": [{ "num": 5, "str": 1, "pitch": "d" }] },
			{ "el_type": "note", "startChar": 58, "endChar": 60, "notes": [{ "num": 6, "str": 1, "pitch": "^d" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 61, "startChar": 60 },
			{ "el_type": "note", "startChar": 61, "endChar": 62, "notes": [{ "num": 0, "str": 0, "pitch": "e" }] },
			{ "el_type": "note", "startChar": 62, "endChar": 64, "notes": [{ "num": 1, "str": 0, "pitch": "^e" }] },
			{ "el_type": "note", "startChar": 64, "endChar": 65, "notes": [{ "num": 1, "str": 0, "pitch": "f" }] },
			{ "el_type": "note", "startChar": 65, "endChar": 67, "notes": [{ "num": 2, "str": 0, "pitch": "^f" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 68, "startChar": 67 },
			{ "el_type": "note", "startChar": 68, "endChar": 69, "notes": [{ "num": 3, "str": 0, "pitch": "g" }] },
			{ "el_type": "note", "startChar": 69, "endChar": 71, "notes": [{ "num": 4, "str": 0, "pitch": "^g" }] },
			{ "el_type": "note", "startChar": 71, "endChar": 72, "notes": [{ "num": 5, "str": 0, "pitch": "a" }] },
			{ "el_type": "note", "startChar": 72, "endChar": 74, "notes": [{ "num": 6, "str": 0, "pitch": "^a" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 75, "startChar": 74 }
		],
		// line 2
		[
			{ "el_type": "note", "startChar": 76, "endChar": 77, "notes": [{ "num": 7, "str": 0, "pitch": "b" }] },
			{ "el_type": "note", "startChar": 77, "endChar": 79, "notes": [{ "num": 8, "str": 0, "pitch": "^b" }] },
			{ "el_type": "note", "startChar": 79, "endChar": 81, "notes": [{ "num": 8, "str": 0, "pitch": "c'" }] },
			{ "el_type": "note", "startChar": 81, "endChar": 84, "notes": [{ "num": 9, "str": 0, "pitch": "^c'" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 85, "startChar": 84 },
			{ "el_type": "note", "startChar": 85, "endChar": 87, "notes": [{ "num": 10, "str": 0, "pitch": "d'" }] },
			{ "el_type": "note", "startChar": 87, "endChar": 90, "notes": [{ "num": 11, "str": 0, "pitch": "^d'" }] },
			{ "el_type": "note", "startChar": 90, "endChar": 92, "notes": [{ "num": 12, "str": 0, "pitch": "e'" }] },
			{ "el_type": "note", "startChar": 92, "endChar": 95, "notes": [{ "num": 13, "str": 0, "pitch": "^e'" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 96, "startChar": 95 },
			{ "el_type": "note", "startChar": 96, "endChar": 98, "notes": [{ "num": 13, "str": 0, "pitch": "f'" }] },
			{ "el_type": "note", "startChar": 98, "endChar": 101, "notes": [{ "num": 14, "str": 0, "pitch": "^f'" }] },
			{ "el_type": "note", "startChar": 101, "endChar": 103, "notes": [{ "num": 15, "str": 0, "pitch": "g'" }] },
			{ "el_type": "note", "startChar": 103, "endChar": 106, "notes": [{ "num": 16, "str": 0, "pitch": "^g'" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 107, "startChar": 106 },
			{ "el_type": "note", "startChar": 107, "endChar": 110, "notes": [{ "num": 1, "str": 3, "pitch": "_A," }] },
			{ "el_type": "note", "startChar": 110, "endChar": 113, "notes": [{ "num": 3, "str": 3, "pitch": "_B," }] },
			{ "el_type": "note", "startChar": 113, "endChar": 115, "notes": [{ "num": 4, "str": 3, "pitch": "_C" }] },
			{ "el_type": "note", "startChar": 115, "endChar": 117, "notes": [{ "num": 6, "str": 3, "pitch": "_D" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 118, "startChar": 117 },
		],
		// line 3
		[
			{ "el_type": "note", "startChar": 119, "endChar": 121, "notes": [{ "num": 1, "str": 2, "pitch": "_E" }] },
			{ "el_type": "note", "startChar": 121, "endChar": 123, "notes": [{ "num": 2, "str": 2, "pitch": "_F" }] },
			{ "el_type": "note", "startChar": 123, "endChar": 125, "notes": [{ "num": 4, "str": 2, "pitch": "_G" }] },
			{ "el_type": "note", "startChar": 125, "endChar": 127, "notes": [{ "num": 6, "str": 2, "pitch": "_A" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 128, "startChar": 127 },
			{ "el_type": "note", "startChar": 128, "endChar": 130, "notes": [{ "num": 1, "str": 1, "pitch": "_B" }] },
			{ "el_type": "note", "startChar": 130, "endChar": 132, "notes": [{ "num": 2, "str": 1, "pitch": "_c" }] },
			{ "el_type": "note", "startChar": 132, "endChar": 134, "notes": [{ "num": 4, "str": 1, "pitch": "_d" }] },
			{ "el_type": "note", "startChar": 134, "endChar": 136, "notes": [{ "num": 6, "str": 1, "pitch": "_e" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 137, "startChar": 136 },
			{ "el_type": "note", "startChar": 137, "endChar": 139, "notes": [{ "num": 0, "str": 0, "pitch": "_f" }] },
			{ "el_type": "note", "startChar": 139, "endChar": 141, "notes": [{ "num": 2, "str": 0, "pitch": "_g" }] },
			{ "el_type": "note", "startChar": 141, "endChar": 143, "notes": [{ "num": 4, "str": 0, "pitch": "_a" }] },
			{ "el_type": "note", "startChar": 143, "endChar": 145, "notes": [{ "num": 6, "str": 0, "pitch": "_b" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 146, "startChar": 145 },
			{ "el_type": "note", "startChar": 146, "endChar": 149, "notes": [{ "num": 7, "str": 0, "pitch": "_c'" }] },
			{ "el_type": "note", "startChar": 149, "endChar": 152, "notes": [{ "num": 9, "str": 0, "pitch": "_d'" }] },
			{ "el_type": "note", "startChar": 152, "endChar": 155, "notes": [{ "num": 11, "str": 0, "pitch": "_e'" }] },
			{ "el_type": "note", "startChar": 155, "endChar": 158, "notes": [{ "num": 12, "str": 0, "pitch": "_f'" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 159, "startChar": 158 },
		],
	];

	var violinParams = [[
		"ViolinTab",
		{
			name: 'Violin',
			tuning: ['G,', 'D', 'A', 'e']
		}
	]];

	it("accidentals", function () {
		doTest(violinAllNotes, violinAllNotesOutput, violinParams);
	});
});

function doTest(abc, expected, params) {
	var visualObj = abcjs.renderAbc("paper", abc, { add_classes: true, tablatures: params });
	for (var i = 0; i < visualObj[0].lines.length; i++) {
		var line = visualObj[0].lines[i];
		var info = line.staffGroup.voices[1].tabNameInfos;
		var tab = line.staff[1].voices;
		//console.log(JSON.stringify(tab))
		for (var j = 0; j < tab.length; j++) {
			var el = tab[j];
			var msg = "\nrcv: " + JSON.stringify(el) + "\n" +
				"exp: " + JSON.stringify(expected[i][j]) + "\n";
			chai.assert.deepStrictEqual(el, expected[i][j], msg);
		}
	}
}