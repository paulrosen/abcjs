describe("Parser", function() {
	var abcOctave1 = "X:1\nK: bass\n" +
	"[V:v1] C,D,E,F, |\n" +
	"[V:v2 octave=-1] CDEF |\n" +
	"[V:v3 octave=-2] cdef |\n" +
	"[V:v4 octave=1] C,,D,,E,,F,, |\n" +
	"K: octave=1\n" +
	"[V:v1] C,,D,,E,,F,,|\n" +
	"[V:v2] CDEF |\n" +
	"[V:v3] cdef |\n" +
	"[V:v4 octave=0] C,D,E,F, |\n"

	var expectedOctave1 = [
		[-7, -6, -5, -4],
		[-7, -6, -5, -4],
		[-7, -6, -5, -4],
		[-7, -6, -5, -4],
		[-7, -6, -5, -4],
		[-7, -6, -5, -4],
		[-7, -6, -5, -4],
		[-7, -6, -5, -4],
	]

	it("octave1", function() {
		doNoteIdTest(abcOctave1, expectedOctave1)
	})

	function doNoteIdTest(abc, expected) {
		var visualObj = abcjs.renderAbc("paper", abc, {});
		var output = []
		for (var k = 0; k < visualObj[0].lines.length; k++) {
			var line = visualObj[0].lines[k];
			for (var i = 0; i < line.staff.length; i++) {
				var voice = line.staff[i].voices[0]
				var out = []
				for (var j = 0; j < voice.length; j++) {
					if (voice[j].pitches)
						out.push(voice[j].pitches[0].pitch)
				}
				output.push(out)	
			}
		}
		chai.assert.deepStrictEqual(output, expected);
	}
})
