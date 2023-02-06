# Release Notes

Full release notes can be found in the [RELEASE.md](https://github.com/paulrosen/abcjs/blob/main/RELEASE.md) file.

## Notes for Version 6.0.0

There has been a large change in the underlying SVG output. It should look exactly the same, but it will take up much less space. Also a number of inconsistencies in the way classes are applied has been fixed. If you are just using the library to output standard notation, you probably won't notice any difference. However, if you are querying the SVG directly, or setting CSS that targets elements, then you will need to retest.

There has been a change to the data that comes back from the click listener. This includes information if the user has dragged a note.

There are some minor improvements to the spacing of elements. That may slightly change how the music is laid out.

There have been many improvements to the audio quality. More improvements are coming, too!

## Notes for Version 5.9.0

This is a beta version of the new synth method. It is likely there will be some changes to the API in the short run but hopefully not too much.

Please try this out and report any issues that you have.

## **Special note for Version 5.8.0:**

A new method for creating synth sound is included as a **beta** release in this release. See [Synth Documentation](../docs/audio/synthesized-sound.md) for details in how to use it. That means that the current method of creating sound using midi.js will be deprecated at some point in the future. It will be supported in its current form as long as possible. The new synth is much smaller and faster and appears less buggy. It does not work on IE 11 or older browsers, however, so it might not yet be appropriate for your site.

## Special notes for Version 5.0.0:

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

## Special notes for Version 4.0.0:
* **BREAKING CHANGE**: The names of all the classes that are generated are now prefixed with `abcjs-`. Any code that searched for particular class names before will have to be adjusted.

* The parameters have been combined into one set of parameters, instead of three sets like previous versions. The old way of calling the parameters will still work, but you are encouraged to use the new, simplified approach going forward.

## Special notes for Version 3.3.0:

* The build process has switched over to webpack. The minimization is now done with UglifyJS. This shouldn't cause any side effects.

* The "editor" version of the library has been rolled into the "basic" version. There is only the "basic" and "midi" versions now, since the editor code doesn't add much to the size.

* The npm version has a new export called "signature" that gives your javascript code some version information.

* The documentation has all been moved to the `/docs` folder.

* The examples have all been moved to the `/examples` folder.

## Special note for Version 3.2.0:

abcjs is proud to announce that it can now be installed with `npm`. Instead of including the minimized files on your page, you can use the library by doing the following in your project:
```bash
npm install --save abcjs
```

Note that the minimized versions will still be maintained, so you can still copy the minimized file to your project.

## Special notes for Version 3.0:

In-browser [MIDI](/docs/upgrading/midi.md) is now supported. There are some extra dependencies when using that feature. Downloadable MIDI is still supported with no extra dependencies.

## API Changes for Version 3.0

* Added viewPortHorizontal and scrollHorizontal to the renderParams.
* Add class "slur" to slurs and ties.
* Add "hint measure"
* Allow scrolling in the animation.
* Handle %%titlecaps directive.
* Add curly brace to indicate piano part (with inspiration from Anthony P. Pancerella).
* Add invisible marker to the top of each system so that it can be found easily.
* Add an option to put each line in a separate svg so that browsers will paginate correctly.

## API Changes for Version 3.0 Beta

* The default MIDI program has been changed to "0".

* There are a number of new MIDI parameters. 

## API Changes for Version 1.11

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

## API Changes for Version 1.3

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


## API Changes for Version 1.1

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

