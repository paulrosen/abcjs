const Tunebook = require("api/abc_tunebook")
/**
 * http://abcnotation.com/wiki/abc:standard:v2.1#xreference_number
 * http://abcnotation.com/wiki/abc:standard:v2.1#ttune_title
 *
 */

test("parses a single tune", () => {
  Tunebook.TuneBook("X:43\nT: example")
  expect(Tunebook.tunes.length).toBe(1)
  expect(Tunebook.tunes[0].id).toBe("43")
  expect(Tunebook.tunes[0].title).toBe("example")
})

test("parses a single tune with no title", () => {
  Tunebook.TuneBook("X:43\nT:")
  expect(Tunebook.tunes.length).toBe(1)
  expect(Tunebook.tunes[0].id).toBe("43")
  expect(Tunebook.tunes[0].title).toBe("")
})

test("parses multiple tunes", () => {
  Tunebook.TuneBook("X:1\nT: a\n\nX:2\n\nX:3\nT: c")
  expect(Tunebook.tunes.length).toBe(3)
  expect(Tunebook.tunes[0].id).toBe("1")
  expect(Tunebook.tunes[0].title).toBe("a")
  expect(Tunebook.tunes[1].id).toBe("2")
  expect(Tunebook.tunes[1].title).toBe("")
  expect(Tunebook.tunes[2].id).toBe("3")
  expect(Tunebook.tunes[2].title).toBe("c")
})

test("collects directives in string header", () => {
  Tunebook.TuneBook("%% example\nT: wed\n%%example\nX:1")
  expect(Tunebook.header).toBe("%% example\n%%example\n")
})

test("trims whitespace from the end of a tune", () => {
  Tunebook.TuneBook("%%example\nX:1\nT: a\n\n\n\n\n\nX:2\n\n")
  expect(Tunebook.tunes[0].abc).toBe("%%example\nX:1\nT: a")
  expect(Tunebook.tunes[0].pure).toBe("X:1\nT: a")
})
