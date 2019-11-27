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
