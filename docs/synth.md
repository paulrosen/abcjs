# Notes for Version 5.8.0

This is a beta version of the new synth method. It is likely there will be some changes to the API in the short run but hopefully not too much.

Please try this out and report any issues that you have.

# Synthesized Sound Generation

## Browser Compatibility and Requirements

* This works in any browser that supports both `AudioContext` and `Promises`. That does NOT include IE, but this will work on any other "modern" browser, for instance, Firefox, Safari, Edge, and Chrome.

* This requires an internet connection for the "sound fonts". You can supply your own sound fonts, so if you want to deliver them locally you can get by without the network. The default sound fonts come from a github repo.

* It is theoretically possible to create complex enough pieces to bog down your browser or eat up memory. The two things that take resources are each unique note in each instrument and the overall length of the music. Music of a few minutes long with a variety of notes in a few different instruments work with no problem on all devices that have been tested.

## Theory

* This creates an audio buffer that is similar to a WAV file and contains the entire piece to play.

* The sounds themselves come from a "sound font": that is, each individual note on each instrument is a separate sound file that is combined into the audio buffer.

* The instrument numbers and the pitch numbers come from the MIDI spec. MIDI is not produced, but it is MIDI-like.

## API

| Synth Entry Points | Description |
| ------------- | ----------- |
| `ABCJS.synth.CreateSynth` | Creates the object that does all the work of creating and playing the audio. It is the only entry point you would normally need. |
| `ABCJS.synth.SynthSequence` | Creates an object that builds data for `CreateSynth`. This is normally done internally if `CreateSynth` is passed a visual object, but this is a way to custom build any sequence. |
| `ABCJS.synth.instrumentIndexToName` |  This translates the MIDI instrument index in case you want a human-readable instrument. |
| `ABCJS.synth.pitchToNoteName` |  This translates the MIDI pitch number into a letter/octave. For instance, `A3`. This is just to provide you with a human-readable form. |
