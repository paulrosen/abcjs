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

### ABCJS.synth.CreateSynth

| method | Description |
| ------------- | ----------- |
| constructor | Call with `var createSynth = new ABCJS.synth.CreateSynth`. This is required for the synth to work. |
| `init(synthOptions)` | The first call that must be made on the CreateSynth object. This will load all of the needed notes and will return a promise when they are loaded. There might be a considerable delay for this to finish. Because the notes are cached, though, the second time CreateSynth is created with a piece of music with similar notes, it will take much less time. See below for the synthOptions. |
| `prime()` | This creates the actual buffer - it doesn't require a network connection since all the notes have now been preloaded. It returns a promise because there might be a little bit of time delay doing the calculations. |
| `start()` | Call this after `prime()` has returned its promise. This will happen fast and doesn't have any latency, so you can call this right as you are timing other things to be in sync with the audio. |
| `pause()` | Stops the sound, but saves the current location so that `resume()` will pick up where it stopped. |
| `resume()` | If `pause()` had been called, this will resume the audio. |
| `seek(percent)` | This changes the playback position. It can be called whether the sound is currently playing or not. The percent is a number between 0 and 1. |
| `stop()` | Stops playing the sound and resets the progress to the beginning of the sound file. |
| `download()` | This returns the audio buffer created. (It is in WAV format.) |

#### synthOptions

| Attribute | Default | Description |
| ------------- | ----------- |----------- |
| audioContext | REQUIRED | This the value of `new AudioContext()`. It is passed in instead of created because the calling program might be managing and reusing this. It also MUST be creating in the handler of a user action. It can't be created at any other time. |
| visualObj | undefined | This is the result of `renderAbc()`. Important: `renderAbc()` returns an array, since an ABC string can contain more than one tune. This variable is just one element in that array. Either this must be supplied, or `sequence` must be supplied. |
| sequence | undefined | This is a manually-created set of instructions for creating the audio. It is built using the `SynthSequence` object. |
| millisecondsPerMeasure | calculated | This allows control over the tempo. If this is present, then the tempo specified in the ABC string is ignored. |
| soundFontUrl | "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/" | This is the public URL for the sound font. If it isn't present, then the sound fonts come from the github repo. This can be replaced if the new sound font follows the same format. |
| debugCallback | undefined | This will be called with various extra info at different times in the process. |

### ABCJS.synth.SynthSequence
TODO-PER

### ABCJS.synth.instrumentIndexToName

This is an array that converts the standard MIDI instrument indexes to a name. For instance:
```javascript
console.log(ABCJS.synth.instrumentIndexToName[9]);
// "glockenspiel"
```

### ABCJS.synth.pitchToNoteName

This is an array that converts the standard MIDI pitch indexes to a name. For instance:
```javascript
console.log(ABCJS.synth.pitchToNoteName[60]);
// "C4"
```
