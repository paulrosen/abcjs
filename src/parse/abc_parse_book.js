//    abc_parse_book.js: parses a string representing ABC Music Notation into a usable internal structure.
//    Copyright (C) 2010-2020 Paul Rosen (paul at paulrosen dot net)
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import parseCommon from './abc_common';

var bookParser = function(book) {
	"use strict";

	var directives = "";
	book = parseCommon.strip(book);
	var tuneStrings = book.split("\nX:");
	// Put back the X: that we lost when splitting the tunes.
	for (var i = 1; i < tuneStrings.length; i++)
		tuneStrings[i] = "X:" + tuneStrings[i];
	// Keep track of the character position each tune starts with.
	var pos = 0;
	var tunes = [];
	parseCommon.each(tuneStrings, function(tune) {
		tunes.push({ abc: tune, startPos: pos});
		pos += tune.length + 1; // We also lost a newline when splitting, so count that.
	});
	if (tunes.length > 1 && !parseCommon.startsWith(tunes[0].abc, 'X:')) {	// If there is only one tune, the X: might be missing, otherwise assume the top of the file is "intertune"
		// There could be file-wide directives in this, if so, we need to insert it into each tune. We can probably get away with
		// just looking for file-wide directives here (before the first tune) and inserting them at the bottom of each tune, since
		// the tune is parsed all at once. The directives will be seen before the engraver begins processing.
		var dir = tunes.shift();
		var arrDir = dir.abc.split('\n');
		parseCommon.each(arrDir, function(line) {
			if (parseCommon.startsWith(line, '%%'))
				directives += line + '\n';
		});
	}
	var header = directives;

	// Now, the tune ends at a blank line, so truncate it if needed. There may be "intertune" stuff.
	parseCommon.each(tunes, function(tune) {
		var end = tune.abc.indexOf('\n\n');
		if (end > 0)
			tune.abc = tune.abc.substring(0, end);
		tune.pure = tune.abc;
		tune.abc = directives + tune.abc;

		// for the user's convenience, parse and store the title separately. The title is between the first T: and the next \n
		tune.title = "";
		var title = tune.pure.split("T:");
		if (title.length > 1) {
			title = title[1].split("\n");
			tune.title = parseCommon.strip(title[0]);
		}

		// for the user's convenience, parse and store the id separately. The id is between the first X: and the next \n
		var id = tune.pure.substring(2, tune.pure.indexOf("\n"));
		tune.id = parseCommon.strip(id);
	});

	return {
		header: header,
		tunes: tunes
	};
};

export default bookParser;
