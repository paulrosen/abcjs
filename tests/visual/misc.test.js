describe("Miscellaneous", function () {
	var abcJazzChords = "X:1\n" +
		"%%jazzchords\n" +
		"K:C\n" +
		"\"C7\"C \"C/B\"B \"x\"A \"x/C\"G \"/E\"E|";

	var expectedJazzChords = [
		{input: 'C7', output: 'C\x037\x03'},
		{input: 'C/B', output: 'C\x03\x03/B'},
		{input: 'x', output: '\x03x\x03'},
		{input: 'x/C', output: '\x03x\x03/C'},
		{input: '/E', output: '\x03\x03/E'},
	]

	var abcGlissando = "X:1\n" +
		"L:1/4\n" +
		"%%stretchlast\n" +
		"!glissando(!C!glissando)!e\n" +
		"!glissando(!C!glissando)!E !glissando(!C!glissando)!F !glissando(!C!glissando)!G !glissando(!C!glissando)!A !glissando(!C!glissando)!B !glissando(!C!glissando)!c \n" +
		"!glissando(!C!glissando)!d !glissando(!C!glissando)!e !glissando(!C!glissando)!f\n" +
		"!glissando(!g!glissando)!f !glissando(!g!glissando)!e !glissando(!g!glissando)!d !glissando(!g!glissando)!c !glissando(!g!glissando)!f !glissando(!g!glissando)!A !glissando(!g!glissando)!G !glissando(!g!glissando)!F !glissando(!g!glissando)!E !glissando(!g!glissando)!D \n" +
		"\n" +
		"\n" +
		"\n" +
		"\n" +
		"\n";

	var expectedGlissando = [
		{x: 63, y: 36, w: 329, h: 40},
		{x: 63, y: 156, w: 35, h: 12},
		{x: 181, y: 153, w: 35, h: 14},
		{x: 298, y: 150, w: 35, h: 16},
		{x: 416, y: 147, w: 35, h: 18},
		{x: 533, y: 144, w: 35, h: 20},
		{x: 651, y: 139, w: 41, h: 25},
		{x: 63, y: 227, w: 95, h: 32},
		{x: 298, y: 223, w: 95, h: 35},
		{x: 533, y: 218, w: 101, h: 40},
		{x: 63, y: 307, w: 17, h: 7},
		{x: 133, y: 308, w: 17, h: 8},
		{x: 204, y: 309, w: 17, h: 9},
		{x: 275, y: 311, w: 17, h: 10},
		{x: 345, y: 307, w: 17, h: 7},
		{x: 416, y: 313, w: 17, h: 11},
		{x: 486, y: 315, w: 17, h: 12},
		{x: 557, y: 316, w: 23, h: 18},
		{x: 628, y: 318, w: 23, h: 20},
		{x: 698, y: 319, w: 29, h: 28},
	]

	var abcDirectives = "X:1\n" +
	"L:1/4\n" +
	"CCCC!D.C.alcoda!|DDDD!D.C.alfine!|EEEE!D.S.alcoda!|FFFF!D.S.alfine!|!D.C.!G!5!GGG|\n"

	var expectedDirectives = [
		{ c: 'D.C. al coda', anchor: 'end'},
		{ c: 'D.C. al fine', anchor: 'end'},
		{ c: 'D.S. al coda', anchor: 'end'},
		{ c: 'D.S. al fine', anchor: 'end'},
		{ c: 'D.C.', anchor: 'middle'},
		{ c: '5', anchor: 'middle'},
	]
	
	var abcSetFont = 'X:1\n' +
		'%%setfont-1 cursive 16 bold\n' +
		'%%setfont-7 Arial 19 bold\n' +
		'T:Title $1bold$0 $$100 reg, the\n' +
		'T:subtitle $1bold$0 reg\n' +
		'C:Thomas $7Fats$0 Waller\n' +
		'O:Copyright $11924$0 All Rights Reserved\n' +
		'A:by $1Me\n' +
		'P:AA$1BB$0CC\n' +
		'H:one $1two $0 three\n' +
		'H:aye $1bee $0 sea\n' +
		'B:$1book\n' +
		'D:records\n' +
		'N:four $1five $0 six\n' +
		'N:seven\n' +
		'L:1/4\n' +
		'M:4/4\n' +
		'W: lo $1loo $0lou $$1dollar\n' +
		'K:C\n' +
		'"C$1m$7\\ntwo"G "Dm7"E2 F | "^above $1the$0 staff"D4 |]\n' +
		'w: la $1le $0lu\n' +
		'P:chorus $1with feeling\n' +
		'A4|' +
		'\n' +
		'X:1\n' +
		'T:Title bold $$100 reg, the\n' +
		'T:subtitle bold reg\n' +
		'C:Thomas Fats Waller\n' +
		'O:Copyright 1924 All Rights Reserved\n' +
		'A:by Me\n' +
		'P:AABBCC\n' +
		'H:one two three\n' +
		'H:aye bee sea\n' +
		'N:four five six\n' +
		'N:seven\n' +
		'L:1/4\n' +
		'M:4/4\n' +
		'W: lo loo lou $$1dollar\n' +
		'K:C\n' +
		'"Cm"G E2 F | "^above the staff"D4 |]\n' +
		'w: la le lu\n' +
		'P:chorus with feeling\n' +
		'A4|'

	var expectedSetFont = [
		{"klass":"abcjs-title","phrases":[
			{"content":"The Title ","attrs":{"font-family":"Times New Roman","font-size":27,"font-weight":"normal","font-style":"normal","font-decoration":"none"}},
			{"content":"bold","attrs":{"font-family":"cursive","font-size":16,"font-weight":"bold","font-style":"normal","font-decoration":"none"}},
			{"content":" $100 reg","attrs":{"font-family":"Times New Roman","font-size":27,"font-weight":"normal","font-style":"normal","font-decoration":"none"}}
		]},
		{"klass":"abcjs-text abcjs-subtitle","phrases":[
			{"content":"subtitle ","attrs":{"font-family":"Times New Roman","font-size":21,"font-weight":"normal","font-style":"normal","font-decoration":"none"}},
			{"content":"bold","attrs":{"font-family":"cursive","font-size":16,"font-weight":"bold","font-style":"normal","font-decoration":"none"}},
			{"content":" reg","attrs":{"font-family":"Times New Roman","font-size":21,"font-weight":"normal","font-style":"normal","font-decoration":"none"}}
		]},
		{"klass":"abcjs-composer","phrases":[
			{"content":"Thomas ","attrs":{"font-family":"Times New Roman","font-size":19,"font-weight":"normal","font-style":"italic","font-decoration":"none"}},
			{"content":"Fats","attrs":{"font-family":"Arial","font-size":19,"font-weight":"bold","font-style":"normal","font-decoration":"none"}},
			{"content":" Waller","attrs":{"font-family":"Times New Roman","font-size":19,"font-weight":"normal","font-style":"italic","font-decoration":"none"}},
			{"content":" (","attrs":{"font-family":"Times New Roman","font-size":19,"font-weight":"normal","font-style":"italic","font-decoration":"none"}},{"content":"Copyright ","attrs":{"font-family":"Times New Roman","font-size":19,"font-weight":"normal","font-style":"italic","font-decoration":"none"}},
			{"content":"1924","attrs":{"font-family":"cursive","font-size":16,"font-weight":"bold","font-style":"normal","font-decoration":"none"}},
			{"content":" All Rights Reserved","attrs":{"font-family":"Times New Roman","font-size":19,"font-weight":"normal","font-style":"italic","font-decoration":"none"}},
			{"content":")","attrs":{"font-family":"Times New Roman","font-size":19,"font-weight":"normal","font-style":"italic","font-decoration":"none"}}]},
		{"klass":"abcjs-author","phrases":[
			{"content":"by ","attrs":{"font-family":"Times New Roman","font-size":19,"font-weight":"normal","font-style":"italic","font-decoration":"none"}},
			{"content":"Me","attrs":{"font-family":"cursive","font-size":16,"font-weight":"bold","font-style":"normal","font-decoration":"none"}}]},
		{"klass":"abcjs-part-order","phrases":[
			{"content":"AA","attrs":{"font-family":"Times New Roman","font-size":20,"font-weight":"normal","font-style":"normal","font-decoration":"none"}},
			{"content":"BB","attrs":{"font-family":"cursive","font-size":16,"font-weight":"bold","font-style":"normal","font-decoration":"none"}},
			{"content":"CC","attrs":{"font-family":"Times New Roman","font-size":20,"font-weight":"normal","font-style":"normal","font-decoration":"none"}}]},
		{"key":"subtitle","text":[{"text":"subtitle "},{"font":{"face":"cursive","weight":"bold","style":"normal","decoration":"none","size":16},"text":"bold"},{"text":" reg"}]},
		{"key":"chord","text":"C$1m$7"},
		{"key":"lyric","text":"la"},
		{"key":"chord","text":"Dm7"},
		{"key":"lyric","text":"$1le"},
		{"key":"lyric","text":"$0lu"},
		{"key":"chord","text":"above $1the$0 staff"},
		{"phrases":[
			{"content":"lo ","attrs":{"font-family":"Times New Roman","font-size":21,"font-weight":"normal","font-style":"normal","font-decoration":"none"}},
			{"content":"loo ","attrs":{"font-family":"cursive","font-size":16,"font-weight":"bold","font-style":"normal","font-decoration":"none"}},
			{"content":"lou $1dollar","attrs":{"font-family":"Times New Roman","font-size":21,"font-weight":"normal","font-style":"normal","font-decoration":"none"}}
		]},
		{"klass":"abcjs-extra-text abcjs-book","phrases":[
			{"content":"Book: ","attrs":{"font-family":"Times New Roman","font-size":21,"font-weight":"normal","font-style":"normal","font-decoration":"none"}},
			{"content":"book","attrs":{"font-family":"cursive","font-size":16,"font-weight":"bold","font-style":"normal","font-decoration":"none"}}
		]},
		{"klass":"abcjs-extra-text abcjs-discography","font":"historyfont","text":"Discography: records"},
		{"font":"historyfont","text":"Notes:"},
		{"phrases":[
			{"content":"four ","attrs":{"font-family":"Times New Roman","font-size":21,"font-weight":"normal","font-style":"normal","font-decoration":"none"}},
			{"content":"five ","attrs":{"font-family":"cursive","font-size":16,"font-weight":"bold","font-style":"normal","font-decoration":"none"}},
			{"content":" six","attrs":{"font-family":"Times New Roman","font-size":21,"font-weight":"normal","font-style":"normal","font-decoration":"none"}}
		]},
		{"font":"historyfont","text":"seven"},
		{"font":"historyfont","text":"History:"},
		{"phrases":[
			{"content":"one ","attrs":{"font-family":"Times New Roman","font-size":21,"font-weight":"normal","font-style":"normal","font-decoration":"none"}},
			{"content":"two ","attrs":{"font-family":"cursive","font-size":16,"font-weight":"bold","font-style":"normal","font-decoration":"none"}},
			{"content":" three","attrs":{"font-family":"Times New Roman","font-size":21,"font-weight":"normal","font-style":"normal","font-decoration":"none"}}
		]},
		{"phrases":[
			{"content":"aye ","attrs":{"font-family":"Times New Roman","font-size":21,"font-weight":"normal","font-style":"normal","font-decoration":"none"}},
			{"content":"bee ","attrs":{"font-family":"cursive","font-size":16,"font-weight":"bold","font-style":"normal","font-decoration":"none"}},
			{"content":" sea","attrs":{"font-family":"Times New Roman","font-size":21,"font-weight":"normal","font-style":"normal","font-decoration":"none"}}
		]}
	]

	var abcLineWidth = 'X:1\n' +
		"L:1/8\n" +
		"AB||ef g D|Df f/D/| A,4 c'4|]\n"

	var abcAccentPosition = 'X:1\n' +
		"K:C\n" +
		"!>!A2!>!c2|T!>!A2T!>!c2|]\n"

	it("line-width", function () {
		abcjs.renderAbc("paper", abcLineWidth, { add_classes: true});
		var height = extractHeight()
		chai.assert.equal(height, "0.700", "No change to lineThickness")
		abcjs.renderAbc("paper", abcLineWidth, { add_classes: true, lineThickness: 0.1});
		height = extractHeight()
		chai.assert.equal(height, "0.900", "lineThickness = 0.1")
		abcjs.renderAbc("paper", abcLineWidth, { add_classes: true, lineThickness: 0.5});
		height = extractHeight()
		chai.assert.equal(height, "1.700", "lineThickness = 0.5")
	})

	function extractHeight() {
		var topLine = document.querySelector("#paper .abcjs-top-line")
		var path = topLine.getAttribute('d')
		var coordinates = path.split(" L ")
		var first = coordinates[1].split(' ')
		var second = coordinates[2].split(' ')
		return (parseFloat(second[1]) - parseFloat(first[1])).toFixed(3)
	}

	it("accent position", function () {
		abcjs.renderAbc("paper", abcAccentPosition, { accentAbove: true });
		abcjs.renderAbc("paper2", abcAccentPosition, { });
	})

	it("jazz chords", function () {
		extractChords(abcJazzChords, expectedJazzChords);
	})

	it("glissando", function () {
		draw(abcGlissando, expectedGlissando);
	})

	it("directives", function () {
		var visualObj = abcjs.renderAbc("paper", abcDirectives);
		var voice = visualObj[0].lines[0].staff[0].voices[0]
		var results = []
		for (var i = 0; i < voice.length; i++) {
			var elem = voice[i].abselem.children;
			for (var j = 0; j < elem.length; j++) {
				var rel = elem[j]
				if (rel.type === 'decoration')
					results.push({ c: elem[j].c, anchor: elem[j].anchor })
			}
		}
		chai.assert.deepEqual(results, expectedDirectives)
	})

	it("set-font", function() {
		var visualObj = abcjs.renderAbc(["paper", 'paper2'], abcSetFont, {add_classes:true, jazzchords: true});
		var results = extractText(visualObj)
		for (var i = 0; i < results.length; i++) {
			chai.assert.deepEqual(results[i], expectedSetFont[i], "index: " + i + "\n" + JSON.stringify(results[i])+"\n" + JSON.stringify(expectedSetFont[i]))
		}
	})
})

function extractText(visualObj) {
	var textResults = []
	// Object.keys(visualObj[0].metaText).forEach(key => {
	// 	if (key !== 'unalignedWords' && key !== 'history')
	// 	textResults.push({key: key, text: visualObj[0].metaText[key] })
	// })

	var topText = visualObj[0].topText.rows.filter(item => {
		return item.text !== undefined || item.phrases !== undefined
	}).map(item => {
		var ret = {}
		if (item.klass) ret.klass = item.klass;
		if (item.font) ret.font = item.font
		if (item.text) ret.text = item.text
		if (item.phrases) ret.phrases = item.phrases
		return ret
	})
	textResults = textResults.concat(topText)

	for (var i = 0; i < visualObj[0].lines.length; i++) {
		var line = visualObj[0].lines[i]
		if (line.subtitle) {
			textResults.push({key: 'subtitle', text:line.subtitle.text})
		} else if (line.staff) {
			var voice = line.staff[0].voices[0]
		   for (var i = 0; i < voice.length; i++) {
			   var elem = voice[i];
			   if (elem.chord) {
				   for (var j = 0; j < elem.chord.length; j++) {
					   var chord = elem.chord[j]
					   var item = { key: "chord", text: chord.name}
					   if (chord.font)
						   item.font = chord.font
					   textResults.push(item)
				   }
			   }
			   if (elem.lyric) {
				   for (var j = 0; j < elem.lyric.length; j++) {
					   var lyric = elem.lyric[j]
					   var item = {key: "lyric", text: lyric.syllable}
					   if (lyric.font)
						   item.font = lyric.font
					   textResults.push(item)
				   }
			   }
		   }
		}
	}

	var bottomText = visualObj[0].bottomText.rows.filter(item => {
		return item.text !== undefined || item.phrases !== undefined
	}).map(item => {
		var ret = {}
		if (item.klass) ret.klass = item.klass;
		if (item.font) ret.font = item.font
		if (item.text) ret.text = item.text
		if (item.phrases) ret.phrases = item.phrases
		return ret
	})
	textResults = textResults.concat(bottomText)
	console.log(JSON.stringify(textResults))
	return textResults
}

function extractChords(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc);
	var line = visualObj[0].lines[0];
	var staff = line.staff[0];
	var voice = staff.voices[0];
	var chords = [];
	for (var i = 0; i < voice.length; i++) {
		var el = voice[i];
		if (el.chord) {
			var output = el.abselem.extra[0]
			chords.push({input: el.chord[0].name, output: output.c})
		}
	}
	//console.log(chords)
	chai.assert.equal(chords.length, expected.length, "wrong number of chords");
	for (i = 0; i < chords.length; i++) {
		chai.assert.equal(chords[i].input, expected[i].input, i + ": Inputs different");
		chai.assert.equal(chords[i].output, expected[i].output, i + ": Outputs different");
	}
}

function draw(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc);
	var gliss = document.querySelectorAll('[data-name="glissando"]')
	for (var i = 0; i < gliss.length; i++) {
		var bb = gliss[i].getBBox()
		bb = {x: Math.round(bb.x), y: Math.round(bb.y), w: Math.round(bb.width), h: Math.round(bb.height)}
		//console.log(bb)
		chai.assert.deepEqual(bb, expected[i])
	}
}

