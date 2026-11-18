describe("SVG Creation", function() {
	var abcSingleNote = "X:1\n" +
		"L:1/4\n" +
		"%%staffwidth 5\n" +
		"%%musicspace 0\n" +
		"K:C clef=none\n" +
		"V:all stem=up\n" +
		"B4\n"
	var abcTimeSigList = "X:1\n" +
		"L:1/4\n" +
		"%%staffwidth 12\n" +
		"%%musicspace 0\n" +
		"K:C clef=none stafflines=0\n" +
		"[M:2/4]y[M:3/4]y[M:4/4]\n"
	var abc128Group = "X:1\n" +
		"L:1/4\n" +
		"M:12/8\n" +
		"K:C clef=none\n" +
		"A4\n"

	var abc128Results = [
		{"klass":"abcjs-staff-extra abcjs-time-signature abcjs-l0 abcjs-m0 abcjs-mm0 abcjs-v0","dataName":"staff-extra time-signature"},
		{"klass":null,"dataName":"12"},
		{"klass":null,"dataName":null},
		{"klass":null,"dataName":null},
		{"klass":null,"dataName":"8"}
	]

	var abcGraceNotes = "L:1/4\n" +
		"%%staffwidth 200\n" +
		"N: test this in Safari by\n" +
		"N: changing the browser\n" +
		"N: magnification\n" +
		"K:C\n" +
		"{G,}A, {/C/2}D {EF}G|\n" +
		"{G,}A, {C/2}D {/EF}G|\n"

	it("single-note-compact", function() {
		testSvg(abcSingleNote)
		testCenter("note")
	})
	it("time-sig-list-compact", function() {
		testSvg(abcTimeSigList)
		testCenterGroup()
	})
	it("12-8-group", function() {
		testSvg(abc128Group)
		timeSigTest(abc128Results)
	})
	it("grace-note-placement", function() {
		abcjs.renderAbc("paper", abcGraceNotes, { add_classes: true});
	})

	describe("key-signature-accidentals", function() {
		it("double-sharp-in-modified-mode", function() {
			testKeyAccidentals("K:D#phr ^^f\nC D E F|", ["dblsharp", "sharp", "sharp", "sharp", "sharp"])
		})
		it("double-accidentals-match-note-glyphs", function() {
			testKeyAccidentals("K:C ^^F __B\n^^F __B|", ["dblsharp", "dblflat"])
			var signature = document.querySelector("#paper .abcjs-key-signature")
			var accidentals = ["dblsharp", "dblflat"]
			accidentals.forEach(function(accidental) {
				var selector = '[data-name="accidentals.' + accidental + '"]'
				var keyGlyph = signature.querySelector(selector)
				var noteGlyph = document.querySelector("#paper .abcjs-note " + selector)
				chai.assert.closeTo(keyGlyph.getBBox().width, noteGlyph.getBBox().width, 0.001)
				chai.assert.equal(keyGlyph.getAttribute("d").replace(/^M[^a-zA-Z]+/, "M"), noteGlyph.getAttribute("d").replace(/^M[^a-zA-Z]+/, "M"))
			})
			var glyphs = signature.querySelectorAll("[data-name]")
			chai.assert.isBelow(glyphs[0].getBBox().x + glyphs[0].getBBox().width, glyphs[1].getBBox().x)
		})
		it("double-accidentals-in-bass-clef", function() {
			testKeyAccidentals("K:C ^^F __B clef=bass\nF, B,|", ["dblsharp", "dblflat"])
		})
		it("double-accidentals-in-inline-key", function() {
			testKeyAccidentals("K:C\nC [K:C ^^F __B] F B|", ["dblsharp", "dblflat"])
		})
		it("double-accidentals-on-following-staff", function() {
			testKeyAccidentals("K:C ^^F __B\nF B|\nF B|", ["dblsharp", "dblflat", "dblsharp", "dblflat"])
		})
		it("ordinary-and-quartertone-accidentals", function() {
			testKeyAccidentals("K:C ^F =C _B ^/G _/A\nC D E F|", ["sharp", "nat", "flat", "halfsharp", "halfflat"])
		})
	})

	function testKeyAccidentals(abc, expected) {
		abcjs.renderAbc("paper", "X:1\nL:1/4\n" + abc, { add_classes: true })
		var glyphs = document.querySelectorAll("#paper .abcjs-key-signature [data-name]")
		chai.assert.deepEqual(Array.from(glyphs, function(glyph) { return glyph.getAttribute("data-name") }), expected.map(function(acc) { return "accidentals." + acc }))
		Array.from(glyphs).forEach(function(glyph) {
			chai.assert.isAbove(glyph.getBBox().width, 0)
			chai.assert.isAbove(glyph.getBBox().height, 0)
		})
	}

	function testSvg(abc) {
		abcjs.renderAbc("paper", abc, { add_classes: true, showDebug: [ 'box', 'grid' ], paddingleft: 0, paddingtop: 0, paddingright: 0, paddingbottom: 0 });
	}

	function testCenter(nameType) {
		var svg = document.querySelector("#paper svg")
		var width = svg.getAttribute("width")
		var height = svg.getAttribute("height")
		var svgXCenter = width/2
		var svgYCenter = height/2

		var item = svg.querySelector('[data-name="' + nameType + '"]')
		var box = item.getBBox()
		var xCenter = box.x + box.width / 2;
		var yCenter = box.y + box.height / 2;
		var xDiff = Math.abs(xCenter - svgXCenter)
		var yDiff = Math.abs(yCenter - svgYCenter)
		chai.assert.isBelow(xDiff,1, "X coordinate not centered (exp: " + svgXCenter + " act: " + xCenter + ")")
		chai.assert.isBelow(yDiff,1, "Y coordinate not centered (exp: " + svgYCenter + " act: " + yCenter + ")")
	}

	function testCenterGroup() {
		var svg = document.querySelector("#paper svg")
		var width = svg.getAttribute("width")
		var height = svg.getAttribute("height")
		var svgXCenter = Math.round(width/2)
		var svgYCenter = Math.round(height/2)

		var items = svg.querySelectorAll('g')
		var box1 = items[0].getBBox()
		var box2 = items[items.length-1].getBBox()
		var xCenter = Math.round(box1.x + (box1.x + box2.x + box2.width) / 2);
		var yCenter = Math.round(box1.y + box1.height / 2);
		chai.assert.equal(xCenter,svgXCenter, "X coordinate not centered")
		chai.assert.equal(yCenter,svgYCenter, "Y coordinate not centered")
	}

	function getDataNameAndClass(el) {
		var klass = el.getAttribute("class")
		var dataName = el.getAttribute("data-name")
		return { klass: klass, dataName: dataName }
	}

	function timeSigTest(expected) {
		var timeSig = document.querySelector("#paper .abcjs-time-signature")
		var actual = [];
		actual.push(getDataNameAndClass(timeSig))
		var children = timeSig.children
		for (var i = 0; i < children.length; i++) {
			var child = children[i]
			actual.push(getDataNameAndClass(child))
			for (var j = 0; j < child.children.length; j++) {
				var grandChild = child.children[j]
				actual.push(getDataNameAndClass(grandChild))
			}
		}
		chai.assert.deepEqual(actual, expected, JSON.stringify(actual))
		//console.log(JSON.stringify(actual))
	}
})
