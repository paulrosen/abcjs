var tunebook = require('./abc_tunebook');
var Tune = require('../data/abc_tune');

var EngraverController = require('../write/engraver-controller');
var Parse = require('../parse/abc_parse');
var wrap = require('../parse/wrap_lines');


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

try {
    window.addEventListener("resize", resizeOuter);
    window.addEventListener("orientationChange", resizeOuter);
} catch(e) {
    // if we aren't in a browser, this code will crash, but it is not needed then either.
}

function renderOne(div, tune, params, tuneNumber, lineOffset) {
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
    engraver_controller.engraveABC(tune, tuneNumber, lineOffset);
    tune.engraver = engraver_controller;
    if (params.viewportVertical || params.viewportHorizontal) {
        // If we added a wrapper around the div, then we need to size the wrapper, too.
        var parent = div.parentNode;
        parent.style.width = div.style.width;
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
        if (params.warnings_id && params.tablature) {
            params.tablature.warning_id = params.warnings_id;
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
        var removeDiv = false;
        if (div === "*") {
            removeDiv = true;
            div = document.createElement("div");
            div.setAttribute("style", "visibility: hidden;");
            document.body.appendChild(div);
        }
        if (!removeDiv && params.wrap && params.staffwidth) {
            tune = doLineWrapping(div, tune, tuneNumber, abcString, params);
	        return tune;
        }
        if (params.afterParsing)
            params.afterParsing(tune, tuneNumber, abcString);
        renderOne(div, tune, params, tuneNumber, 0);
        if (removeDiv)
            div.parentNode.removeChild(div);
        return null;
    }

    return tunebook.renderEngine(callback, output, abc, params);
};

function doLineWrapping(div, tune, tuneNumber, abcString, params) {
	var engraver_controller = new EngraverController(div, params);
	var widths = engraver_controller.getMeasureWidths(tune);

	var ret = wrap.calcLineWraps(tune, widths, params);
	if (ret.reParse) {
        var abcParser = new Parse();
        abcParser.parse(abcString, ret.revisedParams);
        tune = abcParser.getTune();
        var warnings = abcParser.getWarnings();
        if (warnings)
            tune.warnings = warnings;
    }
    if (params.afterParsing)
        params.afterParsing(tune, tuneNumber, abcString);
    renderOne(div, tune, ret.revisedParams, tuneNumber, 0);
	tune.explanation = ret.explanation;
	return tune;
}

module.exports = renderAbc;
