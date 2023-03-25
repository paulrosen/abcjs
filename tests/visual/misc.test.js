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
		'T:Title $1bold$0 $$100 reg\n' +
		'C:Thomas $1Fats$0 Waller\n' +
		'H:one $1two $0 three\n' +
		'L:1/4\n' +
		'M:4/4\n' +
		'K:C\n' +
		'"C$1m$7"G E2 F | "^above $1the$0 staff"D4 |]\n' +
		'w: la $1le $0lu\n' +
		'W: lo $1loo $0lou $$1dollar\n'

	var expectedSetFont = [
		{"key":"title","text":"Title"},
		{"key":"title","text":"bold","font":{"face":"cursive","weight":"bold","style":"normal","decoration":"none","size":16}},
		{"key":"title","text":"$$100 reg"},
		{"key":"composer","text":"Thomas"},
		{"key":"composer","text":"Fats","font":{"face":"cursive","weight":"bold","style":"normal","decoration":"none","size":16}},
		{"key":"composer","text":"Waller"},
		{"key":"chord","text":"C"},
		{"key":"chord","text":"m","font":{"face":"cursive","weight":"bold","style":"normal","decoration":"none","size":16}},
		{"key":"chord","text":"7"},
		{"key":"lyric","text":"la"},
		{"key":"lyric","text":"le","font":{"face":"cursive","weight":"bold","style":"normal","decoration":"none","size":16}},
		{"key":"lyric","text":"lu"},
		{"key":"chord","text":"above"},
		{"key":"chord","text":"the","font":{"face":"cursive","weight":"bold","style":"normal","decoration":"none","size":16}},
		{"key":"chord","text":"staff"},
		{"key":"bottom","font":"wordsfont","text":"lo "},
		{"key":"bottom","font":{"face":"cursive","weight":"bold","style":"normal","decoration":"none","size":16},"text":"loo "},
		{"key":"bottom","font":"wordsfont","text":"lou $"},
		{"key":"bottom","font":{"face":"cursive","weight":"bold","style":"normal","decoration":"none","size":16},"text":"dollar"},
		{"key":"bottom","font":"historyfont","text":"History: one"},
		{"key":"bottom","font":{"face":"cursive","weight":"bold","style":"normal","decoration":"none","size":16},"text":"two"},
		{"key":"bottom","font":"historyfont","text":"three\n"},
	]

	var abcLineWidth = 'X:1\n' +
		"L:1/8\n" +
		"AB||ef g D|Df f/D/| A,4 c'4|]\n"

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
		var visualObj = abcjs.renderAbc("paper", abcSetFont);
		var results = extractText(visualObj)
		chai.assert.deepEqual(results, expectedSetFont)
	})
})

function extractText(visualObj) {
	var textResults = []
	Object.keys(visualObj[0].metaText).forEach(key => {
		if (key !== 'unalignedWords' && key !== 'history')
		textResults.push({key: key, text: visualObj[0].metaText[key] })
	})

	var voice = visualObj[0].lines[0].staff[0].voices[0]
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

	var bottomText = visualObj[0].bottomText.rows.filter(item => {
		return item.text !== undefined
	}).map(item => {
		var ret = {}
		if (item.key) ret.key = item.key; else ret.key = 'bottom'
		if (item.font) ret.font = item.font
		if (item.text) ret.text = item.text
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

