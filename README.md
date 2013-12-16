abcjs
=====

javascript for rendering abc music notation

This library makes it easy to incorporate sheet music into your websites. You can also turn visible ABC text into sheet music on websites that you don't own using a greasemonkey script, or change your own website that contains ABC text with no other changes than the addition of this javascript file.

For a demo of what this can do, see the following:
---

    http://drawthedots.com/abcjs
    http://drawthedots.com/abcplugin

The abcjs libraries come in three basic flavors:
---

    abcjs basic: Call the library from javascript, passing the abc string to it.
    abcjs editor: transforms a textarea into an abc editor with score sheet and audio.
    abcjs plugin: adds onto a webpage, rendering all abc it finds. 

Which flavor should you use?
---

If you are writing significant JavaScript on your site, and you are generating the music yourself, then you probably want to use `abcjs-basic`. This gives you the most control over the generation.

If you are allowing the user to enter music using ABC notation, whether a whole tune or a fragment, then you probably want to use `abcjs-editor`. This is just like the basic version, except that it adds the ability for the music generator to watch a textarea and output what the user puts there.

If you already have ABC notation on your page and don't want to modify the page more than you have to, then you can use `abcjs-plugin`, which will render all ABC that it finds on the page on page load, simply by including one line: the line to include the script.

If you are looking at someone else's website and see ABC on the page and want to see what it looks like in standard notation, you can install the greasemonkey script in FireFox or Chrome and it will render the ABC for you.

Websites using abcjs:
---

    http://www.drawthedots.com (editor)
    http://www.tradzone.net/forum (plugin) (sample page)
    http://http://abcnotation.com/forums (plugin) (sample page)
    http://www.pmwiki.org/wiki/Cookbook/AbcTunebook (plugin and editor) (this is an addon for pmwiki for creating tune books)
    http://www.tunepal.org (basic)
    http://people.opera.com/howcome/2010/video/norway/ (Demoed during a keynote at Google I/O 2010 by Håkon Wium Lie, CTO of Opera)
    http://www.bestmusicteacher.com/ > left menu > music theory (Educational)
    http://www.eastofcleveland.com/flashcards/notereading.php (Educational)
    https://sightreadingfactory.com (Educational)
    http://tunearch.org 

Some notes:
---

    ABC 1.6 is pretty much implemented
    Very simple multi-voice ABC and other features beyond ABC 1.6 are slowly making their way in, based on the behaviour of abcm2ps
    Midi playback is at a very early stage and does not yet feature ornamentation, dynamics, chords or multi voice.
    Midi playback will not work in Internet Explorer 
    
API Changes for Version 1.3
===

There is a new public entry point that is designed for those who want some information about what is in a tunebook before processing it.

```JavaScript
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

```
tunebook	This is contents of the text file containing one or more ABC-formatted tunes, plus global header info, and inter-tune text.
book.header	This is all of the text that appears before the first tune starts in the file.
book.tunes.length	This is how many tunes are in that file.
book.tunes[i].title	This is the first title found for the particular tune. White space is trimmed from both the beginning and end.
book.tunes[i].abc	This is the particular tune with the global header information added to it. This is what should be passed to the parser in most cases.
book.tunes[i].pure	This is the particular tune without the header.
book.tunes[i].id	This is the id (that is, the text on the X: line). White space is trimmed from both the beginning and end.
book.getTuneById	This will find the FIRST tune in the tune book with the id.
book.getTuneByTitle	This will find the FIRST tune in the tune book with the title.
```

API Changes for Version 1.1
===

IMPORTANT: Version 1.1 has removed all globals and any side effects of ABCJS except for this single global:

```JavaScript
window.ABCJS
```

This means that you will have to modify your pages to use the new syntax. All of the old entry points are still available with a slightly different name. Here is a list of all recommended entry points:

```
New name						Old name
ABCJS.numberOfTunes	numberOfTunes
ABCJS.renderAbc			renderABC
ABCJS.renderMidi			renderMidi
ABCJS.Editor					ABCEditor
ABCJS.plugin					abc_plugin
```

abcjs editor
---

The abcjs editor transforms an html textarea into an area for editing abc. See: http://drawthedots.com/abcjs

Typical usage would be:

```html
<script src="abcjs_editor_X.X-min.js" type="text/javascript"></script>
<script type="text/javascript">
        window.onload = function() {
                abc_editor = new ABCJS.Editor("abc", { canvas_id: "canvas0", midi_id:"midi", warnings_id:"warnings" });
        }
</script>
```

The ABCJS.Editor constructor takes the following parameters:

    textarea_id -- the id of the textarea to be converted
    options -- a hashtable which may include some, all or none of the following options:
        canvas_id -- the id of the html element within which the abc should be rendered (when absent, it is rendered immediately above the textarea)
        generate_midi -- boolean indicating whether a midi player should be generated (by default it is assumed to be false; if no midi_id is present, the player will be generated above the rendered score)
        midi_id -- the id of the html element within which the midi player should be added (if this key is present, generate_midi is assumed to be true)
        generate_warnings -- boolean indicating whether abc syntax warnings should be shown (by default it is assumed to be false; if no warnings_id is present, they are shown above the rendered score)
        warnings_id -- the id of the html element within which abc syntax warnings should be added (if this key is present, generate_warnings is assumed to be true)
        parser_options -- a hashtable of options to pass to the parser
        midi_options -- a hashtable of options to pass to the midi creator (see MidiOptions) since 1.0.2 

abcjs plugin
---

The abcjs plugin renders all the abc in a page (determined as a new line beginning with X:). See: http://drawthedots.com/abcplugin

To use, include the plugin version in the page:

```html
<script src="abcjs_plugin_X.X-min.js" type="text/javascript"></script>
```

The abcjs plugin currently uses the JQuery library and may conflict with other libraries. If you are using other libraries which expose a $ function, you can include (since 1.0.2):

```html
<script type="text/javascript">
  jQuery.noConflict();
</script>
```

Certain options for the plugin can be changed

```html
<script type="text/javascript">
  ABCJS.plugin["show_midi"] = false;
  ABCJS.plugin["hide_abc"] = true;
</script>
```

The options available in abc_plugin are:

    show_midi -- whether midi should be rendered or not (true by default)
    hide_abc -- whether the abc text should be hidden or not (false by default) since 1.0.2
    render_before - whether the rendered score should appear before the abc text (false by default) since 1.0.2
    midi_options -- a hashtable of options to pass to the midi creator (see MidiOptions) since 1.0.2
    auto_render_threshold -- number of tunes beyond which auto rendering is disabled; instead, each tune is accompanied by a "show" button (default value is 20) since 1.0.2
    show_text -- text to be included on the "show" button before the tune title (default value is "show score for: ") since 1.0.2 

When abcjs plugin finds an abctune, it wraps a div.abctext around it and renders it into a div.abcrendered. The show button is an a.abcshow. These hooks can be used for styling. since 1.0.2
Basic abcjs

You can also run your own abcjs webapp using the abcjs_basic lib.

(To use the ABCJS.parse.Parser and ABCJS.write.Writer constructors independently of the abcjs editor and abcjs plugin, see how they are used in abcjs editor.)

There are these functions that make it easy to render the sheet music and the midi:

```javascript
ABCJS.numberOfTunes(abcString);
ABCJS.renderAbc(div, abcString, parserParams, printerParams, renderParams);
ABCJS.renderMidi(div, abcString, parserParams, midiParams, renderParams);
```

most users won't need to make any other call. The first call simply does the minimum of parsing of an abcString to see how many tunes are in it, and returns that number.

PARAMETERS:

```
div 			either a string representing an element on the page where you want the output, or the actual element where you want the output, or an array of the above when the ABC passed is more than one tune.
abcString 			the string containing the ABC. This can be a single tune or multiple tunes separated by an X line.
parserParams 	parameter 	default 	meaning
	print 	false 	pay attention to margins and other formatting commands that don't make sense in a web page
	header_only 	false 	only parse the header
	stop_on_warning 	false 	only parse until the first warning is encountered
printerParams
	scale 	1 	if the number passed is between zero and one, then the music is printed smaller, if above one, then it is printed bigger
	staffwidth 	740 	the width of the music, in pixels
	paddingtop 	15 	the spacing that the music should have on the webpage
	paddingbottom 	30 	the spacing that the music should have on the webpage
	paddingright 	50 	the spacing that the music should have on the webpage
	paddingleft 	15 	the spacing that the music should have on the webpage
	editable 	false 	if true, then when a note is clicked, it is highlighted and a callback allows the editor to move the cursor
midiParams
	qpm 	180 	the tempo, if not specified in abcString
	program 	2 	the midi program to use, if not specified in abcString
renderParams
	startingTune 	0 	the index of the tune in the tunebook to render (starting at zero for the first tune)
```

Note: if there are more tunes in the abcString than there are divs passed in, then the remaining tunes are ignored. If there are more divs than tunes in the abcString, then the unused divs are cleared.

Using abcjs without bundled libraries
---

```
By default, abcjs libraries come bundled with the following libraries.
abcjs_editor: 	 raphael.js
abcjs_plugin: 	raphael.js, JQuery
abcjs_plugin-nojquery: raphael.js
```

If you already include raphael in your site, tell us and we will make available downloads which do not bundle in the external libraries.
