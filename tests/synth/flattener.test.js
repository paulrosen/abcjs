describe("audio flattener", () => {
	var abcMultiple = `K:C
Q:1/4=60
L:1/4
V:1
G/| (3c/d/c/ "C"z d .e| {f}g !tenuto!a [gb] !style=rhythm!B|"D"A2"E"^G2|
V:2
x/|C4|D4|^F2B2|
`;

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
					"duration": 0.08333333333333333,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 74,
					"volume": 85,
					"start": 0.20833333333333331,
					"duration": 0.08333333333333333,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 72,
					"volume": 85,
					"start": 0.29166666666666663,
					"duration": 0.08333333333333336,
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
					// TODO-PER: this should be the gracenote
					"cmd": "note",
					"pitch": 77,
					"volume": 70,
					"start":0,
					"duration":0.125,
					"gap":0
				},
				{
					"cmd": "note",
					"pitch": 79,
					"volume": 105,
					"start": 1.125,
					"duration": 0.25,
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
					"pitch": 60,
					"volume": 95,
					"start": 1.875,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 64,
					"volume": 95,
					"start": 1.875,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 67,
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
					"pitch": 60,
					"volume": 48,
					"start": 0.375,
					"duration": 0.125,
					"instrument": 0
				}, // m1 b2 chick
				{
					"cmd": "note",
					"pitch": 64,
					"volume": 48,
					"start": 0.375,
					"duration": 0.125,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 48,
					"start": 0.375,
					"duration": 0.125,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 43,
					"volume": 64,
					"start": 0.625,
					"duration": 0.125,
					"instrument": 0
				}, // m1 b3 boom
				{
					"cmd": "note",
					"pitch": 60,
					"volume": 48,
					"start": 0.875,
					"duration": 0.125,
					"instrument": 0
				}, // m1 b4 chick
				{
					"cmd": "note",
					"pitch": 64,
					"volume": 48,
					"start": 0.875,
					"duration": 0.125,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 48,
					"start": 0.875,
					"duration": 0.125,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 50,
					"volume": 64,
					"start": 2.125,
					"duration": 0.125,
					"instrument": 0
				}, // m3 b1 boom
				{
					"cmd": "note",
					"pitch": 62,
					"volume": 48,
					"start": 2.375,
					"duration": 0.125,
					"instrument": 0
				}, // m3 b2 chick
				{
					"cmd": "note",
					"pitch": 66,
					"volume": 48,
					"start": 2.375,
					"duration": 0.125,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 48,
					"start": 2.375,
					"duration": 0.125,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 40,
					"volume": 64,
					"start": 2.625,
					"duration": 0.125,
					"instrument": 0
				}, // m3 b3 boom
				{
					"cmd": "note",
					"pitch": 52,
					"volume": 48,
					"start": 2.875,
					"duration": 0.125,
					"instrument": 0
				}, // m3 b4 chick
				{
					"cmd": "note",
					"pitch": 56,
					"volume": 48,
					"start": 2.875,
					"duration": 0.125,
					"instrument": 0
				},
				{
					"cmd": "note",
					"pitch": 59,
					"volume": 48,
					"start": 2.875,
					"duration": 0.125,
					"instrument": 0
				},
			]
		],
		"totalDuration": 3.125
	}

	//////////////////////////////////////////////////////////

	var abcDynamics = `X:1
M:4/4
L:1/4
Q:1/4=120
K:C
!crescendo(! EFGA| GAB !crescendo)!c | !diminuendo(! EFGA| GAB !diminuendo)!c |
!pppp! A B !ppp!A B |!pp! A B !p!A B | !mp! AB !sfz! AB|
!mf! AB !f! AB | !ff! AB !fff! AB | !ffff! ABAB|]
`;

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
					"volume": 116,
					"start": 2.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 116,
					"start": 2.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 116,
					"start": 2.75,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 67,
					"volume": 126,
					"start": 3,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 69,
					"volume": 116,
					"start": 3.25,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 71,
					"volume": 116,
					"start": 3.5,
					"duration": 0.25,
					"instrument": 0,
					"gap": 0
				},
				{
					"cmd": "note",
					"pitch": 72,
					"volume": 116,
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

	var abcSixHuit = `X:1
M:6/8
L:1/8
Q:3/8=60
K:G
"G"GAB cde|"D7"fga DEF|
`;

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
				{"cmd":"note","pitch":43,"volume":64,"start":0,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.25,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":0.25,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":0.25,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":38,"volume":64,"start":0.375,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":55,"volume":48,"start":0.625,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":59,"volume":48,"start":0.625,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":0.625,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":50,"volume":64,"start":0.75,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":1,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":66,"volume":48,"start":1,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":69,"volume":48,"start":1,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":72,"volume":48,"start":1,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":45,"volume":64,"start":1.125,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":62,"volume":48,"start":1.375,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":66,"volume":48,"start":1.375,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":69,"volume":48,"start":1.375,"duration":0.125,"instrument":0},
				{"cmd":"note","pitch":72,"volume":48,"start":1.375,"duration":0.125,"instrument":0},
			],
		],
		"totalDuration": 1.5
	}

	//////////////////////////////////////////////////////////

	it("flatten-pickup-triplet-chords-rhythmhead", () => {
		doFlattenTest(abcMultiple, expectedMultiple);
	})

	it("flatten-dynamics", () => {
		doFlattenTest(abcDynamics, expectedDynamics);
	})

	it("flatten-jig", () => {
		doFlattenTest(abcSixHuit, expectedSixHuit);
	})
})

//////////////////////////////////////////////////////////

function doFlattenTest(abc, expected) {
	var visualObj = abcjs.renderAbc("*", abc, {});
	var flatten = visualObj[0].setUpAudio();
	chai.assert.equal(flatten.tempo, expected.tempo, "Tempo")
	chai.assert.equal(flatten.tracks.length, expected.tracks.length, "Number of Tracks")
	chai.assert.equal(flatten.totalDuration, expected.totalDuration, "Total Duration")
	for (var i = 0; i < expected.tracks.length; i++) {
		chai.assert.equal(flatten.tracks[i].length, expected.tracks[i].length, "length of track "+i)
		for (var j = 0; j < expected.tracks[i].length; j++) {
			var msg = "trk: " + i + " ev: " + j + "\nrcv: " + JSON.stringify(flatten.tracks[i][j]) + "\n" +
				"exp: " + JSON.stringify(expected.tracks[i][j]) + "\n";
			chai.assert.deepStrictEqual(flatten.tracks[i][j],expected.tracks[i][j], msg)
		}
	}
}
