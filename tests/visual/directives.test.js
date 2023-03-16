describe("Directives", function() {
	var stretchLastAbc1 = "M:4/4\ncdef cdef|";

	var stretchLastFalse1 = [70.846, 100.846, 130.846, 160.846, 190.846, 220.846, 250.846, 280.846];
	var stretchLastTrue1 = [70.846, 156.24025, 241.6345, 327.02875, 412.423, 497.81725, 583.2115, 668.60575];

	it("stretchlast", function() {
		allTests(stretchLastAbc1, "stretchlast", stretchLastFalse1,
			[ false, true, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
			[ stretchLastFalse1, stretchLastTrue1, stretchLastFalse1, stretchLastFalse1, stretchLastFalse1,
				stretchLastFalse1, stretchLastFalse1, stretchLastFalse1, stretchLastTrue1, stretchLastTrue1, stretchLastTrue1,
				stretchLastTrue1, stretchLastTrue1
			]
		);
	})

	var voiceColorAbc = 'K:C\nV:1\nC\nV:2\n%%voicecolor orange\nE\nV:3\n%%voicecolor "#f0a0f0"\nG\nV:4\nB\nV:1\n%%voicecolor blue\nC\nV:2\nE\nV:3\nG\nV:4\nB\n'

	var voiceColorExpected = [ 'currentColor', 'orange', '#f0a0f0', 'currentColor', 'blue', 'orange', '#f0a0f0', 'currentColor', ]

	var voiceColorAbc2 = '%%staves (1 2 3 4)\nK:C\nV:1\nC,\nV:2\n%%voicecolor "orange"\nE\nV:3\n%%voicecolor "#f0a0f0"\ne\nV:4\nb\'\nV:1\n%%voicecolor blue\nC,\nV:2\nE\nV:3\ne\nV:4\nb\'\n'

	it("voicecolor", function() {
		doColorTest(voiceColorAbc, voiceColorExpected)
		doColorTest(voiceColorAbc2, voiceColorExpected)
	})

	var abcRemark = "DEF [r:and this is a remark] FED:|\n"

	var abcRemarkExpected = ['note', 'note', 'note', 'note', 'note', 'note', 'bar']

	it("remark", function() {
		doNoteTest(abcRemark, abcRemarkExpected)
	})

})

function allTests(abc, directive, blankExpected, values, expectedArray) {
	doDirectiveTest(abc, {}, blankExpected, "undefined");
	for (var i = 0; i < values.length; i++) {
		var formatting = {};
		formatting[directive] = values[i];
		doDirectiveTest(abc, { format: formatting}, expectedArray[i], "[param]" + directive + '=' + values[i]);
		var directiveAbc = "%%" + directive + " " + values[i] + "\n" + abc;
		doDirectiveTest(directiveAbc, { }, expectedArray[i], "[%%]" + directive + '=' + values[i]);
	}
}

function doDirectiveTest(abc, params, expected, comment) {
	var visualObj = abcjs.renderAbc("paper", abc, params);
	var selectables = visualObj[0].engraver.selectables;
	var xes = [];
	for (var i = 0; i < selectables.length; i++)
		xes.push(selectables[i].absEl.x);
	var msg = comment + "\nrcv: " + JSON.stringify(xes) + "\n" +
		"exp: " + JSON.stringify(expected) + "\n";
	chai.assert.deepStrictEqual(xes, expected, msg);
}

function doColorTest(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc);
	console.log(visualObj[0].lines[0].staff)
	var els = document.querySelectorAll('[data-name="note"]')
	var colors = []
	for (var i = 0; i < els.length; i++)
		colors.push(els[i].attributes.fill.value)
	chai.assert.deepStrictEqual(colors, expected)
}

function doNoteTest(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc);
	chai.assert.equal(visualObj[0].warnings, undefined)
	var elements = [  ]
	for (var i = 0; i < visualObj[0].lines[0].staff[0].voices[0].length; i++) {
		var item = visualObj[0].lines[0].staff[0].voices[0][i]
		elements.push(item.el_type)
	}
	chai.assert.deepStrictEqual(elements, expected)
}