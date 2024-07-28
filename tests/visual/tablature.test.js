function replacer(key, value) {
	// Filtering out properties
	if (key === 'abselem') {
		return 'abselem';
	}
	return value;
}

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

	var violinOutOfRange = "L:1/4\nM:4/4\nF,^F,G,e'''|\n";

	var violinOutOfRangeOutput = [
		[
			{ "el_type": "note", "startChar": 12, "endChar": 14, "notes": [{ "num": "?", "str": 3, "pitch": "F," }] },
			{ "el_type": "note", "startChar": 14, "endChar": 17, "notes": [{ "num": "?", "str": 3, "pitch": "^F," }] },
			{ "el_type": "note", "startChar": 17, "endChar": 19, "notes": [{ "num": 0, "str": 3, "pitch": "G," }] },
			{ "el_type": "note", "startChar": 19, "endChar": 23, "notes": [{ "num": 36, "str": 0, "pitch": "e'''" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 24, "startChar": 23 }
		]
	];

	var violinKeySigs = "L:1/4\nM:4/4\nK:Ab\nA,B,CD|EFGA| [K:B] A,B,CD|EFGA|\n";

	var violinKeySigsOutput = [
		[
			{ "el_type": "note", "startChar": 17, "endChar": 19, "notes": [{ "num": 1, "str": 3, "pitch": "_A," }] },
			{ "el_type": "note", "startChar": 19, "endChar": 21, "notes": [{ "num": 3, "str": 3, "pitch": "_B," }] },
			{ "el_type": "note", "startChar": 21, "endChar": 22, "notes": [{ "num": 5, "str": 3, "pitch": "C" }] },
			{ "el_type": "note", "startChar": 22, "endChar": 23, "notes": [{ "num": 6, "str": 3, "pitch": "_D" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 24, "startChar": 23 },
			{ "el_type": "note", "startChar": 24, "endChar": 25, "notes": [{ "num": 1, "str": 2, "pitch": "_E" }] },
			{ "el_type": "note", "startChar": 25, "endChar": 26, "notes": [{ "num": 3, "str": 2, "pitch": "F" }] }
			,
			{ "el_type": "note", "startChar": 26, "endChar": 27, "notes": [{ "num": 5, "str": 2, "pitch": "G" }] },
			{ "el_type": "note", "startChar": 27, "endChar": 28, "notes": [{ "num": 6, "str": 2, "pitch": "_A" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 29, "startChar": 28 },
			{ "el_type": "note", "startChar": 35, "endChar": 38, "notes": [{ "num": 3, "str": 3, "pitch": "^A," }] },
			{ "el_type": "note", "startChar": 38, "endChar": 40, "notes": [{ "num": 4, "str": 3, "pitch": "B," }] },
			{ "el_type": "note", "startChar": 40, "endChar": 41, "notes": [{ "num": 6, "str": 3, "pitch": "^C" }] },
			{ "el_type": "note", "startChar": 41, "endChar": 42, "notes": [{ "num": 1, "str": 2, "pitch": "^D" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 43, "startChar": 42 },
			{ "el_type": "note", "startChar": 43, "endChar": 44, "notes": [{ "num": 2, "str": 2, "pitch": "E" }] },
			{ "el_type": "note", "startChar": 44, "endChar": 45, "notes": [{ "num": 4, "str": 2, "pitch": "^F" }] },
			{ "el_type": "note", "startChar": 45, "endChar": 46, "notes": [{ "num": 6, "str": 2, "pitch": "^G" }] },
			{ "el_type": "note", "startChar": 46, "endChar": 47, "notes": [{ "num": 1, "str": 1, "pitch": "^A" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 48, "startChar": 47 }
		]
	];

	var violinCrossTune = "L:1/4\nM:4/4\nK:A\nA,B,CD|EFGA|Bcde|fgab|\n";

	var violinCrossTuneOutput = [
		[
			{ "el_type": "note", "startChar": 16, "endChar": 18, "notes": [{ "num": 0, "str": 3, "pitch": "A," }] },
			{ "el_type": "note", "startChar": 18, "endChar": 20, "notes": [{ "num": 2, "str": 3, "pitch": "B," }] },
			{ "el_type": "note", "startChar": 20, "endChar": 21, "notes": [{ "num": 4, "str": 3, "pitch": "^C" }] },
			{ "el_type": "note", "startChar": 21, "endChar": 22, "notes": [{ "num": 5, "str": 3, "pitch": "D" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 23, "startChar": 22 },
			{ "el_type": "note", "startChar": 23, "endChar": 24, "notes": [{ "num": 0, "str": 2, "pitch": "E" }] },
			{ "el_type": "note", "startChar": 24, "endChar": 25, "notes": [{ "num": 2, "str": 2, "pitch": "^F" }] },
			{ "el_type": "note", "startChar": 25, "endChar": 26, "notes": [{ "num": 4, "str": 2, "pitch": "^G" }] },
			{ "el_type": "note", "startChar": 26, "endChar": 27, "notes": [{ "num": 0, "str": 1, "pitch": "A" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 28, "startChar": 27 },
			{ "el_type": "note", "startChar": 28, "endChar": 29, "notes": [{ "num": 2, "str": 1, "pitch": "B" }] },
			{ "el_type": "note", "startChar": 29, "endChar": 30, "notes": [{ "num": 4, "str": 1, "pitch": "^c" }] },
			{ "el_type": "note", "startChar": 30, "endChar": 31, "notes": [{ "num": 5, "str": 1, "pitch": "d" }] },
			{ "el_type": "note", "startChar": 31, "endChar": 32, "notes": [{ "num": 0, "str": 0, "pitch": "e" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 33, "startChar": 32 },
			{ "el_type": "note", "startChar": 33, "endChar": 34, "notes": [{ "num": 2, "str": 0, "pitch": "^f" }] },
			{ "el_type": "note", "startChar": 34, "endChar": 35, "notes": [{ "num": 4, "str": 0, "pitch": "^g" }] },
			{ "el_type": "note", "startChar": 35, "endChar": 36, "notes": [{ "num": 5, "str": 0, "pitch": "a" }] },
			{ "el_type": "note", "startChar": 36, "endChar": 37, "notes": [{ "num": 7, "str": 0, "pitch": "b" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 38, "startChar": 37 }
		]
	];

	var violinDoubleStops = "L:1/4\nK:A\n[EE] [AA] [ee] [D^F] [E^G] [F^G] [Ac] [gb] |\n";

	var violinDoubleStopsOutput = [
		[
			{
				"el_type": "note", "startChar": 10, "endChar": 15, "notes": [{ "num": 7, "str": 3, "pitch": "E" },
				{ "num": 0, "str": 2, "pitch": "E" }]
			},
			{
				"el_type": "note", "startChar": 15, "endChar": 20, "notes": [{ "num": 5, "str": 2, "pitch": "A" },
				{ "num": 0, "str": 1, "pitch": "A" }]
			},
			{
				"el_type": "note", "startChar": 20, "endChar": 25, "notes": [{ "num": 7, "str": 1, "pitch": "e" },
				{ "num": 0, "str": 0, "pitch": "e" }]
			},
			{
				"el_type": "note", "startChar": 25, "endChar": 31, "notes": [{ "num": 5, "str": 3, "pitch": "D" },
				{ "num": 2, "str": 2, "pitch": "^F" }]
			},
			{
				"el_type": "note", "startChar": 31, "endChar": 37, "notes": [{ "num": 7, "str": 3, "pitch": "E" },
				{ "num": 4, "str": 2, "pitch": "^G" }]
			},
			{
				"el_type": "note", "startChar": 37, "endChar": 43, "notes": [{ "num": 9, "str": 3, "pitch": "F" },
				{ "num": 4, "str": 2, "pitch": "^G" }]
			},
			{
				"el_type": "note", "startChar": 43, "endChar": 48, "notes": [{ "num": 5, "str": 2, "pitch": "A" },
				{ "num": 4, "str": 1, "pitch": "^c" }]
			},
			{
				"el_type": "note", "startChar": 48, "endChar": 53, "notes": [{ "num": 11, "str": 1, "pitch": "g" },
				{ "num": 7, "str": 0, "pitch": "b" }]
			},
			{ "el_type": "bar", "type": "bar_thin", "endChar": 54, "startChar": 53 }
		]
	];

	var transposeDoubleStopsOutput = [
		[
			{
				"el_type": "note", "startChar": 10, "endChar": 15, "notes": [{ "num": 9, "str": 3, "pitch": "^F" },
				{ "num": 2, "str": 2, "pitch": "^F" }]
			},
			{
				"el_type": "note", "startChar": 15, "endChar": 20, "notes": [{ "num": 7, "str": 2, "pitch": "B" },
				{ "num": 2, "str": 1, "pitch": "B" }]
			},
			{
				"el_type": "note", "startChar": 20, "endChar": 25, "notes": [{ "num": 9, "str": 1, "pitch": "^f" },
				{ "num": 2, "str": 0, "pitch": "^f" }]
			},
			{
				"el_type": "note", "startChar": 25, "endChar": 31, "notes": [{ "num": 7, "str": 3, "pitch": "E" },
				{ "num": 4, "str": 2, "pitch": "^G" }]
			},
			{
				"el_type": "note", "startChar": 31, "endChar": 37, "notes": [{ "num": 2, "str": 2, "pitch": "^F" },
				{ "num": 1, "str": 1, "pitch": "^A" }]
			},
			{
				"el_type": "note", "startChar": 37, "endChar": 43, "notes": [{ "num": 4, "str": 2, "pitch": "G" },
				{ "num": 1, "str": 1, "pitch": "^A" }]
			},
			{
				"el_type": "note", "startChar": 43, "endChar": 48, "notes": [{ "num": 7, "str": 2, "pitch": "B" },
				{ "num": 6, "str": 1, "pitch": "^d" }]
			},
			{
				"el_type": "note", "startChar": 48, "endChar": 53, "notes": [{ "num": 13, "str": 1, "pitch": "a" },
				{ "num": 9, "str": 0, "pitch": "^c'" }]
			},
			{ "el_type": "bar", "type": "bar_thin", "endChar": 54, "startChar": 53 }
		]
	];

	var violinUnusualAccidentals = "L:1/4\nK:C\n^/G ^^A __B _/c|\n";

	var violinUnusualAccidentalsOutput = [
		[
			{ "el_type": "note", "startChar": 10, "endChar": 14, "notes": [{ "num": "5^", "str": 2, "pitch": "^/G" }] },
			{ "el_type": "note", "startChar": 14, "endChar": 18, "notes": [{ "num": 2, "str": 1, "pitch": "^^A" }] },
			{ "el_type": "note", "startChar": 18, "endChar": 22, "notes": [{ "num": 0, "str": 1, "pitch": "__B" }] },
			{ "el_type": "note", "startChar": 22, "endChar": 25, "notes": [{ "num": "3v", "str": 1, "pitch": "_/c" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 26, "startChar": 25 }
		]
	];

	var guitarCapo = "M: 2/4\n" +
		"K:F\n" +
		"|: [EE,]^FGA [B2B,]BA | [G2A,]^FE [B,B]^cBA | [G2A,]^FE [B,4^FB]:| \n";

	var guitarCapoOutput = [
		[
			{ "el_type": "bar", "type": "bar_left_repeat", "endChar": 13, "startChar": 11 },
			{ "el_type": "note", "startChar": 13, "endChar": 19, "notes": [{ "num": 0, "str": 5, "pitch": "E," }, { "num": 0, "str": 3, "pitch": "E" }] },
			{ "el_type": "note", "startChar": 19, "endChar": 21, "notes": [{ "num": 2, "str": 3, "pitch": "^F" }] },
			{ "el_type": "note", "startChar": 21, "endChar": 22, "notes": [{ "num": 3, "str": 3, "pitch": "G" }] },
			{ "el_type": "note", "startChar": 22, "endChar": 24, "notes": [{ "num": 0, "str": 2, "pitch": "A" }] },
			{ "el_type": "note", "startChar": 24, "endChar": 30, "notes": [{ "num": 6, "str": 5, "pitch": "_B," }, { "num": 1, "str": 2, "pitch": "_B" }] },
			{ "el_type": "note", "startChar": 30, "endChar": 31, "notes": [{ "num": 1, "str": 2, "pitch": "_B" }] },
			{ "el_type": "note", "startChar": 31, "endChar": 33, "notes": [{ "num": 0, "str": 2, "pitch": "A" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 34, "startChar": 33 },
			{ "el_type": "note", "startChar": 34, "endChar": 41, "notes": [{ "num": 5, "str": 5, "pitch": "A," }, { "num": 3, "str": 3, "pitch": "G" }] },
			{ "el_type": "note", "startChar": 41, "endChar": 43, "notes": [{ "num": 2, "str": 3, "pitch": "^F" }] },
			{ "el_type": "note", "startChar": 43, "endChar": 45, "notes": [{ "num": 0, "str": 3, "pitch": "E" }] },
			{ "el_type": "note", "startChar": 45, "endChar": 50, "notes": [{ "num": 6, "str": 5, "pitch": "_B," }, { "num": 1, "str": 2, "pitch": "_B" }] },
			{ "el_type": "note", "startChar": 50, "endChar": 52, "notes": [{ "num": 2, "str": 1, "pitch": "^c" }] },
			{ "el_type": "note", "startChar": 52, "endChar": 53, "notes": [{ "num": 1, "str": 2, "pitch": "_B" }] },
			{ "el_type": "note", "startChar": 53, "endChar": 55, "notes": [{ "num": 0, "str": 2, "pitch": "A" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 56, "startChar": 55 },
			{ "el_type": "note", "startChar": 56, "endChar": 63, "notes": [{ "num": 5, "str": 5, "pitch": "A," }, { "num": 3, "str": 3, "pitch": "G" }] },
			{ "el_type": "note", "startChar": 63, "endChar": 65, "notes": [{ "num": 2, "str": 3, "pitch": "^F" }] },
			{ "el_type": "note", "startChar": 65, "endChar": 67, "notes": [{ "num": 0, "str": 3, "pitch": "E" }] },
			{ "el_type": "note", "startChar": 67, "endChar": 75, "notes": [{ "num": 6, "str": 5, "pitch": "_B," }, { "num": 2, "str": 3, "pitch": "^F" }, { "num": 1, "str": 2, "pitch": "_B" }] },
			{ "el_type": "bar", "type": "bar_right_repeat", "endChar": 77, "startChar": 75 }]
	];

	var twoVoices = "%%score (1 2)\n" +
		"M: 4/4\n" +
		"L: 1/8\n" +
		"K: Em\n" +
		"V:1\n" +
		"d|BGDg|\n" +
		"V:2\n" +
		"G|ABAB|";

	var twoVoicesOutput = [
		[
			{ "el_type": "note", "startChar": 38, "endChar": 39, "notes": [{ "num": 5, "str": 1, "pitch": "d" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 40, "startChar": 39 },
			{ "el_type": "note", "startChar": 40, "endChar": 41, "notes": [{ "num": 2, "str": 1, "pitch": "B" }] },
			{ "el_type": "note", "startChar": 41, "endChar": 42, "notes": [{ "num": 5, "str": 2, "pitch": "G" }] },
			{ "el_type": "note", "startChar": 42, "endChar": 43, "notes": [{ "num": 0, "str": 2, "pitch": "D" }] },
			{ "el_type": "note", "startChar": 43, "endChar": 44, "notes": [{ "num": 3, "str": 0, "pitch": "g" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 45, "startChar": 44 },
		],[
			{ "el_type": "note", "startChar": 50, "endChar": 51, "notes": [{ "num": 5, "str": 2, "pitch": "G" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 52, "startChar": 51 },
			{ "el_type": "note", "startChar": 52, "endChar": 53, "notes": [{ "num": 0, "str": 1, "pitch": "A" }] },
			{ "el_type": "note", "startChar": 53, "endChar": 54, "notes": [{ "num": 2, "str": 1, "pitch": "B" }] },
			{ "el_type": "note", "startChar": 54, "endChar": 55, "notes": [{ "num": 0, "str": 1, "pitch": "A" }] },
			{ "el_type": "note", "startChar": 55, "endChar": 56, "notes": [{ "num": 2, "str": 1, "pitch": "B" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 57, "startChar": 56 },
		],
	];

	var twoStaves = "%%score 1|2\n" +
		"M: 4/4\n" +
		"L: 1/8\n" +
		"K: Em\n" +
		"V:1\n" +
		"d|BGDg|\n" +
		"V:2\n" +
		"G|ABAB|";

	var twoStavesOutput = [
		[
			{ "el_type": "note", "startChar": 36, "endChar": 37, "notes": [{ "num": 5, "str": 1, "pitch": "d" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 38, "startChar": 37 },
			{ "el_type": "note", "startChar": 38, "endChar": 39, "notes": [{ "num": 2, "str": 1, "pitch": "B" }] },
			{ "el_type": "note", "startChar": 39, "endChar": 40, "notes": [{ "num": 5, "str": 2, "pitch": "G" }] },
			{ "el_type": "note", "startChar": 40, "endChar": 41, "notes": [{ "num": 0, "str": 2, "pitch": "D" }] },
			{ "el_type": "note", "startChar": 41, "endChar": 42, "notes": [{ "num": 3, "str": 0, "pitch": "g" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 43, "startChar": 42 },
		],
		[
			{ "el_type": "note", "startChar": 48, "endChar": 49, "notes": [{ "num": 3, "str": 3, "pitch": "G" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 50, "startChar": 49 },
			{ "el_type": "note", "startChar": 50, "endChar": 51, "notes": [{ "num": 0, "str": 2, "pitch": "A" }] },
			{ "el_type": "note", "startChar": 51, "endChar": 52, "notes": [{ "num": 0, "str": 1, "pitch": "B" }] },
			{ "el_type": "note", "startChar": 52, "endChar": 53, "notes": [{ "num": 0, "str": 2, "pitch": "A" }] },
			{ "el_type": "note", "startChar": 53, "endChar": 54, "notes": [{ "num": 0, "str": 1, "pitch": "B" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 55, "startChar": 54 },
		],
	];

	var skipStaff = "%%score 1|2|3\n" +
		"M: 4/4\n" +
		"L: 1/8\n" +
		"K: Em\n" +
		"V:1\n" +
		"d|BGDg|\n" +
		"V:2\n" +
		"G|ABAB|\n" +
		"V:3\n" +
		"G,|A,B,CD|";

	var skipStaffOutput = [
		[
			{ "el_type": "note", "startChar": 50, "endChar": 51, "notes": [{ "num": 5, "str": 2, "pitch": "G" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 52, "startChar": 51 },
			{ "el_type": "note", "startChar": 52, "endChar": 53, "notes": [{ "num": 0, "str": 1, "pitch": "A" }] },
			{ "el_type": "note", "startChar": 53, "endChar": 54, "notes": [{ "num": 2, "str": 1, "pitch": "B" }] },
			{ "el_type": "note", "startChar": 54, "endChar": 55, "notes": [{ "num": 0, "str": 1, "pitch": "A" }] },
			{ "el_type": "note", "startChar": 55, "endChar": 56, "notes": [{ "num": 2, "str": 1, "pitch": "B" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 57, "startChar": 56 },
		],
	];
	var skipStaffParams = [
		{ instrument: ""},
		{
			instrument: 'violin',
		}
	];

	var guitarParams = [
		{
			instrument: 'guitar',
			label : 'Guitar (%T)',
			tuning: ['D,', 'A,', 'D', 'G', 'A', 'd'],
			capo: 2
		}
	];

	var accidentalParams = [
		{
			instrument: 'guitar',
			label : 'Accidentals (%T)',
			tuning: ['^D,', '_A,', '_D', '^G', '_B', '^d'],
		}
	];

	var badTuningParams = [
		{
			instrument: 'guitar',
			label : 'Guitar (%T)',
			tuning: ['D', 'A', 'D', 'G', 'A', 'd'],
		}
	];

	var violinParams = [
		{
			instrument: 'violin',
			label: 'Violin',
			tuning: ['G,', 'D', 'A', 'e']
		}
	];

	var firstStaffOnlyParams = [
		{
			instrument: 'violin',
			label: 'Violin',
			firstStaffOnly: true,
			tuning: ['G,', 'D', 'A', 'e']
		}
	];

	var violinGuitarParams = [
		// first 
   		{
			instrument: 'violin',
			label: 'Violin',
			tuning: ['G,', 'D', 'A', 'e']
		},
		// second
		{
			instrument: 'guitar',
			label: 'Guitar (%T)',
			tuning: ['D,', 'A,', 'D', 'G', 'A', 'd'],
			capo: 2
		},
		// additional lines to be ignored
		{
			instrument: 'violin',
			label: 'Violin2',
			tuning: ['G,', 'D', 'A', 'e']
		},
		{
			instrument: 'guitar',
			label: 'Guitar (%T)2',
			tuning: ['D,', 'A,', 'D', 'G', 'A', 'd'],
			capo: 2
		},
		{
			instrument: 'violin',
			label: 'Violin3',
			tuning: ['G,', 'D', 'A', 'e']
		},
		{
			instrument: 'guitar',
			label: 'Guitar (%T)3',
			tuning: ['D,', 'A,', 'D', 'G', 'A', 'd'],
			capo: 2
		},
	];

	var violinCrossTuneParams = [
		{
			instrument: 'violin',
			label: 'Violin (%T)',
			tuning: ['A,', 'E', 'A', 'e']
		}
	];

	var graceNotes = "M: 4/4\n" +
		"L: 1/4\n" +
		"K: C\n" +
		"{B}A {dB}G {ABcd efga}b|";

	var graceNotesOutput = [
		[
			{ "el_type": "note", "startChar": 19, "endChar": 24, "notes": [{ "num": 2, "str": 1, "pitch": "B" }], "grace": true },
			{ "el_type": "note", "startChar": 19, "endChar": 24, "notes": [{ "num": 0, "str": 1, "pitch": "A" }] },
			{ "el_type": "note", "startChar": 24, "endChar": 30, "notes": [{ "num": 5, "str": 1, "pitch": "d" }], "grace": true },
			{ "el_type": "note", "startChar": 24, "endChar": 30, "notes": [{ "num": 2, "str": 1, "pitch": "B" }], "grace": true },
			{ "el_type": "note", "startChar": 24, "endChar": 30, "notes": [{ "num": 5, "str": 2, "pitch": "G" }] },
			{ "el_type": "note", "startChar": 30, "endChar": 42, "notes": [{ "num": 0, "str": 1, "pitch": "A" }], "grace": true },
			{ "el_type": "note", "startChar": 30, "endChar": 42, "notes": [{ "num": 2, "str": 1, "pitch": "B" }], "grace": true },
			{ "el_type": "note", "startChar": 30, "endChar": 42, "notes": [{ "num": 3, "str": 1, "pitch": "c" }], "grace": true },
			{ "el_type": "note", "startChar": 30, "endChar": 42, "notes": [{ "num": 5, "str": 1, "pitch": "d" }], "grace": true },
			{ "el_type": "note", "startChar": 30, "endChar": 42, "notes": [{ "num": 0, "str": 0, "pitch": "e" }], "grace": true },
			{ "el_type": "note", "startChar": 30, "endChar": 42, "notes": [{ "num": 1, "str": 0, "pitch": "f" }], "grace": true },
			{ "el_type": "note", "startChar": 30, "endChar": 42, "notes": [{ "num": 3, "str": 0, "pitch": "g" }], "grace": true },
			{ "el_type": "note", "startChar": 30, "endChar": 42, "notes": [{ "num": 5, "str": 0, "pitch": "a" }], "grace": true },
			{ "el_type": "note", "startChar": 30, "endChar": 42, "notes": [{ "num": 7, "str": 0, "pitch": "b" }] },
			{ "el_type": "bar", "type": "bar_thin", "endChar": 43, "startChar": 42 }
		]
	];

	var warningRecovery = "X:1\n" +
		"K:C\n" +
		"Gr";

	var warningRecoveryOutput = [
		[
			{"el_type":"note","startChar":8,"endChar":9,"notes":[{"num":5,"str":2,"pitch":"G"}]}
		]
	]

	var liningUp = "X: 1\n" +
		"K:C\n" +
		'G>^FG>_A G2 "a very very long chord"D2| [CD] {fe}d|\n';

	var bracketPlacement = "X:5\n" +
		"L:1/8\n" +
		"%%staves {RH LH}\n" +
		"V: RH clef=treble\n" +
		"V: LH clef=bass\n" +
		"K:C\n" +
		"[V: RH]\n" +
		"|: c\n" +
		"[V: LH]\n" +
		"|: G,\n"

	var barNumbers = "X:1\n" +
		"%% barnumbers 1\n" +
		"K:C \n" +
		"F8|G8| \n" +
		"F8|!coda!G8|]"

	var barNumbersOutput = [
		[
			{"el_type":"note","startChar":25,"endChar":27,"notes":[{"num":3,"str":2,"pitch":"F"}]},
			{"el_type":"bar","type":"bar_thin","endChar":28,"startChar":27},
			{"el_type":"note","startChar":28,"endChar":30,"notes":[{"num":5,"str":2,"pitch":"G"}]},
			{"el_type":"bar","type":"bar_thin","endChar":31,"startChar":30},
		],
		[
			{"el_type":"note","startChar":33,"endChar":35,"notes":[{"num":3,"str":2,"pitch":"F"}]},
			{"el_type":"bar","type":"bar_thin","endChar":36,"startChar":35},
			{"el_type":"note","startChar":36,"endChar":44,"notes":[{"num":5,"str":2,"pitch":"G"}]},
			{"el_type":"bar","type":"bar_thin_thick","endChar":46,"startChar":44},
		]
	]

	var noExtraVertical = "X:1\n" +
		'"A7"A'

	var extraVertical = "X:1\n" +
		"Q:150\n" +
		"P:Verse\n" +
		'"A7"A'

	var bracketWidth = "X:1\n" +
		"%%staves {RH LH}\n" +
		"V:RH clef=treble\n" +
		"V:LH clef=bass\n" +
		"K:C\n" +
		"V:RH\n" +
		"ABc\n" +
		"V:LH\n" +
		"A,B,C"

	var subTitle = "X: 1\n" +
		"T: First\n" +
		"T: Second\n" +
		"M: C\n" +
		"K: F\n" +
		"A\n"

	var crashChord = "X: 1\n" +
		"M: 4/4\n" +
		"L: 1/4\n" +
		"K: Bm\n" +
		"[F,^G,]"

	var graceOnRest = "X:1\n" +
		"K:C\n" +
		"(f3 {a})y"

	var graceOnRestOutput = [
		[
			{"el_type":"note","startChar":8,"endChar":12,"notes":[{"num":1,"str":0,"pitch":"f"}]},
			{ "el_type": "note", "startChar": 12, "endChar": 17, "notes": [{ "num": 5, "str": 0, "pitch": "a" }], "grace": true },
		]
	]

	var tiedNote = "X:1\n" +
		"K:C\n" +
		"f-f"

	var tiedNoteOutput = [
		[
			{"el_type":"note","startChar":8,"endChar":10,"notes":[{"num":1,"str":0,"pitch":"f"}]}
		]
	]

	var percussionClef = "X:1\n" +
		"K:C clef=perc stafflines=1 \n" +
		"B"

	var overlay = "X:1\n" +
		"K:C\n" +
		"G8 & C4 D4|E4 F4|]"

	var overlayOutput = [
		[
			{"el_type":"note","startChar":8,"endChar":11,"notes":[{"num":5,"str":2,"pitch":"G"}]},
			{"el_type":"bar","type":"bar_thin","endChar":19,"startChar":18},
			{"el_type":"note","startChar":19,"endChar":22,"notes":[{"num":2,"str":2,"pitch":"E"}]},
			{"el_type":"note","startChar":22,"endChar":24,"notes":[{"num":3,"str":2,"pitch":"F"}]},
			{"el_type":"bar","type":"bar_thin_thick","endChar":26,"startChar":24},
		],
		[
			{"el_type":"note","startChar":12,"endChar":16,"notes":[{"num":5,"str":3,"pitch":"C"}]},
			{"el_type":"note","startChar":16,"endChar":18,"notes":[{"num":0,"str":2,"pitch":"D"}]},
			{"el_type":"bar","type":"bar_thin","endChar":19,"startChar":18},
			{"el_type":"bar","type":"bar_thin_thick","endChar":26,"startChar":24}
		],
	]

	var clefNone = "X: 1\n" +
		"K: clef=none\n" +
		"C |\n"

	var kitchenSink = "X:1\n" +
		"M:4/4\n" +
		"L:1/16\n" +
		"%%titlefont Times 22.0\n" +
		"%%partsfont box\n" +
		"%%barnumbers 1\n" +
		"T: all-element-types\n" +
		"T: Everything should be selectable\n" +
		"C: public domain\n" +
		"R: Hit it\n" +
		"A: Yours Truly\n" +
		"S: My own testing\n" +
		"W: Now is the time for all good men\n" +
		"W:\n" +
		"W: To come to the aid of their party.\n" +
		"H: This shows every type of thing that can possibly be drawn.\n" +
		"H:\n" +
		"H: And two lines of history!\n" +
		"Q: \"Easy Swing\" 1/4=140\n" +
		"P: AABB\n" +
		"%%staves {(PianoRightHand extra) (PianoLeftHand)}\n" +
		"V:PianoRightHand clef=treble+8 name=RH\n" +
		"V:PianoLeftHand clef=bass name=LH\n" +
		"K:Bb\n" +
		"P:A\n" +
		"%%text there is some random text\n" +
		"%%sep 0.4cm 0.4cm 6cm\n" +
		"[V: PianoRightHand] !mp![b8B8d8] f3g !//!f4|!<(![d12b12] !<)![b4g4]|z4  b^f_df (3B2d2c2 B4|1[Q:\"left\" 1/4=170\"right\"]!f![c4f4] z4 [b8d8]| (3[G8e8] Tu[c8f8] G8|]\n" +
		"w:Strang- ers\n" +
		"[V: extra] B,16 | \"Bb\"{C}B,4 ({^CD}B,4 =B,8) |\n" +
		"T:Inserted subtitle\n" +
		"[V: PianoLeftHand] B,6 .D2 !arpeggio![F,8F8A,8]|(B,2 B,,2 C,12)|\"^annotation\"F,16|[F,16D,16]|Z2|]\n"

	var kitchenSinkOutput = [
		429,
		786,
		580,
		657
	]

	var octaveClef = "X: 1\n" +
		"K: C treble-8\n" +
		" G, G | g g' |\n"

	var octaveClefOutput = [
		[
			{"el_type":"note","startChar":20,"endChar":23,"notes":[{"num":"?","str":3,"pitch":"G,,"}]},
			{"el_type":"note","startChar":23,"endChar":25,"notes":[{"num":0,"str":3,"pitch":"G,"}]},
			{"el_type":"bar","type":"bar_thin","endChar":26,"startChar":25},
			{"el_type":"note","startChar":26,"endChar":29,"notes":[{"num":5,"str":2,"pitch":"G"}]},
			{"el_type":"note","startChar":29,"endChar":32,"notes":[{"num":3,"str":0,"pitch":"g"}]},
			{"el_type":"bar","type":"bar_thin","endChar":33,"startChar":32}
		]
	]

	var unusualFontSize = "X:1\n" +
		"%%stretchlast\n" +
		"%%gchordfont Arial 10 box\n" +
		"L:1/4\n" +
		"K:C\n" +
		"|1\"Gbmaj7\"DEGB:|\n" +
		"%%gchordfont Arial 20 box\n" +
		"|1\"Gbmaj7\"DEGB:|\n" +
		"%%gchordfont Arial 40 box\n" +
		"|1\"Gbmaj7\"DEGB:|\n" +
		"%%gchordfont Arial 80 box\n" +
		"|1\"Gbmaj7\"DEGB:|\n" +
		"%%gchordfont Arial 130 box\n" +
		"|1\"Gbmaj7\"DEGB:|\n"

	var unusualFontSizeOutput = [
		72,
		138,
		269,
		335,
		505,
		571,
		823,
		889,
		1242,
		1308,
	]

	var weirdNoteConstruction = "X:1\n" +
		"K:C\n" +
		"a, B'"

	var weirdNoteConstructionOutput = [
		[
			{"el_type":"note","startChar":8,"endChar":11,"notes":[{"num":0,"str":1,"pitch":"A"}]},
			{"el_type":"note","startChar":11,"endChar":13,"notes":[{"num":7,"str":0,"pitch":"b"}]}
		]
	]

	// TODO-PER: Eventually the tablature should support strings being tuned out of order (like a uke or banjo)
	var badTuning = "X:1\n" +
		"K:C\n" +
		"D, A, D G B e"

	var staffPlacement = "X:1\n" +
		"%%score (1 | 2)\n" +
		"L:1/4\n" +
		"M:4/4\n" +
		"K:D\n" +
		"V:1\n" +
		"A G/F/ G A3/4 A/4 |\n" +
		"[|]1 F z z A :|\n" +
		"[|]2 F z A d [|] |\n" +
		"V:2\n" +
		"F E/D/ E F3/4 F/4 |\n" +
		"[|]1 D z z A :|\n" +
		"[|]2 D z F A [|] |\n"

	var staffPlacementOutput = [
		44,
		145,
		258,
		363,
		475,
		580
	]

	var accidentals2 = "X: 1\n" +
	"M: 4/4\n" +
	"L: 1/4\n" +
	"K: G\n" +
	"A2^A_A|F_F^F=F|F^E^^EE|G_GG=G|[K: Eb]A2=A2|\n"

	var accidentals2Output = [
		[
			{"el_type":"note","startChar":24,"endChar":26,"notes":[{"num":0,"str":1,"pitch":"A"}]},
			{"el_type":"note","startChar":26,"endChar":28,"notes":[{"num":1,"str":1,"pitch":"^A"}]},
			{"el_type":"note","startChar":28,"endChar":30,"notes":[{"num":6,"str":2,"pitch":"_A"}]},
			{"el_type":"bar","type":"bar_thin","endChar":31,"startChar":30},
			{"el_type":"note","startChar":31,"endChar":32,"notes":[{"num":4,"str":2,"pitch":"^F"}]},
			{"el_type":"note","startChar":32,"endChar":34,"notes":[{"num":2,"str":2,"pitch":"_F"}]},
			{"el_type":"note","startChar":34,"endChar":36,"notes":[{"num":4,"str":2,"pitch":"^F"}]},
			{"el_type":"note","startChar":36,"endChar":38,"notes":[{"num":3,"str":2,"pitch":"=F"}]},
			{"el_type":"bar","type":"bar_thin","endChar":39,"startChar":38},
			{"el_type":"note","startChar":39,"endChar":40,"notes":[{"num":4,"str":2,"pitch":"^F"}]},
			{"el_type":"note","startChar":40,"endChar":42,"notes":[{"num":3,"str":2,"pitch":"^E"}]},
			{"el_type":"note","startChar":42,"endChar":45,"notes":[{"num":4,"str":2,"pitch":"^^E"}]},
			{"el_type":"note","startChar":45,"endChar":46,"notes":[{"num":4,"str":2,"pitch":"E"}]},
			{"el_type":"bar","type":"bar_thin","endChar":47,"startChar":46},
			{"el_type":"note","startChar":47,"endChar":48,"notes":[{"num":5,"str":2,"pitch":"G"}]},
			{"el_type":"note","startChar":48,"endChar":50,"notes":[{"num":4,"str":2,"pitch":"_G"}]},
			{"el_type":"note","startChar":50,"endChar":51,"notes":[{"num":4,"str":2,"pitch":"G"}]},
			{"el_type":"note","startChar":51,"endChar":53,"notes":[{"num":5,"str":2,"pitch":"=G"}]},
			{"el_type":"bar","type":"bar_thin","endChar":54,"startChar":53},
			{"el_type":"note","startChar":61,"endChar":63,"notes":[{"num":6,"str":2,"pitch":"_A"}]},
			{"el_type":"note","startChar":63,"endChar":66,"notes":[{"num":0,"str":1,"pitch":"=A"}]},
			{"el_type":"bar","type":"bar_thin","endChar":67,"startChar":66},
		]
	]

	var accidentalsInDef = "X: 1\n" +
	"M: 4/4\n" +
	"L: 1/4\n" +
	"K: G\n" +
	"G,CEGda\n"

	var accidentalsInDefOutput = [
		[
			{"el_type":"note","startChar":24,"endChar":26,"notes":[{"num":4,"str":5,"pitch":"G,"}]},
			{"el_type":"note","startChar":26,"endChar":27,"notes":[{"num":4,"str":4,"pitch":"C"}]},
			{"el_type":"note","startChar":27,"endChar":28,"notes":[{"num":3,"str":3,"pitch":"E"}]},
			{"el_type":"note","startChar":28,"endChar":29,"notes":[{"num":6,"str":3,"pitch":"G"}]},
			{"el_type":"note","startChar":29,"endChar":30,"notes":[{"num":4,"str":1,"pitch":"d"}]},
			{"el_type":"note","startChar":30,"endChar":31,"notes":[{"num":6,"str":0,"pitch":"a"}]},
		]
	]

	var lyrics = "X: 1\n" +
		"M: 3/4\n" +
		"L: 1/4\n" +
		"K: G\n" +
		"GAB|\n" +
		"w: Tra la la\n" +
		"w: Tra la la\n"

	var lyricsOutput = [
		41,
		154,
	]

	var firstStaffOnly = "X:1\n" +
		"%%stretchlast\n" +
		"L:1/4\n" +
		"K:C\n" +
		"|:\"Gbmaj7\"DEGB:|\n" +
		"|:\"Gbmaj7\"DEGB:|\n" +
		"|:\"Gbmaj7\"DEGB:|\n" +
		"|:\"Gbmaj7\"DEGB:|\n" +
		"|:\"Gbmaj7\"DEGB:|\n"

	var firstStaffOnlyOutput1 = [
		62,
		128,
		238,
		304,
		413,
		479,
		589,
		655,
		764,
		830,
	]

	var firstStaffOnlyOutput2 = [
		62,
		128,
		238,
		304,
		392,
		458,
		547,
		612,
		701,
		767,
	]

	it("accidentals-in-def", function () {
		doStaffTest(accidentalsInDef, accidentalsInDefOutput, accidentalParams);
	});

	it("accidentals", function () {
		doStaffTest(violinAllNotes, violinAllNotesOutput, violinParams);
	});

	it("accidentals2", function () {
		doStaffTest(accidentals2, accidentals2Output, violinParams);
	});

	it("out of range", function () {
		doStaffTest(violinOutOfRange, violinOutOfRangeOutput, violinParams);
	});

	it("key sigs", function () {
		doStaffTest(violinKeySigs, violinKeySigsOutput, violinParams);
	});

	it("cross tune", function () {
		doStaffTest(violinCrossTune, violinCrossTuneOutput, violinCrossTuneParams);
	});

	it("double stops", function () {
		doStaffTest(violinDoubleStops, violinDoubleStopsOutput, violinCrossTuneParams);
	});

	it("unusual accidentals", function () {
		doStaffTest(violinUnusualAccidentals, violinUnusualAccidentalsOutput, violinParams);
	});
	
	it("capo", function () {
		doStaffTest(guitarCapo, guitarCapoOutput, guitarParams);
	});

	it("two voices", function () {
		doStaffTest(twoVoices, twoVoicesOutput, violinParams);
	});

	it("two staves", function () {
		doStaffTest(twoStaves, twoStavesOutput, violinGuitarParams);
	});

	it("skip staff", function () {
		doStaffTest(skipStaff, skipStaffOutput, skipStaffParams);
	});

	it("transpose", function () {
		doStaffTest(violinDoubleStops, transposeDoubleStopsOutput, violinCrossTuneParams, { visualTranspose: 2 });
	});

	it("grace notes", function () {
		doStaffTest(graceNotes, graceNotesOutput, violinParams);
	});

	it("warning recovery", function () {
		doStaffTest(warningRecovery, warningRecoveryOutput, violinParams);
	});

	it("more tabs than voices", function () {
		doStaffTest(warningRecovery, warningRecoveryOutput, violinGuitarParams);
	});

	it("grace-on-rest", function () {
		doStaffTest(graceOnRest, graceOnRestOutput, violinParams);
	});

	it("tied note", function () {
		doStaffTest(tiedNote, tiedNoteOutput, violinParams);
	});

	it("overlay", function () {
		doStaffTest(overlay, overlayOutput, violinParams);
	});

	it("octave clef", function () {
		doStaffTest(octaveClef, octaveClefOutput, violinParams);
	});

	it("font-size", function () {
		doVerticalTest(unusualFontSize, unusualFontSizeOutput, violinParams);
	});

	it("weird note construction", function () {
		doStaffTest(weirdNoteConstruction, weirdNoteConstructionOutput, violinParams);
	});

	it("staff-placement", function () {
		doVerticalTest(staffPlacement, staffPlacementOutput, violinParams);
	});

	it("fonts", function () {
		var params = {
			format: {
				tablabelfont: "Courier New",
				tabnumberfont: "cursive",
				tabgracefont: "serif"
			}
		}
		doRender(graceNotes, violinParams, params);
		var label = document.querySelector("#paper .abcjs-instrument-name")
		var number = document.querySelector("#paper .abcjs-tab-number")
		var grace = document.querySelector("#paper .abcjs-tab-grace")
		var labelFont = label.getAttribute("font-family")
		var numberFont = number.getAttribute("font-family")
		var graceFont = grace.getAttribute("font-family")
		chai.assert.equal(labelFont, params.format.tablabelfont, "Label font not set")
		chai.assert.equal(numberFont, params.format.tabnumberfont, "Number font not set")
		chai.assert.equal(graceFont, params.format.tabgracefont, "Grace font not set")
	});

	it("lining up", function () {
		var visualObj = doRender(liningUp, violinParams);
		var noteheads = document.querySelectorAll('path[data-name="G"],path[data-name="^F"],path[data-name="_A"],path[data-name="D"],path[data-name="C"],path[data-name="f"],path[data-name="e"],path[data-name="d"]')
		var i;
		for (i = 0; i < noteheads.length; i++) {
			var dim = noteheads[i].getBBox()
			var guide = document.createElementNS("http://www.w3.org/2000/svg", "line");
			guide.setAttribute("class", "abcjs-cursor");
			guide.setAttribute('x1', dim.x);
			guide.setAttribute('y1', dim.y);
			guide.setAttribute('x2', dim.x);
			guide.setAttribute('y2', dim.y+100);
			guide.setAttribute('stroke', "red");
			var svg = document.querySelector("#paper svg");
			svg.appendChild(guide);
			guide = document.createElementNS("http://www.w3.org/2000/svg", "line");
			guide.setAttribute("class", "abcjs-cursor");
			guide.setAttribute('x1', dim.x+dim.width);
			guide.setAttribute('y1', dim.y);
			guide.setAttribute('x2', dim.x+dim.width);
			guide.setAttribute('y2', dim.y+100);
			guide.setAttribute('stroke', "red");
			svg.appendChild(guide);
		}
		var dots = visualObj[0].lines[0].staff[0].voices[0];
		var tab = visualObj[0].lines[0].staff[1].voices[0];
		for (i = 0; i < dots.length; i++) {
			if (dots.el_type === "note") {
				var dot = dots[i];
				var number = tab[i];
				chai.assert.equal(Math.round(number.abselem.x), Math.round(dot.abselem.heads[0].x + dot.abselem.heads[0].w / 2), "Number not centered")
			}
		}
	});

	it("bar numbers", function () {
		function  checkForBarNumbers(el, line, element) {
			if (el.abselem.abcelem.type === 'bar_thin') {
				for (var i = 0; i < el.abselem.children.length; i++) {
					var relEl = el.abselem.children[i]
					if (relEl.type === "barNumber")
						chai.assert(false, "bar number found on line "+line+" element "+element)
				}
			}
		}
		doStaffTest(barNumbers, barNumbersOutput, violinParams, undefined, checkForBarNumbers);
	});

	it("extra vertical", function() {
		var visualObj = doRender(noExtraVertical, violinParams)
		var firstLineTop1 = visualObj[0].lines[0].staffGroup.staffs[0].absoluteY
		var secondLineTop1 = visualObj[0].lines[0].staffGroup.staffs[1].absoluteY
		var difference1 = Math.round((secondLineTop1 - firstLineTop1)*1000)/1000
		visualObj = doRender(extraVertical, violinParams)
		var firstLineTop2 = visualObj[0].lines[0].staffGroup.staffs[0].absoluteY
		var secondLineTop2 = visualObj[0].lines[0].staffGroup.staffs[1].absoluteY
		var difference2 = Math.round((secondLineTop2 - firstLineTop2)*1000)/1000
		//console.log(firstLineTop1, secondLineTop1, difference1, firstLineTop2, secondLineTop2,  difference2)
		chai.assert.equal(difference2, difference1, "Spacing between staves is not correct")
	})

	it("bracket-width", function() {
		var visualObj = doRender(bracketWidth, violinGuitarParams)
		var name = document.querySelector(".abcjs-instrument-name")
		var x = name.getAttribute("x")
		chai.assert.equal(parseInt(x,10), 33, "Not enough left margin for instrument name")
	})

	it("bad-tuning", function () {
		var visualObj = doRender(badTuning, badTuningParams)
		chai.assert.equal(visualObj[0].warnings, "Invalid string Instrument tuning : D string lower than A string")
	});

	it("subtitle", function() {
		// Just see it not crash
		var visualObj = doRender(subTitle, violinParams)
	})

	it("crash chord", function() {
		// Just see it not crash
		var visualObj = doRender(crashChord, violinParams)
	})

	it("crash-clef", function() {
		// Just see it not crash
		var visualObj = doRender(clefNone, violinParams)
	})

	it("bracket-height", function() {
		var visualObj = doRender(bracketPlacement, violinGuitarParams)
		var lastStaff = document.querySelector(".abcjs-staff.abcjs-l0.abcjs-v3")
		var dim = lastStaff.getBBox()
		var bottom = dim.y + dim.height
		var brace = document.querySelector(".abcjs-brace")
		dim = brace.getBBox()
		var braceBottom = dim.y+dim.height
		chai.assert.equal(braceBottom, bottom, "Brace should go to bottom")

		doVerticalTest(bracketPlacement, bracketPlacementOutput, violinGuitarParams)
	})

	it("kitchen sink", function() {
		doVerticalTest(kitchenSink, kitchenSinkOutput, violinGuitarParams)
	})

	it("percussion clef", function() {
		var visualObj = doRender(percussionClef, violinParams)
		chai.assert(visualObj[0].lines[0].staff.length === 1, "Should skip percussion clef")
	})

	it("firstStaffOnly", function() {
		doVerticalTest(firstStaffOnly, firstStaffOnlyOutput1, violinParams)
		doVerticalTest(firstStaffOnly, firstStaffOnlyOutput2, firstStaffOnlyParams)
	})

	it("tab-lyrics", function() {
		doVerticalTest(lyrics, lyricsOutput, violinParams)
	})
});

function doRender(abc, tabParams, params) {
	var warningLine = document.getElementById('warnings')
	warningLine.innerHTML = ""
	var options = {
		add_classes: true,
		tablature: tabParams
	};
	if (params) {
		var keys = Object.keys(params);
		for (var k = 0; k < keys.length; k++) {
			options[keys[k]] = params[keys[k]];
		}
	}
	var visualObj = abcjs.renderAbc("paper", abc, options );
	if (visualObj[0].warnings) {
		var el = document.querySelector("#warnings")
		if (el)
			el.innerHTML = visualObj[0].warnings.join(",")
	}
	return visualObj;
}

function getTabStaff(staffs, number) {
	var tabNumber = 0;
	for (var ii = 0; ii < staffs.length; ii++) {
		if (staffs[ii].clef.type === 'TAB') {
			if (tabNumber === number) {
				return staffs[ii].voices;
			}
			tabNumber++;
		}
	}
	return null;
}

function doStaffTest(abc, expected, tabParams, params, callback) {
	var visualObj = doRender(abc, tabParams, params);
	var lineLength = visualObj[0].lines.length;
	for (var i = 0; i < lineLength; i++) {
		var line = visualObj[0].lines[i];
		var staffNumber = 0;
		var tab = getTabStaff(line.staff, staffNumber);
		if (tab == null) {
			chai.assert(false,"unexpected null value getting tab staff");
		}
		while (tab != null) {
			for (var v = 0; v < tab.length; v++) {
				var thisVoice = tab[v]
				for (var j = 0; j < thisVoice.length; j++) {
					var el = Object.assign({}, thisVoice[j]);
					if (callback)
						callback(el, i, j)
					delete el.abselem
					var msg = "\nrcv: " + JSON.stringify(el, replacer) + "\n" +
						"exp: " + JSON.stringify(expected[i + staffNumber][j]) + "\n";
					chai.assert.deepStrictEqual(el, expected[i + staffNumber][j], msg);
				}
				chai.assert.equal(thisVoice.length, expected[v].length, "line " + i + " length mismatch");
				staffNumber++;
			}
			tab = getTabStaff(line.staff, staffNumber);
		}
	}
	chai.assert.equal((lineLength-1) +staffNumber, expected.length, "different numbers of lines");
	return visualObj[0]
}

function doVerticalTest(abc, expected, tabParams, params) {
	var visualObj = doRender(abc, tabParams, params);
	var yPos = document.querySelectorAll("#paper .abcjs-top-line")
	for (var i = 0; i < yPos.length; i++) {
		var topLine = yPos[i]
		var dim = topLine.getBBox()
		chai.assert.equal(Math.round(dim.y), expected[i], "Vertical spacing of staves wrong")
	}
}

// TODO-PER: Here are some more failures:
// X:19
// K:C
// a,
//
// X:45
// K:Am
// [d'e'']
//
// X:1
// K:C
// [^F,_G,]
//
// X:1
// T:small-notes
// M: 4/4
// L: 1/8
// K: Bb
// %%score (1 2)
// V:1
// FF|:"Bb"DDE2=EF3|x8|BB_AG "F7"FG3|x8|
// "Bb"FB2F"Bb7"B2FF|"Eb"B2Bc- "Ebm"c4|"Bb"zB _AG FDE=E|1"F7"F2_DB,-"Bb"B,2"F+7"zF:|2"F7"F2_DB,-"Bb"B,4||
// B2_AG FG3 | x8 & B2_AG FG3|BB_AG "F7"FG3|x8 & [I:voicescale 0.6] DDE2=EF3 |
// V:2 cue=on
// xx|:x8|DDE2=EF3|x8|"Bb"BF_AG "F7"FG3|
//
// X:1
// T: spacer-in-triplet
// K: F
// %%score (L R)
// V: L
// d2 d2 (3 c2 y A2 G2 | F8 |
// V: R
// G2 G2 E2 y2/3 E2 | D8 |
