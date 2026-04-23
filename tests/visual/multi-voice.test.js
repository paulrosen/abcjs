describe("Multi-voice", function () {

	var abcTripletBrackets = "K:C\n" +
		"%%score (Top Bottom)\n" +
		"V:Top\n" +
		"e4 e4 e4 e4 e4 | (3c2A2G2 (3z2A2G2 (3c2A2z2 (3c2a'2G2 |\n" +
		"V:Bottom\n" +
		"(3c2A2G2 (3z2A2G2 (3c2A2z2 (3c2A,2G2 | E,4 E,4 E,4 E,4 |\n" +
		"V:Top\n" +
		"(3c2A2G2 (3c2TA2G2 (3c2A2G2 (3c2A2G2 |\n" +
		"V:Bottom\n" +
		"E,4 E,4 E,4 E,4 |\n"

	var expectedTripletBrackets = [
		{"x":435,"y":78,"width":63,"height":20},{"x":514,"y":83,"width":63,"height":17},{"x":594,"y":72,"width":61,"height":17},{"x":674,"y":37,"width":63,"height":17},{"x":49,"y":157,"width":63,"height":19},{"x":129,"y":165,"width":63,"height":17},{"x":208,"y":161,"width":61,"height":17},{"x":288,"y":188,"width":63,"height":17},{"x":49,"y":215,"width":79,"height":20},{"x":153,"y":215,"width":79,"height":20},{"x":257,"y":215,"width":79,"height":20},{"x":361,"y":215,"width":79,"height":20}
	]

	var abcTripletSecondLine = "K:C\n" +
		"%%staffwidth 300\n" +
		"(3g2_g2f2|\n" +
		"\"C7\"d4GABc|\n"

	var expectedTripletSecondLine = [
		{"x":49,"y":94,"width":252,"height":17}
	]
	var abcRestPlacementOne = "K:C\n" +
		"%%score (Top Bottom)\n" +
		"V:Top\n" +
		"G4 ED edF2|g2 z2 g2 z2|\n" +
		"V:Bottom\n" +
		"E,4 z2z2A,2|c2 d2 e2 A2|\n"

	var expectedRestPlacementOne = [
		{"x":324,"y":31,"width":8,"height":21},
		{"x":409,"y":42,"width":8,"height":21},
		{"x":108,"y":99,"width":8,"height":21},
		{"x":168,"y":73,"width":8,"height":21}
	]

	var abcRestPlacementTwoStaff = "K:C\n" +
		"V:Top\n" +
		"G4 ED edF2|g2 z2 g2 z2|\n" +
		"V:Bottom\n" +
		"E,4 z2z2A,2|c2 d2 e2 A2|\n"

	var expectedRestPlacementTwoStaff = [
		{"x":324,"y":41,"width":8,"height":21},
		{"x":409,"y":41,"width":8,"height":21},
		{"x":108,"y":120,"width":8,"height":21},
		{"x":168,"y":120,"width":8,"height":21}
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

	var abcLyricsTwoVoicesTwoStaves = "X:1\n" +
		"M:4/4\n" +
		"L:1/16\n" +
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

	var expectedLyricsTwoVoicesTwoStaves = [
		{"x":71,"y":114,"width":12,"height":19},{"x":170,"y":114,"width":11,"height":19},{"x":410,"y":114,"width":10,"height":19},{"x":508,"y":114,"width":12,"height":19},{"x":609,"y":114,"width":10,"height":19},{"x":71,"y":240,"width":11,"height":19},{"x":270,"y":240,"width":11,"height":19},{"x":409,"y":240,"width":12,"height":19},{"x":57,"y":353,"width":8,"height":19},{"x":86,"y":353,"width":9,"height":19},{"x":160,"y":353,"width":7,"height":19},{"x":189,"y":353,"width":9,"height":19},{"x":220,"y":353,"width":7,"height":19},{"x":49,"y":479,"width":23,"height":19},{"x":109,"y":479,"width":23,"height":19},{"x":151,"y":479,"width":25,"height":19}
	]

	var abcTwoVoiceRestsTripletsWords = "K:C\n" +
		"%%score (Top Bottom)\n" +
		"V:Top\n" +
		"e4 e4 e4 e4 e4 | (3c2A2G2 (3z2A2G2 (3c2A2z2 (3c2a'2G2 |\n" +
		"w: A B C D E F G H I J K L\n" +
		"V:Bottom\n" +
		"(3c2A2G2 (3z2A2G2 (3c2A2z2 (3c2A,2G2 | E,4 E,4 E,4 E,4 |\n" +
		"w: 1 2 3 4 5 6 7 8 9\n"

	var expectedTwoVoiceRestsTripletsWordsTriplets = [
		{"x":440,"y":78,"width":62,"height":20},{"x":518,"y":83,"width":62,"height":17},{"x":597,"y":72,"width":60,"height":17},{"x":676,"y":37,"width":62,"height":17},{"x":55,"y":157,"width":62,"height":19},{"x":133,"y":165,"width":62,"height":17},{"x":212,"y":161,"width":60,"height":17},{"x":290,"y":188,"width":62,"height":17}
	]


	var expectedTwoVoiceRestsTripletsWordsRests = [
		{"x":518,"y":100,"width":8,"height":21},{"x":648,"y":100,"width":8,"height":21},{"x":133,"y":131,"width":8,"height":21},{"x":263,"y":131,"width":8,"height":21}
	]

	var expectedTwoVoiceRestsTripletsWordsWords = [
		{"x":49,"y":203,"width":12,"height":19},{"x":128,"y":203,"width":11,"height":19},{"x":205,"y":203,"width":12,"height":19},{"x":284,"y":203,"width":12,"height":19},{"x":373,"y":203,"width":11,"height":19},{"x":435,"y":203,"width":10,"height":19},{"x":460,"y":203,"width":13,"height":19},{"x":486,"y":203,"width":13,"height":19},{"x":541,"y":203,"width":7,"height":19},{"x":566,"y":203,"width":9,"height":19},{"x":590,"y":203,"width":13,"height":19},{"x":617,"y":203,"width":11,"height":19},{"x":51,"y":222,"width":9,"height":19},{"x":77,"y":222,"width":9,"height":19},{"x":103,"y":222,"width":9,"height":19},{"x":155,"y":222,"width":9,"height":19},{"x":181,"y":222,"width":9,"height":19},{"x":207,"y":222,"width":9,"height":19},{"x":233,"y":222,"width":9,"height":19},{"x":285,"y":222,"width":9,"height":19},{"x":312,"y":222,"width":9,"height":19}
	]

	it('triplet-brackets', function() {
		var visualObj = abcjs.renderAbc("paper", abcTripletBrackets, {add_classes:true});
		var actual = getElementsBox("#paper .abcjs-triplet")
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedTripletBrackets)
	})

	it('triplet-bracket-second-line', function() {
		var visualObj = abcjs.renderAbc("paper", abcTripletSecondLine, {add_classes:true});
		var actual = getElementsBox("#paper .abcjs-triplet")
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedTripletSecondLine)
	})

	it('rest-placement-one', function() {
		var visualObj = abcjs.renderAbc("paper", abcRestPlacementOne, {add_classes:true});
		var actual = getElementsBox("#paper .abcjs-rest")
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedRestPlacementOne)
	})

	it('rest-placement-two-staff', function() {
		var visualObj = abcjs.renderAbc("paper", abcRestPlacementTwoStaff, {add_classes:true});
		var actual = getElementsBox("#paper .abcjs-rest")
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedRestPlacementTwoStaff)
	})

	it('lyrics-two-voices', function() {
		var visualObj = abcjs.renderAbc("paper", abcLyricsTwoVoices, {add_classes:true});
		var actual = getElementsBox("#paper .abcjs-lyric")
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedLyricsTwoVoices)
	})

	it('lyrics-two-staves', function() {
		var visualObj = abcjs.renderAbc("paper", abcLyricsTwoVoicesTwoStaves, {add_classes:true});
		var actual = getElementsBox("#paper .abcjs-lyric")
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedLyricsTwoVoicesTwoStaves)
	})

	it('two-voice-rests-triplets-words', function() {
		var visualObj = abcjs.renderAbc("paper", abcTwoVoiceRestsTripletsWords, {add_classes:true});
		var actual = getElementsBox("#paper .abcjs-lyric")
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedTwoVoiceRestsTripletsWordsWords)
		actual = getElementsBox("#paper .abcjs-rest")
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedTwoVoiceRestsTripletsWordsRests)
		actual = getElementsBox("#paper .abcjs-triplet")
		console.log(JSON.stringify(actual))
		chai.assert.deepEqual(actual, expectedTwoVoiceRestsTripletsWordsTriplets)
	})

})

function getElementsBox(selector) {
	var elements = document.querySelectorAll(selector)
	var actual = []
	for (var i = 0; i < elements.length; i++) {
		var box = elements[i].getBBox()
		actual.push({x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height)})
	}
	return actual
}
