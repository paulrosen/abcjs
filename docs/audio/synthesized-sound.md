# Synthesized Sound

## Browser Compatibility and Requirements

* This works in any browser that supports `AudioContext`, `AudioContext.resume`, and `Promises`. That does NOT include IE, but this will work on any other "modern" browser that is at least the following version: Firefox 40, Safari 9.1, Edge 13, and Chrome 43.

* This requires an internet connection for the "sound fonts". You can supply your own sound fonts, so if you want to deliver them locally you can get by without the network. The default sound fonts come from [this github repo](https://paulrosen.github.io/midi-js-soundfonts).

* It is theoretically possible to create complex enough pieces to bog down your browser or eat up memory. The two things that take resources are each unique note in each instrument and the overall length of the music. Music of a few minutes long with a variety of notes in a few different instruments work with no problem on all devices that have been tested.

## Theory

* This creates an audio buffer that is similar to a WAV file and contains the entire piece to play.

* The sounds themselves come from a "sound font": that is, each individual note on each instrument is a separate sound file that is combined into the audio buffer.

* The instrument numbers and the pitch numbers come from the MIDI spec. MIDI is not produced, but it is MIDI-like.

## Examples

See [Basic Synth](../examples/basic-synth.html) for the simplest possible way of making sound.

See [Full Synth](../examples/full-synth.html) for an example that incorporates a bouncing-ball type animation and an audio control.

## API

Since there are a number of ways to use the synthesized sound: with or without a visual depiction of the tune, with or without a user-facing audio control, and with or without various timing callbacks, there are a number of different entry points.

## synth.CreateSynth

Creates the object that does all the work of creating and playing the audio. It is the only object you need to create an audio widget for the user to control the sound.

```javascript
var synth = new ABCJS.synth.CreateSynth();
```

### init(synthOptions)

The first call that must be made on the CreateSynth object. This will load all of the needed notes and will return a promise when they are loaded. There might be a considerable delay for this to finish. Because the notes are cached, though, the second time CreateSynth is created with a piece of music with similar notes, it will take much less time. See below for the synthOptions.

This must not be called until the user has made a gesture on the page because this references an `AudioContext`.

#### synthOptions

| Attribute | Default | Description |
| ------------- | ----------- |----------- |
| audioContext | REQUIRED | This the value of `new AudioContext()`. It is passed in instead of created because the calling program might be managing and reusing this. It also MUST be creating in the handler of a user action. It can't be created at any other time. |
| visualObj | undefined | This is the result of `renderAbc()`. Important: `renderAbc()` returns an array, since an ABC string can contain more than one tune. This variable is just one element in that array. Either this must be supplied, or `sequence` must be supplied. |
| sequence | undefined | This is a manually-created set of instructions for creating the audio. It is built using the `SynthSequence` object. |
| millisecondsPerMeasure | calculated | This allows control over the tempo. If this is present, then the tempo specified in the ABC string is ignored. |
| soundFontUrl | "https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/" | This is the public URL for the sound font. If it isn't present, then the sound fonts come from the github repo. This can be replaced if the new sound font follows the same format. |
| debugCallback | undefined | This will be called with various extra info at different times in the process. |
| sequenceCallback | undefined | This is called after the array of notes is created, and just before it is used to create the audio buffer. The array of tracks is passed in, and this gives a chance to tweak the audio before it is created: you can give it some swing, you can change volumes, or anything else. |

#### Example
```javascript
var myContext = new AudioContext();
var visualObj = ABCJS.renderAbc(...);
synth.init({
    audioContext: myContext,
    visualObj: visualObj,
    millisecondsPerMeasure: 400
});
```

### prime()

This creates the actual buffer - it doesn't require a network connection since all the notes have now been preloaded. It returns a promise because there might be a little bit of time delay doing the calculations.

After calling this, everything is setup so you can freely call the rest of the functions to control how the audio works.

#### Example
```javascript
synth.init(...).then(() => {
    synth.prime(() => {
        ...
    });
});
```

### start()

This starts the audio.

Call this after `prime()` has returned its promise. This will happen fast and doesn't have any latency, so you can call this right as you are timing other things to be in sync with the audio.

### pause() and resume()

After `start()` has been called, pause and resume can be called to control the playback.

### seek(percent)

This changes the playback position. It can be called whether the sound is currently playing or not. The percent is a number between 0 and 1.

### stop()

Stops playing the sound and resets the progress to the beginning of the sound file.

### download()

This returns the audio buffer created. (It is in WAV format.)

## synth.SynthController

Creates the object that handles the visual part of the control. This creates play and stop buttons, etc. See the section below for the options.

The constructor can be called at any time, including before much is initialized:

```javascript
var synthControl = new ABCJS.synth.SynthController();
```

### load(selector, cursorControl, visualOptions)

After the DOM is loaded, this should be called to initialize the visual widget that contains the "play", etc. buttons.

While this can be called multiple times, it is generally just called once during initialization.

#### selector

This is a CSS-style selector of the element that should be turned into the audio control.

#### cursorControl

This is an optional object that can be passed in that will receive callbacks when events happen that should move the cursor. See the section on "CursorControl" for more info.

#### visualOptions

This is a hash with the following possible properties:

| Option | Default | Description |
|---|---|---|
| displayLoop | false | Whether to display a button that the user can press to make the tune loop instead of stopping when it gets to the end. |
| displayRestart | false | Whether to display a button that the user can press to make the tune go back to the beginning. |
| displayPlay | false | Whether to display a button that the user can press to make the tune start playing. (Note: this turns into the "pause" button when the tune is playing.) |
| displayProgress | false | Whether to display the progress slider. The user can click anywhere on this to get the music to jump to that location. |
| displayWarp | false | Whether to display the tempo and allow the user to change it on the fly. |

### setTune(visualObj, userAction, audioParams)

This is called whenever there is a new tune ready to be loaded into the player.

#### visualObj

This is one of the tunes that is returned from the `renderAbc()` call. That is, `renderAbc` will return an array of tunes. Often it is an array of length 1 if there is only one tune in the abc string, but it could be multiple tunes. 

#### userAction

True if this is being called inside an event handler from a user gesture. The audio buffer can't be created until then. If this is `true`, then the audio buffer is created immediately. If this is `false` then the audio buffer is not created until the user clicks the `play` button.

### audioParams

Here are the possible properties that can be passed in:

| Property | Default | Description |
|---|---|---|
| audioContext | create it. | An AudioContext object so that they can be reused. |
| debugCallback; | null | A function that is called at various times in the creation of the audio. |
| soundFontUrl | use the default | The publicly available URL of the soundfont to use. |
| millisecondsPerMeasure | calculated | An override of the tempo in the tune. |
| visualObj | null | The object returned from `renderAbc`. |
| options | {} | Options to pass to the low-level buffer creation routines. |
| sequence | null | An alternate audio specification, if visualObj is not present. |
| onEnded | null | A callback function when the AudioBuffer finishes playing. |

The `options` element above can have the following properties:

| Property | Default | Description |
|---|---|---|
| sequenceCallback | null | A hook to get the instructions that will be passed to the Audio Buffer. This can be used either to debug what audio was generated or to modify the sequence before the audio is created. This can be useful to add "swing" to the beats, or do any other processing that isn't possible in ABC notation. |
| callbackContext | null | This is passed back with the sequenceCallback. It can be anything you want. |
| program | 0 | The midi program (aka "instrument") to use, if not specified in ABC string. |
| midiTranspose | 0 | The number of half-steps to transpose everything, if not specified in ABC string. |
| channel | 0 | The "midi channel" to use. This isn't particularly useful except that specifying channel 10 means to use the percussion sounds. |
| drum | null | Whether to add a drum, or metronome track. A string formatted like the `%%MIDI drum` specification. Using this parameter also implies `%%MIDI drumon` See the section for "Drum Parameter" for an explanation. |
| drumBars | 1 | How many bars to spread the drum pattern over. See the section for "Drum Parameter" for an explanation. |
| drumIntro | 0 | The number of measures of count in beats before the music starts. |
| qpm | null | The tempo to use. This overrides a tempo that is in the tune. |
| defaultQpm | null | The tempo to use, only if there is no tempo in the tune. |
| chordsOff | false | If true, then don't turn the guitar chord symbols into sound. (But do play the metronome if there is one.) |
| voicesOff | false | If true, play the metronome and accompaniment; do the animation callbacks, but don't play any melody lines. |

### play(), pause(), toggleLoop(), restart(), setProgress(ev)

These do the same thing as the user pressing these buttons, but can be called programmatically.

### download(fileName)

This will download the current audio buffer as a WAV file to the fileName passed in.

### Example

The following creates an audio control that the user can manipulate.

```javascript
// given that there are two elements in the DOM with the IDs "paper" and "audio"
var cursorControl = { ... }; // see section on CursorControl
var abc = "X:1\n etc...";
var abcOptions = { add_classes: true };
var audioParams = { chordsOff: true };

if (ABCJS.synth.supportsAudio()) {
	var synthControl = new ABCJS.synth.SynthController();
	synthControl.load("#audio", 
        cursorControl, 
        {
            displayLoop: true, 
            displayRestart: true, 
            displayPlay: true, 
            displayProgress: true, 
            displayWarp: true
        }
    );

	var visualObj = ABCJS.renderAbc("paper", 
        abc, abcOptions);
	var createSynth = new ABCJS.synth.CreateSynth();
	createSynth.init({ visualObj: visualObj[0] }).then(function () {
		synthControl.setTune(visualObj[0], false, audioParams).then(function () {
			console.log("Audio successfully loaded.")
		}).catch(function (error) {
			console.warn("Audio problem:", error);
		});
	}).catch(function (error) {
		console.warn("Audio problem:", error);
	});
} else {
	document.querySelector("#audio").innerHTML = 
        "Audio is not supported in this browser.";
	}
}
```

## synth.CreateSynthControl

Lower level object than `SynthController` if you want the functionality without the visible control.

```javascript
var control = new ABCJS.synth.CreateSynthControl(element, options);
```

`element` is either a string representing a selector of an existing element on the page or a DOM element. The contents of that element are replaced with an audio control.

### options parameter

| Option | Description |
| ------------- | ------------- |
| loopHandler | Callback function when the loop button is clicked. If this is not present, then the loop button is not displayed. |
| restartHandler | Callback function when the restart button is clicked. if this is not present, then the restart button is not displayed. |
| playHandler or playPromiseHandler | Callback function when the play button is clicked. if this is not present, then the play button is not displayed. If the `handler` version is present, then it must return a promise. |
| progressHandler | Callback function when the progress bar is clicked. if this is not present, then the progress bar is not displayed.|
| warpHandler | Callback function when the warp percent is changed. if this is not present, then the warp percent is not displayed. |
| afterResume | Callback function after the AudioContext is set up correctly. |
| ------------- | ------------- |
| hasClock | Whether to display a clock on the control. |
| ac | The AudioContext to use for this control. (Optional - if this is not present, then a button will appear asking the user to click to get an AudioContext.) |
| ------------- | ------------- |
| repeatTitle | To override the text of the tooltip for toggling loop mode. |
| repeatAria | To override the text of the aria for loop mode. (By default, the repeatTitle is used.) |
| restartTitle | To override the text of the tooltip for the restart button. |
| restartAria | To override the text of the aria for restart mode. (By default, the restartTitle is used.) |
| playTitle | To override the text of the tooltip for the play/pause button. |
| playAria | To override the text of the aria for the play/pause. (By default, the playTitle is used.)|
| randomTitle | To override the text of the tooltip for the progress slider. |
| randomAria | To override the text of the aria for progress slider. (By default, the randomTitle is used.)|
| warpTitle | To override the text of the tooltip for the warp input. |
| warpAria | To override the text of the aria for warp input. (By default, the warpTitle is used.)|
| bpm | To override the text "BPM" for beats per minute. |

## synth.SynthSequence

Creates an object that builds data for `CreateSynth`. This is normally done internally if `CreateSynth` is passed a visual object, but this is a way to custom build any sequence.

This is a helper object that will create an object that is consumed by `CreateSynth`. There is nothing special about this that you couldn't create the object by hand, but this provides some convenience functions.

| Method | Parameters |Description |
| ------------- | ----------- | ----------- |
| `addTrack` | (none) | Returns the number of the track that was created. This must be called before anything can be added to the track. |
| `setInstrument` | `trackNumber, instrumentNumber` | `trackNumber` is the value that is returned by `addTrack`. instrumentNumber is the stand MIDI number for the instrument. (See `ABCJS.synth.instrumentIndexToName` for the list of instruments.) This should be called right after `addTrack` and may be called at any time after that to change the instrument midstream. |
| `appendNote` | `trackNumber, pitch, durationInMeasures, volume` | This adds a note. `trackNumber` is the value returned from `addTrack`. `pitch` is the standard midi pitch number. `durationInMeasures` is a floating point number where "1" is one measure. `volume` is a value from 0 to 255 that is the volume of the note. |

## CursorControl object

If you want notification when events happen, then you can pass in an object that you create yourself. The following properties are used:

### beatSubdivisions

How often to call the beat callback. If this is not set, then the beat callback is called once per beat. If you want a finer grained control, you can set this to a larger number. Notice that a large number will affect performance.

### extraMeasuresAtBeginning

How many extra measures to have at the beginning before the tune actually starts. This can be used for count in beats.

### lineEndAnticipation

When to call the onLineEnd event. If you want to scroll the music when the end of the line is reached, then you probably want to scroll it a little in advance so the user can read ahead. This is the number of milliseconds, so the value of 500 means to scroll the music one half second before the end of the line.

### onReady(synthController)

Called when the tune has actually been loaded. Because the audio buffer can only be initialized after a user gesture, the tune might not have been loaded when the visual control is created. This might be called when `setTune` is called, or when the user clicks PLAY.

The parameter is the instance of the synthController that called it.

### onStart()

Called when the tune has actually started: that is, after all the set up has been completed.

### onFinished()

Called when the tune has finished.

### onBeat(beatNumber, totalBeats, totalTime)

Called each beat, or each subdivision of a beat.

#### beatNumber

This is the current beat - in a perfect case, this is called regularly. There are various things that can cause JavaScript to stop running, though, so it might get called a bunch of times in a row to catch up. This can be a fraction, if `beatSubdivisions` is present.

### onEvent(event)

This is called every time a note, rest, or bar is encountered.

The `event` parameter has these properties:

| Property | Description |
|---|---|
| measureStart | `true` if this is the beginning of a measure. (Note, beware of the case where the only event at the beginning of a measure is a note tied from a previous note. There might not be anything to do.) |
| elements | The actual SVG elements that represent the note(s) being played. |
| left | The leftmost point of the current elements. |
| top | The topmost point of the current elements. |
| height | The height of the current elements. | 
| width | the width of the current elements. |

### onLineEnd(data)

This is called when the end of the line is approaching. The data is the following properties:

| Property | Description |
|---|---|
| milliseconds | The current time. |
| top | The top of the current line. |
| bottom | The bottom of the current line. |

Use this to determine if the SVG should be scrolled.

## synth.playEvent(pitches, gracenotes, millisecondsPerMeasure)

This will play a single event that is passed. The event must have the same format as the events that are passed back by the click listener.

### pitches

An array of pitches. If there is more than one item in the array, they are played at the same time. Pitches contain:

| Attribute | Description |
|---|---|
| pitch | An integer value of the pitch, where middle C is 60 |
| durationInMeasures | The length of the note. For instance, a quarter note in 4/4 would be .25 |
| volume | A number from 0 to 127 for the volume of the note. |
| instrument | The number of the instrument in the MIDI spec. |

### gracenotes

These are the same format as above, except that these notes are played before the main note for a short time. Also, if there is more than one note in the array, the notes are played sequentially.

### millisecondsPerMeasure

This is used to translate the `durationInMeasures` value into an actual time.
 
### Example:

```javascript
ABCJS.synth.playEvent(
    [ 60, 64, 67 ], // a C chord
    [ 62], // start with a D as a grace note
    1000 // a measure takes one second.    
).then(function (response) {
	console.log("note played");
}).catch(function (error) {
	console.log("error playing note", error);
});

```

## synth.activeAudioContext()

If there is an AudioContext that is being used then this retrieves it. It allows freely sharing the same one in different parts of your app.

## synth.instrumentIndexToName[index]

This is an array that converts the standard MIDI instrument indexes to a name. For instance:
```javascript
console.log(ABCJS.synth.instrumentIndexToName[9]);
// "glockenspiel"
```

## synth.pitchToNoteName[pitchNumber]

This is an array that converts the standard MIDI pitch indexes to a name. For instance:
```javascript
console.log(ABCJS.synth.pitchToNoteName[60]);
// "C4"
```

## Tempos

If the `qpm` parameter is not supplied, abcjs makes its best guess about what tempo should be used. If there is no tempo indicated at all in the ABC string, then 180 BPM is arbitrarily used. If `defaultQpm` is supplied, then that default will be used only if there is no explicit tempo.

If an exact tempo line is supplied with the `Q:` line, then that tempo is used. If the `Q:` contains a standard tempo string, that string is used to make a guess at an appropriate tempo. Here is a list of the known tempo strings and their associated tempos. If you would like to make suggestions about other strings to support or changes to these tempos, please get in touch:

|Tempo|BPM|
|---|---|
|larghissimo|20|
|adagissimo|24|
|sostenuto|28|
|grave|32|
|largo|40|
|lento|50|
|larghetto|60|
|adagio|68|
|adagietto|74|
|andante|80|
|andantino|88|
|marcia moderato|84|
|andante moderato|100|
|moderato|112|
|allegretto|116|
|allegro moderato|120|
|allegro|126|
|animato|132|
|agitato|140|
|veloce|148|
|mosso vivo|156|
|vivace|164|
|vivacissimo|172|
|allegrissimo|176|
|presto|184|
|prestissimo|210|

## Drum parameter

See the ABC documentation for the correct way to format the string that is passed as the drum parameter. Here is a table that provides a fairly reasonable default for drum, drumIntro, and drumBars when used as a metronome:
```
  const drumBeats = {
    // the array is [0]=drum [1]=drumIntro
    "2/4": ["dd 76 77 60 30", 2],
    "3/4": ["ddd 76 77 77 60 30 30", 1],
    "4/4": ["dddd 76 77 77 77 60 30 30 30", 1],
    "5/4": ["ddddd 76 77 77 76 77 60 30 30 60 30", 1],
    "Cut Time": ["dd 76 77 60 30", 2],
    "6/8": ["dd 76 77 60 30", 2],
    "9/8": ["ddd 76 77 77 60 30 30", 1],
    "12/8": ["dddd 76 77 77 77 60 30 30 30", 1]
  };
```
A more complicated example that has the drum pattern fall over two measures of 2/4 time (This is a typical Bulgar pattern):
```
{ drum: "d2dd2ddz", drumBars: 2, drumIntro: 2 }
```

Note that the default soundfont that is used by abcjs contains sounds for pitches **27** through **87**. You can experiment with any of them for different effects.


