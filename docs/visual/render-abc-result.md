# return value of renderAbc

## visualObjs

When you call `renderAbc` the return value is an array of objects. Those objects contain a lot of information about the tune that was rendered.

Each item in the array that was passed back is one tune. Even though it is not as common, you can render multiple tunes with one ABC string. For instance, the following ABC string will produce two tunes:

```
X:1
K:C
CDEF|

X:2
K:G
GABc|
```

Here is an example of the `renderAbc` call:
```javascript
var visualObjs = abcjs.renderAbc(
    ["id-for-tune-1", "id-for-tune-2"],
    abcString,
    { add_classes: true }
)
```
This section will discuss the structure of `visualObjs`. You can, of course, name this anything you like, but this documentation will refer to it by this name.

## Array of Tunes

Since the return value is an array but in many cases you know you have only passed one tune in, the first thing you'll do is:

```javascript
var visualObj = visualObjs[0]
```

## Data

::: warning Volatile Format
The format of this object is NOT guaranteed to be backwards compatible, so if you do delve into this and write code that depends on it, you need to retest whenever you upgrade abcjs.
:::

### formatting

This contains a list of the fonts used for the various types of elements and other formatting commands that have been either passed in on the `renderAbc` call or appear in `%%` lines.

###	lines

This is an array of all the music. Each item in the array is a "staff system". That is, it could be one staff for single instrument music, it could be two staves for piano music, or it could be more for ensemble music.

If you look at this object in the debugger, you can drill down and see all the notes and other symbols that you've defined.

###	media

Either "screen" or "print". When printing, the margins and the header and footer are used.

###	metaText

This is all of the items that aren't associated with the music. That includes the text that appears before the music starts and the text that appears after the music ends.

###	version

The version of this format.

### visualTranspose

If the parameter `visualTranspose` was passed in on the `renderAbc` call, that value is reflected here.

## Methods

::: warning Volatile Format
The format of this object is NOT guaranteed to be backwards compatible, so if you do delve into this and write code that depends on it, you need to retest whenever you upgrade abcjs.
:::

### getBarLength()

Durations have units where a whole note is 1. This returns how long a measure is. For example, 4/4 time returns `1`, 3/4 time returns `0.75`, 6/8 time returns `0.75`.

### getBeatLength()

Durations have units where a whole note is 1. This returns how long a beat is. For example, 4/4 time returns `0.25`, 6/8 time returns `0.375` since a beat is three eighth notes.

### getBeatsPerMeasure()

This returns how many beats are in a measure. For example, 4/4 time returns `4`, 6/8 time returns `2` since a beat is three eighth notes.

### getBpm(tempo?: TempoProperties)

This is the starting beats per minute. Tempo changes could appear later in the tune, but this is the value that was set with the `Q:` statement, or if that statement doesn't exist, it is the default tempo of 180.

### getMeter()

This returns the internal representation of the meter as an object. More often you'll find `getMeterFraction` more useful if you are doing calculations.

### getMeterFraction()

This returns an object with the properties `num` and `den`. For instance, 3/4 time returns `{num: 3, den: 4}`. Common and Cut time are resolved to `{num: 4, den: 4}` and `{num: 2, den: 2}` respectively.

### getPickupLength()

Durations have units where a whole note is 1. If the first measure is not full, then this is the length of that first measure. It is then considered pickup notes.

### getKeySignature()

This returns the internal representation of the key signature with all of its pieces broken apart.

### getElementFromChar(charIndex)

`charIndex` is a character position in the original ABC. This searches through the tune for the element that matches that character. If you pass in the index of a non-note element it returns null.

### getTotalBeats

Returns `undefined` until `setUpAudio` is called, then it returns the total number of beats that the tune has.

### getTotalTime

Returns `undefined` until `setUpAudio` is called, then it returns the total number of seconds that the tune will take at the tempo that was specified in `setUpAudio`.

### millisecondsPerMeasure()

This does the calculation using beats per minute and beats per measure.

### setUpAudio()

If you aren't using the built in synth, but you still want the information that the synth provides, call this. If you aren't overriding the BPM or anything else that can be set in the synth call, you can call this with no parameters. Otherwise specify the items you want to override.

This returns an array of all the sequence data. Normally you won't need this information, but there may be cases where it is useful for post-processing.

### findSelectableElement(target)

`target` is an HTML element. This will find the most appropriate selectable item for that element. This is useful if you want to know what a user is hovering over, for instance. Here's an example of how it might be used:

```
var renderAbc

var options = {
	add_classes: true,
	selectTypes: true // Add selection for all possible elements
};

renderAbc = ABCJS.renderAbc("paper", abcString, options);
var svg = document.getElementById("paper");
svg.addEventListener('mouseover', hoverListener) // one hover listener for the entire tune

function hoverListener(event) {
	// use the most specific element that was hovered on - it will bubble up until a selectable element is found
    var ret = renderAbc[0].findSelectableElement(event.relatedTarget)
	// if there isn't a selectable element (that is, the hover is over a blank space), null is returned
    if (ret)
        console.log(ret) // info about what the mouse is over
}
```

### getSelectableArray()

This returns an array of all of the selectable items in the tune. The return type is `Array<Selectable>`.

This can be used to build more complicated interactive functionality.

