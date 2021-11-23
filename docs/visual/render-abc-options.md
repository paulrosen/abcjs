# RenderAbc options

The `renderAbc()` call has a third parameter that is a list of options. It is not required. Any option that is not recognized is silently ignored. For example:

```javascript
function callbackFn() {}
renderAbc("paper", abcString, { add_classes: true, clickListener: callbackFn });
```

## add_classes
Default: false
 
 If true, then each element that is drawn on the SVG will have an identifying class with it that you can use to style, move, or hide the element. See the section on classes for more details.
 
## afterParsing
Default: undefined

:::
::: warning Volatile
The contents of this is subject to change so if you use this function you will need to retest it whenever upgrading abcjs.
:::

Callback function. If this is present then it is called right after the ABC string is parsed and before the music has started to display or be set up for audio.

This is useful if there is an extension to the parsing that you want to add.

```javascript
function afterParsing(tune, tuneNumber, abcString)
```
- tune: 
The object that is passed to both the renderer and the audio creator. 

- tuneNumber: 
Zero-based number of the tune. Useful if the abcstring contains more than one tune.

- abcString: 
The original string that was passed in.
 
## clickListener
Default: null
 
Callback function. The signature of the function is: `function(abcelem, tuneNumber, classes, analysis, drag) {}`.
 
 This is called whenever the user clicks on a note or selects a series of notes. For more details, see the page on the click listener.

## dragColor
Default: same as selectionColor

This is the color of the elements currently being dragged.

## dragging

See the [dragging page](./dragging.md) for more information.

## foregroundColor
Default: currentColor

This sets the color of everything displayed. This can be overridden in CSS for particular elements. This color is applied to `fill` and `stroke` attributes.

## format
Default: undefined

An object of any of the visual formatting options that can be specified with the `%%option` syntax in an ABC string.

For instance:
```javascript
renderAbc("paper", "X:1\netc...", {
  format: {
    gchordfont: "Verdana 20",
    partsbox: true
  }
})
```

## hint_measures
Default: false
 
Repeat the next measure at the end of the previous line, with a unique css class. 

## initialClef

Default: false

Show clef only on the first line.

## jazzchords

Default: false

Format the chord symbols in a way that is sometimes found in fake books. The root of the chord (along with sharp or flat) is shown at the size that is specified. The rest of the chord is shown smaller and as a superscript. If there is a bass note, that is shown smaller and as a subscript.

For example, for the chord "F#m7b5/C#", `F#` is regular size, `m7b5` is smaller and a superscript, and `/C#` is smaller and a subscript.

## lineBreaks
Default: undefined

If you want to control exactly which measures are on each line, then you can pass this in. It is an array of numbers that represent the right-most measure number on a line (1-based). That is, if the first numbers passed are `[ 3, 5, ...` then the first line will have measures 1, 2, and 3 and the second line will have measures 4 and 5.

This parameter is primarily for the wrap mechanism to call internally, but it can be passed in if you have your own wrapping mechanism.

## minPadding
Default: 0
 
The number of pixels that are added to the left of each staff item. This is not added to the fixed items at the beginning of the line (that is, clef, time signature and key signature) but is added to all other elements on the line. If the line is overly crowded the notes can't get any closer than this.


## oneSvgPerLine
Default: false
 
 Should each system of staves be rendered to a different SVG? This makes controlling with CSS easier, and makes it possible to paginate cleanly.

## paddingbottom
Default: 30
 
 The spacing that the music should have on the web page. This is in pixels.

## paddingleft
Default: 15
 
 The spacing that the music should have on the web page. This is in pixels.

## paddingright
Default: 50
 
 The spacing that the music should have on the web page. This is in pixels. 

## paddingtop
Default: 15
 
 The spacing that the music should have on the web page. This is in pixels. 

## print
Default: false
 
Pay attention to margins and other formatting commands that don't make sense in a web page. This will display the header and footer, if specified, and try to lay out the music so that it can be printed cleanly.

## responsive
Default: undefined
 
 The strategy for responsiveness. The only option currently is `"resize"` which will make the svg take up whatever width is available for the container. For example:
 
 ```html
<div style="width: 400px">
  <div id="paper"></div>
</div>
```
```javascript
renderAbc("paper", abcString, { responsive: "resize" })
```

This will scale the music down to fit in 400px, no matter what the original size was.

If you leave the width off and let the containing div change width with the browser width, you can see the music change size to accommodate changes in the browser width.

Note: a different strategy is the `wrap` parameter which changes the number of measures on a line depending on space. See the wrap section for details.

## scale
Default: 1
 
 If the number passed is between zero and one, then the music is printed smaller, if above one, then it is printed bigger. 

## scrollHorizontal
Default: false
 
 Should there be a horizontal scrollbar if the music is wider than the viewport? (requires `viewportHorizontal` to be true.) 

## selectionColor
Default: "#ff0000"

This is the color of the note that the user has most recently clicked.

## selectTypes

See the [dragging page](./dragging.md) for more information.

## showDebug
Default: []

This is an array of the types of debug information. It can be:

### 'grid'

This prints out lines showing where various parts of the music are calculated.

### 'box'

This prints a shaded box for each element. If you see elements either too far apart or too close together this will give you an idea of what is causing it.

## staffwidth
Default: 740

This is the width in pixels of the layout. It won't change where things are laid out, it will just change the amount of spacing between elements.
 
## startingTune
Default: 0
 
 The index of the tune in the tunebook to render (starting at zero for the first tune). This is only relevant if the abc string that is passed in contains multiple tunes.

## textboxpadding
Default: 0.10
 
What percentage of the font size should the box that is drawn around the font be padded by? 

## tablatures
Default: undefined

Add a tablature-style staff below the standard music output. See [the tablature documentation](./tablature.md) for details.

## viewportHorizontal
Default: false
 
 Should the horizontal width be limited by the device's width? 

## viewportVertical
Default: false

## visualTranspose
Default: 0
 
 Transposes the written music by the number of half-steps passed. Use a negative number to transpose down in pitch. 

## wrap
Default: null
 
 ::: tip staffwidth
 NOTE: this requires the parameter `staffwidth` to be set! 
:::
 
 To have the parser ignore the line breaks, and figure out the line breaks based on the size of each measure. 
 
 This is an object of: 
 
 `preferredMeasuresPerLine`: How many measures per line if there is room. If there isn't room, then use the rest of the parameters. This is optional.  
 
 `minSpacing`: 1 means to pack the notes as close as possible, 2 means to double the spacing, etc..
 
 `maxSpacing`: if there is very little music and a wide line, then the line is shortened so the notes are not too spread out.
 
 `lastLineLimit`: if it works out that there is a single measure on the last line, then try a different layout.
 
 `minSpacingLimit` values until the last line is no more spread out than this limit. 
 
 A reasonable thing to set these values to is `{ minSpacing: 1.8, maxSpacing: 2.7, preferredMeasuresPerLine: 4 }`. 
 
