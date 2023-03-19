# Architecture of the engraver

The engraver code is handled here. This accepts the output of the parser and does three things:

* Creates an SVG
* Adds data to the parser input
* Makes the visual elements interactive

## Steps

There are separate passes and sub-passes to the processing. The separate passes match the subfolder organization here.

They are:

### Element Creation

The structure passed in from the parser is traversed and all elements are created. An element consists of two parts:

* The Absolute Element: a visual piece of music that is always moved together. For instance, in the key signature of D, the absolute element is an object that contains two sharp symbols. The absolute element has an X- and Y- position in the SVG, and an array of Relative Elements.

* Relative Element: These are always attached to an absolute element. They have a relative position to the absolute element and consist of all the glyphs needed. For instance, a dotted eighth note of Bb that is trilled is an absolute element that contains an array of relative elements consisting of a trill, a flat sign, a filled note head, a stem, a flag, and a dot.

Each of these elements is a separate object, created with `new` and placed in the structure passed in from the parser.

### Layout

After all the elements are created the size of all of them are known, so the layout process begins. There are separate layout algorithms for the horizontal and the vertical positioning. 

### Drawing

After the layout is finished, it is a rote process to draw the music. All decisions have been made. The structure is then traversed and each element is created in the SVG.
