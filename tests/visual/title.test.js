describe("Title", function () {
	var abcTitleNormal = "X:1\n" +
	"T:Not Transformed\n" +
	"K:C\n" +
	"C";

	var expectedTitleNormal = "Not Transformed"

	var abcTitleThe = "X:1\n" +
	"T:Transformed, The\n" +
	"K:C\n" +
	"C";

	var expectedTitleThe = "The Transformed"

	var abcTitleThe2 = "X:1\n" +
	"T:Transformed,the\n" +
	"K:C\n" +
	"C";

	var expectedTitleThe2 = "the Transformed"

	var abcTitleA = "X:1\n" +
	"T:Transformed, A\n" +
	"K:C\n" +
	"C";

	var expectedTitleA = "A Transformed"

	var abcTitleAn = "X:1\n" +
	"T:Transformed, An\n" +
	"K:C\n" +
	"C";

	var expectedTitleAn = "An Transformed"

	var abcTitleA2 = "X:1\n" +
	"T:Transformed,  a\n" +
	"K:C\n" +
	"C";

	var expectedTitleA2 = "a Transformed"

	var abcTitleNumberThe = "X:1\n" +
	"T:24. Number Transform, The\n" +
	"K:C\n" +
	"C";

	var expectedTitleNumberThe = "24. The Number Transform"

	var abcTitleNumberA = "X:1\n" +
	"T:24. Number Transform, A\n" +
	"K:C\n" +
	"C";

	var expectedTitleNumberA = "24. A Number Transform"

	var abcTitleMalformed = "X:1\n" +
	"T:Mal , The Formed\n" +
	"K:C\n" +
	"C";

	var expectedTitleMalformed = "Mal , The Formed"

	var abcSubtitleAndFrench = "X:1\n" +
		"T:20. Subtitles, The \n" +
		"T:Sub, The\n" +
		"T:Sub, the\n" +
		"T:Sub, A\n" +
		"T:Sub, a\n" +
		"T:Sub, An\n" +
		"T:Sub, an\n" +
		"T:Sub, Da\n" +
		"T:Sub, La\n" +
		"T:Sub, Le\n" +
		"T:Sub, Les\n" +
		"T:Sub, Ye\n" +
		"K:C\n" +
		"C";

	var expectedSubtitleAndFrench = [
		"20. The Subtitles",
		"The Sub",
		"the Sub",
		"A Sub",
		"a Sub",
		"An Sub",
		"an Sub",
		"Da Sub",
		"La Sub",
		"Le Sub",
		"Les Sub",
		"Ye Sub",
	]

	it("puts 'the' at the front of the title", function () {
		testTitle(abcTitleNormal, expectedTitleNormal, "TitleNormal");
		testTitle(abcTitleThe, expectedTitleThe, "TitleThe");
		testTitle(abcTitleThe2, expectedTitleThe2, "TitleThe2");
		testTitle(abcTitleA, expectedTitleA, "TitleA");
		testTitle(abcTitleAn, expectedTitleAn, "TitleAn");
		testTitle(abcTitleA2, expectedTitleA2, "TitleA2");
		testTitle(abcTitleNumberThe, expectedTitleNumberThe, "TitleNumberThe");
		testTitle(abcTitleNumberA, expectedTitleNumberA, "TitleNumberA");
		testTitle(abcTitleMalformed, expectedTitleMalformed, "TitleMalformed");
	})

	function testTitle(abc, expected, comment) {
		var visualObj = abcjs.renderAbc("*", abc);
		var title = visualObj[0].metaText.title
		chai.assert.equal(title, expected, ": "+comment);

	}

	it("tests reverser for subtitles", function () {
		testSubTitle(abcSubtitleAndFrench, expectedSubtitleAndFrench);
	})

	function testSubTitle(abc, expected) {
		var visualObj = abcjs.renderAbc("*", abc);
		var titles = [visualObj[0].metaText.title]
		for (var i = 0; i < visualObj[0].lines.length; i++) {
			var line = visualObj[0].lines[i]
			if (line.subtitle) {
				titles.push(line.subtitle.text)
			}
		}
		for (i = 0; i < titles.length; i++)
			chai.assert.equal(titles[i], expected[i]);

	}
})
