describe("Chord Grid", function () {
	const abcAce = `X:1
M:4/4
L:1/8
N:fermata
N:annotation
N:first chord in measure blank
K:Bb
P:A
F2[|"Bb"dddd "Gb7"_d3d|"Bb"dddd "Gb7"_d4|"Bb"dd^cd "G7"ed=BG|"Cm"c6G2|
ee"G7"df"Cm"e2GG|"Cm"ee"G7"df"Cm"e4|"C7"=edc_c BGAB|"F7"c6F2||
P:B
"Bb"dddd "Gb7"_dd2d|"Bb"=dddd "Gb7"_dd2F|"Bb"dd^cd "G7"ed=BG|"Cm"c6cd|
"C7"=eede "F"dc2d|"C7"=eede "F"dc3|"C7"cc"C7b5"cc cGAB|"F7"!fermata!c8"^uptempo"y|
`

	const expectedAce = [{"type":"part","name":"A","lines":[[{"chord":["B♭","","G♭7",""]},{"chord":["B♭","","G♭7",""]},{"chord":["B♭","","G7",""]},{"chord":["Cm","","",""]},{"chord":["Cm","G7","Cm",""]},{"chord":["Cm","G7","Cm",""]},{"chord":["C7","","",""]},{"chord":["F7","","",""]}]]},{"type":"part","name":"B","lines":[[{"chord":["B♭","","G♭7",""]},{"chord":["B♭","","G♭7",""]},{"chord":["B♭","","G7",""]},{"chord":["Cm","","",""]},{"chord":["C7","","F",""]},{"chord":["C7","","F",""]},{"chord":["C7","C7♭5","",""]},{"chord":["F7","","",""],"annotations":["fermata","uptempo"]}]]}]

	const abcAfter = `X:1
M:4/4
L:1/8
N:Chords in second voice
N:20-bar phrase
K:Bb
P:Verse
"Bb"zFGB FGBG|"C7"cd2c-"F7"c4|"Bb7"c2d2dB2G-|G6 z2 && "Eb"x4"G7"x2"Cm"x2 |
"Edim"zFGB FGBc|"Bb"dB2F-"G7"F4|"C9"dG2G-"F7"G2F2|B8 && "Bb"x4"Bb+"x4||
P:Chorus
|:"Eb"GBcd-d4|"Ebm"zcdc dc3|"Bb"DFGA-A4|"G7"zGAG AG3|
"C9"Gd2d-d4|"F7"Gc2c-c4|"Bb"zFGF AFGF|BD2F-F4|
"Eb"GBcd-d4|"Ebm"zcdc dc3|"Bb"DFGA-A4|"G7"zGAG AG3|
"Cm"e4"G7"d4|"Cm"c^FGd-"Cm7b5"d2c2|"Bb"z^cdB "D7"=c=BcA|"Gm"B^CDA-"Edim"A2G2|
"Bb"FGBd-d4|"F7"zEFA c2d2|"Bb"dB-"Eb7"B6-|"Bb"B2z2z4:|
`

	const expectedAfter = []

	const abcAint = `X:1
M:4/4
L:1/8
N:1st & 2nd ending
N:pickup notes
N:measures with no chord change
K:C
P:Verse
GA>c edcc |: "C"A3G- G4 | zGA>c "C7"edcG|"F"A3A- A4 |zGG>G AGAG|
"G7"g3d- d4 | zee>g ecAG|1"C"(_e/d/c-"F"c6) | "G7" zGA>c edcc :|2"C"(_e/d/cc2-) "F"c4- |"C"c4 zcdc ||
`

	const expectedAint = [{"type":"part","name":"Verse","lines":[[{"chord":["C","","",""],"hasStartRepeat":true},{"chord":["C","","C7",""]},{"chord":["F","","",""]},{"chord":["","","",""]},{"chord":["G7","","",""]},{"chord":["","","",""]},{"chord":["C","F","",""],"ending":"1"},{"chord":["G7","","",""],"hasEndRepeat":true}],[{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"chord":["C","","F",""],"ending":"2"},{"chord":["C","","",""]}]]}]

	const abcAll = `X:1
M: 4/4
N:1st & 2nd ending same chords
N:12-bar
N:No Chord on second beat
K: Bb
P:A
F GB-|:"Bb7"B2z2z2_dB-|B2z2z2_de-|e2z2zFG2|B2c_d- d^FGB-|
"Eb7"B2z2z2cB-|B2z2z2gf-|"Bb7"f2z2zd2^c|dBGF-"G7"F2ze-|
"Cm7"ed (3ede-e2=ef-|"F7"f2z2z2zB|"Bb7"f2ef"Eb7"_d2BB-|1"Bb7"B2z2"F7"zF GB-:|2"Bb7"B2z2"F7"z4||
P:B
!mark!"Bb7"zg2f- fBFB-|B_dz2z4|zg f_d-d2BB-|B2z2z4|
"Eb7"zg2f- f_dB2|zg2f- fBBB|"Bb7"_d2 "^N.C."B2B2Bc-|c2z2zF GB-!mark!||
`

	const expectedAll = []

	const abcAnd = `X:1
L:1/4
N:10-measures
M:4/4
K:E
P:A
"F#m"zFG/Ad/-|"C#m"d/ce/-e2|"F#m"zFG/Ad/-|"C#m"d/c/-c2z|
"F#m"zFG/Ad/-|"C#m"d/ce/-e2|"A"zec/A(G/-|"B7"F2)z/C/B,/C/-|"Eb"C/G/-G3|z4:|
`

	const expectedAnd = [{"type":"part","name":"A","lines":[[{"chord":["F♯m","","",""]},{"chord":["C♯m","","",""]},{"chord":["F♯m","","",""]},{"chord":["C♯m","","",""]},{"chord":["F♯m","","",""]},{"chord":["C♯m","","",""]},{"chord":["A","","",""]},{"chord":["B7","","",""]}],[{"chord":["E♭","","",""]},{"chord":["","","",""],"hasEndRepeat":true}]]}]

	const abcAuld = `X:1
M: 4/4
L: 1/4
N:Lots of chords
N:chords in overlay
K: F
C |: "F6"F3/ E/"Dm7"FA|"Gm7"G3/ F/"C7"GA/G/|
"F6"F3/F/"F7"A"B7#5"c|"BbΔ7"d3 "B°7"d|"FΔ7"c3/A/"Dm7"AF|
"Gm7"G3/F/"C7"G"C#°7"A/G/|"Dm7"F3/D/"Gm7"D"C7"C|"F6"F3"C7#5"d||
"FΔ7"c3/ A/"Dm7"AF|"Gm7"G3/F/"C7"G"Gb7#5"d|"FΔ7"c3/A/"F7"A"B7#5"c|
"BbΔ7"d3"B°7"d|"FΔ7"c3/A/"Dm7"AF|"Gm7"G3/F/"C7"G"C#°7"A/G/|
"Dm7"F3/D/"Gm7"D"C7"C|1"F6"F3"C7"C :|2F4 && "Ab6"x2 "GbΔ7"x"F6"x|]
`

	const expectedAuld = [{"type":"part","name":"","lines":[[{"chord":["F6","","Dm7",""],"hasStartRepeat":true},{"chord":["Gm7","","C7",""]},{"chord":["F6","","F7","B7♯5"]},{"chord":["B♭Δ7","","","B°7"]},{"chord":["FΔ7","","Dm7",""]},{"chord":["Gm7","","C7","C♯°7"]},{"chord":["Dm7","","Gm7","C7"]},{"chord":["F6","","","C7♯5"]}],[{"chord":["FΔ7","","Dm7",""]},{"chord":["Gm7","","C7","G♭7♯5"]},{"chord":["FΔ7","","F7","B7♯5"]},{"chord":["B♭Δ7","","","B°7"]},{"chord":["FΔ7","","Dm7",""]},{"chord":["Gm7","","C7","C♯°7"]},{"chord":["Dm7","","Gm7","C7"]},{"chord":["F6","","","C7"],"ending":"1","hasEndRepeat":true}],[{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"chord":["A♭6","","G♭Δ7","F6"],"ending":"2"}]]}]

	const abcBasin = `X:1
M: 4/4
%%score (1 2)
L: 1/8
N:2nd voice
N:Break on second beat
N:chords on beats 1,3,4
K: Bb
V:1
P: Intro and Outro
FF|:"Bb"DDE2=EF3|x8|BB_AG "F7"FG3|x8|
"Bb"FB2F"Bb7"B2FF|"Eb"B2Bc- "Ebm"c4|"Bb"zB"^break" _AG FDE=E|1"F7"F2_DB,-"Bb"B,2y"F+7"zF:|2"F7"F2_DB,-"Bb"B,4||
V:2 cue=on
xx|:x8|DDE2=EF3|x8|"Bb"BF_AG "F7"FG3|
`

	const expectedBasin = [{"type":"part","name":"Intro and Outro","lines":[[{"chord":["B♭","","",""],"hasStartRepeat":true},{"chord":["","","",""]},{"chord":["B♭","","F7",""]},{"chord":["B♭","","F7",""]},{"chord":["B♭","","B♭7",""]},{"chord":["E♭","","E♭m",""]},{"chord":["B♭","break","",""]},{"chord":["F7","","B♭","F+7"],"ending":"1","hasEndRepeat":true}],[{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"chord":["F7","","B♭",""],"ending":"2"}]]}]

	const abcBill = `X:1
T:Bill Bailey
M:4/4
N:Subtitles
N:free text inserted
L:1/4
K:C
T:First Half
"C"GA2c|e3/2^d/2eg|GA2c|e4|
GA2c|e2g2|"G7"(gB3-|B4)|
GB2d|fefg|GB2d|f4|
GB2d|g2"G+"a2|"C"(ae3-|e4)|
T:Second Half
"C"GA2c|e3/2^d/2eg|GA2c|e3G|
GGce|g2_b2|"F"a4-|a3c|
%%text extra text is shown and causes a part break
"F"cc2c|"F#°7"d2c2|"C"gg2a|"A7"e3e|
"D7"ed^cd|"G7"f2e2|"C"c4-|czz2|]
`

	const expectedBill = [{"type":"subtitle","subtitle":"First Half"},{"type":"part","name":"","lines":[[{"chord":["C","","",""]},{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["G7","","",""]},{"chord":["","","",""]}],[{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["G7","","G+",""]},{"chord":["C","","",""]},{"chord":["","","",""]}]]},{"type":"subtitle","subtitle":"Second Half"},{"type":"part","name":"","lines":[[{"chord":["C","","",""]},{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["","","",""]},{"chord":["F","","",""]},{"chord":["","","",""]}]]},{"type":"text","text":"extra text is shown and causes a part break"},{"type":"part","name":"","lines":[[{"chord":["F","","",""]},{"chord":["F♯°7","","",""]},{"chord":["C","","",""]},{"chord":["A7","","",""]},{"chord":["D7","","",""]},{"chord":["G7","","",""]},{"chord":["C","","",""]},{"chord":["","","",""]}]]}]

	const abcWaltz = `X: 35
T:Mollie's Garden
M:3/4
L:1/8
Q:1/2=90
C:Paul Rosen
S:Copyright 2007, Paul Rosen
R:Waltz
K:D
"D"a6|f6|"G"g3f ed|B4cB|"A7"A4AB|c2e2a2|"D"g6|f6|"D"a6|"(Bm)"f6|"G"g3f ed|"(Em)"B4cB|
"A7"A4AB|c2e2A2|"D"d6-|d4 dc||"Bm"B4Bc|d2e2g2|f6|d6|"A7"e4 ef|
e2d2e2|"D"f6-|f4 dc|"Bm"B4Bc|d2e2g2|f6|"B7"a6|"Em"e4 ef|"A7"g2e2A2|"D"d6-|d6:|`

	const abcNoChords = `X:1
T:Bill Bailey
M:4/4
L:1/4
K:C
P:A
GA2c|e3/2^d/2eg|GA2c|e4|
GA2c|e2g2|(gB3-|B4)|
GB2d|fefg|GB2d|f4|
GB2d|g2a2|(ae3-|e4)|
P:B
GA2c|e3/2^d/2eg|GA2c|e3G|
GGce|g2_b2|a4-|a3c|
cc2c|d2c2|gg2a|e3e|
ed^cd|f2e2|c4-|czz2|]
`

	it("ace", function () {
		parserTest(abcAce, expectedAce);
	})

	it("after", function () {
		parserTest(abcAfter, expectedAfter);
	})

	it("aint", function () {
		parserTest(abcAint, expectedAint);
	})

	it("all", function () {
		parserTest(abcAll, expectedAll);
	})

	it("and", function () {
		parserTest(abcAnd, expectedAnd);
	})

	it("auld", function () {
		parserTest(abcAuld, expectedAuld);
	})

	it("basin", function () {
		parserTest(abcBasin, expectedBasin);
	})

	it("bill", function () {
		parserTest(abcBill, expectedBill);
	})

	it("waltz", function () {
		parserTest(abcWaltz, undefined);
	})

	it("no-chords", function () {
		parserTest(abcNoChords, undefined);
	})

})

function parserTest(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc, { chordGrid: "withMusic", format: {
		gchordfont: "itim-music, itim, Verdana, sans-serif 18"
		}
	});
	var warningEl = document.getElementById('warnings')
	if (visualObj[0].warnings) {
		warningEl.innerHTML = visualObj[0].warnings
	} else
		warningEl.innerText = ''
	var grid = visualObj[0].chordGrid
	chai.assert.deepEqual(grid, expected)
}
