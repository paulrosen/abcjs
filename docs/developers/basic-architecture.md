# Basic Architecture

There are two forms of this library: the npm form and a minimized form for non-npm users.

When testing abcjs changes locally, there is no build step required. A handy way to test is to run:

```
npm link
```

On this folder, and 
```
npm link abcjs
```

in an npm-based test application (like React or Vue). Then any changes made to the abcjs code will automatically be picked up by that test application's webpack.

## Docker

There are docker files included so that npm can be run without installing it. This only applies to someone who wants to keep all their development tools separate on their computer. If you have nodejs installed then you can ignore this.

To run, type:
```bash
./docker-start.sh
```
That will create a linux virtual machine and give you a command line to run npm.

## Building locally

To build the library so that it can be included with a `<script>` tag, there are some options:

To build everything:
```bash
npm run build
```

This takes a little while and is probably building more things than you want.

If you want to build a version that is convenient to debug:

```bash
npm run build:basic
```

Then include the file `dist/abcjs-basic.js`.

To build the same code as minimized for distribution:

```bash
npm run build:basic-min
```

And include the file `dist/abcjs-basic-min.js`.


## Greasemonkey

There used to be a version of the library for Greasemonkey but that has been discontinued. If you want a Greasemonkey version, do this:
```bash
cat src/plugin/greasemonkey.js bin/abcjs_plugin_5.12.0-min.js > bin/abcjs_plugin_5.12.0.user.js
```

## Testing

### End-to-end

There are mocha tests that are run in the browser that test various functionality. They are not close to having enough test coverage, compared to the set of ABC strings described below, but they are easy to use. Contributions to these are welcome.

To run them, open the file `tests/all.html` from a server. This is run on the source code so that changes you make to the source will be immediately reflected in the tests.

To run just one test or a smaller set of them, add `?grep=xxxxx` to run only the tests that match your string.

Most of the tests are run from `all.html`, but the audio tests need to run in real-time and require a user click to start them, so they are in a separate file called `web-audio.html`. In addition, there is a file `browser-compatibility.html` that runs the tests using the built version of the abcjs library so it will run on older browsers.

The rest of the `.html` files are subsets of the tests that are just for convenience if you are working on a particular section.

::: tip Notice
It is not enough to just open the file so that the address bar in the browser shows the `file://` protocol. That will not run the javascript. It must be run in the context of a server.

To start a localhost server in WebStorm, open the file and notice the floating browser icons in the upper right corner. Click on one of them to open the test runner in that browser.

To start a localhost server in VSCode, one way to do that is to install the extension "Live Server" and click "Go Live".
:::

### Testing Intermediate Stages

There are hundreds of test files that are stored outside of this repository. If you wish to run those unit tests, please contact [Paul Rosen](https://paulrosen.net/contact-me/) for more information.

The files in the folder `test` contain a number of functions that receive an ABC formatted string and output an easy to read dump of the resulting objects.

These objects are at various stages though the process of handling the ABC. The stages are:

1) After parsing the ABC string into an internal object.
2) After laying out the placement of all elements.
3) After putting all elements in the time that they should sound.
4) After creating a set of MIDI instructions.

The method of unit testing is to run all of the test files through the various linters and save the output. Then, after making changes to the code, run the test files through again and compare the output to the original output to understand the effect of the changes.

Here's an example of how to call the linting functions:
```
import abcjs from 'abcjs/test';
doTest(abcString) {
	const tuneBook = new abcjs.TuneBook(abcString);
	const abcParser = new abcjs.parse.Parse();
	const parserLint = new abcjs.test.ParserLint();
	const div = document.getElementById("comparison-engraving");
	const engraverController = new abcjs.write.EngraverController(div,
			{add_classes: true, staffwidth: 800, staffheight: 400});

	tuneBook.tunes.forEach((item) => {
		abcParser.parse(item.abc);
		const tune = abcParser.getTune();
		const warnings = abcParser.getWarnings();
		const lint1 = parserLint.lint(tune, warnings);

		engraverController.engraveABC(tune);
		const output = abcjs.test.verticalLint([tune]);
		const lint2 = output.join("\n");

		const sequence = abcjs.midi.sequence(tune);
		const lint3 = abcjs.test.midiSequencerLint(sequence);

		const midi = abcjs.midi.flatten(sequence);
		const lint4 = abcjs.test.midiLint(midi);

		console.log("PARSER OUTPUT");
		console.log(lint1);
		console.log("ENGRAVER OUTPUT");
		console.log(lint2);
		console.log("MIDI SEQUENCE OUTPUT");
		console.log(lint3);
		console.log("MIDI OUTPUT");
		console.log(lint4);
	});
}
```
## Font Info

The glyphs in `src/write/creation/glyphs.js` are generated using the files in the `font_generator` folder.

You can see all the glyphs by loading this file in the browser: `abcjs/font_generator/font_gen.html`.

You can play with the glyphs to help you modify them in this file: `abcjs/font_generator/font_editor.html`
