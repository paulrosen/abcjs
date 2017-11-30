# abcjs

**javascript for rendering abc music notation**

**Special note for Version 3.2.0:**

abcjs is proud to announce that it can now be installed with `npm`. Instead of including the minimized files on your page, you can use the library by doing the following in your project:
```bash
npm install --save abcjs
```

Note that the minimized versions will still be maintained, so you can still copy the minimized file to your project.

**Special notes for Version 3.0:**

In-browser [MIDI](/midi.md) is now supported. There are some extra dependencies when using that feature. Downloadable MIDI is still supported with no extra dependencies.

**Important Resources:**
 
[abcjs Home page](https://abcjs.net)

[API Documentation](/api.md)

[Support of the ABC standard](/abc-notation.md)

This library makes it easy to incorporate **sheet music** into your **websites**. You can also turn visible **ABC** text into sheet music on websites that you don't own using a greasemonkey script, or change your own website that contains ABC text with no other changes than the addition of this javascript file.

License: [The MIT License (MIT)](http://opensource.org/licenses/MIT)

**For a demo of what this library can do, see the following:**

## The abcjs libraries come in three basic flavors:

| Library Name | Description | Demo |
| ------------- | ----------- | ----------- |
| abcjs basic | Call the library from javascript, passing the abc string to it. | [Basic](https://abcjs.net/abcjs-basic.html) |
| abcjs editor | Transforms a textarea into an abc editor with score sheet and audio. | [Editor](https://abcjs.net/abcjs-editor.html) |
| abcjs plugin | Adds onto an existing webpage, rendering all abc it finds. | [Plugin](https://abcjs.net/abcjs-plugin.html) |

## Which flavor should you use?

If you are in the node ecosystem, simply install the packaged version with `npm install --save abcjs` and ignore the rest of these instructions.

If you are writing significant JavaScript on your site, and you are generating the music yourself, then you probably want to use `abcjs-basic`. This gives you the most control over the generation.

If you are allowing the user to enter music using ABC notation, whether a whole tune or a fragment, then you probably want to use `abcjs-editor`. This is just like the basic version, except that it adds the ability for the music generator to watch a textarea and output what the user puts there.

If you are using Rails, you can just use this gem: [abcjs-rails](https://github.com/paulrosen/abcjs-rails) This is the same code, but it has been packaged for you to use with the asset pipeline.

If you already have ABC notation on your page and don't want to modify the page more than you have to, then you can use `abcjs-plugin`, which will render all ABC that it finds on the page on page load, simply by including one line: the line to include the script. Another use of this is if you have a comment section on a blog, then you can allow users to post ABC tunes and they will appear as sheet music automatically.

If you are looking at someone else's website and see ABC on the page and want to see what it looks like in standard notation, you can install the greasemonkey script in FireFox or Chrome and it will render the ABC for you.

## MIDI considerations

**NOTE: The mechanism for generating MIDI has changed. You can create a download link for MIDI without extra preparation, but if you'd like to have MIDI controls for listening inline, then see [MIDI Setup](/midi.md)

## Downloads:

[Release Notes](RELEASE.md)

Here are the latest versions. You can just download one of these:

- [Basic](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_basic_midi_3.2.1-min.js)

- [Editor](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_editor_midi_3.2.1-min.js)

- [Plugin](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_plugin_3.2.1-min.js)

- [Greasemonkey script](https://raw.github.com/paulrosen/abcjs/master/bin/abcjs_plugin_3.2.1.user.js)

**Great big thanks to [mudcube](https://github.com/mudcube/MIDI.js) for the excellent work on midi.js!**

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

## Some notes:

* ABC 1.6 is pretty much implemented.
* Many of the new features of ABC 2.1 are being implemented now.
* The old support for MIDI using QuickTime is removed and midi.js is used instead.

# API Changes for Version 3.0

* Added viewPortHorizontal and scrollHorizontal to the renderParams.
* Add class "slur" to slurs and ties.
* Add "hint measure"
* Allow scrolling in the animation.
* Handle %%titlecaps directive.
* Add curly brace to indicate piano part (with inspiration from Anthony P. Pancerella).
* Add invisible marker to the top of each system so that it can be found easily.
* Add an option to put each line in a separate svg so that browsers will paginate correctly.

# API Changes for Version 3.0 Beta

* The default MIDI program has been changed to "0".

* There are a number of new MIDI parameters. 

# API Changes for Version 1.11

"Bouncing Ball" cursor:

	ABCJS.startAnimation(paper, tune, options)
		paper: the output div that the music is in.
		tune: the tune object returned by renderAbc.
		options: a hash containing the following:
			hideFinishedMeasures: true or false [ false is the default ]
			showCursor: true or false [ false is the default ]
			bpm: number of beats per minute [ the default is whatever is in the Q: field ]

`renderABC()` now returns the object that was created by the process. This allows further processing.

`highlight()` and `unhighlight()` now can be passed an optional class name and color.

Descriptive classes to all SVG elements: If you include `{ add_classes: true }` in the rendering params,
then a set of classes are applied to each SVG element so they can be manipulated with css.

# API Changes for Version 1.3

There is a new public entry point that is designed for those who want some information about what is in a tunebook before processing it.

```JavaScript
// Tunebook is the contents of the text file containing one or more
// ABC-formatted tunes, plus global header info, and inter-tune text.
var book = new ABCJS.TuneBook(tunebook);

var fileHeader = book.header;
var numberOfTunes = book.tunes.length;

for (var i = 0; i < numberOfTunes; i++) {
    var title = book.tunes[i].title;
    var tuneAndHeader = book.tunes[i].abc;
    var justTheTune = book.tunes[i].pure;
    var id = book.tunes[i].id;
}

var tune = book.getTuneById(id);
tune = book.getTuneByTitle(title);
```

The variable `book` contains:

| Member | Description |
| ------------- | ----------- |
| book.header | This is all of the text that appears before the first tune starts in the file. |
| book.tunes.length | This is how many tunes are in that file. |
| book.tunes[i].title | This is the first title found for the particular tune. White space is trimmed from both the beginning and end. |
| book.tunes[i].abc | This is the particular tune with the global header information added to it. This is what should be passed to the parser in most cases. |
| book.tunes[i].pure | This is the particular tune without the header. |
| book.tunes[i].id | This is the id (that is, the text on the X: line). White space is trimmed from both the beginning and end. |
| book.getTuneById | This will find the FIRST tune in the tune book with the id. |
| book.getTuneByTitle | This will find the FIRST tune in the tune book with the title. |


# API Changes for Version 1.1

IMPORTANT: Version 1.1 has removed all globals and any side effects of ABCJS except for this single global:

```JavaScript
window.ABCJS
```

This means that you will have to modify your pages to use the new syntax. All of the old entry points are still available with a slightly different name. Here is a list of all recommended entry points:

|New name|Old name|
| ------------- | ----------- |
|ABCJS.numberOfTunes|numberOfTunes|
|ABCJS.renderAbc|renderABC|
|ABCJS.renderMidi|renderMidi|
|ABCJS.Editor|ABCEditor|
|ABCJS.plugin|abc_plugin|

