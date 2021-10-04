describe("Tablature", function() {
	var violinAllNotes = "L:1/4\nM:4/4\nG,^G,A,^A,|B,^B,C^C|D^DE^E|F^FG^G|\n" +
		"A^AB^B|c^cd^d|e^ef^f|g^ga^a|\n" +
		"b^bc'^c'|d'^d'e'^e'|f'^f'g'^g'|_A,_B,_C_D|\n" +
		"_E_F_G_A|_B_c_d_e|_f_g_a_b|_c'_d'_e'_f'|";

	var violinAllNotesOutput = [
		// line 0
		[
			{"el_type":"note","startChar":12,"endChar":14,"notes":[{"num":0,"str":3,"pitch":"G,"}]},
			{"el_type":"note","startChar":14,"endChar":17,"notes":[{"num":1,"str":3,"pitch":"^G,"}]},
			{"el_type":"note","startChar":17,"endChar":19,"notes":[{"num":2,"str":3,"pitch":"A,"}]},
			{"el_type":"note","startChar":19,"endChar":22,"notes":[{"num":3,"str":3,"pitch":"^A,"}]},
			{"el_type":"bar","type":"bar_thin","endChar":23,"startChar":22},
			{"el_type":"note","startChar":23,"endChar":25,"notes":[{"num":4,"str":3,"pitch":"B,"}]},
			{"el_type":"note","startChar":25,"endChar":28,"notes":[{"num":5,"str":3,"pitch":"^B,"}]},
			{"el_type":"note","startChar":28,"endChar":29,"notes":[{"num":5,"str":3,"pitch":"C"}]},
			{"el_type":"note","startChar":29,"endChar":31,"notes":[{"num":6,"str":3,"pitch":"^C"}]},
			{"el_type":"bar","type":"bar_thin","endChar":32,"startChar":31},
			{"el_type":"note","startChar":32,"endChar":33,"notes":[{"num":0,"str":2,"pitch":"D"}]},
			{"el_type":"note","startChar":33,"endChar":35,"notes":[{"num":1,"str":2,"pitch":"^D"}]},
			{"el_type":"note","startChar":35,"endChar":36,"notes":[{"num":2,"str":2,"pitch":"E"}]},
			{"el_type":"note","startChar":36,"endChar":38,"notes":[{"num":3,"str":2,"pitch":"^E"}]},
			{"el_type":"bar","type":"bar_thin","endChar":39,"startChar":38},
			{"el_type":"note","startChar":39,"endChar":40,"notes":[{"num":3,"str":2,"pitch":"F"}]},
			{"el_type":"note","startChar":40,"endChar":42,"notes":[{"num":4,"str":2,"pitch":"^F"}]},
			{"el_type":"note","startChar":42,"endChar":43,"notes":[{"num":5,"str":2,"pitch":"G"}]},
			{"el_type":"note","startChar":43,"endChar":45,"notes":[{"num":6,"str":2,"pitch":"^G"}]},
			{"el_type":"bar","type":"bar_thin","endChar":46,"startChar":45}
		],
		// line 1
		[
			{"el_type":"note","startChar":47,"endChar":48,"notes":[{"num":0,"str":1,"pitch":"A"}]},
			{"el_type":"note","startChar":48,"endChar":50,"notes":[{"num":1,"str":1,"pitch":"^A"}]},
			{"el_type":"note","startChar":50,"endChar":51,"notes":[{"num":2,"str":1,"pitch":"B"}]},
			{"el_type":"note","startChar":51,"endChar":53,"notes":[{"num":3,"str":1,"pitch":"^B"}]},
			{"el_type":"bar","type":"bar_thin","endChar":54,"startChar":53},
			{"el_type":"note","startChar":54,"endChar":55,"notes":[{"num":3,"str":1,"pitch":"c"}]},
			{"el_type":"note","startChar":55,"endChar":57,"notes":[{"num":4,"str":1,"pitch":"^c"}]},
			{"el_type":"note","startChar":57,"endChar":58,"notes":[{"num":5,"str":1,"pitch":"d"}]},
			{"el_type":"note","startChar":58,"endChar":60,"notes":[{"num":6,"str":1,"pitch":"^d"}]},
			{"el_type":"bar","type":"bar_thin","endChar":61,"startChar":60},
			{"el_type":"note","startChar":61,"endChar":62,"notes":[{"num":0,"str":0,"pitch":"e"}]},
			{"el_type":"note","startChar":62,"endChar":64,"notes":[{"num":1,"str":0,"pitch":"^e"}]},
			{"el_type":"note","startChar":64,"endChar":65,"notes":[{"num":1,"str":0,"pitch":"f"}]},
			{"el_type":"note","startChar":65,"endChar":67,"notes":[{"num":2,"str":0,"pitch":"^f"}]},
			{"el_type":"bar","type":"bar_thin","endChar":68,"startChar":67},
			{"el_type":"note","startChar":68,"endChar":69,"notes":[{"num":3,"str":0,"pitch":"g"}]},
			{"el_type":"note","startChar":69,"endChar":71,"notes":[{"num":4,"str":0,"pitch":"^g"}]},
			{"el_type":"note","startChar":71,"endChar":72,"notes":[{"num":5,"str":0,"pitch":"a"}]},
			{"el_type":"note","startChar":72,"endChar":74,"notes":[{"num":6,"str":0,"pitch":"^a"}]},
			{"el_type":"bar","type":"bar_thin","endChar":75,"startChar":74}
		],
		// line 2
		[
			{"el_type":"note","startChar":76,"endChar":77,"notes":[{"num":7,"str":0,"pitch":"b"}]},
			{"el_type":"note","startChar":77,"endChar":79,"notes":[{"num":8,"str":0,"pitch":"^b"}]},
			{"el_type":"note","startChar":79,"endChar":81,"notes":[{"num":8,"str":0,"pitch":"c'"}]},
			{"el_type":"note","startChar":81,"endChar":84,"notes":[{"num":9,"str":0,"pitch":"^c'"}]},
			{"el_type":"bar","type":"bar_thin","endChar":85,"startChar":84},
			{"el_type":"note","startChar":85,"endChar":87,"notes":[{"num":10,"str":0,"pitch":"d'"}]},
			{"el_type":"note","startChar":87,"endChar":90,"notes":[{"num":11,"str":0,"pitch":"^d'"}]},
			{"el_type":"note","startChar":90,"endChar":92,"notes":[{"num":12,"str":0,"pitch":"e'"}]},
			{"el_type":"note","startChar":92,"endChar":95,"notes":[{"num":13,"str":0,"pitch":"^e'"}]},
			{"el_type":"bar","type":"bar_thin","endChar":96,"startChar":95},
			{"el_type":"note","startChar":96,"endChar":98,"notes":[{"num":13,"str":0,"pitch":"f'"}]},
			{"el_type":"note","startChar":98,"endChar":101,"notes":[{"num":14,"str":0,"pitch":"^f'"}]},
			{"el_type":"note","startChar":101,"endChar":103,"notes":[{"num":15,"str":0,"pitch":"g'"}]},
			{"el_type":"note","startChar":103,"endChar":106,"notes":[{"num":16,"str":0,"pitch":"^g'"}]},
			{"el_type":"bar","type":"bar_thin","endChar":107,"startChar":106},
			{"el_type":"note","startChar":107,"endChar":110,"notes":[{"num":1,"str":3,"pitch":"_A,"}]},
			{"el_type":"note","startChar":110,"endChar":113,"notes":[{"num":3,"str":3,"pitch":"_B,"}]},
			{"el_type":"note","startChar":113,"endChar":115,"notes":[{"num":4,"str":3,"pitch":"_C"}]},
			{"el_type":"note","startChar":115,"endChar":117,"notes":[{"num":6,"str":3,"pitch":"_D"}]},
			{"el_type":"bar","type":"bar_thin","endChar":118,"startChar":117},
		],
		// line 3
		[
			{"el_type":"note","startChar":119,"endChar":121,"notes":[{"num":1,"str":2,"pitch":"_E"}]},
			{"el_type":"note","startChar":121,"endChar":123,"notes":[{"num":2,"str":2,"pitch":"_F"}]},
			{"el_type":"note","startChar":123,"endChar":125,"notes":[{"num":4,"str":2,"pitch":"_G"}]},
			{"el_type":"note","startChar":125,"endChar":127,"notes":[{"num":6,"str":2,"pitch":"_A"}]},
			{"el_type":"bar","type":"bar_thin","endChar":128,"startChar":127},
			{"el_type":"note","startChar":128,"endChar":130,"notes":[{"num":1,"str":1,"pitch":"_B"}]},
			{"el_type":"note","startChar":130,"endChar":132,"notes":[{"num":2,"str":1,"pitch":"_c"}]},
			{"el_type":"note","startChar":132,"endChar":134,"notes":[{"num":4,"str":1,"pitch":"_d"}]},
			{"el_type":"note","startChar":134,"endChar":136,"notes":[{"num":6,"str":1,"pitch":"_e"}]},
			{"el_type":"bar","type":"bar_thin","endChar":137,"startChar":136},
			{"el_type":"note","startChar":137,"endChar":139,"notes":[{"num":0,"str":0,"pitch":"_f"}]},
			{"el_type":"note","startChar":139,"endChar":141,"notes":[{"num":2,"str":0,"pitch":"_g"}]},
			{"el_type":"note","startChar":141,"endChar":143,"notes":[{"num":4,"str":0,"pitch":"_a"}]},
			{"el_type":"note","startChar":143,"endChar":145,"notes":[{"num":6,"str":0,"pitch":"_b"}]},
			{"el_type":"bar","type":"bar_thin","endChar":146,"startChar":145},
			{"el_type":"note","startChar":146,"endChar":149,"notes":[{"num":7,"str":0,"pitch":"_c'"}]},
			{"el_type":"note","startChar":149,"endChar":152,"notes":[{"num":9,"str":0,"pitch":"_d'"}]},
			{"el_type":"note","startChar":152,"endChar":155,"notes":[{"num":11,"str":0,"pitch":"_e'"}]},
			{"el_type":"note","startChar":155,"endChar":158,"notes":[{"num":12,"str":0,"pitch":"_f'"}]},
			{"el_type":"bar","type":"bar_thin","endChar":159,"startChar":158},
		],
	]

	var violinOutOfRange = "L:1/4\nM:4/4\nF,^F,G,e'''|\n";

	var violinOutOfRangeOutput = [
		[
			{"el_type":"note","startChar":12,"endChar":14,"notes":[{"num":"?","str":3,"pitch":"F,"}]},
			{"el_type":"note","startChar":14,"endChar":17,"notes":[{"num":"?","str":3,"pitch":"^F,"}]},
			{"el_type":"note","startChar":17,"endChar":19,"notes":[{"num":0,"str":3,"pitch":"G,"}]},
			{"el_type":"note","startChar":19,"endChar":23,"notes":[{"num":"?","str":0,"pitch":"e'"}]},
			{"el_type":"bar","type":"bar_thin","endChar":24,"startChar":23}
		]
	];

	var violinKeySigs = "L:1/4\nM:4/4\nK:Ab\nA,B,CD|EFGA| [K:B] A,B,CD|EFGA|\n";

	var violinKeySigsOutput = [
		[
			{"el_type":"note","startChar":17,"endChar":19,"notes":[{"num":1,"str":3,"pitch":"_A,"}]},
			{"el_type":"note","startChar":19,"endChar":21,"notes":[{"num":3,"str":3,"pitch":"_B,"}]},
			{"el_type":"note","startChar":21,"endChar":22,"notes":[{"num":5,"str":3,"pitch":"C"}]},
			{"el_type":"note","startChar":22,"endChar":23,"notes":[{"num":6,"str":3,"pitch":"_D"}]},
			{"el_type":"bar","type":"bar_thin","endChar":24,"startChar":23},
			{"el_type":"note","startChar":24,"endChar":25,"notes":[{"num":1,"str":2,"pitch":"_E"}]},
			{"el_type":"note","startChar":25,"endChar":26,"notes":[{"num":3,"str":2,"pitch":"F"}]}
			,
			{"el_type":"note","startChar":26,"endChar":27,"notes":[{"num":5,"str":2,"pitch":"G"}]},
			{"el_type":"note","startChar":27,"endChar":28,"notes":[{"num":6,"str":2,"pitch":"_A"}]},
			{"el_type":"bar","type":"bar_thin","endChar":29,"startChar":28},
			{"el_type":"note","startChar":35,"endChar":38,"notes":[{"num":3,"str":3,"pitch":"^A,"}]},
			{"el_type":"note","startChar":38,"endChar":40,"notes":[{"num":4,"str":3,"pitch":"B,"}]},
			{"el_type":"note","startChar":40,"endChar":41,"notes":[{"num":6,"str":3,"pitch":"^C"}]},
			{"el_type":"note","startChar":41,"endChar":42,"notes":[{"num":1,"str":2,"pitch":"^D"}]},
			{"el_type":"bar","type":"bar_thin","endChar":43,"startChar":42},
			{"el_type":"note","startChar":43,"endChar":44,"notes":[{"num":2,"str":2,"pitch":"E"}]},
			{"el_type":"note","startChar":44,"endChar":45,"notes":[{"num":4,"str":2,"pitch":"^F"}]},
			{"el_type":"note","startChar":45,"endChar":46,"notes":[{"num":6,"str":2,"pitch":"^G"}]},
			{"el_type":"note","startChar":46,"endChar":47,"notes":[{"num":1,"str":1,"pitch":"^A"}]},
			{"el_type":"bar","type":"bar_thin","endChar":48,"startChar":47}
		]
	];

	var violinCrossTune = "L:1/4\nM:4/4\nK:A\nA,B,CD|EFGA|Bcde|fgab|\n";

	var violinCrossTuneOutput = [
		[
			{"el_type":"note","startChar":16,"endChar":18,"notes":[{"num":0,"str":3,"pitch":"A,"}]},
			{"el_type":"note","startChar":18,"endChar":20,"notes":[{"num":2,"str":3,"pitch":"B,"}]},
			{"el_type":"note","startChar":20,"endChar":21,"notes":[{"num":4,"str":3,"pitch":"^C"}]},
			{"el_type":"note","startChar":21,"endChar":22,"notes":[{"num":5,"str":3,"pitch":"D"}]},
			{"el_type":"bar","type":"bar_thin","endChar":23,"startChar":22},
			{"el_type":"note","startChar":23,"endChar":24,"notes":[{"num":0,"str":2,"pitch":"E"}]},
			{"el_type":"note","startChar":24,"endChar":25,"notes":[{"num":2,"str":2,"pitch":"^F"}]},
			{"el_type":"note","startChar":25,"endChar":26,"notes":[{"num":4,"str":2,"pitch":"^G"}]},
			{"el_type":"note","startChar":26,"endChar":27,"notes":[{"num":0,"str":1,"pitch":"A"}]},
			{"el_type":"bar","type":"bar_thin","endChar":28,"startChar":27},
			{"el_type":"note","startChar":28,"endChar":29,"notes":[{"num":2,"str":1,"pitch":"B"}]},
			{"el_type":"note","startChar":29,"endChar":30,"notes":[{"num":4,"str":1,"pitch":"^c"}]},
			{"el_type":"note","startChar":30,"endChar":31,"notes":[{"num":5,"str":1,"pitch":"d"}]},
			{"el_type":"note","startChar":31,"endChar":32,"notes":[{"num":0,"str":0,"pitch":"e"}]},
			{"el_type":"bar","type":"bar_thin","endChar":33,"startChar":32},
			{"el_type":"note","startChar":33,"endChar":34,"notes":[{"num":2,"str":0,"pitch":"^f"}]},
			{"el_type":"note","startChar":34,"endChar":35,"notes":[{"num":4,"str":0,"pitch":"^g"}]},
			{"el_type":"note","startChar":35,"endChar":36,"notes":[{"num":5,"str":0,"pitch":"a"}]},
			{"el_type":"note","startChar":36,"endChar":37,"notes":[{"num":7,"str":0,"pitch":"b"}]},
			{"el_type":"bar","type":"bar_thin","endChar":38,"startChar":37}
		]
	];

	var violinDoubleStops = "L:1/4\nK:A\n[EE] [AA] [ee] [D^F] [E^G] [F^G] [Ac] [gb] |\n";

	var violinDoubleStopsOutput = [
		[
			{"el_type":"note","startChar":10,"endChar":15,"notes":[{"num":7,"str":3,"pitch":"E"},
					{"num":0,"str":2,"pitch":"E"}]},
			{"el_type":"note","startChar":15,"endChar":20,"notes":[{"num":5,"str":2,"pitch":"A"},
					{"num":0,"str":1,"pitch":"A"}]},
			{"el_type":"note","startChar":20,"endChar":25,"notes":[{"num":7,"str":1,"pitch":"e"},
					{"num":0,"str":0,"pitch":"e"}]},
			{"el_type":"note","startChar":25,"endChar":31,"notes":[{"num":5,"str":3,"pitch":"D"},
					{"num":2,"str":2,"pitch":"^F"}]},
			{"el_type":"note","startChar":31,"endChar":37,"notes":[{"num":7,"str":3,"pitch":"E"},
					{"num":4,"str":2,"pitch":"^G"}]},
			{"el_type":"note","startChar":37,"endChar":43,"notes":[{"num":9,"str":3,"pitch":"^F"},
					{"num":4,"str":2,"pitch":"^G"}]},
			{"el_type":"note","startChar":43,"endChar":48,"notes":[{"num":5,"str":2,"pitch":"A"},
					{"num":4,"str":1,"pitch":"^c"}]},
			{"el_type":"note","startChar":48,"endChar":53,"notes":[{"num":11,"str":1,"pitch":"^g"},
					{"num":7,"str":0,"pitch":"b"}]},
			{"el_type":"bar","type":"bar_thin","endChar":54,"startChar":53}
		]
	];

	var transposeDoubleStopsOutput = [
		[
			{"el_type":"note","startChar":10,"endChar":15,"notes":[{"num":9,"str":3,"pitch":"^F"},
					{"num":2,"str":2,"pitch":"^F"}]},
			{"el_type":"note","startChar":15,"endChar":20,"notes":[{"num":8,"str":2,"pitch":"B"},
					{"num":2,"str":1,"pitch":"B"}]},
			{"el_type":"note","startChar":20,"endChar":25,"notes":[{"num":9,"str":1,"pitch":"^f"},
					{"num":2,"str":0,"pitch":"^f"}]},
			{"el_type":"note","startChar":25,"endChar":31,"notes":[{"num":7,"str":3,"pitch":"E"},
					{"num":4,"str":2,"pitch":"^G"}]},
			{"el_type":"note","startChar":31,"endChar":37,"notes":[{"num":6,"str":3,"pitch":"^F"},
					{"num":1,"str":1,"pitch":"^A"}]},
			{"el_type":"note","startChar":37,"endChar":43,"notes":[{"num":8,"str":2,"pitch":"^G"},
					{"num":1,"str":1,"pitch":"^A"}]},
			{"el_type":"note","startChar":43,"endChar":48,"notes":[{"num":11,"str":2,"pitch":"B"},
					{"num":6,"str":1,"pitch":"^d"}]},
			{"el_type":"note","startChar":48,"endChar":53,"notes":[{"num":13,"str":1,"pitch":"^a"},
					{"num":9,"str":0,"pitch":"^c"}]},
			{"el_type":"bar","type":"bar_thin","endChar":54,"startChar":53}
		]
	];

	var violinUnusualAccidentals = "L:1/4\nK:C\n^/G ^^A __B _/c|\n";

	var violinUnusualAccidentalsOutput = [
		[
			{"el_type":"note","startChar":9,"endChar":14,"notes":[{"num":"5^","str":2,"pitch":"^/G"}]},
			{"el_type":"note","startChar":14,"endChar":18,"notes":[{"num":2,"str":1,"pitch":"^^A"}]},
			{"el_type":"note","startChar":18,"endChar":22,"notes":[{"num":0,"str":1,"pitch":"__B"}]},
			{"el_type":"note","startChar":22,"endChar":25,"notes":[{"num":"3v","str":1,"pitch":"_/c"}]},
			{"el_type":"bar","type":"bar_thin","endChar":26,"startChar":25}
		]
	];

	var guitarCapo = "M: 2/4\n" +
		"K:F\n" +
		"|: [EE,]^FGA [B2B,]BA | [G2A,]^FE [B,B]^cBA | [G2A,]^FE [B,4^FB]:| \n"

	var guitarCapoOutput = [
		[
			{"el_type":"bar","type":"bar_left_repeat","endChar":13,"startChar":11},
			{"el_type":"note","startChar":13,"endChar":19,"notes":[{"num":0,"str":5,"pitch":"E,"}, {"num":0,"str":3,"pitch":"E"}]},
			{"el_type":"note","startChar":19,"endChar":21,"notes":[{"num":2,"str":3,"pitch":"^F"}]},
			{"el_type":"note","startChar":21,"endChar":22,"notes":[{"num":3,"str":3,"pitch":"G"}]},
			{"el_type":"note","startChar":22,"endChar":24,"notes":[{"num":0,"str":2,"pitch":"A"}]},
			{"el_type":"note","startChar":24,"endChar":30,"notes":[{"num":6,"str":5,"pitch":"_B,"}, {"num":6,"str":2,"pitch":"_B"}]},
			{"el_type":"note","startChar":30,"endChar":31,"notes":[{"num":6,"str":2,"pitch":"_B"}]},
			{"el_type":"note","startChar":31,"endChar":33,"notes":[{"num":0,"str":2,"pitch":"A"}]},
			{"el_type":"bar","type":"bar_thin","endChar":34,"startChar":33},
			{"el_type":"note","startChar":34,"endChar":41,"notes":[{"num":5,"str":5,"pitch":"A,"}, {"num":3,"str":3,"pitch":"G"}]},
			{"el_type":"note","startChar":41,"endChar":43,"notes":[{"num":2,"str":3,"pitch":"^F"}]},
			{"el_type":"note","startChar":43,"endChar":45,"notes":[{"num":0,"str":3,"pitch":"E"}]},
			{"el_type":"note","startChar":45,"endChar":50,"notes":[{"num":6,"str":5,"pitch":"_B,"}, {"num":6,"str":2,"pitch":"_B"}]},
			{"el_type":"note","startChar":50,"endChar":52,"notes":[{"num":2,"str":1,"pitch":"^c"}]},
			{"el_type":"note","startChar":52,"endChar":53,"notes":[{"num":6,"str":2,"pitch":"_B"}]},
			{"el_type":"note","startChar":53,"endChar":55,"notes":[{"num":0,"str":2,"pitch":"A"}]},
			{"el_type":"bar","type":"bar_thin","endChar":56,"startChar":55},
			{"el_type":"note","startChar":56,"endChar":63,"notes":[{"num":5,"str":5,"pitch":"A,"}, {"num":3,"str":3,"pitch":"G"}]},
			{"el_type":"note","startChar":63,"endChar":65,"notes":[{"num":2,"str":3,"pitch":"^F"}]},
			{"el_type":"note","startChar":65,"endChar":67,"notes":[{"num":0,"str":3,"pitch":"E"}]},
			{"el_type":"note","startChar":67,"endChar":75,"notes":[{"num":6,"str":5,"pitch":"_B,"}, {"num":2,"str":3,"pitch":"^F"}, {"num":6,"str":2,"pitch":"_B"}]},
			{"el_type":"bar","type":"bar_right_repeat","endChar":77,"startChar":75}]
	];

	var twoVoices = "%%score (1 2)\n" +
		"M: 4/4\n" +
		"L: 1/8\n" +
		"K: Em\n" +
		"V:1\n" +
		"d|BGDg|\n" +
		"V:2\n" +
		"G|ABAB|"

	var twoVoicesOutput = [
		[
			{"el_type":"note","startChar":38,"endChar":39,"notes":[{"num":5,"str":1,"pitch":"d"}]},
			{"el_type":"bar","type":"bar_thin","endChar":40,"startChar":39},
			{"el_type":"note","startChar":40,"endChar":41,"notes":[{"num":2,"str":1,"pitch":"B"}]},
			{"el_type":"note","startChar":41,"endChar":42,"notes":[{"num":5,"str":2,"pitch":"G"}]},
			{"el_type":"note","startChar":42,"endChar":43,"notes":[{"num":0,"str":2,"pitch":"D"}]},
			{"el_type":"note","startChar":43,"endChar":44,"notes":[{"num":3,"str":0,"pitch":"g"}]},
			{"el_type":"bar","type":"bar_thin","endChar":45,"startChar":44},
		],
		[
			{"el_type":"note","startChar":38,"endChar":39,"notes":[{"num":5,"str":1,"pitch":"G"}]},
			{"el_type":"bar","type":"bar_thin","endChar":40,"startChar":39},
			{"el_type":"note","startChar":40,"endChar":41,"notes":[{"num":2,"str":1,"pitch":"A"}]},
			{"el_type":"note","startChar":41,"endChar":42,"notes":[{"num":5,"str":2,"pitch":"B"}]},
			{"el_type":"note","startChar":42,"endChar":43,"notes":[{"num":0,"str":2,"pitch":"A"}]},
			{"el_type":"note","startChar":41,"endChar":42,"notes":[{"num":5,"str":2,"pitch":"B"}]},
			{"el_type":"bar","type":"bar_thin","endChar":40,"startChar":39},
		],
	];

	var twoStaves = "%%score 1|2\n" +
		"M: 4/4\n" +
		"L: 1/8\n" +
		"K: Em\n" +
		"V:1\n" +
		"d|BGDg|\n" +
		"V:2\n" +
		"G|ABAB|"

	var twoStavesOutput = [
		[
			{"el_type":"note","startChar":36,"endChar":37,"notes":[{"num":5,"str":1,"pitch":"d"}]},
			{"el_type":"bar","type":"bar_thin","endChar":38,"startChar":37},
			{"el_type":"note","startChar":38,"endChar":39,"notes":[{"num":2,"str":1,"pitch":"B"}]},
			{"el_type":"note","startChar":39,"endChar":40,"notes":[{"num":5,"str":2,"pitch":"G"}]},
			{"el_type":"note","startChar":40,"endChar":41,"notes":[{"num":0,"str":2,"pitch":"D"}]},
			{"el_type":"note","startChar":41,"endChar":42,"notes":[{"num":3,"str":0,"pitch":"g"}]},
			{"el_type":"bar","type":"bar_thin","endChar":43,"startChar":42},
		],
		[
			{"el_type":"note","startChar":45,"endChar":46,"notes":[{"num":5,"str":1,"pitch":"G"}]},
			{"el_type":"bar","type":"bar_thin","endChar":47,"startChar":46},
			{"el_type":"note","startChar":47,"endChar":48,"notes":[{"num":2,"str":1,"pitch":"A"}]},
			{"el_type":"note","startChar":48,"endChar":49,"notes":[{"num":5,"str":2,"pitch":"B"}]},
			{"el_type":"note","startChar":49,"endChar":50,"notes":[{"num":0,"str":2,"pitch":"A"}]},
			{"el_type":"note","startChar":50,"endChar":51,"notes":[{"num":0,"str":3,"pitch":"B"}]},
		],
	];

	var guitarParams = [[
		"GuitarTab" ,
		{
			name : 'Guitar' ,
			tuning : ['D,','A,','D','G','A','d'],
			capo: 2
		}
	]]

	var violinParams = [[
		"ViolinTab" ,
		{
			name : 'Violin' ,
			tuning : ['G,', 'D', 'A' , 'e']
		}
	]];

	var violinCrossTuneParams = [[
		"ViolinTab" ,
		{
			name : 'Violin' ,
			tuning : ['A,', 'E', 'A' , 'e']
		}
	]];

	it("accidentals", function() {
		doTest(violinAllNotes, violinAllNotesOutput, violinParams)
	})

	it("out of range", function() {
		doTest(violinOutOfRange, violinOutOfRangeOutput, violinParams)
	})

	it("key sigs", function() {
		doTest(violinKeySigs, violinKeySigsOutput, violinParams)
	})

	it("cross tune", function() {
		doTest(violinCrossTune, violinCrossTuneOutput, violinCrossTuneParams)
	})

	it("double stops", function() {
		doTest(violinDoubleStops, violinDoubleStopsOutput, violinCrossTuneParams)
	})

	it("unusual accidentals", function() {
		doTest(violinUnusualAccidentals, violinUnusualAccidentalsOutput, violinParams)
	})

	it("capo", function() {
		doTest(guitarCapo, guitarCapoOutput, guitarParams)
	})

	it("two voices", function() {
		doTest(twoVoices, twoVoicesOutput, violinParams)
	})

	it("two staves", function() {
		doTest(twoStaves, twoStavesOutput, violinParams)
	})

	it("transpose", function() {
		doTest(violinDoubleStops, transposeDoubleStopsOutput, violinCrossTuneParams, { visualTranspose: 2})
	})

})

function doTest(abc, expected, tabParams, params) {
	var options = { add_classes: true, tablatures: tabParams};
	if (params) {
		var keys = Object.keys(params)
		for (var k = 0; k < keys.length; k++) {
			options[keys[k]] = params[keys[k]]
		}
	}
	var visualObj = abcjs.renderAbc("paper", abc, options);
	for (var i = 0; i < visualObj[0].lines.length; i++) {
		var line = visualObj[0].lines[i];
		var info = line.staffGroup.voices[1].tabNameInfos;
		var tab = line.staff[1].voices
		console.log(JSON.stringify(tab))
		for (var j = 0; j < tab.length; j++) {
			var el = tab[j];
			var msg = "\nrcv: " + JSON.stringify(el) + "\n" +
				"exp: " + JSON.stringify(expected[i][j]) + "\n";
			chai.assert.deepStrictEqual(el, expected[i][j], msg);
		}
		chai.assert.equal(tab.length, expected[i].length, "line "+i+ " length mismatch")
	}
	chai.assert.equal(visualObj[0].lines.length, expected.length, "different numbers of lines")
}
