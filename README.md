![abcjs](https://cdn.rawgit.com/paulrosen/abcjs/master/docs/abcjs_comp_extended_08.svg)

# Javascript library for rendering standard music notation in a browser.

This library makes it easy to incorporate **sheet music** into your **websites**. You can also turn visible **ABC** text into sheet music on websites that you don't own using a greasemonkey script, or change your own website that contains ABC text with no other changes than the addition of one javascript file. You can also generate **MIDI files** or play them directly in your browser.

## Browser/device support

* The visual part of this library is supported from IE9 and newer, Safari 5.1 and newer, and all modern browsers.

* The MIDI-audio part of this library is much more limited: it doesn't work in IE, it only works in Safari 10 and newer, it does NOT work in Edge, but does work fine in all other modern browsers.
Note that it takes computer resources to play the sound, so a sufficiently fast computer is needed. Research is being done to improve the performance in future versions.

* This synth audio part of this library does not work on IE, but works on any system that supports `AudioContext` and `Promises`. That is, most browsers.

## **Special note for Version 5.8.0:**

A new method for creating synth sound is included as a **beta** release in this release. See [Synth Documentation](docs/synth.md) for details in how to use it. That means that the current method of creating sound using midi.js will be deprecated at some point in the future. It will be supported in its current form as long as possible. The new synth is much smaller and faster and appears less buggy. It does not work on IE 11 or older browsers, however, so it might not yet be appropriate for your site.

## **Special notes for Version 5.0.0:**

### Raphael
* The dependency on the Raphael library has been removed! This has made the minimized package 90K smaller, and has increased the speed of generating the SVG image by about 6 times!

For the most common use of creating either the sheet music or the audio, there isn't any change.

However, if you use the animation callback in the audio to manipulate the notes, then be aware that, instead of receiving elements that are wrapped in a Raphael object, you now receive the actual
SVG element. For the most common example of the animation functionality, the following was recommended to change the color of notes:
```
element.attr({ fill: color });
```
That should be changed to:
```
element.setAttribute("fill", color);
```

* If you do specific manipulation of the SVG, you will need to retest your code. The generated SVG, while it looks the same on the page, has changed somewhat. The selectors you use may return different results.

## **Special notes for Version 4.0.0:**

* **BREAKING CHANGE**: The names of all the classes that are generated are now prefixed with `abcjs-`. Any code that searched for particular class names before will have to be adjusted.

* The parameters have been combined into one set of parameters, instead of three sets like previous versions. The old way of calling the parameters will still work, but you are encouraged to use the new, simplified approach going forward.

## Important Resources:
 
[abcjs Home page](https://abcjs.net) (Overview of what this library does)

[Configurator](https://configurator.abcjs.net) (Experiment with all configuration options)

[API Documentation](docs/api.md) (All the details about using abcjs)

[Special Notes](docs/special-notes.md) (Notes from previous versions)

[Info for abcjs contributors](docs/contributing.md) (Info about how abcjs is built and managed)

[Support of the ABC standard](docs/abc-notation.md) (How abcjs varies from the ABC standard)

[Release Notes](RELEASE.md)

License: [The MIT License (MIT)](http://opensource.org/licenses/MIT)

## Demos:

| Description | Demo |
|  ----------- | ----------- |
| Demonstration of all configuration options | [Configurator](https://configurator.abcjs.net) |
| Call the library from javascript, passing the abc string to it. | [Basic](https://abcjs.net/abcjs-basic.html) |
| Transforms a textarea into an abc editor with score sheet and audio. | [Editor](https://abcjs.net/abcjs-editor.html) |
| Adds onto an existing webpage, rendering all abc it finds. | [Plugin](https://abcjs.net/abcjs-plugin.html) |
| Various simple demos | [examples](examples) |
| Examples in complete Vue.js project (search for all the projects with the name in the form `vue-abcjs-****-demo`) | [GitHub](https://github.com/paulrosen) |

## Which flavor should you use?

### node.js

If you are in the node ecosystem, simply install the packaged version with `npm install --save abcjs`.

To import, use one of:
```
import abcjs from "abcjs";
import abcjs from "abcjs/midi";
```

The first is a smaller package, but does not do midi. The second is a superset of the first, **so do not load both!**

To get the styles for the MIDI control:
```
import 'abcjs/abcjs-midi.css';
```

### Old-style minimized download

If you are writing significant JavaScript on your site, and you are generating the music yourself, or you are allowing the user to enter music using ABC notation, whether a whole tune or a fragment, then you probably want to use `abcjs-basic`. This gives you  control over the generation in a smaller package. It now also supports audio.

If you want to include MIDI playback, then use `abcjs-midi`. This is a superset of the basic version, so just include one or the other. It is a significantly larger package. **Deprecated! You can probably use the basic version now.**

If you already have ABC notation on your page and don't want to modify the page more than you have to, then you can use `abcjs-plugin`, which will render all ABC that it finds on the page on page load, simply by including one line: the line to include the script. Another use of this is if you have a comment section on a blog, then you can allow users to post ABC tunes and they will appear as sheet music automatically.

If you want to use the plugin, but also want MIDI, you can use `abcjs-plugin-midi`. This only works on relatively modern browsers. This also requires some CSS to be added to see the MIDI control.

If you are looking at someone else's website and see ABC on the page and want to see what it looks like in standard notation, you can install the greasemonkey script in FireFox or Chrome and it will render the ABC for you.

Here are the latest versions. You can just download one of these:

- [Basic](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_basic_5.10.3-min.js)

- [Basic+MIDI](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_midi_5.10.3-min.js)

- [Plugin](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_plugin_5.10.3-min.js)

- [Plugin+MIDI](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_plugin-midi_5.10.3-min.js)

- [Greasemonkey script](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_plugin_5.10.3.user.js)

- [Styles for the MIDI control](https://raw.github.com/paulrosen/abcjs/master/abcjs-midi.css)

**NOTE: Do NOT link to these files directly! Upload them to your own server! [Here's why.](https://github.com/blog/1482-heads-up-nosniff-header-support-coming-to-chrome-and-firefox)**

## Partial list of some websites using abcjs:

| Site | Notes |
| ------------- | ----------- |
| https://sightreadingfactory.com | (Educational) |
| https://www.drawthedots.com | (editor) |
| http://www.tradzone.net/forum | (plugin) (sample page) |
| http://abcnotation.com/forums | (plugin) (sample page) |
| http://www.pmwiki.org/wiki/Cookbook/AbcTunebook | (plugin and editor) (this is an addon for pmwiki for creating tune books) |
| http://www.tunepal.org | (basic) |
| http://people.opera.com/howcome/2010/video/norway/ | (Demoed during a keynote at Google I/O 2010 by Håkon Wium Lie, CTO of Opera) |
| http://www.bestmusicteacher.com/ | > left menu > music theory (Educational) |
| http://www.eastofcleveland.com/flashcards/notereading.php | (Educational) |
| http://tunearch.org | |
|http://www.norbeck.nu/abc|(tune collection)|
|http://ccm.secrice.com/|(CCM scores for playing the guitar)|
|http://bushtraditions.wiki/tunes/|(Australian Traditional Music Tunes Archive)|
|https://folktunetransposer.com/||

Let us know if you want to be listed!

**Great big thanks to [mudcube](https://github.com/mudcube/MIDI.js) for the excellent work on midi.js!**

## Supported by BrowserStack
If you aren't using the same browser and machine that I use, you can thank [BrowserStack](https://browserstack.com/) for their support of this open-source project.

![BrowserStack](https://cdn.rawgit.com/paulrosen/abcjs/master/docs/browserstack-logo-600x315.png)
