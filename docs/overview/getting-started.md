# Getting Started

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
