# Transposition

The ABC string can be transposed to another key and output as a string. 

Note that there are other forms of transposition using parameters to the `abcRender` call, but they do not output a string that can be used elsewhere. If you want to visually transpose you can use [visualTranspose](/abcjs/visual/render-abc-options.html#visualtranspose). If you want to transpose just the audio, use [midiTranspose](/abcjs/audio/synthesized-sound.html#audioparams)

## Entry Point

```
var newAbc = ABCJS.strTranspose(originalAbc, visualObj, steps)
```

## Parameters

All parameters are required

### originalAbc
Default: none

This is the ABC string that you want to transpose.

### visualObj
Default: none

This is the result of rendering that string. You must call `renderAbc()` before calling `strTranspose()`.

### steps
Default: none

This is the number of half steps to transpose. It can be positive to transpose higher in pitch or negative to transpose lower. It can be `12` or `-12` to transpose an octave and can be larger than that to transpose more than an octave.

## Example
```
var abc = "K:D\nDEFG|"
var steps = 2
var visualObj = abcjs.renderAbc("paper", abc);
var output = abcjs.strTranspose(abc, visualObj, steps)
```

For a full example, see the [Transposition Example](https://paulrosen.github.io/abcjs/examples/output-transpose.html).

## Notes

There are some types of ABC that cannot be transposed and because of the wide range of ways to write ABC there are some ABC strings that won't be transposed completely.

For instance, lines that have a clef of "perc" will not be transposed. And some ABC strings contain notes and chords in the lyric line or using the "annotation" syntax. Those will not be transposed.

That said, most input strings use a subset of the full ABC spec and are transposed completely.

::: tip Bugs
This is a new feature and because of the complexity of the ABC specification there are bound to be bugs! Please let me know if you see an example of something that *should* have been transposed but wasn't.
:::
