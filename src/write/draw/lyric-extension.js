var printLine = require('./print-line');

// Draws the melisma / continuation lines requested by "_" in a w: field.
//
// The parser marks every note covered by a melisma with a lyric entry whose
// divider is "_" (the note carrying the syllable ends with "_", and each note
// it is held over gets an empty syllable with a "_" divider). Rather than
// printing a separate underscore glyph under each of those notes - which reads
// as a broken row of dashes - we join a run of covered notes into a single
// unbroken horizontal line beneath the lyric.
//
// Runs are computed per verse (a tune can have several w: lines) and are allowed
// to cross barlines, matching normal melisma behaviour.
function drawLyricExtensions(renderer, params, selectables) {
	var children = params.children;
	var verseCount = 0;
	for (var i = 0; i < children.length; i++) {
		var abcelem = children[i].abcelem;
		if (abcelem && abcelem.lyric && abcelem.lyric.length > verseCount)
			verseCount = abcelem.lyric.length;
	}

	for (var verse = 0; verse < verseCount; verse++)
		drawVerseExtensions(renderer, children, verse, selectables);
}

function lyricChild(abselem) {
	if (!abselem.children)
		return null;
	for (var i = 0; i < abselem.children.length; i++) {
		if (abselem.children[i].type === 'lyric')
			return abselem.children[i];
	}
	return null;
}

function drawVerseExtensions(renderer, children, verse, selectables) {
	var run = null; // { startX, endX, y, startChar, endChar }
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (child.type === 'bar')
			continue; // a melisma may be held across a barline
		if (child.type !== 'note') {
			run = flush(renderer, run, selectables);
			continue;
		}
		var ly = child.abcelem.lyric ? child.abcelem.lyric[verse] : undefined;
		if (!ly || ly.divider !== '_') {
			run = flush(renderer, run, selectables);
			continue;
		}
		var relElem = lyricChild(child);
		if (!relElem || relElem.pitch === undefined) {
			run = flush(renderer, run, selectables);
			continue;
		}
		var fontSize = relElem.dim && relElem.dim.font ? relElem.dim.font.size : 0;
		// The lyric is drawn with its baseline one font-size below relElem.pitch,
		// and each additional verse is offset by 1.2em (see svg.js). The extender
		// line sits on that baseline.
		var y = renderer.calcY(relElem.pitch) + fontSize + verse * 1.2 * fontSize;

		if (ly.syllable && ly.syllable.length > 0) {
			// This note carries the syllable that begins the melisma.
			run = flush(renderer, run, selectables);
			run = {
				startX: relElem.x + relElem.w / 2 + 2,
				endX: relElem.x,
				y: y,
				// The span of ABC source covered by this melisma, tracked so the
				// line can be matched back to its notes (see the data attributes below).
				startChar: child.abcelem.startChar,
				endChar: child.abcelem.endChar
			};
		} else if (run) {
			// A bare "_": extend the current line to cover this note.
			run.endX = relElem.x;
			run.y = y;
			if (child.abcelem.endChar !== undefined)
				run.endChar = child.abcelem.endChar;
		}
	}
	flush(renderer, run, selectables);
}

function flush(renderer, run, selectables) {
	if (run) {
		// If nothing was held over (a trailing "_" with no following note) draw a
		// short stub so the melisma is still visible.
		var endX = Math.max(run.endX, run.startX + 6);
		var klass = renderer.controller.classes.generate('lyric-extension');
		var el = printLine(renderer, run.startX, endX, run.y, klass, 'lyric-extension', 0.6);
		if (el) {
			// The line is drawn outside of any note's group, so it never appears in
			// a playback event's `elements`. To let callers highlight/animate it in
			// sync with playback, expose the ABC source range it covers. During a
			// TimingCallbacks eventCallback, a line covers the current note when
			// `event.startChar >= data-start-char && event.startChar < data-end-char`.
			if (run.startChar !== undefined && run.endChar !== undefined) {
				renderer.paper.setAttributeOnElement(el, {
					"data-start-char": run.startChar,
					"data-end-char": run.endChar
				});
			}
			selectables.wrapSvgEl({ el_type: "extension", startChar: run.startChar, endChar: run.endChar }, el);
		}
	}
	return null;
}

module.exports = drawLyricExtensions;
