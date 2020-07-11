import basic from "../index"
import midi from "../midi"

test("exports an object", () => {
	expect(typeof basic).toBe('object')
})

test("has correct signature", () => {
  expect(basic.signature).toMatch(/^abcjs-basic v/)
})

test("can control animations", () => {
	[basic, midi].forEach((API) => {
		expect(typeof API.startAnimation).toBe('function')
		expect(typeof API.stopAnimation).toBe('function')
		expect(typeof API.pauseAnimation).toBe('function')
	})
})

test("can read a tunebook", () => {
	[basic, midi].forEach((API) => {
		expect(typeof API.numberOfTunes).toBe('function')
		expect(typeof API.TuneBook).toBe('function')
		expect(typeof API.parseOnly).toBe('function')
		expect(typeof API.renderEngine).toBe('function')
		expect(typeof API.extractMeasures).toBe('function')
	})
})

test("can render a tune", () => {
	[basic, midi].forEach((API) => {
		expect(typeof API.renderAbc).toBe('function')
		expect(typeof API.renderAbc).toBe('function')
	})
})

test("can access timing callbacks", () => {
	[basic, midi].forEach((API) => {
		expect(typeof API.TimingCallbacks).toBe('function')
		expect(typeof API.TimingCallbacks).toBe('function')
	})
})

test("can set glyphs", () => {
	[basic, midi].forEach((API) => {
		expect(typeof API.setGlyph).toBe('function')
		expect(typeof API.setGlyph).toBe('function')
	})
})

test("can access synth", () => {
	[basic, midi].forEach((API) => {
		expect(typeof API.synth.CreateSynth).toBe('function')
		expect(typeof API.synth.instrumentIndexToName).toBe('object')
		expect(typeof API.synth.pitchToNoteName).toBe('object')
		expect(typeof API.synth.SynthController).toBe('function')
		expect(typeof API.synth.SynthSequence).toBe('function')
		expect(typeof API.synth.CreateSynthControl).toBe('function')
		expect(typeof API.synth.registerAudioContext).toBe('function')
		expect(typeof API.synth.activeAudioContext).toBe('function')
		expect(typeof API.synth.playEvent).toBe('function')
	})
	expect(typeof basic.synth.getMidiFile).toBe('function')
	expect(typeof basic.synth.supportsAudio).toBe('function')
})

test("can access editor", () => {
	[basic, midi].forEach((API) => {
		expect(typeof API.Editor).toBe('function')
		expect(typeof API.EditArea).toBe('function')
	})
})
