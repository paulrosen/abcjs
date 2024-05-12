describe("Svg Per Line", function() {
	var abcMultiple = 'X:1\n' +
'M:4/4\n' +
'L:1/16\n' +
'%%titlefont Times New Roman 22.0\n' +
'%%vocalfont Helvetica 10.0\n' +
'%%voicefont Helvetica-Bold 10.0\n' +
'%%measurefont Times-Italic 11\n' +
'%%partsfont box\n' +
'%%stretchlast .7\n' +
'%%musicspace 0\n' +
'%%barnumbers 1\n' +
'T: Selection Test\n' +
'T: Everything should be selectable\n' +
'C: public domain\n' +
'R: Hit it\n' +
'A: Yours Truly\n' +
'S: My own testing\n' +
'W: Now is the time for all good men\n' +
'W:\n' +
'W: To come to the aid of their party.\n' +
'H: This shows every type of thing that can possibly be drawn.\n' +
'H:\n' +
'H: And two lines of history!\n' +
'Q: "Easy Swing" 1/4=140\n' +
'P: AABB\n' +
'%%staves {(PianoRightHand extra) (PianoLeftHand)}\n' +
'V:PianoRightHand clef=treble name=RH\n' +
'V:PianoLeftHand clef=bass name=LH\n' +
'K:Bb\n' +
'P:A\n' +
'%%text there is some random text\n' +
'[V: PianoRightHand] !mp![b8B8d8] f3g f4|!<(![d12b12] !<)![b4g4]|z4 !<(! (bfdf) (3B2d2c2 !<)!B4|[Q:"left" 1/4=170"right"]!f![c4f4] z4 [b8d8]| !p![G8e8] Tu[c8f8]|!<(![d12f12] !<)!(g4|\n' +
'!f!a4) [g4b4] z4 =e4|[A8c8f8] d8|1 [c8F8] [B4G4] z4|[d12B12] A4|!>(![D8A8] Bcde fAB!>)!c|!mp!d16|]\n' +
'w:Strang- ers in the night\n' +
'[V: extra] B,4- B,4- B,4 B,4 | "Bb"{C}B,4 {CD}B,4 B,4 B,4 | B,4 B,4 B,4 B,4 | B,4 B,4 B,4 B,4 | B,4 B,4 B,4 B,4 | B,4 B,4 B,4 B,4 |\n' +
'B,4 B,4 B,4 B,4 | B,4 B,4 B,4 B,4 |B,4 B,4 B,4 B,4 |B,4 B,4 B,4 B,4 |"^annotation"B,4 B,4 B,4 B,4 |B,4 B,4 B,4 B,4 |\n' +
'[V: PianoLeftHand] B,6 D2 [F,8F8A,8]|B,2B,,2 C,4 D,4 E,F,G,2|F,2A,2 D4 D4 G,2E,2|[C4F,4A,4] z4 [F8B,8]|G,8 A,8|A,12 B,G,D,E,|\n' +
'F,G,A,F, (G,A,B,G,) C4 C4|[C,8A,8] [F8F,8B,8]|A,3C B,3D G,F,E,D, F,2A,2|D,2C,2 B,,2A,,2 G,,4 F,,A,,C,F,|F,,6 D,,2 [D,4G,,4] z4|B,,16|]\n';

//////////////////////////////////////////////////////////
	it("svg-per-line", function() {
		doSvgTest(abcMultiple, "paper", { oneSvgPerLine: true, selectTypes: true, clickListener: clickListener }, 5);
	})

	it("svg-per-line-responsive", function() {
		doSvgTest(abcMultiple, "paper-resp", { oneSvgPerLine: true, responsive: "resize" }, 5);
	})

	it("normal", function() {
		doSvgTest(abcMultiple, "paper-norm", { selectTypes: true }, 1);
	})

	it("normal-responsive", function() {
		doSvgTest(abcMultiple, "paper-resp-norm", { responsive: "resize" }, 1);
	})

	it("svg-per-line-scaled", function() {
		var abcScaled = 'X:1\n' +
			'%%staffwidth 400\n' +
			'M:4/4\n' +
			'L:1/16\n' +
			'T: Scaled\n' +
			'K: G\n' +
			'CDEF|GABC||\n' +
			'cdef|gabc||\n'
		doSvgTest(abcScaled, "paper-scaled", { oneSvgPerLine: true, scale: 0.5 }, 1);
	})

})

//////////////////////////////////////////////////////////

function replacer(key, value) {
	// Filtering out properties
	if (key === 'abselem') {
		return 'abselem';
	}
	return value;
}
function doSvgTest(abc, id, options, numLines) {
	abcjs.renderAbc(id, abc, options);
	var outputs = document.querySelectorAll("#" + id + " svg")
	chai.assert.equal(outputs.length, numLines)
}

function clickListener(abcelem, tuneNumber, classes, analysis, drag, mouseEvent) {
	var info = document.getElementById("click-info")
	info.innerHTML = JSON.stringify(abcelem, replacer) + "<br>" + classes + "<br>" + JSON.stringify(analysis) + "<br>" + JSON.stringify(drag)
	console.log(abcelem, tuneNumber, classes, analysis, drag, mouseEvent)
}

