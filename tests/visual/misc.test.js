describe("Miscellaneous", function () {
	var abcJazzChords = "X:1\n" +
		"%%jazzchords\n" +
		"K:C\n" +
		"\"C7\"C \"C/B\"B \"x\"A \"x/C\"G \"/E\"E|";

	var expectedJazzChords = [
		{input: 'C7', output: 'C\x037\x03'},
		{input: 'C/B', output: 'C\x03\x03/B'},
		{input: 'x', output: '\x03x\x03'},
		{input: 'x/C', output: '\x03x\x03/C'},
		{input: '/E', output: '\x03\x03/E'},
	]

	var abcGlissando = "X:1\n" +
		"L:1/4\n" +
		"%%stretchlast\n" +
		"!glissando(!C!glissando)!e\n" +
		"!glissando(!C!glissando)!E !glissando(!C!glissando)!F !glissando(!C!glissando)!G !glissando(!C!glissando)!A !glissando(!C!glissando)!B !glissando(!C!glissando)!c \n" +
		"!glissando(!C!glissando)!d !glissando(!C!glissando)!e !glissando(!C!glissando)!f\n" +
		"!glissando(!g!glissando)!f !glissando(!g!glissando)!e !glissando(!g!glissando)!d !glissando(!g!glissando)!c !glissando(!g!glissando)!f !glissando(!g!glissando)!A !glissando(!g!glissando)!G !glissando(!g!glissando)!F !glissando(!g!glissando)!E !glissando(!g!glissando)!D \n" +
		"\n" +
		"\n" +
		"\n" +
		"\n" +
		"\n";

	var expectedGlissando = [
		{x: 63, y: 36, w: 329, h: 40},
		{x: 63, y: 156, w: 35, h: 12},
		{x: 181, y: 153, w: 35, h: 14},
		{x: 298, y: 150, w: 35, h: 16},
		{x: 416, y: 147, w: 35, h: 18},
		{x: 533, y: 144, w: 35, h: 20},
		{x: 651, y: 139, w: 41, h: 25},
		{x: 63, y: 227, w: 95, h: 32},
		{x: 298, y: 223, w: 95, h: 35},
		{x: 533, y: 218, w: 101, h: 40},
		{x: 63, y: 307, w: 17, h: 7},
		{x: 133, y: 308, w: 17, h: 8},
		{x: 204, y: 309, w: 17, h: 9},
		{x: 275, y: 311, w: 17, h: 10},
		{x: 345, y: 307, w: 17, h: 7},
		{x: 416, y: 313, w: 17, h: 11},
		{x: 486, y: 315, w: 17, h: 12},
		{x: 557, y: 316, w: 23, h: 18},
		{x: 628, y: 318, w: 23, h: 20},
		{x: 698, y: 319, w: 29, h: 28},
	]

	it("jazz chords", function () {
		extractChords(abcJazzChords, expectedJazzChords);
	})

	it("glissando", function () {
		draw(abcGlissando, expectedGlissando);
	})
})

function extractChords(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc);
	var line = visualObj[0].lines[0];
	var staff = line.staff[0];
	var voice = staff.voices[0];
	var chords = [];
	for (var i = 0; i < voice.length; i++) {
		var el = voice[i];
		if (el.chord) {
			var output = el.abselem.extra[0]
			chords.push({input: el.chord[0].name, output: output.c})
		}
	}
	//console.log(chords)
	chai.assert.equal(chords.length, expected.length, "wrong number of chords");
	for (i = 0; i < chords.length; i++) {
		chai.assert.equal(chords[i].input, expected[i].input, i + ": Inputs different");
		chai.assert.equal(chords[i].output, expected[i].output, i + ": Outputs different");
	}
}

function draw(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc);
	var gliss = document.querySelectorAll('[data-name="glissando"]')
	for (var i = 0; i < gliss.length; i++) {
		var bb = gliss[i].getBBox()
		bb = {x: Math.round(bb.x), y: Math.round(bb.y), w: Math.round(bb.width), h: Math.round(bb.height)}
		//console.log(bb)
		chai.assert.deepEqual(bb, expected[i])
	}
}

