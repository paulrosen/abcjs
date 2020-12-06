describe("Start and End Char", function() {
	var abcSlurs = 'M:4/4\n' +
		'K:C\n' +
		'L:1/16\n' +
		'V: V0 clef=treble name="Sop."\n' +
		'[V: V0].("^🚩""_II7"F4.(e4).(F4)e4)|';

	var expectedSlurs = [
		{"type":"clef"},
		{"type":"timeSignature"},
		{"type":"note","startChar":56,"endChar":69,"fragment":"\"^🚩\"\"_II7\"F4"},
		{"type":"note","startChar":69,"endChar":74,"fragment":".(e4)"},
		{"type":"note","startChar":74,"endChar":79,"fragment":".(F4)"},
		{"type":"note","startChar":79,"endChar":82,"fragment":"e4)"},
		{"type":"bar","startChar":82,"endChar":83,"fragment":"|"}
	];

//////////////////////////////////////////////////////////

	it("of slurs", function() {
		doStartCharTest(abcSlurs, expectedSlurs);
	});
});

//////////////////////////////////////////////////////////

function doStartCharTest(abc, expected) {
	var visualObj = abcjs.renderAbc("paper", abc)[0];

	// Remove all extraneous info so that just the start and end chars are considered.
	var charPos = [];
	for (var i = 0; i < visualObj.lines.length; i++) {
		var line = visualObj.lines[i];
		if (line.staffGroup) {
			for (var j = 0; j < line.staffGroup.voices.length; j++) {
				var voice = line.staffGroup.voices[j];
				for (var k = 0; k < voice.children.length; k++) {
					var element = voice.children[k];
					var obj = { type: element.abcelem.el_type };
					if (element.abcelem.startChar)
						obj.startChar = element.abcelem.startChar;
					if (element.abcelem.endChar)
						obj.endChar = element.abcelem.endChar;
					if (element.abcelem.startChar && element.abcelem.endChar)
						obj.fragment = abc.substring(element.abcelem.startChar, element.abcelem.endChar)
					charPos.push(obj);
				}
			}
		}
	}

	console.log(JSON.stringify(charPos));
	for (i = 0; i < expected.length; i++) {
		var msg = "charPos\nRCV: " +
			JSON.stringify(charPos[i]) + "\nEXP: " + JSON.stringify(expected[i]) + "\n";
		chai.assert.deepStrictEqual(charPos[i], expected[i], msg);
	}
}
