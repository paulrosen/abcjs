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
| `extraMeasuresAtBeginning` | 0 | Don't start the callbacks right away, but insert these number of measures first. |
| `beatCallback` | null | Called for each beat passing the beat number (starting at 0). |
| `eventCallback` | null | Called for each event (either a note, a rest, or a chord, and notes in separate voices are grouped together.) |
| `lineEndCallback` | null | Called at the end of each line. (This is useful if you want to be sure the music is scrolled into view at the right time.) See `lineEndAnticipation` for more details. |
| `lineEndAnticipation` | 0 | The number of milliseconds for the `lineEndCallback` to anticipate end of the line. That is, if you want to get the callback half a second before the end of the line, use 500. |
| `beatSubdivisions` | 1 | How many callbacks should happen for each beat. This allows finer control in the client, for instance, to handle a progress bar. |

## Functions

These are the entry points that can be called on the `timingCallbacks` object.

| Name | Description |
| ------------- | ----------- |
| replaceTarget(visualObj) | If the underlying music changes on the fly, this replaces the current object without having to destroy the object and start over. |
| start() | Start or resume the animation immediately. |
| pause() | Pause the animation. After calling this, the next call to `start()` will pick up where it left off. |
| reset() | Move the timer back to the beginning, so the animation starts over. |
| stop() | Stop the animation. After calling this, the next call to `start()` will start at the beginning. |
| setProgress(percent) | Change the position of the animation. This allows random access to any place in the tune. |

## Example

::: tip TODO
This page is currently being enhanced. Check back soon!
:::

