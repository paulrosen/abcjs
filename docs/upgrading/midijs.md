# MIDI.JS Usage

## Midi.js removed

The last version supporting this interface is 6.0.0-beta.28.

## Notes for Version 5.8.0

This way of creating midi is being deprecated by a new method that is much smaller, less buggy and integrates with the TimingCallbacks object. This will continue to work for the forseeable future, but probably won't change much.

See [Synth Documentation](../audio/synthesized-sound.md) for details.

## Notes for Version 3.0 Beta

There are a number of features described below that are not yet activated. This release is primarily to get the main MIDI functionality working. Here is a list of features you can look forward to in upcoming versions:

* Changing the instrument and channel in the midi file: right now, one channel is used, and the instrument is Grand Piano.

* Changing the tempo is not available.

* The listener doesn't return much information: look for much more to come.

* The "play selection" functionality is not implemented.

* The "bouncing ball" functionality is not implemented.

## MIDI generation in ABCJS

There are two ways to generate MIDI: as a download link, and as an inline control. The download link method is built into ABCJS. The inline control, though, depends on the external library [MIDI.js](https://github.com/mudcube/MIDI.js)

That, in turn, is dependent on a set of sound fonts. A good place to get them is [MIDI.js Soundfonts](https://github.com/paulrosen/midi-js-soundfonts)

## Site Setup

* Use the version of the library that contains midi.js.

* The soundfonts, by default, are served from github. If you would like host them yourself, put them on your server in a publicly accessible place and call:

`window.ABCJS.midi.setSoundFont("/url/to/soundfont/");`

The trailing slash is required.

There is also some CSS required to make the MIDI control look right. You can use the example CSS in this repository and modify it to match your site. The example CSS uses Font Awesome. Include these two lines:

`<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">`
`<link rel="stylesheet" href="abcjs-midi.css" media="all" type="text/css" />`

## Creating the MIDI

After doing the above steps to load the CSS and the sound fonts, the simplest way to produce the MIDI is:

`window.ABCJS.renderMidi("id-of-div-to-place-midi-controls", abcString, {}, { generateInline: true }, {});`


## Example

See the examples in this repository. They contain the prerequisite files. [Editor](/examples/editor-midi.html), [Printable](/examples/printable.html).
