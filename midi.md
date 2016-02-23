# MIDI generation in ABCJS

There are two ways to generate MIDI: as a download link, and as an inline control. The download link method is built into ABCJS. The inline control, though, depends on the external library [MIDI.js](https://github.com/mudcube/MIDI.js)

That, in turn, is dependent on a set of sound fonts. A good place to get them is [MIDI.js Soundfonts](https://github.com/gleitz/midi-js-soundfonts)

# Site Setup

Include the following scripts from MIDI.js on your page:

* Base64.js
* Base64binary.js
* midifile.js
* replayer.js
* stream.js
* WebAudioAPI.js
* MIDI.js

Put the sound fonts at this location on your server:

`/soundfonts/`

NOTE: You can put the sound fonts in another location. If you do, then include the following line right after loading ABCJS:

`window.ABCJS.midi.soundfontUrl = "/path/to/soundfonts/";`

The trailing slash is required.

# Example

See the example in this repository. It contains the prerequisite files.
