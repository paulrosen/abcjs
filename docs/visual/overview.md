# Overview (renderAbc)

The main entry point to draw standard music notation is `ABCJS.renderAbc`. Many users won't need to make any other call. That is enough to turn an arbitrary JavaScript string into an SVG image of sheet music.

The easiest way to get the music drawn is by creating a `<div>` on the page and passing that element or its ID and an ABC string representing a single tune to that routine. For example:

```html
<div id="target"></div>
```
```javascript
var abcString = "X:1\nT:Example\nK:Bb\nBcde|\n";
renderAbc("target", abcString);
```

Alternately:
```javascript
var abcString = "X:1\nT:Example\nK:Bb\nBcde|\n";
var el = document.getElementById("target");
renderAbc(el, abcString);
```

<render-abc :abc="`X:1\nT:Example\nK:Bb\nBcde|\n`"></render-abc>

::: tip Tip
Note that in javascript, a new line is expressed with the characters "\n". Also, some common characters that are used in ABC (that is, `<`, `>`, and `&`) have special meanings in html. They need to be escaped. 
:::

## Multiple Tunes

The string passed in can either be one tune (or tune fragment) or multiple tunes, separated by a blank line and a new `X:` declaration.

Instead of passing a single `<div>` as the first parameter, an array can be passed. Then as many tunes are processed as elements in that array. For instance:
  
  ```html
  <div id="target1"></div>
  <div id="target2"></div>
  ```
```javascript
var tune1 = "X:1\nT:Example 1\nK:Bb\nBcde|\n";
var tune2 = "X:1\nT:Example 2\nK:Bb\nBcde|\n";
var abcString = tune1 + "\n" + tune2;
renderAbc(["target1","target2"], abcString);
```

If there are more tunes in the string than there are `<div>`s provided. The later tunes are ignored. If there are more `<div>`s than tunes, then the unused ones are set empty.

::: tip Tip
If you want to pick which tune gets rendered, you can use the option `startingTune`.
:::

## Invisible Rendering

If you want to do the calculations for rendering, but not have the music appear, use "*" for the output div. That will return the visualObj but not display it. This is useful if you want to process an ABC file just for audio or for analysis.

```javascript
var abcString = "X:1\nT:Example\nK:Bb\nBcde|\n";
var renderObj = renderAbc("*", abcString);
```
## Parameters

The full definition of the `renderAbc` call is:
```javascript
var tuneObjectArray = renderAbc(elementArray, abcString, options);
```
### elementArray

One of the following:
1. String containing the ID of an element on the page.
1. An HTML element (usually a `<div>`).
1. An array containing a number of the first two items in this list.
1. An asterisk.

### abcString

A standard string that is in ABC format. This can be one tune, many tunes, or a tune fragment. There are defaults for most items that can be in an ABC string, so you don't have to include the header fields that you don't want.

### Options

This is an object containing a wide variety of options. [See the section on options for more details](render-abc-options.html).

## Return value

The return value is an array of objects that each represent a tune. If you aren't doing more processing on the music you probably don't need this. This is what needs to be passed to the TimingCallbacks object and the CreateSynth object.

There is a lot of valuable info in this object that you can extract that might be useful to you.

::: warning Return Object Format
HOWEVER, the format of this object is NOT guaranteed to be backwards compatible, so if you do delve into this and write code that depends on it, you need to retest whenever you upgrade abcjs.
:::

::: tip Tip
Don't forget that the return value is an array. If you are only processing one tune (that's a pretty common case) you need to use `tuneObjectArray[0]`.
:::
