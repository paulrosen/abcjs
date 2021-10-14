describe("Layout", function() {
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

	it("min-spacing", function() {
		doLayoutTest(abcMinSpacing, {staffwidth: 260 }, expectedMinSpacing0, 'minPadding=0');
		doLayoutTest(abcMinSpacing, {staffwidth: 260, minPadding: 10 }, expectedMinSpacing10, 'minPadding=10');
	})

	it("colliding-notes", function() {
		doCollidingNotesTest(abcCollidingNotes, expectedCollidingNotes)
	})

})

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
						if (expected[v][e].w !== r.w || expected[v][e].dx !== r.dx)
							errors.push({v: v, e: e, exp: expected[v][e], rcv: r})
						//console.log(v, e, "EXP", expected[v][e], "RCV", r)
					}
				}
			}
		}
	}
	if (errors.length > 0)
		chai.assert.equal(true, false, JSON.stringify(errors, null, "    "));

	//console.log(JSON.stringify(results))
}

function doLayoutTest(abc, params, expected, comment) {
	var visualObj = abcjs.renderAbc("paper", abc, params);
	if (params.staffwidth)
		verticalLine("#paper svg", params.staffwidth+15) // 15 is for the padding
	var result = [];
	for (var j = 0; j < visualObj[0].lines.length; j++) {
		var arr = [];
		for (var i = 0; i < visualObj[0].lines[j].staff[0].voices[0].length; i++) {
			var el = visualObj[0].lines[j].staff[0].voices[0][i];
			arr.push(Math.round(el.abselem.x));
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

	console.log(result)
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
