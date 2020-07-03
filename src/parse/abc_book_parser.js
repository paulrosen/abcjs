//    abc_parse.js: parses a string representing ABC Music Notation into a usable internal structure.
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

var BookParser = function(book) {
	"use strict";

  var This = this;
  var directives = "";
  book = book.trim();
  var tunes = book.split("\nX:");
  for (var i = 1; i < tunes.length; i++)	// Put back the X: that we lost when splitting the tunes.
    tunes[i] = "X:" + tunes[i];
  // Keep track of the character position each tune starts with.
  var pos = 0;
  This.tunes = [];
  tunes.forEach(function(tune) {
    This.tunes.push({ abc: tune, startPos: pos});
    pos += tune.length + 1; // We also lost a newline when splitting, so count that.
  });
  if (This.tunes.length > 1 && !This.tunes[0].abc.startsWith('X:')) {	// If there is only one tune, the X: might be missing, otherwise assume the top of the file is "intertune"
    // There could be file-wide directives in this, if so, we need to insert it into each tune. We can probably get away with
    // just looking for file-wide directives here (before the first tune) and inserting them at the bottom of each tune, since
    // the tune is parsed all at once. The directives will be seen before the engraver begins processing.
    var dir = This.tunes.shift();
    var arrDir = dir.abc.split('\n');
    arrDir.forEach(function(line) {
      if (line.startsWith('%%'))
        directives += line + '\n';
    });
  }
  This.header = directives;

  // Now, the tune ends at a blank line, so truncate it if needed. There may be "intertune" stuff.
  This.tunes.forEach(function(tune) {
    var end = tune.abc.indexOf('\n\n');
    if (end > 0)
      tune.abc = tune.abc.substring(0, end);
    tune.pure = tune.abc;
    tune.abc = directives + tune.abc;

    // for the user's convenience, parse and store the title separately. The title is between the first T: and the next \n
    var title = tune.pure.split("T:");
    if (title.length > 1) {
      title = title[1].split("\n");
      tune.title = title[0].replace(/^\s+|\s+$/g, '');
    } else
      tune.title = "";

    // for the user's convenience, parse and store the id separately. The id is between the first X: and the next \n
    var id = tune.pure.substring(2, tune.pure.indexOf("\n"));
    tune.id = id.replace(/^\s+|\s+$/g, '');
  });
  return This.tunes;
};

module.exports = BookParser
