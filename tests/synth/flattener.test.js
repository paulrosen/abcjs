describe("Audio flattener", function() {
	var abcMultiple = 'K:C\n' +
'Q:1/4=60\n' +
'L:1/4\n' +
'V:1\n' +
'G/| (3c/d/c/ "C"z d .e| {f}g !tenuto!a [gb] !style=rhythm!B|"D"A2"E"^G2|\n' +
'V:2\n' +
'x/|C4|D4|^F2B2|\n';

	var expectedMultiple = {
		"tempo": 60,
		"instrument": 0,
		"tracks": [
			[
				{
					"cmd": "program",
					"channel": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 85,
					"start": 0,
					"duration": 0.125,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 72,
					"volume": 105,
					"start": 0.125,
					"duration": 0.083333,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 74,
					"volume": 85,
					"start": 0.208333,
					"duration": 0.083333,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 72,
					"volume": 85,
					"start": 0.291666,
					"duration": 0.083334,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 74,
					"volume": 95,
					"start": 0.625,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 76,
					"volume": 95,
					"start": 0.875,
					"duration": 0.25,
					"instrument": 0,
					"endType": "staccato",
					"gap": 0.1
				},
				{
					"cmd": "note",
					"pitch": 77,
					"volume": 70,
					"start": 1.125,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0,
					"style": "grace"
				},
				{
					"cmd": "note",
					"pitch": 79,
					"volume": 105,
					"start": 1.25,
					"duration": 0.125,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 81,
					"volume": 95,
					"start": 1.375,
					"duration": 0.25,
					"instrument": 0,
					"endType": "tenuto",
					"gap": -0.001
				},
				{
					"cmd": "note",
					"pitch": 79,
					"volume": 95,
					"start": 1.625,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 83,
					"volume": 95,
					"start": 1.625,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 95,
					"start": 1.875,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 95,
					"start": 1.875,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 95,
					"start": 1.875,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 105,
					"start": 2.125,
					"duration": 0.5,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 68,
					"volume": 95,
					"start": 2.625,
					"duration": 0.5,
					"instrument": 0,
					"gap": 0
				}
			],
			[
				{
					"cmd": "program",
					"channel": 1,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 60,
					"volume": 105,
					"start": 0.125,
					"duration": 1,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 105,
					"start": 1.125,
					"duration": 1,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 66,
					"volume": 105,
					"start": 2.125,
					"duration": 0.5,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 95,
					"start": 2.625,
					"duration": 0.5,
					"instrument": 0,
					"gap": 0
				}
			],
			[
				{
					"cmd": "program",
					"channel": 2,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 0.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 0.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 0.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 0.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 0.625,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 0.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 0.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 0.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 2.125,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 2.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 2.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 2.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 2.625,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 2.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 2.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 2.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				}
			]
		],
		"totalDuration": 3.125
	}

	//////////////////////////////////////////////////////////

	var abcDynamics = 'X:1\n' +
'M:4/4\n' +
'L:1/4\n' +
'Q:1/4=120\n' +
'K:C\n' +
'!crescendo(! EFGA| GAB !crescendo)!c | !diminuendo(! EFGA| GAB !diminuendo)!c |\n' +
'!pppp! A B !ppp!A B |!pp! A B !p!A B | !mp! AB !sfz! AB|\n' +
'!mf! AB !f! AB | !ff! AB !fff! AB | !ffff! ABAB|]\n';

	var expectedDynamics = {
		"tempo": 120,
		"instrument": 0,
		"tracks": [
			[
				{
					"cmd": "program",
					"channel": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 64,
					"volume": 105,
					"start": 0,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 65,
					"volume": 98,
					"start": 0.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 101,
					"start": 0.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 104,
					"start": 0.75,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 117,
					"start": 1,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 110,
					"start": 1.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 113,
					"start": 1.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 72,
					"volume": 116,
					"start": 1.75,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 64,
					"volume": 126,
					"start": 2,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 65,
					"volume": 108,
					"start": 2.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 100,
					"start": 2.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 92,
					"start": 2.75,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 94,
					"start": 3,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 76,
					"start": 3.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 68,
					"start": 3.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 72,
					"volume": 60,
					"start": 3.75,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 15,
					"start": 4,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 10,
					"start": 4.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 20,
					"start": 4.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 20,
					"start": 4.75,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 45,
					"start": 5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 35,
					"start": 5.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 50,
					"start": 5.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 50,
					"start": 5.75,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 75,
					"start": 6,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 65,
					"start": 6.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 65,
					"start": 6.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 65,
					"start": 6.75,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 90,
					"start": 7,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 80,
					"start": 7.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 95,
					"start": 7.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 95,
					"start": 7.75,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 120,
					"start": 8,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 110,
					"start": 8.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 125,
					"start": 8.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 125,
					"start": 8.75,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 127,
					"start": 9,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 125,
					"start": 9.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 125,
					"start": 9.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 125,
					"start": 9.75,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				}
			]
		],
		"totalDuration": 10
	}

	//////////////////////////////////////////////////////////

	var abcDynamics2 = 'X: 1\n' +
		'M: 4/4\n' +
		'L: 1/8\n' +
		'K: C\n' +
		'!p!C!<(!DEF GABc |d2 B2 G2 F2!<)! | !f!E!>(!FGA Bcde!>)! | !p!f2 d2 B2 A2 |\n' +
		'G2 c2 e2 g2 | a2 f2 d2 B2 |cdBc ABGA | FGEF DEFG |\n' +
		'E2 C2 D2 B,2 | C8 |\n';

	var expectedDynamics2 = {
		"tempo":180,
		"instrument":0,
		"totalDuration":10,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":60,"start":0,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":35,"start":0.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":54,"start":0.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":43,"start":0.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":62,"start":0.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":51,"start":0.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":70,"start":0.75,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":59,"start":0.875,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":88,"start":1,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":82,"start":1.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":86,"start":1.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":90,"start":1.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":105,"start":2,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":80,"start":2.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":87,"start":2.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":64,"start":2.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":71,"start":2.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":48,"start":2.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":55,"start":2.75,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":32,"start":2.875,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":77,"volume":60,"start":3,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":50,"start":3.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":50,"start":3.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":50,"start":3.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":60,"start":4,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":50,"start":4.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":50,"start":4.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":79,"volume":50,"start":4.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":81,"volume":60,"start":5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":77,"volume":50,"start":5.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":50,"start":5.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":50,"start":5.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":60,"start":6,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":35,"start":6.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":50,"start":6.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":35,"start":6.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":50,"start":6.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":35,"start":6.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":50,"start":6.75,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":35,"start":6.875,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":60,"start":7,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":35,"start":7.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":50,"start":7.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":35,"start":7.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":50,"start":7.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":35,"start":7.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":50,"start":7.75,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":35,"start":7.875,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":60,"start":8,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":50,"start":8.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":50,"start":8.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":59,"volume":50,"start":8.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":60,"start":9,"duration":1,"instrument":0,"gap":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcDynamics3 = 'X: 1\n' +
		'M: 4/4\n' +
		'L: 1/4\n' +
		'K: C\n' +
		'!pppp!CDEF | !<(!GABc| !<)!y!ffff!BcBA | !>(!GFED | !>)!y!pppp!C4 |]\n';

	var expectedDynamics3 = {
		"tempo":180,
		"instrument":0,
		"totalDuration":5,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":15,"start":0,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":10,"start":0.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":10,"start":0.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":10,"start":0.75,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":67,"volume":15,"start":1,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":38,"start":1.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":66,"start":1.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":94,"start":1.75,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":71,"volume":127,"start":2,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":125,"start":2.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":125,"start":2.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":125,"start":2.75,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":67,"volume":127,"start":3,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":97,"start":3.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":69,"start":3.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":41,"start":3.75,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":60,"volume":15,"start":4,"duration":1,"instrument":0,"gap":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcSixHuit = 'X:1\n' +
'M:6/8\n' +
'L:1/8\n' +
'Q:3/8=60\n' +
'K:G\n' +
'"G"GAB cde|"D7"fga DEF|\n';

	var expectedSixHuit = {
		"tempo": 60,
		"instrument": 0,
		"tracks": [
			[
				{
					"cmd": "program",
					"channel": 0,
					"instrument": 0
				},
				{"cmd":"note","pitch":67,"volume":105,"start":0,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":85,"start":0.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":85,"start":0.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":95,"start":0.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":0.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":0.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":105,"start":0.75,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":79,"volume":85,"start":0.875,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":81,"volume":85,"start":1,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":95,"start":1.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":1.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":66,"volume":85,"start":1.375,"duration":0.125,"instrument":0,"gap":0},
			],
			[
				{
					"cmd": "program",
					"channel": 1,
					"instrument": 0
				},
				{"cmd":"note","pitch":43,"volume":64,"start":0,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.25,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":0.25,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":0.25,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":0.375,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.625,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":0.625,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":0.625,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":0.75,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":1,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":54,"volume":48,"start":1,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":1,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":48,"start":1,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":33,"volume":64,"start":1.125,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":1.375,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":54,"volume":48,"start":1.375,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":1.375,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":48,"start":1.375,"duration":0.0625,"gap":0,"instrument":0},
			],
		],
		"totalDuration": 1.5
	}

	//////////////////////////////////////////////////////////

	var abcJigChords = 'X:1\n' +
	'L:1/8\n' +
	'Q:3/8=61\n' +
	'M:6/8\n' +
	'K:F\n' +
	'"C"cde def|c2e d2f|"C"c2"D"d "G"d2"E"e|';

	var expectedJigChords = {
		"tempo":61,
		"instrument":0,
		"totalDuration":2.25,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":72,"volume":105,"start":0,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":0.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":0.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":0.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":0.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":77,"volume":85,"start":0.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":105,"start":0.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":1,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":1.125,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":77,"volume":85,"start":1.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":105,"start":1.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":1.75,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":1.875,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":2.125,"duration":0.125,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":36,"volume":64,"start":0,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":0.25,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":0.25,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.25,"duration":0.0625,"gap":0,"instrument":0},

				{"cmd":"note","pitch":31,"volume":64,"start":0.375,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":0.625,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":0.625,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.625,"duration":0.0625,"gap":0,"instrument":0},

				{"cmd":"note","pitch":36,"volume":64,"start":0.75,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":1,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":1,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1,"duration":0.0625,"gap":0,"instrument":0},

				{"cmd":"note","pitch":31,"volume":64,"start":1.125,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":1.375,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":1.375,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1.375,"duration":0.0625,"gap":0,"instrument":0},

				{"cmd":"note","pitch":36,"volume":64,"start":1.5,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":1.75,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":1.75,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":54,"volume":48,"start":1.75,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":1.75,"duration":0.0625,"gap":0,"instrument":0},

				{"cmd":"note","pitch":43,"volume":64,"start":1.875,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":40,"volume":64,"start":2.125,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":2.125,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":56,"volume":48,"start":2.125,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":2.125,"duration":0.0625,"gap":0,"instrument":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcRepeat = 'X:1\n' +
'M:C\n' +
'L:1/8\n' +
'Q:1/2=50\n' +
'K:G\n' +
'cde|:"D7"f2 d2 e2 f2|1"G"g4 fedc:|"C"e4z4|]\n';

	var expectedRepeat = {
		"tempo":100,
		"instrument":0,
		"totalDuration":4.375,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":72,"volume":85,"start":0,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":0.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":0.25,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":78,"volume":105,"start":0.375,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":0.625,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":95,"start":0.875,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":95,"start":1.125,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":79,"volume":105,"start":1.375,"duration":0.5,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":95,"start":1.875,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":2,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":2.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":2.25,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":78,"volume":105,"start":2.375,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":2.625,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":95,"start":2.875,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":95,"start":3.125,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":76,"volume":105,"start":3.375,"duration":0.5,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":0.375,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":0.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":54,"volume":48,"start":0.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":0.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":48,"start":0.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":33,"volume":64,"start":0.875,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":1.125,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":54,"volume":48,"start":1.125,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":1.125,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":48,"start":1.125,"duration":0.125,"gap":0,"instrument":0},

				{"cmd":"note","pitch":43,"volume":64,"start":1.375,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":1.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":1.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":1.875,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":2.125,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":2.125,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":2.125,"duration":0.125,"gap":0,"instrument":0},

				{"cmd":"note","pitch":38,"volume":64,"start":2.375,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":2.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":54,"volume":48,"start":2.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":2.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":48,"start":2.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":33,"volume":64,"start":2.875,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":3.125,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":54,"volume":48,"start":3.125,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":3.125,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":48,"start":3.125,"duration":0.125,"gap":0,"instrument":0},

				{"cmd":"note","pitch":36,"volume":64,"start":3.375,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":3.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":3.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":3.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":3.875,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":4.125,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":4.125,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":4.125,"duration":0.125,"gap":0,"instrument":0},
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcDrum = 'X:1\n' +
'T: metronome\n' +
'L:1/4\n' +
'Q:1/4=60\n' +
'%%MIDI drum dddd 76 77 77 77 50 50 50 50\n' +
'N:The drum beat should start on the first full measure.\n' +
'N:The drum beat should drop out in the second line.\n' +
'N:The drum beat pattern should change for the third line.\n' +
'K:A\n' +
'V:1\n' +
'%%MIDI drumon\n' +
'e|a/g/ f/e/ c3/2 B/|Azzz|z4|z/c/ z/d/ z/e/ z/f/|\n' +
'%%MIDI drumoff\n' +
'|a/g/ f/e/ c3/2 B/|Azzz|[I:MIDI drumon]z4|z/c/ z/d/ z/e/ z/f/|\n' +
'%%MIDI drum d2z/d/d 35 38 38 100 50 50\n' +
'|a/g/ f/e/ c3/2 B/|Azzz|z4|z/c/ z/d/ z/e/ z/f/|\n';

	var expectedDrum = {
		"tempo":60,
		"instrument":0,
		"totalDuration":12.25,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":76,"volume":85,"start":0,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":81,"volume":105,"start":0.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":80,"volume":85,"start":0.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":95,"start":0.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":0.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":95,"start":0.75,"duration":0.375,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":85,"start":1.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":105,"start":1.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":85,"start":3.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":3.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":3.875,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":85,"start":4.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":81,"volume":105,"start":4.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":80,"volume":85,"start":4.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":95,"start":4.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":4.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":95,"start":4.75,"duration":0.375,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":85,"start":5.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":105,"start":5.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":85,"start":7.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":7.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":7.875,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":85,"start":8.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":81,"volume":105,"start":8.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":80,"volume":85,"start":8.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":95,"start":8.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":8.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":95,"start":8.75,"duration":0.375,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":85,"start":9.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":105,"start":9.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":85,"start":11.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":11.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":11.875,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":85,"start":12.125,"duration":0.125,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":2,"instrument":128},
				{"cmd":"note","pitch":76,"volume":50,"start":0.25,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":0.5,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":0.75,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":1,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":76,"volume":50,"start":1.25,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":1.5,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":1.75,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":2,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":76,"volume":50,"start":2.25,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":2.5,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":2.75,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":3,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":76,"volume":50,"start":3.25,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":3.5,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":3.75,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":4,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":76,"volume":50,"start":6.25,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":6.5,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":6.75,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":7,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":76,"volume":50,"start":7.25,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":7.5,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":7.75,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":8,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":35,"volume":100,"start":8.25,"duration":0.5,"gap":0,"instrument":128},
				{"cmd":"note","pitch":38,"volume":50,"start":8.875,"duration":0.125,"gap":0,"instrument":128},
				{"cmd":"note","pitch":38,"volume":50,"start":9,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":35,"volume":100,"start":9.25,"duration":0.5,"gap":0,"instrument":128},
				{"cmd":"note","pitch":38,"volume":50,"start":9.875,"duration":0.125,"gap":0,"instrument":128},
				{"cmd":"note","pitch":38,"volume":50,"start":10,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":35,"volume":100,"start":10.25,"duration":0.5,"gap":0,"instrument":128},
				{"cmd":"note","pitch":38,"volume":50,"start":10.875,"duration":0.125,"gap":0,"instrument":128},
				{"cmd":"note","pitch":38,"volume":50,"start":11,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":35,"volume":100,"start":11.25,"duration":0.5,"gap":0,"instrument":128},
				{"cmd":"note","pitch":38,"volume":50,"start":11.875,"duration":0.125,"gap":0,"instrument":128},
				{"cmd":"note","pitch":38,"volume":50,"start":12,"duration":0.25,"gap":0,"instrument":128}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcTranspose = 'X: 1\n' +
'M: 4/4\n' +
'L: 1/4\n' +
'K: Em\n' +
'V: 1 transpose=-2\n' +
'"Em"EGAB|\n' +
'V: 2\n' +
'"Em"EGAB|\n' +
'V: 3 transpose=4\n' +
'"Em"EGAB|\n';

	var expectedTranspose = {
		"tempo":180,"instrument":0,"totalDuration":1,"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":95,"start":0.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":95,"start":0.75,"duration":0.25,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":64,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":0.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":95,"start":0.75,"duration":0.25,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":2,"instrument":0},
				{"cmd":"note","pitch":68,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":95,"start":0.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":75,"volume":95,"start":0.75,"duration":0.25,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":3,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":53,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":33,"volume":64,"start":0.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":53,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcTempoChange = 'X:1\n' +
'L:1/4\n' +
'M:C|\n' +
'Q:1/2=60\n' +
'K:D\n' +
'"D"DEFG| [Q:1/2=90] DEFG |\n';

	var expectedTempoChange = {
		"tempo":60,
		"instrument":0,
		"totalDuration":1.666668,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":0.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":66,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":0.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":105,"start":1,"duration":0.166667,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":1.166667,"duration":0.166667,"instrument":0,"gap":0},
				{"cmd":"note","pitch":66,"volume":85,"start":1.333334,"duration":0.166667,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":1.500001,"duration":0.166667,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":0,"duration":0.25,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":0.5,"duration":0.25,"gap":0,"instrument":0},
				{"cmd":"note","pitch":54,"volume":48,"start":0.5,"duration":0.25,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":0.5,"duration":0.25,"gap":0,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":1,"duration":0.166667,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":1.333332,"duration":0.166667,"gap":0,"instrument":0},
				{"cmd":"note","pitch":54,"volume":48,"start":1.333332,"duration":0.166667,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":1.333332,"duration":0.166667,"gap":0,"instrument":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcTempoChange2 = 'X:1\n' +
'L:1/4\n' +
'M:4/4\n' +
'K:F\n' +
'[Q:1/4=129.0476605]CDEF |[Q:1/4=127]GABc | [Q:1/4=131] CDEF |[Q:1/4=130] GABc |[Q:1/4=127]CDEF |\n' ;

	var expectedTempoChange2 = {
		"tempo":180,
		"instrument":0,
		"totalDuration":6.988656,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":105,"start":0,"duration":0.348837,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":85,"start":0.348837,"duration":0.348837,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":0.697674,"duration":0.348837,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":85,"start":1.046511,"duration":0.348837,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":105,"start":1.395348,"duration":0.354331,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":85,"start":1.749679,"duration":0.354331,"instrument":0,"gap":0},
				{"cmd":"note","pitch":70,"volume":85,"start":2.10401,"duration":0.354331,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":2.458341,"duration":0.354331,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":105,"start":2.812672,"duration":0.343511,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":85,"start":3.156183,"duration":0.343511,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":3.499694,"duration":0.343511,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":85,"start":3.843205,"duration":0.343511,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":105,"start":4.186716,"duration":0.346154,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":85,"start":4.53287,"duration":0.346154,"instrument":0,"gap":0},
				{"cmd":"note","pitch":70,"volume":85,"start":4.879024,"duration":0.346154,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":5.225178,"duration":0.346154,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":105,"start":5.571332,"duration":0.354331,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":85,"start":5.925663,"duration":0.354331,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":6.279994,"duration":0.354331,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":85,"start":6.634325,"duration":0.354331,"instrument":0,"gap":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcDecoration = 'X:1\n' +
'M:4/4\n' +
'L:1/4\n' +
'Q:1/4=90\n' +
'K:C\n' +
'%%MIDI program 3\n' +
'!trill! e !lowermordent! d !uppermordent! c !mordent! B | !accent!A .G !turn! g !roll! a | !slide! d  !/! G  !//! G   !///! G |\n' +
'[Q:1/4=180] !trill! e !lowermordent! d !uppermordent! c !mordent! B | !accent!A .G !turn! g !roll! a | !slide! d  !/! G  !//! G   !///! G |\n' +
'[Q:1/4=60] !trill! e !lowermordent! d !uppermordent! c !mordent! B | !accent!A .G !turn! g !roll! a | !slide! d  !/! G  !//! G   !///! G |\n';

	var expectedDecoration = {
		"tempo":90,
		"instrument":3,
		"totalDuration":9,
		"tracks":[
			[
				// TODO-PER: also handle the slide and the drum rolls.
				{"cmd":"program","channel":0,"instrument":3},
				{"cmd":"note","pitch":77,"volume":105,"start":0,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":0.03125,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":77,"volume":105,"start":0.0625,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":0.09375,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":77,"volume":105,"start":0.125,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":0.15625,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":77,"volume":105,"start":0.1875,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":0.21875,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":74,"volume":95,"start":0.25,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":73,"volume":95,"start":0.28125,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":74,"volume":95,"start":0.3125,"duration":0.1875,"gap":0,"instrument":3},
				{"cmd":"note","pitch":72,"volume":95,"start":0.5,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":73,"volume":95,"start":0.53125,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":72,"volume":95,"start":0.5625,"duration":0.1875,"gap":0,"instrument":3},
				{"cmd":"note","pitch":71,"volume":95,"start":0.75,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":72,"volume":95,"start":0.78125,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":71,"volume":95,"start":0.8125,"duration":0.1875,"gap":0,"instrument":3},
				{"cmd":"note","pitch":69,"volume":127,"start":1,"duration":0.25,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":1.25,"duration":0.25,"instrument":3,"endType":"staccato","gap":0.15000000000000002},
				{"cmd":"note","pitch":79,"volume":95,"start":1.5,"duration":0.05,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":80,"volume":95,"start":1.55,"duration":0.05,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":79,"volume":95,"start":1.6,"duration":0.05,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":80,"volume":95,"start":1.65,"duration":0.05,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":79,"volume":95,"start":1.7,"duration":0.05,"gap":0,"instrument":3},
				{"cmd":"note","pitch":81,"volume":95,"start":1.75,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":81,"volume":95,"start":1.8125,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":81,"volume":95,"start":1.875,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":81,"volume":95,"start":1.9375,"duration":0.03125,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":74,"volume":105,"start":2,"duration":0.25,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":2.25,"duration":0.25,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":2.5,"duration":0.25,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":2.75,"duration":0.25,"instrument":3,"gap":0},
				{"cmd":"note","pitch":77,"volume":105,"start":3,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":3.015625,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":77,"volume":105,"start":3.03125,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":3.046875,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":77,"volume":105,"start":3.0625,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":3.078125,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":77,"volume":105,"start":3.09375,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":3.109375,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":74,"volume":85,"start":3.125,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":73,"volume":85,"start":3.140625,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":74,"volume":85,"start":3.15625,"duration":0.09375,"gap":0,"instrument":3},
				{"cmd":"note","pitch":72,"volume":95,"start":3.25,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":73,"volume":95,"start":3.265625,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":72,"volume":95,"start":3.28125,"duration":0.09375,"gap":0,"instrument":3},
				{"cmd":"note","pitch":71,"volume":85,"start":3.375,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":72,"volume":85,"start":3.390625,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":71,"volume":85,"start":3.40625,"duration":0.09375,"gap":0,"instrument":3},
				{"cmd":"note","pitch":69,"volume":127,"start":3.5,"duration":0.125,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":3.625,"duration":0.125,"instrument":3,"endType":"staccato","gap":0.07500000000000001},
				{"cmd":"note","pitch":79,"volume":95,"start":3.75,"duration":0.025,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":80,"volume":95,"start":3.775,"duration":0.025,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":79,"volume":95,"start":3.8,"duration":0.025,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":80,"volume":95,"start":3.825,"duration":0.025,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":79,"volume":95,"start":3.85,"duration":0.025,"gap":0,"instrument":3},
				{"cmd":"note","pitch":81,"volume":85,"start":3.875,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":81,"volume":85,"start":3.90625,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":81,"volume":85,"start":3.9375,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":81,"volume":85,"start":3.96875,"duration":0.015625,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":74,"volume":105,"start":4,"duration":0.125,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":4.125,"duration":0.125,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":4.25,"duration":0.125,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":4.375,"duration":0.125,"instrument":3,"gap":0},
				{"cmd":"note","pitch":77,"volume":105,"start":4.5,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":4.546875,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":77,"volume":105,"start":4.59375,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":4.640625,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":77,"volume":105,"start":4.6875,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":4.734375,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":77,"volume":105,"start":4.78125,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":76,"volume":105,"start":4.828125,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":74,"volume":85,"start":4.875,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":73,"volume":85,"start":4.921875,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":74,"volume":85,"start":4.96875,"duration":0.28125,"gap":0,"instrument":3},
				{"cmd":"note","pitch":72,"volume":95,"start":5.25,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":73,"volume":95,"start":5.296875,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":72,"volume":95,"start":5.34375,"duration":0.28125,"gap":0,"instrument":3},
				{"cmd":"note","pitch":71,"volume":85,"start":5.625,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":72,"volume":85,"start":5.671875,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":71,"volume":85,"start":5.71875,"duration":0.28125,"gap":0,"instrument":3},
				{"cmd":"note","pitch":69,"volume":127,"start":6,"duration":0.375,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":6.375,"duration":0.375,"instrument":3,"endType":"staccato","gap":0.22500000000000003},
				{"cmd":"note","pitch":79,"volume":95,"start":6.75,"duration":0.075,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":80,"volume":95,"start":6.825,"duration":0.075,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":79,"volume":95,"start":6.9,"duration":0.075,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":80,"volume":95,"start":6.975,"duration":0.075,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":79,"volume":95,"start":7.05,"duration":0.075,"gap":0,"instrument":3},
				{"cmd":"note","pitch":81,"volume":85,"start":7.125,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":81,"volume":85,"start":7.21875,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":81,"volume":85,"start":7.3125,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":81,"volume":85,"start":7.40625,"duration":0.046875,"gap":0,"instrument":3, "style": "decoration"},
				{"cmd":"note","pitch":74,"volume":105,"start":7.5,"duration":0.375,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":7.875,"duration":0.375,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":8.25,"duration":0.375,"instrument":3,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":8.625,"duration":0.375,"instrument":3,"gap":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcMeterChange = 'X:1\n' +
'T: chords meter change\n' +
'L:1/4\n' +
'Q:1/4=40\n' +
'M:3/4\n' +
'K:F\n' +
'"F"F2A|[M:4/4]"Bb"Bd2f|\n';

	var expectedMeterChange = {
		"tempo":40,
		"instrument":0,
		"totalDuration":1.75,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":65,"volume":105,"start":0,"duration":0.5,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":70,"volume":105,"start":0.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":1,"duration":0.5,"instrument":0,"gap":0},
				{"cmd":"note","pitch":77,"volume":95,"start":1.5,"duration":0.25,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":41,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":53,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":53,"volume":48,"start":0.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":0.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":48,"start":0.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":34,"volume":64,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":46,"volume":48,"start":1,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":1,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":53,"volume":48,"start":1,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":29,"volume":64,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":46,"volume":48,"start":1.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":1.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":53,"volume":48,"start":1.5,"duration":0.125,"gap":0,"instrument":0},
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcBreak = 'X:1\n' +
'L:1/4\n' +
'Q:1/4=40\n' +
'K:A\n' +
'"E7"Bcde|"A"f"^break"efe|"E7"Bc"^ignore"de|\n';

	var expectedBreak = {
		"tempo": 40,
		"instrument": 0,
		"totalDuration": 3,
		"tracks": [
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":71,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":95,"start":0.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":95,"start":0.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":105,"start":1,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":95,"start":1.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":95,"start":1.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":95,"start":1.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":105,"start":2,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":95,"start":2.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":2.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":95,"start":2.75,"duration":0.25,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":40,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":56,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":35,"volume":64,"start":0.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":56,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":33,"volume":64,"start":1,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":40,"volume":64,"start":2,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":56,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":35,"volume":64,"start":2.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":56,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0}]		]
	};

	//////////////////////////////////////////////////////////

	var abcBreak2 = 'X:1\n' +
'L:1/8\n' +
'Q:135\n' +
'K:Ab\n' +
'"Eb7"zG2GA2A2|=A2AB-B4|"Ab"z"^break"c2cd2d2|=d2de2c2=c|\n';

	var expectedBreak2 = {
		"tempo":135,
		"instrument":0,
		"totalDuration":4,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":67,"volume":85,"start":0.125,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":0.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":68,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":68,"volume":95,"start":0.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":105,"start":1,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":95,"start":1.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":70,"volume":85,"start":1.375,"duration":0.625,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":2.125,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":2.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":95,"start":2.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":95,"start":2.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":105,"start":3,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":3.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":75,"volume":85,"start":3.375,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":3.625,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":3.875,"duration":0.125,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":39,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":51,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":58,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":61,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":34,"volume":64,"start":0.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":51,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":58,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":61,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":39,"volume":64,"start":1,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":51,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":58,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":61,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":34,"volume":64,"start":1.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":51,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":58,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":61,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":32,"volume":64,"start":2,"duration":0.125,"gap":0,"instrument":0}]
		]
	};

	//////////////////////////////////////////////////////////

	var abcEndChord = 'X:1\n' +
'L:1/4\n' +
'Q:135\n' +
'K:C\n' +
'"C"c4-|c|]\n';

	var expectedEndChord = {
		"tempo":135,
		"instrument":0,
		"totalDuration":1.25,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":72,"volume":105,"start":0,"duration":1.25,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":36,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":0.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":1,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":1,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1,"duration":0.125,"gap":0,"instrument":0},
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcMidMeasureChordChange = 'X:1\n' +
'K: Gmin\n' +
'|: "Gm" GFDF GFDF | GF D2 "F" C4 |\n';

	var expectedMidMeasureChordChange = {
		"tempo":180,
		"instrument":0,
		"totalDuration":2,
		"tracks":
		[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":67,"volume":105,"start":0,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":85,"start":0.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":95,"start":0.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":85,"start":0.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":0.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":85,"start":0.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":95,"start":0.75,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":85,"start":0.875,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":105,"start":1,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":85,"start":1.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":95,"start":1.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":95,"start":1.5,"duration":0.5,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":43,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":58,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":0.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":58,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":43,"volume":64,"start":1,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":58,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":41,"volume":64,"start":1.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":53,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcGrace = 'X:1\n' +
'T: midi-grace-notes\n' +
'L:1/4\n' +
'Q:1/4=40\n' +
'K:A\n' +
'{e}a|:{e}gz{e}ag|{efg}ag{ABcdefg}ag:|\n' +
'{B}e{B2c/d/}fef|[K:Bb]{Bcde}f2{Bcde}f2|]\n';

	var expectedGrace = {
		"tempo":40,
		"instrument":0,
		"totalDuration":6.25,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":76,"volume":57,"start":0,"duration":0.125,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":81,"volume":85,"start":0.125,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":76,"volume":70,"start":0.25,"duration":0.125,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":80,"volume":105,"start":0.375,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":76,"volume":63,"start":0.75,"duration":0.125,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":81,"volume":95,"start":0.875,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":80,"volume":95,"start":1,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":76,"volume":70,"start":1.25,"duration":0.041666666666666664,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":78,"volume":70,"start":1.2916666666666667,"duration":0.041666666666666664,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":80,"volume":70,"start":1.3333333333333335,"duration":0.041666666666666664,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":81,"volume":105,"start":1.375,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":80,"volume":95,"start":1.5,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":69,"volume":63,"start":1.75,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":71,"volume":63,"start":1.7678571428571428,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":73,"volume":63,"start":1.7857142857142856,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":74,"volume":63,"start":1.8035714285714284,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":76,"volume":63,"start":1.8214285714285712,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":78,"volume":63,"start":1.839285714285714,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":80,"volume":63,"start":1.8571428571428568,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":81,"volume":95,"start":1.875,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":80,"volume":95,"start":2,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":76,"volume":70,"start":2.25,"duration":0.125,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":80,"volume":105,"start":2.375,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":76,"volume":63,"start":2.75,"duration":0.125,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":81,"volume":95,"start":2.875,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":80,"volume":95,"start":3,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":76,"volume":70,"start":3.25,"duration":0.041666666666666664,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":78,"volume":70,"start":3.2916666666666667,"duration":0.041666666666666664,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":80,"volume":70,"start":3.333333333333333,"duration":0.041666666666666664,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":81,"volume":105,"start":3.375,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":80,"volume":95,"start":3.5,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":69,"volume":63,"start":3.75,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":71,"volume":63,"start":3.7678571428571428,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":73,"volume":63,"start":3.7857142857142856,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":74,"volume":63,"start":3.8035714285714284,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":76,"volume":63,"start":3.8214285714285712,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":78,"volume":63,"start":3.839285714285714,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":80,"volume":63,"start":3.8571428571428568,"duration":0.017857142857142856,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":81,"volume":95,"start":3.875,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":80,"volume":95,"start":4,"duration":0.25,"instrument":0,"gap":0},
//
				{"cmd":"note","pitch":71,"volume":70,"start":4.25,"duration":0.125,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":76,"volume":105,"start":4.375,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":71,"volume":63,"start":4.5,"duration":0.08333333333333333,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":73,"volume":63,"start":4.583333333333333,"duration":0.020833333333333332,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":74,"volume":63,"start":4.604166666666666,"duration":0.020833333333333332,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":78,"volume":95,"start":4.625,"duration":0.125,"instrument":0,"gap":0},

				{"cmd":"note","pitch":76,"volume":95,"start":4.75,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":78,"volume":95,"start":5,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":70,"volume":70,"start":5.25,"duration":0.0625,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":72,"volume":70,"start":5.3125,"duration":0.0625,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":74,"volume":70,"start":5.375,"duration":0.0625,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":75,"volume":70,"start":5.4375,"duration":0.0625,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":77,"volume":105,"start":5.5,"duration":0.25,"instrument":0,"gap":0},

				{"cmd":"note","pitch":70,"volume":63,"start":5.75,"duration":0.0625,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":72,"volume":63,"start":5.8125,"duration":0.0625,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":74,"volume":63,"start":5.875,"duration":0.0625,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":75,"volume":63,"start":5.9375,"duration":0.0625,"gap":0,"instrument":0, "style": "grace"},
				{"cmd":"note","pitch":77,"volume":95,"start":6,"duration":0.25,"instrument":0,"gap":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcMidiOptions = 'X:1\n' +
'%%MIDI program 40\n' +
'%%MIDI channel 4\n' +
'%%MIDI transpose -2\n' +
'L:1/4\n' +
'Q:1/4=40\n' +
'K:A\n' +
'ABcd|\n';

	var expectedMidiOptions = {
		"tempo":40,
		"instrument":40,
		"totalDuration":1,
		"tracks":
			[
				[
					{"cmd":"program","channel":4,"instrument":40},
					{"cmd":"note","pitch":67,"volume":105,"start":0,"duration":0.25,"instrument":40,"gap":0},
					{"cmd":"note","pitch":69,"volume":95,"start":0.25,"duration":0.25,"instrument":40,"gap":0},
					{"cmd":"note","pitch":71,"volume":95,"start":0.5,"duration":0.25,"instrument":40,"gap":0},
					{"cmd":"note","pitch":72,"volume":95,"start":0.75,"duration":0.25,"instrument":40,"gap":0}
					]
			]
	};

	//////////////////////////////////////////////////////////

	var abcMultiMeasureRest = 'X:1\n' +
'M:4/4\n' +
'L:1/4\n' +
'Q:1/4=130\n' +
'K:Bb\n' +
'cdef|Z4|fedc|\n';

	var expectedMultiMeasureRest = {
		"tempo":130,
		"instrument":0,
		"totalDuration":6,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":72,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":0.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":75,"volume":95,"start":0.50,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":77,"volume":95,"start":0.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":77,"volume":105,"start":5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":75,"volume":95,"start":5.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":5.50,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":95,"start":5.75,"duration":0.25,"instrument":0,"gap":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcOctaveClefs = 'X:1\n' +
'M:4/4\n' +
'K:C\n' +
"[K: treble+8]{B}A4 [CE^F]4 | [K: treble-8]G8| G,2B,2 c'2e'2 | [K: bass-8]C8| [K: bass+8]B,8|\n";

	var expectedOctaveClefs = {
		"tempo": 180,
		"instrument": 0,
		"totalDuration": 5,
		"tracks": [
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":83,"volume":70,"start":0,"duration":0.25,"instrument":0,"gap":0, "style": "grace"},
				{"cmd":"note","pitch":81,"volume":105,"start":0.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":95,"start":0.5,"duration":0.5,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":95,"start":0.5,"duration":0.5,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":95,"start":0.5,"duration":0.5,"instrument":0,"gap":0},
				{"cmd":"note","pitch":55,"volume":105,"start":1,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":43,"volume":105,"start":2,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":47,"volume":95,"start":2.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":95,"start":2.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":95,"start":2.75,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":48,"volume":105,"start":3,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":105,"start":4,"duration":1,"instrument":0,"gap":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcOverlay = 'X:1\n' +
'M: 4/4\n' +
'L: 1/4\n' +
'K:C\n' +
'C4 | D4 |\n' +
'G4 & E4 | A4 & F4 |\n' +
'B4 & d4 & f4 | c4 & e4 & g4 |\n' +
"a4 | b4 & d'4 |\n" +
'C4 | D4 | E4 & G4 | A4 | B4 & d4 |\n';

	var expectedOverlay = {
		"tempo": 180,
		"instrument": 0,
		"totalDuration": 13,
		"tracks": [
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":105,"start":0,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":105,"start":1,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":105,"start":2,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":105,"start":3,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":105,"start":4,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":105,"start":5,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":81,"volume":105,"start":6,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":83,"volume":105,"start":7,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":105,"start":8,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":105,"start":9,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":105,"start":10,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":105,"start":11,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":105,"start":12,"duration":1,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":64,"volume":95,"start":2,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":105,"start":3,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":105,"start":4,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":105,"start":5,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":86,"volume":105,"start":7,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":105,"start":10,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":105,"start":12,"duration":1,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":2,"instrument":0},
				{"cmd":"note","pitch":77,"volume":95,"start":4,"duration":1,"instrument":0,"gap":0},
				{"cmd":"note","pitch":79,"volume":105,"start":5,"duration":1,"instrument":0,"gap":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcPercMap = 'X:1\n' +
'%%percmap D  pedal-hi-hat x\n' +
'%%percmap E  bass-drum-1\n' +
'%%percmap F  acoustic-bass-drum\n' +
'%%percmap G  low-floor-tom\n' +
'%%percmap A  high-floor-tom\n' +
'%%percmap B  low-tom\n' +
'%%percmap ^B tambourine   triangle\n' +
'%%percmap c  acoustic-snare\n' +
'%%percmap _c electric-snare\n' +
'%%percmap ^c low-wood-block   triangle\n' +
'%%percmap =c side-stick\n' +
'%%percmap d  low-mid-tom\n' +
'%%percmap ^d hi-wood-block    triangle\n' +
'%%percmap e  hi-mid-tom\n' +
'%%percmap ^e cowbell      triangle\n' +
'%%percmap f  high-tom\n' +
'%%percmap ^f ride-cymbal-1\n' +
'%%percmap g  closed-hi-hat\n' +
'%%percmap ^g open-hi-hat\n' +
'%%percmap a  crash-cymbal-1  x\n' +
'%%percmap ^a open-triangle     triangle\n' +
'Q:1/4=50\n' +
'K:C perc\n' +
'DEFG AB^Bc _c{^c}^c=cd ^de^ef ^fg^ga ^a\n';

	var expectedPercMap = {
		"tempo":50,"instrument":128,"totalDuration":2.625,"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":128},
				{"cmd":"note","pitch":44,"volume":85,"start":0,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":36,"volume":85,"start":0.125,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":35,"volume":85,"start":0.25,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":41,"volume":85,"start":0.375,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":43,"volume":85,"start":0.5,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":45,"volume":85,"start":0.625,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":54,"volume":95,"start":0.75,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":85,"start":0.875,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":40,"volume":95,"start":1,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":77,"volume":57,"start":1.125,"duration":0.0625,"instrument":128,"gap":0,"style":"grace"},
				{"cmd":"note","pitch":77,"volume":85,"start":1.1875,"duration":0.0625,"instrument":128,"gap":0},
				{"cmd":"note","pitch":37,"volume":95,"start":1.25,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":47,"volume":85,"start":1.375,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":76,"volume":95,"start":1.5,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":48,"volume":85,"start":1.625,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":56,"volume":95,"start":1.75,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":50,"volume":85,"start":1.875,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":51,"volume":95,"start":2,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":42,"volume":85,"start":2.125,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":46,"volume":95,"start":2.25,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":49,"volume":85,"start":2.375,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":81,"volume":95,"start":2.5,"duration":0.125,"instrument":128,"gap":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcPercMapHighC = 'X:1\n' +
		"%%percmap ^c' high-tom  x\n" +
		"%%percmap c' high-tom  x\n" +
		"%%percmap b high-tom  x\n" +
		'%%percmap C high-tom  x\n' +
		'Q:1/4=50\n' +
		'K:C perc\n' +
		"b c' C ^c' C \n";

	var expectedPercMapHighC = {
		"tempo":50,"instrument":128,"totalDuration":0.625,"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":128},
				{"cmd":"note","pitch":50,"volume":85,"start":0,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":50,"volume":85,"start":0.125,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":50,"volume":85,"start":0.25,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":50,"volume":85,"start":0.375,"duration":0.125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":50,"volume":85,"start":0.5,"duration":0.125,"instrument":128,"gap":0}
			]
		]
	}

	//////////////////////////////////////////////////////////

	var abcLongTie = 'X:1\n' +
'L:1/4\n' +
'Q:80\n' +
'K:A\n' +
'cd-d2-|d2-dz|\n';

	var expectedLongTie = {
		"tempo": 80,
		"instrument": 0,
		"totalDuration": 2,
		"tracks": [
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":73,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":0.25,"duration":1.5,"instrument":0,"gap":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcRegularTie = 'X:1\n' +
'M:4/4\n' +
'L:1/8\n' +
'Q:1/4=150\n' +
'K:Bb\n' +
'GBcd-d4|zcdc dc3:|\n';

	var expectedRegularTie = {
		"tempo":150,
		"instrument":0,
		"totalDuration":4,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":67,"volume":105,"start":0,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":70,"volume":85,"start":0.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":95,"start":0.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":0.375,"duration":0.625,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":1.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":1.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":1.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":1.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":1.625,"duration":0.375,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":105,"start":2,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":70,"volume":85,"start":2.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":95,"start":2.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":2.375,"duration":0.625,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":3.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":3.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":3.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":3.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":3.625,"duration":0.375,"instrument":0,"gap":0},
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcTripletChords = 'X:1\n' +
'T:triplets-and-chord-rhythm\n' +
'M: 4/4\n' +
'L: 1/8\n' +
'Q: 80\n' +
'"C" (3 C2 D2 E2 "G/G" (3 F2 E2 D2 |\n' +
'"C" (3 CA,G, (3 CDE "C" (3 EEE (3 GGG |\n' +
'"C" (3 CDE (3 FED (3 CDE (3 FED |\n' +
'"C" (3 CDC (3 EFE "D" (3 GAG (3 cdc |\n';

	var expectedTripletChords = {
		"tempo":80,
		"instrument":0,
		"totalDuration":4,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":60,"volume":105,"start":0,"duration":0.166667,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":85,"start":0.166667,"duration":0.166667,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":0.333334,"duration":0.166666,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":95,"start":0.5,"duration":0.166667,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":0.666667,"duration":0.166667,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":85,"start":0.833334,"duration":0.166666,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":105,"start":1,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":57,"volume":85,"start":1.083333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":55,"volume":85,"start":1.166666,"duration":0.083334,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":95,"start":1.25,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":85,"start":1.333333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":1.416666,"duration":0.083334,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":95,"start":1.5,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":1.583333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":1.666666,"duration":0.083334,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":1.75,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":1.833333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":1.916666,"duration":0.083334,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":105,"start":2,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":85,"start":2.083333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":2.166666,"duration":0.083334,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":95,"start":2.25,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":2.333333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":85,"start":2.416666,"duration":0.083334,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":95,"start":2.5,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":85,"start":2.583333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":2.666666,"duration":0.083334,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":95,"start":2.75,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":2.833333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":85,"start":2.916666,"duration":0.083334,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":105,"start":3,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":62,"volume":85,"start":3.083333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":60,"volume":85,"start":3.166666,"duration":0.083334,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":95,"start":3.25,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":65,"volume":85,"start":3.333333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":64,"volume":85,"start":3.416666,"duration":0.083334,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":3.5,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":85,"start":3.583333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":85,"start":3.666666,"duration":0.083334,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":95,"start":3.75,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":3.833333,"duration":0.083333,"instrument":0,"gap":0},
				{"cmd":"note","pitch":72,"volume":85,"start":3.916666,"duration":0.083334,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":36,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":43,"volume":64,"start":0.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":36,"volume":64,"start":1,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":1.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":36,"volume":64,"start":2,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":2.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":36,"volume":64,"start":3,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":3.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":3.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":3.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":3.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":50,"volume":48,"start":3.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":54,"volume":48,"start":3.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":57,"volume":48,"start":3.75,"duration":0.125,"gap":0,"instrument":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcSnare = 'X:1\n' +
'V:SnareDrum stem=up stafflines=1\n' +
'K:C clef=perc\n' +
'%%MIDI channel 10\n' +
'%%MIDI drummap B 38\n' +
'!f!B2 z2  B/4B/4B/4B/4 B/4B/4B/4B/4 B/4B/4B/4B/4 B/4B/4B/4B/4 B/4B/4B/4B/4 | B/4B/4B/4B/4 !>!B2 {/B}B4|\n';

	var expectedSnare = {
		"tempo":180,
		"instrument":128,
		"totalDuration":2,
		"tracks":[
			[
				{"cmd":"program","channel":10,"instrument":128},
				{"cmd":"note","pitch":38,"volume":80,"start":0,"duration":0.25,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":95,"start":0.5,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.53125,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.5625,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.59375,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.625,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.65625,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.6875,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.71875,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":95,"start":0.75,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.78125,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.8125,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.84375,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.875,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.90625,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.9375,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":0.96875,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":95,"start":1,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":1.03125,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":1.0625,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":1.09375,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":105,"start":1.125,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":1.15625,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":1.1875,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":80,"start":1.21875,"duration":0.03125,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":120,"start":1.25,"duration":0.25,"instrument":128,"gap":0},
				{"cmd":"note","pitch":38,"volume":53,"start":1.5,"duration":0.25,"gap":0,"instrument":128, "style": "grace"},
				{"cmd":"note","pitch":38,"volume":80,"start":1.75,"duration":0.25,"instrument":128,"gap":0}
			]
		]
	};

	//////////////////////////////////////////////////////////

	var abcMetronome = 'X:1\n' +
'L:1/4\n' +
'Q:1/4=60\n' +
'%%MIDI drum dddd 76 77 77 77 50 50 50 50\n' +
'M:4/4\n' +
'K:A\n' +
'V:1\n' +
'%%MIDI drumon\n' +
'e|a/g/ f/e/ c3/2 B/|Azzz|\n';

	var expectedMetronome = {
		"tempo":60,
		"instrument":0,
		"totalDuration":2.25,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":76,"volume":85,"start":0,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":81,"volume":105,"start":0.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":80,"volume":85,"start":0.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":78,"volume":95,"start":0.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":0.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":73,"volume":95,"start":0.75,"duration":0.375,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":85,"start":1.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":105,"start":1.25,"duration":0.25,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":2,"instrument":128},
				{"cmd":"note","pitch":76,"volume":50,"start":0.25,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":0.5,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":0.75,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":1,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":76,"volume":50,"start":1.25,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":1.5,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":1.75,"duration":0.25,"gap":0,"instrument":128},
				{"cmd":"note","pitch":77,"volume":50,"start":2,"duration":0.25,"gap":0,"instrument":128}
			]
		]
	};
	//////////////////////////////////////////////////////////

	var abcTwelveEight = 'X: 1\n' +
		'M: 12/8\n' +
		'K: Ador\n' +
		'|:"Am" A2e e2d "G" BAB d2B | "Am" A2e e2d "G" B2A GAB |\n';

	var expectedTwelveEight = {
		"tempo":180,
		"instrument":0,
		"totalDuration":3,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0},
				{"cmd":"note","pitch":69,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":0.25,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":95,"start":0.375,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":0.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":95,"start":0.75,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":85,"start":0.875,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":85,"start":1,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":95,"start":1.125,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":85,"start":1.375,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":105,"start":1.5,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":85,"start":1.75,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":76,"volume":95,"start":1.875,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":74,"volume":85,"start":2.125,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":95,"start":2.25,"duration":0.25,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":85,"start":2.5,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":67,"volume":95,"start":2.625,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":69,"volume":85,"start":2.75,"duration":0.125,"instrument":0,"gap":0},
				{"cmd":"note","pitch":71,"volume":85,"start":2.875,"duration":0.125,"instrument":0,"gap":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":33,"volume":64,"start":0,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":45,"volume":48,"start":0.25,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":0.25,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":0.25,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":28,"volume":64,"start":0.375,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":45,"volume":48,"start":0.625,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":0.625,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":0.625,"duration":0.0625,"gap":0,"instrument":0},

				{"cmd":"note","pitch":43,"volume":64,"start":0.75,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":1,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":1,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":1.125,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1.375,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":1.375,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":1.375,"duration":0.0625,"gap":0,"instrument":0},

				{"cmd":"note","pitch":33,"volume":64,"start":1.5,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":45,"volume":48,"start":1.75,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":1.75,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":1.75,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":28,"volume":64,"start":1.875,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":45,"volume":48,"start":2.125,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":2.125,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":2.125,"duration":0.0625,"gap":0,"instrument":0},

				{"cmd":"note","pitch":43,"volume":64,"start":2.25,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":2.5,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":2.5,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":2.5,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":2.625,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":2.875,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":2.875,"duration":0.0625,"gap":0,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":2.875,"duration":0.0625,"gap":0,"instrument":0}
			]
		]

};

	//////////////////////////////////////////////////////////

	var abcTempoThreeVoices = 'X: 1\n' +
		'T: tempo-change-three-voices\n' +
		'%%score { ( 1 3 ) | 2 }\n' +
		'Q:1/4=70\n' +
		'M: 4/4\n' +
		'L: 1/8\n' +
		'K: C\n' +
		'V:1 clef=treble\n' +
		'V:3 clef=treble\n' +
		'V:2 clef=bass\n' +
		'V:1\n' +
		'a2b2c\'2b2 | [Q:1/4=80] a2b2c\'2b2 | a2b2c\'2b2 |\n' +
		'a2b2c\'2b2 | a2b2c\'2b2 | a2b2c\'2b2 :|\n' +
		'V:3\n' +
		'E8 | F8 | A8 |\n' +
		'E8 | [Q:1/4=100] F8 | A8 :|\n' +
		'V:2\n' +
		'A,4 G,4 | A,4 G,4 |[Q:1/4=90] F,4 E,4 |\n' +
		'A,4 G,4 |  A,4 G,4 | [Q:1/4=120] F,4 E,4 :|\n';

	var expectedTempoThreeVoices = {"tempo":70,"instrument":0,"tracks":[
		[
			{"cmd":"program","channel":0,"instrument":0},
			{"cmd":"note","pitch":81,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":95,"start":0.25,"duration":0.25,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":95,"start":0.75,"duration":0.25,"instrument":0,"gap":0},
			{"cmd":"note","pitch":81,"volume":105,"start":1,"duration":0.21875,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":1.21875,"duration":0.21875,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":85,"start":1.4375,"duration":0.21875,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":1.65625,"duration":0.21875,"instrument":0,"gap":0},
			{"cmd":"note","pitch":81,"volume":105,"start":1.875,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":2.069444,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":85,"start":2.263888,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":2.458332,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":81,"volume":105,"start":2.652776,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":2.84722,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":85,"start":3.041664,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":3.236108,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":81,"volume":105,"start":3.430552,"duration":0.175,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":3.605552,"duration":0.175,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":85,"start":3.780552,"duration":0.175,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":3.955552,"duration":0.175,"instrument":0,"gap":0},
			{"cmd":"note","pitch":81,"volume":105,"start":4.130552,"duration":0.145833,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":4.276385,"duration":0.145833,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":85,"start":4.422218,"duration":0.145833,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":4.568051,"duration":0.145833,"instrument":0,"gap":0},
			{"cmd":"note","pitch":81,"volume":105,"start":4.713884,"duration":0.25,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":95,"start":4.963884,"duration":0.25,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":95,"start":5.213884,"duration":0.25,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":95,"start":5.463884,"duration":0.25,"instrument":0,"gap":0},
			{"cmd":"note","pitch":81,"volume":105,"start":5.713884,"duration":0.21875,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":5.932634,"duration":0.21875,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":85,"start":6.151384,"duration":0.21875,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":6.370134,"duration":0.21875,"instrument":0,"gap":0},
			{"cmd":"note","pitch":81,"volume":105,"start":6.588884,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":6.783328,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":85,"start":6.977772,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":7.172216,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":81,"volume":105,"start":7.36666,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":7.561104,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":85,"start":7.755548,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":7.949992,"duration":0.194444,"instrument":0,"gap":0},
			{"cmd":"note","pitch":81,"volume":105,"start":8.144436,"duration":0.175,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":8.319436,"duration":0.175,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":85,"start":8.494436,"duration":0.175,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":8.669436,"duration":0.175,"instrument":0,"gap":0},
			{"cmd":"note","pitch":81,"volume":105,"start":8.844436,"duration":0.145833,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":8.990269,"duration":0.145833,"instrument":0,"gap":0},
			{"cmd":"note","pitch":84,"volume":85,"start":9.136102,"duration":0.145833,"instrument":0,"gap":0},
			{"cmd":"note","pitch":83,"volume":85,"start":9.281935,"duration":0.145833,"instrument":0,"gap":0}
		],[
			{"cmd":"program","channel":1,"instrument":0},
			{"cmd":"note","pitch":64,"volume":105,"start":0,"duration":1,"instrument":0,"gap":0},
			{"cmd":"note","pitch":65,"volume":105,"start":1,"duration":0.875,"instrument":0,"gap":0},
			{"cmd":"note","pitch":69,"volume":105,"start":1.875,"duration":0.777778,"instrument":0,"gap":0},
			{"cmd":"note","pitch":64,"volume":105,"start":2.652778,"duration":0.777778,"instrument":0,"gap":0},
			{"cmd":"note","pitch":65,"volume":105,"start":3.430556,"duration":0.7,"instrument":0,"gap":0},
			{"cmd":"note","pitch":69,"volume":105,"start":4.130556,"duration":0.583333,"instrument":0,"gap":0},
			{"cmd":"note","pitch":64,"volume":105,"start":4.713889,"duration":1,"instrument":0,"gap":0},
			{"cmd":"note","pitch":65,"volume":105,"start":5.713889,"duration":0.875,"instrument":0,"gap":0},
			{"cmd":"note","pitch":69,"volume":105,"start":6.588889,"duration":0.777778,"instrument":0,"gap":0},
			{"cmd":"note","pitch":64,"volume":105,"start":7.366667,"duration":0.777778,"instrument":0,"gap":0},
			{"cmd":"note","pitch":65,"volume":105,"start":8.144445,"duration":0.7,"instrument":0,"gap":0},
			{"cmd":"note","pitch":69,"volume":105,"start":8.844445,"duration":0.583333,"instrument":0,"gap":0}
		],[
			{"cmd":"program","channel":2,"instrument":0},
			{"cmd":"note","pitch":57,"volume":105,"start":0,"duration":0.5,"instrument":0,"gap":0},
			{"cmd":"note","pitch":55,"volume":95,"start":0.5,"duration":0.5,"instrument":0,"gap":0},
			{"cmd":"note","pitch":57,"volume":105,"start":1,"duration":0.4375,"instrument":0,"gap":0},
			{"cmd":"note","pitch":55,"volume":85,"start":1.4375,"duration":0.4375,"instrument":0,"gap":0},
			{"cmd":"note","pitch":53,"volume":105,"start":1.875,"duration":0.388889,"instrument":0,"gap":0},
			{"cmd":"note","pitch":52,"volume":85,"start":2.263889,"duration":0.388889,"instrument":0,"gap":0},
			{"cmd":"note","pitch":57,"volume":105,"start":2.652778,"duration":0.388889,"instrument":0,"gap":0},
			{"cmd":"note","pitch":55,"volume":85,"start":3.041667,"duration":0.388889,"instrument":0,"gap":0},
			{"cmd":"note","pitch":57,"volume":105,"start":3.430556,"duration":0.35,"instrument":0,"gap":0},
			{"cmd":"note","pitch":55,"volume":85,"start":3.780556,"duration":0.35,"instrument":0,"gap":0},
			{"cmd":"note","pitch":53,"volume":105,"start":4.130556,"duration":0.291667,"instrument":0,"gap":0},
			{"cmd":"note","pitch":52,"volume":85,"start":4.422223,"duration":0.291667,"instrument":0,"gap":0},
			{"cmd":"note","pitch":57,"volume":105,"start":4.71389,"duration":0.5,"instrument":0,"gap":0},
			{"cmd":"note","pitch":55,"volume":95,"start":5.21389,"duration":0.5,"instrument":0,"gap":0},
			{"cmd":"note","pitch":57,"volume":105,"start":5.71389,"duration":0.4375,"instrument":0,"gap":0},
			{"cmd":"note","pitch":55,"volume":85,"start":6.15139,"duration":0.4375,"instrument":0,"gap":0},
			{"cmd":"note","pitch":53,"volume":105,"start":6.58889,"duration":0.388889,"instrument":0,"gap":0},
			{"cmd":"note","pitch":52,"volume":85,"start":6.977779,"duration":0.388889,"instrument":0,"gap":0},
			{"cmd":"note","pitch":57,"volume":105,"start":7.366668,"duration":0.388889,"instrument":0,"gap":0},
			{"cmd":"note","pitch":55,"volume":85,"start":7.755557,"duration":0.388889,"instrument":0,"gap":0},
			{"cmd":"note","pitch":57,"volume":105,"start":8.144446,"duration":0.35,"instrument":0,"gap":0},
			{"cmd":"note","pitch":55,"volume":85,"start":8.494446,"duration":0.35,"instrument":0,"gap":0},
			{"cmd":"note","pitch":53,"volume":105,"start":8.844446,"duration":0.291667,"instrument":0,"gap":0},
			{"cmd":"note","pitch":52,"volume":85,"start":9.136113,"duration":0.291667,"instrument":0,"gap":0}
]],"totalDuration":9.42778};

	var expectedTempoThreeVoicesTiming = [
		{"ms":0,"ln":0,"x1":81.948,"ch":[136,224,271],"x2":136.119,"midiPitches":["81 0.25","64 1","57 0.5"]},
		{"ms":857,"ln":0,"x1":136.119,"ch":[138],"x2":190.29,"midiPitches":["83 0.25"]},
		{"ms":1714,"ln":0,"x1":190.29,"ch":[140,275],"x2":244.46099999999998,"midiPitches":["84 0.25","55 0.5"]},
		{"ms":2571,"ln":0,"x1":244.46099999999998,"ch":[143],"x2":309.632,"midiPitches":["83 0.25"]},
		{"ms":3429,"ln":0,"x1":309.632,"ch":[158,228,280],"x2":363.803,"midiPitches":["81 0.21875","65 0.875","57 0.4375"]},
		{"ms":4179,"ln":0,"x1":363.803,"ch":[161],"x2":417.974,"midiPitches":["83 0.21875"]},
		{"ms":4929,"ln":0,"x1":417.974,"ch":[163,285],"x2":472.145,"midiPitches":["84 0.21875","55 0.4375"]},
		{"ms":5679,"ln":0,"x1":472.145,"ch":[166],"x2":537.316,"midiPitches":["83 0.21875"]},
		{"ms":6429,"ln":0,"x1":537.316,"ch":[170,233,300],"x2":591.4870000000001,"midiPitches":["81 0.194444","69 0.777778","53 0.388889"]},
		{"ms":7095,"ln":0,"x1":591.4870000000001,"ch":[173],"x2":645.6580000000001,"midiPitches":["83 0.194444"]},
		{"ms":7762,"ln":0,"x1":645.6580000000001,"ch":[175,305],"x2":699.8290000000002,"midiPitches":["84 0.194444","52 0.388889"]},
		{"ms":8429,"ln":0,"x1":699.8290000000002,"ch":[178],"x2":755.0000000000002,"midiPitches":["83 0.194444"]},
		{"ms":9095,"ln":1,"x1":60.153,"ch":[183,239,311],"x2":115.05691666666667,"midiPitches":["81 0.194444","64 0.777778","57 0.388889"]},
		{"ms":9762,"ln":1,"x1":115.05691666666667,"ch":[185],"x2":169.96083333333334,"midiPitches":["83 0.194444"]},
		{"ms":10429,"ln":1,"x1":169.96083333333334,"ch":[187,315],"x2":224.86475000000002,"midiPitches":["84 0.194444","55 0.388889"]},
		{"ms":11095,"ln":1,"x1":224.86475000000002,"ch":[190],"x2":290.76866666666666,"midiPitches":["83 0.194444"]},
		{"ms":11762,"ln":1,"x1":290.76866666666666,"ch":[194,255,320],"x2":345.6725833333333,"midiPitches":["81 0.175","65 0.7","57 0.35"]},
		{"ms":12362,"ln":1,"x1":345.6725833333333,"ch":[197],"x2":400.57649999999995,"midiPitches":["83 0.175"]},
		{"ms":12962,"ln":1,"x1":400.57649999999995,"ch":[199,326],"x2":455.4804166666666,"midiPitches":["84 0.175","55 0.35"]},
		{"ms":13562,"ln":1,"x1":455.4804166666666,"ch":[202],"x2":521.3843333333332,"midiPitches":["83 0.175"]},
		{"ms":14162,"ln":1,"x1":521.3843333333332,"ch":[206,260,343],"x2":576.2882499999998,"midiPitches":["81 0.145833","69 0.583333","53 0.291667"]},
		{"ms":14662,"ln":1,"x1":576.2882499999998,"ch":[209],"x2":631.1921666666665,"midiPitches":["83 0.145833"]},
		{"ms":15162,"ln":1,"x1":631.1921666666665,"ch":[211,348],"x2":686.0960833333331,"midiPitches":["84 0.145833","52 0.291667"]},
		{"ms":15662,"ln":1,"x1":686.0960833333331,"ch":[214],"x2":740.9999999999998,"midiPitches":["83 0.145833"]},


		{"ms":16162,"ln":0,"x1":81.948,"ch":[136,224,271],"x2":136.119,"midiPitches":["81 0.25","64 1","57 0.5"]},
		{"ms":17019,"ln":0,"x1":136.119,"ch":[138],"x2":190.29,"midiPitches":["83 0.25"]},
		{"ms":17876,"ln":0,"x1":190.29,"ch":[140,275],"x2":244.46099999999998,"midiPitches":["84 0.25","55 0.5"]},
		{"ms":18733,"ln":0,"x1":244.46099999999998,"ch":[143],"x2":309.632,"midiPitches":["83 0.25"]},
		{"ms":19590,"ln":0,"x1":309.632,"ch":[158,228,280],"x2":363.803,"midiPitches":["81 0.21875","65 0.875","57 0.4375"]},
		{"ms":20340,"ln":0,"x1":363.803,"ch":[161],"x2":417.974,"midiPitches":["83 0.21875"]},
		{"ms":21090,"ln":0,"x1":417.974,"ch":[163,285],"x2":472.145,"midiPitches":["84 0.21875","55 0.4375"]},
		{"ms":21840,"ln":0,"x1":472.145,"ch":[166],"x2":537.316,"midiPitches":["83 0.21875"]},
		{"ms":22590,"ln":0,"x1":537.316,"ch":[170,233,300],"x2":591.4870000000001,"midiPitches":["81 0.194444","69 0.777778","53 0.388889"]},
		{"ms":23257,"ln":0,"x1":591.4870000000001,"ch":[173],"x2":645.6580000000001,"midiPitches":["83 0.194444"]},
		{"ms":23924,"ln":0,"x1":645.6580000000001,"ch":[175,305],"x2":699.8290000000002,"midiPitches":["84 0.194444","52 0.388889"]},
		{"ms":24590,"ln":0,"x1":699.8290000000002,"ch":[178],"x2":755.0000000000002,"midiPitches":["83 0.194444"]},
		{"ms":25257,"ln":1,"x1":60.153,"ch":[183,239,311],"x2":115.05691666666667,"midiPitches":["81 0.194444","64 0.777778","57 0.388889"]},
		{"ms":25924,"ln":1,"x1":115.05691666666667,"ch":[185],"x2":169.96083333333334,"midiPitches":["83 0.194444"]},
		{"ms":26590,"ln":1,"x1":169.96083333333334,"ch":[187,315],"x2":224.86475000000002,"midiPitches":["84 0.194444","55 0.388889"]},
		{"ms":27257,"ln":1,"x1":224.86475000000002,"ch":[190],"x2":290.76866666666666,"midiPitches":["83 0.194444"]},
		{"ms":27924,"ln":1,"x1":290.76866666666666,"ch":[194,255,320],"x2":345.6725833333333,"midiPitches":["81 0.175","65 0.7","57 0.35"]},
		{"ms":28524,"ln":1,"x1":345.6725833333333,"ch":[197],"x2":400.57649999999995,"midiPitches":["83 0.175"]},
		{"ms":29124,"ln":1,"x1":400.57649999999995,"ch":[199,326],"x2":455.4804166666666,"midiPitches":["84 0.175","55 0.35"]},
		{"ms":29724,"ln":1,"x1":455.4804166666666,"ch":[202],"x2":521.3843333333332,"midiPitches":["83 0.175"]},
		{"ms":30324,"ln":1,"x1":521.3843333333332,"ch":[206,260,343],"x2":576.2882499999998,"midiPitches":["81 0.145833","69 0.583333","53 0.291667"]},
		{"ms":30824,"ln":1,"x1":576.2882499999998,"ch":[209],"x2":631.1921666666665,"midiPitches":["83 0.145833"]},
		{"ms":31324,"ln":1,"x1":631.1921666666665,"ch":[211,348],"x2":686.0960833333331,"midiPitches":["84 0.145833","52 0.291667"]},
		{"ms":31824,"ln":1,"x1":686.0960833333331,"ch":[214],"x2":754.9999999999998,"midiPitches":["83 0.145833"]}
	];

	//////////////////////////////////////////////////////////
	var abcQuarterTones = "X:1\n" +
		"T:quarter-tone2\n" +
		"M:12/8\n" +
		"Q:1/8=120\n" +
		"N: all combinations of accidentals in key sigs and in music\n" +
		"K: C ^/f _/B _A ^D\n" +
		"ABc def|_A_B_c _d_e_f ABc def|\n" +
		"_/A_/B_/c _/d_/e_/f ABc def|=A=B=c =d=e=f ABc def|\n" +
		"^/A^/B^/c ^/d^/e^/f ABc def|^A^B^c ^d^e^f ABc def|\n" +
		"^^A^^B^^c ^^d^^e^^f ABc def|__A__B__c __d__e__f ABc def|\n";

	var expectedQuarterTones = {
		"tempo": 40, "instrument": 0, "tracks": [
			[
				{"cmd": "program", "channel": 0, "instrument": 0},
				{"cmd": "note", "pitch": 68, "volume": 85, "start": 0, "duration": 0.125, "instrument": 0, "gap": 0},
				{"cmd": "note", "pitch": 71, "volume": 85, "start": 0.125, "duration": 0.125, "instrument": 0, "gap": 0, cents: -50 },
				{"cmd": "note", "pitch": 72, "volume": 85, "start": 0.25, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 75, "volume": 85, "start": 0.375, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 76, "volume": 85, "start": 0.5, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 77, "volume": 85, "start": 0.625, "duration": 0.125, "instrument": 0, "gap": 0, cents: 50 },

				// all flats
				{"cmd": "note", "pitch": 68, "volume": 105, "start": 0.75, "duration": 0.125, "instrument": 0, "gap": 0},
				{"cmd": "note", "pitch": 70, "volume": 85, "start": 0.875, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 71, "volume": 85, "start": 1, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 73, "volume": 95, "start": 1.125, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 75, "volume": 85, "start": 1.25, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 76, "volume": 85, "start": 1.375, "duration": 0.125, "instrument": 0, "gap": 0 },

				{"cmd": "note", "pitch": 68, "volume": 95, "start": 1.5, "duration": 0.125, "instrument": 0, "gap": 0},
				{"cmd": "note", "pitch": 70, "volume": 85, "start": 1.625, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 71, "volume": 85, "start": 1.75, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 73, "volume": 95, "start": 1.875, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 75, "volume": 85, "start": 2, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 76, "volume": 85, "start": 2.125, "duration": 0.125, "instrument": 0, "gap": 0 },

				// all quarter flats
				{"cmd": "note", "pitch": 69, "volume": 105, "start": 2.25, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0},
				{"cmd": "note", "pitch": 71, "volume": 85, "start": 2.375, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0 },
				{"cmd": "note", "pitch": 72, "volume": 85, "start": 2.5, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0 },
				{"cmd": "note", "pitch": 74, "volume": 95, "start": 2.625, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0 },
				{"cmd": "note", "pitch": 76, "volume": 85, "start": 2.75, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0 },
				{"cmd": "note", "pitch": 77, "volume": 85, "start": 2.875, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0 },

				{"cmd": "note", "pitch": 69, "volume": 95, "start": 3, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0},
				{"cmd": "note", "pitch": 71, "volume": 85, "start": 3.125, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0 },
				{"cmd": "note", "pitch": 72, "volume": 85, "start": 3.25, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0 },
				{"cmd": "note", "pitch": 74, "volume": 95, "start": 3.375, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0 },
				{"cmd": "note", "pitch": 76, "volume": 85, "start": 3.5, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0 },
				{"cmd": "note", "pitch": 77, "volume": 85, "start": 3.625, "duration": 0.125, "instrument": 0, cents: -50, "gap": 0 },

				// all natural
				{"cmd": "note", "pitch": 69, "volume": 105, "start": 3.75, "duration": 0.125, "instrument": 0, "gap": 0},
				{"cmd": "note", "pitch": 71, "volume": 85, "start": 3.875, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 72, "volume": 85, "start": 4, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 74, "volume": 95, "start": 4.125, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 76, "volume": 85, "start": 4.25, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 77, "volume": 85, "start": 4.375, "duration": 0.125, "instrument": 0, "gap": 0 },

				{"cmd": "note", "pitch": 69, "volume": 95, "start": 4.5, "duration": 0.125, "instrument": 0, "gap": 0},
				{"cmd": "note", "pitch": 71, "volume": 85, "start": 4.625, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 72, "volume": 85, "start": 4.75, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 74, "volume": 95, "start": 4.875, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 76, "volume": 85, "start": 5, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 77, "volume": 85, "start": 5.125, "duration": 0.125, "instrument": 0, "gap": 0 },

				// all quarter sharp
				{"cmd": "note", "pitch": 69, "volume": 105, "start": 5.25, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0},
				{"cmd": "note", "pitch": 71, "volume": 85, "start": 5.375, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0 },
				{"cmd": "note", "pitch": 72, "volume": 85, "start": 5.5, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0 },
				{"cmd": "note", "pitch": 74, "volume": 95, "start": 5.625, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0 },
				{"cmd": "note", "pitch": 76, "volume": 85, "start": 5.75, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0 },
				{"cmd": "note", "pitch": 77, "volume": 85, "start": 5.875, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0 },

				{"cmd": "note", "pitch": 69, "volume": 95, "start": 6, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0},
				{"cmd": "note", "pitch": 71, "volume": 85, "start": 6.125, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0 },
				{"cmd": "note", "pitch": 72, "volume": 85, "start": 6.25, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0 },
				{"cmd": "note", "pitch": 74, "volume": 95, "start": 6.375, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0 },
				{"cmd": "note", "pitch": 76, "volume": 85, "start": 6.5, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0 },
				{"cmd": "note", "pitch": 77, "volume": 85, "start": 6.625, "duration": 0.125, "instrument": 0, cents: 50, "gap": 0 },

				// all sharp
				{"cmd": "note", "pitch": 70, "volume": 105, "start": 6.75, "duration": 0.125, "instrument": 0, "gap": 0},
				{"cmd": "note", "pitch": 72, "volume": 85, "start": 6.875, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 73, "volume": 85, "start": 7, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 75, "volume": 95, "start": 7.125, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 77, "volume": 85, "start": 7.25, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 78, "volume": 85, "start": 7.375, "duration": 0.125, "instrument": 0, "gap": 0 },

				{"cmd": "note", "pitch": 70, "volume": 95, "start": 7.5, "duration": 0.125, "instrument": 0, "gap": 0},
				{"cmd": "note", "pitch": 72, "volume": 85, "start": 7.625, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 73, "volume": 85, "start": 7.75, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 75, "volume": 95, "start": 7.875, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 77, "volume": 85, "start": 8, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 78, "volume": 85, "start": 8.125, "duration": 0.125, "instrument": 0, "gap": 0 },

				// all double sharp
				{"cmd": "note", "pitch": 71, "volume": 105, "start": 8.25, "duration": 0.125, "instrument": 0, "gap": 0},
				{"cmd": "note", "pitch": 73, "volume": 85, "start": 8.375, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 74, "volume": 85, "start": 8.5, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 76, "volume": 95, "start": 8.625, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 78, "volume": 85, "start": 8.75, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 79, "volume": 85, "start": 8.875, "duration": 0.125, "instrument": 0, "gap": 0 },

				{"cmd": "note", "pitch": 71, "volume": 95, "start": 9, "duration": 0.125, "instrument": 0, "gap": 0},
				{"cmd": "note", "pitch": 73, "volume": 85, "start": 9.125, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 74, "volume": 85, "start": 9.25, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 76, "volume": 95, "start": 9.375, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 78, "volume": 85, "start": 9.5, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 79, "volume": 85, "start": 9.625, "duration": 0.125, "instrument": 0, "gap": 0 },

				// all double flat
				{"cmd": "note", "pitch": 67, "volume": 105, "start": 9.75, "duration": 0.125, "instrument": 0, "gap": 0},
				{"cmd": "note", "pitch": 69, "volume": 85, "start": 9.875, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 70, "volume": 85, "start": 10, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 72, "volume": 95, "start": 10.125, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 74, "volume": 85, "start": 10.25, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 75, "volume": 85, "start": 10.375, "duration": 0.125, "instrument": 0, "gap": 0 },

				{"cmd": "note", "pitch": 67, "volume": 95, "start": 10.5, "duration": 0.125, "instrument": 0, "gap": 0},
				{"cmd": "note", "pitch": 69, "volume": 85, "start": 10.625, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 70, "volume": 85, "start": 10.75, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 72, "volume": 95, "start": 10.875, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 74, "volume": 85, "start": 11, "duration": 0.125, "instrument": 0, "gap": 0 },
				{"cmd": "note", "pitch": 75, "volume": 85, "start": 11.125, "duration": 0.125, "instrument": 0, "gap": 0 },
			]
		],"totalDuration":11.25
	};

	//////////////////////////////////////////////////////////

	var abcTempoOverride = 'X:1\n' +
		'T:tempo-override\n' +
		'L:1/4\n' +
		'Q:1/4=150\n' +
		'M:4/4\n' +
		'K:G\n' +
		'C D E F|\n';

	var expectedTempoOverride = {"tempo":60,"instrument":0,"tracks":[[{"cmd":"program","channel":0,"instrument":0},{"cmd":"note","pitch":60,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":62,"volume":95,"start":0.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":64,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":66,"volume":95,"start":0.75,"duration":0.25,"instrument":0,"gap":0}]],"totalDuration":1};

	var expectedTempoOverrideTiming = [
		{"ms":0,"ln":0,"x1":89.096,"ch":[47],"x2":131.52240687119286,"midiPitches":["60 0.25"]},
		{"ms":1000,"ln":0,"x1":131.52240687119286,"ch":[49],"x2":173.9488137423857,"midiPitches":["62 0.25"]},
		{"ms":2000,"ln":0,"x1":173.9488137423857,"ch":[51],"x2":216.37522061357856,"midiPitches":["64 0.25"]},
		{"ms":3000,"ln":0,"x1":216.37522061357856,"ch":[53],"x2":259.8016274847714,"midiPitches":["66 0.25"]}
	];

	//////////////////////////////////////////////////////////

	var abcNoChordVoice = 'X: 1\n' +
		'M: 4/4\n' +
		'%%score (S A) (T B)\n' +
		'V:S clef=treble middle=B stem=up\n' +
		'V:A clef=treble middle=B stem=down\n' +
		'V:T clef=bass,, stem=up\n' +
		'V:B clef=bass,, stem=down\n' +
		'L: 1/4\n' +
		'K: C\n' +
		'V: S\n' +
		'|"Am"e4 |\n' +
		'V: A\n' +
		'|E4 |\n' +
		'V: T\n' +
		'|B,4 |\n' +
		'V: B\n' +
		'|E,4 |\n';

	var expectedNoChordVoice = {
		"tempo": 180,
		"instrument": 0,
		"tracks": [
			[
				{"cmd": "program", "channel": 0, "instrument": 0}, {"cmd": "note", "pitch": 76, "volume": 105, "start": 0, "duration": 1, "instrument": 0, "gap": 0},
			], [
				{
					"cmd": "program",
					"channel": 1,
					"instrument": 0
				},
				{"cmd": "note", "pitch": 64, "volume": 105, "start": 0, "duration": 1, "instrument": 0, "gap": 0},
			], [
				{"cmd": "program", "channel": 2, "instrument": 0},
				{
				"cmd": "note",
				"pitch": 59,
				"volume": 105,
				"start": 0,
				"duration": 1,
				"instrument": 0,
				"gap": 0
			},
			], [
				{"cmd": "program", "channel": 3, "instrument": 0},
				{"cmd": "note", "pitch": 52, "volume": 105, "start": 0, "duration": 1, "instrument": 0, "gap": 0},
			]
		],
		"totalDuration": 1
	}

	//////////////////////////////////////////////////////////

	var abcGuitarChordParams = 'X: 1\n' +
	'L: 1/4\n' +
	'M: 4/4\n' +
	'%%MIDI bassprog 10\n' +
	'%%MIDI bassvol 125\n' +
	'%%MIDI chordprog 72\n' +
	'%%MIDI chordvol 23\n' +
	'K:C\n' +
	'"C"z4|"G7"z4|\n'

	var expectedGuitarChordParams = 
		{
			"tempo":180,"instrument":0,"tracks":[
				[
					{"cmd":"program","channel":0,"instrument":0}
				],
				[
					{"cmd":"program","channel":1,"instrument":72},
					{"cmd":"note","pitch":36,"volume":125,"start":0,"duration":0.125,"gap":0,"instrument":10},
					{"cmd":"note","pitch":48,"volume":23,"start":0.25,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":52,"volume":23,"start":0.25,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":55,"volume":23,"start":0.25,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":31,"volume":125,"start":0.5,"duration":0.125,"gap":0,"instrument":10},
					{"cmd":"note","pitch":48,"volume":23,"start":0.75,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":52,"volume":23,"start":0.75,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":55,"volume":23,"start":0.75,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":43,"volume":125,"start":1,"duration":0.125,"gap":0,"instrument":10},
					{"cmd":"note","pitch":55,"volume":23,"start":1.25,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":59,"volume":23,"start":1.25,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":62,"volume":23,"start":1.25,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":65,"volume":23,"start":1.25,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":38,"volume":125,"start":1.5,"duration":0.125,"gap":0,"instrument":10},
					{"cmd":"note","pitch":55,"volume":23,"start":1.75,"duration":0.125,"gap":0,"instrument":72},{"cmd":"note","pitch":59,"volume":23,"start":1.75,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":62,"volume":23,"start":1.75,"duration":0.125,"gap":0,"instrument":72},
					{"cmd":"note","pitch":65,"volume":23,"start":1.75,"duration":0.125,"gap":0,"instrument":72}
				]
			],
			"totalDuration":2
		}

	//////////////////////////////////////////////////////////

	var abcChordArpeggio = 'X: 1\n' +
	'L: 1/4\n' +
	'M: 4/4\n' +
	'%%MIDI gchord fHIHfhih\n' +
	'%%MIDI bassprog 10\n' +
	'%%MIDI bassvol 125\n' +
	'%%MIDI chordprog 72\n' +
	'%%MIDI chordvol 23\n' +
	'K:C\n' +
	'"C"z4|"G7"z2z"C"z|\n' +
	'%%MIDI gchord GHIHghih\n' +
	'"C"z4|"G7"z2z"C"z|\n'

	var expectedChordArpeggio = 
	{
		"tempo": 180,
		"instrument": 0,
		"tracks": [
			[
				{
					"cmd": "program",
					"channel": 0,
					"instrument": 0
				}
			],
			[
				{
					"cmd": "program",
					"channel": 1,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 125,
					"start": 0,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 0.125,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 0.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 125,
					"start": 0.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 64,
					"volume": 23,
					"start": 0.625,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 23,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 64,
					"volume": 23,
					"start": 0.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 125,
					"start": 1,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 1.125,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 23,
					"start": 1.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 1.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 125,
					"start": 1.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 23,
					"start": 1.625,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 125,
					"start": 1.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 23,
					"start": 1.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 64,
					"volume": 23,
					"start": 1.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 23,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 2.125,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 2.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 60,
					"volume": 23,
					"start": 2.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 64,
					"volume": 23,
					"start": 2.625,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 23,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 64,
					"volume": 23,
					"start": 2.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 3,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 3.125,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 23,
					"start": 3.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 3.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 23,
					"start": 3.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 23,
					"start": 3.625,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 23,
					"start": 3.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 64,
					"volume": 23,
					"start": 3.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				}
			]
		],
		"totalDuration": 4
	}
	//////////////////////////////////////////////////////////

	var abcChordSwing = 'X: 1\n' +
	'L: 1/4\n' +
	'M: 4/4\n' +
	'%%MIDI gchord bzczbzcz\n' +
	'%%MIDI bassprog 10\n' +
	'%%MIDI bassvol 125\n' +
	'%%MIDI chordprog 72\n' +
	'%%MIDI chordvol 23\n' +
	'K:C\n' +
	'"C"z4|"G7"z4|"C"z"C#°7"z"Dm7"z"G7"z|"F"z3"F#°7"z|\n'

	var expectedChordSwing = 
	{
		"tempo": 180,
		"instrument": 0,
		"tracks": [
			[
				{
					"cmd": "program",
					"channel": 0,
					"instrument": 0
				}
			],
			[
				{
					"cmd": "program",
					"channel": 1,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 125,
					"start": 0,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 23,
					"start": 0,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 0,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 0,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 23,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 125,
					"start": 0.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 23,
					"start": 0.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 0.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 0.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 23,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 125,
					"start": 1,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 1,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 1,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 23,
					"start": 1,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 65,
					"volume": 23,
					"start": 1,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 1.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 1.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 23,
					"start": 1.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 65,
					"volume": 23,
					"start": 1.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 125,
					"start": 1.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 1.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 1.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 23,
					"start": 1.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 65,
					"volume": 23,
					"start": 1.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 1.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 1.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 23,
					"start": 1.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 65,
					"volume": 23,
					"start": 1.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 125,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 23,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 37,
					"volume": 125,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 49,
					"volume": 23,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 58,
					"volume": 23,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 125,
					"start": 2.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 23,
					"start": 2.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 53,
					"volume": 23,
					"start": 2.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 23,
					"start": 2.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 60,
					"volume": 23,
					"start": 2.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 125,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 23,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 23,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 65,
					"volume": 23,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 41,
					"volume": 125,
					"start": 3,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 53,
					"volume": 23,
					"start": 3,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 23,
					"start": 3,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 60,
					"volume": 23,
					"start": 3,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 53,
					"volume": 23,
					"start": 3.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 23,
					"start": 3.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 60,
					"volume": 23,
					"start": 3.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 125,
					"start": 3.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 53,
					"volume": 23,
					"start": 3.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 23,
					"start": 3.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 60,
					"volume": 23,
					"start": 3.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 42,
					"volume": 125,
					"start": 3.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 23,
					"start": 3.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 23,
					"start": 3.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 60,
					"volume": 23,
					"start": 3.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 63,
					"volume": 23,
					"start": 3.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				}
			]
		],
		"totalDuration": 4
	}

	//////////////////////////////////////////////////////////

	var abcAllTimeSigs = 'X: 1\n' +
	'L: 1/4\n' +
	'M: 4/4\n' +
	'K:C\n' +
	'M:2/4\n' +
	'"C"zz|"D"z"E"z|\n' +
	'M:3/4\n' +
	'"C"zzz|"D"z"E"z"F"z|z"G"zz|\n' +
	'M:5/4\n' +
	'"C"zzzzz|"D"zzz"E"zz|z"G"zzzz|\n' +
	'M:6/4\n' +
	'"C"zzzzzz|"D"zzz"E"zzz|"G"zz"A"zz"B"zz|\n' +
	'M:2/2\n' +
	'"C"zzzz|"D"zz"E"zz|"G"z"A"zz"B"z|\n' +
	'M:3/2\n' +
	'"C"zzzzzz|"D"zzz"E"zzz|"G"zz"A"zz"B"zz|\n' +
	'M:4/2\n' +
	'"C"zzzzzzzz|"D"zzzz"E"zzzz|"G"zz"A"zz"B"zz"C"zz|\n' +
	'M:3/8\n' +
	'"C"z/z/z/|"D"z/"E"z/z/|"D"z/z/"E"z/|"G"z/"A"z/"B"z/|\n' +
	'M:6/8\n' +
	'"C"z/z/z/z/z/z/|"D"z/"E"z/z/"D"z/z/"E"z/|"G"z"A"z"B"z|\n' +
	'M:9/8\n' +
	'"C"z/z/z/z/z/z/z/z/z/|"D"z/z/"E"z/z/z/"D"z/z/z/"E"z/|"G"zz/"A"zz/"B"zz/|\n' +
	'M:12/8\n' +
	'"C"z/z/z/z/z/z/z/z/z/z/z/z/|"D"z/z/z/"E"z/z/z/z/"D"z/z/z/z/"E"z/|"G"zz"A"zz"B"zz|\n' +
	'M:7/8\n' +
	'"C"z/z/z/z/z/z/z/|"D"z/z/z/"E"z/z/z/z/|"G"z/z/z/z/"A"z/z/z/|\n'

	var expectedAllTimeSigs = 
	{
		"tempo": 180,
		"instrument": 0,
		"tracks": [
			[
				{
					"cmd": "program",
					"channel": 0,
					"instrument": 0
				}
			],
			[
				{
					"cmd": "program",
					"channel": 1,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 0,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 0.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 1,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 1.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 1.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 1.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 1.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 1.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 1.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 1.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 41,
					"volume": 64,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 53,
					"volume": 48,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 60,
					"volume": 48,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 41,
					"volume": 64,
					"start": 2.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 3,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 3,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 3,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 3.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 3.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 3.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 3.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 3.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 3.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 3.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 4,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 4.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 4.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 4.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 4.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 4.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 4.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 4.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 5.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 5.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 5.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 5.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 5.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 6,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 6,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 6,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 6,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 6.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 6.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 6.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 6.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 6.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 6.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 6.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 7,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 7.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 7.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 7.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 7.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 7.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 7.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 7.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 8,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 8.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 8.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 8.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 8.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 8.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 8.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 8.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 9,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 9.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 9.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 9.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 9.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 9.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 9.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 9.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 9.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 10,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 10.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 10.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 10.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 10.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 45,
					"volume": 48,
					"start": 10.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 49,
					"volume": 48,
					"start": 10.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 10.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 64,
					"start": 11,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 47,
					"volume": 48,
					"start": 11.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 51,
					"volume": 48,
					"start": 11.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 11.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 11.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 12,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 12,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 12,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 12.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 13,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 13,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 13,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 13,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 13.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 13.75,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 45,
					"volume": 48,
					"start": 14,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 49,
					"volume": 48,
					"start": 14,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 14,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 64,
					"start": 14.25,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 14.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 15,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 15,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 15,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 15.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 15.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 15.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 16,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 16.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 16.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 16.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 16.75,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 17,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 17,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 17,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 17.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 18,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 45,
					"volume": 48,
					"start": 18,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 49,
					"volume": 48,
					"start": 18,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 18,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 64,
					"start": 18.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 47,
					"volume": 48,
					"start": 18.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 51,
					"volume": 48,
					"start": 18.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 18.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 19,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 19.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 19.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 19.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 20,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 20.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 20.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 20.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 21,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 21.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 21.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 21.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 22,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 22.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 22.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 22.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 23,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 23.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 45,
					"volume": 48,
					"start": 23.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 49,
					"volume": 48,
					"start": 23.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 23.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 64,
					"start": 24,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 24.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 24.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 24.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 24.5,
					"duration": 0.25,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 25.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 25.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 25.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 25.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 25.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 25.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 25.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 25.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 25.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 26,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 26,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 26,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 26,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 26.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 26.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 64,
					"start": 26.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 47,
					"volume": 48,
					"start": 26.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 51,
					"volume": 48,
					"start": 26.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 26.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 26.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 26.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 26.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 26.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 26.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 27.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 27.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 27.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 27.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 27.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 27.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 27.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 27.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 27.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 27.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 27.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 27.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 27.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 28,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 28.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 45,
					"volume": 48,
					"start": 28.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 49,
					"volume": 48,
					"start": 28.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 28.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 28.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 64,
					"start": 28.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 47,
					"volume": 48,
					"start": 28.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 51,
					"volume": 48,
					"start": 28.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 28.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 28.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 29,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 29,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 29,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 29.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 29.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 29.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 29.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 29.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 29.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 29.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 29.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 29.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 30.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 30.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 30.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 30.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 30.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 30.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 30.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 30.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 30.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 30.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 30.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 30.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 30.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 30.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 31,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 31.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 31.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 31.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 31.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 45,
					"volume": 48,
					"start": 31.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 49,
					"volume": 48,
					"start": 31.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 31.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 64,
					"start": 31.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 47,
					"volume": 48,
					"start": 32,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 51,
					"volume": 48,
					"start": 32,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 32,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 32.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 32.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 32.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 32.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 32.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 32.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 32.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 32.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 32.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 33.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 33.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 33.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 33.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 33.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 33.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 33.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 33.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 33.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 33.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 33.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 34,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 34.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 34.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 34.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 64,
					"start": 34.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 34.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 34.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 34.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 34.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 34.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 35,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 35,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 35,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 35,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 35.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 35.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 35.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 35.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 35.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 35.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 45,
					"volume": 48,
					"start": 35.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 49,
					"volume": 48,
					"start": 35.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 35.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 35.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 64,
					"start": 36.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 47,
					"volume": 48,
					"start": 36.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 51,
					"volume": 48,
					"start": 36.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 36.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 64,
					"start": 36.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 47,
					"volume": 48,
					"start": 36.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 51,
					"volume": 48,
					"start": 36.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 36.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 36.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 36.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 36.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 36.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 36.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 36.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 36.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 37,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 37.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 37.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 37.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 37.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 37.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 37.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 37.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 37.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 37.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 37.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 37.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 37.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 48,
					"start": 37.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 37.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 37.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 38,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 38,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 38,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 64,
					"start": 38.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 38.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 38.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 38.25,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 38.375,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 38.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 38.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 38.5,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 38.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 38.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 38.625,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 64,
					"start": 38.75,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 38.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 45,
					"volume": 48,
					"start": 38.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 49,
					"volume": 48,
					"start": 38.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 38.875,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 64,
					"start": 39,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 45,
					"volume": 48,
					"start": 39.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 49,
					"volume": 48,
					"start": 39.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 39.125,
					"duration": 0.0625,
					"gap": 0,
					"instrument": 0
				}
			]
		],
		"totalDuration": 39.25
	}

	//////////////////////////////////////////////////////////

	var abcChangeGChord = 'X: 1\n' +
	'L: 1/4\n' +
	'M: 4/4\n' +
	'%%MIDI gchord bzczbzcz\n' +
	'K:C\n' +
	'"C"z4|\n' +
	'%%MIDI gchord fHIHfhih\n' +
	'%%MIDI bassprog 10\n' +
	'%%MIDI bassvol 125\n' +
	'%%MIDI chordprog 72\n' +
	'%%MIDI chordvol 23\n' +
	'"D"z4|\n' +
	'%%MIDI gchord bzczbzcz\n' +
	'"E"z4|\n'

	var expectedChangeGChord = 
	{
		"tempo": 180,
		"instrument": 0,
		"tracks": [
			[
				{
					"cmd": "program",
					"channel": 0,
					"instrument": 0
				}
			],
			[
				{
					"cmd": "program",
					"channel": 1,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 0,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 0,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 0,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 0,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 0.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 0.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 0.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 0.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 38,
					"volume": 125,
					"start": 1,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 23,
					"start": 1.125,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 23,
					"start": 1.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 54,
					"volume": 23,
					"start": 1.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 33,
					"volume": 125,
					"start": 1.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 66,
					"volume": 23,
					"start": 1.625,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 23,
					"start": 1.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 66,
					"volume": 23,
					"start": 1.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 125,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 23,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 2,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 23,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 2.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 35,
					"volume": 125,
					"start": 2.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 10
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 2.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 23,
					"start": 2.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 2.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 23,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 23,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 23,
					"start": 2.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 72
				}
			]
		],
		"totalDuration": 3
	}
	
	//////////////////////////////////////////////////////////

	var abcPowerChord = 'X: 1\n' +
	'L: 1/4\n' +
	'M: 4/4\n' +
	'K:C\n' +
	'"C5"z4|\n' +
	'%%MIDI gchord GHIJKghi\n' +
	'"D5"z4|\n'

	var expectedPowerChord = {
		"tempo": 180,
		"instrument": 0,
		"tracks": [
			[
				{
					"cmd": "program",
					"channel": 0,
					"instrument": 0
				}
			],
			[
				{
					"cmd": "program",
					"channel": 1,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 36,
					"volume": 64,
					"start": 0,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 0.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 31,
					"volume": 64,
					"start": 0.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 48,
					"volume": 48,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 55,
					"volume": 48,
					"start": 0.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 48,
					"start": 1,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 57,
					"volume": 48,
					"start": 1.125,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 1.25,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 48,
					"start": 1.375,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 74,
					"volume": 48,
					"start": 1.5,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 1.625,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 48,
					"start": 1.75,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 74,
					"volume": 48,
					"start": 1.875,
					"duration": 0.125,
					"gap": 0,
					"instrument": 0
				}
			]
		],
		"totalDuration": 2
	}

	//////////////////////////////////////////////////////////

	var abcChordOctave = 'X: 1\n' +
	'L: 1/4\n' +
	'M: 4/4\n' +
	'K:C\n' +
	'%%MIDI bassprog 10 octave=-1\n' +
	'%%MIDI chordprog 4 octave=1\n' +
	'"C"z4|\n'

	var expectedChordOctave = {
		"tempo":180,
		"instrument":0,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0}
			],
			[
				{"cmd":"program","channel":1,"instrument":4},
				{"cmd":"note","pitch":24,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":10},
				{"cmd":"note","pitch":60,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":4},
				{"cmd":"note","pitch":64,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":4},
				{"cmd":"note","pitch":67,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":4},
				{"cmd":"note","pitch":19,"volume":64,"start":0.5,"duration":0.125,"gap":0,"instrument":10},
				{"cmd":"note","pitch":60,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":4},
				{"cmd":"note","pitch":64,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":4},
				{"cmd":"note","pitch":67,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":4}
			]
		],
		"totalDuration":1
	}

	//////////////////////////////////////////////////////////

	var abcCancelGChord = 'X: 1\n' +
	'L: 1/4\n' +
	'M: 4/4\n' +
	'K:C\n' +
	'%%MIDI gchord ffffffff\n' +
	'"C"z4|\n' +
	'%%MIDI gchord\n' +
	'"C"z4|\n'

	var expectedCancelGChord = {
		"tempo":180,
		"instrument":0,
		"tracks":[
			[
				{"cmd":"program","channel":0,"instrument":0}
			],[
				{"cmd":"program","channel":1,"instrument":0},
				{"cmd":"note","pitch":36,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":0.125,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":0.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":0.375,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":0.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":0.625,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":0.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":0.875,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":36,"volume":64,"start":1,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":31,"volume":64,"start":1.5,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":48,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":52,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0}
			]
		],
		"totalDuration":2
	}

	//////////////////////////////////////////////////////////

	it("flatten-pickup-triplet-chords-rhythmhead", function() {
		doFlattenTest(abcMultiple, expectedMultiple);
	})

	it("flatten-dynamics", function() {
		doFlattenTest(abcDynamics, expectedDynamics);
	})

	it("flatten-dynamics2", function() {
		doFlattenTest(abcDynamics2, expectedDynamics2);
	})

	it("flatten-dynamics3", function() {
		doFlattenTest(abcDynamics3, expectedDynamics3);
	})

	it("flatten-six-huit", function() {
		doFlattenTest(abcSixHuit, expectedSixHuit);
	})

	it("flatten-jig-chords", function() {
		doFlattenTest(abcJigChords, expectedJigChords);
	})

	it("flatten-repeat", function() {
		doFlattenTest(abcRepeat, expectedRepeat);
	})

	it("flatten-drum", function() {
		doFlattenTest(abcDrum, expectedDrum);
	})

	it("flatten-transpose", function() {
		doFlattenTest(abcTranspose, expectedTranspose);
	})

	it("flatten-tempo-change", function() {
		//console.log("flatten-tempo-change")
		doFlattenTest(abcTempoChange, expectedTempoChange);
	})

	it("flatten-tempo-change2", function() {
		//console.log("flatten-tempo-change2")
		doFlattenTest(abcTempoChange2, expectedTempoChange2);
	})

	it("flatten-decorations", function() {
		doFlattenTest(abcDecoration, expectedDecoration);
	})

	it("flatten-meter-change", function() {
		doFlattenTest(abcMeterChange, expectedMeterChange);
	})

	it("flatten-break", function() {
		doFlattenTest(abcBreak, expectedBreak);
	})

	it("flatten-break2", function() {
		doFlattenTest(abcBreak2, expectedBreak2);
	})

	it("flatten-end-chord", function() {
		doFlattenTest(abcEndChord, expectedEndChord);
	})

	it("flatten-mid-measure", function() {
		doFlattenTest(abcMidMeasureChordChange, expectedMidMeasureChordChange);
	})

	it("flatten-grace", function() {
		doFlattenTest(abcGrace, expectedGrace);
	})

	it("flatten-midi-options", function() {
		doFlattenTest(abcMidiOptions, expectedMidiOptions);
	})

	it("flatten-multi-measure-rest", function() {
		doFlattenTest(abcMultiMeasureRest, expectedMultiMeasureRest);
	})

	it("flatten-octave-clefs", function() {
		doFlattenTest(abcOctaveClefs, expectedOctaveClefs);
	})

	it("flatten-overlay", function() {
		doFlattenTest(abcOverlay, expectedOverlay);
	})

	it("flatten-perc-map", function() {
		doFlattenTest(abcPercMap, expectedPercMap);
	})

	it("flatten-perc-map-high-c", function() {
		doFlattenTest(abcPercMapHighC, expectedPercMapHighC);
	})

	it("flatten-long-tie", function() {
		doFlattenTest(abcLongTie, expectedLongTie);
	})

	it("flatten-triplet-chords", function() {
		doFlattenTest(abcTripletChords, expectedTripletChords);
	})

	it("flatten-regular-tie", function() {
		doFlattenTest(abcRegularTie, expectedRegularTie);
	})

	it("flatten-snare", function() {
		doFlattenTest(abcSnare, expectedSnare);
	})

	it("flatten-metronome", function() {
		doFlattenTest(abcMetronome, expectedMetronome);
	})

	it("flatten-twelve-eight", function() {
		doFlattenTest(abcTwelveEight, expectedTwelveEight);
	})

	it("flatten-tempo-3-voices", function() {
		doFlattenTest(abcTempoThreeVoices, expectedTempoThreeVoices);
		doTimingObjTest(abcTempoThreeVoices, expectedTempoThreeVoicesTiming);
	})

	it("flatten-quarter-tone", function() {
		doFlattenTest(abcQuarterTones, expectedQuarterTones);
	})

	it("flatten-tempo-override", function() {
		doFlattenTest(abcTempoOverride, expectedTempoOverride, { qpm: 60 });
		doTimingObjTest(abcTempoOverride, expectedTempoOverrideTiming, { qpm: 60 });
	})

	it("flatten-no-chord-voice", function() {
		doFlattenTest(abcNoChordVoice, expectedNoChordVoice, {chordsOff: true});
	})

	it("flatten-chord-params", function() {
		doFlattenTest(abcGuitarChordParams, expectedGuitarChordParams);
	})

	it("flatten-chord-arpeggio", function() {
		doFlattenTest(abcChordArpeggio, expectedChordArpeggio);
	})

	it("flatten-chord-swing", function() {
		doFlattenTest(abcChordSwing, expectedChordSwing);
	})

	it("flatten-all-time-sigs", function() {
		doFlattenTest(abcAllTimeSigs, expectedAllTimeSigs);
	})

	it("flatten-change-gchord", function() {
		doFlattenTest(abcChangeGChord, expectedChangeGChord);
	})

	it("flatten-power-chord", function() {
		doFlattenTest(abcPowerChord, expectedPowerChord);
	})

	it("bass-and-chord-octave", function() {
		doFlattenTest(abcChordOctave, expectedChordOctave);
	})

	it("cancel-gchord", function() {
		doFlattenTest(abcCancelGChord, expectedCancelGChord);
	})

})

//////////////////////////////////////////////////////////

function doFlattenTest(abc, expected, options) {
	var visualObj = abcjs.renderAbc("paper", abc, {});
	var flatten = visualObj[0].setUpAudio(options);
	//play(visualObj[0])
	console.log(JSON.stringify(flatten))
	chai.assert.equal(flatten.tempo, expected.tempo, "Tempo")
	chai.assert.equal(flatten.tracks.length, expected.tracks.length, "Number of Tracks")
	chai.assert.equal(flatten.totalDuration, expected.totalDuration, "Total Duration")
	for (var i = 0; i < expected.tracks.length; i++) {
		chai.assert.equal(flatten.tracks[i].length, expected.tracks[i].length, "length of track "+i)
		for (var j = 0; j < expected.tracks[i].length; j++) {
			var msg = "trk: " + i + " ev: " + j + "\nrcv: " + JSON.stringify(flatten.tracks[i][j]) + "\n" +
				"exp: " + JSON.stringify(expected.tracks[i][j]) + "\n";
			// TODO-PER: There are too many changes from adding start and end char, so just ignore them at least for now - they aren't what needs to be tested here anyway.
			var t = flatten.tracks[i][j]
			if (t.startChar)
				delete t.startChar;
			if (t.endChar)
				delete t.endChar;
			chai.assert.deepStrictEqual(t,expected.tracks[i][j], msg)
		}
	}
}

function play(visualObj) {
	var midiBuffer = new abcjs.synth.CreateSynth();
	midiBuffer.init({
		visualObj: visualObj,
		options: {
		}
	}).then(function (response) {
		console.log(response);
		midiBuffer.prime().then(function (response) {
			midiBuffer.start();
		});
	}).catch(function (error) {
		console.warn("Audio problem:", error);
	});
}

function doTimingObjTest(abc, expected, options) {
	if (!options) options = {};
	var visualObj = abcjs.renderAbc("paper", abc, {});
	visualObj[0].setUpAudio(options);
	var timing = visualObj[0].setTiming(options.qpm);
	var output = [];
	for (var i = 0; i < timing.length; i++) {
		var t = timing[i];
		if (t.type === "event") {
			var midiPitches = [];
			if (!t.midiPitches)
				debugger;
			for (var j = 0; j < t.midiPitches.length; j++)
				midiPitches.push(t.midiPitches[j].pitch + ' ' + t.midiPitches[j].duration);
			output.push({
				ms: t.milliseconds,
				ln: t.line,
				x1: t.left,
				ch: t.startCharArray,
				x2: t.endX,
				midiPitches: midiPitches
			});
		}
	}
	console.log(JSON.stringify(output));
	chai.assert.deepStrictEqual(output,expected, "timing error")
}
