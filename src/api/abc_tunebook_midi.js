var tunebook = require('./abc_tunebook');

var midi = require('../midi/abc_midi_controls');
var midiCreate = require('../midi/abc_midi_create');

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
var renderMidi = function(output, abc, parserParams, midiParams, renderParams) {
	var params = {};
	var key;
	if (parserParams) {
		for (key in parserParams) {
			if (parserParams.hasOwnProperty(key)) {
				params[key] = parserParams[key];
			}
		}
	}
	if (midiParams) {
		for (key in midiParams) {
			if (midiParams.hasOwnProperty(key)) {
				// There is a conflict with the name of the parameters "listener" and "transpose". If it comes in the second parameter, then it is for midi.
				if (key === "listener")
					params.midiListener =  midiParams[key];
				else if (key === 'transpose')
					params.midiTranspose = midiParams[key];
				else
					params[key] = midiParams[key];
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
    if (params.generateInline === undefined) // default is to generate inline controls.
	    params.generateInline = true;
    if (params.inlineControls)
	    params.inlineControls.selectionToggle = false; // Override the selection option because there is no selection in the Basic call.

    function callback(div, tune, index, abcString) {
        var html = "";
        var midiInst = midiCreate(tune, params);
        if (params.generateInline) {
            var inlineMidi = midiInst.inline ? midiInst.inline : midiInst;
            var stopOld = div.innerHTML.indexOf("abcjs-midi-current") >= 0;
            html += midi.generateMidiControls(tune, params, inlineMidi, index, stopOld);
        }
        if (params.generateDownload) {
            var downloadMidi = midiInst.download ? midiInst.download : midiInst;
            html += midi.generateMidiDownloadLink(tune, params, downloadMidi, index);
        }
        div.innerHTML = html;
        if (params.generateInline)
	        midi.attachListeners(div);
        var find = function(element, cls) {
            var els = element.getElementsByClassName(cls);
            if (els.length === 0)
                return null;
            return els[0];
        };
        if (params.generateInline && (params.animate || params.midiListener)) {
            var parent = find(div, "abcjs-inline-midi");
            parent.abcjsTune = tune;
            parent.abcjsListener = params.midiListener;
            parent.abcjsQpm = params.qpm;
            parent.abcjsContext = params.context;
            if (params.animate) {
                var drumIntro = params.drumIntro ? params.drumIntro : 0;
                parent.abcjsAnimate = params.animate.listener;
                parent.abcjsTune = params.animate.target; // We need the version of the tune that was drawn: extra info is added during the drawing process.
                parent.abcjsTune.setTiming(params.qpm, drumIntro);
            }
        }
        if (params.generateInline && params.inlineControls && params.inlineControls.startPlaying) {
            var startButton = find(div, "abcjs-midi-start");
            midi.startPlaying(startButton);
        }

    }

    return tunebook.renderEngine(callback, output, abc, params);
};

module.exports = renderMidi;
