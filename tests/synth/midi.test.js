describe("MIDI file creation", () => {
	var abcMidi = `X:1 
%%MIDI program 4
%%MIDI channel 4
%%MIDI transpose -2
T: midi options
%score {RH LH}
L:1/4
Q:1/4=89
K:A
V:RH name="Right Hand"
A[Bd]c2|
V:LH clef=bass name="Left Hand"
A,B,A,2|
`;

	var expectedMidi = "data:audio/midi,MThd%00%00%00%06%00%01%00%03%01%e0MTrk%00%00%00%29%00%FF%51%03%0a%49%6d%00%FF%59%02%03%00%00%FF%58%04%04%02%18%08%00%FF%01%0c%6d%69%64%69%20%6f%70%74%69%6f%6e%73%00%FF%2F%00MTrk%00%00%00%38%00%FF%03%0a%52%69%67%68%74%20%48%61%6e%64%00%C0%04%00%94%43%69%83%60%84%43%00%00%94%45%5f%00%94%48%5f%83%60%84%45%00%00%84%48%00%00%94%47%5f%87%40%84%47%00%00%FF%2F%00MTrk%00%00%00%2f%00%FF%03%09%4c%65%66%74%20%48%61%6e%64%00%C0%04%00%94%37%69%83%60%84%37%00%00%94%39%5f%83%60%84%39%00%00%94%37%5f%87%40%84%37%00%00%FF%2F%00";

	it("midi-piano", () => {
		var midi = abcjs.synth.getMidiFile(abcMidi, { midiOutputType: "link"});
		var el = document.getElementById("midi");
		el.innerHTML = midi;
		el = el.querySelector("a");
		var contents = el.href;

		var msg = "\nrcv: " + JSON.stringify(contents) + "\n" +
			"exp: " + JSON.stringify(expectedMidi) + "\n";
		chai.assert.strictEqual(contents, expectedMidi, msg);
	})
})
