var tunebook = require('./abc_tunebook');

var EngraverController = require('../write/abc_engraver_controller');
var Parse = require('../parse/abc_parse');

var resizeDivs = {};
function resizeOuter() {
    var width = window.innerWidth;
    for (var id in resizeDivs) {
        if (resizeDivs.hasOwnProperty(id)) {
            var outer = resizeDivs[id];
            var ofs = outer.offsetLeft;
            width -= ofs * 2;
            outer.style.width = width + "px";
        }
    }
}

window.addEventListener("resize", resizeOuter);
window.addEventListener("orientationChange", resizeOuter);

function renderOne(div, tune, params, tuneNumber) {
    var width = params.width ? params.width : 800;
    if (params.viewportHorizontal) {
        // Create an inner div that holds the music, so that the passed in div will be the viewport.
        div.innerHTML = '<div class="abcjs-inner"></div>';
        if (params.scrollHorizontal) {
            div.style.overflowX = "auto";
            div.style.overflowY = "hidden";
        } else
            div.style.overflow = "hidden";
        resizeDivs[div.id] = div; // We use a hash on the element's id so that multiple calls won't keep adding to the list.
        div = div.children[0]; // The music should be rendered in the inner div.
    }
    else if (params.viewportVertical) {
        // Create an inner div that holds the music, so that the passed in div will be the viewport.
        div.innerHTML = '<div class="abcjs-inner scroll-amount"></div>';
        div.style.overflowX = "hidden";
        div.style.overflowY = "auto";
        div = div.children[0]; // The music should be rendered in the inner div.
    }
    else
	    div.innerHTML = "";
    var engraver_controller = new EngraverController(div, params);
    engraver_controller.engraveABC(tune, tuneNumber);
    tune.engraver = engraver_controller;
    if (params.viewportVertical || params.viewportHorizontal) {
        // If we added a wrapper around the div, then we need to size the wrapper, too.
        var parent = div.parentNode;
        parent.style.width = div.style.width;
    }
}

function renderEachLineSeparately(div, tune, params, tuneNumber) {
    function initializeTuneLine(tune) {
        return {
            formatting: tune.formatting,
            media: tune.media,
            version: tune.version,
            metaText: {},
            lines: []
        };
    }

    // Before rendering, chop up the returned tune into an array where each element is a line.
    // The first element of the array gets the title and other items that go on top, the last element
    // of the array gets the extra text that goes on bottom. Each element gets any non-music info that comes before it.
    var tunes = [];
    var tuneLine;
    for (var i = 0; i < tune.lines.length; i++) {
        var line = tune.lines[i];
        if (!tuneLine)
            tuneLine = initializeTuneLine(tune);

        if (i === 0) {
            // These items go on top of the music
            tuneLine.metaText.tempo = tune.metaText.tempo;
            tuneLine.metaText.title = tune.metaText.title;
            tuneLine.metaText.header = tune.metaText.header;
            tuneLine.metaText.rhythm = tune.metaText.rhythm;
            tuneLine.metaText.origin = tune.metaText.origin;
            tuneLine.metaText.composer = tune.metaText.composer;
            tuneLine.metaText.author = tune.metaText.author;
            tuneLine.metaText.partOrder = tune.metaText.partOrder;
        }

        // push the lines until we get to a music line
        tuneLine.lines.push(line);
        if (line.staff) {
            tunes.push(tuneLine);
            tuneLine = undefined;
        }
    }
    // Add any extra stuff to the last line.
    if (tuneLine) {
        var lastLine = tunes[tunes.length-1];
        for (var j = 0; j < tuneLine.lines.length; j++)
            lastLine.lines.push(tuneLine.lines[j]);
    }

    // These items go below the music
    tuneLine = tunes[tunes.length-1];
    tuneLine.metaText.unalignedWords = tune.metaText.unalignedWords;
    tuneLine.metaText.book = tune.metaText.book;
    tuneLine.metaText.source = tune.metaText.source;
    tuneLine.metaText.discography = tune.metaText.discography;
    tuneLine.metaText.notes = tune.metaText.notes;
    tuneLine.metaText.transcription = tune.metaText.transcription;
    tuneLine.metaText.history = tune.metaText.history;
    tuneLine.metaText['abc-copyright'] = tune.metaText['abc-copyright'];
    tuneLine.metaText['abc-creator'] = tune.metaText['abc-creator'];
    tuneLine.metaText['abc-edited-by'] = tune.metaText['abc-edited-by'];
    tuneLine.metaText.footer = tune.metaText.footer;

    // Now create sub-divs and render each line. Need to copy the params to change the padding for the interior slices.
    var ep = {};
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            ep[key] = params[key];
        }
    }
    var origPaddingTop = ep.paddingtop;
    var origPaddingBottom = ep.paddingbottom;
    div.innerHTML = "";
    for (var k = 0; k < tunes.length; k++) {
        var lineEl = document.createElement("div");
        div.appendChild(lineEl);

        if (k === 0) {
	        ep.paddingtop = origPaddingTop;
	        ep.paddingbottom = -20;
        } else if (k === tunes.length-1) {
	        ep.paddingtop = 10;
	        ep.paddingbottom = origPaddingBottom;
        } else {
	        ep.paddingtop = 10;
	        ep.paddingbottom = -20;
        }
        renderOne(lineEl, tunes[k], ep, tuneNumber);
    }
}

// A quick way to render a tune from javascript when interactivity is not required.
// This is used when a javascript routine has some abc text that it wants to render
// in a div or collection of divs. One tune or many can be rendered.
//
// parameters:
//      output: an array of divs that the individual tunes are rendered to.
//          If the number of tunes exceeds the number of divs in the array, then
//          only the first tunes are rendered. If the number of divs exceeds the number
//          of tunes, then the unused divs are cleared. The divs can be passed as either
//          elements or strings of ids. If ids are passed, then the div MUST exist already.
//          (if a single element is passed, then it is an implied array of length one.)
//          (if a null is passed for an element, or the element doesn't exist, then that tune is skipped.)
//      abc: text representing a tune or an entire tune book in ABC notation.
//      renderParams: hash of:
//          startingTune: an index, starting at zero, representing which tune to start rendering at.
//              (If this element is not present, then rendering starts at zero.)
//          width: 800 by default. The width in pixels of the output paper
var renderAbc = function(output, abc, parserParams, engraverParams, renderParams) {
    // Note: all parameters have been condensed into the first ones. It doesn't hurt anything to allow the old format, so just copy them here.
    var params = {};
    var key;
    if (parserParams) {
        for (key in parserParams) {
            if (parserParams.hasOwnProperty(key)) {
                params[key] = parserParams[key];
            }
        }
    }
    if (engraverParams) {
        for (key in engraverParams) {
            if (engraverParams.hasOwnProperty(key)) {
	            // There is a conflict with the name of the parameter "listener". If it is in the second parameter, then it is for click.
	            if (key === "listener") {
	            	if (engraverParams[key].highlight)
		                params.clickListener = engraverParams[key].highlight;
	            } else
                    params[key] = engraverParams[key];
            }
        }
    }
    if (renderParams) {
        for (key in renderParams) {
            if (renderParams.hasOwnProperty(key)) {
                params[key] = renderParams[key];
            }
        }
    }

    function callback(div, tune, tuneNumber, abcString) {
        if (params.wrap && params.staffwidth) {
	        tune = doLineWrapping(div, tune, tuneNumber, abcString, params);
	        return tune;
        }
        else if (!params.oneSvgPerLine || tune.lines.length < 2)
            renderOne(div, tune, params, tuneNumber);
        else
            renderEachLineSeparately(div, tune, params, tuneNumber);
        return null;
    }

    return tunebook.renderEngine(callback, output, abc, params);
};

function calcLineBreaks(widths, lineBreakPoint) {
	var lineBreaks = [];
	var totalThisLine = 0;
	// run through each measure and see if the accumulation is less than the ideal.
	// if it passes the ideal, then see whether the last or this one is closer to the ideal.
	for (var i = 0; i < widths.length; i++) {
		var width = widths[i];
		var attemptedWidth = totalThisLine + width;
		if (attemptedWidth < lineBreakPoint)
			totalThisLine = attemptedWidth;
		else {
			// This just passed the ideal, so see whether the previous or the current number of measures is closer.
			var oldDistance = lineBreakPoint - totalThisLine;
			var newDistance = attemptedWidth - lineBreakPoint;
			if (oldDistance < newDistance && totalThisLine > 0) {
				lineBreaks.push(i - 1);
				totalThisLine = width;
			} else {
				lineBreaks.push(i);
				totalThisLine = 0;
			}
		}
	}
	return { lineBreaks: lineBreaks, totalThisLine: totalThisLine };
}

function doLineWrapping(div, tune, tuneNumber, abcString, params) {
	var engraver_controller = new EngraverController(div, params);
	var widths = engraver_controller.getMeasureWidths(tune);
    // For calculating how much can go on the line, it depends on the width of the line. It is a convenience to just divide it here
    // by the minimum spacing instead of multiplying the min spacing later.
    // The scaling works differently: this is done by changing the scaling of the outer SVG, so the scaling needs to be compensated
    // for here, because the actual width will be different from the calculated numbers.
	var scale = params.scale ? Math.max(params.scale, 0.1) : 1;
	var minSpacing = params.wrap.minSpacing ? Math.max(parseFloat(params.wrap.minSpacing), 1) : 1;
	var onlyLineLimit = params.wrap.onlyLineLimit ? Math.max(parseFloat(params.wrap.onlyLineLimit), 1) : 5;
	var lastLineLimit = params.wrap.lastLineLimit ? Math.max(parseFloat(params.wrap.lastLineLimit), 1) : 5;
	var lineBreakPoint = (params.staffwidth - widths.left) / minSpacing / scale;
	var minLineSize = (params.staffwidth - widths.left) / onlyLineLimit / scale;
	var minLastLineSize = (params.staffwidth - widths.left) / lastLineLimit / scale;

	var ret = calcLineBreaks(widths.measureWidths, lineBreakPoint);

    var staffWidth = params.staffwidth;
    if (ret.lineBreaks.length === 0) {
		// Everything fits on one line, so see if there is TOO much space and the staff width needs to be shortened.
	    if (minLineSize > 0 && ret.totalThisLine > 0 && ret.totalThisLine < minLineSize)
		    staffWidth = staffWidth / (minLineSize / ret.totalThisLine);
    } else if (ret.totalThisLine < minLastLineSize) {
    	// the last line is too short, so attempt to redistribute by changing the min.
	    // We will try more and less space alternatively. The space can't be less than 1.0, and we'll try in 0.1 increments.
	    var minTrys = [];
	    if (minSpacing > 1.1)
	    	minTrys.push(minSpacing - 0.1);
	    minTrys.push(minSpacing + 0.1);
	    if (minSpacing > 1.2)
	    	minTrys.push(minSpacing - 0.2);
	    minTrys.push(minSpacing + 0.2);
	    if (minSpacing > 1.3)
	    	minTrys.push(minSpacing - 0.3);
	    minTrys.push(minSpacing + 0.3);
	    for (var i = 0; i < minTrys.length && ret.totalThisLine < minLastLineSize; i++) {
		    lineBreakPoint = (params.staffwidth - widths.left) / minTrys[i] / scale;
		    ret = calcLineBreaks(widths.measureWidths, lineBreakPoint);
	    }
    }

	var abcParser = new Parse();
	var revisedParams = {
	    lineBreaks: ret.lineBreaks,
		staffwidth: staffWidth
    };
	for (var key in params) {
		if (params.hasOwnProperty(key) && key !== 'wrap' && key !== 'staffwidth') {
			revisedParams[key] = params[key];
		}
	}

	abcParser.parse(abcString, revisedParams);
	tune = abcParser.getTune();
	renderOne(div, tune, revisedParams, tuneNumber);
	return tune;
}

module.exports = renderAbc;
