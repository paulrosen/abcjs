# Frequently Asked Questions

## How do I make a playback widget?
See the [sandbox](../audio/synthesizer-sandbox.md) to get started. You can tailor the audio control to your needs.

## Which scripts do I need to include?


### For node:
```bash
npm install abcjs --save-dev
```
```javascript
import abcjs from "abcjs";
```

### For plain javascript:

Download the file `dist/abcjs-basic-min.js` to your project. Then at the top of your file:
```javascript
<script src="js/abcjs-basic-min.js" type="text/javascript"></script>
```

## How do I use the sound fonts I have saved locally in my ABCJS project?

See the [sandbox](../audio/synthesizer-sandbox.md) to see the syntax.

## I’m trying to get the names of notes on click and it doesn’t work. I’ve got a visual rendering of my tune, but no playback widget.

There is some optional extra information that can be added to the music structure. This is added when creating the synth but it isn't added by default so that the code isn't unnecessarily executed for users who don't need it.

To add that information:
```javascript
var visualObj = abcjs.renderAbc( ... )
visualObj[0].setUpAudio()
```

## Can I use ABCJS in React Native/other mobile development frameworks?

ABJS needs a DOM to 1) calculate how much space the notes will take up once rendered, and 2) render the notes as an SVG. This makes integrating ABCJS with frameworks like React Native that don’t use a DOM less than straightforward.

An approach by Matthew Dorner: His app, react-native-songbook, relies on react-native-svg (via standalone-vexflow-context) to draw to the SVG. You might also try experimenting with rendering the ABCJS elements in a React Native webview component, which supplies the required DOM, as a browser to an external page with ABCJS functionality, rather than as a native rendering engine. Kudos to @rpattcorner for this tip.

## How do I use ABCJS in a server-side rendering app?

If you are using Nuxt or Next or any other framework that builds the pages on the server before sending them to the client, you'll have to delay calling abcjs until you are in the client.

Here's an example:
```javascript
const abcjs = process.browser ? require('abcjs') : null;

if (abcjs) {
	abcjs.renderAbc( ... )
}
```
## Why do I have to wait until the user interacts with the page to create the audio?

Because browsers have placed constraints on AudioContexts to prevent developers from building websites that autoplay sound on page load, you can’t begin to buffer audio until the user makes some gesture on the page. 

## How do I get the audio to start right away?

There is some network traffic and construction of the sound buffer that takes some time. This can be done a little bit ahead of time, so, as soon as the user interacts with the page and as soon as you know what music you want to play, you can begin the process. You'll notice that there are `init()` and `prime()` calls that return a promise. After those promises resolve clicking `play()` will be fast.

## How do I prevent this error?: “The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page.”

Don't call any audio-related functionality until the user has interacted with the page. 

## I want to replace all the notes with custom glyphs/symbols. How can I do that?

After your call to renderAbc(), search for all items with the class "abcjs-note" and replace the path in them with your picture.
For this to work, call renderAbc with the parameter { add_classes: true }. Notice there are other things you can search for, like the staff line of the note so you can have different pictures for different notes.

## How can I manipulate the horizontal positioning of the notes — e.g., if I want the notes to be horizontally centered?

You can use `%%staffwidth 400` to pick the number of pixels that the staff will take. You can experiment with that to get it to look right. You can also use `%%stretchlast` to stretch the last line of music out. Also, `staffwidth` can be passed in to the `renderAbc` function. Also, see the wrap.html demo.

## I’m having difficulty transposing my tune.
Visual and audio transposition are handled separately to suit situations where a musician might want the sheet music transposed but not the audio playback, and vice-versa. For examples of how to handle both forms of transposition, see basic-transpose.html and editor-transpose.html.
