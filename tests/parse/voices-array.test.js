describe("Voices Array", function() {
	var abcVoicesArray = "[V:1]C\n" +
		"[V:2]G\n" +
		"[V:3]a\n" +
		"[V:1]\n" +
		"[V:2]A\n"

	var expectedVoicesArray = [
		[
			{"top":23,"height":215,"line":0,"bar":0,"pitch":"clef"},
			{"top":23,"height":215,"line":0,"bar":0,"pitch":"C"}
		],[
			{"top":23,"height":215,"line":0,"bar":0,"pitch":"clef"},
			{"top":23,"height":215,"line":0,"bar":0,"pitch":"G"},
			{"top":273,"height":57,"line":1,"bar":0,"pitch":"clef"},
			{"top":273,"height":57,"line":1,"bar":0,"pitch":"A"}
		],[
			{"top":23,"height":215,"line":0,"bar":0,"pitch":"clef"},
			{"top":23,"height":215,"line":0,"bar":0,"pitch":"a"}
		]
	]

	it("voices array", function() {
		doVoicesTest(abcVoicesArray, expectedVoicesArray)
	})

	function doVoicesTest(abc, expected) {
		var visualObj = abcjs.renderAbc("paper", abc, {});
		var arr = visualObj[0].makeVoicesArray()
		var output = []
		for (var i = 0; i < arr.length; i++) {
			var voice = arr[i]
			var out = []
			for (var j = 0; j < voice.length; j++) {
				var el = voice[j]
				var note = ''
				if (el.elem.abcelem.el_type === 'note')
					note = el.elem.abcelem.pitches[0].name
				else
					note = el.elem.abcelem.el_type
				out.push({top: Math.round(el.top), height: Math.round(el.height), line: el.line, bar: el.measureNumber, pitch: note})
			}
			output.push(out)
		}
		//console.log(JSON.stringify(output))
		// TODO-PER: this is currently a known bug so the test is expected to fail at the moment.
		chai.assert.deepEqual(output, expected, "When the first voice is missing on the second line, the second voice is grouped with the first voice")
	}
})
