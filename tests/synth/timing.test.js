describe("Timing", function() {
	var abcRepeatedSections = 'X:1\n' +
		'L:1/4\n' +
		'M:3/4\n' +
		'Q:1/4=60\n' +
		'K:Bb\n' +
		'CDE|:FG[Ab]|1 Bcd:|2 efg|]\n';

	var expectedRepeatedSections = [
		{ ms: 0, pitches: [60] },
		{ ms: 1000, pitches: [62] },
		{ ms: 2000, pitches: [63] },
		{ bar: true },
		{ ms: [3000,9000], pitches: [65] },
		{ ms: [4000,10000], pitches: [67] },
		{ ms: [5000,11000], pitches: [69, 82] },
		{ bar: true },
		{ ms: 6000, pitches: [70] },
		{ ms: 7000, pitches: [72] },
		{ ms: 8000, pitches: [74] },
		{ bar: true },
		{ ms: 12000, pitches: [75] },
		{ ms: 13000, pitches: [77] },
		{ ms: 14000, pitches: [79] },
		{ bar: true },
	];

	var abcElevenEight = 'X:1\n' +
		'%%score { 1 | 2 }\n' +
		'L:1/8\n' +
		'Q:1/4=140\n' +
		'M:11/8\n' +
		'K:C\n' +
		'V:1 treble nm=\"Piano\"\n' +
		'V:2 bass\n' +
		'V:1\n' +
		'A,B,CD EFD E2 E2 |\n' +
		'V:2\n' +
		'A,,2 .[E,C,]2 E,,2 .[E,C,] A,,2 .[E,C,]2 |\n';

	var expectedElevenEight = [
		{ ms: 0, pitches: [57] },
		{ ms: 214.28571428571428, pitches: [59] },
		{ ms: 428.57142857142856, pitches: [60] },
		{ ms: 642.8571428571429, pitches: [62] },
		{ ms: 857.1428571428571, pitches: [64] },
		{ ms: 1071.4285714285713, pitches: [65] },
		{ ms: 1285.7142857142858, pitches: [62] },
		{ ms: 1500, pitches: [64] },
		{ ms: 1928.5714285714284, pitches: [64] },
		{ bar: true },
	];

	var abcTempoChange = 'X:1\n' +
		'L:1/4\n' +
		'M:4/4\n' +
		'K:F\n' +
		'[Q:1/4=129.0476605]CDEF |[Q:1/4=127]GABc | [Q:1/4=131] CDEF |[Q:1/4=130] GABc |[Q:1/4=127]CDEF |\n' ;

	var abcSubTitleCrash = 'X:1\n' +
		'T:subtitle-crash\n' +
		'L:1/4\n' +
		'K:C\n' +
		'cdef|\n' +
		'T:subtitle\n' +
		'fabg|\n';

	var abcRepeatAtStartCrash = 'X:1\n' +
		'T:repeat-at-start-of-line-crash\n' +
		'K:C\n' +
		'E8|\n' +
		'|1 D8 :|2 C8\n';

	var abcSkipTiesCrash = 'X:1 \n' +
		'T:skip-ties-crash\n' +
		'M:4/4\n' +
		'K:C\n' +
		'E8- | E8 |]\n';

	var abcTieRepeatCrash = 'X:1\n' +
		'T:tie-repeat-crash\n' +
		'L:1/8\n' +
		'Q:1/4=100\n' +
		'M:4/4\n' +
		'K:G\n' +
		'G3 F- F4 :|\n';

//////////////////////////////////////////////////////////

	it("of repeated sections", function() {
		doTimingTest(abcRepeatedSections, expectedRepeatedSections);
	});

	it("repeated sections callback", function() {
		doClickTest(abcRepeatedSections, expectedRepeatedSections);
	});

	it("of 11/8", function() {
		doTimingTest(abcElevenEight, expectedElevenEight);
	});

	it("tempo change2 animation", function() {
		doAnimationTest(abcTempoChange);
	});

	it("subtitle crash", function() {
		doCreationTest(abcSubTitleCrash);
	});

	it("repeat at start crash", function() {
		doCreationTest(abcRepeatAtStartCrash);
	});

	it("skip ties crash", function() {
		doCreationTest(abcSkipTiesCrash);
	});

	it("tie repeat crash", function() {
		doCreationTest(abcTieRepeatCrash);
	});
});

//////////////////////////////////////////////////////////

function doAnimationTest(abc) {
	var visualObj = abcjs.renderAbc("paper", abc);
	visualObj[0].setUpAudio();
	visualObj[0].setTiming();
	var ms = visualObj[0].millisecondsPerMeasure();
	//console.log(JSON.stringify(visualObj[0].noteTimings))
	for (var i = 0; i < visualObj[0].noteTimings.length; i++) {
		var ev = visualObj[0].noteTimings[i];

		if (ev.midiPitches) {
			var start = Math.round(ev.midiPitches[0].start  * ms);
			chai.assert.equal(ev.milliseconds, start, 'timing for element ' + i);
		}
	}
}
var trans = function(nt, i, ms) { console.log(nt[i].milliseconds, nt[i].midiPitches[0].start, ms, nt[i].midiPitches[0].start* ms) }

//////////////////////////////////////////////////////////

function doClickTest(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc);
	visualObj[0].setUpAudio();
	var selectables = visualObj[0].engraver.selectables;
	//console.log(selectables)
	var index = 0;
	for (var i = 0; i < expected.length; i++) {
		if (!expected[i].bar) {
			listener(selectables[index].absEl.abcelem, expected[i]);
			index++;
		}
	}
}

//////////////////////////////////////////////////////////

function doCreationTest(abc) {
	var visualObj = abcjs.renderAbc("paper", abc);
	visualObj[0].setUpAudio();
	visualObj[0].setTiming();
}

//////////////////////////////////////////////////////////

function doTimingTest(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc);
	visualObj[0].setUpAudio();
	var voice = visualObj[0].lines[0].staff[0].voices[0];
	//console.log(voice)
	chai.assert.equal(voice.length,expected.length, 'num items');
	for (var i = 0; i < voice.length; i++) {
		if (voice[i].el_type === 'bar' && expected[i].bar)
			continue;

		chai.assert.deepStrictEqual(voice[i].currentTrackMilliseconds, expected[i].ms, "millisecs for " + i);
		chai.assert.equal(voice[i].midiPitches.length,expected[i].pitches.length, 'num pitches for ' + i);
		for (var j = 0; j < voice[i].midiPitches.length; j++) {
			chai.assert.equal(voice[i].midiPitches[j].pitch,expected[i].pitches[j], 'pitch for ' + i + ' ' + j);
		}
	}
}

function listener(abcElem, expected) {
	var pitches = [];
	for (var i = 0; i < abcElem.midiPitches.length; i++)
		chai.assert.equal(abcElem.midiPitches[i].pitch,expected.pitches[i]);
	chai.assert.deepStrictEqual(abcElem.currentTrackMilliseconds,expected.ms);
}
