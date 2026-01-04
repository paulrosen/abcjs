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

	const expectedAfter = [{"type":"part","name":"Verse","lines":[[{"chord":["B♭","","",""]},{"chord":["C7","","F7",""]},{"chord":["B♭7","","",""]},{"chord":["E♭","","G7","Cm"]},{"chord":["Edim","","",""]},{"chord":["B♭","","G7",""]},{"chord":["C9","","F7",""]},{"chord":["B♭","","B♭+",""]}]]},{"type":"part","name":"Chorus","lines":[[{"chord":["E♭","","",""],"hasStartRepeat":true},{"chord":["E♭m","","",""]},{"chord":["B♭","","",""]},{"chord":["G7","","",""]},{"chord":["C9","","",""]},{"chord":["F7","","",""]},{"chord":["B♭","","",""]},{"chord":["%","","",""]}],[{"chord":["E♭","","",""]},{"chord":["E♭m","","",""]},{"chord":["B♭","","",""]},{"chord":["G7","","",""]},{"chord":["Cm","","G7",""]},{"chord":["Cm","","Cm7♭5",""]},{"chord":["B♭","","D7",""]},{"chord":["Gm","","Edim",""]}],[{"chord":["B♭","","",""]},{"chord":["F7","","",""]},{"chord":["B♭","E♭7","",""]},{"chord":["B♭","","",""],"hasEndRepeat":true}]]}]

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

	const expectedAint = [{"type":"part","name":"Verse","lines":[[{"chord":["C","","",""],"hasStartRepeat":true},{"chord":["C","","C7",""]},{"chord":["F","","",""]},{"chord":["%","","",""]},{"chord":["G7","","",""]},{"chord":["%","","",""]},{"chord":["C","F","",""],"ending":"1"},{"chord":["G7","","",""],"hasEndRepeat":true}],[{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"chord":["C","","F",""],"ending":"2"},{"chord":["C","","",""]}]]}]

	const abcAll = `X:1
M: 4/4
N:1st & 2nd ending same chords
N:12-bar
N:No Chord on second beat
N:ignore "y"
K: Bb
P:A
F GB-|:"Bb7"B2z2z2_dB-|B2z2z2_de-|e2z2zFG2|B2c_d- d^FGB-|
"Eb7"B2z2z2cB-|B2z2z2gf-|"Bb7"f2z2zd2^c|dBGF-"G7"F2ze-|
"Cm7"ed (3ede-e2=ef-|"F7"f2z2z2zB|"Bb7"f2ef"Eb7"_d2BB-|1"Bb7"B2z2"F7"zF GB-:|2"Bb7"B2z2"F7"z4||
P:B
!mark!"Bb7"zg2yf- fBFB-|B_dz2z4|zg f_d-d2BB-|B2z2z4|
"Eb7"zg2f- f_dB2|zg2f- fBBB|"Bb7"_d2y4 "^N.C."B2B2Bc-|c2z2zF GB-!mark!||
`

	const expectedAll = [{"type":"part","name":"A","lines":[[{"chord":["B♭7","","",""],"hasStartRepeat":true},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]}],[{"chord":["E♭7","","",""]},{"chord":["%","","",""]},{"chord":["B♭7","","",""]},{"chord":["B♭7","","G7",""]}],[{"chord":["Cm7","","",""]},{"chord":["F7","","",""]},{"chord":["B♭7","","E♭7",""]},{"chord":["B♭7","","F7",""],"hasEndRepeat":true}]]},{"type":"part","name":"B","lines":[[{"chord":["B♭7","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["E♭7","","",""]},{"chord":["%","","",""]},{"chord":["B♭7","N.C.","",""]},{"chord":["N.C.","","",""]}]]}]

	const abcAnd = `X:1
L:1/4
N:10-measures
M:4/4
K:E
P:A
"F#m"zFG/Ad/-|"C#m"d/ce/-e2|"F#m"zFG/Ad/-|"C#m"d/c/-c2z|
"F#m"zFG/Ad/-|"C#m"d/ce/-e2|"A"zec/A(G/-|"B7"F2)z/C/B,/C/-|"Eb"C/G/-G3|z4:|
`

	const expectedAnd = [{"type":"part","name":"A","lines":[[{"chord":["F♯m","","",""]},{"chord":["C♯m","","",""]},{"chord":["F♯m","","",""]},{"chord":["C♯m","","",""]},{"chord":["F♯m","","",""]},{"chord":["C♯m","","",""]},{"chord":["A","","",""]},{"chord":["B7","","",""]}],[{"chord":["E♭","","",""]},{"chord":["%","","",""],"hasEndRepeat":true}]]}]

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

	const expectedBasin = [{"type":"part","name":"Intro and Outro","lines":[[{"chord":["B♭","","",""],"hasStartRepeat":true},{"chord":["%","","",""]},{"chord":["B♭","","F7",""]},{"chord":["B♭","","F7",""]},{"chord":["B♭","","B♭7",""]},{"chord":["E♭","","E♭m",""]},{"chord":["B♭","break","",""]},{"chord":["F7","","B♭","F+7"],"ending":"1","hasEndRepeat":true}],[{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"chord":["F7","","B♭",""],"ending":"2"}]]}]

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

	const expectedBill = [{"type":"part","name":"","lines":[[{"chord":["C","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["G7","","",""]},{"chord":["%","","",""]}],[{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["G7","","G+",""]},{"chord":["C","","",""]},{"chord":["%","","",""]}]]},{"type":"subtitle","subtitle":"Second Half"},{"type":"part","name":"","lines":[[{"chord":["C","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["F","","",""]},{"chord":["%","","",""]}]]},{"type":"text","text":"extra text is shown and causes a part break"},{"type":"part","name":"","lines":[[{"chord":["F","","",""]},{"chord":["F♯°7","","",""]},{"chord":["C","","",""]},{"chord":["A7","","",""]},{"chord":["D7","","",""]},{"chord":["G7","","",""]},{"chord":["C","","",""]},{"chord":["%","","",""]}]]}]

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

	const abcBye = `X:1347
M:C|
L:1/4
Q:Rubato
N:cut time
N:tempo change
N:y - spacer
N:measure 4 has no changes but measure 3 has more than one
K:G
P:Intro
"G"zdBG|"C7"E/G/E2G|"G"DG"Dm6"Ay"E7"B-|B4|
"A7"zBAG|"D7"A/B/A2F|"G"E4-|"Am7"Ez"D+7"zy"D7"z|
P:Chorus
[K:C]|:[Q:1/4=220]"C"e4|G4|"Ab7"_A4-|_A4|"C"e4|G4|"A7"A4-|A4|
"D7"e4|A4|"G7"e4|B4|"C"d2c2|"C°7"B2A2|"G7"c2B2|A2"G+7"G2|`

	const expectedBye = [{"type":"part","name":"Intro","lines":[[{"chord":["G","","",""]},{"chord":["C7","","",""]},{"chord":["G","","Dm6","E7"]},{"chord":["E7","","",""]},{"chord":["A7","","",""]},{"chord":["D7","","",""]},{"chord":["G","","",""]},{"chord":["Am7","","D+7","D7"]}]]},{"type":"part","name":"Chorus","lines":[[{"chord":["C","","",""],"hasStartRepeat":true},{"chord":["%","","",""]},{"chord":["A♭7","","",""]},{"chord":["%","","",""]},{"chord":["C","","",""]},{"chord":["%","","",""]},{"chord":["A7","","",""]},{"chord":["%","","",""]}],[{"chord":["D7","","",""]},{"chord":["%","","",""]},{"chord":["G7","","",""]},{"chord":["%","","",""]},{"chord":["C","","",""]},{"chord":["C°7","","",""]},{"chord":["G7","","",""]},{"chord":["G7","","G+7",""]}]]}]

	const abcDeed = `X:1
M: 4/4
L: 1/4
Q:1/4=150
N:second voice appears in 3rd part
K: C
P:Intro
"C"Ac3|"C7"A/G/A/G/-G2|"F"E3/2D/-D2|"Fm"E/D/E/D/-D2|
"C"EG2"A7"yA|"D7"c2"G7"d2|"C"c2A/G/A|!accent!czz2||
P:Verse (rubato)
"Dm"DEFG|"G7"AAA/2G/2A|"C"E4-|"Am7"E4|
"Dm"DEFG|"G7"AAA/2G/2A|"C"E4-|"A7"E4|
"Dm"FGAc|"Dm7"cA/2c/2- c/2A/2c|"Em7"B/2GG/2-G2-|G2z2|
"Am"CDEA|CDEA|"Em"G/2EE/2-E2|"Dm7"E/2DD/2-"G7"D2|
P:Chorus (a tempo)
|:"C"A2c2|"C7"A3/2G/2-G2|"F"E2D2|"Fm"E3/2D/2-D2|
"C"EG2"A7"yD|"D7"C2"G7"D2|1E4 & "C"x2 "C#°"x2 | z4 & "Dm7"x2 "G7"x2:|2 "C"C4-|"C7"C4||
P:Bridge
!mark!"F"zABc|dcAF|"E7"E4|B4|
"A7"zEGA|BAGE|"D7"D4|G4 & "G7"x2 "G+7"x2!mark!|
"C"A2c2|"C7"A3/2G/2-G2|"F"E2D2|"Fm"E3/2D/2-D2|
"C"EG2"A7"yD|"D7"C2"G7"D2|C4- & "C" x2 "F7"x2|"C"C4||`

	const expectedDeed = [{"type":"part","name":"Intro","lines":[[{"chord":["C","","",""]},{"chord":["C7","","",""]},{"chord":["F","","",""]},{"chord":["Fm","","",""]},{"chord":["C","","","A7"]},{"chord":["D7","","G7",""]},{"chord":["C","","",""]},{"chord":["%","","",""]}]]},{"type":"part","name":"Verse (rubato)","lines":[[{"chord":["Dm","","",""]},{"chord":["G7","","",""]},{"chord":["C","","",""]},{"chord":["Am7","","",""]},{"chord":["Dm","","",""]},{"chord":["G7","","",""]},{"chord":["C","","",""]},{"chord":["A7","","",""]}],[{"chord":["Dm","","",""]},{"chord":["Dm7","","",""]},{"chord":["Em7","","",""]},{"chord":["%","","",""]},{"chord":["Am","","",""]},{"chord":["%","","",""]},{"chord":["Em","","",""]},{"chord":["Dm7","","G7",""]}]]},{"type":"part","name":"Chorus (a tempo)","lines":[[{"chord":["C","","",""],"hasStartRepeat":true},{"chord":["C7","","",""]},{"chord":["F","","",""]},{"chord":["Fm","","",""]},{"chord":["C","","","A7"]},{"chord":["D7","","G7",""]},{"chord":["C","","C♯°",""],"ending":"1"},{"chord":["Dm7","","G7",""],"hasEndRepeat":true}],[{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"chord":["C","","",""],"ending":"2"},{"chord":["C7","","",""]}]]},{"type":"part","name":"Bridge","lines":[[{"chord":["F","","",""]},{"chord":["%","","",""]},{"chord":["E7","","",""]},{"chord":["%","","",""]},{"chord":["A7","","",""]},{"chord":["%","","",""]},{"chord":["D7","","",""]},{"chord":["G7","","G+7",""]}],[{"chord":["C","","",""]},{"chord":["C7","","",""]},{"chord":["F","","",""]},{"chord":["Fm","","",""]},{"chord":["C","","","A7"]},{"chord":["D7","","G7",""]},{"chord":["C","","F7",""]},{"chord":["C","","",""]}]]}]

	const abcDoY = `X:1
L:1/8
M:4/4
N:"No Chord" not recognized
Q:1/4=124
K: G
P: Intro
"C"A^GAg-"C#°7"g3fy|"G"a_agf "E7"=fe3|"Am7"bgeb- "D7"beb2|"G"g8||"^No Chord"[G_B^c][GBc] [FA=c][FAc] [EG_B]2[EG^c][DF=c]-|[DF=c]6 GA||`

	const expectedDoY = [{"type":"part","name":"Intro","lines":[[{"chord":["C","","C♯°7",""]},{"chord":["G","","E7",""]},{"chord":["Am7","","D7",""]},{"chord":["G","","",""]},{"chord":["No Chord","","",""]},{"chord":["%","","",""]}]]}]

	const abcDouce = `X: 1
M: 4/4
L: 1/8
N: print coda
K: Gm
P:Ending
!coda!"EbΔ7"dddd-d4|"D7"z"^break"d_d2c2=B2|_BA_AG zd"Gm"G2|]`

	const expectedDouce = [{"type":"part","name":"Ending","lines":[[{"chord":["E♭Δ7","","",""],"annotations":["coda"]},{"chord":["D7","break","",""]},{"chord":["break","","","Gm"]}]]}]

	const abcEast = `X:1
T:Here's the Title
T:And The SubTitle
N: first subtitle shouldn't print a second time
N: first ending is "1,2,3" and second ending is "4"
N: second ending as 4th measure
Q:1/4=145
L:1/4
M:C
K:F
"FΔ7"(3CCC E2-|E2D2|"Am7"(3A,A,A,E2-|"D7"E4|
"Gm7"(3DDDA2-|A2G2|"Bbm6"(3BBB_D2-|_D4|
"Gm7"BA"C7"c3/2B/|"Em7b5"AG"A7"B3/2A/|"Dm7"F/F/F/F/AA/A/|"G7"EEG2|
"Gm7"(3B,DFAG|"Bbm6"B2"C7"AA|"Am7"c4|"Abm7"_c4|
"Gm7"(3BBBDD|"C7"A2AA|"F6"F4-|1,2,3"Gm7"F2"C7"z2:|4 "Gm7"z "Ab°7"z"F"z2 |]`

	const expectedEast = [{"type":"part","name":"","lines":[[{"chord":["FΔ7","","",""]},{"chord":["%","","",""]},{"chord":["Am7","","",""]},{"chord":["D7","","",""]},{"chord":["Gm7","","",""]},{"chord":["%","","",""]},{"chord":["B♭m6","","",""]},{"chord":["%","","",""]}],[{"chord":["Gm7","","C7",""]},{"chord":["Em7♭5","","A7",""]},{"chord":["Dm7","","",""]},{"chord":["G7","","",""]},{"chord":["Gm7","","",""]},{"chord":["B♭m6","","C7",""]},{"chord":["Am7","","",""]},{"chord":["A♭m7","","",""]}],[{"chord":["Gm7","","",""]},{"chord":["C7","","",""]},{"chord":["F6","","",""]},{"chord":["Gm7","","C7",""],"ending":"1,2,3","hasEndRepeat":true}],[{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"chord":["Gm7","A♭°7","F",""],"ending":"4"}]]}]

	const abcFidgety = `X:1
M:4/4
L:1/8
Q:200
N:Key change in middle
K:Bb
"F7"FA2GF2z2|Ac2BA2z2|F^FG^G AG=GF|F2f2z4||
P:A
"Bb"z!^!dcB !^!dcB!^!d|cB!^!dc "Bb7"B!^!dcB|"Eb"!^!GBAB "E°"cBAG|"Bb"F2z2zB2G|
"B°"B"^break"G2B _dB2d|=e_d2eg2z2|"C7"G^FG^G "F7"A=F=GA|1"Bb"B2z2z4:|2"Bb"B2z2"Bb7"z2(3Bcd||
P:B
K:Eb
"Eb"e2G2"^break"z4|"G7"d2=B2"^break"z4|"Ab"c2A2"^break"z4|"Eb"G2B2"^break"z4|
`

	const expectedFidgety = [{"type":"part","name":"","lines":[[{"chord":["F7","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]},{"chord":["%","","",""]}]]},{"type":"part","name":"A","lines":[[{"chord":["B♭","","",""]},{"chord":["B♭","","B♭7",""]},{"chord":["E♭","","E°",""]},{"chord":["B♭","","",""]},{"chord":["B°","break","",""]},{"chord":["break","","",""]},{"chord":["C7","","F7",""]},{"chord":["B♭","","",""],"ending":"1","hasEndRepeat":true}],[{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"chord":["B♭","","B♭7",""],"ending":"2"}]]},{"type":"part","name":"B","lines":[[{"chord":["E♭","","break",""]},{"chord":["G7","","break",""]},{"chord":["A♭","","break",""]},{"chord":["E♭","","break",""]}]]}]

	const abcIWish = `X:1
M:4/4
L:1/8
Q:1/4=130
N:placement of annotations
N:second ending should be on new line
K:F
P:C - Trio
"C7"!f!!marcato!c2z2!marcato!c2zc-|cc2A!tenuto!c2!marcato!d2|"F"c2c2A3z|c^cdA-A3z|
"C7"!marcato!c2z2!marcato!c2zc-|cc2A!tenuto!c2!marcato!d2|"@-20,5Trombone""F"zc "^break"df _a2fd|"@-30,5All"[!>!f_a]2 [!>!f_a]2 [!>!f_a]2 [!marcato!fd]2|
"C7"dcec dc2c|dced-d2zc|"F"fd^GA dc2d|f2f_e-e2"F7"zA|
"Bb"d^d2e- "Bº"e2=d2|"F/C"c^c2d-"D7"d2z2|"G7"DFDF"C7"A2AF-|"F"F2^GA "D7"ed-d2|
"G7"!diminuendo(!DFDF"C7"A2A!diminuendo)!F-|1"F"F6z2:|2"F"F6"^Bass Drum:""^Thump"!style=x!a2|"^Thump"!style=x!a !mp!!>!_A3F2z2|]
`

	const expectedIWish = [{"type":"part","name":"C - Trio","lines":[[{"chord":["C7","","",""]},{"chord":["%","","",""]},{"chord":["F","","",""]},{"chord":["%","","",""]},{"chord":["C7","","",""]},{"chord":["%","","",""]},{"chord":["C7","break","",""],"annotations":["Trombone"]},{"chord":["break","","",""],"annotations":["All"]}],[{"chord":["C7","","",""]},{"chord":["%","","",""]},{"chord":["F","","",""]},{"chord":["F","","","F7"]},{"chord":["B♭","","Bº",""]},{"chord":["F/C","","D7",""]},{"chord":["G7","","C7",""]},{"chord":["F","","D7",""]}],[{"chord":["G7","","C7",""]},{"chord":["F","","",""],"ending":"1","hasEndRepeat":true}],[{"chord":["F","","",""],"annotations":["Bass Drum:\nThump"],"ending":"2"},{"chord":["%","","",""],"annotations":["Thump"]}]]}]

	const abcIve =  `X:12
L:1/8
M:4/4
N:print tempo
N:this should not be considered 12-bars
Q:1/4=135
K:G
P:Recitatif
|:"G"z2g2fe3|"G°7"z2g2fe3|"Am"z2gf- fge2|"D7"B4A4|
|1"Am"z2ge- ege2|"D7"B3A- ABc2|"G"d8-|"C"d4-"D7"d4:|2"Em"z2GG- GAB2|e8|"Am"z2AA- ABc2|"D7"d8||
`
	const expectedIve = [{"type":"part","name":"Recitatif","lines":[[{"chord":["G","","",""],"hasStartRepeat":true},{"chord":["G°7","","",""]},{"chord":["Am","","",""]},{"chord":["D7","","",""]},{"chord":["Am","","",""],"ending":"1"},{"chord":["D7","","",""]},{"chord":["G","","",""]},{"chord":["C","","D7",""],"hasEndRepeat":true}],[{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"noBorder":true,"chord":["","","",""]},{"chord":["Em","","",""],"ending":"2"},{"chord":["%","","",""]},{"chord":["Am","","",""]},{"chord":["D7","","",""]}]]}]

	const abcMinnie = `X: 1
M:C
L:1/8
Q:124
N:Pickup measure has first chord in it.
K:Em
P:Intro
"Em"E2G2|B4"B7"A2G2|"Em"AB- BzE2G2|B4"B7"A2GE-|"Em"E2z2E2G2|
`
	const expectedMinnie = [{"type":"part","name":"Intro","lines":[[{"chord":["Em","","B7",""]},{"chord":["Em","","",""]},{"chord":["Em","","B7",""]},{"chord":["Em","","",""]}]]}]

	const abcRoyal = `X: 1
M: 4/4
L: 1/8
N: annotation on same note as a chord
Q:1/4=170
K: F
P:C
"F7""^Roll"F2F2GA3|"Bb""^Roll"F2F2GA3|"Bbm""^Roll"F2F2GA3|"F"!marcato!F2z2"F7"!marcato!F2z2||
`

	const expectedRoyal = [{"type":"part","name":"C","lines":[[{"chord":["F7","","",""],"annotations":["Roll"]},{"chord":["B♭","","",""],"annotations":["Roll"]},{"chord":["B♭m","","",""],"annotations":["Roll"]},{"chord":["F","","F7",""]}]]}]

	const abcSugar = `X:1
M:4/4
L:1/8
Q:1/4=133
N:the decoration is on a bar line
K:Bb
P:Tag
!coda!|"Bb"B8-|"G7"B8|"Cm7"G4"G7"G4|"Cm7"c^cdf- "F7"f=cd2|"Bb"B8-|Bzz2|]
`
	const expectedSugar = [{"type":"part","name":"Tag","lines":[[{"chord":["B♭","","",""],"annotations":["coda"]},{"chord":["G7","","",""]},{"chord":["Cm7","","G7",""]},{"chord":["Cm7","","F7",""]},{"chord":["B♭","","",""]}]]}]

	const abcUnder = `X:1
M:4/4
L:1/8
N:triplets mess up beat counting
Q:1/4=86
K:G
"Am7"gege-e3E|"D7"BdB6| "G"(3A2G2F2 "Cm6"(3A2G2F2 | "G"G8|]
`
	const expectedUnder = [{"type":"part","name":"","lines":[[{"chord":["Am7","","",""]},{"chord":["D7","","",""]},{"chord":["G","","Cm6",""]},{"chord":["G","","",""]}]]}]

	const abcYou = `X:1
N: stemless rhythms
N: annotation on opening bar line
K:G
U: R = !style=rhythm!
M:4/4
P:Ending
!coda!"^3x"|:"G"RB0 RB0 "G7"RB0 RB0  | "C"RB0 RB0 "Cm6"RB0 RB0 :| "G"RB0 z2 "D7"RB0 z2 | "G" z [G^A^c] (3[GBd][Bde][deg] "G"[egb]4|]
`
	const expectedYou = []

	////////////////////////////////////

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

	it("bye", function () {
		parserTest(abcBye, expectedBye);
	})

	it("deed", function () {
		parserTest(abcDeed, expectedDeed);
	})

	it("doy", function () {
		parserTest(abcDoY, expectedDoY);
	})

	it("douce", function () {
		parserTest(abcDouce, expectedDouce);
	})

	it("east", function () {
		parserTest(abcEast, expectedEast);
	})

	it("fidgety", function () {
		parserTest(abcFidgety, expectedFidgety);
	})

	it("I Wish", function () {
		parserTest(abcIWish, expectedIWish);
	})

	it("ive", function () {
		parserTest(abcIve, expectedIve);
	})

	it("minnie", function () {
		parserTest(abcMinnie, expectedMinnie);
	})

	it("royal", function () {
		parserTest(abcRoyal, expectedRoyal);
	})

	it("sugar", function () {
		parserTest(abcSugar, expectedSugar);
	})

	it("under", function () {
		parserTest(abcUnder, expectedUnder);
	})

	it("you", function () {
		parserTest(abcYou, expectedYou);
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
	console.log(JSON.stringify(grid))
	chai.assert.deepEqual(grid, expected)
}
