import midi from "../midi"

test("exports an object", () => {
	expect(typeof midi).toBe('object')
})

test("has correct signature", () => {
  expect(midi.signature).toMatch(/^abcjs-midi v/)
})

test("can access midi", () => {
	expect(typeof midi.midi).toBe('object')
	expect(typeof midi.midi.setSoundFont).toBe('function')
	expect(typeof midi.midi.startPlaying).toBe('function')
	expect(typeof midi.midi.restartPlaying).toBe('function')
	expect(typeof midi.midi.stopPlaying).toBe('function')
	expect(typeof midi.midi.setLoop).toBe('function')
	expect(typeof midi.midi.deviceSupportsMidi).toBe('function')
	expect(typeof midi.midi.setRandomProgress).toBe('function')
	expect(typeof midi.midi.setInteractiveProgressBar).toBe('function')
})
