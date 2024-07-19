describe("Synth Options", function() {
	var abcBasic =
	'M:4/4\n' +
	'L:1/4\n' +
	'K:Dm\n' +
	'"Dm"DFAd|"A7"Aceg||\n';

	var optionsDrum = {
		drum: "dddd 76 77 77 77 60 30 30 30",
		drumBars: 2,
		drumIntro: 1,
	}
	var optionsCountin = {
		drum: "dddd 76 77 77 77 60 30 30 30",
		drumIntro: 1,
		drumOff: true,
	}
	var optionsNoChord = {
		chordsOff: true,
	}
	var optionsNoVoice = {
		voicesOff: true,
	}
	var optionsTranspose = {
		midiTranspose: 2,
		visualTranspose: -4,
	}
	var optionsTempo = {
		qpm: 50,
		defaultQpm: 60,
	}
	var optionsProgram = {
		program: 11,
		channel: 2,

		bassprog: 20,
		bassvol: 21,
		chordprog: 30,
		chordvol: 31,
		gchord: "fHIHfhih",

	}

	var expectedDrum = {"tempo":180,"instrument":0,"tracks":[[{"cmd":"program","channel":0,"instrument":0},{"cmd":"note","pitch":62,"volume":105,"start":1,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":65,"volume":95,"start":1.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":69,"volume":95,"start":1.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":74,"volume":95,"start":1.75,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":69,"volume":105,"start":2,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":72,"volume":95,"start":2.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":76,"volume":95,"start":2.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":79,"volume":95,"start":2.75,"duration":0.25,"instrument":0,"gap":0}],[{"cmd":"program","channel":1,"instrument":0},{"cmd":"note","pitch":38,"volume":64,"start":1,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":50,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":53,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":57,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":33,"volume":64,"start":1.5,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":50,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":53,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":57,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":33,"volume":64,"start":2,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":45,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":49,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":52,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":55,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":28,"volume":64,"start":2.5,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":45,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":49,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":52,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":55,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0}],[{"cmd":"program","channel":2,"instrument":128},{"cmd":"note","pitch":"76","volume":"60","start":0,"duration":0.5,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":0.5,"duration":0.5,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":1,"duration":0.5,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":1.5,"duration":0.5,"gap":0,"instrument":128},{"cmd":"note","pitch":"76","volume":"60","start":1,"duration":0.5,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":1.5,"duration":0.5,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":2,"duration":0.5,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":2.5,"duration":0.5,"gap":0,"instrument":128},{"cmd":"note","pitch":"76","volume":"60","start":2,"duration":0.5,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":2.5,"duration":0.5,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":3,"duration":0.5,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":3.5,"duration":0.5,"gap":0,"instrument":128}]],"totalDuration":3}

	var expectedCountin = {"tempo":180,"instrument":0,"tracks":[[{"cmd":"program","channel":0,"instrument":0},{"cmd":"note","pitch":62,"volume":105,"start":1,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":65,"volume":95,"start":1.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":69,"volume":95,"start":1.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":74,"volume":95,"start":1.75,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":69,"volume":105,"start":2,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":72,"volume":95,"start":2.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":76,"volume":95,"start":2.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":79,"volume":95,"start":2.75,"duration":0.25,"instrument":0,"gap":0}],[{"cmd":"program","channel":1,"instrument":0},{"cmd":"note","pitch":38,"volume":64,"start":1,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":50,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":53,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":57,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":33,"volume":64,"start":1.5,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":50,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":53,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":57,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":33,"volume":64,"start":2,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":45,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":49,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":52,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":55,"volume":48,"start":2.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":28,"volume":64,"start":2.5,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":45,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":49,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":52,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":55,"volume":48,"start":2.75,"duration":0.125,"gap":0,"instrument":0}],[{"cmd":"program","channel":2,"instrument":128},{"cmd":"note","pitch":"76","volume":"60","start":0,"duration":0.25,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":0.25,"duration":0.25,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":0.5,"duration":0.25,"gap":0,"instrument":128},{"cmd":"note","pitch":"77","volume":"30","start":0.75,"duration":0.25,"gap":0,"instrument":128}]],"totalDuration":3}

	var expectedNoChord = {"tempo":180,"instrument":0,"tracks":[[{"cmd":"program","channel":0,"instrument":0},{"cmd":"note","pitch":62,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":65,"volume":95,"start":0.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":69,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":74,"volume":95,"start":0.75,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":69,"volume":105,"start":1,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":72,"volume":95,"start":1.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":76,"volume":95,"start":1.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":79,"volume":95,"start":1.75,"duration":0.25,"instrument":0,"gap":0}]],"totalDuration":2}

	var expectedNoVoice = {"tempo":180,"instrument":0,"tracks":[[{"cmd":"program","channel":0,"instrument":0},{"cmd":"note","pitch":62,"volume":0,"start":0,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":65,"volume":0,"start":0.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":69,"volume":0,"start":0.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":74,"volume":0,"start":0.75,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":69,"volume":0,"start":1,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":72,"volume":0,"start":1.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":76,"volume":0,"start":1.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":79,"volume":0,"start":1.75,"duration":0.25,"instrument":0,"gap":0}],[{"cmd":"program","channel":1,"instrument":0},{"cmd":"note","pitch":38,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":50,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":53,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":57,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":33,"volume":64,"start":0.5,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":50,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":53,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":57,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":33,"volume":64,"start":1,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":45,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":49,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":52,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":55,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":28,"volume":64,"start":1.5,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":45,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":49,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":52,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":55,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0}]],"totalDuration":2}

	var expectedProgram = {"tempo":180,"instrument":11,"tracks":[[{"cmd":"program","channel":2,"instrument":11},{"cmd":"note","pitch":62,"volume":105,"start":0,"duration":0.25,"instrument":11,"gap":0},{"cmd":"note","pitch":65,"volume":95,"start":0.25,"duration":0.25,"instrument":11,"gap":0},{"cmd":"note","pitch":69,"volume":95,"start":0.5,"duration":0.25,"instrument":11,"gap":0},{"cmd":"note","pitch":74,"volume":95,"start":0.75,"duration":0.25,"instrument":11,"gap":0},{"cmd":"note","pitch":69,"volume":105,"start":1,"duration":0.25,"instrument":11,"gap":0},{"cmd":"note","pitch":72,"volume":95,"start":1.25,"duration":0.25,"instrument":11,"gap":0},{"cmd":"note","pitch":76,"volume":95,"start":1.5,"duration":0.25,"instrument":11,"gap":0},{"cmd":"note","pitch":79,"volume":95,"start":1.75,"duration":0.25,"instrument":11,"gap":0}],[{"cmd":"program","channel":1,"instrument":30},{"cmd":"note","pitch":38,"volume":21,"start":0,"duration":0.125,"gap":0,"instrument":20},{"cmd":"note","pitch":53,"volume":31,"start":0.125,"duration":0.125,"gap":0,"instrument":30},{"cmd":"note","pitch":57,"volume":31,"start":0.25,"duration":0.125,"gap":0,"instrument":30},{"cmd":"note","pitch":53,"volume":31,"start":0.375,"duration":0.125,"gap":0,"instrument":30},{"cmd":"note","pitch":33,"volume":21,"start":0.5,"duration":0.125,"gap":0,"instrument":20},{"cmd":"note","pitch":65,"volume":31,"start":0.625,"duration":0.125,"gap":0,"instrument":30},{"cmd":"note","pitch":69,"volume":31,"start":0.75,"duration":0.125,"gap":0,"instrument":30},{"cmd":"note","pitch":65,"volume":31,"start":0.875,"duration":0.125,"gap":0,"instrument":30},{"cmd":"note","pitch":33,"volume":21,"start":1,"duration":0.125,"gap":0,"instrument":20},{"cmd":"note","pitch":49,"volume":31,"start":1.125,"duration":0.125,"gap":0,"instrument":30},{"cmd":"note","pitch":52,"volume":31,"start":1.25,"duration":0.125,"gap":0,"instrument":30},{"cmd":"note","pitch":49,"volume":31,"start":1.375,"duration":0.125,"gap":0,"instrument":30},{"cmd":"note","pitch":28,"volume":21,"start":1.5,"duration":0.125,"gap":0,"instrument":20},{"cmd":"note","pitch":61,"volume":31,"start":1.625,"duration":0.125,"gap":0,"instrument":30},{"cmd":"note","pitch":64,"volume":31,"start":1.75,"duration":0.125,"gap":0,"instrument":30},{"cmd":"note","pitch":61,"volume":31,"start":1.875,"duration":0.125,"gap":0,"instrument":30}]],"totalDuration":2}

	var expectedTempo = {"tempo":50,"instrument":0,"tracks":[[{"cmd":"program","channel":0,"instrument":0},{"cmd":"note","pitch":62,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":65,"volume":95,"start":0.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":69,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":74,"volume":95,"start":0.75,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":69,"volume":105,"start":1,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":72,"volume":95,"start":1.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":76,"volume":95,"start":1.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":79,"volume":95,"start":1.75,"duration":0.25,"instrument":0,"gap":0}],[{"cmd":"program","channel":1,"instrument":0},{"cmd":"note","pitch":38,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":50,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":53,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":57,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":33,"volume":64,"start":0.5,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":50,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":53,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":57,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":33,"volume":64,"start":1,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":45,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":49,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":52,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":55,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":28,"volume":64,"start":1.5,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":45,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":49,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":52,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":55,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0}]],"totalDuration":2}

	var expectedTranspose = {"tempo":180,"instrument":0,"tracks":[[{"cmd":"program","channel":0,"instrument":0},{"cmd":"note","pitch":64,"volume":105,"start":0,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":67,"volume":95,"start":0.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":71,"volume":95,"start":0.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":76,"volume":95,"start":0.75,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":71,"volume":105,"start":1,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":74,"volume":95,"start":1.25,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":78,"volume":95,"start":1.5,"duration":0.25,"instrument":0,"gap":0},{"cmd":"note","pitch":81,"volume":95,"start":1.75,"duration":0.25,"instrument":0,"gap":0}],[{"cmd":"program","channel":1,"instrument":0},{"cmd":"note","pitch":40,"volume":64,"start":0,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":52,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":55,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":59,"volume":48,"start":0.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":35,"volume":64,"start":0.5,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":52,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":55,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":59,"volume":48,"start":0.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":35,"volume":64,"start":1,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":47,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":51,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":54,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":57,"volume":48,"start":1.25,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":30,"volume":64,"start":1.5,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":47,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":51,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":54,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0},{"cmd":"note","pitch":57,"volume":48,"start":1.75,"duration":0.125,"gap":0,"instrument":0}]],"totalDuration":2}

	//////////////////////////////////////////////////////////


	it("all-MIDI-options", function() {
		doFlattenTest(abcBasic, expectedDrum, optionsDrum)
		doFlattenTest(abcBasic, expectedCountin, optionsCountin)
		doFlattenTest(abcBasic, expectedNoChord, optionsNoChord)
		doFlattenTest(abcBasic, expectedNoVoice, optionsNoVoice)
		doFlattenTest(abcBasic, expectedProgram, optionsProgram)
		doFlattenTest(abcBasic, expectedTempo, optionsTempo)
		doFlattenTest(abcBasic, expectedTranspose, optionsTranspose)
	})

})

function doFlattenTest(abc, expected, options) {
	var visualObj = abcjs.renderAbc("paper", abc, {});
	var flatten = visualObj[0].setUpAudio(options);
	for (var ii = 0; ii < flatten.tracks.length; ii++) {
		for (var jj = 0; jj < flatten.tracks[ii].length; jj++) {
			delete flatten.tracks[ii][jj].startChar
			delete flatten.tracks[ii][jj].endChar
		}
	}
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
