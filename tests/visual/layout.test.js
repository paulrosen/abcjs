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

	it("min-spacing", function() {
		doLayoutTest(abcMinSpacing, {staffwidth: 260 }, expectedMinSpacing0, 'minPadding=0');
		doLayoutTest(abcMinSpacing, {staffwidth: 260, minPadding: 10 }, expectedMinSpacing10, 'minPadding=10');
	})
})

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
