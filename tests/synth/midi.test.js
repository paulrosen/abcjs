describe("MIDI file creation", function() {
	var abcMidi = "X:1\n" +
'%%MIDI program 4\n' +
'%%MIDI channel 4\n' +
'%%MIDI transpose -2\n' +
'T: midi options\n' +
'%score {RH LH}\n' +
'L:1/4\n' +
'Q:1/4=89\n' +
'K:A\n' +
'V:RH name="Right Hand"\n' +
'A[Bd]c2|\n' +
'V:LH clef=bass name="Left Hand"\n' +
'A,B,A,2|\n';

	var expectedMidi = "data:audio/midi,MThd%00%00%00%06%00%01%00%03%01%e0" +
		"MTrk%00%00%00%29%00%FF%51%03%0a%49%6d%00%FF%59%02%03%00%00%FF%58%04%04%02%18%08%00%FF%01%0c%6d%69%64%69%20%6f%70%74%69%6f%6e%73%00%FF%2F%00" +
		"MTrk%00%00%00%4c%00%FF%03%0a%52%69%67%68%74%20%48%61%6e%64%00%C0%04%00%B4%79%00%00%B4%40%00%00%B4%5B%30%00%B4%0A%20%00%B4%07%64" +
		"%00%94%43%69%83%60%84%43%00%00%94%45%5f%00%94%48%5f%83%60%84%45%00%00%84%48%00%00%94%47%5f%87%40%84%47%00%00%FF%2F%00" +
		"MTrk%00%00%00%43%00%FF%03%09%4c%65%66%74%20%48%61%6e%64%00%C0%04%00%B4%79%00%00%B4%40%00%00%B4%5B%30%00%B4%0A%60%00%B4%07%64" +
		"%00%94%37%69%83%60%84%37%00%00%94%39%5f%83%60%84%39%00%00%94%37%5f%87%40%84%37%00%00%FF%2F%00";

	var abcStaccato = "X:1\n" +
		'T: staccato\n' +
		'L:1/4\n' +
		'Q:1/4=59\n' +
		'K:cm\n' +
		'.A.Bcd(ef)|\n';

	var expectedStaccato = "data:audio/midi,MThd%00%00%00%06%00%01%00%02%01%e0" +
		"MTrk%00%00%00%25%00%FF%51%03%0f%84%75%00%FF%59%02%00%00%00%FF%58%04%04%02%18%08%00%FF%01%08%73%74%61%63%63%61%74%6f%00%FF%2F%00" +
		"MTrk%00%00%00%53%00%C0%00%00%B0%79%00%00%B0%40%00%00%B0%5B%30%00%B0%0A%40%00%B0%07%64%00%90%45%55%82%26%80%45%00%81%3a%90%47%55%82%26%80%47%00%81%3a%90%48%5f%83%60%80%48%00%00%90%4a%5f%83%60%80%4a%00%00%90%4c%5f%83%60%90%4d%5f%02%80%4c%00%83%5e%80%4d%00%00%FF%2F%00"

	var abcDrums = "X:1\n" +
	"T:percmap\n" +
	"%%MIDI drummap F 36 %bass drum 1\n" +
	"%%MIDI drummap c 38 %acoustic snare\n" +
	"%%MIDI drummap g 42 %closed hi hat\n" +
	"Q:1/4=50\n" +
	"K:C perc\n" +
	"[gF] g [gc] g [gF] g [gc] g | c c c c\n"	

	var expectedDrums = "data:audio/midi,MThd%00%00%00%06%00%01%00%02%01%e0MTrk%00%00%00%24%00%FF%51%03%12%4f%80%00%FF%59%02%00%00%00%FF%58%04%04%02%18%08%00%FF%01%07%70%65%72%63%6d%61%70%00%FF%2F%00MTrk%00%00%00%a7%00%C0%00%00%B9%79%00%00%B9%40%00%00%B9%5B%30%00%B9%0A%40%00%B9%07%64%00%99%2a%69%00%99%24%69%81%70%89%2a%00%00%89%24%00%00%99%2a%55%81%70%89%2a%00%00%99%2a%5f%00%99%26%5f%81%70%89%2a%00%00%89%26%00%00%99%2a%55%81%70%89%2a%00%00%99%2a%5f%00%99%24%5f%81%70%89%2a%00%00%89%24%00%00%99%2a%55%81%70%89%2a%00%00%99%2a%5f%00%99%26%5f%81%70%89%2a%00%00%89%26%00%00%99%2a%55%81%70%89%2a%00%00%99%26%69%81%70%89%26%00%00%99%26%55%81%70%89%26%00%00%99%26%5f%81%70%89%26%00%00%99%26%55%81%70%89%26%00%00%FF%2F%00"


	it("midi-piano", function() {
		var midi = abcjs.synth.getMidiFile(abcMidi, { midiOutputType: "link", pan: [ -0.5, 0.5 ]});
		var contents = setMidiLink(midi);

		var msg = "\nrcv: " + JSON.stringify(contents) + "\n" +
			"exp: " + JSON.stringify(expectedMidi) + "\n";
		chai.assert.strictEqual(contents, expectedMidi, msg);
	})

	it("midi-staccato", function() {
		var midi = abcjs.synth.getMidiFile(abcStaccato, { midiOutputType: "link"});
		var contents = setMidiLink(midi);
//		console.log(midi)
		var msg = "\nrcv: " + JSON.stringify(contents) + "\n" +
			"exp: " + JSON.stringify(expectedStaccato) + "\n";
		chai.assert.strictEqual(contents, expectedStaccato, msg);
	})

	it("midi-drums", function() {
		var midi = abcjs.synth.getMidiFile(abcDrums, { midiOutputType: "link"});
		var contents = setMidiLink(midi);
//		console.log(midi)
		var msg = "\nrcv: " + JSON.stringify(contents) + "\n" +
			"exp: " + JSON.stringify(expectedDrums) + "\n";
		chai.assert.strictEqual(contents, expectedDrums, msg);
	})
})

function setMidiLink(midi) {
	var el = document.getElementById("midi");
	el.innerHTML = midi;
	el = el.querySelector("a");
	var contents = el.href;
	return contents;
}
