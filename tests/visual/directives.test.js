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
