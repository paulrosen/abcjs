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
    if (midiParams === undefined)
        midiParams = {};
    if (midiParams.generateInline === undefined) // default is to generate inline controls.
        midiParams.generateInline = true;
    if (midiParams.inlineControls)
        midiParams.inlineControls.selectionToggle = false; // Override the selection option because there is no selection in the Basic call.

    function callback(div, tune, index) {
        var html = "";
        var midiInst = midiCreate(tune, midiParams);
        if (midiParams.generateInline) {
            var inlineMidi = midiInst.inline ? midiInst.inline : midiInst;
            html += midi.generateMidiControls(tune, midiParams, inlineMidi, index);
        }
        if (midiParams.generateDownload) {
            var downloadMidi = midiInst.download ? midiInst.download : midiInst;
            html += midi.generateMidiDownloadLink(tune, midiParams, downloadMidi, index);
        }
        div.innerHTML = html;
        var find = function(element, cls) {
            var els = element.getElementsByClassName(cls);
            if (els.length === 0)
                return null;
            return els[0];
        };
        if (midiParams.generateInline && (midiParams.animate || midiParams.listener)) {
            var parent = find(div, "abcjs-inline-midi");
            parent.abcjsTune = tune;
            parent.abcjsListener = midiParams.listener;
            parent.abcjsQpm = midiParams.qpm;
            if (midiParams.animate) {
                var drumIntro = midiParams.drumIntro ? midiParams.drumIntro : 0;
                parent.abcjsAnimate = midiParams.animate.listener;
                parent.abcjsTune = midiParams.animate.target; // We need the version of the tune that was drawn: extra info is added during the drawing process.
                parent.abcjsTune.setTiming(midiParams.qpm, drumIntro);
            }
        }
        if (midiParams.generateInline && midiParams.inlineControls && midiParams.inlineControls.startPlaying) {
            var startButton = find(div, "abcjs-midi-start");
            midi.startPlaying(startButton);
        }

    }

    return tunebook.renderEngine(callback, output, abc, parserParams, renderParams);
};

module.exports = renderMidi;
