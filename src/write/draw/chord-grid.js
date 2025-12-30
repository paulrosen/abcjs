const renderText = require("./text")
const printSymbol = require("./print-symbol");
const printStem = require("./print-stem");

const svgNS = "http://www.w3.org/2000/svg";

const ROW_HEIGHT = 50
const PART_MARGIN_TOP = 10
const PART_MARGIN_BOTTOM = 20
const TEXT_MARGIN = 16

const textStyle = {
	"text-anchor":"start",
	stroke:"none",
	'font-size':"20",
	'font-style':"normal",
	'font-family':"Times New Roman",
	'font-weight':"normal",
	'text-decoration':"none",
}

function drawChordGrid(renderer, parts, leftMargin, pageWidth, chordFont) {
	parts.forEach(part => {
		switch (part.type) {
			case "text": {
				renderText(renderer, {
					x: leftMargin,
					y: renderer.y,
					text: part.text,
					"text-anchor":"start",
					type: {face: "Times New Roman", size: 16, style: "normal", weight: "normal", decoration: "none"},
				})
				renderer.moveY(TEXT_MARGIN)
			}
				break
			case "subtitle": {
				const attr = Object.assign({}, textStyle, {
					x: leftMargin,
					y: renderer.y+PART_MARGIN_TOP,
					'data-name': 'abcjs-title'
				})
				renderer.paper.text(part.subtitle, attr, null, {"alignment-baseline": "middle"})
				renderer.moveY(PART_MARGIN_BOTTOM)
			}
				break
			case "part":
				if (part.lines.length > 0) {
					const attr = Object.assign({}, textStyle, {
						x: leftMargin,
						y: renderer.y+PART_MARGIN_TOP,
						'data-name': part.name
					})
					renderer.paper.text(part.name, attr, null, {"alignment-baseline": "middle"})
					renderer.moveY(PART_MARGIN_BOTTOM)
					const numCols = part.lines[0].length
					const colWidth = pageWidth / numCols
					part.lines.forEach((line, lineNum) => {
						line.forEach((measure, barNum) => {
							const RECT_WIDTH = 1
							if (!measure.noBorder) {
								renderer.paper.rect({x: leftMargin + barNum * colWidth, y: renderer.y + lineNum * ROW_HEIGHT, width: colWidth, height: ROW_HEIGHT})
								renderer.paper.rect({x: leftMargin + barNum * colWidth + RECT_WIDTH, y: renderer.y + lineNum * ROW_HEIGHT + RECT_WIDTH, width: colWidth - RECT_WIDTH * 2, height: ROW_HEIGHT - RECT_WIDTH * 2})
								let repeatLeft = 0
								let repeatRight = 0
								if (measure.hasStartRepeat) {
									drawStartRepeat(renderer, renderer.y, leftMargin, colWidth, lineNum, barNum)
									repeatLeft = 12
								}
								if (measure.hasEndRepeat) {
									drawEndRepeat(renderer, renderer.y, leftMargin, colWidth, lineNum, barNum)
									repeatRight = 12
								}

								if (measure.ending) {
									renderText(renderer, {
										x: leftMargin + barNum * colWidth,
										y: renderer.y + lineNum * ROW_HEIGHT,
										text: measure.ending,
										"text-anchor": "start",
										type: {face: "Arial, sans-serif", size: 12, style: "normal", weight: "normal", decoration: "none"},
									})
								}
								drawMeasure(renderer, renderer.y, leftMargin+repeatLeft, colWidth, lineNum, barNum, measure.chord, chordFont, repeatLeft+repeatRight)
								if (measure.annotations && measure.annotations.length > 0) {
									drawAnnotations(renderer, renderer.y + lineNum * ROW_HEIGHT, leftMargin + barNum * colWidth, measure.annotations)
								}
							}
						})
					})
					renderer.moveY(ROW_HEIGHT * part.lines.length + PART_MARGIN_BOTTOM)
				}
				break;
		}
	})
}

function drawStartRepeat(renderer, offset, leftMargin, colWidth, lineNum, barNum) {
	const left = leftMargin + colWidth * barNum
	const top = offset + lineNum * ROW_HEIGHT
	return drawRepeat(renderer, left, top, top+ROW_HEIGHT, true, renderer.yToPitch(lineNum * ROW_HEIGHT))
}
function drawEndRepeat(renderer, offset, leftMargin, colWidth, lineNum, barNum) {
	const left = leftMargin + colWidth * barNum
	const top = offset + lineNum * ROW_HEIGHT
	return drawRepeat(renderer, left+colWidth, top, top+ROW_HEIGHT, false, lineNum * ROW_HEIGHT)
}

function drawRepeat(renderer, x, y1, y2, isStart, offset) {
	const lineX = isStart ? x+2 : x-4
	const circleX = isStart ? x+9 : x-11

	renderer.paper.openGroup({klass:'abcjs-repeat'})
	printStem(renderer, lineX, 3 + renderer.lineThickness, y1, y2, null, "bar")

	printSymbol(renderer, circleX, - renderer.yToPitch(offset) - 4, "dots.dot", {
		scalex: 1,
		scaley: 1,
		klass: "",
		name: "dot"
	});

	printSymbol(renderer, circleX, - renderer.yToPitch(offset) - 8, "dots.dot", {
		scalex: 1,
		scaley: 1,
		klass: "",
		name: "dot"
	});
	renderer.paper.closeGroup()
}

const symbols = {
	'segno': "scripts.segno",
	'coda': "scripts.coda",
	"fermata": "scripts.ufermata",
}

function drawAnnotations(renderer, offset, left, annotations) {
	let el
	for (let a = 0; a < annotations.length; a++) {
		switch (annotations[a]) {
			case 'segno':
			case 'coda':
			case "fermata": {
				left += 12
				el = printSymbol(renderer, left, 2, symbols[annotations[a]], {
					scalex: 1,
					scaley: 1,
					//klass: renderer.controller.classes.generate(klass),
					name: symbols[annotations[a]]
				});
				const box = el.getBBox()
				left += box.width
			}
				break;
			default:
				renderText(renderer, {
					x: left,
					y: offset - 22,
					text: annotations[a],
					"text-anchor":"start",
					type: {face: "Times New Roman", size: 12, style: "normal", weight: "normal", decoration: "none"},
				})
		}
	}

}

function drawMeasure(renderer, offset, leftMargin, colWidth, lineNum, barNum, chords, chordFont, margin) {
	const left = leftMargin + colWidth * barNum
	const top = offset + lineNum * ROW_HEIGHT
	const family = chordFont ? chordFont.face : textStyle['font-family']
	if (!chords[1] && !chords[2] && !chords[3])
		drawSingleChord(renderer, left, top, colWidth-margin, ROW_HEIGHT, chords[0], family)
	else if (!chords[1] && !chords[3])
		drawTwoChords(renderer, left, top, colWidth-margin, ROW_HEIGHT, chords[0], chords[2], family)
	else
		drawFourChords(renderer, left, top, colWidth-margin, ROW_HEIGHT, chords, family)
}

function renderChord(renderer, x, y, size, chord, family, maxWidth) {
	const attr = Object.assign({}, textStyle, {
		x: x,
		y: y,
		"font-family" : family,
		"font-size": size,
		"text-anchor": "middle",
		"class": "abcjs-chord"
	})
	const el = renderer.paper.text(chord, attr, null, {"alignment-baseline": "middle"})
	let bb = el.getBBox()
	let fontSize = size
	while (bb.width > maxWidth && fontSize >= 16) {
		fontSize -= 2
		el.setAttribute('font-size', fontSize)
		bb = el.getBBox()
	}

}

const MAX_ONE_CHORD = 34
const MAX_TWO_CHORDS = 26
const MAX_FOUR_CHORDS = 20

function drawSingleChord(renderer, left, top, width, height, chord, family) {
	renderChord(renderer, left+width/2, top+height/2, MAX_ONE_CHORD, chord, family, width)
}

function drawTwoChords(renderer, left, top, width, height, chord1, chord2, family) {
	renderer.paper.lineToBack({x1: left, x2: left+width, y1: top+height, y2: top })
	renderChord(renderer, left+width/4, top+height/4+5, MAX_TWO_CHORDS, chord1, family, width/2)
	renderChord(renderer, left+3*width/4, top+3*height/4, MAX_TWO_CHORDS, chord2, family, width/2)
}

function drawFourChords(renderer, left, top, width, height, chords, family) {
	const MARGIN = 5
	renderer.paper.lineToBack({x1: left+MARGIN, x2: left+width-MARGIN, y1: top+height/2, y2: top+height/2 })
	renderer.paper.lineToBack({x1: left+width/2, x2: left+width/2, y1: top+MARGIN, y2: top+height-MARGIN })

	if (chords[0])
		renderChord(renderer, left+width/4, top+height/4+2, MAX_FOUR_CHORDS, chords[0], family, width / 2)
	if (chords[1])
		renderChord(renderer, left+3*width/4, top+height/4+2, MAX_FOUR_CHORDS, chords[1], family, width / 2)
	if (chords[2])
		renderChord(renderer, left+width/4, top+3*height/4, MAX_FOUR_CHORDS, chords[2], family, width / 2)
	if (chords[3])
		renderChord(renderer, left+3*width/4, top+3*height/4, MAX_FOUR_CHORDS, chords[3], family, width / 2)
}

module.exports = drawChordGrid
