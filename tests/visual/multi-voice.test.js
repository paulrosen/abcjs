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
		"G4 ED edF2|g2 z2 g2 z2|\n" +
		"V:Bottom\n" +
		"E,4 z2z2A,2|c2 d2 e2 A2|\n"

	var expectedRestPlacement = [
		{"x":324,"y":31,"width":8,"height":21},
		{"x":409,"y":42,"width":8,"height":21},
		{"x":108,"y":99,"width":8,"height":21},
		{"x":168,"y":73,"width":8,"height":21}
	]

	var abcLyricsTwoVoices = "X:1\n" +
		"M:4/4\n" +
		"L:1/16\n" +
		"%%score (Top Bottom)\n" +
		"V:Top\n" +
		"K:C clef=treble \n" +
		"!p!c'2b2 z4 f2a2 f4|\n" +
		"w:C B F A F\n" +
		"!p!c'2b2 z4 f2a2 f4|\n" +
		"w:c b f a f\n" +
		"V:Bottom\n" +
		"K:C clef=treble \n" +
		"!p!E,4 E,4 A,8|\n" +
		"w:E E A\n" +
		"!p!E,4 E,4 A,8|\n" +
		"w:EE EE AA\n"

	var expectedLyricsTwoVoices = [
		{"x":71,"y":187,"width":12,"height":19},{"x":170,"y":187,"width":11,"height":19},{"x":410,"y":187,"width":10,"height":19},{"x":508,"y":187,"width":12,"height":19},{"x":609,"y":187,"width":10,"height":19},{"x":71,"y":206,"width":11,"height":19},{"x":270,"y":206,"width":11,"height":19},{"x":409,"y":206,"width":12,"height":19},{"x":49,"y":392,"width":8,"height":19},{"x":78,"y":392,"width":9,"height":19},{"x":152,"y":392,"width":7,"height":19},{"x":181,"y":392,"width":9,"height":19},{"x":212,"y":392,"width":7,"height":19},{"x":41,"y":411,"width":23,"height":19},{"x":101,"y":411,"width":23,"height":19},{"x":143,"y":411,"width":25,"height":19}
	]

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
		var rests = document.querySelectorAll("#paper .abcjs-rest")
		var actual = []
		for (var i = 0; i < rests.length; i++) {
			var box = rests[i].getBBox()
			actual.push({x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height)})
		}
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedRestPlacement)
	})

	it('lyrics-two-voices', function() {
		var visualObj = abcjs.renderAbc("paper", abcLyricsTwoVoices, {add_classes:true});
		var lyrics = document.querySelectorAll("#paper .abcjs-lyric")
		var actual = []
		for (var i = 0; i < lyrics.length; i++) {
			var box = lyrics[i].getBBox()
			actual.push({x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height)})
		}
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedLyricsTwoVoices)
	})

})
