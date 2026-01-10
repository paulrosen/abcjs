const printSymbol = require("./print-symbol");
const printStem = require("./print-stem");

function drawChordGrid(renderer, parts, leftMargin, pageWidth, fonts) {
	const chordFont = fonts.gchordfont
	const partFont = fonts.partsfont
	const annotationFont = fonts.annotationfont
	const endingFont = fonts.repeatfont
	const textFont = fonts.textfont
	const subtitleFont = fonts.subtitlefont

	const ROW_HEIGHT = 50
	const ENDING_HEIGHT = 10
	const ANNOTATION_HEIGHT = 14
	const PART_MARGIN_TOP = 10
	const PART_MARGIN_BOTTOM = 20
	const TEXT_MARGIN = 16

	renderer.paper.openGroup({klass: 'abcjs-chord-grid'})
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
						let hasEnding = false
						let hasAnnotation = false
						line.forEach(measure => {
							if (measure.ending)
								hasEnding = true
							if (measure.annotations && measure.annotations.length > 0)
								hasAnnotation = true
						})
						const extraTop = hasAnnotation ? ANNOTATION_HEIGHT : hasEnding ? ENDING_HEIGHT : 0
						line.forEach((measure, barNum) => {
							const RECT_WIDTH = 1
							if (!measure.noBorder) {
								renderer.paper.rect({x: leftMargin + barNum * colWidth, y: renderer.y, width: colWidth, height: extraTop + ROW_HEIGHT})
								renderer.paper.rect({x: leftMargin + barNum * colWidth + RECT_WIDTH, y: renderer.y + RECT_WIDTH, width: colWidth - RECT_WIDTH * 2, height: extraTop + ROW_HEIGHT - RECT_WIDTH * 2})
								let repeatLeft = 0
								let repeatRight = 0
								const top = renderer.y
								const left = leftMargin + colWidth * barNum
								if (measure.hasStartRepeat) {
									drawRepeat(renderer, left, top, top+ROW_HEIGHT+extraTop, true, extraTop)
									repeatLeft = 12
								}
								if (measure.hasEndRepeat) {
									drawRepeat(renderer, left+colWidth, top, top+ROW_HEIGHT+extraTop, false, extraTop)
									repeatRight = 12
								}

								let endingWidth = 0
								if (measure.ending) {
									const endingEl = text(renderer, measure.ending, leftMargin + barNum * colWidth + 4, top + 10, 12, endingFont, null, null, false )
									endingWidth = endingEl.getBBox().width + 4
								}
								drawMeasure(renderer, top, leftMargin+repeatLeft, colWidth, lineNum, barNum, measure.chord, chordFont, repeatLeft+repeatRight, ROW_HEIGHT, extraTop)
								if (measure.annotations && measure.annotations.length > 0) {
									drawAnnotations(renderer, top, leftMargin + barNum * colWidth +endingWidth, measure.annotations, annotationFont)
								}
								if (extraTop) {
									renderer.paper.rectBeneath({x: leftMargin + barNum * colWidth, y: renderer.y, width: colWidth, height: extraTop, fill: '#e8e8e8', stroke: 'none'})
								}
							}
						})
						renderer.moveY(extraTop + ROW_HEIGHT)
					})
					renderer.moveY(PART_MARGIN_BOTTOM)
				}
				break;
		}
	})
	renderer.paper.closeGroup()
}

function drawPercent(renderer, x, y, offset) {
	var lineX1 = x - 10
	var lineX2 = x + 10
	var lineY1 = y + 10
	var lineY2 = y - 10
	var leftDotX = x - 10
	var leftDotY = -renderer.yToPitch(offset) + 2
	var rightDotX = x + 6.5
	var rightDotY = -renderer.yToPitch(offset) -2.3

	renderer.paper.lineToBack({x1: lineX1, x2: lineX2, y1: lineY1, y2: lineY2, 'stroke-width': '3px', 'stroke-linecap':"round"  })

	printSymbol(renderer, leftDotX, leftDotY, "dots.dot", {
		scalex: 1,
		scaley: 1,
		klass: "",
		name: "dot"
	});

	printSymbol(renderer, rightDotX, rightDotY, "dots.dot", {
		scalex: 1,
		scaley: 1,
		klass: "",
		name: "dot"
	});

}

function drawRepeat(renderer, x, y1, y2, isStart, offset) {
	const lineX = isStart ? x+2 : x-4
	const circleX = isStart ? x+9 : x-11

	renderer.paper.openGroup({klass:'abcjs-repeat'})
	printStem(renderer, lineX, 3 + renderer.lineThickness, y1, y2, null, "bar")

	printSymbol(renderer, circleX, -renderer.yToPitch(offset)-4, "dots.dot", {
		scalex: 1,
		scaley: 1,
		klass: "",
		name: "dot"
	});

	printSymbol(renderer, circleX, -renderer.yToPitch(offset)-8, "dots.dot", {
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
	left += 3
	let el
	for (let a = 0; a < annotations.length; a++) {
		switch (annotations[a]) {
			case 'segno':
			case 'coda':
			case "fermata": {
				left += 12
				el = printSymbol(renderer, left, -3, symbols[annotations[a]], {
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
				text(renderer, annotations[a], left, offset + 12, 12, annotationFont, null, null, false )
		}
	}

}

function drawMeasure(renderer, offset, leftMargin, colWidth, lineNum, barNum, chords, chordFont, margin, height, extraTop) {
	const left = leftMargin + colWidth * barNum
	if (!chords[1] && !chords[2] && !chords[3])
		drawSingleChord(renderer, left, offset+extraTop, colWidth-margin, height, chords[0], chordFont, extraTop)
	else if (!chords[1] && !chords[3])
		drawTwoChords(renderer, left, offset, colWidth-margin, height, chords[0], chords[2], chordFont, extraTop)
	else
		drawFourChords(renderer, left, offset, colWidth-margin, height, chords, chordFont, extraTop)
}

function renderChord(renderer, x, y, size, chord, font, maxWidth) {
	const el = text(renderer, chord, x, y, size, font, null, "abcjs-chord", true)
	let bb = el.getBBox()
	let fontSize = size
	while (bb.width > maxWidth && fontSize >= 14) {
		fontSize -= 2
		el.setAttribute('font-size', fontSize)
		bb = el.getBBox()
	}
}

const MAX_ONE_CHORD = 34
const MAX_TWO_CHORDS = 26
const MAX_FOUR_CHORDS = 20
const TOP_MARGIN = -3

function drawSingleChord(renderer, left, top, width, height, chord, font, extraTop) {
	if (chord === '%')
		drawPercent(renderer, left+width/2, top+height/2, extraTop+height/2)
	else
		renderChord(renderer, left+width/2, top+height/2+TOP_MARGIN, MAX_ONE_CHORD, chord, font, width)
}

function drawTwoChords(renderer, left, top, width, height, chord1, chord2, font, extraTop) {
	renderer.paper.lineToBack({x1: left, x2: left+width, y1: top+height+extraTop, y2: top+2 })
	renderChord(renderer, left+width/4, top+height/4+5+extraTop+TOP_MARGIN, MAX_TWO_CHORDS, chord1, font, width/2)
	renderChord(renderer, left+3*width/4, top+3*height/4+extraTop+TOP_MARGIN, MAX_TWO_CHORDS, chord2, font, width/2)
}

function drawFourChords(renderer, left, top, width, height, chords, font, extraTop) {
	const MARGIN = 3
	renderer.paper.lineToBack({x1: left+MARGIN, x2: left+width-MARGIN, y1: top+height/2+extraTop, y2: top+height/2+extraTop })
	renderer.paper.lineToBack({x1: left+width/2, x2: left+width/2, y1: top+MARGIN+extraTop, y2: top+height-MARGIN+extraTop })

	if (chords[0])
		renderChord(renderer, left+width/4, top+height/4+2+extraTop+TOP_MARGIN, MAX_FOUR_CHORDS, shortenChord(chords[0]), font, width / 2)
	if (chords[1])
		renderChord(renderer, left+3*width/4, top+height/4+2+extraTop+TOP_MARGIN, MAX_FOUR_CHORDS, shortenChord(chords[1]), font, width / 2)
	if (chords[2])
		renderChord(renderer, left+width/4, top+3*height/4+extraTop+TOP_MARGIN, MAX_FOUR_CHORDS, shortenChord(chords[2]), font, width / 2)
	if (chords[3])
		renderChord(renderer, left+3*width/4, top+3*height/4+extraTop+TOP_MARGIN, MAX_FOUR_CHORDS, shortenChord(chords[3]), font, width / 2)
}

function shortenChord(chord) {
	if (chord === "No Chord")
		return "N.C."
	return chord
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
