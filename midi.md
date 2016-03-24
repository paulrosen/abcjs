# Notes for Version 3.0 Beta

There are a number of features described below that are not yet activated. This release is primarily to get the main MIDI functionality working. Here is a list of features you can look forward to in upcoming versions:

* Changing the instrument and channel in the midi file: right now, one channel is used, and the instrument is Grand Piano.

* Changing the tempo is not available.

* The listener doesn't return much information: look for much more to come.

* The "play selection" functionality is not implemented.

* The "bouncing ball" functionality is not implemented.

# MIDI generation in ABCJS

There are two ways to generate MIDI: as a download link, and as an inline control. The download link method is built into ABCJS. The inline control, though, depends on the external library [MIDI.js](https://github.com/mudcube/MIDI.js)

That, in turn, is dependent on a set of sound fonts. A good place to get them is [MIDI.js Soundfonts](https://github.com/gleitz/midi-js-soundfonts)

# Site Setup

* Use the version of the library that contains midi.js.

* Put the sound fonts at this location on your server:

`/soundfonts/`

NOTE: You can put the sound fonts in another location. If you do, then include the following line right after loading ABCJS:

`window.ABCJS.midi.soundfontUrl = "/path/to/soundfonts/";`

The trailing slash is required.

# Example

See the examples in this repository. They contain the prerequisite files. [Editor](/abc_editor.html), [Plugin](/abc_plugin.html).
