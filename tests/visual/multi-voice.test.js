describe("Multi-voice", function () {

	var abcTripletBrackets = "K:C\n" +
		"%%score (Top Bottom)\n" +
		"V:Top\n" +
		"e4 e4 e4 e4 e4 | (3c2A2G2 (3z2A2G2 (3c2A2z2 (3c2a'2G2 |\n" +
		"V:Bottom\n" +
		"(3c2A2G2 (3z2A2G2 (3c2A2z2 (3c2A,2G2 | E,4 E,4 E,4 E,4 |\n"

	var expectedTripletBrackets = [
		{"x":435,"y":78,"width":63,"height":20},{"x":514,"y":83,"width":63,"height":17},{"x":594,"y":72,"width":61,"height":17},{"x":674,"y":37,"width":63,"height":17},{"x":49,"y":165,"width":63,"height":19},{"x":129,"y":172,"width":63,"height":17},{"x":208,"y":161,"width":61,"height":17},{"x":288,"y":180,"width":63,"height":17}
	]

	var abcRestPlacement = "K:C\n" +
		"%%score (Top Bottom)\n" +
		"V:Top\n" +
		"G4 EDF2|\n" +
		"V:Bottom\n" +
		"E,4 z2A,2|\n"

	var abcLyricsTwoVoices = "X:1\n" +
		"M:4/4\n" +
		"L:1/16\n" +
		"%%score (Top Bottom)\n" +
		"V:Top\n" +
		"K:C clef=treble \n" +
		"!p!c'2b2 z4 f2a2 f4|\n" +
		"w:C B C F A F\n" +
		"V:Bottom\n" +
		"K:C clef=treble \n" +
		"!p!E,4 E,4 A,8|\n" +
		"w:E E A\n"
	// var expectedDirectives = [
	// 	{ c: 'D.C. al coda', anchor: 'end'},
	// 	{ c: 'D.C. al fine', anchor: 'end'},
	// 	{ c: 'D.S. al coda', anchor: 'end'},
	// 	{ c: 'D.S. al fine', anchor: 'end'},
	// 	{ c: 'D.C.', anchor: 'middle'},
	// 	{ c: '5', anchor: 'middle'},
	// ]

	it('triplet-brackets', function() {
		var visualObj = abcjs.renderAbc("paper", abcTripletBrackets, {add_classes:true});
		var triplets = document.querySelectorAll("#paper .abcjs-triplet")
		var actual = []
		for (var i = 0; i < triplets.length; i++) {
			var box = triplets[i].getBBox()
			actual.push({x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height)})
		}
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedTripletBrackets)
	})

	it('rest-placement', function() {
		var visualObj = abcjs.renderAbc("paper", abcRestPlacement, {add_classes:true});
		var actual = 4
		chai.assert.equal(actual, 6)
	})

	it('lyrics-two-voices', function() {
		var visualObj = abcjs.renderAbc("paper", abcLyricsTwoVoices, {add_classes:true});
		var actual = 4
		chai.assert.equal(actual, 6)
	})

})
