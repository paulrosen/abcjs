const assert = require('chai').assert
const render = require('../../src/api/abc_tunebook_svg')
const tunebook = require('../../src/api/abc_tunebook')

// mock renderEngine Call
tunebook.renderEngine = function (...args) {
	return args[3]
}

describe("renderAbc", function () {
	it("passes the correct params to renderEngine", () => {
		let parserParams = { p: 'parserParams' }
		let engraverParams = { e: 'engraverParams' }
		let renderParams = { r: 'renderParams' }
		let result = render('', '', parserParams, engraverParams, renderParams)
		assert.deepEqual(result, {
			...parserParams,
			...engraverParams,
			...renderParams,
		})
	})

	it("passes click listener to renderEngine", () => {
		let engraverParams = { listener: { highlight: 'clickListener' }}
		let result = render('', '', {}, engraverParams, {})
		assert.deepEqual(result, {
			clickListener: 'clickListener'
		})
	})
})

