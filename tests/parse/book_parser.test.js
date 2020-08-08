const assert = require('chai').assert
const Tunebook = require("../../src/api/abc_tunebook")
/**
 * http://abcnotation.com/wiki/abc:standard:v2.1#xreference_number
 * http://abcnotation.com/wiki/abc:standard:v2.1#ttune_title
 *
 */

describe("Book Parser function", function () {
	it("parses a single tune", () => {
		Tunebook.TuneBook("X:43\nT: example")
		assert.equal(Tunebook.tunes.length, 1)
		assert.equal(Tunebook.tunes[0].id, "43")
		assert.equal(Tunebook.tunes[0].title, "example")
	})

	it("parses a single tune with no title", () => {
		Tunebook.TuneBook("X:43\nT:")
		assert.equal(Tunebook.tunes.length, 1)
		assert.equal(Tunebook.tunes[0].id, "43")
		assert.equal(Tunebook.tunes[0].title, "")
	})

	it("parses multiple tunes", () => {
		Tunebook.TuneBook("X:1\nT: a\n\nX:2\n\nX:3\nT: c")
		assert.equal(Tunebook.tunes.length, 3)
		assert.equal(Tunebook.tunes[0].id, "1")
		assert.equal(Tunebook.tunes[0].title, "a")
		assert.equal(Tunebook.tunes[1].id, "2")
		assert.equal(Tunebook.tunes[1].title, "")
		assert.equal(Tunebook.tunes[2].id, "3")
		assert.equal(Tunebook.tunes[2].title, "c")
	})

	it("collects directives in string header", () => {
		Tunebook.TuneBook("%% example\nT: wed\n%%example\nX:1")
		assert.equal(Tunebook.header, "%% example\n%%example\n")
	})

	it("trims whitespace from the end of a tune", () => {
		Tunebook.TuneBook("%%example\nX:1\nT: a\n\n\n\n\n\nX:2\n\n")
		assert.equal(Tunebook.tunes[0].abc, "%%example\nX:1\nT: a")
		assert.equal(Tunebook.tunes[0].pure, "X:1\nT: a")
	})
})
