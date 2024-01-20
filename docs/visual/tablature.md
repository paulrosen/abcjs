# Tablature

A line of tablature can be placed under a line of standard notation. Tablature is an alternate way
of representing music, usually used for string instruments. You can find many explanations of
how tablature works around the web. The lines of the staff represent the strings on that
instrument and a number is placed instead of a note head to represent which fret is to be played.

Here is a simple example using the options `{tablature: [{instrument: 'violin'}]}`:

<show-and-render-abc :abc="`X:1\nT: Cooley's\nM: 4/4\nL: 1/8\nR: reel\nK: G\n|:D2|EB{c}BA B2 EB|~B2 AB dBAG|FDAD BDAD|FDAD dAFD|\n`" :options="{tablature: [ {instrument: 'violin'}]}">
</show-and-render-abc>

To get tablature to appear, add the option `abcjs.renderAbc("paper", abc, { tablature: [...] }` as described below.

::: tip Credits
Thanks to Jean-Yves Mengant ([@jymen](https://github.com/jymen)) for leading the effort to include tablature and for writing the code. Check out his site [ABCMusicStudio](https://www.jymengant.org/).
:::

## General Structure

The tablature option is an array where each item in the array represents a voice in the music. That is,
if you want to represent tablature for a string quartet, you would structure it like this:

```javascript
abcjs.renderAbc("paper", abc, {
  tablature: [
    {
      // first violin options
    },
    {
      // second violin options
    },
    {
      // viola options
    },
    {
      // cello options
    },
  ],
});
```

If there are more voices in the music than are in the above array, the extra voices will not have tablature. If there are more voices in the above array than in the music, the extra voices will be ignored.

## Tablature options

### instrument

default: undefined

Options: "violin" | "mandolin" | "fiddle" | "guitar" | "fiveString" | ""

This is one of the predefined tablature types. If it is an empty string then that voice is skipped.
If it is an unrecognized instrument type, then the voice is skipped and a warning is added.

(Note that violin, mandolin, and fiddle are synonyms and produce the same output.)

### label

default: undefined

This is the text that is printed underneath the tablature as explanation. Whatever is passed in is printed.

There is a special sequence to add the tuning. If `%T` is present, then the tuning of the strings is inserted, starting
from the lowest pitch. For example:

```javascript
tablature: [
  {
    instrument: "guitar",
    label: "Guitar (%T)",
    tuning: ["D,", "A,", "D", "G", "A", "d"],
  },
];
```

will print the string `Guitar (DADGAD)` under each tablature line.

### tuning

default: The standard tuning for that instrument

This is an array of notes that represent the open strings, starting from the lowest pitch
of the instrument. This is useful for musical styles that use alternate tunings. The following are the
defaults:

```javascript
tablature: [
  {
    instrument: "violin",
    tuning: ["G,", "D", "A", "e"],
  },
  {
    instrument: "guitar",
    tuning: ["E,", "A,", "D", "G", "B", "e"],
  },
];
```

### capo

default: 0

The number of frets that a capo is placed. This will transpose the numbers so that the open
string is on the fret of the capo.

### highestNote

default: `a'`.

This defines the highest note that can be played on that instrument. If a note is out of range a question mark will be printed instead.

### hideTabSymbol

default: `false`.

If this is true then the "TAB" clef will not appear.

## Fonts

You can specify the font of the label and/or the font of the numbers by using the `format` option
when calling `renderAbc`. The new font directive names are `tablabelfont`, `tabnumberfont`, and `tabgracefont`.

This follows the general format of the other font directives.

For example,

```
abcjs.renderAbc("paper", abc, {
	tablature: [
		{
			instrument: "violin"
		}
    ],
    format: {
        tablabelfont: "Helvetica 16 box",
        tabnumberfont: "Times 12"
    }
```

You can also use a preprocessing directive inside the abc string:

```
%%tablabelfont name size italic bold box
%%tabnumberfont name size italic bold
```

## Use with the editor

Include the tablature options as you normally would inside the `abcjsParams` option. See the [editor page](../interactive/interactive-editor.md) for more info.
