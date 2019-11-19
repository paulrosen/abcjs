# abcjs Basic

The main entry point is `ABCJS.renderAbc`. Many users won't need to make any other call. That is enough to turn an arbitrary JavaScript string into an SVG image of sheet music.
 
| ABCJS Entry Points | Description |
| ------------- | ----------- |
| `integer = ABCJS.numberOfTunes(tunebookString)` | Returns the number of tunes found in the tunebook. |
| `tunebook = new ABCJS.TuneBook(tunebookString)` | Returns a `TuneBook` object, describing the tunebook passed in. |
| `tuneObjectArray = ABCJS.renderAbc(output, tunebookString, params)` | Completely renders the tunebook. |
| `tuneObjectArray = ABCJS.renderMidi(output, tunebookString, params)` | Completely creates midi for the tunebook. Note: this is deprecated in favor of [Synth Documentation](synth.md). |
| `tuneObjectArray = ABCJS.parseOnly(tunebookString, params)` | Parses all the tunes in the tunebookString and returns an array of them parsed structure. |
| `ABCJS.startAnimation(outputElement, tuneObject, animationParams)` | Puts an animated cursor on the rendered music. Note: this is deprecated in favor of `TimingCallbacks`. |
| `ABCJS.stopAnimation()` | Stops the animation that was started with `startAnimation`. |
| `ABCJS.pauseAnimation(pause)` | Pauses/resumes the animation that was started with `startAnimation`. Pass `true` or `false` to pause or resume. |
| `ABCJS.midi.deviceSupportsMidi()` | Returns true if the device and browser is capable of playing MIDI. |
| `ABCJS.midi.setSoundFont(url)` | Sets an alternate location for the soundfont. |
| `ABCJS.midi.startPlaying(targetEl)` | Starts playing the MIDI for the element passed in. If the element is already playing, this pauses it. |
| `ABCJS.midi.stopPlaying()` | Stops playing whatever is currently playing. |
| `ABCJS.midi.restartPlaying()` | Moves the progress back to the beginning for whatever is currently playing. |
| `ABCJS.midi.setRandomProgress(percent)` | Moves the progress to whatever percent is passed in for whatever is currently playing. |
| `ABCJS.midi.setLoop(targetEl, state)` | Sets the "loop" mode for the element passed in. State should be true or false. |
| `new abcjs.TimingCallbacks(outputElement, timingParams)` | returns an object with the properties `start()`, `stop()`, `pause()`, `reset()`, `setProgress(percent)`. This will cause callback functions to be called for each beat and for each note. (see timingParams for more details) |
| `abcjs.extractMeasures(tunebookString);` | This returns an array of all the individual measures found in the music. |
| `abcjs.synth` | This is for creating audio. See [Synth Documentation](synth.md) for details. |

| Parameters | Description |
| ------------- | ----------- |
| `tunebookString` | A plain text string in ABC syntax that corresponds to either a single ABC tune or a list of ABC tunes. |
| `output` | If this is a string, it is the ID of an element on the DOM. Or it could be the DOM element itself. Or it could be an array of strings or DOM elements. In the case of `renderMidi()`, when both MIDI types are created, they are both created in the same element. |
| `outputElement` | This is the DOM element that was originally passed in when the tune was rendered. |
| `tuneObject` | This is the object that is created by the rendering process. |
| `tuneObjectArray` | An array of `tuneObject`. |
| `params` | A hash of values. See below for the possible keys. |

| `params` (for parser) | Default | Description |
| ------------- | ----------- | ----------- |
|`visualTranspose` | 0 | Transposes the written music by the number of half-steps passed. Use a negative number to transpose down in pitch. |
| `print` | false | pay attention to margins and other formatting commands that don't make sense in a web page |
| `header_only` | false | only parse the header |
| `stop_on_warning` | false | only parse until the first warning is encountered |
| `hint_measures` | false | repeat the next measure at the end of the previous line, with a unique css class. |
| `wrap` | null | NOTE: this requires the parameter `staffwidth` to be set! To have the parser ignore the line breaks, and figure out the line breaks based on the size of each measure. This is an object of: `preferredMeasuresPerLine`: How many measures per line if there is room. If there isn't room, then use the rest of the parameters. This is optional.  `minSpacing`: 1 means to pack the notes as close as possible, 2 means to double the spacing, etc., `maxSpacing`: if there is very little music and a wide line, then the line is shortened so the notes are not too spread out, `lastLineLimit`: if it works out that there is a single measure on the last line, then try different `minSpacing` values until the last line is no more spread out than this limit. `targetHeight`: [Not yet implemented]. A reasonable default for these values is `{ minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: 4 }`. |

| `params` (for engraver) | Default | Description |
| ------------- | ----------- | ----------- |
| `scale` | 1 | If the number passed is between zero and one, then the music is printed smaller, if above one, then it is printed bigger. |
| `staffwidth` | 740 | The width of the music, in pixels. |
| `paddingtop` | 15 | The spacing that the music should have on the web page. |
| `paddingbottom` | 30 | The spacing that the music should have on the web page. |
| `paddingright` | 50 | The spacing that the music should have on the web page. |
| `paddingleft` | 15 | The spacing that the music should have on the web page. |
| `add_classes` | false | If true, then each element that is drawn on the SVG will have an identifying class with it that you can use to style, move, or hide the element. |
| `clickListener` | null | Callback function. The format is: `function(abcElem, tuneNumber, classes) {}` This is called whenever the user clicks on a note or selects a series of notes. |
| `responsive` | undefined | The strategy for responsiveness. `"resize"` will make the svg take up whatever width is available for the container. |

| `params` (for midi) | Default | Description |
| ------------- | ----------- | ----------- |
| `qpm` | 180 | Override the starting tempo in the abcString. |
| `program` | 0 | The midi program (aka "instrument") to use, if not specified in abcString. |
| `midiTranspose` | 0 | The number of half-steps to transpose the everything, if not specified in abcString. |
| `voicesOff` | false | Play the metronome and accompaniment; do the animation callbacks, but don't play any melody lines. |
| `chordsOff` | false | Ignore the chords and just play the melody (and metronome if that is on). |
| `generateDownload` | false | Whether to generate a download MIDI link. |
| `generateInline` | true | Whether to generate the inline MIDI controls. |
| `downloadClass` | "" | Add classes to the download controls. The classes `abcjs-download-midi` and `abcjs-midi-xxx` where `xxx` is the index of the tune are already added. This is appended to those classes. |
| `downloadLabel` | "download midi" | The text for the MIDI download. If it contains `%T` then that is replaced with the first title. If this is a function, then the result of that function is called. The function takes two parameters: the parsed tune and the zero-based index of the tune in the tunebook. |
| `preTextDownload` | "" | Text that appears right before the download link (can contain HTML markup). |
| `postTextDownload` | "" | Text that appears right after the download link (can contain HTML markup). |
| `preTextInline` | "" | Text that appears right before the MIDI controls (can contain HTML markup). If it contains `%T` then that is replaced with the first title. |
| `postTextInline` | "" | Text that appears right after the MIDI controls (can contain HTML markup). If it contains `%T` then that is replaced with the first title. |
| `midiListener` | null | Function that is called for each midi event. The parameters are the current abcjs element and the current MIDI event. |
| `animate` | null | Whether to do a "bouncing ball" effect on the visual music. `{ listener: callback, target: output of ABCJS.renderAbc, qpm: tempo }` This calls the listener whenever the current note has changed. It is called with both the last selected note and the newly selected note. The callback parameters are arrays of svg elements. |
| `context` | null | A string that is passed back to both the listener and animate callbacks. |
| `inlineControls` | { selectionToggle: false, loopToggle: false, standard: true, tempo: false, startPlaying: false } | These are the options for which buttons and functionality appear in the inline controls. This is a hash, and is defined below. |
| `drum` | "" | A string formatted like the `%%MIDI drum` specification. Using this parameter also implies `%%MIDI drumon` |
| `drumBars` | 1 |  How many bars to spread the drum pattern over. |
| `drumIntro` | 0 | How many bars of drum should precede the music. |

**Note on tempos:**

If the `qpm` parameter is not supplied, abcjs makes its best guess about what tempo should be used. If there is no tempo indicated at all in the ABC string, then 180 BPM is arbitrarily used.

If an exact tempo line is supplied with the `Q:` line, then that tempo is used. If the `Q:` contains a standard tempo string, that string is used to make a guess at an appropriate tempo. Here is a list of the known tempo strings and their associated tempos. If you would like to make suggestions about other strings to support or changes to these tempos, please get in touch:

|Tempo|BPM|
|---|---|
|larghissimo|20|
|adagissimo|24|
|sostenuto|28|
|grave|32|
|largo|40|
|lento|50|
|larghetto|60|
|adagio|68|
|adagietto|74|
|andante|80|
|andantino|88|
|marcia moderato|84|
|andante moderato|100|
|moderato|112|
|allegretto|116|
|allegro moderato|120|
|allegro|126|
|animato|132|
|agitato|140|
|veloce|148|
|mosso vivo|156|
|vivace|164|
|vivacissimo|172|
|allegrissimo|176|
|presto|184|
|prestissimo|210|

**Note on the drum parameter:**
See the ABC documentation for the correct way to format the string that is passed as the drum parameter. Here is a table that provides a fairly reasonable default for drum, drumIntro, and drumBars when used as a metronome:
```
  const drumBeats = {
    // the array is [0]=drum [1]=drumIntro
    "2/4": ["dd 76 77 60 30", 2],
    "3/4": ["ddd 76 77 77 60 30 30", 1],
    "4/4": ["dddd 76 77 77 77 60 30 30 30", 1],
    "5/4": ["ddddd 76 77 77 76 77 60 30 30 60 30", 1],
    "Cut Time": ["dd 76 77 60 30", 2],
    "6/8": ["dd 76 77 60 30", 2],
    "9/8": ["ddd 76 77 77 60 30 30", 1],
    "12/8": ["dddd 76 77 77 77 60 30 30 30", 1]
  };
```
A more complicated example that has the drum pattern fall over two measures of 2/4 time (This is a typical Bulgar pattern):
```
{ drum: "d2dd2ddz", drumBars: 2, drumIntro: 2 }
```

Note that the default soundfont that is used by abcjs contains sounds for pitches **27** through **87**. You can experiment with any of them for different effects.

| `inlineControls` | Default | Description |
| ------------- | ----------- | ----------- |
| `selectionToggle` | false | Show a latched push button to play only the current selection. **Not yet implemented** |
| `loopToggle` | false | Show a a latched push button to start playing again when the end is reached. |
| `standard` | true | Show the start, pause, reset, and progress controls. |
| `hide` | false | Whether to show the control at all. |
| `startPlaying` | false | Whether to start the MIDI as soon as it is available. (Not available in the Editor. Only available when calling `ABCJS.renderMidi` ) |
| `tempo` | false | Show the tempo change controls. This is a spinner that starts at 100%. There is an absolute tempo printed next to it.  **Not yet implemented** |
| `tooltipSelection` | "Click to toggle play selection/play all." | The text of the tooltip.  **Not yet implemented** |
| `tooltipLoop` | "Click to toggle play once/repeat." | The text of the tooltip. |
| `tooltipReset` | "Click to go to beginning." | The text of the tooltip. |
| `tooltipPlay` | "Click to play/pause." | The text of the tooltip. |
| `tooltipProgress` | "Click to change the playback position." | The text of the tooltip. |
| `tooltipTempo` | "Change the playback speed." | The text of the tooltip.  **Not yet implemented** |

| `renderParams` | Default | Description |
| ------------- | ----------- | ----------- |
| `startingTune` | 0 | The index of the tune in the tunebook to render (starting at zero for the first tune). |
| `viewportHorizontal` | false | Should the horizontal width be limited by the device's width? |
| `scrollHorizontal` | false | Should there be a horizontal scrollbar if the music is wider than the viewport? (requires viewportHorizontal to be true.) |
| `oneSvgPerLine` | false | Should each system of staves be rendered to a different SVG? This makes controlling with CSS easier, and makes it possible to paginate cleanly.

| `timingParams` | Default | Description |
| ------------- | ------- | ----------- |
| `qpm` | whatever is in the Q: field | Number of beats per minute. |
| `extraMeasuresAtBeginning` | 0 | Don't start the callbacks right away, but insert these number of measures first. |
| `beatCallback` | null | Called for each beat passing the beat number (starting at 0). |
| `eventCallback` | null | Called for each event (either a note, a rest, or a chord, and notes in separate voices are grouped together.) |
| `lineEndCallback` | null | Called at the end of each line. (This is useful if you want to be sure the music is scrolled into view at the right time.) See `lineEndAnticipation` for more details. |
| `lineEndAnticipation` | 0 | The number of milliseconds for the `lineEndCallback` to anticipate end of the line. That is, if you want to get the callback half a second before the end of the line, use 500. |
| `beatSubdivisions` | 1 | How many callbacks should happen for each beat. This allows finer control in the client, for instance, to handle a progress bar. |

| `animationParams` | Default | Description |
| ------------- | ----------- | ----------- |
| `hideFinishedMeasures` | false | true or false |
| `hideCurrentMeasure` | false | true or false |
| `showCursor` | false | true or false |
| `bpm` | whatever is in the Q: field | Number of beats per minute. |

NOTE: To use animation, you MUST have `{ add_classes: true }` in the `engraverParams`. Also, the cursor is not visible unless you add some css. Often this will be something like either `.cursor { background-color: #ffffc0; opacity: 0.5 }` or `.cursor { border-left: 1px solid black; }`

The following assumes you've created a `TuneBook` object like this: `var tunebook = ABCJS.TuneBook(tunebookString)`:

| `TuneBook` Object | Description |
| ------------- | ----------- |
| `tuneHash = tunebook.getTuneById(id)` | The `id` is the value in the tune's `X:` field. The returns the **first** occurrence of a tune with that ID. |
| `tuneHash = tunebook.getTuneByTitle(title)` | The `title` is the value in the tune's first `T:` field. The returns the **first** occurrence of a tune with that title.  |
| `tunebook.tunes` | Array of `tune` hash. |
| `tunebook.header` | Any ABC `%%directives` that appear at the top of the `tunebookString`, before the first tune. |

| `tuneHash` | description |
| ------------- | ----------- |
| `abc` |  String in ABC format. |
| `startPos` | Character position (zero-based) in the original tunebook where the tune starts. |

`tuneObject` contains a structure which is a machine-friendly version of the abc string that it was created from. It is the class `ABCJS.data.Tune` and is basically some meta-information and an array of each line in the tune. The format of that data is subject to change. 

| css classes (assuming the SVG element is `.paper`) | Description |
| `.paper path.abcjs-note_selected, .paper text.abcjs-note_selected` | The color that the selected note or other element is |

## classes

If you use, `{ add_classes: true }`, then the following classes are attached to various elements:

| class | description |
| ------------- | ----------- |
| abcjs-meta-top | Everything that is printed before the first staff line. |
| abcjs-title | The line specified by T: |
| abcjs-text | Extra text that is not part of the music. |
| abcjs-staff-extra | Clefs, key signatures, time signatures. |
| abcjs-tempo | The tempo marking. |
| abcjs-meta-bottom | Everything that is printed after all the music. |
| abcjs-staff  | The horizontal lines that make up the staff; ledger lines. |
| abcjs-l0, abcjs-l1, etc. | (lower case L, followed by a number) The staff line number, starting at zero. | 
| abcjs-m0, abcjs-m1, etc. | The measure count from the START OF THE LINE. |
| abcjs-n0, abcjs-n1, etc. | The note count from the START OF THE MEASURE. |
| abcjs-p-1, abcjs-p1, etc. | The y-position of the note (where middle-C is zero). |
| abcjs-d0-25, etc. | The duration of the note. (Replace the dash with a decimal point. That is, the example is a duration of 0.25, or a quarter note.) |
| abcjs-v0, abcjs-v1, etc. | the voice number, starting at zero. |
| abcjs-top-line | The top horizontal line of a staff. |
| abcjs-symbol | Any special symbol, like a trill. |
| abcjs-chord | The chord symbols, specified in quotes. |
| abcjs-note | Everything to do with a note. |
| abcjs-rest | Everything to do with a rest. |
| abcjs-decoration | Everything to do with the extra symbols, like crescendo. |
| abcjs-bar | The bar lines. |
| abcjs-slur | Slurs and ties. |
| abcjs-lyric | The lyric line. |
| abcjs-ending | The line and decoration for the 1st and 2nd ending. |
| abcjs-beam-elem | The beams connecting eighth notes together. |
| abcjs-top-line | This marks the top line of each staff. This is useful if you are trying to find where on the page the music has been drawn. |
| abcjs-top-of-system | This marks the top of each set of staves. This is useful if you are trying to find where on the page the music has been drawn. |

To get a visual idea of how these classes are applied, see https://configurator.abcjs.net/classes and experiment.

### changing colors

If you want to just change everything to one other color, you can do something like:
```
<style>
    svg {
        fill: pink;
        stroke: pink;
    }
<style>
```
If you want more control, you can use the classes. For instance, to turn only the horizontal staff lines pink, do this instead:
```
<style>
    svg .abcjs-staff {
        fill: pink;
        stroke: pink;
    }
<style>
```

# abcjs editor

Typical usage is:

	<script src="abcjs_editor_2.0-min.js" type="text/javascript"></script>
	<script type="text/javascript">
		window.onload = function() {
			abc_editor = new ABCJS.Editor("abc", { canvas_id: "canvas0", midi_id:"midi", warnings_id:"warnings" });
		}
	</script>

| Editor entry points | Description |
| ------------- | ----------- |
| `abc_editor = new ABCJS.Editor(editArea, editorParams)` | constructor of the editor object |
| `setReadOnly(bool)` |adds or removes the class abc_textarea_readonly, and adds or removes the attribute readonly=yes |
| `setDirtyStyle(bool)` | adds or removes the class abc_textarea_dirty |
| `renderTune(abc, parserParams, domElement)` | Immediately renders the tune. (Useful for creating the SVG output behind the scenes, if div is hidden) |
| `modelChanged()` | Called when the model has been changed to trigger re-rendering |
| `parseABC()` | Called internally by fireChanged() -- returns true if there has been a change since last call. |
| `updateSelection()` | Called when the user has changed the selection. This calls the engraver_controller to show the selection. |
| `fireSelectionChanged()` | Called by the textarea object when the user has changed the selection. |
| `paramChanged(engraverParams)` | Called to signal that the engraver params have changed, so re-rendering should occur. |
| `fireChanged()` | Called by the textarea object when the user has changed something. |
| `setNotDirty()` | Called by the client app to reset the dirty flag |
| `isDirty()` | Returns true or false, whether the textarea contains the same text that it started with. |
| `highlight(abcelem, tuneNumber, classes)` | Called by the engraver_controller to highlight an area. |
| `pause(bool)` | Stops the automatic rendering when the user is typing. |
| `pauseMidi(shouldPause)` | Stops the automatic re-rendering of the MIDI. |

| Edit parameters | Description |
| ------------- | ----------- |
| `editArea` | If it is a string, then it is an HTML id of a textarea control. Otherwise, it should be an instantiation of an object that expresses the `EditArea` interface. |
| `editorParams` | Hash of parameters for the editor. |

| editorParams | Description |
| ------------- | ----------- |
| `canvas_id` or `paper_id` | HTML id to draw in. If not present, then the drawing happens just below the editor. |
| `generate_midi` | if present, then midi is generated. |
| `midi_id` | if present, the HTML id to place the midi control. Otherwise it is placed in the same div as the paper. An encompassing `div` surrounds each control with the class in the format `"inline-midi midi-%d"`. |
| `midi_download_id` | if present, the HTML id to place the midi download link. Otherwise, if `midi_id` is present it is placed there, otherwise it is placed in the same div as the paper. An encompassing `div` surrounds each control with the class in the format `"download-midi midi-%d"`.|
| `generate_warnings` | if present, then parser warnings are displayed on the page. |
| `warnings_id` | if present, the HTML id to place the warnings. Otherwise they are placed in the same div as the paper. |
| `onchange` | if present, the callback function to call whenever there has been a change. |
| `gui` | if present, the paper can send changes back to the editor (presumably because the user changed something directly.) |
| `abcjsParams` | options to send to abcjs when re-rendering both the visual and the midi. |
| `indicate_changed` | the dirty flag is set if this is true. |

# abcjs plugin

The abcjs plugin renders all the abc in a page (determined as a new line beginning with X:).

To use, simply include the plugin version in the page:

```html
<script src="abcjs_plugin_5.10.3-min.js" type="text/javascript"></script>
```

Certain options for the plugin can be changed like this, if executed on page load, just after including the plugin file:

```html
<script type="text/javascript">
  ABCJS.plugin.hide_abc = true;
</script>
```

The options available in abc_plugin are:

| Option | Description |
| ------------- | ----------- |
| `show_midi` | NO LONGER SUPPORTED: This option has been removed. |
| `hide_abc` | Whether the abc text should be hidden or not. (false by default) since 1.0.2 |
| `render_before` | Whether the rendered score should appear before the abc text. (false by default) since 1.0.2 |
| `midi_options` | NO LONGER SUPPORTED: This option has been removed. |
| `auto_render_threshold` | Number of tunes beyond which auto rendering is disabled; instead, each tune is accompanied by a "show" button. (default value is 20) since 1.0.2 |
| `show_text` | Text to be included on the "show" button before the tune title. (default value is "show score for: ") since 1.0.2 |
| `render_options` | The options to be used for the `engraverParams` |
| `render_classname` | The class name to use for the resulting SVG (default value is "abcrendered") |
| `text_classname` | The class name to use for wrapping the found ABC text (default value is "abctext") |

When abcjs plugin finds an abc tune, it wraps a `div.abctext` around it and renders it into a `div.abcrendered`. The show button is an `a.abcshow`. These hooks can be used for styling. since 1.0.2


# abcjs greasemonkey script

Just include the greasemonkey script in either FireFox or Chrome. You will then get a button that will begin the scan of the website.
