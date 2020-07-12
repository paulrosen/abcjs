import basic from "../index"

test("exports an object", () => {
	expect(basic).toEqual(expect.any(Object))
})

test("has correct signature", () => {
  expect(basic.signature).toEqual(expect.stringContaining('abcjs-basic v'))
})

test("can control animations", () => {
	expect(basic.startAnimation).toEqual(expect.any(Function))
	expect(basic.stopAnimation).toEqual(expect.any(Function))
	expect(basic.pauseAnimation).toEqual(expect.any(Function))
})

test("can read a tunebook", () => {
	expect(basic.numberOfTunes).toEqual(expect.any(Function))
	expect(basic.TuneBook).toEqual(expect.any(Function))
	expect(basic.parseOnly).toEqual(expect.any(Function))
	expect(basic.renderEngine).toEqual(expect.any(Function))
	expect(basic.extractMeasures).toEqual(expect.any(Function))
})

test("can render a tune", () => {
	expect(basic.renderAbc).toEqual(expect.any(Function))
})

test("can access timing callbacks", () => {
	expect(basic.TimingCallbacks).toEqual(expect.any(Function))
})

test("can set glyphs", () => {
	expect(basic.setGlyph).toEqual(expect.any(Function))
})

test("can access synth", () => {
	expect(basic.synth).toEqual(expect.objectContaining({
		CreateSynth: expect.any(Function),
		instrumentIndexToName: expect.any(Object),
		pitchToNoteName: expect.any(Object),
		SynthController: expect.any(Function),
		SynthSequence: expect.any(Function),
		CreateSynthControl: expect.any(Function),
		registerAudioContext: expect.any(Function),
		activeAudioContext: expect.any(Function),
		playEvent: expect.any(Function),
		getMidiFile: expect.any(Function),
		supportsAudio: expect.any(Function),
	}))
})

test("can access editor", () => {
	expect(basic.Editor).toEqual(expect.any(Function))
	expect(basic.EditArea).toEqual(expect.any(Function))
})
