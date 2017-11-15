# abcjs Basic

The main entry point is `ABCJS.renderAbc`. Many users won't need to make any other call. That is enough to turn an arbitrary JavaScript string into an SVG image of sheet music.
 
| ABCJS Entry Points | Description |
| ------------- | ----------- |
| `integer = ABCJS.numberOfTunes(tunebookString)` | Returns the number of tunes found in the tunebook. |
| `tunebook = new ABCJS.TuneBook(tunebookString)` | Returns a `TuneBook` object, describing the tunebook passed in. |
| `tuneObjectArray = ABCJS.renderAbc(output, tunebookString, parserParams, engraverParams, renderParams)` | Completely renders the tunebook. |
| `tuneObjectArray = ABCJS.renderMidi(output, tunebookString, parserParams, midiParams, renderParams)` | Completely creates midi for the tunebook. |
| `ABCJS.startAnimation(outputElement, tuneObject, animationParams)` | Puts an animated cursor on the rendered music.  |
| `ABCJS.stopAnimation()` | Stops the animation that was started with `startAnimation`. |
| `ABCJS.pauseAnimation(pause)` | Pauses/resumes the animation that was started with `startAnimation`. Pass `true` or `false` to pause or resume. |

| Parameters | Description |
| ------------- | ----------- |
| `tunebookString` | A plain text string in ABC syntax that corresponds to either a single ABC tune or a list of ABC tunes. |
| `output` | If this is a string, it is the ID of an element on the DOM. Or it could be the DOM element itself. Or it could be an array of strings or DOM elements. In the case of `renderMidi()`, when both MIDI types are created, they are both created in the same element. |
| `outputElement` | This is the DOM element that was originally passed in when the tune was rendered. |
| `tuneObject` | This is the object that is created by the rendering process. |
| `tuneObjectArray` | An array of `tuneObject`. |
| All items ending in `Params` | A hash of values. See below for the possible keys. |

| `parserParams` | Default | Description |
| ------------- | ----------- | ----------- |
| `print` | false | pay attention to margins and other formatting commands that don't make sense in a web page |
| `header_only` | false | only parse the header |
| `stop_on_warning` | false | only parse until the first warning is encountered |
| `hint_measures` | false | repeat the next measure at the end of the previous line, with a unique css class. |

| `engraverParams` | Default | Description |
| ------------- | ----------- | ----------- |
| `scale` | 1 | If the number passed is between zero and one, then the music is printed smaller, if above one, then it is printed bigger. |
| `staffwidth` | 740 | The width of the music, in pixels. |
| `paddingtop` | 15 | The spacing that the music should have on the web page. |
| `paddingbottom` | 30 | The spacing that the music should have on the web page. |
| `paddingright` | 50 | The spacing that the music should have on the web page. |
| `paddingleft` | 15 | The spacing that the music should have on the web page. |
| `editable` | false | If true, then when a note is clicked, it is highlighted and a callback allows the editor to move the cursor. |
| `add_classes` | false | If true, then each element that is drawn on the SVG will have an identifying class with it that you can use to style, move, or hide the element. |
| `listener` | null | This is an object containing up to two functions. The format is: `{ highlight: function(abcElem) {}, modelChanged: function(abcElem) {} }` The highlight function is called whenever the user clicks on a note or selects a series of notes. The modelChanged function is called whenever the user has changed the music visually. |
| `responsive` | undefined | The strategy for responsiveness. `"resize"` will make the svg take up whatever width is available for the container.

| `midiParams` | Default | Description |
| ------------- | ----------- | ----------- |
| `qpm` | 180 | The tempo, if not specified in abcString. |
| `program` | 0 | The midi program to use, if not specified in abcString. |
| `channel` | 0 | The midi channel to use, if not specified in abcString. |
| `transpose` | 0 | The number of half-steps to transpose the everything, if not specified in abcString. |
| `generateDownload` | false | Whether to generate a download MIDI link. |
| `generateInline` | true | Whether to generate the inline MIDI controls. |
| `downloadLabel` | "download midi" | The text for the MIDI download. If it contains `%T` then that is replaced with the first title. If this is a function, then the result of that function is called. The function takes two parameters: the parsed tune and the zero-based index of the tune in the tunebook. |
| `preTextDownload` | "" | Text that appears right before the download link (can contain HTML markup). |
| `postTextDownload` | "" | Text that appears right after the download link (can contain HTML markup). |
| `preTextInline` | "" | Text that appears right before the MIDI controls (can contain HTML markup). If it contains `%T` then that is replaced with the first title. |
| `postTextInline` | "" | Text that appears right after the MIDI controls (can contain HTML markup). If it contains `%T` then that is replaced with the first title. |
| `listener` | null | Function that is called for each midi event. The parameters are the current abcjs element and the current MIDI event. |
| `animate` | null | Whether to do a "bouncing ball" effect on the visual music. `{ listener: callback, target: output of ABCJS.renderAbc, qpm: tempo }` This calls the listener whenever the current note has changed. It is called with both the last selected note and the newly selected note. The callback parameters are arrays of svg elements. |
| `inlineControls` | { selectionToggle: false, loopToggle: false, standard: true, tempo: false, startPlaying: false } | These are the options for which buttons and functionality appear in the inline controls. This is a hash, and is defined below. |
| `drum` | "" | A string formatted like the `%%MIDI drum` specification. Using this parameter also implies `%%MIDI drumon` |
| `drumBars` | 1 |  How many bars to spread the drum pattern over. |
| `drumIntro` | 0 | How many bars of drum should precede the music. |

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

| `animationParams` | Default | Description |
| ------------- | ----------- | ----------- |
| hideFinishedMeasures | false | true or false |
| hideCurrentMeasure | false | true or false |
| showCursor | false | true or false |
| bpm | whatever is in the Q: field | number of beats per minute. |

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
| `.paper path.note_selected, .paper text.note_selected` | The color that the selected note or other element is |

## classes

If you use, `{ add_classes: true }`, then the following classes are attached to various elements:

| class | description |
| ------------- | ----------- |
| meta-top | Everything that is printed before the first staff line. |
| title | The line specified by T: |
| text | Extra text that is not part of the music. |
| staff-extra | Clefs, key signatures, time signatures. |
| tempo | The tempo marking. |
| meta-bottom | Everything that is printed after all the music. |
| staff  | The horizontal lines that make up the staff; ledger lines. |
| l1, l2, etc. | (lower case L, followed by a number) The staff line number, starting at one. | 
| m1, m2, etc. | The measure count from the START OF THE LINE. |
| top-line | The top horizontal line of a staff. |
| symbol | Any special symbol, like a trill. |
| chord | The chord symbols, specified in quotes. |
| note | Everything to do with a note. |
| bar | The bar lines. |
| slur | Slurs and ties. |
| abc-lyric | The lyric line. |


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
| `highlight(abcelem)` | Called by the engraver_controller to highlight an area. |
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
| `parser_options` | options to send to the parser engine. |
| `midi_options` | options to send to the midi engine. |
| `render_options` | options to send to the render engine. |
| `indicate_changed` | the dirty flag is set if this is true. |

# abcjs plugin

The abcjs plugin renders all the abc in a page (determined as a new line beginning with X:).

To use, simply include the plugin version in the page:

```html
<script src="abcjs_plugin_latest-min.js" type="text/javascript"></script>
```

Certain options for the plugin can be changed like this, if executed on page load, just after including the plugin file:

```html
<script type="text/javascript">
  ABCJS.plugin.show_midi = false;
</script>
```

The options available in abc_plugin are:

| Option | Description |
| ------------- | ----------- |
| `show_midi` | NO LONGER SUPPORTED: This options has been removed. |
| `hide_abc` | Whether the abc text should be hidden or not. (false by default) since 1.0.2 |
| `render_before` | Whether the rendered score should appear before the abc text. (false by default) since 1.0.2 |
| `midi_options` | NO LONGER SUPPORTED: This options has been removed. |
| `auto_render_threshold` | Number of tunes beyond which auto rendering is disabled; instead, each tune is accompanied by a "show" button. (default value is 20) since 1.0.2 |
| `show_text` | Text to be included on the "show" button before the tune title. (default value is "show score for: ") since 1.0.2 |
| `render_options` | The options to be used for the `engraverParams` |
| `render_classname` | The class name to use for the resulting SVG (default value is "abcrendered") |
| `text_classname` | The class name to use for wrapping the found ABC text (default value is "abctext") |

When abcjs plugin finds an abc tune, it wraps a `div.abctext` around it and renders it into a `div.abcrendered`. The show button is an `a.abcshow`. These hooks can be used for styling. since 1.0.2


# abcjs greasemonkey script

Just include the greasemonkey script in either FireFox or Chrome. You will then get a button that will begin the scan of the website.
