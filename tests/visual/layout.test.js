describe("Layout", function() {
	var abcBarLinesTreble = "X:1\n%%barlabelfont Times-Bold 18 box\n%%setbarnb 42\n%%barnumbers 1\nM: 4/4\nL: 1/16\nK:D\nz8 |\n z8 |\n"

	var expectedBarLinesTreble = [{x: 20, y: 88}]

	var abcBarLinesBass = "X:1\n%%barlabelfont Times-Bold 18 box\n%%setbarnb 42\n%%barnumbers 1\nM: 4/4\nL: 1/16\nK:D clef=bass\nz8 |\n z8 |\n"

	var expectedBarLinesBass = [{x: 20, y: 84}]

	var abcMinSpacing = "X:1\nL:1/8\nM:4/4\ncdef cdef|\ncdef cdef|cdef cdef|\ncdef cdef|cdef cdef|cdef cdef|\n";

	var expectedMinSpacing0 = [
		[71,96,122,147,172,198,223,249,274],
		[49,62,75,88,101,114,127,141,156,167,180,193,207,220,233,246,259,275],
		[49,60,71,81,92,103,114,125,141,152,162,173,184,195,206,216,227,243,254,265,276,286,297,308,319,330,345]
	];

	var expectedMinSpacing10 = [
		[81,105,129,153,177,202,226,250,276],
		[59,80,101,121,142,163,184,205,231,252,272,293,314,335,356,376,397,423],
		[59,80,101,121,142,163,184,205,231,252,272,293,314,335,356,376,397,423,444,465,486,506,527,548,569,590,615]
	];

	var abcCollidingNotes = "X:1\n" +
		"L:1/8\n" +
		"M:4/4\n" +
		"%%score (S A)\n" +
		"V:S clef=treble middle=B stem=up\n" +
		"V:A clef=treble middle=B stem=down\n" +
		"K:C\n" +
		"[V:S]G4 zA G2 | GG GG GG GG | G/G/G/G/   [GB]/G/[cG]/G/   G/G/G/G/   G/G/G/G/ | C6 ||\n" +
		"[V:A]F2 F2 F2 F2 | FF EF FE FC | F/C/D/A,/   F/F/F/F/   [DF]/F/[FD]/F/   F/F/F/F/ | _B,6 ||";

	var expectedCollidingNotes = [[{"w":24.051,"dx":5},{"w":11.795,"dx":0},{"w":10.37,"dx":0},{"w":7.534,"dx":0},{"w":15.902000000000001,"dx":9.21},{"w":9.81,"dx":0},{"w":1,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":1,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0}, {"w":1,"dx":0},{"w":16.82,"dx":13.37}, {"w":4,"dx":0}],
		[
			{"w":20.18,"dx":10.37},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":19.62,"dx":9.81},{"w":1,"dx":0},
			{"w":19.62,"dx":9.81},{"w":19.62,"dx":9.81},{"w":9.81,"dx":0},{"w":19.62,"dx":9.81}, {"w":19.62,"dx":9.81},{"w":9.81,"dx":0},{"w":19.62,"dx":9.81},{"w":9.81,"dx":0}, {"w":1,"dx":0},
			{"w":19.62,"dx":9.81},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},
			{"w":19.62,"dx":9.81},{"w":19.62,"dx":9.81},{"w":19.62,"dx":9.81},{"w":19.62,"dx":9.81},
			{"w":19.62,"dx":9.81},{"w":19.62,"dx":9.81},{"w":19.62,"dx":9.81},{"w":19.62,"dx":9.81},
			{"w":19.62,"dx":9.81},{"w":19.62,"dx":9.81},{"w":19.62,"dx":9.81},{"w":19.62,"dx":9.81},{"w":1,"dx":0},
			{"w":27.189999999999998,"dx":23.74},{"w":4,"dx":0}
		]];

	var abcNotCollision1 = "X:1\n" +
		"M:3/8\n" +
		"L:1/8\n" +
		"K:C\n" +
		"C3 & ABc | [CF]3 & ABc |C3 & [FA]Bc |"

	var expectedNotCollision1 = [[{"w":24.051,"dx":5},{"w":10.926,"dx":0.5955000000000004},{"w":16.26,"dx":12.81},{"w":1,"dx":0},{"w":16.26,"dx":12.81},{"w":1,"dx":0},{"w":16.26,"dx":12.81},{"w":1,"dx":0}],[{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":1,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":1,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":1,"dx":0}]]

	var twoStavesCollision = "X: 1\n" +
		"%%staves [(1 2) (3 4)]\n" +
		"V: 1 clef=treble\n" +
		"V: 2 clef=treble\n" +
		"V: 3 clef=bass\n" +
		"V: 4 clef=bass\n" +
		"K: C\n" +
		"[V: 1]A2 |d2 |\n" +
		"[V: 2]F2 |d2 |\n" +
		"[V: 3]A,2 |E,2 |\n" +
		"[V: 4]D,2 |D,2 |\n";

	var expectedTwoStavesCollision = [
		[
			{"w": 24.051, "dx": 5}, {"w": 9.81, "dx": 0}, {"w": 1, "dx": 0}, {"w": 9.81, "dx": 0}, {"w": 1, "dx": 0}
		], [
			{"w": 9.81, "dx": 0}, {"w": 1, "dx": 0}, {"w": 9.81, "dx": 0}, {"w": 1, "dx": 0}
		], [
			{"w": 25.153, "dx": 5}, {"w": 9.81, "dx": 0}, {"w": 1, "dx": 0}, {"w": 9.81, "dx": 0}, {"w": 1, "dx": 0}
		], [
			{"w": 9.81, "dx": 0}, {"w": 1, "dx": 0}, {"w": 19.62, "dx": 9.81}, {"w": 1, "dx": 0}
		]
	];

	var abcNotCollision2 = "X:1\n" +
		"L:1/4\n" +
		"K:GMin\n" +
		"V:1 up\n" +
		"V:2 merge down\n" +
		"V:3 bass,, up\n" +
		"V:4 bass,, merge down\n" +
		"K:GMin\n" +
		"[V:1] B2    A2 |\n" +
		"[V:2] G2   ^F2 |\n" +
		"[V:3] D3      C|\n" +
		"[V:4] D, C, D,2|"

	var expectedNotCollision2 = [
		[
			{"w":24.051,"dx":5},{"w":15.5,"dx":0},{"w":10.37,"dx":0},{"w":10.37,"dx":0},{"w":1,"dx":0}
		],[
			{"w":10.37,"dx":0},{"w":10.37,"dx":-10.25},{"w":1,"dx":0}
		],[
			{"w":25.153,"dx":5},{"w":15.5,"dx":0},{"w":16.82,"dx":13.37},{"w":9.81,"dx":0},{"w":1,"dx":0}
		],[
			{"w":9.81,"dx":0},{"w":9.81,"dx":0},{"w":10.37,"dx":0},{"w":1,"dx":0}
		]
	];

	var abcChordLayout = '"F"c3c|"C7"c2df|1f4- & "F"xx"Bb"x"Bbm"x|"F"f3z:|2f4- & "Bb"!style=harmonic!d2 "F"!style=harmonic!c "C7"!style=harmonic!B|"F"f4 & !style=harmonic!A4||\n'

	var expectedChordLayout = [{"x":54,"y":32},{"x":106,"y":32},{"x":344,"y":32},{"x":533,"y":32},{"x":190,"y":32},{"x":208,"y":32},{"x":254,"y":32},{"x":405,"y":32},{"x":455,"y":32},{"x":476,"y":32}];

	var abcStaccatoPlacement = "E.B .B"

	var expectedStaccatoPlacement = [{ x: 82, y: 64 }, { x: 112, y: 40 }]

	var abcRhythmPlacement = "R: reel\n" +
		"C"

	var expectedRhythmPlacement = [{ x: 20, y: 53 }]

	var lineTooWide = 
		"T:The title should be centered\n" +
		"R:Left\n" +
		"C:Right\n" +
		"L:1/4\n" +
		"K:B\n" +
		"c2c2|cccc|c2c2|cccc|\n" +
		'T:Subtitle\n' +
		'%%center Here is some centered text\n' +
		"G/G/G/G/G/G/G/G/|G/G/G/G/G/G/G/G/|G/G/G/G/G/G/G/G/|G/G/G/G/G/G/G/G/|G/G/G/G/G/G/G/G/|\n"


	var expectedLineTooWide = [
		[108,157,205,216,251,285,319,354,365,413,462,473,507,541,575,610],
		[313],
		[313],
		[108,119,130,141,152,162,173,184,200,211,222,232,243,254,265,276,287,302,313,324,335,346,357,367,378,389,405,416,427,438,448,459,470,481,492,507,518,529,540,551,562,573,583,594,610]
	]

	var equalSpacing =
	"T: Notes should take up the space proportional to their duration\n" +
	"L:1/4\n" +
	"Q:1/4=83\n" +
	"K:C\n" +
	"C (3DEF G/A/ | f4 | B//c//d//e// f2 (3g/f/e/ |z d z/c/ B//z// A/|\n" +
	"z d z/c/ B//z// A/|C (3DEF G/A/ | f4 | B//c//d//e// f2 (3g/f/e/ |\n" +
	" B//c//d//e// f2 (3g/f/e/ |z d z/c/ B//z// A/|C (3DEF G/A/ | f4 |\n" +
	"C4 | f4 | g3/2 a/ f3/4 e// d3/8 c/// B// A//|d3 c|\n" +
	"^C (3^D^E^F ^G/^A/ | f4 | g3/2 a/ f3/4 e// d3/8 c/// B// A//|d3 c|\n" +
	"\n"

	var accentSpacing = "X:1\n" +
		"L:1/4\n" +
		"%%staffwidth 100\n" +
		"K:C\n" +
		"A/ !>!A/ |]\n" +
		"w: L R|\n" +
		"A/!>!A/ |]\n" + // the beam is pushing the dynamics down
		"w: L R|\n"

	var expectedAccentSpacing = [
		{x: 49, y: 82},
		{x: 91, y: 82},
		{x: 49, y: 174},
		{x: 91, y: 174},
	]

	it("line-too-wide", function() {
		var visualObj = doLayoutTest(lineTooWide, {staffwidth: 500, expandToWidest: true }, expectedLineTooWide, 'staffwidth=500');
		var expected = ['', 313, '', '', 15, 611, '']
		var results = []
		//console.log(visualObj[0].topText)
		for (var i = 0; i < visualObj[0].topText.rows.length; i++) {
			var left = visualObj[0].topText.rows[i].left
			results.push(left ? Math.round(left) : '')
		}
		chai.assert.deepStrictEqual(results, expected, "top text");
	})

	it("min-spacing", function() {
		doLayoutTest(abcMinSpacing, {staffwidth: 260 }, expectedMinSpacing0, 'minPadding=0');
		doLayoutTest(abcMinSpacing, {staffwidth: 260, minPadding: 10 }, expectedMinSpacing10, 'minPadding=10');
	})

	it("colliding-notes1", function() {
		doCollidingNotesTest(abcCollidingNotes, expectedCollidingNotes)
	})

	it("not-colliding-notes", function() {
		doCollidingNotesTest(abcNotCollision1, expectedNotCollision1)
	})

	it("two-staves-collision", function() {
		doCollidingNotesTest(twoStavesCollision, expectedTwoStavesCollision)
	})

	it("not-collision", function() {
		doCollidingNotesTest(abcNotCollision2, expectedNotCollision2)
	})

	it("chord-layout", function() {
		doChordLayoutTest(abcChordLayout, expectedChordLayout)
	})

	it("staccato-placement", function() {
		doItemPlacementTest(abcStaccatoPlacement, expectedStaccatoPlacement, '[data-name="scripts.staccato"]');
	})

	it("rhythm-placement", function() {
		doItemPlacementTest(abcRhythmPlacement, expectedRhythmPlacement, '[data-name="clefs.G"]');
	})

	it("accent-spacing", function() {
		doItemPlacementTest(accentSpacing, expectedAccentSpacing, '[data-name="lyric"]');
	})

	it("measure-numbers", function() {
		doItemPlacementTest(abcBarLinesTreble, expectedBarLinesTreble, '[data-name="bar-number"]');
		doItemPlacementTest(abcBarLinesBass, expectedBarLinesBass, '[data-name="bar-number"]');
	})

	it("equal-spacing", function() {
		abcjs.renderAbc("paper", equalSpacing, {add_classes: true, timeBasedLayout:{minPadding: 5, minWidth: 1200}});
		var svg = document.querySelector('#paper svg')
		var OFFSET = 50
		var SPACING = 291.48725/4
		for (var i = 0; i < 17; i++) {
			const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
			line.setAttribute("x1", ''+(OFFSET+SPACING*i));
			line.setAttribute("y1", ''+90);
			line.setAttribute("x2", ''+(OFFSET+SPACING*i));
			line.setAttribute("y2", ''+510);
			line.setAttribute("stroke", "#0000ff50");
			svg.appendChild(line);
		}
	})

})

function doItemPlacementTest(abc, expected, selector) {
	abcjs.renderAbc("paper", abc, {add_classes: true});
	var els = document.querySelectorAll("#paper "+selector)
	var pos = []
	for (var i = 0; i < els.length; i++) {
		var bb = els[i].getBBox()
		pos.push({x: Math.round(bb.x), y: Math.round(bb.y)})
	}
	//console.log(pos)
	chai.assert.deepEqual(pos, expected)
}

function doChordLayoutTest(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc, { showDebug: "box", add_classes: true, staffwidth: 260, format: { gchordfont: "20"}});
	var els = document.querySelectorAll("#paper .abcjs-chord")
	var pos = []
	for (var i = 0; i < els.length; i++) {
		var bb = els[i].getBBox()
		pos.push({x: Math.round(bb.x), y: Math.round(bb.y)})
	}
	console.log(pos)
	chai.assert.deepEqual(pos, expected)
}

function doCollidingNotesTest(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc, {});
	var results = [];
	var errors = [];
	for (var ln = 0; ln < visualObj[0].lines.length; ln++) {
		var line = visualObj[0].lines[ln]
		if (line.staffGroup && line.staffGroup.voices) {
			if (line.staffGroup.voices.length > 1) {
				for (var v = 0; v < line.staffGroup.voices.length; v++) {
					if (!results[v]) results[v] = [];
					var voice = line.staffGroup.voices[v];
					for (var e = 0; e < voice.children.length; e++) {
						var el = voice.children[e]
						var r = { w: el.w, dx: el.children[0].dx}
						results[v].push(r)
						if (!expected[v] || !expected[v][e])
							console.log(v, e, r)
						if (expected[v][e].w !== r.w || expected[v][e].dx !== r.dx)
							errors.push({v: v, e: e, exp: expected[v][e], rcv: r})
						//console.log(v, e, "EXP", expected[v][e], "RCV", r)
					}
				}
			}
		}
	}
	console.log(JSON.stringify(results))
	if (errors.length > 0)
		chai.assert.equal(true, false, JSON.stringify(errors, null, "    "));

}

function doLayoutTest(abc, params, expected, comment) {
	var visualObj = abcjs.renderAbc("paper", abc, params);
	if (params.staffwidth)
		verticalLine("#paper svg", params.staffwidth+15) // 15 is for the padding
	var result = [];
	for (var j = 0; j < visualObj[0].lines.length; j++) {
		var arr = [];
		if (visualObj[0].lines[j].staff) {
			for (var i = 0; i < visualObj[0].lines[j].staff[0].voices[0].length; i++) {
				var el = visualObj[0].lines[j].staff[0].voices[0][i];
				arr.push(Math.round(el.abselem.x));
			}
		} else if (visualObj[0].lines[j].nonMusic && visualObj[0].lines[j].nonMusic.rows) {
			for (var k = 0; k < visualObj[0].lines[j].nonMusic.rows.length; k++) {
				var row = visualObj[0].lines[j].nonMusic.rows[k]
				if (row.left)
					arr.push(Math.round(row.left))
			}
		}
		result.push(arr);
	}
	for (j = 0; j < result.length; j++) {
		var recv = result[j];
		var exp = expected[j];
		var msg = comment + "\nrcv: " + JSON.stringify(recv) + "\n" +
			"exp: " + JSON.stringify(exp) + "\n";
		chai.assert.deepStrictEqual(recv, exp, msg);
	}

	//console.log(result)
	return visualObj
}

function verticalLine(selector, x) {
	var svgNS = "http://www.w3.org/2000/svg";
	var cursor = document.createElementNS(svgNS, "line");
	cursor.setAttribute("class", "abcjs-cursor");
	cursor.setAttributeNS(null, 'x1', x);
	cursor.setAttributeNS(null, 'y1', 0);
	cursor.setAttributeNS(null, 'x2', x);
	cursor.setAttributeNS(null, 'y2', 800);
	cursor.setAttributeNS(null, 'stroke', "blue");
	var svg = document.querySelector(selector);
	svg.appendChild(cursor);

}
