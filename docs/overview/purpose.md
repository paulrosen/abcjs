# Purpose

This library makes it easy to incorporate **sheet music** into your **websites**. It is primarily aimed at **javascript developers**. The amount of javascript required for simple uses is very small, though, so one doesn't need to be an expert.

## Uses

* Draw arbitrary sheet music.

* Instantly modify the music.

* Do animation effects with the drawn music.

* Style the music using CSS.

* Create synthesized audio for the music.

* Search for **ABC** formatted strings on a webpage (for instance in post or comments on a blog) and turn them into sheet music.

* Allow the user to modify the music instantly by typing an **ABC** string.

## NOT

* It does not provide a visual editor (although it could be used as a basis if you want to write one.)

## Open Source Apps that require no programming

* If you just want to render your abc but aren't trying to make an entire website, there are a number of openly accessible apps that you can use. 

* For working with tunes in the browser, see [the Editor](https://editor.drawthedots.com). 

* Also see Michael Eskin's [ABC Tools](https://michaeleskin.com/abctools/abctools.html) for a much more fully-featured editor.

* If you are using VSCode, there is an extension that you install. Get to the extension panel with shift-cmd-X, then search for "abcjs". Once you install that you can see the notation rendered as you type in a file. To use it, open your tune file (ending in `.abc`) and type shift-cmd-P to get the command pallet. Search for "abcjs" to open the preview pane.

## Browser/device support

* The visual part of this library is supported from IE9 and newer, Safari 5.1 and newer, and all modern browsers.

* This synth audio part of this library does not work on IE, but works on any system that supports `AudioContext.resume` and `Promises`. That is, any browser newer than Firefox 40, Safari 9.1, Edge 13, and Chrome 43.

## Supported by BrowserStack

If you aren't using the same browser and machine that I use, you can thank [BrowserStack](https://browserstack.com/) for their support of this open-source project.

![BrowserStack](https://paulrosen.github.io/abcjs/img/browserstack-logo-600x315.png)

## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT)
