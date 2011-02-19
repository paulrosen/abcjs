//    abc_tunebook.js: splits a string representing ABC Music Notation into individual tunes.
//    Copyright (C) 2010 Paul Rosen (paul at paulrosen dot net)
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*extern AbcTuneBook, renderAbc */

function AbcTuneBook(book) {
	var This = this;
	var directives = "";
	book = book.strip();
	var tunes = book.split("\nX:");
	for (var i = 1; i < tunes.length; i++)	// Put back the X: that we lost when splitting the tunes.
		tunes[i] = "X:" + tunes[i];
	// Keep track of the character position each tune starts with.
	var pos = 0;
	This.tunes = [];
	tunes.each(function(tune) {
		This.tunes.push({ abc: tune, startPos: pos});
		pos += tune.length;
	});
	if (This.tunes.length > 1 && !This.tunes[0].abc.startsWith('X:')) {	// If there is only one tune, the X: might be missing, otherwise assume the top of the file is "intertune"
		// There could be file-wide directives in this, if so, we need to insert it into each tune. We can probably get away with
		// just looking for file-wide directives here (before the first tune) and inserting them at the bottom of each tune, since
		// the tune is parsed all at once. The directives will be seen before the printer begins processing.
		var dir = This.tunes.shift();
		var arrDir = dir.abc.split('\n');
		arrDir.each(function(line) {
			if (line.startsWith('%%'))
				directives += line + '\n';
		});
	}
	// Now, the tune ends at a blank line, so truncate it if needed. There may be "intertune" stuff.
	This.tunes.each(function(tune) {
		var end = tune.abc.indexOf('\n\n');
		if (end > 0)
			tune.abc = tune.abc.substring(0, end);
		tune.abc = directives + tune.abc;
	});
}

// A quick way to render a tune from javascript when interactivity is not required.
// This is used when a javascript routine has some abc text that it wants to render
// in a div or collection of divs. One tune or many can be rendered.
//
// parameters:
//		output: an array of divs that the individual tunes are rendered to.
//			If the number of tunes exceeds the number of divs in the array, then
//			only the first tunes are rendered. If the number of divs exceeds the number
//			of tunes, then the unused divs are cleared. The divs can be passed as either
//			elements or strings of ids. If ids are passed, then the div MUST exist already.
// 		(if a single element is passed, then it is an implied array of length one.)
//			(if a null is passed for an element, or the element doesn't exist, then that tune is skipped.)
//		abc: text representing a tune or an entire tune book in ABC notation.
//		renderParams: hash of:
//			startingTune: an index, starting at zero, representing which tune to start rendering at.
//				(If this element is not present, then rendering starts at zero.)
function renderAbc(output, abc, parserParams, printerParams, renderParams) {
    var isArray = function(testObject) {
        return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
    };

	// check and normalize input parameters
	if (output === undefined || abc === undefined)
		return;
	if (!isArray(output))
		output = [ output ];
	if (parserParams === undefined)
		parserParams = {};
	if (printerParams === undefined)
		printerParams = {};
	if (renderParams === undefined)
		renderParams = {};
	var currentTune = renderParams.startingTune ? renderParams.startingTune : 0;

	// parse the abc string
	var book = new AbcTuneBook(abc);
	var abcParser = new AbcParse(parserParams);

	// output each tune, if it exists. Otherwise clear the div.
	for (var i = 0; i < output.length; i++) {
		var div = output[i];
		if (typeof(div) === "string")
			div = document.getElementById(div);
		if (div) {
			div.innerHTML = "";
			if (currentTune < book.tunes.length) {
				abcParser.parse(book.tunes[currentTune].abc);
				var tune = abcParser.getTune();
				var paper = Raphael(div, 800, 400);
				var printer = new ABCPrinter(paper, printerParams);
				printer.printABC(tune);
			}
		}
		currentTune++;
	}
}
