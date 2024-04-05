# RenderAbc options

The `renderAbc()` call has a third parameter that is a list of options. It is not required. Any option that is not recognized is silently ignored. For example:

```javascript
function callbackFn() {}
renderAbc("paper", abcString, { add_classes: true, clickListener: callbackFn });
```

## accentAbove
Default: false
 
If true, then the accent mark (`!>!`) always goes above the note instead of being attached to the note head.
 
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
 
## ariaLabel
Default: "Sheet Music" if no T: or "Sheet Music for %T"
This is the text that is put in the `<title>` attribute of the svg.

## clickListener
Default: null
 
Callback function. The signature of the function is: `function(abcelem, tuneNumber, classes, analysis, drag) {}`.
 
 This is called whenever the user clicks on a note or selects a series of notes. For more details, see the page on the click listener.

## dragColor
Default: same as selectionColor

This is the color of the elements currently being dragged.

## dragging

See the [dragging page](./dragging.md) for more information.

## expandToWidest
Default: false

If you have a line of music that contains too many notes to fit in the `staffwidth`, then abcjs will do the best that it can and make that line as long as it needs to be. However, that will create a jagged edge on the right side because that line will push out farther than the others. To avoid that, you could set `%%staffwidth 900` or whatever it takes, but then you would need to experiment to figure out the widest point. Instead, set this parameter and abcjs will find the widest then re-layout the other lines to that size.

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

## lineThickness

Default: 0

The amount to *increase* the line thickness - this is for the staff lines, the bar lines, the ledger lines, and the note stems. With some scaling, on some devices, and with some color schemes, the lines can appear thin so this is a way to tweak them.

A value of `0.3` is a nice place to start if you are experimenting with this.

## germanAlphabet

Default: false

Display chords using German music alphabet. (`H` for English `B` and `B` for English `Bb`.) Several European countries have this music alphabet.

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

## stafftopmargin
Default: 0

This adds extra space to the top of each staff system. This is different from the directive `systemsep` because the latter specifies a minimum amount of space. This directive adds the specified space no matter what other space is used.

## staffwidth
Default: 740

This is the width in pixels of the layout. It won't change where things are laid out, it will just change the amount of spacing between elements.
 
## startingTune
Default: 0

The index of the tune in the tunebook to render (starting at zero for the first tune). This is only relevant if the abc string that is passed in contains multiple tunes.

## textboxpadding
Default: 0.10
 
What percentage of the font size should the box that is drawn around the font be padded by? 


## timeBasedLayout
Default: undefined

`{ minPadding?: number, minWidth?: number, align?: 'left' | 'center'}`

This changes the horizontal spacing to be completely time-based. Normally, music is printed so that a whole note doesn't take up four times the space of a quarter note because that would create a lot of blank space. However, for some uses - for instance showing the music along with a timeline - that is desired.

To achieve this, first the line is scanned for the item that will take up the most space. For instance, if there is a sharp on a sixteenth note, that will take up more space than an eighth note. That is the minimum spacing that will be used.

The scale can be specified in two ways. If `minPadding` is passed in, then that is added to the minimum spacing. For instance, lets say that the largest item is a sixteenth note that is 15px wide. And `minPadding: 5`. Then all sixteenth notes will be 20px wide. All eighth notes will be 40px wide, etc.

If `minWidth` is set, then if the resultant size of the line is shorter than the specified width, extra space is added evenly to use up the space.

Either of those methods can be used by themselves. They also work together. For instance, if you pass in a width that is the width of the browser, then the music will take up the entire window. But if the width calculated by minPadding is larger than that, it will be used instead and there will be a horizontal scroll bar.

The notes can be placed either in the center of the area reserved or on the left side. If they are placed on the left side, they are offset by minPadding/2.

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
 
::: tip Tip
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
 
