//var abcjs = require("../index");

//var expect    = require("chai").expect;

describe("audio flattener", () => {
	var abc = `K:C
Q:1/4=60
L:1/4
V:1
G/| (3c/d/c/ "C"z Td .e| {f}g !tenuto!a [gb] !style=rhythm!B|"D"A2"E"^G2|
V:2
x/|C4|D4|^F2B2|
`;
	// var stressBeat1 = 105;
	// var stressBeatDown = 95;
	// var stressBeatUp = 85;
	var output = {
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
					// TODO-PER: the following event should be a trill
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
	it("flatten-pickup-triplet-chords-trills-rhythmhead", () => {
		var visualObj = abcjs.renderAbc("*", abc, {});
		var flatten = visualObj[0].setUpAudio();
		chai.assert.equal(flatten.tempo, 60)
		chai.assert.equal(flatten.tracks.length, 3)
		chai.assert.equal(flatten.totalDuration, 3.125)
		for (var i = 0; i < output.tracks.length; i++) {
			chai.assert.equal(flatten.tracks[i].length, output.tracks[i].length, "length of track "+i)
			for (var j = 0; j < output.tracks[i].length; j++) {
				var msg = "trk: " + i + " ev: " + j + "\nrcv: " + JSON.stringify(flatten.tracks[i][j]) + "\n" +
				"exp: " + JSON.stringify(output.tracks[i][j]) + "\n";
				chai.assert.deepEqual(flatten.tracks[i][j],output.tracks[i][j], msg)
			}
		}
	})
})



