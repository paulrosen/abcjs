# Getting Started

## Which flavor should you use?

### node.js

If you are in the node ecosystem, simply install the packaged version with:
 
 ```
 npm install --save abcjs
```

To import, use:
```
import abcjs from "abcjs";
```

To get the styles for the audio control:

```
import 'abcjs/abcjs-audio.css';
```

### Old-style minimized download

If you are writing significant JavaScript on your site, and you are generating the music yourself, or you are allowing the user to enter music using ABC notation, whether a whole tune or a fragment, then you probably want to use `abcjs-basic`. This gives you  control over the generation in a smaller package.

If you already have ABC notation on your page and don't want to modify the page more than you have to, then you can use `abcjs-plugin`, which will render all ABC that it finds on the page on page load, simply by including one line: the line to include the script. Another use of this is if you have a comment section on a blog, then you can allow users to post ABC tunes and they will appear as sheet music automatically.

If you are looking at someone else's website and see ABC on the page and want to see what it looks like in standard notation, you can install the greasemonkey script in FireFox or Chrome and it will render the ABC for you.

Here are the latest versions. You can just download one of these:

- [Basic](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_basic_5.10.3-min.js)

- [Plugin](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_plugin_5.10.3-min.js)

- [Greasemonkey script](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_plugin_5.10.3.user.js)

- [Styles for the Audio control](https://raw.github.com/paulrosen/abcjs/master/abcjs-audio.css)

**NOTE: Do NOT link to these files directly! Upload them to your own server! [Here's why.](https://github.com/blog/1482-heads-up-nosniff-header-support-coming-to-chrome-and-firefox)**

When loading the library directly, you will find the library at `window.ABCJS`.

## Simplest Usage

```html
<div id="paper"></div>
```

```javascript
abcjs.renderAbc("paper", "X:1\nK:D\nDDAA|BBA2|\n");
```
