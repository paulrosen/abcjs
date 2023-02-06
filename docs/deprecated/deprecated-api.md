# Deprecated API Calls

::: warning Deprecation
The following calls still work, but they have been superseded by other methods. If you are writing a new app, avoid these because they might go away sometime in the future.
:::

## parseOnly

```javascript
tuneObjectArray = ABCJS.parseOnly(tunebookString, params)
```

Parses all the tunes in the tunebookString and returns an array of them parsed structure. 

This has turned out to not be that useful since you can do the same effect by passing "*" in as the element and the returned value will have a lot more information.

## Animation

This animation has been replaced by `TimingCallbacks`, which is much more flexible.

### startAnimation
```javascript
ABCJS.startAnimation(outputElement, tuneObject, animationParams)
```

Puts an animated cursor on the rendered music. Note: this is deprecated in favor of `TimingCallbacks`.

### stopAnimation
```javascript
ABCJS.stopAnimation()
```

Stops the animation that was started with `startAnimation`.

### pauseAnimation
```javascript
ABCJS.pauseAnimation(pause)
```

Pauses/resumes the animation that was started with `startAnimation`. Pass `true` or `false` to pause or resume.

## Midi.js

This has been replaced by the new audio interface. Hopefully the new interface will work on more systems, be faster, and require fewer resources.

### deviceSupportsMidi
```javascript
 ABCJS.midi.deviceSupportsMidi()
```
Returns true if the device and browser is capable of playing MIDI.

### setSoundFont
```javascript
ABCJS.midi.setSoundFont(url)
```
Sets an alternate location for the soundfont.

### renderMidi
```javascript
tuneObjectArray = ABCJS.renderMidi(output, tunebookString, params)
```

Completely creates midi for the tunebook. Note: this is deprecated in favor of [Synth Documentation](../docs/audio/synthesized-sound.md).


### startPlaying
```javascript
ABCJS.midi.startPlaying(targetEl)
```

Starts playing the MIDI for the element passed in. If the element is already playing, this pauses it.

### stopPlaying
```javascript
ABCJS.midi.stopPlaying()
```

Stops playing whatever is currently playing.

### restartPlaying
```javascript
ABCJS.midi.restartPlaying()
```

Moves the progress back to the beginning for whatever is currently playing.

### setRandomProgress
```javascript
ABCJS.midi.setRandomProgress(percent)
```

Moves the progress to whatever percent is passed in for whatever is currently playing.

### setLoop
```javascript
ABCJS.midi.setLoop(targetEl, state)
```

Sets the "loop" mode for the element passed in. State should be true or false.
