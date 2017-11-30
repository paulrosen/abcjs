# Version 3.2.1

## Bug fixes:
* Don't crash if window.performance is not defined.
* Don't move the position of the rest unless there are more than one voice on a staff.

# Version 3.2.0

## Features:
* Implement overlay from the ABC standard.

## Bug fixes:
* Update the license notice in the source code to match the MIT notice.
* Fix some npm dependencies.
* When clicking on MIDI control, have the buttons be non-submitting.
* Fixed missing pauseAnimation function.
* Fix the height of the SVG when doing the responsive=resize option.
* Measure number classes should not be placed on the staff lines or the brace.
* When animating midi, make qpm parameter optional.
* When animating an editor-type engraving, don't pass in the tune object: the editor already has it.

# Version 3.1.4

## Feature:
* Added new parameter "responsive=resize" to do responsive SVG.

# Version 3.1.3

## Features:
* Rearrange the code so that an npm module is created.
* Provide access to warning messages as objects.

## Bug fixes:
* Fix crash in generating midi when the meter isn't expressly defined.
* Don't throw an error if the midi control has been removed from the DOM by the time the midi stops playing.
* Don't require Raphael to be visible to a client creating an EngraverController.
* Fix problem with title not showing when using the plugin.

# Version 3.1.2

## Bug fixes:
* L: 1 (whole note) should be accepted as note length
* Do not change the default note length when meter is change inline
* If no meter is specified, free meter is assumed
* If a default note length is set by a meter, it shouldn't be changed another inline meter
* Fix crash on inline V:
* Fix overlapping of low annotations.
* Fix spacing after voice label.
* Make ties a little more rounded.
* Some minor adjustment to drawing ties.

## Features:
* Add an option to hide the current measure on animation.

# Version 3.1.1

## Bug fixes:

* Change slur direction if there is a tie on the first or last note.
* Adjust placement of slash on a note stem; make sure the stem is long enough.
* Work on placement of triplets.
* Make tie shallower than slur.

# Version 3.1.0

## Bug fixes:
* Fix midi beat length; some improvements to the midi animation.
* Write ledger lines for grace notes.
* Fix crash in parsing.
* qpm was being passed in twice for midi animation.
* When doing the call back in the midi animation, pass the absolute coordinates of the item that is current.
* Handle case where there is an intro drum beat, but it ends at the first note.
* Handle common and cut time when doing midi drum beats.
* Fix midi transposition.
* Fix bug in midi animation when starting and stopping the midi.
* Fix bug in finding the written notes when animating the midi output.
* Handle creating midi for grace note that appears at the beginning of a part that is not the first part.
* Fix bug introduced in creating midi for gracenote.
* Fix when the metronome track starts, and fix the tempo of it when the meter is not 4/4
* Allow passed in tempo to override the defined tempo.
* Fix crash when creating midi for multipart music where the first note has a grace.
* Make midi control's css more stable when combined with other css.
* Fix bug in displaying note values in tempo field.
* Fix crash when there are bar numbers on multi-line music. 

## Features:
* Add "pause/resume" to the standard animation.
* Report when there is a new beat in the midi listener.
* Added drum intro to the MIDI, using a new midiParameter.
* Add midi option "voicesOff" to mute the midi output, while leaving the metronome, guitar chords, and the animation.
* Implement animation callback when playing MIDI.
* Completely change the parsing of %%MIDI parameters; support the "%%MIDI drum" parameters; allow setting midi instrument and channel.
* Allow three digit version numbers.

## Warning:
* Turn off instrument/channel selection in midi until it is debugged.

# Version 3.0

## Bug fixes:
* Fix crash when encountering Cbm or other theoretical-only keys.
* Fix crash when there is no start or end point for a dynamic mark.
* Don't crash in Firefox if text is written to an element that is not currently visible (Raphael reports NaN for the size.)
* Don't crash if the music was removed before animation is done.
* Fix centering text using %%center.
* Allow blank %%text lines.
* Misspelled botmargin.
* Fix bugs in measure numbering: put number over the bar line.
* Fix placement and style of the measure numbers.
* Fix crash when there is a key change after a subtitle line in the header.
* Make the + sign of the meter not lay right on the staff line.
* Fix note length bugs in the tempo marker.

## Features:
* Added viewPortHorizontal and scrollHorizontal to the renderParams.
* Add class "slur" to slurs and ties.
* Add "hint measure"
* Allow scrolling in the animation.
* Handle %%titlecaps directive.
* Add curly brace to indicate piano part (with inspiration from Anthony P. Pancerella).
* Add invisible marker to the top of each system so that it can be found easily.
* Add an option to put each line in a separate svg so that browsers will paginate correctly.

## MIDI:
* First pass at using a new inline MIDI generator.
* Make the default MIDI instrument "0" instead of "2" 
* Implement some MIDI controls: play, pause, reset, tempo, progress bar, BPM, clock, pre- and post-text 

# Version 3.0 Beta

## MIDI:

* Update documentation for using MIDI.

* Update creating a release to package the MIDI.

* Integrate midi.js and remove the old MIDI attempts.

* Create MIDI output for both download and playing through midi.js.

* Create the html for an interactive audio control and implement standard functionality.

* Make the default midi instrument "0" instead of "2"

* Don't crash if a chord containing a slash doesn't contain a bass note.

* Fix playing second repeat; allow strings as parameters.

## Bug fixes:

* Fix crash when encountering Cbm or other theoretical-only keys.

* Report the tune number on clicking the absolute element

* Fix crash when there is no start or end point for a dynamic mark.

* Clarify how to use the animation() functionality.

* Added viewPortHorizontal and scrollHorizontal to the renderParams
	
# Version 2.3

* Completely refactor the midi processing: now supports chords and grace notes and embeds the tune's title.

* Remove the automatic generation of the QuickTime element.

* Fix crash when a triplet with a 0 duration is created. That is: (3B0BB

* Fix having a spacer 'y' between two notes that are tied.

* Fix starting first line with [P:A] 

# Version 2.2

* Fix drawing of tempo indicator.

* Add voice number to the css classes.

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

