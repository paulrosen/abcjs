/**
 * http://abcnotation.com/wiki/abc:standard:v2.1#xreference_number
 * http://abcnotation.com/wiki/abc:standard:v2.1#ttune_title
 *
 */

describe("Book Parser function", function () {
	it("parses a single tune", () => {
		var tunebook = new abcjs.TuneBook("X:43\nT: example")
		chai.assert.equal(tunebook.tunes.length, 1)
		chai.assert.equal(tunebook.tunes[0].id, "43")
		chai.assert.equal(tunebook.tunes[0].title, "example")
	})

	it("parses a single tune with no title", () => {
		var tunebook = new abcjs.TuneBook("X:43\nT:")
		chai.assert.equal(tunebook.tunes.length, 1)
		chai.assert.equal(tunebook.tunes[0].id, "43")
		chai.assert.equal(tunebook.tunes[0].title, "")
	})

	it("parses multiple tunes", () => {
		var tunebook = new abcjs.TuneBook("X:1\nT: a\n\nX:2\n\nX:3\nT: c")
		chai.assert.equal(tunebook.tunes.length, 3)
		chai.assert.equal(tunebook.tunes[0].id, "1")
		chai.assert.equal(tunebook.tunes[0].title, "a")
		chai.assert.equal(tunebook.tunes[1].id, "2")
		chai.assert.equal(tunebook.tunes[1].title, "")
		chai.assert.equal(tunebook.tunes[2].id, "3")
		chai.assert.equal(tunebook.tunes[2].title, "c")
	})

	it("collects directives in string header", () => {
		var tunebook = new abcjs.TuneBook("%% example\nT: wed\n%%example\nX:1")
		chai.assert.equal(tunebook.header, "%% example\n%%example\n")
	})

	it("trims whitespace from the end of a tune", () => {
		var tunebook = new abcjs.TuneBook("%%example\nX:1\nT: a\n\n\n\n\n\nX:2\n\n")
		chai.assert.equal(tunebook.tunes[0].abc, "%%example\nX:1\nT: a")
		chai.assert.equal(tunebook.tunes[0].pure, "X:1\nT: a")
	})
})
