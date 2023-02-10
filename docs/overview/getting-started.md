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

- [Basic](https://raw.githubusercontent.com/paulrosen/abcjs/main/dist/abcjs-basic-min.js)

- [Plugin](https://raw.githubusercontent.com/paulrosen/abcjs/main/dist/abcjs-plugin-min.js)

- [Styles for the Audio control](https://raw.githubusercontent.com/paulrosen/abcjs/main/abcjs-audio.css)

**NOTE: Do NOT link to these files directly! Upload them to your own server! [Here's why.](https://github.com/blog/1482-heads-up-nosniff-header-support-coming-to-chrome-and-firefox)**

You can also use this CDN: `https://cdn.jsdelivr.net/npm/abcjs@VERSION/dist/abcjs-basic-min.js` where `VERSION` is the version of the library you want to use. Note that I don't maintain those files, so I can't guarantee that will still work in the future.

When loading the library directly, you will find the library at `window.ABCJS`.

## Simplest Usage

```html
<div id="paper"></div>
```

```javascript
abcjs.renderAbc("paper", "X:1\nK:D\nDD AA|BBA2|\n");
```
<render-abc :abc="`X:1\nK:D\nDD AA|BBA2|\n`"></render-abc>