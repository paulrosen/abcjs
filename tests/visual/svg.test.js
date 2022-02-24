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
