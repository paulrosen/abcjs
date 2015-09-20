# Version 2.2

* Fix drawing of tempo indicator.

# Version 2.1

* Fix startChar for chords.

* Fix placement of left annotation, that is: "< text"

* Updated compressor version (note: 2.4.8 has a bug and doesn't work, so using 2.4.7)

* Some improvements to decoration placement.

* Fix triplet not lining up properly in multiple voices bug.

* Fix note lengths when chords and broken rhythms interact.

* If a font appears in the header, then it becomes the default font.

* Add some debugging capability to the plugin. 	4313963

* Implement gchordfont; make the extra spacing respect the font height.

* Upgrade bundled version of jQuery to 1.11.3.
	
# Version 2.0

* Many bug fixes.

* Much work on vertical spacing of elements.

* Much refactoring of the codebase to make future maintenance easier.

* Beginning support of "print" mode, that lays out music in a way suitable for creating printable PDFs.

* Fixed animation jumping around when there is a whole rest or after a bar line.

* Fixed slurs not behaving across lines.

* Improved the handling of generating glyphs.

* Added support for setting a number of fonts.

* Added support for positioning of lyrics, dynamics, volume marks, ornaments, and guitar chords.

* Fixed grace note note lengths.

* Added a set of regression data for the engraver.

* Added note head choices for slash notation, harmonics, and indeterminate pitch.

* Fix vertical positioning of many elements.

* Fixed positioning of ties.

* Fixed beam height.

* Set padding for "print" version.

* Support of many formatting options.

* Expanded click target so that users can easily select note.

# Version 1.12

* Improved documentation.

* Accept `%%abc-*` meta commands.

# Version 1.11

## Features

* Added new entry points: ABCJS.startAnimation() and ABCJS.stopAnimation(), which allow for a bouncing ball-type cursor.

* Added getBeatLength() to the returned tune to get the length of a beat in measures.

* Return the tune object from renderABC() so it can be manipulated further by the caller.

* Put a copy of the engraver with the outputted tune, so that it can be manipulated later.

* Made highlighting notes more flexible: both the class name for the highlight and the note-head color can be specified or not used.

* Added descriptive classes to all SVG elements, including element type, line number, and measure number.

Bugs
---

* Fixed positioning of the highlighted characters in the editor when a line begins with a space.

* Fix the duration of whole rests to always be the length of a measure.

* Fixed bug in "unpausing" the editor's connection with the rendering.

* Move chord names above everything else on the line.

* Made more room for decorations, so they don't overlap.

* Center whole rests in the measure.

* Put accent on opposite side of the note stem.

Refactoring
---

* Moved Raphael out of the "write" folder; updated jQuery version.

* Split graphelements file into many different files.

* Changed the internal name of "printer" to "engraver" as a first step in refactoring.

* Updated the minify script to find all js files.

* Updated the minify script to change the version number in the readme automatically.

* Updated the minify script to support "a" and "b" in the version name for alpha and beta versions.

Examples
---

* Created versions of the minimized files with a name that includes "_latest", for easy reference.

* Updated the example files to always use the latest version.

* Fixed font displaying html file to note have the elements write on top of each other.

