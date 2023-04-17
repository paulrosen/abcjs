# Version 6.2.2

## Features

* Make "mandolin" and "fiddle" synonyms for "violin" in tablature.

## Bugs

* Don't draw staff line for tabs twice if there are two voices on it.

* make the staff line the correct width in Firefox.

* Fix bug in Firefox that causes staff lines, bar lines, and stems to be missing.

* Fix bug in Firefox that cuts off the last line of the SVG.
# Version 6.2.1

## Bugs

* don't crash if "capo" is passed in to tablature as a string

* fix possible crash if setTiming is called before engraving

* Fix bug in Firefox 112 that causes lines to be missing.

* Add more debug messages when creating synth

* Fix type of prime return

* Protect against crash when selecting an element if the element selected is somehow outside of the music svg.

# Version 6.2.0

## Features

* implement %%MIDI bassprog, bassvol, chordprog, chordvol

* Add support for `[r: ... ]` remark

* add support for %%voicecolor

* add germanAlphabet option: display chords using German music alphabet

* add lineThickness option: allow tweaking of the size of the lines

* add a public access to the audio buffer through CreateSynth.getAudioBuffer() so that it can be processed outside of abcjs

## Bugs

* fix placement of ties when they extend to a new line

* fix crash with tablature and showDebug are used at the same time.

* fix bug in getting the location of the beat from TimingCallbacks when there are prep beats.

* Change D.C. and D.S. decorations to be right aligned

* fix metronome with changing meter

* don't indent unaligned words

* fix handling of accidentals in tablature

## Documentation

* Improved the typescript types somewhat.

## Refactoring

* Changed the names and moved a number of files in the engraver in anticipation of further refactoring.

* Did some simplification in tablatures.

# Version 6.1.9

## Features

* Add decorations for !D.C.alcoda!, !D.C.alfine!, !D.S.alcoda! and !D.S.alfine!

## Bugs

* keep transposing from crashing when K:none.

* mark the touch events as passive to prevent jank.

* fix crash when the M: line is missing and drum intro is used.

* fix midi output when using percussion voice.

## Documentation

* Improved the typescript types somewhat.

* Upgrade VuePress.

* Fix link for new synth in the docs.

# Version 6.1.8

## Features

* Implement 'octave' modifier for K: and V: fields.

## Bugs

* Handle accidentals in a measure in tablature.

* Fix accidental handling in tablature when there is a key signature.

* Add a little padding when tablature doesn't have a label.

* Fix the css styles applied to tablature.

* Allow percmap to use higher octave pitches.

* Fix cursor movement when playing synth and tablature is visible.

## Documentation

* Add example of getting lyrics out of a tune.

# Version 6.1.7

## Bugs

* don't draw measure numbers before the beginning of the line.

* guard against crash on touch selection

## Testing

* open the browser and run the test-server in parallel

* add a minimal server for serving test pages
## Documentation

* Add example of getting lyrics out of a tune

# Version 6.1.6

## Bugs

* Fix error when selecting notes

# Version 6.1.5

## Bugs

* Fix error when selecting notes

# Version 6.1.4

## Bugs

* Fix error when selecting notes

# Version 6.1.3

## Bugs

* fix placement of tablature staff when there is extra space used above the staff.

* Fix regression crash when using 'y' spacer

# Version 6.1.2

## Bugs

* fix combining oneSvgPerLine with responsive: "resize"

* fix drawing audio controls when the outer stylesheet changes the button's lineHeight
# Version 6.1.1

## Bugs

* rewrite oneSvgPerLine; fixes selection and keeping multiline items (like slurs) correctly.

## Features

* added mobile browser TouchEvent support for dragging

## Documentation

* fixed some typescript definitions

# Version 6.1.0

## Bugs

* Fix some bugs in startChar; endChar

## Features

* Add transposing feature

## Documentation

* Document transposing feature
* Clarify the way testing works
* Add tablature tests to "all"

# Version 6.0.4

## Bugs

* Fix position of staccato when a note is beamed and its stem is backwards.
* Write annotations above bar lines.
* fix placement of rhythm indicator (the R: field) on treble clef when there is nothing else above the staff.
* fix some broken tests; add test for staccato bug and rhythm word placement.
* fixed some Typescript warnings and errors

## Features

* Recognize backslash to escape lyrics.
* Add glissando
* pass back the start and end char positions with the audio callbacks.

## Documentation

* Add example of adding note names to a tune automatically.
* Add a mention for the VSCode extension.
* Add tune book example.

# Version 6.0.3

## Bugs

* Fix unhandled rejection if there is a problem with an input note when creating notes.

* put the height of ties/slurs in the line height calculation

* Measurements that used "px" were reporting a warning.

* Fix bass note in jazz chord when it contains a sharp or flat

## Features

* Quotation mark in a chord can be escaped.

## Documentation

* Add example of reusing created synth buffers.

* Fix example in docs on creating a drum rhythm

# Version 6.0.2

## Bugs

* Fix paper size so that the bottom of a narrow staff is not cut off.

* Fix example generator for synth

* Fix tablature parameter name and tuning examples

* Fix tablature default tuning for guitar (move A down octave)

# Version 6.0.1

## Bugs

* Make the printable example long enough to be on two pages.

* Fix paper size so that the bottom of a narrow staff is not cut off.

* Add a little padding to stems so they aren't cut off.

# Version 6.0.0

## Bugs

* Fix the bar number display when wrapping.

* Don't add extra padding when creating minimal music (like one note)

* Fix selection data for unaligned words

* Pass back actual selectable element when one of its children is clicked.

* Don't put extra classes and data- attributes on compound symbols (like "12/8")

* Fix spacing for triplet number

* Don't add extra space at the bottom if there is no bottom text.

* Allow aria-label to not be set.

* Fix adding class names to dynamics and some other elements.

* Fix regression where the left line of multi-staff music was misplaced if the bottom line is for percussion.

* gracenotes now are processed through %%percmap

# Version 6.0.0-beta.39

## Bugs

* Add some info to the return of the prime() method

* Fix iOS not playing because audioContext doesn't stay running

# Version 6.0.0-beta.38

## Bugs

* Regression: Fix return of CreateSynth.init

* Don't do audio on tablature lines.

* Wait until all notes are loaded before continuing to build audio buffer. (Caused the beginning of the buffer to possibly be arpeggiated if there is a race condition.)

* Don't crash when there is a blank staff on the second line.

* The pan option now works if the actual number of tracks doesn't match the panned tracks.

* Don't add chord track if it is empty.

## Documentation

* Get more detailed with the typescript declarations

# Version 6.0.0-beta.37

* Keep the correct line count when generating one svg per line. (Fixes analysis of the tune for playback and timing)

## Features

* Change the default soundfont to the improved Fluid one; add the anticipations on the abcjs soundfont.

# Version 6.0.0-beta.36

## Bugs

* Fix some typescript definitions.

* When stopping synth, return the position that it stopped at.

* Implement a fix for race conditions during note loading

* Don't call debugger when setting an annotation on an invisible note.

* Put try/catch in editor when creating music so there isn't an unhandled exception if there is an abcjs bug.

* Don't crash when creating audio and there is a suppressed blank line

* When suppressing blank lines, consider a line with only chords as not blank.

* Don't add too much spacing on chord symbols when placing them.

* Don't lose element's scrolling position when rendering music.

* Fix crash when creating timing array and there is a suppressed line because it is empty.

* Allow soundFontVolumeMultiplier to be set to zero.

## Features

* Add string tablature

* Implement %%jazzchord directive

## Documentation

* Add example page using multiple synths with program switcher

* Add jazzchords to example generator

# Version 6.0.0-beta.35

## Bugs

* Fix regression on creating oneSvgPerLine
   
* Fix notes that are one step apart from colliding.
   
* Fix crash on bad notelength
   
* Fix note durations in triplets where p != r
   
* Don't crash if a browser doesn't contain AudioContext
   
* Don't swallow warning after wrapping.
   
* Fix some regressions with placing and styling text.
   
* Fix font on relatively positioned annotations.
   
* Protect the editor from crashing when synth is attempted and the browser doesn't support AudioContext.

## Features

* Create parameter `jazzchords`

* Add many types to the typescript definitions.

* Add `units` to TimingCallback.start

* Add staccato to midi creation.

* Add classes to dynamics elements.

* Add more info to the click handler

* Limit the size of the warning message if there is a long string.

* Add initialClef option
 
* Keep and pass back current time from the timer callbacks.

## Documentation

* Fix path for favicon in docs
   
* Tweak to printing example
   
* Move examples to github pages.
   
* Add MIDI download example.
   
* Fixes to doc building from the vuepress upgrade.
   
* Add mention of a CDN to load library from.
   
* Add a couple of errors to analysis demo to show the warning data.
   
* Option to only render the clef on the first line. 

# Version 6.0.0-beta.33

## Bugs

* Fix crash when there is a missing close bracket on an inline command.

* Fix the startChar position of chords

* Fix overriding the tempo.

* Fix passing qpm in.

* Fix stem direction bug on wrap.

* Fix bug in calculating the endpoint of the audio when there are multiple voices.

## Features

* Add getBarLength() and getTotalTime() to the tune object; 

* Add second parameter to seek() for the units percent, seconds, and beats.

* Add `detuneOctave` parameter

## Documentation

* Example of controlling the tempo.

## Build

* Remove bin folder

# Version 6.0.0-beta.32

## Bugs

* Some fixes to startChar and endChar when there are line continuations

* Error messages now report the absolute line in the file that the error occurs, not the offset from the first music line.

* Fix bug where multiple text lines would duplicate text.

* `a b !+!c` removing the end `!` from the `!+!` will cause the decoration to bleed to the first element in the line.

* Fix audio control buttons on Safari

* Make creating audio more efficient. (was creating buffer twice as long as needed.)

* Fix click-a-note-to-play-it to handle microtones.

* Get rid of audio warning when key changes.

* Fix Safari not making sound when first using playEvent.

* Fix crash when wrapping when using oneSvgPerLine.

## Features

* Change the pitch change variable from "warp" to "cents".

* support microtones in midi output.

## Refactoring

* Improvements to the handling of line continuations

* Remove some midi.js remnants

* Refactoring of the parser

## Build

* update dependencies and fix webpack for v5

## Documentation

* Add microtone demo.

* update docs to vuepress2

# Version 6.0.0-beta.31

## Bugs

* Fix crash when no key signature is passed in.

* Octave clefs were double transposing.

* Made the audio control more robust in dark mode and when the page's css defines basic buttons.

## Features

* Support audio for quarter sharp and quarter flat.

* Allow getMidiFile to accept a tune object as well as a string.

## Build

* Remove more of the midi.js code

* Deliver the /dist folder for npm.

* Add entry points for testing.

* Start of parser refactoring

# Version 6.0.0-beta.30

## Bugs

* Fix npm deployment.

# Version 6.0.0-beta.29

## Bugs

* Fix stem direction on overlay voices.

## Features

* Add support for invisible multi-measure rest "X"

* enhance typescript types

## Build

* Remove build of midi version
    
* Simplify the webpack config

* Remove references to "master"

# Version 6.0.0-beta.28

## Bugs

* Fix some problems with the visual synth control getting out of sync with the music.

* Fix stem direction on overlay voices.

* Don't print accidentals on percussion staves.

* Keep dragging notes from jumping around when the svg is scaled (on Chrome & Safari)

* Fix placement of multi-measure rest.

* Fix crash when using the parser twice instead of creating a new one.

* Fix bug in drawing slurs over the end of a line when there is more than one staff.

* Fix bug in counting measures in the element classes.

## Features

* Support dark mode.

* Add support for `%%percmap`, allowing specifying a shape for each sound.
  
* Implement the audio for `%%percmap`.

* Add "triangle" as a note head shape.

## Documentation

* Add a "Start here" section to the demo TOC.

* Add demo of tune analysis; fix docs on tune analysis

* Add "zoom to fit" demo.

## Build

* Move SVG to separate files.

# Version 6.0.0-beta.27

## Bugs

* Fix regression bug with setting the tempo when there is no Q: in the ABC string.

* Fix measure class numbering when the line starts with a bar line.

* Fix slur placement over a line break when there is more than one voice.

* Recreate audio when changing the tune in the editor.

* Fix wrapping crash when the first line in the tune is a subtitle.

* Fix synchronization of timing callbacks after changing the tempo.

* Fix regression bug when creating audio buffer in Safari.

* If an audio context is passed in, always use it.

## Documentation

* Add warning if audio CSS is missing.

* Improve the animation demo.

* Add warning if a nonsensical rhythm is encountered.

* Add warning if audio CSS is missing.

* Change default branch to main

* Add links and info for old versions.

* Redo the animation demo.

* Add responsive demo.

* Change alt text for example's logo

* Some tweaks to transposition demo.

# Version 6.0.0-beta.26

## Build

* Added types for TypeScript for `renderAbc` function

* Change midi.js to a peerDependency.

## Accessibility

* Add foregroundColor parameter and set the default to currentColor (for high contrast)

* Add option to set the aria-label; by default aria-label is set to the title.

## Bugs

* Fixed some regressions in changing the audio tempo.

* Fix some timing and crashing issues on synth.

* Fix the currentTrackMilliseconds for meters with eighth note denominators that are not compound.

## Features

* Add support for triple broken rhythm symbols `>>>` and `<<<`

* Add `minPadding` parameter to keep the notes from getting too close together on crowded lines.

* Change the fadeLength default to 200ms

# Version 6.0.0-beta.25

## Bugs

* Fix the way pause/resume is handled in the timing callbacks.

* Fix problems with changing the tempo with "warp"

* Keep key sig changes when wrapping.

* Make wrapping use one less line in some cases.

* Fix crash when wrapping music that has unusual voice mismatches.

* Fix meter display when wrapping.

* Prevent out of memory when wrapping long tune.

* Fix some cases where P: and Q: were not handled correctly.

* Fix changing tempo when there is a repeat.

* Fix audio seek: Seek percent should take the fade length into account.

* Fix crash when a tie is right before a repeat sign.

* Improve error handling when creating audio.

## Features

* Add entry point in synth controller to programmatically seek

* %%stretchlast takes a number parameter

* Deliver the elapsed time in whole notes as well as milliseconds in the timing callbacks.

* Return the position of the notehead in the click listener.

* Add SynthControl.disable() so that the user can't click on the control before the tune is ready.

## Tasks

* Remove many old versions of the minified releases.

* Change the destination folder for the build.

* Refactor wrapping

## Documentation

* Some clarification of the build process in the docs.

* Create the example generator.

* Add FAQ

* Some tweaking to the demos; create demo table of contents.

* Add a little css for the examples

* Improvements to examples/basic-transpose.html

* Disabled spellcheck for ABC input textareas

* Document afterParsing function

* Document synthParamChanged

# Version 6.0.0-beta.24

## Bugs

* If there are pickup notes and a drum track, don't start drum until the first full measure.

* If a dotted slur crosses a line, the slur on the next line should also be dotted.

* Make the audio buffer a little longer so the last note can fade out more naturally.

* Fix abcjs-mmXX class when there are non-music lines present.

* Fix height of bottom text: it was calculating a line too many.

* Fix a couple of crashes when calculating the timing of a tune.

* Fix documentation about how to directly play sound.

## Features

* Add resets to MIDI file; carry forward "pan" option to MIDI file.

* %%titleleft should also affect subtitle.

* Add class for the measure count from the start of the tune.

# Version 6.0.0-beta.23

## Bugs

* Fix calculation of bottom text height when there are blank lines.

* Center chord symbols better.

* Fix crash in the timer when lineEndCallback is not specified.

## Features

* Add the staff Y coordinates to the clickListener.

* Implemented %%titleleft

# Version 6.0.0-beta.22

## Bugs

* Fix crash in audio when there is an odd measure that contains chords.

* Fix definition of some jazz chords, particularly the 13th

* Fix timing on multiple voices when the tempo changes.

* Fix downloading WAV files in stereo.

* Fix the last line in the line end callbacks.

* Simplified and fixed some edge cases when seeking; added return value for eventCallback.

* Fix tempo change in multiple voices

* Fix the reporting of measure numbers in the timing callbacks when there are multiple voices.

* Add more info to the lineEndingCallback so the client can see all of the lines.

* Fix the alignment of %%center text.

* Don't crash if the current beat is later than the last event (can happen when the animation timer is delayed)

* Fix line end callback anticipation handling.

* Fix lower volume of default soundfont to prevent clipping.

* Fix crash when doing audio for tune with subtitle

## Features

* Add programOffsets parameter for audio.

* Handle `%%MIDI channel 10` when it is in the middle of a tune.

* Add the note style (grace or decoration) to the sequenceCallback.

* Add classes for pinpointing where slurs start and end (abcjs-start-m0-n0, abcjs-end-m0-n0)

* Round many paths to 2 dec. places; add "abcjs-dotted" to dotted slurs.

* Add abcjs-dynamics class to the !f!, etc. symbols.

* Differentiate between slurs and ties in the classes.

* Add more info to the lineEndingCallback so the client can see all of the lines.

* Add some details about the beat callback to straighten out doing a smooth cursor.

# Version 6.0.0-beta.21

## Bugs

* Don't require soundFontUrl to end in a slash.

* Force stretchlast on all lines except the last when printing one svg per line.

* Fix placement of brackets and braces when there are two voices on a staff.

* Fix typo in lead_8_bass_lead instrument name.

## Features

* Added soundFontVolumeMultiplier parameter; 
    
* made the abcjs soundfont the default.

# Version 6.0.0-beta.20

## Bugs

* Fixed bug in smooth cursor when repeat is on one line.

* Fix timing callbacks calling stop() when playing in a loop.

## Documentation

* Add example for adding swing.

* Add example for playing on repeat.

# Version 6.0.0-beta.19

## Bugs

* Fix crash when processing a string that contains no note events.

* Don't let odd crescendo or diminuendo cause a nonsensical volume.

* Initialize the gap in audio files.

* Fix bug in timing callbacks when the position changes inside an event handler.

* Fix bug in turning off individual voices.

* Fixed chord placement when there are more than one chord in a measure in compound meter.

## Features

* Implement a smooth cursor in the timing callbacks.

* Expose setWarp so that the tempo can be changed programmatically.

# Version 6.0.0-beta.18

## Bugs

* Slight speedup when laying out scores with names in the voices.

* Increase the size of the annotation's lane to account for descenders.

* Fix calculation of beat length for 3/8 time.

## Features

* Return the cursor position for each beat in the timing callbacks.

* Add the x position of the end of each note to the note timings.

## Documentation

* Document the renderer debug option.

* Document the new parameter on the TimingCallback's beatCallback.

# Version 6.0.0-beta.17

## Bugs

* Fix positioning of "3" on triplets.

* Add a tiny bit on margin for the annotation lanes.

* Fix positioning of lower annotations (that is: "_annotation").

* Fix generating audio using the SynthSequence object.

# Version 6.0.0-beta.16

## Features
* If there is a repeat, then include both of the currentTrackMilliseconds in the callback. (Note: if you consume this, be sure you can handle either a number or an array.)

* Allow as many lanes as needed for annotations below the staff. 
    
* Add Tune.getElementFromChar method for convenience.

* Allow setTiming to be called without parameters.

## Bugs

* Fix the audio interpretation of dynamics.

* Fix vertical positioning of annotations when they appear on the same line as other annotations.

* Fix bug when there is a spacer in a triplet.

* Fix drawing of slur at beginning of line.

* Fix bug where editor swallows the clickListener callback.

* Fix timing when there are tempo changes.

* Move tempo note up slightly so it aligns with the number, not the font's baseline.

## Documentation

* Document the return value of renderAbc

* A little improvement to the Editor documentation.

* Document classes a little more comprehensively.

* Document lineBreaks parameter.

* Remove the circular requirement for abcjs in the docs.

* Start to document the rest of the options for renderAbc

* Create example of how to annotate music.

* Improve documentation of audio.

* Changed the object that onEnded is passed in with to match documentation.

# Version 6.0.0-beta.15

## Bugs
* Slightly increase the spacing for the dynamics lane.
* Fix crash when inline tempo is the first thing in the file.
* If `selectTypes` is not passed in, then the click behavior matches the last version of abcjs.
* Various positioning tweaks for clefs and key signatures.
* Get the fingerings to not interfere with chords.
* Fix dynamic volume calculation when dynamic is defined on bar line.
* Fix regression when wrapping short lines.
* Don't crash when creating a drum track (the inserted rests don't have elements attached.)
* Create AudioContext if one isn't passed in.
* fix some minor positioning problems with text boxes.

## Features
* Use two lines for annotations and chords if they would run into each other.
* Recognize `!^!` as a synonym for `!marcato!`.
* Add a little more vertical space so nearby elements don't touch.
* Add support for dotted slurs and dotted ties.
* Pass back original mouse event when an element is clicked.
* Implement `vocalspace`.
* Add `showDebug` parameter to display element placement.
* Support `beambr1` and `beambr2`.
* Add the option `fontboxpadding`.
* Allow `annotationfont`, `composerfont`, `historyfont`, `infofont`, `subtitlefont`, `textfont`, `titlefont`, and `voicefont` to have a text box.

## Refactoring
* Some refactoring of layout functionality.

## Documentation
* Change all the examples to use the `/dist` folder so the path doesn't change every release.
* Create test for web audio.
* Set a custom font for the chords in the docs.

# Version 6.0.0-beta.14

## Bugs

* Don't crash if `setTiming` is called too early.

* Fix length of accompaniment notes in compound meters.

* Fix inaccuracies with JS floating point on the length of notes.

* Fix crash when unmatched quote is in V: line.

* Get the multi-measure rest to have the correct duration for both display and audio.

* Fix crash "undefined size".

* Fix computing the pickup length when there are triplets.

* Don't transpose the perc clef.

* The audio should ignore the visualTranspose.

* Fix tempo calculation.

## Features

* Improve the drawing of the double flat symbol.

* Detect chords that aren't on the beat and move them.

* Play chords on incomplete measures.

* Fix selection of tempo element.

* Handle no key sig in transpose.

* Allow synth parameters to be changed on the fly when using the editor.

* Don't require generate_warnings in editor params if warnings_id is present.

* Accept an element as well as an ID in warnings_id.

## Refactoring

* Refactor the way notes are placed to create audio.

* Move layout functionality to a separate directory.

## Documentation

* Make a better example of how to transpose.

## Testing

* Add Mocha

* Add mocha tests covering most of the audio note placement.

* Add mocha tests for the selectable items.

* Add mocha tests for the line wrapping code.

* Add mocha tests that will run cross browser.

# Version 6.0.0-beta.13

## Bugs
* Fix staff spacing bug when nothing is below the staff (like with bass clef only containing high notes)

* If a triplet is beamed with anything else, add a bracket.

* Fix supportsAudio() so it always return a bool

* allow more than one brace on a system

* Don't start dragging a note unless only the main mouse button is clicked.

* Don't crash audio if the time signature is malformed.

* Fix tempo on 9/4 and 12/4 meters

* Restore staccato note length

* fix bug in audio transposing middle C

* fix placement and sizing of text and the text box

* fix bug with sizing gchordfont

* Fix some crashes and bugs in the visible audio control.

## Features
* Calculate tempo using passed in bpm if the millisecondsPerMeasure is not supplied.

* Refactor the editor to use renderAbc so that all the renderAbc functionality is available.

* allow multiple lines on a voice name

* center the voice name when there is one name in a brace.

* Implement vskip for regular music lines.

* allow changing gchordfont in the middle of the tune

* Create chords from whichever voice chords are encountered first.

* Get the octave clefs to sound in the correct octave.

## Documentation
* update example to show onSvgPerLine and use new audio.

* Fix example links in docs.

* Add example for playing synth with no visual music.

* Fix midi download link on full synth example.

## Refactoring

* split tunebook from tunebook parsing.

* More refactoring of the drawing code.

* separate bottom text into creation/drawing stages; cut down on dependencies in the draw functions.

* separate editarea from editor to allow function redefinitions

# Version 6.0.0-beta.12

## Bugs

* Fix selection of items in a cross-browser way, in different markups and css that the SVG can appear.

* Fixes #440 second staff rendering too early.

* Fix regression bug when rendering.

# Version 6.0.0-beta.11

## Features

* Allow "K:C none" to be the same as "K:C clef=none"
* Allow a finer grained selection mechanism.
* Allow braces to be selected.
* Allow o 0 and ^ as input for º ø and ∆ in chords.
* Don't play notes that are drawn with the rhythm notehead: replace with chord.
* Implement graceslurs
* Make the annotation not take horizontal space.

## Bugs

* Crash in Firefox <= 50 when selecting.
* Don't crash if a rest is put inside a chord i.e. `[z]`
* Improve downward stem and beam rendering
* Remove the gaps between notes in audio.
* When removing latex commands, don't mess up the character positioning.
* fix to scale the click coords when paper is set to responsive
* support viewBox differences between chrome and firefox

## Refactoring

* Extract the chord/annotation function to a separate file.
* Much refactoring to start putting all of the drawing commands together.

## Documentation

* Add example for using wrap.
* Improve documentation for the call to initialize the synth.
* use https link over ssh for building documentation

# Version 6.0.0-beta.10

## Features

* Add option to turn off individual voices when producing the audio.
* Add track names to midi file output.

## Documentation

* Example of how to play only chords or only melody.

## Bugs

* Fix placement of multiline overlay voices.
* Fix crash when setting the name of the midi file to download.
* Many timing tweaks and other improvements to the audio creation.
* Playback treble+8, etc. clefs in the correct octave.
* Don't transpose chord accompaniment more than an octave.
* Extra resume of audio context for Safari 13
* Fix setting the sound font url.
* Support pppp and ffff in audio.
* Fill midiPitches when doing any timing operation.
* Fix seeking when paused moved the cursor but not the audio.
* Fix audio timing when there are grace notes present.
* Fix end tie that happens over an ending.
* Fix audio for ties when there are accidentals.
* Fix the alternating bass note for chords with #5 and b5.
* Fix arithmetic inaccuracies in triplets.
* Fix interpreting a "maj" chord as minor.
* Fix tempo of 3/4 tunes.

# Version 6.0.0-beta.9

## Bugs

* Add a fail-safe timer for the timingCallbacks (for some mobile devices that don't properly do requestAnimationFrame)

## Tasks

* Add Docker files for running npm.

# Version 6.0.0-beta.8

## Bugs

* Give the percussion clef a little more room to the right.

* Fix line ending callbacks after random access seeking.

# Version 6.0.0-beta.7

## Bugs

* Some tweaks to improve audio output.

* Element.prepend is not available on older browsers.

# Version 6.0.0-beta.6

## Bugs

* When doing line wrap, don't drop the meter when there are multiple staves.

* Keep the line callbacks in TimingCallbacks accurate after seeking.

# Version 6.0.0-beta.5

## Features

* Add offset parameter for TimingCallbacks start()

* Somewhat improved documentation.

## Bugs

* Make the timing of beats more accurate in TimingCallbacks.

* Only select element if the click is within 12 pixels.

* Fix crash when using the built in audio control.
    
# Version 6.0.0-beta.4

## Features

* Add a callback for the client to select items programmatically.

* Add midi download to the synth example.

* Add "link" as the default style of midi file return value.

## Bugs

* Call resume on the AudioContext just before playing, just in case. (Fixed Safari bug)

* Fixed regression with the line number on the staves.

* Fixed regression: the class "abcjs-top-line" lost the "abcjs-" part.

## Tasks

* Update copyright years.

* Update dragging example.

# Version 6.0.0-beta.3

## Bugs

* Remove warning in audio creation when the track name is specified.

* Don't crash in creating audio when the length of the music is zero.

* Fix some timing problems with loading note mp3 that are already pending.

* Fix selection of free text.

* Set the correct defaults for a bare "%%sep" command.

* Set the right font face when a font is specified with only "box"

* Fix crash in audio when trying to play unisons.

* Fix setting the position of braces and brackets when the start staff isn't present.

* Fix computation of pickup length because of JavaScript math problems

* Fix setting the position of braces and brackets when the end staff isn't present.

* Fix some inaccuracies in getting height of text.

## Improvements

* Improve efficiency of creating the audio buffer; improve sound quality and volume of the buffer.

* Round many of the calculations to make the SVG draw the same on different systems.

* Improve the selection data.

# Version 6.0.0-beta.2

## Bugs
* Fix crash when creating music when the SVG is not shown.

# Version 6.0.0-beta.1

## Selection
* Completely revamp the selection of elements code.
* Implement dragging notes vertically.
* Give more information when clicking on the staff label.
* Get the box around text to be selected with the text.
* Fix selection of the text at the top.
* Click listener parameters now have analysis.
* Add more element types that can be selected by the user.
* Add option "selectAll" for only being able to select notes/rests/bars.
* Add option "selectionColor".
* Add option "dragColor".
* Add option "dragging".

## Audio
* Add "pan" parameter for the audio.
* Pass changes to audio parameters into the editor.
* Improve error handling of midi.
* Guard against crash when a negative duration is given to the midi.
* If an unknown chord pattern starts with an "m", default to minor chord (was always defaulting to major.)
* Redo audio buffer creation to use built in audio nodes.
* Add key and time sig to midi output; use the "note off" command instead of volume 0 in midi file.
* Add track name to midi file.
* Don't override channel for the percussion clef if the program or channel was explicitly set.
* Fix small, accumulating rounding error in midi file timing.
* Fix crash when there isn't a title or other things about the first music line.
* Fix detection of whether a meter is compound.
* Add audio support for trills, mordent, turn, and roll.
* Fix grace note pitch; implement staccato, tenuto, and accent in audio.
* Add option for retrieving the binary midi data.
* Expose the code for creating a MIDI file to the basic library.

## Rendering
* Draw bracket; fix positioning of the brace and bracket.
* Fix grouping and classes of triplets and beams.
* Some tweaks to the grouping of svg elements.
* Optimize calls to getBBox
* Give measure numbers that appear on the left edge more room when they would interfere with the treble clef.
* Make the invisible marker zero pixels so it can't accidentally get shown with css.
* Add classes to ledger lines
* Add more identifying classes.
* Adjust the bass octave indicator a little.
* Group some svg elements together that belong together.
* Remove the selector box for each element - entire SVG is selectable.

## Tasks
* Add testing for the output of the selection.
* Set gitmodules for the vuepress docs (so that commits can be in npm.)
* Remove some dependencies on the window object.
* Put all drawing actions in an array

## Documentation
* Create demo of dragging and selection.
* Documentation should import on the latest abcjs.
* Fix link to audio examples in docs.
* Fix logo path in readme
* Add reference to the standard.

# Version 5.12.0

## Features

* Add entry point for changing glyphs.

* Improved documentation. 

* Add example for changing glyphs.

## Bugs

* Fixed midi plugin example to demonstrate defaultQpm.

* Fix rendering quarter tones in the key signature.

# Version 5.11.0

## Features

* Changed documentation to vuepress.

* Implement the defaultQpm parameter.

* In TimingCallbacks, accept a tune that hasn't created noteTimings yet.

* Audio: Implement beataccents, nobeataccents, vol, volinc, and set the correct default accent values.

* Add onEnded callback for the CreateSynth object.

* Add headless rendering with the "*" parameter.

* Add callback context to audio calls.

* Allow using audio without a visible control.

* Add a callback when the selection changes in the editor.

## Bugs

* Fix bug in double reporting a note's millisecond; fix bug in playing gracenote.

* Fix grace notes in percussion track.

* Fix crash in creating audio when there is a mismatch of ties.

* Fix bug with lining up ties with the correct voice on multipart music.

* Change the TimingCallbacks input parameters into integers.

* When querying a tunebook for an id, accept either string or number.

* Fixed the value of currentTrackMilliseconds that is returned when the user clicks on a note.

* Fix wrapLines with several titles

* Don't add duplicate program commands in audio

* Don't ignore chord basses with accidentals when generating midi

## Tasks

* Update dependencies

# Version 5.10.3

## Bugs

* Don't crash when calculating the wrap lines if the staff width is too short.

## Features

* Allow boolean directives to use "true" and "false", in addition to 0 and 1.

* Added freegchord option.

* Show example of getting timing info on note callback function.

# Version 5.10.2

## Bugs

* Fix line wrapping problem when the total number of measures is less than the target number of measures.

# Version 5.10.1

## Bugs

* Fix crash when attempting to manipulate tunes that are created with oneSvgPerLine.

# Version 5.10.0

## Bugs

* Fix crash on init of synth if tempo is not passed in.

* Fix the tempo for synth pieces that are not in 4/4.

## Features

* Rests that take up a measure should always be a whole rest, no matter what the time sig.

* Allow beat subdivisions to be set for the synth control object.

* Update the test for whether audio is possible to include access to ac.resume

* Add sequenceCallback option for the synth.

* Add api function to expose the tune's key signature.

* Add sequenceCallback option for the synth.

* Add the rest of the possible TimingCallback parameters when calling through the new synth.


# Version 5.9.1

## Bugs

* Fix crash when using different combinations of options for the audio control.

* Fix some browser compatibility issues.

# Version 5.9.0

## Features

* Add parameter afterParsing to provide a hook before displaying the music.

* Added entry point for seeing if audio is possible.

* Play gracenotes (when present) when playing a single event.

* Keep a running total of the time that a note should be played for convenience in callbacks.

* Add gracenote midi pitches to the return object on timing callbacks.

* Support `%%MIDI program channel program` syntax.

* Much improved interface for using the new audio.

* Incorporate playing a single note.

## Bugs

* Fix crash in editor/synth demo.

* Fix placement of triplets

* Let the timingCallbacks be used with one SVG per line.

## Tasks

* Improve demos relating to audio.

* Update all node dependencies.

* Document the "mark" class.

* Update webpack

* Make uncompressed version of abcjs.

# Version 5.8.1

## Bugs

* Fix vertical spacing of %%text

* Fix output of getTune() when more than one tune is parsed with the same parser.

# Version 5.8.0

## Bugs

* Fix alignment issue when a tempo is over a barline.

* Fix alignment issue when a part is over a barline.

* Change startChar and endChar to be aware of the position in the entire tunebook.

* Some tweaks to the slur and tie positioning.

* Protect against crash when an element is added before the staff is ready.

## Features

* Add a new method of creating synthesized sound. (see [Synth Documentation](docs/audio/synthesized-sound.md) )

* Implement "setbarnb" measure number

## Tasks

* Add demos for transposing.

* Add demo of clicking on a note to play it.

* Add examples of how to use the new synth.

* Update build dependencies

* Simplify the build process by not requiring a version number change for each entry point.

* Add info about x and width to renderer regression tests.

# Version 5.7.0

## Bugs:

* Improve slur and tie direction and placement by following "Standard Practice Engraving".

* Use override when calculating beats per measure in the timing functions.

* Fix crash when using the old animation routine without a cursor.

* Handle blank lines in the verses at the bottom.

* Allow calling pauseAnimation and stopAnimation even if the animation hasn't started.

* Fix alignment of overlay voices when the line starts with a bar line.

* Don't start TimingCallbacks timer if there is a seek before the timer starts.

* Expose TimingCallbacks in the midi and test versions.

## Features:

* Allow creation of SVG when it isn't visible in the DOM (by creating a dummy one if necessary).

* Add classes to lyric lines.

* Separate the tempo element into its own svg path so that it can be treated separately.

* Support 6/4 time.

* Invert beatCallback and timingCallback events.

* Add more information in the callback for both the timingCallbacks and the note click callback about the sound of the note clicked.

* In midi, support switching instruments in the same track.

* In midi, return the pitch that is being played in the event; add the total duration as a parameter of the midi; expose getBeatsPerMeasure() in the tune structure.

* In TimingCallbacks, allow subdividing beat callbacks.

## Tasks:

* Update webpack/babel to the latest versions.

* Clean up the text size estimation to just be done in one place, and create a dummy svg if there isn't one available.

* Remove the examples and the font_generator from the npm version.

# Version 5.6.11

## Bugs

* Fix bug in TimingCallbacks where some beats won't be reported if the javascript processing is interrupted (for instance, if the user changes tabs while it is running.)

# Version 5.6.10

## Bugs

* Fix bug in TimingCallbacks where last beat can sometimes be skipped if the animation timer wakes up right at the end.

# Version 5.6.9

## Bugs

* Make overlay work with first & second endings

* Fix bug in measure counting in TimingCallbacks when line starts with a measure of rests.

* Keep stem direction when doing line wrapping.

* Improve the algorithm for wrapping lines. 

# Version 5.6.8

## Bugs

* Improve the line wrapping algorithm.

* When seeking in the TimingCallbacks, call the new position's callbacks right away. 

# Version 5.6.7

## Bugs

* When note is far from the centerline, the stem is extended, so put the flag in the right place.

# Version 5.6.6

## Bugs

* Calculate the correct number of beats in TimingCallbacks: fixes rounding error.

# Version 5.6.5

## Features:

* Add random access seeking to TimingCallbacks.

* Pass back more progress info in the beat callback of TimingCallbacks.

## Bugs

* Add render_options to the midi version of the plugin.

* Add missing release files; remove the "latest" versions, since they were not kept up to date.

* Updated build packages.

# Version 5.6.4

## Features:

* Add %%vskip

* Add %%sep

## Bugs

* Don't include the minified versions of the libraries in the npm package.

# Version 5.6.3

## Features:

* Add arpeggio decoration. 

* Add "voicescale" and "cue=on".

* Add "%%flatbeams".

* Add entry point for "extractMeasures()" to analyze the tune. (Just single voice music for now.)

## Bug fixes:

* Add startChar and endChar for many non-note elements (parts, clefs, tempos, etc.)

* Fix triplet bracket placement when there are rests or really high notes.

* Handle triplets correctly when figuring out the length of the pickup measure.

* Don't count spacers when seeing if there are pickup notes in a tune.
 
* Fix bug not recognizing an inline header after a "&".
    
# Version 5.6.2

## Features:

* Add more chord definitions.

* Support changing fonts in W: statements using $1 syntax.

## Bug fixes:

* Don't attach midi control listeners to the global object.

* Fix some midi control visual issues.

* Fix mousemove listener in the midi control, we want to consume only our events.

* Sort the events for midi creation more deterministically.

* Fix handling ties over a bar line when there is an overlay.

* Adjust text a little when there is a box around it to be centered better.

# Version 5.6.1

## Bug fixes:

* Fix bug where wrapping code was ignoring one SVG per line.

# Version 5.6.0

## Features:

* Enable progress indicator dragging

* Clicks on progress bar now move the indicator correctly 
    
## Bug fixes:

* Fix the title (with unicode chars) in the downloadable MIDI file.

* In midi, sort program changes before other events that happen at the same time.

* Fix crash when calculating the title for a piece with a missing voice.

* Fix bug where wrapping code was ignoring one SVG per line.

* Fix off-by-one error when calculating line widths during wrapping.

# Version 5.5.0

## Features:

* Add "chordsOff" parameter to just play midi of the melody.

## Bug fixes:

* Don't duplicate slurs on chords when using wrap.

* Figure out correct accidental when transposing to a key with accidentals in the key signature.

* Fix problem with calculating the height of beamed notes when the top or bottom one is middle C.

# Version 5.4.2

## Bug fixes:

* TimingCallbacks was reporting the end of the animation at the beginning of the last event - it now waits until the end of that event.

# Version 5.4.1

## Bug fixes:

* Improve the decision on how to break lines in line wrapping.

* Don't duplicate meter when wrapping lines.

* Return the correct version of the tune when doing line wrapping. 

# Version 5.4.0

## Features:

* Add `preferredMeasuresPerLine` as a parameter to the line wrap.

## Bug fixes:

* Improvements to the speed and stability of the line wrapping code.

* Fix lyric placement on wrapped lines.

* Fix the timing of whole rests in the TimingCallback.

# Version 5.3.5

## Features:

* Always send start of measure event on TimingCallbacks, even if the measure starts with a tie.

* Support ^8 and _8 for clefs.

# Version 5.3.4

## Bug fixes:

* Fix crash when doing multi-stave music in wrap mode.

# Version 5.3.3

## Bug fixes:

* Fix test for shrinking the only line when wrapping.

# Version 5.3.2

## Bug fixes:

* Test all options in the `wrap` parameter for legal values.

* Ignore the explicit line breaks when using `wrap`.

* Get the amount of spacing more even on each line when using `wrap`.

# Version 5.3.1

## Bug fixes:

* Don't require passing `scale` as a parameter to get the `wrap` parameter to work.

# Version 5.3.0

## Features

* Add parameter `wrap: { minSpacing, onlyLineLimit, lastLineLimit }` and automatically calc num measures for each line.

* When animating, return an array of start and end chars if there is more than one voice.

* Add line and measure info into the TimingCallbacks for the convenience of the clients.

* Don't require qpm to be passed to TimingCallbacks: look for a qpm in the music.

* In TimingCallbacks, add a callback when it is near the end of a line.

* Add `replaceTarget()` to the timing callback so that re-engraving can happen when the cursor is running.

* Include the original abcString in the callback when rendering.

* Allow multiple overlays in the same measure.

* Add `%%tripletfont` directive.

* Add unicode versions of flats and sharps in midi chords.

* Support `%%MIDI beat` command.

* Support `%%MIDI gchordoff` and `%%MIDI gchordon`.

## Bug fixes:

* The tune positions were off by one because a newline is removed for each tune and was not counted.

* Fix crash in `renderAbc` if the output container isn't an html element.

* Fix default tempo in animation for compound meters to match the MIDI interpretation.

* Refactored the animation to use the TimingCallbacks instead of duplicating code.

* Fix a couple of bugs when sequencing elements for the TimingCallbacks and animation.

* Center the time signature better (particularly 12/8).

* Add extra space to the left of bar lines.

* Add extra space to the width of a note when there is an accidental.

* Lots of refactoring of the engraving code.

* Fix crash when using `barsperstaff`.

* Fix usage of `staffnonote`

* In TimingCallbacks, make `extraMeasuresAtBeginning` default to 0.

# Version 5.2.0

## Features

* Add a version of the plugin that supports midi.

* Add getMeterFraction() convenience function.

* Add a generic timer that provides callbacks in time with the music.

* Small change to classes: add `abcjs-n...` to rests; add duration to triplet marks.

## Bug fixes:

* Correct the speed of animation in 3/8 meter.

* Fix accidentally creating a global variable.

# Version 5.1.2

## Bug fixes:

* Fix horizontal spacing calculation for multiline text.

# Version 5.1.1

## Bug fixes:

* Fix regression for having the SVG responsive.

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

