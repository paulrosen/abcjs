const assert = require('chai').assert
const basic = require('../index')
const midi = require('../midi')

describe("ABCJS Midi", function () {
	it("should extend ABCJS basic", function () {
		expect(midi).toBe(basic)
	})

	it('should have the correct ABCJS signature', function () {
		expect(midi.signature).toEqual(expect.stringContaining('abcjs-midi v'))
	})

	it("should expose the midi object", function () {
		assert.isObject(midi.midi)
		assert.isFunction(midi.midi.setSoundFont)
		assert.isFunction(midi.midi.startPlaying)
		assert.isFunction(midi.midi.restartPlaying)
		assert.isFunction(midi.midi.stopPlaying)
		assert.isFunction(midi.midi.setLoop)
		assert.isFunction(midi.midi.deviceSupportsMidi)
		assert.isFunction(midi.midi.setRandomProgress)
		assert.isFunction(midi.midi.setInteractiveProgressBar)
	})
})
