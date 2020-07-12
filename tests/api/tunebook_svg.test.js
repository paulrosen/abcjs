import render from 'api/abc_tunebook_svg'
import tunebook from 'api/abc_tunebook'

jest.mock('api/abc_tunebook')

test("passes the correct params to renderEngine", () => {
	let parserParams = { p: 'parserParams' }
	let engraverParams = { e: 'engraverParams' }
	let renderParams = { r: 'renderParams' }
	console.log(render('', '', parserParams, engraverParams, renderParams))
	expect(tunebook.renderEngine.mock.calls[0][3]).toEqual({
		...parserParams,
		...engraverParams,
		...renderParams,
	})
})

test("passes click listener to renderEngine", () => {
	let engraverParams = { listener: { highlight: 'clickListener' }}
	render('', '', {}, engraverParams, {})
	expect(tunebook.renderEngine.mock.calls[1][3]).toEqual({
		clickListener: 'clickListener'
	})
})

