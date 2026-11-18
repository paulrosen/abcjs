// Tuplet durations, asserted on the bytes of the generated MIDI file.
//
// These are deliberately end-to-end: abc -> parser -> sequencer -> flattener ->
// MIDI writer. A tuplet is a fixed amount of time no matter how its notes are
// written, so the tick arithmetic below is exact and independent of the code
// that produces it. See issue #1117.
//
// All of these FAIL on 6.7.0 except the ones marked "unchanged".

describe("Tuplet MIDI output", function () {
	// M:4/4 L:1/8 Q:1/4=120 and abcjs writes 480 ticks to the quarter note, so
	// a written eighth is 240 ticks and a 4/4 bar is 1920.
	var header = 'X:1\nM:4/4\nL:1/8\nQ:1/4=120\nK:C\n';
	var QUARTER = 480;

	// --- a minimal Standard MIDI File reader -------------------------------
	function readMidi(bytes) {
		function str(o, n) { var s = ""; for (var i = 0; i < n; i++) s += String.fromCharCode(bytes[o + i]); return s; }
		function u16(o) { return (bytes[o] << 8) | bytes[o + 1]; }
		function u32(o) { return (bytes[o] * 16777216) + (bytes[o + 1] << 16) + (bytes[o + 2] << 8) + bytes[o + 3]; }
		chai.assert.equal(str(0, 4), "MThd", "not a MIDI file");
		var division = u16(12);
		var numTracks = u16(10);
		var pos = 8 + u32(4);
		var tracks = [];
		for (var t = 0; t < numTracks; t++) {
			chai.assert.equal(str(pos, 4), "MTrk", "expected a track chunk");
			var end = pos + 8 + u32(pos + 4);
			var p = pos + 8, tick = 0, running = 0, events = [], b;
			while (p < end) {
				var delta = 0;
				do { b = bytes[p++]; delta = (delta << 7) | (b & 0x7f); } while (b & 0x80);
				tick += delta;
				var status = bytes[p];
				if (status & 0x80) { running = status; p++; } else status = running;
				if (status === 0xff) {                       // meta event
					p++;
					var mlen = 0;
					do { b = bytes[p++]; mlen = (mlen << 7) | (b & 0x7f); } while (b & 0x80);
					p += mlen;
				} else if (status === 0xf0 || status === 0xf7) { // sysex
					var slen = 0;
					do { b = bytes[p++]; slen = (slen << 7) | (b & 0x7f); } while (b & 0x80);
					p += slen;
				} else {
					var type = status & 0xf0;
					if (type === 0x80 || type === 0x90) {
						events.push({ tick: tick, on: type === 0x90 && bytes[p + 1] > 0, pitch: bytes[p] });
						p += 2;
					} else if (type === 0xc0 || type === 0xd0) p += 1;
					else p += 2;
				}
			}
			tracks.push(events);
			pos = end;
		}
		return { division: division, tracks: tracks };
	}

	// every sounding note in the file, as "startTick+durationTicks" separated by spaces.
	// A string rather than an array of pairs so that a failure reads as a bar of music
	// rather than as a nested-array diff.
	function ticksOf(abc) {
		return notesOf(abc).map(function (n) { return n[0] + "+" + n[1]; }).join(" ");
	}

	function notesOf(abc) {
		var bytes = abcjs.synth.getMidiFile(header + abc + '\n', { midiOutputType: "binary" })[0];
		var midi = readMidi(bytes);
		chai.assert.equal(midi.division, QUARTER, "ticks per quarter note");
		var notes = [];
		for (var t = 0; t < midi.tracks.length; t++) {
			var open = {};
			for (var i = 0; i < midi.tracks[t].length; i++) {
				var ev = midi.tracks[t][i];
				if (ev.on) {
					if (!open[ev.pitch]) open[ev.pitch] = [];
					open[ev.pitch].push(ev.tick);
				} else if (open[ev.pitch] && open[ev.pitch].length) {
					var start = open[ev.pitch].shift();
					notes.push([start, ev.tick - start]);
				}
			}
		}
		return notes.sort(function (a, b) { return a[0] - b[0]; });
	}

	var cases = [
		// [ name, abc, "startTick+durationTicks ..." ]
		["even triplet (unchanged)", '(3GFE z2 C2 D2|',
			"0+160 160+160 320+160 960+480 1440+480"],
		["broken rhythm on notes 2-3 (unchanged)", '(3GF>E z2 C2 D2|',
			"0+160 160+240 400+80 960+480 1440+480"],
		["broken rhythm on notes 1-2", '(3G>FE z2 C2 D2|',
			"0+240 240+80 320+160 960+480 1440+480"],
		["reverse broken rhythm on notes 1-2", '(3G<FE z2 C2 D2|',
			"0+80 80+240 320+160 960+480 1440+480"],
		["long first note", '(3G2FE z2 C2|',
			"0+320 320+160 480+160 1120+480"]
	];

	cases.forEach(function (c) {
		it(c[0], function () {
			chai.assert.equal(ticksOf(c[1]), c[2], c[1] + " note ticks");
		});
	});

	it("a triplet always fills exactly one quarter note", function () {
		// However the three eighths inside it are written, "(3" over a beat's worth
		// of eighths is a beat. On 6.7.0 these come out as 480, 480, 720 and 1200.
		['(3GFE|', '(3GF>E|', '(3G>FE|', '(3G<FE|'].forEach(function (abc) {
			var notes = notesOf(abc);
			chai.assert.equal(notes.length, 3, abc + ": wrong number of notes");
			var last = notes[notes.length - 1];
			chai.assert.equal(last[0] + last[1], QUARTER, abc + ": triplet is the wrong length");
		});
	});

	it("a tuplet doesn't shift the notes that follow it", function () {
		// The C is on beat 3 of the bar whatever happens inside the triplet.
		['(3GFE z2 C2 D2|', '(3GF>E z2 C2 D2|', '(3G>FE z2 C2 D2|', '(3G<FE z2 C2 D2|'].forEach(function (abc) {
			var notes = notesOf(abc);
			chai.assert.equal(notes[3][0], 2 * QUARTER, abc + ": the note after the triplet moved");
			var last = notes[notes.length - 1];
			chai.assert.equal(last[0] + last[1], 4 * QUARTER, abc + ": the bar is the wrong length");
		});
	});
});
