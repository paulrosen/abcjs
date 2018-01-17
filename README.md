# abcjs

**javascript for rendering abc music notation**

This library makes it easy to incorporate **sheet music** into your **websites**. You can also turn visible **ABC** text into sheet music on websites that you don't own using a greasemonkey script, or change your own website that contains ABC text with no other changes than the addition of one javascript file. You can also generate **MIDI files** or play them directly in your browser.

**Special notes for Version 3.3.0:**

| Important Breaking Change for MIDI users! |
|  ----------- |
| If you were previously using the npm version like this: |
| `import abcjs from "abcjs"` |
| and using the midi functionality, you need to change that to: |
| `import abcjs from "abcjs/midi"` |

* The build process has switched over to webpack. The minimization is now done with UglifyJS. This shouldn't cause any side effects.

* This folder structure has changed dramatically. It shouldn't cause any side effects.

* The "editor" version of the library has been rolled into the "basic" version. There is only the "basic" and "midi" versions now, since the editor code doesn't add much to the size.

* The npm version has a new export called `signature` that gives your javascript code access to some version information.

## Important Resources:
 
[abcjs Home page](https://abcjs.net) (Overview of what this library does)

[API Documentation](docs/api.md) (All the details about using abcjs)

[Special Notes](docs/special-notes.md) (Notes from previous versions)

[Info for abcjs contributors](docs/contributing.md) (Info about how abcjs is built and managed)

[Support of the ABC standard](docs/abc-notation.md) (How abcjs varies from the ABC standard)

[Release Notes](RELEASE.md)

License: [The MIT License (MIT)](http://opensource.org/licenses/MIT)

## Demos:

| Description | Demo |
|  ----------- | ----------- |
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

If you are writing significant JavaScript on your site, and you are generating the music yourself, or you are allowing the user to enter music using ABC notation, whether a whole tune or a fragment, then you probably want to use `abcjs-basic`. This gives you  control over the generation in a smaller package.

If you want to include MIDI playback, then use `abcjs-midi`. This is a superset of the basic version, so just include one or the other. It is a significantly larger package.

If you already have ABC notation on your page and don't want to modify the page more than you have to, then you can use `abcjs-plugin`, which will render all ABC that it finds on the page on page load, simply by including one line: the line to include the script. Another use of this is if you have a comment section on a blog, then you can allow users to post ABC tunes and they will appear as sheet music automatically.

If you are looking at someone else's website and see ABC on the page and want to see what it looks like in standard notation, you can install the greasemonkey script in FireFox or Chrome and it will render the ABC for you.

Here are the latest versions. You can just download one of these:

- [Basic](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_basic_3.3.1-min.js)

- [Basic+MIDI](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_midi_3.3.1-min.js)

- [Plugin](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_plugin_3.3.1-min.js)

- [Greasemonkey script](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_plugin_3.3.1.user.js)

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

Let us know if you want to be listed!

**Great big thanks to [mudcube](https://github.com/mudcube/MIDI.js) for the excellent work on midi.js!**
