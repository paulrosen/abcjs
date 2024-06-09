# Synthesized Sound

## Browser Compatibility and Requirements

* This works in any browser that supports `AudioContext`, `AudioContext.resume`, and `Promises`. That does NOT include IE, but this will work on any other "modern" browser that is at least the following version: Firefox 40, Safari 9.1, Edge 13, and Chrome 43.

* This requires an internet connection for the "sound fonts". You can supply your own sound fonts, so if you want to deliver them locally you can get by without the network. The default sound fonts come from [this github repo](https://paulrosen.github.io/midi-js-soundfonts/abcjs).

* It is theoretically possible to create complex enough pieces to bog down your browser or eat up memory. The two things that take resources are each unique note in each instrument and the overall length of the music. Music of a few minutes long with a variety of notes in a few different instruments work with no problem on all devices that have been tested.

## Theory

* This creates an audio buffer that is similar to a WAV file and contains the entire piece to play.

* The sounds themselves come from a "sound font": that is, each individual note on each instrument is a separate sound file that is combined into the audio buffer.

* The instrument numbers and the pitch numbers come from the MIDI spec. MIDI is not normally produced, but it is MIDI-like. (There is a function to create a MIDI file for download.)

## Examples

See [Basic Synth](https://raw.githubusercontent.com/paulrosen/abcjs/main/examples/basic-synth.html) for the simplest possible way of making sound.

See [Full Synth](https://raw.githubusercontent.com/paulrosen/abcjs/main/examples/full-synth.html) for an example that incorporates a bouncing-ball type animation and an audio control.

## API

Since there are a number of ways to use the synthesized sound: with or without a visual depiction of the tune, with or without a user-facing audio control, and with or without various timing callbacks, there are a number of different entry points.

## CreateSynth

Creates the object that caches and buffers the audio to be played. All implementations of audio playback will need a CreateSynth.

```javascript
var synth = new ABCJS.synth.CreateSynth();
```

### init(synthOptions)

The first call that must be made on the CreateSynth object. This will load all of the needed notes and will return a promise when they are loaded. There might be a considerable delay for this to finish. Because the notes are cached, though, the second time CreateSynth is created with a piece of music with similar notes, it will take much less time. See below for the synthOptions.

This must not be called until the user has made a gesture on the page because this references an `AudioContext`.

This returns a promise after all the notes have been loaded. The promise contains:
```
{
    cached: [], // an array of the notes that were previously loaded.
	error: [], // an array of the notes that haven't been loaded and the error message that was received
    loaded: [] // an array of the notes that have been loaded.
}
```

#### synthOptions

| Attribute | Default | Description |
| ------------- | ----------- |----------- |
| audioContext | undefined | This the value of `new AudioContext()`. It should be passed in instead of created because the calling program might be managing and reusing this. It also MUST be creating in the handler of a user action. It can't be created at any other time. But if you don't pass one in then abcjs will create it. This value is cached for the length of the browser session. |
| visualObj | undefined | This is the result of `renderAbc()`. Important: `renderAbc()` returns an array, since an ABC string can contain more than one tune. This variable is just one element in that array. Either this must be supplied, or `sequence` must be supplied. |
| sequence | undefined | This is a manually-created set of instructions for creating the audio. It is built using the `SynthSequence` object. |
| millisecondsPerMeasure | calculated | This allows control over the tempo. If this is present, then the tempo specified in the ABC string is ignored. |
| debugCallback | undefined | This will be called with various extra info at different times in the process. |
| options | undefined | Some options for the sound creation (see list below). |

#### synthOptions.options

In addition to the following option, you can also set the options described in audioParams below.

| Attribute | Default | Description |
| ------------- | ----------- |----------- |
| soundFontUrl | "https://paulrosen.github.io/midi-js-soundfonts/abcjs/" | This is the public URL for the sound font. If it isn't present, then the sound fonts come from the github repo. This can be replaced if the new sound font follows the same format. |
| soundFontVolumeMultiplier | 1.0 | This is the amount to multiply all the volumes to compensate for different volume soundfonts. If you find that either the volume is too low or the output is clipped, you can experiment with this number. |
| programOffsets | {} | The offset of each voice to the beat. Some voices have a ramp up time so that the beginning of the sound isn't the beat. This is the number of milliseconds that the program should be offset. This is expressed as `{ 'program_name': 100 }` where the program name is one of the standard midi names, like "acoustic_grand_piano". If you use the default soundfont then these values are set automatically. You can still provide this parameter to override the settings if you like. |
| fadeLength | 200 | The number of milliseconds to fade out each note after its has played for the correct length. The gain will go from 100% to 0% in this number of milliseconds. | 
| sequenceCallback | undefined | This is called after the array of notes is created, and just before it is used to create the audio buffer. The array of tracks is passed in, and this gives a chance to tweak the audio before it is created: you can give it some swing, you can change volumes, or anything else. |
| callbackContext | undefined | This is passed back when the sequenceCallback function is called. | 
| onEnded | undefined | This function is called after the playback stops. |
| pan | [0...] | An array of numbers between -1 and 1 for how far to pan each track. -1 is all the way to the left and 1 is all the way to the right. If there are not enough items in the array for all the tracks, then the remaining tracks will be in the middle. |   

#### Example
```javascript
var myContext = new AudioContext();
var visualObj = ABCJS.renderAbc(...);
synth.init({
    audioContext: myContext,
    visualObj: visualObj[0],
    millisecondsPerMeasure: 500,
    options: {
        soundFontUrl: "https:/path/to/soundfont/folder",
        pan: [ -0.3, 0.3 ] 
    }
}).then(function (results) {
    // Ready to play. The results are details about what was loaded.
}).catch(function (reason) {
    console.log(reason)
});
```

The above will:
1. create audio for the first tune found in the tunebook that is passed to `renderAbc`.
2. It will play at 1/2 second per measure (180 bpm for 2/4 time).
3. It will use the URL provided for the soundfont.
4. It will put the first track a little bit to the left side and the second track a little bit to the right. (Note that if the music is a single line of music with chord diagrams, the melody will be track 0 and the chords will be track 1.)

### prime()

This creates the actual buffer - it doesn't require a network connection since all the notes have now been preloaded. It returns a promise because there might be a little bit of time delay doing the calculations.

After calling this, everything is setup so you can freely call the rest of the functions to control how the audio works.

This returns a promise that is `{ status: audioContextStatus, duration: lengthInSecondsOfAudio }`

Note that normally the status will be "running". On iOS, though, it can sometimes be either "suspended" or "interrupted". It might require user intervention to resolve this.

#### Example
```javascript
synth.init(...).then(() => {
    synth.prime().then((response) => {
		console.log(response.status)
        ...
    });
});
```

### start()

This starts the audio.

Call this after `prime()` has returned its promise. This will happen fast and doesn't have any latency, so you can call this right as you are timing other things to be in sync with the audio.

### pause() and resume()

After `start()` has been called, pause and resume can be called to control the playback.

### seek(percent, units)

This changes the playback position. It can be called whether the sound is currently playing or not.

If the second parameter is not present, then `units` equals "percent". The possible values are:

* `"percent"`: The percent passed in is a number between 0 and 1. This can be called either when the animation is currently running or when it is paused.

* `"seconds"`: The seconds from the beginning of the tune. If this is passed the end of the tune it is changed to the end.

* `"beats"`: The beats from the beginning of the tune. If this is passed the end of the tune it is changed to the end.

### stop()

Stops playing the sound and resets the progress to the beginning of the sound file.

### download()

This returns the audio buffer created. (It is in WAV format.)

### getAudioBuffer()

This returns the AudioBuffer that was created in the the `prime()` call.

## SynthController

Creates a visual widget that allows the user to control playback, including play and stop buttons, a progress bar, etc. This is the quickest way to set up a playback widget. See the section below for options.

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
| displayPlay | true | Whether to display a button that the user can press to make the tune start playing. (Note: this turns into the "pause" button when the tune is playing.) |
| displayProgress | true | Whether to display the progress slider. The user can click anywhere on this to get the music to jump to that location. |
| displayWarp | false | Whether to display the tempo and allow the user to change it on the fly. |

### disable(isDisabled)

This is called internally when waiting for the audio to finish loading. It can also be called directly by the client. The most common use for that is to disable the visual control when you are about to load in a new tune.

If you load in a new tune without disabling the control first and the user clicks play while the notes are still being loaded over the network, the old tune will play until the new one is ready. 

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
| soundFontVolumeMultiplier | 1.0 | This is the amount to multiply all the volumes to compensate for different volume soundfonts. If you find that either the volume is too low or the output is clipped, you can experiment with this number. |
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
| drum | null | Whether to add a drum (or metronome) track. A string formatted like the `%%MIDI drum` specification. Using this parameter also implies `%%MIDI drumon` See the section for "Drum Parameter" for an explanation. |
| drumBars | 1 | How many bars to spread the drum pattern over. See the section for "Drum Parameter" for an explanation. |
| drumIntro | 0 | The number of measures of count in beats before the music starts. |
| drumOff | false | If you want a metronome only for the intro measures but not when the tune starts, use this along with the `drumIntro` and `drum` params. This has no effect if either one of those is missing. |
| qpm | null | The tempo to use. This overrides a tempo that is in the tune. |
| defaultQpm | null | The tempo to use, only if there is no tempo in the tune. |
| chordsOff | false | If true, then don't turn the guitar chord symbols into sound. (But do play the metronome if there is one.) |
| voicesOff | false | If true, play the metronome and accompaniment; do the animation callbacks, but don't play any melody lines. This can also be an array of voices to turn off. The voices are numbered starting at zero. |
| detuneOctave | 0 | The number of cents to raise the pitch of the top note of an octave that is played at the same time. That is, in multipart music, if the tenor and soprano parts are an octave apart the soprano note gets lost in the overtones. Making the top note slightly sharp brings it out without making it sound out of tune. |

### play(), pause(), toggleLoop(), restart(), setProgress(ev)

These do the same thing as the user pressing these buttons, but can be called programmatically.

### setWarp(percent)

This changes the tempo to the percent passed in. That should be a positive integer. It will change the tempo immediately if the music is already playing.

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

## getMidiFile(source, options)

This is called to get the audio in MIDI format, instead of as a playable audio buffer.

```javascript
ABCJS.synth.getMidiFile(source, { midiOutputType: 'binary', bpm: 100 })
```

### source

Either the ABC string to create the MIDI from or the object that is returned from `renderAbc`.
Note that `renderAbc` returns an array, so to get the first tune, for instance, you need to use `[0]`.
When using the object many of the options passed in are ignored because the tune is already created.

### options

The same options as are used elsewhere, with the addition of:

```javascript
options = {
	midiOutputType: "encoded" | "binary" | "link",
    // The following OPTIONAL parameters are only used when the type is "link":
    downloadClass: "class-name-to-add",
    preTextDownload: "text that appears before the link",
    downloadLabel: function() | "the text that appears as the body of the anchor tag that is clickable",
    postTextDownload: "text that appears after the link",
    fileName: "the name of the file that the midi will be saved as"
}
```
Note that `downloadLabel` can be either a string or a function that is passed the tune object and the tune index.
The return of that function must be a string. If downloadLabel is text and contains `%T` then that is replaced by the tune's title.

#### midiOutputType

If this is not present or set to `link`, then the return value is a link that can be placed directly on the page for the user to download.

If this is set to `binary`, then the actual contents of the midi file are returned, as a blob.

If this is set to "encoded", then the contents of the midi file are returned, as an encoded ASCII string. That is, bytes are represented by `%xx` where xx is a hexidecimal value.

#### downloadLabel

If this isn't present, then the title is retrieved from the tune and the label is "Download MIDI for $TITLE".

If you'd like to use the title in the label but modify it, use `%T`. That is: `downloadLabel: "the tune %T is ready for download"`

### Examples

#### Complete download link

```html
<div id="midi-link"></div>
```

```javascript
var midi = ABCJS.synth.getMidiFile("X:1\nT:Cooley's\netc...", { chordsOff: true, midiOutputType: "link" });
document.getElementById("midi-link").innerHTML = midi;
```
That results in the following html:

```html
<div id="midi-link">
<div class="abcjs-download-midi abcjs-midi-0"><a download="cooleys.midi" href="data:audio/midi,MThd%00%00%00%06%00%01%00 etc...">Download MIDI for "Cooley's"</a></div>
</div>
```

#### The midi data for your own download

```html
<a id="midi-link" download="myfile.midi" href="">MIDI</a>
```

```javascript
var midi = ABCJS.synth.getMidiFile("X:1\nT:Cooley's\netc...", { chordsOff: true, midiOutputType: "encoded" });
document.getElementById("midi-link").setAttribute("html", midi);
```

#### Actual midi file to pass to another library

```javascript
var midi = ABCJS.synth.getMidiFile("X:1\nT:Cooley's\netc...", { chordsOff: true, midiOutputType: "binary" });
otherLibraryMidiPlayer.loadTune(midi);
```

#### Passing an object

If you already have parsed the tune you can just pass it in:
```javascript
var visualObj = ABCJS.renderAbc("paper", "X:1\nT:Cooley's\netc...");
var midi = ABCJS.synth.getMidiFile(visualObj[0], { midiOutputType: "encoded" });
```

## CreateSynthControl

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

## SynthSequence

Creates an object that builds data for `CreateSynth`. This is normally done internally if `CreateSynth` is passed a visual object, but this is a way to custom build any sequence.

```javascript
var sequencer = ABCJS.synth.SynthSequence()
sequencer.addTrack();
sequencer.setInstrument(0, 25);
sequencer.appendNote({ trackNumber: 0, pitch: 60, durationInMeasures: 1, volume: 80 })

var buffer = new ABCJS.synth.CreateSynth();
return buffer.init({
	sequence: sequence,
}).then(function () {
	return buffer.prime();
}).then(function () {
	return buffer.start();
});
```
This is a helper object that will create an object that is consumed by `CreateSynth`. There is nothing special about this that you couldn't create the object by hand, but this provides some convenience functions.

| Method | Parameters |Description |
| ------------- | ----------- | ----------- |
| `addTrack` | (none) | Returns the number of the track that was created. This must be called before anything can be added to the track. |
| `setInstrument` | `trackNumber, instrumentNumber` | `trackNumber` is the value that is returned by `addTrack`. instrumentNumber is the stand MIDI number for the instrument. (See `ABCJS.synth.instrumentIndexToName` for the list of instruments.) This should be called right after `addTrack` and may be called at any time after that to change the instrument midstream. |
| `appendNote` | `trackNumber, pitch, durationInMeasures, volume` | This adds a note. `trackNumber` is the value returned from `addTrack`. `pitch` is the standard midi pitch number. `durationInMeasures` is a floating point number where "1" is one measure. `volume` is a value from 0 to 255 that is the volume of the note. |

## CursorControl object

If you want notification when events happen, then you can pass in an object that you create yourself. Note that even though this object is called `CursorControl` it can be used for anything that requires knowledge of various events that happen during playback: when a note is played, when a beat is reached, when the end of a music line is near, when a measure starts, and when the music stops.

The following properties are used:

- beatSubdivisions

How often to call the beat callback. If this is not set, then the beat callback is called once per beat. If you want a finer grained control, you can set this to a larger number. Notice that a large number will affect performance.

- extraMeasuresAtBeginning

How many extra measures to have at the beginning before the tune actually starts. This can be used for count in beats.

- lineEndAnticipation

When to call the onLineEnd event. If you want to scroll the music when the end of the line is reached, then you probably want to scroll it a little in advance so the user can read ahead. This is the number of milliseconds, so the value of 500 means to scroll the music one half second before the end of the line.

- onReady(synthController)

Called when the tune has actually been loaded. Because the audio buffer can only be initialized after a user gesture, the tune might not have been loaded when the visual control is created. This might be called when `setTune` is called, or when the user clicks PLAY.

The parameter is the instance of the synthController that called it.

- onStart()

Called when the tune has actually started: that is, after all the set up has been completed.

- onFinished()

Called when the tune has finished.

- onBeat(beatNumber, totalBeats, totalTime)

Called each beat, or each subdivision of a beat.

  - beatNumber

This is the current beat - in a perfect case, this is called regularly. There are various things that can cause JavaScript to stop running, though, so it might get called a bunch of times in a row to catch up. This can be a fraction, if `beatSubdivisions` is present.

- onEvent(event)

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

- onLineEnd(data)

This is called when the end of the line is approaching. The data is the following properties:

| Property | Description |
|---|---|
| milliseconds | The current time. |
| top | The top of the current line. |
| bottom | The bottom of the current line. |

Use this to determine if the SVG should be scrolled.

Example:
```javascript
var CursorControl = function() {
	this.beatSubdivisions = 2;
	this.onStart = function() {
		console.log("The tune has started playing.");
    }
	this.onFinished = function() {
		console.log("The tune has stopped playing.");
    }
	this.onBeat = function(beatNumber) {
		console.log("Beat " + beatNumber + " is happening.");
    }
	this.onEvent = function(event) {
		console.log("An event is happening", event);
    }
}
var cursorControl = new CursorControl();
synthControl = new ABCJS.synth.SynthController();
synthControl.load("#audio", cursorControl, {displayPlay: true, displayProgress: true});
```

## playEvent(pitches, gracenotes, millisecondsPerMeasure)

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
	[   // a C chord
		{"cmd":"note","pitch":60,"volume":105,"start":0,"duration":0.125,"instrument":0,"gap":0},
		{"cmd":"note","pitch":64,"volume":105,"start":0,"duration":0.125,"instrument":0,"gap":0},
		{"cmd":"note","pitch":67,"volume":105,"start":0,"duration":0.125,"instrument":0,"gap":0},
	],
	[   // start with a D as a grace note
		{"pitch":62,"durationInMeasures":0.125,"volume":70,"instrument":0}
	],
    1000 // a measure takes one second.    
).then(function (response) {
	console.log("note played");
}).catch(function (error) {
	console.log("error playing note", error);
});

```

## activeAudioContext()

If there is an AudioContext that is being used then this retrieves it. It allows freely sharing the same one in different parts of your app.

```javascript
var ac = ABCJS.synth.activeAudioContext();
```

## instrumentIndexToName[index]

This is an array that converts the standard MIDI instrument indexes to a name. For instance:
```javascript
console.log(ABCJS.synth.instrumentIndexToName[9]);
// "glockenspiel"
```

## pitchToNoteName[pitchNumber]

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
{ drum: "d2dd2ddz 76 77 76 77 77 60 30 60 30 30", drumBars: 2, drumIntro: 2 }
```

Note that the default soundfont that is used by abcjs contains sounds for pitches **27** through **87**. You can experiment with any of them for different effects.


