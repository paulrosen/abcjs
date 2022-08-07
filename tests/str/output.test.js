describe("Output", function() {
	var abcInline = "T: Transpose Output\n" +
		"K: Eb\n" +
		"V: 1\n" +
		'"Eb"C_D"Eb"E^F ^^GABz|E__E_E E =E^E^^E E|\n' +
		"V: 2\n" +
		"C,_D,=E,^F, G,A,B,c,| z8|\n" +
		"V: 1\n" +
		"c_d_e^f g__abc'|\n" +
		"V: 2\n" +
		"c'_d'e'^f' g'a'b'Tc''|\n"

	var abcInlineExpected = "T: Transpose Output\n" +
		"K: F\n" +
		"V: 1\n" +
		'"F"D_E"F"F^G ^^ABcz|F__F_F F =F^F^^F F|\n' +
		"V: 2\n" +
		"D,_E,=F,^G, A,B,c,d,| z8|\n" +
		"V: 1\n" +
		"d_e_f^g a__bc'd'|\n" +
		"V: 2\n" +
		"d'_e'f'^g' a'b'c''Td'''|\n"

	it("output", function () {
		outputTest(abcInline, abcInlineExpected, 2)
	})
})

function outputTest(abc, expected, steps) {
	var visualObj = abcjs.renderAbc("paper", abc);
	var output = abcjs.strTranspose(abc, visualObj, steps)
	chai.assert.equal(output, expected, "\n"+output.replace(/\n/g,' ↲ ')+"\n"+expected.replace(/\n/g,' ↲ ')+"\n")
}
