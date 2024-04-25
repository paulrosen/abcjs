describe("Transpose", function() {

	var abcInline = "K: C\n" +
		"C_DE^F GABc| [K:D] d_e^fg abc'd'|\n" +
		"d_e^fg abc'd'||\n"

	var expectedInline = [{
		"key": "Eb",
		"notes": [{"note": "E", "pitch": 2}, {"note": "__F", "pitch": 3}, {"note": "G", "pitch": 4}, {"note": "=A", "pitch": 5},
			{"note": "B", "pitch": 6}, {"note": "c", "pitch": 7}, {"note": "d", "pitch": 8}, {"note": "e", "pitch": 9}, {},
			{"key": "F"}, {"note": "f", "pitch": 10}, {"note": "_g", "pitch": 11}, {"note": "=a", "pitch": 12}, {"note": "b", "pitch": 13},
			{"note": "c'", "pitch": 14}, {"note": "d'", "pitch": 15}, {"note": "e'", "pitch": 16}, {"note": "f'", "pitch": 17}, {}]
	}, {
		"key": "F",
		"notes": [{"note": "f", "pitch": 10}, {"note": "_g", "pitch": 11}, {"note": "=a", "pitch": 12}, {"note": "b", "pitch": 13},
			{"note": "c'", "pitch": 14}, {"note": "d'", "pitch": 15}, {"note": "e'", "pitch": 16}, {"note": "f'", "pitch": 17}, {}]
	}]

	var abcAccidentals = "X:1\n" +
		"K:D\n" +
		"F2__F_F =F^F^^F2|E2__E_E =E^E^^E2||[K:Ab]F2__F_F =F^F^^F2|E2__E_E =E^E^^E2||"

	var expectedAccidentals_2 = [{"key":"C","notes":[{"note":"E","pitch":2},{"note":"_undefined","pitch":1},{"note":"__E","pitch":2},{"note":"_E","pitch":2},{"note":"=E","pitch":2},{"note":"^undefined","pitch":2},{},{"note":"D","pitch":1},{"note":"__undefined","pitch":1},{"note":"_D","pitch":1},{"note":"=D","pitch":1},{"note":"^D","pitch":1},{"note":"^^undefined","pitch":1},{},{"key":"F#"},{"note":"D","pitch":1},{"note":"__undefined","pitch":1},{"note":"_D","pitch":1},{"note":"=D","pitch":1},{"note":"^D","pitch":1},{"note":"^^undefined","pitch":1},{},{"note":"C","pitch":0},{"note":"_undefined","pitch":0},{"note":"=C","pitch":0},{"note":"^C","pitch":0},{"note":"^^C","pitch":0},{"note":"^undefined","pitch":1},{}]}]
	var expectedAccidentals_1 = [{"key":"Db","notes":[{"note":"F","pitch":3},{"note":"__F","pitch":2},{"note":"__F","pitch":3},{"note":"_F","pitch":3},{"note":"=F","pitch":3},{"note":"^F","pitch":3},{},{"note":"E","pitch":2},{"note":"_E","pitch":1},{"note":"__E","pitch":2},{"note":"_E","pitch":2},{"note":"=E","pitch":2},{"note":"^E","pitch":2},{},{"key":"G"},{"note":"E","pitch":2},{"note":"_undefined","pitch":1},{"note":"__E","pitch":2},{"note":"_E","pitch":2},{"note":"=E","pitch":2},{"note":"^undefined","pitch":2},{},{"note":"D","pitch":1},{"note":"__undefined","pitch":1},{"note":"_D","pitch":1},{"note":"=D","pitch":1},{"note":"^D","pitch":1},{"note":"^^undefined","pitch":1},{}]}]
	var expectedAccidentals0 = [{"key":"D","notes":[{"note":"F","pitch":3},{"note":"__F","pitch":3},{"note":"_F","pitch":3},{"note":"=F","pitch":3},{"note":"^F","pitch":3},{"note":"^^F","pitch":3},{},{"note":"E","pitch":2},{"note":"__E","pitch":2},{"note":"_E","pitch":2},{"note":"=E","pitch":2},{"note":"^E","pitch":2},{"note":"^^E","pitch":2},{},{"key":"Ab"},{"note":"F","pitch":3},{"note":"__F","pitch":3},{"note":"_F","pitch":3},{"note":"=F","pitch":3},{"note":"^F","pitch":3},{"note":"^^F","pitch":3},{},{"note":"E","pitch":2},{"note":"__E","pitch":2},{"note":"_E","pitch":2},{"note":"=E","pitch":2},{"note":"^E","pitch":2},{"note":"^^E","pitch":2},{}]}]
	var expectedAccidentals1 = [{"key":"Eb","notes":[{"note":"G","pitch":4},{"note":"_C,,,","pitch":3},{"note":"__G","pitch":4},{"note":"_G","pitch":4},{"note":"=G","pitch":4},{"note":"^C,,,","pitch":4},{},{"note":"F","pitch":3},{"note":"__C,,,","pitch":3},{"note":"_F","pitch":3},{"note":"=F","pitch":3},{"note":"^F","pitch":3},{"note":"^^C,,,","pitch":3},{},{"key":"A"},{"note":"F","pitch":3},{"note":"__F","pitch":3},{"note":"_F","pitch":3},{"note":"=F","pitch":3},{"note":"^F","pitch":3},{"note":"^^F","pitch":3},{},{"note":"E","pitch":2},{"note":"__E","pitch":2},{"note":"_E","pitch":2},{"note":"=E","pitch":2},{"note":"^E","pitch":2},{"note":"^^E","pitch":2},{}]}]
	var expectedAccidentals2 = [{"key":"E","notes":[{"note":"G","pitch":4},{"note":"__C,,,","pitch":4},{"note":"_G","pitch":4},{"note":"=G","pitch":4},{"note":"^G","pitch":4},{"note":"^^C,,,","pitch":4},{},{"note":"F","pitch":3},{"note":"_C,,,","pitch":3},{"note":"=F","pitch":3},{"note":"^F","pitch":3},{"note":"^^F","pitch":3},{"note":"^C,,,","pitch":4},{},{"key":"Bb"},{"note":"G","pitch":4},{"note":"_C,,,","pitch":4},{"note":"=G","pitch":4},{"note":"^G","pitch":4},{"note":"^^G","pitch":4},{"note":"^C,,,","pitch":5},{},{"note":"F","pitch":3},{"note":"=C,,,","pitch":3},{"note":"^F","pitch":3},{"note":"^^F","pitch":3},{"note":"^F","pitch":4},{"note":"^^C,,,","pitch":4},{}]}]

	var abcMajor = "X:1\n" +
		"K:C\n" +
		"CDEF GABc|^C^D^E^F ^G^A^B^c|_C_D_E_F _G_A_B_c|F2__F_F =F^F^^F2||"

	var expectedMajor_2 = [{"key":"Bb","notes":[{"note":"B,","pitch":-1},{"note":"C","pitch":0},{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{},{"note":"=B,","pitch":-1},{"note":"^C","pitch":0},{"note":"^D","pitch":1},{"note":"=E","pitch":2},{"note":"^F","pitch":3},{"note":"^G","pitch":4},{"note":"^A","pitch":5},{"note":"=B","pitch":6},{},{"note":"__B,","pitch":-1},{"note":"_C","pitch":0},{"note":"_D","pitch":1},{"note":"__E","pitch":2},{"note":"_F","pitch":3},{"note":"_G","pitch":4},{"note":"_A","pitch":5},{"note":"__B","pitch":6},{},{"note":"E","pitch":2},{"note":"_undefined","pitch":1},{"note":"__E","pitch":2},{"note":"_E","pitch":2},{"note":"=E","pitch":2},{"note":"^undefined","pitch":2},{}]}]
	var expectedMajor_1 = [{"key":"B","notes":[{"note":"B,","pitch":-1},{"note":"C","pitch":0},{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{},{"note":"^B,","pitch":-1},{"note":"^^C","pitch":0},{"note":"^^D","pitch":1},{"note":"^E","pitch":2},{"note":"^^F","pitch":3},{"note":"^^G","pitch":4},{"note":"^^A","pitch":5},{"note":"^B","pitch":6},{},{"note":"_B,","pitch":-1},{"note":"=C","pitch":0},{"note":"=D","pitch":1},{"note":"_E","pitch":2},{"note":"=F","pitch":3},{"note":"=G","pitch":4},{"note":"=A","pitch":5},{"note":"_B","pitch":6},{},{"note":"E","pitch":2},{"note":"__undefined","pitch":2},{"note":"_E","pitch":2},{"note":"=E","pitch":2},{"note":"^E","pitch":2},{"note":"^^undefined","pitch":2},{}]}]
	var expectedMajor0 = [{"key":"C","notes":[{"note":"C","pitch":0},{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{"note":"c","pitch":7},{},{"note":"^C","pitch":0},{"note":"^D","pitch":1},{"note":"^E","pitch":2},{"note":"^F","pitch":3},{"note":"^G","pitch":4},{"note":"^A","pitch":5},{"note":"^B","pitch":6},{"note":"^c","pitch":7},{},{"note":"_C","pitch":0},{"note":"_D","pitch":1},{"note":"_E","pitch":2},{"note":"_F","pitch":3},{"note":"_G","pitch":4},{"note":"_A","pitch":5},{"note":"_B","pitch":6},{"note":"_c","pitch":7},{},{"note":"F","pitch":3},{"note":"__F","pitch":3},{"note":"_F","pitch":3},{"note":"=F","pitch":3},{"note":"^F","pitch":3},{"note":"^^F","pitch":3},{}]}]
	var expectedMajor1 = [{"key":"Db","notes":[{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{"note":"c","pitch":7},{"note":"d","pitch":8},{},{"note":"=D","pitch":1},{"note":"=E","pitch":2},{"note":"^F","pitch":3},{"note":"=G","pitch":4},{"note":"=A","pitch":5},{"note":"=B","pitch":6},{"note":"^c","pitch":7},{"note":"=d","pitch":8},{},{"note":"__D","pitch":1},{"note":"__E","pitch":2},{"note":"_F","pitch":3},{"note":"__G","pitch":4},{"note":"__A","pitch":5},{"note":"__B","pitch":6},{"note":"_c","pitch":7},{"note":"__d","pitch":8},{},{"note":"G","pitch":4},{"note":"_C,,,","pitch":3},{"note":"__G","pitch":4},{"note":"_G","pitch":4},{"note":"=G","pitch":4},{"note":"^C,,,","pitch":4},{}]}]
	var expectedMajor2 = [{"key":"D","notes":[{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{"note":"c","pitch":7},{"note":"d","pitch":8},{},{"note":"^D","pitch":1},{"note":"^E","pitch":2},{"note":"^^F","pitch":3},{"note":"^G","pitch":4},{"note":"^A","pitch":5},{"note":"^B","pitch":6},{"note":"^^c","pitch":7},{"note":"^d","pitch":8},{},{"note":"_D","pitch":1},{"note":"_E","pitch":2},{"note":"=F","pitch":3},{"note":"_G","pitch":4},{"note":"_A","pitch":5},{"note":"_B","pitch":6},{"note":"=c","pitch":7},{"note":"_d","pitch":8},{},{"note":"G","pitch":4},{"note":"__C,,,","pitch":4},{"note":"_G","pitch":4},{"note":"=G","pitch":4},{"note":"^G","pitch":4},{"note":"^^C,,,","pitch":4},{}]}]

	var abcMinor = "X:1\n" +
		"K:Cm\n" +
		"CDEF GABc|^C^D^E^F ^G^A^B^c|_C_D_E_F _G_A_B_c|F2__F_F =F^F^^F2||"

	var expectedMinor_2 = [{"key":"Bb","notes":[{"note":"B,","pitch":-1},{"note":"C","pitch":0},{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{},{"note":"=B,","pitch":-1},{"note":"^C","pitch":0},{"note":"^D","pitch":1},{"note":"=E","pitch":2},{"note":"^F","pitch":3},{"note":"^G","pitch":4},{"note":"^A","pitch":5},{"note":"=B","pitch":6},{},{"note":"__B,","pitch":-1},{"note":"_C","pitch":0},{"note":"_D","pitch":1},{"note":"__E","pitch":2},{"note":"_F","pitch":3},{"note":"_G","pitch":4},{"note":"_A","pitch":5},{"note":"__B","pitch":6},{},{"note":"E","pitch":2},{"note":"_undefined","pitch":1},{"note":"__E","pitch":2},{"note":"_E","pitch":2},{"note":"=E","pitch":2},{"note":"^undefined","pitch":2},{}]}]
	var expectedMinor_1 = [{"key":"B","notes":[{"note":"B,","pitch":-1},{"note":"C","pitch":0},{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{},{"note":"^B,","pitch":-1},{"note":"^^C","pitch":0},{"note":"^^D","pitch":1},{"note":"^E","pitch":2},{"note":"^^F","pitch":3},{"note":"^^G","pitch":4},{"note":"^^A","pitch":5},{"note":"^B","pitch":6},{},{"note":"_B,","pitch":-1},{"note":"=C","pitch":0},{"note":"=D","pitch":1},{"note":"_E","pitch":2},{"note":"=F","pitch":3},{"note":"=G","pitch":4},{"note":"=A","pitch":5},{"note":"_B","pitch":6},{},{"note":"E","pitch":2},{"note":"__undefined","pitch":2},{"note":"_E","pitch":2},{"note":"=E","pitch":2},{"note":"^E","pitch":2},{"note":"^^undefined","pitch":2},{}]}]
	var expectedMinor0 = [{"key":"C","notes":[{"note":"C","pitch":0},{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{"note":"c","pitch":7},{},{"note":"^C","pitch":0},{"note":"^D","pitch":1},{"note":"^E","pitch":2},{"note":"^F","pitch":3},{"note":"^G","pitch":4},{"note":"^A","pitch":5},{"note":"^B","pitch":6},{"note":"^c","pitch":7},{},{"note":"_C","pitch":0},{"note":"_D","pitch":1},{"note":"_E","pitch":2},{"note":"_F","pitch":3},{"note":"_G","pitch":4},{"note":"_A","pitch":5},{"note":"_B","pitch":6},{"note":"_c","pitch":7},{},{"note":"F","pitch":3},{"note":"__F","pitch":3},{"note":"_F","pitch":3},{"note":"=F","pitch":3},{"note":"^F","pitch":3},{"note":"^^F","pitch":3},{}]}]
	var expectedMinor1 = [{"key":"C#","notes":[{"note":"C","pitch":0},{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{"note":"c","pitch":7},{},{"note":"^^C","pitch":0},{"note":"^^D","pitch":1},{"note":"^^E","pitch":2},{"note":"^^F","pitch":3},{"note":"^^G","pitch":4},{"note":"^^A","pitch":5},{"note":"^^B","pitch":6},{"note":"^^c","pitch":7},{},{"note":"=C","pitch":0},{"note":"=D","pitch":1},{"note":"=E","pitch":2},{"note":"=F","pitch":3},{"note":"=G","pitch":4},{"note":"=A","pitch":5},{"note":"=B","pitch":6},{"note":"=c","pitch":7},{},{"note":"F","pitch":3},{"note":"_F","pitch":3},{"note":"=F","pitch":3},{"note":"^F","pitch":3},{"note":"^^F","pitch":3},{"note":"^F","pitch":4},{}]}]
	var expectedMinor2 = [{"key":"D","notes":[{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{"note":"c","pitch":7},{"note":"d","pitch":8},{},{"note":"^D","pitch":1},{"note":"^E","pitch":2},{"note":"^^F","pitch":3},{"note":"^G","pitch":4},{"note":"^A","pitch":5},{"note":"^B","pitch":6},{"note":"^^c","pitch":7},{"note":"^d","pitch":8},{},{"note":"_D","pitch":1},{"note":"_E","pitch":2},{"note":"=F","pitch":3},{"note":"_G","pitch":4},{"note":"_A","pitch":5},{"note":"_B","pitch":6},{"note":"=c","pitch":7},{"note":"_d","pitch":8},{},{"note":"G","pitch":4},{"note":"__C,,,","pitch":4},{"note":"_G","pitch":4},{"note":"=G","pitch":4},{"note":"^G","pitch":4},{"note":"^^C,,,","pitch":4},{}]}]

	var abcAnnotations = 'X:1\n' +
		'T:transpose_annotations\n' +
		'L:1/4\n' +
		'M:4/4\n' +
		'K:C\n' +
		'"C"c"D""G"d"^B"B"_A"A|"<F"F">G"G"@1,1E"e"C/G"G|"Gb11b9/Cb"c4||'

	var expectedAnnotations_2 = [{"key":"Bb","notes":[{"note":"B","pitch":6,"chord":"B♭"},{"note":"c","pitch":7,"chord":"C\nF"},{"note":"A","pitch":5,"chord":"B"},{"note":"G","pitch":4,"chord":"A"},{},{"note":"E","pitch":2,"chord":"F"},{"note":"F","pitch":3,"chord":"G"},{"note":"d","pitch":8,"chord":"E"},{"note":"F","pitch":3,"chord":"B♭/F"},{},{"note":"B","pitch":6,"chord":"E11♭9/A"},{}]}]
	var expectedAnnotations_1 = [{"key":"B","notes":[{"note":"B","pitch":6,"chord":"B"},{"note":"c","pitch":7,"chord":"C♯\nF♯"},{"note":"A","pitch":5,"chord":"B"},{"note":"G","pitch":4,"chord":"A"},{},{"note":"E","pitch":2,"chord":"F"},{"note":"F","pitch":3,"chord":"G"},{"note":"d","pitch":8,"chord":"E"},{"note":"F","pitch":3,"chord":"B/F♯"},{},{"note":"B","pitch":6,"chord":"F11♭9/A♯"},{}]}]
	var expectedAnnotations0 = [{"key":"C","notes":[{"note":"c","pitch":7,"chord":"C"},{"note":"d","pitch":8,"chord":"D\nG"},{"note":"B","pitch":6,"chord":"B"},{"note":"A","pitch":5,"chord":"A"},{},{"note":"F","pitch":3,"chord":"F"},{"note":"G","pitch":4,"chord":"G"},{"note":"e","pitch":9,"chord":"E"},{"note":"G","pitch":4,"chord":"C/G"},{},{"note":"c","pitch":7,"chord":"G♭11♭9/C♭"},{}]}]
	var expectedAnnotations1 = [{"key":"Db","notes":[{"note":"d","pitch":8,"chord":"D♭"},{"note":"e","pitch":9,"chord":"E♭\nA♭"},{"note":"c","pitch":7,"chord":"B"},{"note":"B","pitch":6,"chord":"A"},{},{"note":"G","pitch":4,"chord":"F"},{"note":"A","pitch":5,"chord":"G"},{"note":"f","pitch":10,"chord":"E"},{"note":"A","pitch":5,"chord":"D♭/A♭"},{},{"note":"d","pitch":8,"chord":"G11♭9/C"},{}]}]
	var expectedAnnotations2 = [{"key":"D","notes":[{"note":"d","pitch":8,"chord":"D"},{"note":"e","pitch":9,"chord":"E\nA"},{"note":"c","pitch":7,"chord":"B"},{"note":"B","pitch":6,"chord":"A"},{},{"note":"G","pitch":4,"chord":"F"},{"note":"A","pitch":5,"chord":"G"},{"note":"f","pitch":10,"chord":"E"},{"note":"A","pitch":5,"chord":"D/A"},{},{"note":"d","pitch":8,"chord":"G♯11♭9/C♯"},{}]}]

	var abcChords = 'X:1\n' +
		'K:C\n' +
		'"N.C."AB|"C"c"C#"^c"D"d"D#"^d|"E"e"F"F"F#"^F"G"G|"G#"^G"A/F#"A"A#"^A"B"B|"Db"_d"Eb"_e"Gb"_G"Ab"_A|"Bb"_B4||'

	var expectedChords_2 = [{"key":"Bb","notes":[{ note: 'G', pitch: 4, chord: 'N.C.' },{ note: 'A', pitch: 5 },{},{"note":"B","pitch":6,"chord":"B♭"},{"note":"=B","pitch":6,"chord":"B"},{"note":"c","pitch":7,"chord":"C"},{"note":"^c","pitch":7,"chord":"D♭"},{},{"note":"d","pitch":8,"chord":"D"},{"note":"E","pitch":2,"chord":"E♭"},{"note":"=E","pitch":2,"chord":"E"},{"note":"F","pitch":3,"chord":"F"},{},{"note":"^F","pitch":3,"chord":"G♭"},{"note":"G","pitch":4,"chord":"G"},{"note":"^G","pitch":4,"chord":"A♭"},{"note":"A","pitch":5,"chord":"A"},{},{"note":"_c","pitch":7,"chord":"B"},{"note":"_d","pitch":8,"chord":"D♭"},{"note":"_F","pitch":3,"chord":"E"},{"note":"_G","pitch":4,"chord":"G♭"},{},{"note":"_A","pitch":5,"chord":"A♭"},{}]}]
	var expectedChords_1 = [{"key":"B","notes":[{ note: 'G', pitch: 4, chord: 'N.C.' },{ note: 'A', pitch: 5 },{},{"note":"B","pitch":6,"chord":"B"},{"note":"^B","pitch":6,"chord":"C"},{"note":"c","pitch":7,"chord":"C♯"},{"note":"^^c","pitch":7,"chord":"D"},{},{"note":"d","pitch":8,"chord":"D♯"},{"note":"E","pitch":2,"chord":"E"},{"note":"^E","pitch":2,"chord":"F"},{"note":"F","pitch":3,"chord":"F♯"},{},{"note":"^^F","pitch":3,"chord":"G"},{"note":"G","pitch":4,"chord":"G♯"},{"note":"^^G","pitch":4,"chord":"A"},{"note":"A","pitch":5,"chord":"A♯"},{},{"note":"=c","pitch":7,"chord":"C"},{"note":"=d","pitch":8,"chord":"D"},{"note":"=F","pitch":3,"chord":"F"},{"note":"=G","pitch":4,"chord":"G"},{},{"note":"=A","pitch":5,"chord":"A"},{}]}]
	var expectedChords0 = [{"key":"C","notes":[{ note: 'G', pitch: 4, chord: 'N.C.' },{ note: 'A', pitch: 5 },{},{"note":"c","pitch":7,"chord":"C"},{"note":"^c","pitch":7,"chord":"C♯"},{"note":"d","pitch":8,"chord":"D"},{"note":"^d","pitch":8,"chord":"D♯"},{},{"note":"e","pitch":9,"chord":"E"},{"note":"F","pitch":3,"chord":"F"},{"note":"^F","pitch":3,"chord":"F♯"},{"note":"G","pitch":4,"chord":"G"},{},{"note":"^G","pitch":4,"chord":"G♯"},{"note":"A","pitch":5,"chord":"A"},{"note":"^A","pitch":5,"chord":"A♯"},{"note":"B","pitch":6,"chord":"B"},{},{"note":"_d","pitch":8,"chord":"D♭"},{"note":"_e","pitch":9,"chord":"E♭"},{"note":"_G","pitch":4,"chord":"G♭"},{"note":"_A","pitch":5,"chord":"A♭"},{},{"note":"_B","pitch":6,"chord":"B♭"},{}]}]
	var expectedChords1 = [{"key":"Db","notes":[{"note":"d","pitch":8,"chord":"D♭"},{"note":"=d","pitch":8,"chord":"D"},{"note":"e","pitch":9,"chord":"E♭"},{"note":"=e","pitch":9,"chord":"E"},{},{"note":"f","pitch":10,"chord":"F"},{"note":"G","pitch":4,"chord":"G♭"},{"note":"=G","pitch":4,"chord":"G"},{"note":"A","pitch":5,"chord":"A♭"},{},{"note":"=A","pitch":5,"chord":"A"},{"note":"B","pitch":6,"chord":"B♭"},{"note":"=B","pitch":6,"chord":"B"},{"note":"c","pitch":7,"chord":"C"},{},{"note":"__e","pitch":9,"chord":"D"},{"note":"_f","pitch":10,"chord":"E"},{"note":"__A","pitch":5,"chord":"G"},{"note":"__B","pitch":6,"chord":"A"},{},{"note":"_c","pitch":7,"chord":"B"},{}]}]
	var expectedChords2 = [{"key":"D","notes":[{ note: 'G', pitch: 4, chord: 'N.C.' },{ note: 'A', pitch: 5 },{},{"note":"d","pitch":8,"chord":"D"},{"note":"^d","pitch":8,"chord":"D♯"},{"note":"e","pitch":9,"chord":"E"},{"note":"^e","pitch":9,"chord":"F"},{},{"note":"f","pitch":10,"chord":"F♯"},{"note":"G","pitch":4,"chord":"G"},{"note":"^G","pitch":4,"chord":"G♯"},{"note":"A","pitch":5,"chord":"A"},{},{"note":"^A","pitch":5,"chord":"A♯"},{"note":"B","pitch":6,"chord":"B"},{"note":"^B","pitch":6,"chord":"C"},{"note":"c","pitch":7,"chord":"C♯"},{},{"note":"_e","pitch":9,"chord":"D♯"},{"note":"=f","pitch":10,"chord":"F"},{"note":"_A","pitch":5,"chord":"G♯"},{"note":"_B","pitch":6,"chord":"A♯"},{},{"note":"=c","pitch":7,"chord":"C"},{}]}]

	var abcNone = "X:1\n" +
	"K:none\n" +
	"C,,D,E,F, G,A,B,c,|CDEF GABc|^C^D^E^F ^G^A^B^c|_C_D_E_F _G_A_B_c|defg abc''d'||"

	var expectedNone4 = [{"key":"none","notes":[
		{"note":"E,,","pitch":-12},{"note":"^F,","pitch":-4},{"note":"^G,","pitch":-3},{"note":"A,","pitch":-2},{"note":"B,","pitch":-1},{"note":"^C","pitch":0},{"note":"^D","pitch":1},{"note":"E","pitch":2},{},
		{"note":"E","pitch":2},{"note":"^F","pitch":3},{"note":"^G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{"note":"^c","pitch":7},{"note":"^d","pitch":8},{"note":"e","pitch":9},{},
		{"note":"F","pitch":3},{"note":"G","pitch":3},{"note":"A","pitch":5},{"note":"^A","pitch":5},{"note":"c","pitch":7},{"note":"d","pitch":8},{"note":"e","pitch":9},{"note":"^f","pitch":10},{},
		{"note":"_E","pitch":2},{"note":"_F","pitch":3},{"note":"_G","pitch":4},{"note":"_A","pitch":5},{"note":"_B","pitch":6},{"note":"_c","pitch":7},{"note":"_d","pitch":8},{"note":"_e","pitch":9},{},
		{"note":"f","pitch":10},{"note":"g","pitch":11},{"note":"a","pitch":12},{"note":"b","pitch":13},{"note":"c'","pitch":14},{"note":"d'","pitch":15},{"note":"e''","pitch":23},{"note":"f'","pitch":17},{}
	]}]

	// TODO-PER: this test isn't correct
	var expectedNone1 = [{"key":"fix-test","notes":[
		{"note":"D,,","pitch":-13},{"note":"E,","pitch":-5},{"note":"F,","pitch":-4},{"note":"G,","pitch":-3},{"note":"A,","pitch":-2},{"note":"B,","pitch":-1},{"note":"c,","pitch":0},{"note":"d,","pitch":1},{},
		{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{"note":"c","pitch":7},{"note":"d","pitch":8},{},
		{"note":"^D","pitch":1},{"note":"^E","pitch":2},{"note":"^F","pitch":3},{"note":"^G","pitch":4},{"note":"^A","pitch":5},{"note":"^B","pitch":6},{"note":"^c","pitch":7},{"note":"^d","pitch":8},{},
		{"note":"_D","pitch":1},{"note":"_E","pitch":2},{"note":"_F","pitch":3},{"note":"_G","pitch":4},{"note":"_A","pitch":5},{"note":"_B","pitch":6},{"note":"_c","pitch":7},{"note":"_d","pitch":8},{},
		{"note":"e","pitch":9},{"note":"f","pitch":10},{"note":"g","pitch":11},{"note":"a","pitch":12},{"note":"b","pitch":13},{"note":"c'","pitch":14},{"note":"d''","pitch":22},{"note":"e'","pitch":16},{}]}]

	// TODO-PER: this test isn't correct
	var expectedNone_1 = [{"key":"fix-test","notes":[
		{"note":"B,,,","pitch":-15},{"note":"C,","pitch":-7},{"note":"D,","pitch":-6},{"note":"E,","pitch":-5},{"note":"F,","pitch":-4},{"note":"G,","pitch":-3},{"note":"A,","pitch":-2},{"note":"B,","pitch":-1},{},
		{"note":"B,","pitch":-1},{"note":"C","pitch":0},{"note":"D","pitch":1},{"note":"E","pitch":2},{"note":"F","pitch":3},{"note":"G","pitch":4},{"note":"A","pitch":5},{"note":"B","pitch":6},{},
		{"note":"^B,","pitch":-1},{"note":"^C","pitch":0},{"note":"^D","pitch":1},{"note":"^E","pitch":2},{"note":"^F","pitch":3},{"note":"^G","pitch":4},{"note":"^A","pitch":5},{"note":"^B","pitch":6},{},
		{"note":"_B,","pitch":-1},{"note":"_C","pitch":0},{"note":"_D","pitch":1},{"note":"_E","pitch":2},{"note":"_F","pitch":3},{"note":"_G","pitch":4},{"note":"_A","pitch":5},{"note":"_B","pitch":6},{},
		{"note":"c","pitch":7},{"note":"d","pitch":8},{"note":"e","pitch":9},{"note":"f","pitch":10},{"note":"g","pitch":11},{"note":"a","pitch":12},{"note":"B''","pitch":20},{"note":"c'","pitch":14},{}
	]}]


	it("transpose-inline", function () {
		transposeTest(abcInline, 3, expectedInline)
	})

	it("transpose-directive", function () {
		transposeTestDirective(abcInline, 3, expectedInline)
	})

	it("transpose-accidentals", function () {
		transposeTest(abcAccidentals, -2, expectedAccidentals_2)
		transposeTest(abcAccidentals, -1, expectedAccidentals_1)
		transposeTest(abcAccidentals, 0, expectedAccidentals0)
		transposeTest(abcAccidentals, 1, expectedAccidentals1)
		transposeTest(abcAccidentals, 2, expectedAccidentals2)
	})

	it("transpose-major", function () {
		transposeTest(abcMajor, -2, expectedMajor_2)
		transposeTest(abcMajor, -1, expectedMajor_1)
		transposeTest(abcMajor, 0, expectedMajor0)
		transposeTest(abcMajor, 1, expectedMajor1)
		transposeTest(abcMajor, 2, expectedMajor2)
	})

	it("transpose-minor", function () {
		transposeTest(abcMinor, -2, expectedMinor_2)
		transposeTest(abcMinor, -1, expectedMinor_1)
		transposeTest(abcMinor, 0, expectedMinor0)
		transposeTest(abcMinor, 1, expectedMinor1)
		transposeTest(abcMinor, 2, expectedMinor2)
	})

	it("transpose-annotations", function () {
		transposeTest(abcAnnotations, -2, expectedAnnotations_2)
		transposeTest(abcAnnotations, -1, expectedAnnotations_1)
		transposeTest(abcAnnotations, 0, expectedAnnotations0)
		transposeTest(abcAnnotations, 1, expectedAnnotations1)
		transposeTest(abcAnnotations, 2, expectedAnnotations2)
	})

	it("transpose-chords", function () {
		transposeTest(abcChords, -2, expectedChords_2)
		transposeTest(abcChords, -1, expectedChords_1)
		transposeTest(abcChords, 0, expectedChords0)
		transposeTest(abcChords, 1, expectedChords1)
		transposeTest(abcChords, 2, expectedChords2)
	})

	it("transpose-none", function () {
		transposeTest(abcNone, 4, expectedNone4)
		transposeTest(abcNone, 1, expectedNone1)
		transposeTest(abcNone, -1, expectedNone_1)
	})
})

function extractTransposeInfo(visualObj) {
	var lines = visualObj[0].lines.map(function (line) {
		line = line.staff[0]
		var out = { key: line.key.root + line.key.acc}
		var voice = line.voices[0]
		out.notes = voice.map(function (el) {
			switch (el.el_type) {
				case "note":
					var n = {note: el.pitches[0].name, pitch: el.pitches[0].pitch}
					if (el.chord) {
						n.chord = el.chord.map(function (c) { return c.name}).join(',')
					}
					return n
				case "keySignature":
					return {key: el.root + el.acc}
				default:
					return {}
			}
		})
		return out
	})
	console.log(JSON.stringify(lines))
	return lines
}

function compareResults(lines, expected, halfSteps) {
	for (var i = 0; i < expected.length; i++) {
		var exp = expected[i]
		var rcv = lines[i]
		chai.assert.equal(rcv.key, exp.key, "Key mismatch on line " + i + ' half steps: ' + halfSteps)
		for (var j = 0; j < exp.notes.length; j++) {
			var eNote = exp.notes[j]
			var rNote = rcv.notes[j]
			chai.assert.deepStrictEqual(rNote, eNote, "at location " + i + ' ' + j + ' steps:'+halfSteps)
		}
	}
}

function transposeTest(abc, halfSteps, expected) {
	var visualObj = abcjs.renderAbc("paper", abc, {
		visualTranspose: halfSteps
	});
	var lines = extractTransposeInfo(visualObj)
	compareResults(lines, expected, halfSteps)
}

function transposeTestDirective(abc, halfSteps, expected) {
	abc = "%%visualTranspose "+halfSteps
	var visualObj = abcjs.renderAbc("paper", abc);
	var lines = extractTransposeInfo(visualObj)
	compareResults(lines, expected, halfSteps)
}
