const renderText = require("./text")
const printSymbol = require("./print-symbol");
const printStem = require("./print-stem");

const svgNS = "http://www.w3.org/2000/svg";

const ROW_HEIGHT = 50
const PART_MARGIN_TOP = 10
const PART_MARGIN_BOTTOM = 20
const TEXT_MARGIN = 16

function drawChordGrid(renderer, parts, leftMargin, pageWidth, fonts) {
	const chordFont = fonts.gchordfont
	const partFont = fonts.partsfont
	const annotationFont = fonts.annotationfont
	const endingFont = fonts.repeatfont
	const textFont = fonts.textfont
	const subtitleFont = fonts.subtitlefont

	parts.forEach(part => {
		switch (part.type) {
			case "text": {
				text(renderer, part.text, leftMargin, renderer.y, 16, textFont, null, null, false )
				renderer.moveY(TEXT_MARGIN)
			}
				break
			case "subtitle": {
				text(renderer, part.subtitle, leftMargin, renderer.y+PART_MARGIN_TOP, 20, subtitleFont, null, "abcjs-subtitle", false )
				renderer.moveY(PART_MARGIN_BOTTOM)
			}
				break
			case "part":
				if (part.lines.length > 0) {
					text(renderer, part.name, leftMargin, renderer.y+PART_MARGIN_TOP, 20, subtitleFont, part.name, "abcjs-part", false )

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
									text(renderer, measure.ending, leftMargin + barNum * colWidth + 4, renderer.y + lineNum * ROW_HEIGHT + 10, 12, endingFont, null, null, false )
								}
								drawMeasure(renderer, renderer.y, leftMargin+repeatLeft, colWidth, lineNum, barNum, measure.chord, chordFont, repeatLeft+repeatRight)
								if (measure.annotations && measure.annotations.length > 0) {
									drawAnnotations(renderer, renderer.y + lineNum * ROW_HEIGHT, leftMargin + barNum * colWidth, measure.annotations, annotationFont)
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

function drawAnnotations(renderer, offset, left, annotations, annotationFont) {
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
				text(renderer, annotations[a], left, offset - 22, 12, annotationFont, null, null, false )
		}
	}

}

function drawMeasure(renderer, offset, leftMargin, colWidth, lineNum, barNum, chords, chordFont, margin) {
	const left = leftMargin + colWidth * barNum
	const top = offset + lineNum * ROW_HEIGHT
	if (!chords[1] && !chords[2] && !chords[3])
		drawSingleChord(renderer, left, top, colWidth-margin, ROW_HEIGHT, chords[0], chordFont)
	else if (!chords[1] && !chords[3])
		drawTwoChords(renderer, left, top, colWidth-margin, ROW_HEIGHT, chords[0], chords[2], chordFont)
	else
		drawFourChords(renderer, left, top, colWidth-margin, ROW_HEIGHT, chords, chordFont)
}

function renderChord(renderer, x, y, size, chord, font, maxWidth) {
	const el = text(renderer, chord, x, y, size, font, null, "abcjs-chord", true)
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

function drawSingleChord(renderer, left, top, width, height, chord, font) {
	renderChord(renderer, left+width/2, top+height/2, MAX_ONE_CHORD, chord, font, width)
}

function drawTwoChords(renderer, left, top, width, height, chord1, chord2, font) {
	renderer.paper.lineToBack({x1: left, x2: left+width, y1: top+height, y2: top })
	renderChord(renderer, left+width/4, top+height/4+5, MAX_TWO_CHORDS, chord1, font, width/2)
	renderChord(renderer, left+3*width/4, top+3*height/4, MAX_TWO_CHORDS, chord2, font, width/2)
}

function drawFourChords(renderer, left, top, width, height, chords, font) {
	const MARGIN = 5
	renderer.paper.lineToBack({x1: left+MARGIN, x2: left+width-MARGIN, y1: top+height/2, y2: top+height/2 })
	renderer.paper.lineToBack({x1: left+width/2, x2: left+width/2, y1: top+MARGIN, y2: top+height-MARGIN })

	if (chords[0])
		renderChord(renderer, left+width/4, top+height/4+2, MAX_FOUR_CHORDS, chords[0], font, width / 2)
	if (chords[1])
		renderChord(renderer, left+3*width/4, top+height/4+2, MAX_FOUR_CHORDS, chords[1], font, width / 2)
	if (chords[2])
		renderChord(renderer, left+width/4, top+3*height/4, MAX_FOUR_CHORDS, chords[2], font, width / 2)
	if (chords[3])
		renderChord(renderer, left+3*width/4, top+3*height/4, MAX_FOUR_CHORDS, chords[3], font, width / 2)
}

function text(renderer, str, x, y, size, font, dataName, klass, alignCenter) {
	const attr = {
		x: x,
		y: y,
		stroke:"none",
		'font-size':size,
		'font-style':font.style,
		'font-family':font.face,
		'font-weight':font.weight,
		'text-decoration':font.decoration,
	}
	if (dataName)
		attr['data-name'] = dataName
	if (klass)
		attr['class'] = klass
	attr["text-anchor"] = alignCenter ? "middle" : "start"

	return renderer.paper.text(str, attr, null, {"alignment-baseline": "middle"})
}

module.exports = drawChordGrid
