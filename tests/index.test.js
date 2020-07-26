const assert = require('chai').assert
const basic = require('../index')

describe("ABCJS Basic", function () {
	it('should expose ABCJS as an object', function () {
		assert.isObject(basic)
	})

	it('should have the correct ABCJS signature', function () {
		assert.include(basic.signature, 'abcjs-basic v')
	})

	it('should expose animation functions', function () {
		assert.isFunction(basic.startAnimation)
		assert.isFunction(basic.stopAnimation)
		assert.isFunction(basic.pauseAnimation)
	})

	it('should eexpose tunebook functions', function () {
		assert.isFunction(basic.numberOfTunes)
		assert.isFunction(basic.TuneBook)
		assert.isFunction(basic.parseOnly)
		assert.isFunction(basic.renderEngine)
		assert.isFunction(basic.extractMeasures)
	})

	it('should expose renderAbc function', function () {
		assert.isFunction(basic.renderAbc)
	})

	it('should expose timing callback function', function () {
		assert.isFunction(basic.TimingCallbacks)
	})

	it('should expose setGlyph function', function () {
		assert.isFunction(basic.setGlyph)
	})

	it('should expose the synth object', function () {
		assert.isObject(basic.synth)
		assert.isFunction(basic.synth.CreateSynth)
		assert.isArray(basic.synth.instrumentIndexToName)
		assert.isObject(basic.synth.pitchToNoteName)
		assert.isFunction(basic.synth.SynthController)
		assert.isFunction(basic.synth.SynthSequence)
		assert.isFunction(basic.synth.CreateSynthControl)
		assert.isFunction(basic.synth.registerAudioContext)
		assert.isFunction(basic.synth.activeAudioContext)
		assert.isFunction(basic.synth.playEvent)
		assert.isFunction(basic.synth.getMidiFile)
		assert.isFunction(basic.synth.supportsAudio)
	})

	it('should expose the editor functions', function () {
		assert.isFunction(basic.Editor)
		assert.isFunction(basic.EditArea)
	})
})
