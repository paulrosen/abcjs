import basic from "../index"
import midi from "../midi"

test("is extension of basic", () => {
	expect(midi).toBe(basic)
})

test("has correct signature", () => {
  expect(midi.signature).toEqual(expect.stringContaining('abcjs-midi v'))
})

test("can access midi", () => {
	expect(midi.midi).toEqual(expect.objectContaining({
		setSoundFont: expect.any(Function),
		startPlaying: expect.any(Function),
		restartPlaying: expect.any(Function),
		stopPlaying: expect.any(Function),
		setLoop: expect.any(Function),
		deviceSupportsMidi: expect.any(Function),
		setRandomProgress: expect.any(Function),
		setInteractiveProgressBar: expect.any(Function),
	}))
})
