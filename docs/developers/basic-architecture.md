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

In a test application. Then any changes made to the abcjs code will automatically be picked up by that test application's webpack.

## Docker

There are docker files included so that npm can be run without installing it. This only applies to someone who wants to keep all their development tools separate on their computer. If you have nodejs installed then you can ignore this.

If you do want to build without development tools installed, but you do have Docker installed, put this in your profile:
```shell script
npm() {
    CMD="${1: } ${2: } ${3: }" docker-compose up
}
```
Then from the root folder you can use `npm` like normal. Note that this won't work if you are from any other folder.

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

And include the file `disst/abcjs-basic-min.js`.

If you want to keep the version numbering on the files (so that different versions are easy to keep straight), after building either `build:basic` or `build:basic-min` run the script:

```bash
npm run build:copy-output
```


## Greasemonkey

There used to be a version of the library for Greasemonkey but that has been discontinued. If you want a Greasemonkey version, do this:
```bash
cat src/plugin/greasemonkey.js bin/abcjs_plugin_5.12.0-min.js > bin/abcjs_plugin_5.12.0.user.js
```

## Testing

There are hundreds of test files that are stored outside of this repository. If you wish to run the unit tests, please contact [Paul Rosen](https://paulrosen.net/contact-me/) for more information.

The files in the folder `test` contain a number of functions that receive an ABC formatted string and output an easy to read dump of the resulting objects.

These objects are at various stages though the process of handling the ABC. The stages are:

1) After parsing the ABC string into an internal object.
2) After laying out the placement of all elements.
3) After putting all elements in the time that they should sound.
4) After creating a set of MIDI instructions.

The method of unit testing is to run all of the test files through the various linters and save the output. Then, after making changes to the code, run the test files through again and compare the output to the original output to understand the effect of the changes.

Here's an example of how to call the linting functions:

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

## Font Info

The glyphs in `src/write/abc_glyphs.js` are generated using the files in the `font_generator` folder.

You can see all the glyphs by loading this file in the browser: `abcjs/font_generator/font_gen.html`.

You can play with the glyphs to help you modify them in this file: `abcjs/font_generator/font_editor.html`
