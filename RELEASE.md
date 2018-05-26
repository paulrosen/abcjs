# Version 5.1.2

## Bug fixes:

Fix horizontal spacing calculation for multiline text.

# Version 5.1.1

## Bug fixes:

Fix regression for having the SVG responsive.

# Version 5.1.0

## Bug fixes:

* Fix bug with spacing triplets when the stem direction is not explicitly set.

* Fix problem with sizing the music div when zooming.

* Fix crash when clicking on the time signature.

* Fix bug in beat detection in midi listener.

## Features

* Add entry point for parseOnly().

* Expose midi.setRandomProgress().

* Expose midi.setLoop().

* Expose midi.restartPlay().

# Version 5.0.1

## Bug fixes:

* Comply with the Chrome change to not play audio unless the AudioContext is resumed inside a user interaction.

# Version 5.0.0

## Bug fixes:

* Don't crash animation when there are invisible rests.

* Don't crash when illegal value for scale is passed in.

* Change guitar chord flat and sharp to the right symbols in a few more cases.

* Begin to support mensural time signatures.

## Features

* Remove dependency on Raphael.

# Version 4.1.1

## Bug fixes:

* Fix double transposition of the key signature when transposition is specified in the parameters.

# Version 4.1.0

## Bug fixes:

* When the perc clef is defined in the voice, add the midimap translation to the pitches (this was already being done when perc is in the key sig.)

* Get lines with lots of notes to align properly.

* Do more edge cases with triplets; fix some triplet bugs.

* Double bar lines were messing up the place for the repeat to return to.

* MIDI animation now follows tempo changes.

* Don't get off on the midi animation when encountering a spacer type rest.

* Be sure the div to be written to is empty before engraving.

* When midi is redrawn, stop playing the old midi.

* After calling midi's stopPlaying, reset the inline midi control.

* Fix midi animation when there are no explicit 1st & 2nd ending marks.

* Add fix for getting the Font Awesome 5 icons to show up in audio control; some cosmetic tweaks to large version on audio control.

* Fix click listener in Editor mode.

## Features:

* Allow "style=" parameter on V: line.

* Add a spinner to the audio play button when the soundfonts are loading.

* Allow rhythm slashes to be placed on rests.

* Add feature to transpose a single voice, using "V: ... score=_B"

* Add public function: midi.deviceSupportsMidi()

* Add all the fonts to the directives that can be specified in the renderAbc call.

# Version 4.0.1

## Bug fixes:

* Respect repeats in animation.

* Fix crash when using metronome intro in minified version.

# Version 4.0.0

## Breaking Changes:

* Don't generate classes unless requested. (This is a bug fix, but client code might mistakenly been relying on that behavior.)

* Add "abcjs-" as a prefix to all class names that are generated.

* Change the metronome track to use the Channel 10 sounds.

## Features:

* Simplify the options used to call `renderAbc` and `renderMidi`.

* Add clearer names for `clickListener`, `midiListener`, `midiTranspose`, and `visualTranspose`.

* Implement "partsBox"

* Add a few missing text encodings.

* Handle "%%MIDI transpose" syntax.

* Add a larger version of the audio control.

## Bug fixes:

* Remove a few deprecated options that were broken anyway.

* Move first and second ending lines down a little.

* Put a little more spacing around text that has a box around it.

* Remove some ES6 syntax that snuck in.

* Ignore %%scale formatting command if responsive=resize.

* Remove some debug messages.

* Fix bug with setting only one voice to percussion voice. 

# Version 3.3.4

## Bug fixes:

* Fix build error causing percussion soundfont to be missing.

* Fix lining up multline lyrics when there is a syllable missing on the first line.

## Features:

* Add "rest" class to all rest objects.

* Add multi-measure rests.

# Version 3.3.3

## Bug fixes:

* Fix parsing when "V:" is inline.

* Allow stafflines on the V: line.

* Add "perc" to clefs recognized by V:

* Fix the parsing of the "middle" parameter.

* Fix centering of lyrics.

* Fix midi animation when repeating over more than one line.

* Take pickup notes into consideration for the lead in metronome beats.

## Features:

* Add transpose parameter for engraving.

* Implement "MIDI drummap". 

* Use percussion channel whenever the clef=perc.

* Change default soundfont location to paulrosen github.

* Add percussion channel to the soundfont.

* Change to percussion track when "channel 10" is specified.

* New parameter for download midi link: "downloadClass".

* Pass the startChar and endChar to the MIDI animate callback.

# Version 3.3.2

## Bug fixes:

* Fix the tuneNumber in the listener callback.

* Fix the listener callback with separate SVG for each line.

* Preload all the instruments needed; don't assume the default "piano".

* Allow calling startPlaying() with the target being the parent control.

* Expose the startPlaying and stopPlaying methods.

* Change the midi git line to use https.

* When unpausing the MIDI, immediately redraw the MIDI.

* If a tempo is described as a string, don't let it be undefined in the MIDI tempo control.

* Protect against writing "undefined" in class names.

* Add setSoundFont() entry point.

* Validate the startingTune parameter.

* Add protection in case animation pause is called at an unexpected time.

* Fix midi formatting issues caused by box-sizing change.

## Features:

* Translate some common tempo strings to BPM.

* Do basic accessibility for SVG.

* Add pitch and duration to the classes that notes are tagged with.

* Add note number in a measure to the classes that notes are tagged with.

* Add the element's classes to the listener callback.

# Version 3.3.1

## Bug fixes:

* Modify main index.js to avoid using ES6 (is not transpiling, and some testing platforms can fail)

* Expose the soundfontUrl variable.

# Version 3.3.0

## Bug fixes:

* Only put the first/second ending marker on the top staff of a system.

* Fix crash when voice is incomplete.

* Fix position of the clock on the midi controls; make midi controls aware of box-sizing.

* Only play chords once if there is more than one staff.

* Fix JS math rounding error when figuring out the timing of the notes for MIDI animation.

* Add tied notes to the objects that will get returned during MIDI animation.

* Don't let the MIDI duration be a negative number on really short notes.

* Sequence the repeats correctly when doing MIDI animation.

* Don't put MIDI.js in debug mode.

* Remove dependency on midi for the editor version

* Fix declaration of "galactic".

* Add polyfill for Object.remove() for IE

* Fix creating downloadable midi

* Fix bug where there couldn't be two different note heads on a stem.

* When splitting a line with barsperline, propagate certain control items on the next line.

* Fix some midi control visual conflicts with box-sizing.

* Fix the playback tempo for non-4/4 meters.

* Support a couple more rhythm patterns with generated chords; fix a couple errors in generated chords.

* Fix problem with ending a beam when a chord is the last element.

## Features:

* Add support for "instrument" in midi playback; restrict usage of channel to be one per track.

* Make metronome track use the next free channel.

* Pick a free channel for the chords.

* Add "context" as a parameter to the MIDI controls so that multiple MIDI on a page can be kept separate.

* Set the default soundfont location to the CDN.

* Add a signature/version to the exports so that the client can detect it.

* Add the midi listener for the editor.

## Infrastructure:

* Moved source code into a subfolder.

* Moved examples into a subfolder.

* Moved font generation into a subfolder.

* Moved documentation into a subfolder.

* Removed many no longer used build files.

* Remove "editor" as a separate build.

* Just have three maintained minimized builds: abcjs_basic, abcjs_midi, and abcjs_plugin.

* Create separate entry point for "test" which is only useful for those working on abcjs.

* Create separate npm entry points for "basic" and "midi".

* Switch to webpack for creating static versions of libs.

* Don't need a plugin version under npm - that's just for standalone.

* Remove dependency on midi for the standalone version.

* Remove unneeded public entry points.

* Add old minified versions that were previously missed. 

## Documentation

* Clarified config of "drum" track in midi.

* Updated copyrights

* Create a "contributing" doc page.

* Lots of readme file clean up.

* Create an example that demonstrates formatting for printing.

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

