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

	var expectedTitleThe2 = "The Transformed"

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

	var expectedTitleA2 = "A Transformed"

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
})
