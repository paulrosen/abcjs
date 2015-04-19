**NOTE: We're working on better documentation of the API. Here's a start, and there will be more coming soon!**

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

| Parameters | Description |
| ------------- | ----------- |
| `tunebookString` | A plain text string in ABC syntax that corresponds to either a single ABC tune or a list of ABC tunes. |
| `output` | If this is a string, it is the ID of an element on the DOM. Or it could be the DOM element itself. Or it could be an array of strings or DOM elements. |
| `outputElement` | This is the DOM element that was originally passed in when the tune was rendered. |
| `tuneObject` | This is the object that is created by the rendering process. |
| `tuneObjectArray` | An array of `tuneObject`. |
| All items ending in `Params` | A hash of values. See below for the possible keys. |

| `parserParams` | Default | Description |
| ------------- | ----------- | ----------- |
| `print` | false | pay attention to margins and other formatting commands that don't make sense in a web page |
| `header_only` | false |only parse the header |
| `stop_on_warning` | false | only parse until the first warning is encountered |

| `engraverParams` | Default | Description |
| ------------- | ----------- | ----------- |
| `scale` | 1 | If the number passed is between zero and one, then the music is printed smaller, if above one, then it is printed bigger. |
| `staffwidth` | 740 | The width of the music, in pixels. |
| `paddingtop` | 15 | The spacing that the music should have on the webpage. |
| `paddingbottom` | 30 | The spacing that the music should have on the webpage. |
| `paddingright` | 50 | The spacing that the music should have on the webpage. |
| `paddingleft` | 15 | The spacing that the music should have on the webpage. |
| `editable` | false | If true, then when a note is clicked, it is highlighted and a callback allows the editor to move the cursor. |
| `add_classes` | false | If true, then each element that is drawn on the SVG will have an identifying class with it that you can use to style, move, or hide the element. |
| `listener` | null | This is an object containing up to two functions. The format is: `{ highlight: function(abcElem) {}, modelChanged: function(abcElem) {} }` The highlight function is called whenever the user clicks on a note or selects a series of notes. The modelChanged function is called whenever the user has changed the music visually. |

| `midiParams` | Default | Description |
| ------------- | ----------- | ----------- |
| `qpm` | 180 | The tempo, if not specified in abcString. |
| `program` | 2 | The midi program to use, if not specified in abcString. |

| `renderParams` | Default | Description |
| ------------- | ----------- | ----------- |
| `startingTune` | 0 | The index of the tune in the tunebook to render (starting at zero for the first tune). |

| `animationParams` | Default | Description |
| ------------- | ----------- | ----------- |
| hideFinishedMeasures | false | true or false |
| showCursor | false | true or false |
| bpm | whatever is in the Q: field | number of beats per minute. |


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
| `canvas_id or paper_id` | HTML id to draw in. If not present, then the drawing happens just below the editor. |
| `generate_midi` | if present, then midi is generated. |
| `midi_id` | if present, the HTML id to place the midi control. Otherwise it is placed in the same div as the paper. |
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
| `show_midi` | Whether midi should be rendered or not. (true by default) |
| `hide_abc` | Whether the abc text should be hidden or not. (false by default) since 1.0.2 |
| `render_before` | Whether the rendered score should appear before the abc text. (false by default) since 1.0.2 |
| `midi_options` | A hash of options to pass to the midi creator. (see MidiOptions) since 1.0.2 |
| `auto_render_threshold` | Number of tunes beyond which auto rendering is disabled; instead, each tune is accompanied by a "show" button. (default value is 20) since 1.0.2 |
| `show_text` | Text to be included on the "show" button before the tune title. (default value is "show score for: ") since 1.0.2 |
| `render_options` | The options to be used for the `engraverParams` |
| `render_classname` | The class name to use for the resulting SVG (default value is "abcrendered") |
| `text_classname` | The class name to use for wrapping the found ABC text (default value is "abctext") |

When abcjs plugin finds an abc tune, it wraps a `div.abctext` around it and renders it into a `div.abcrendered`. The show button is an `a.abcshow`. These hooks can be used for styling. since 1.0.2


# abcjs greasemonkey script

Just include the greasemonkey script in either FireFox or Chrome. You will then get a button that will begin the scan of the website.
