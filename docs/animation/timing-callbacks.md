# Timing Callbacks

This runs an animation timer and does callbacks at various intervals. This allows you to do various effects that are timed with beats or playing notes.

## Creation

To use this create an instance of it:
```javascript
var timingCallbacks = new abcjs.TimingCallbacks(visualObj, params);
```

| Parameters | Description |
| ------------- | ----------- |
| visualObj | This is the output of the `renderAbc()` call. It is the music that will be timed. |
| params | This is a object. See below for the possible properties. |

## Parameters

| Name | Default | Description |
| ------------- | ------- | ----------- |
| `qpm` | whatever is in the Q: field | Number of beats per minute. |
| `extraMeasuresAtBeginning` | 0 | Don't start the callbacks right away, but insert this number of measures first. |
| `beatCallback` | null | Called for each beat passing the beat number (starting at 0). |
| `eventCallback` | null | Called for each event (either a note, a rest, or a chord, and notes in separate voices are grouped together.) |
| `lineEndCallback` | null | Called at the end of each line. (This is useful if you want to be sure the music is scrolled into view at the right time.) See `lineEndAnticipation` for more details. |
| `lineEndAnticipation` | 0 | The number of milliseconds for the `lineEndCallback` to anticipate end of the line. That is, if you want to get the callback half a second before the end of the line, use 500. |
| `beatSubdivisions` | 1 | How many callbacks should happen for each beat. This allows finer control in the client, for instance, to handle a progress bar. |

## Callbacks

### beatCallback

This is called once for every beat in the tune. It is called one additional time when the tune is finished.

```javascript
function beatCallback(beatNumber, totalBeats, totalTime, position, debugInfo) {}
```

|Name|Description|
|---|---|
| beatNumber | Zero-based beat number. Usually this will increment sequentially and regularly, but if javascript is paused long enough (for instance, if the browser tab is changed), then there may be a number of these calls at once when it catches up. |
| totalBeats | The total number of beats (including all repeats) that will be played. |
| totalTime | The total number of milliseconds of the tune. |
| position | The interpolated position of the cursor if the beat occurs between notes. This is an object with the attributes { left: , top: , height: } This can be used to smooth out the cursor by moving it on the beat callbacks. The higher the number of `beatSubdivisions` the smoother the cursor will be. |
| debugInfo | A hash of some extra info that might be useful in figuring out why the callback was triggered. |

### eventCallback

This is called once for every "event" in time - either a note or a rest. If there are multiple notes at the same time, then it is only called once
for that group of notes.

```javascript
function eventCallback(ev) {}
```

The parameter `ev` is an object that looks like this:

```javascript
ev = {
    "type": "event", // This is always "event"

    "milliseconds": number, // The number of milliseconds from the beginning of the piece
    "millisecondsPerMeasure": number, // The number of milliseconds per measure

    "line": number, // The current "line", that is, the staff system.
    "measureNumber": number, // The measure number. Resets per line, so the first measure number on a line is zero.

    "top": number, // The number of pixels from the top of the svg that the note appears.
    "height": number, // The height of the note, in pixels. 
    "left": number, // The number of pixels from the left edge of the svg.
    "width": number, // The width of the note

    "elements": [  ], // Array of the actual elements on the page that are represented by the note or notes.
    "startCharArray": [ number ], // the character position in the original abc string
    "endCharArray": [ number ], // the character position in the original abc string
    "midiPitches": [ // Array of the currently playing pitches
        {
            "pitch": number, // The pitch number (based on the midi standard, i.e. middle C is 60)
            "durationInMeasures": number, // the note value as a fraction. (that is, a quarter note is 0.025)
            "volume": number, // The volume expressed as a number between 0 and 127
            "instrument": number // The instrument number (based on the midi standard, i.e. acoustic_grand_piano is 0)
        }
    ]
}
```

#### Notes:

* The `startCharArray` and `endCharArray` are arrays because there is more than one location in the abc string if there is more than one voice.

* The format of the `elements` array is subject to change in future versions.

* This is called one last time with passing in `null` at the end of the tune. On that call `eventCallback` can return the string "continue" to keep the timer from stopping. This is useful if you want to play on repeat - in theory you would probably have another call to `seek()`.

* This function can be a Promise or not.

### lineEndCallback

This will be called as the cursor is approaching the end of a line of music. This is useful if there is more than a screen's worth of music; it can be used to scroll the page at the right time.

```javascript
function lineEndCallback(info, event, details) {}
```

The parameter `info` looks like this:

```javascript
info = {
    "milliseconds": number, // current milliseconds from beginning of piece
    "top": number, // The number of pixels from the top of the svg to the top of the cursor
    "bottom": number // The number of pixels from the top of the svg to the bottom of the cursor
}
```
The parameter `event` is the standard note event.

The parameter `details` looks like this:
```javascript
details = {
    "line": number, // the current line number (zero-based)
    "endTimings": array // the array of the timings for each line
}
```
The `endTimings` array elements are of the same type as the `info` parameter.

## Functions

These are the entry points that can be called on the `timingCallbacks` object.

### start(position, units)

This starts the timer that triggers the callbacks. This is called to both start and resume after calling pause. See the `setProgress` method below for explanation of the parameters with one special case:

If `position` is undefined then if the previous call was to `pause()`, then the animation continues from where it left off. If there was no pause, then the animation starts from the beginning.

### pause()

Pauses the animation. Calling `start()` afterwards will resume from where it left off.

### stop()

Stop the animation. After calling this, the next call to `start()` will start at the beginning.

### reset()

Move the timer back to the beginning, so the animation starts over. This can be called either when the animation is currently running or when it is paused.

### setProgress(position, units)

Change the position of the animation. This allows random access to any place in the tune. 

If the second parameter is not present, then `units` equals "percent". The possible values are:

* `"percent"`: The percent passed in is a number between 0 and 1. This can be called either when the animation is currently running or when it is paused. 

* `"seconds"`: The seconds from the beginning of the tune. If this is passed the end of the tune it is changed to the end.

* `"beats"`: The beats from the beginning of the tune. If this is passed the end of the tune it is changed to the end.

### replaceTarget(visualObj)

If the underlying music changes on the fly, this replaces the current object without having to destroy the object and start over. `visualObj` is the return value from `renderAbc`.

## Example

Paste in any ABC you want here then click "start" to see what is returned by the timing callbacks:

<example-tune-book v-if="abcjsReady" :callbacks="callbacks" :tune-id="32"></example-tune-book>

<timing-callbacks ref="timingCallbacks" target="#abc"></timing-callbacks>

<script>
	import { waitForAbcjs } from '../../../wait-for-abcjs';
	export default {
		async mounted() {
            await waitForAbcjs()
            this.abcjsReady = true;
			setTimeout(() => {
				this.callbacks = [this.$refs.timingCallbacks];
			}, 500);
		},
		data() {
			return {
                abcjsReady: false,
				callbacks: [],
			};
		},
	}
</script>
