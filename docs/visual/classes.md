# Classes

::: tip TODO
This page is currently being enhanced. Check back soon!
:::

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
