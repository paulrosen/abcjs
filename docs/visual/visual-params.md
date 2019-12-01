# Visual Params

::: tip TODO
This page is currently being enhanced. Check back soon!
:::

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


| `renderParams` | Default | Description |
| ------------- | ----------- | ----------- |
| `startingTune` | 0 | The index of the tune in the tunebook to render (starting at zero for the first tune). |
| `viewportHorizontal` | false | Should the horizontal width be limited by the device's width? |
| `scrollHorizontal` | false | Should there be a horizontal scrollbar if the music is wider than the viewport? (requires viewportHorizontal to be true.) |
| `oneSvgPerLine` | false | Should each system of staves be rendered to a different SVG? This makes controlling with CSS easier, and makes it possible to paginate cleanly.


`tuneObject` contains a structure which is a machine-friendly version of the abc string that it was created from. It is the class `ABCJS.data.Tune` and is basically some meta-information and an array of each line in the tune. The format of that data is subject to change. 
