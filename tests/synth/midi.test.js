describe("MIDI file creation", () => {
	var abcMidi = `X:1 
%%MIDI program 40
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

	it("midi-piano", () => {
		var midi = abcjs.synth.getMidiFile(abcMidi, { midiOutputType: "encoded"});
		console.log(midi);
		chai.assert.strictEqual(1, 2)
	})
})
