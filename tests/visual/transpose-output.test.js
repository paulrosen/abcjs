describe("Transpose Output", function () {
	var abcAll = "T: Transpose Output\n" +
		"K: Eb\n" +
		"V: 1\n" +
		'"Eb"C_D"Eb/C"!marcato!E^F ^^GAB"Ab7b5"z|E__E_E E =E^E^^E E|\n' +
		"V: 2\n" +
		'C,_D,=E,^F, "N.C."G,A,B,"^Coda"c,| z8|\n' +
		"V: 1\n" +
		"c_d_e^f [gbd]__abc'|\n" +
		"V: 2\n" +
		"c'_d'e'^f' g'a'b'Tc''|\n"

	var abcAllExpected = "T: Transpose Output\n" +
		"K: F\n" +
		"V: 1\n" +
		'"F"D_E"F/D"!marcato!F^G ^^ABc"Bb7b5"z|F_F=F F ^F^^F^^G G|\n' +
		"V: 2\n" +
		'D,_E,^F,^G, "N.C."A,B,C"^Coda"D| z8|\n' +
		"V: 1\n" +
		"d_ef^g [eac']__bc'd'|\n" +
		"V: 2\n" +
		"d'_e'f'^g' a'b'c''Td''|\n"

	var abcChords = "T: Transpose Output\n" +
		"K: D\n" +
		'[DEF] [_DE^F] [_E=F_G] |\n'

	var abcChordsExpected = "T: Transpose Output\n" +
		"K: E\n" +
		'[EFG] [_EFG] [=F=G_A] |\n'

	var abcChordSymbols = 'X:1\n' +
		"T: Transpose Output\n" +
		'K:C\n' +
		'"N.C."c|"C"c"C#"c"Dmaj7"c"D#"c|"E"c"F"c"F#"c"G"c|"G#"c"A/F#"c"A#"c"B"c|"Db"c"Eb"c"Gb"c"Ab"c|"Bb"c "C/B"c "C/Bb"c "C/A#"c | "C/A"c "C/Ab"c "C/G#"c "C/G"c ||'

	var abcChordSymbolsExpected = 'X:1\n' +
		"T: Transpose Output\n" +
		'K:D\n' +
		// TODO-PER: the C#, D#, G#, and A# should probably be expressed as flats.
		'"N.C."d|"D"d"D#"d"Emaj7"d"F"d|"F#"d"G"d"G#"d"A"d|"A#"d"B/G#"d"C"d"C#"d|"D#"d"F"d"G#"d"A#"d|"C"d "D/C#"d "D/C"d "D/C"d | "D/B"d "D/A#"d "D/A#"d "D/A"d ||'

	var abcMeasureAccidental = "T: Transpose Output\n" +
		"L: 1/4\n" +
		"K: C\n" +
		'ABcd _A_B_c_d z ABcd =A=B=c=d z ABcd |\n ^A^B^c^d z ABcd ^^A^^B^^c^^d z ABcd __A__B__c__d ABcd |\n'

	var abcMeasureAccidentalExpected = "T: Transpose Output\n" +
		"L: 1/4\n" +
		"K: D\n" +
		'Bcde _B=c_d_e z Bcde =B^c=d=e z Bcde |\n ^B^^c^d^e z Bcde ^^Bd^^d^^e z B^d^^de __B_c__d__e Bcde |\n'

	var abcInline = "T: Transpose Output\n" +
		"K: C\n" +
		"C_DE^F GABc| [K:D] d_e^fg abc'd'|\n" +
		"d_e^fg abc'd'||\n"

	var abcInlineExpected = "T: Transpose Output\n" +
		"K: D\n" +
		"D_EF^G ABcd| [K:E] e=fga bc'd'e'|\n" +
		"e=fga bc'd'e'||\n"

	var abcKeyChange = "T: Transpose Output\n" +
		"K: Eb\n" +
		"EFGA|\n" +
		"K:B\n" +
		"Bcde||\n"

	var abcKeyChangeExpected = "T: Transpose Output\n" +
		"K: F\n" +
		"FGAB|\n" +
		"K:Db\n" +
		"defg||\n"

	var abcMinor = "T: Transpose Output\n" +
		"K: Em\n" +
		"EFGA|Bcde|\n"

	var abcMinorExpected = "T: Transpose Output\n" +
		"K: F#m\n" +
		"FGAB|cdef|\n"

	var abcNone = "T: Transpose Output\n" +
		"K: none\n" +
		"CDEF ^C^D^E^F CDEF|GABc _G_A_B_c GABc|^^C^^D^^E^^F CDEF|__G__A__B__c GABc|\n"

	var abcNoneExpected = "T: Transpose Output\n" +
		"K: none\n" +
		"DEFG ^D^E^F^G DEFG|ABcd _A_B_c_d ABcd|^^D^^E^^F^^G DEFG|__A__B__c__d ABcd|\n"

	var abcDorian = "T: Transpose Output\n" +
		"K: EDor\n" +
		"EFGA|Bcde|\n"

	var abcDorianExpected = "T: Transpose Output\n" +
		"K: F#Dor\n" +
		"FGAB|cdef|\n"

	var abcGrace = "T: Transpose Output\n" +
		"K: G\n" +
		"{A}G{dcB}A|\n"

	var abcGraceExpected = "T: Transpose Output\n" +
		"K: A\n" +
		"{B}A{edc}B|\n"

	var abcBagpipes = "X:1\n" +
	"T:Scotland The Brave\n" +
	"L:1/8\n" +
	"M:4/4\n" +
	"K:Hp\n" +
	"e|{g}A2 {GdGe}A>B {gcd}c{e}A {gcd}ce| {ag}a2{g}a2 {GdG}ae {gcd}c{e}A|\n"

	var abcBagpipesExpected = "X:1\n" +
	"T:Scotland The Brave\n" +
	"L:1/8\n" +
	"M:4/4\n" +
	"K:Hp\n" +
	"e|{g}A2 {GdGe}A>B {gcd}c{e}A {gcd}ce| {ag}a2{g}a2 {GdG}ae {gcd}c{e}A|\n"

	// TODO-PER: do all of the following tests for -14, -12, -11, -2, -1, 0, 1, 2, 11, 12, 14 steps
	it("output-transpose-chords", function () {
		outputTest(abcChords, abcChordsExpected, 2)
	})

	it("output-transpose-chord-symbols", function () {
		outputTest(abcChordSymbols, abcChordSymbolsExpected, 2)
	})

	it("output-measure-accidental", function () {
		outputTest(abcMeasureAccidental, abcMeasureAccidentalExpected, 2)
	})

	it("output-all", function () {
		outputTest(abcAll, abcAllExpected, 2)
	})

	it("output-inline-key", function () {
		outputTest(abcInline, abcInlineExpected, 2)
	})

	it("output-dorian", function () {
		outputTest(abcDorian, abcDorianExpected, 2)
	})

	it("output-minor", function () {
		outputTest(abcMinor, abcMinorExpected, 2)
	})

	it("output-none", function () {
		outputTest(abcNone, abcNoneExpected, 2)
	})

	it("output-grace", function () {
		outputTest(abcGrace, abcGraceExpected, 2)
	})

	it("output-key-change", function () {
		outputTest(abcKeyChange, abcKeyChangeExpected, 2)
	})

	it("output-bagpipes", function () {
		outputTest(abcBagpipes, abcBagpipesExpected, 2)
	})
})

function outputTest(abc, expected, steps) {
	var visualObj = abcjs.renderAbc("paper", abc);
	var output = abcjs.strTranspose(abc, visualObj, steps)
	abcjs.renderAbc("paper", "%%stretchlast\n" + abc + output);
	chai.assert.equal(output, expected, "\n" + output.replace(/\n/g, ' ↲ ') + "\n" + expected.replace(/\n/g, ' ↲ ') + "\n")
}
