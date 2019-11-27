# Purpose

This library makes it easy to incorporate **sheet music** into your **websites**. You can also turn visible **ABC** text into sheet music on websites that you don't own using a greasemonkey script, or change your own website that contains ABC text with no other changes than the addition of one javascript file. You can also generate **MIDI files** or play them directly in your browser.

License: [The MIT License (MIT)](http://opensource.org/licenses/MIT)

## Browser/device support

* The visual part of this library is supported from IE9 and newer, Safari 5.1 and newer, and all modern browsers.

* The MIDI-audio part of this library is much more limited: it doesn't work in IE, it only works in Safari 10 and newer, it does NOT work in Edge, but does work fine in all other modern browsers.
Note that it takes computer resources to play the sound, so a sufficiently fast computer is needed. Research is being done to improve the performance in future versions.

* This synth audio part of this library does not work on IE, but works on any system that supports `AudioContext` and `Promises`. That is, most browsers.

## Supported by BrowserStack
If you aren't using the same browser and machine that I use, you can thank [BrowserStack](https://browserstack.com/) for their support of this open-source project.

![BrowserStack](https://cdn.rawgit.com/paulrosen/abcjs/master/docs/browserstack-logo-600x315.png)

