//    abc_parse_book.js: parses a string representing ABC Music Notation into a usable internal structure.

import parseCommon from './abc_common';

var bookParser = function (book: any) {
  "use strict";

  var directives = "";
  var initialWhiteSpace = book.match(/(\s*)/);
  // @ts-expect-error TS(2339): Property 'strip' does not exist on type '{}'.
  book = parseCommon.strip(book);
  var tuneStrings = book.split("\nX:");
  // Put back the X: that we lost when splitting the tunes.
  for (var i = 1; i < tuneStrings.length; i++)
    tuneStrings[i] = "X:" + tuneStrings[i];
  // Keep track of the character position each tune starts with. If the string starts with white space, count that, too.
  var pos = initialWhiteSpace ? initialWhiteSpace[0].length : 0;
  var tunes: any = [];
  // @ts-expect-error TS(2339): Property 'each' does not exist on type '{}'.
  parseCommon.each(tuneStrings, function (tune: any) {
    tunes.push({ abc: tune, startPos: pos });
    pos += tune.length + 1; // We also lost a newline when splitting, so count that.
  });
  // @ts-expect-error TS(2339): Property 'startsWith' does not exist on type '{}'.
  if (tunes.length > 1 && !parseCommon.startsWith(tunes[0].abc, "X:")) {
    // If there is only one tune, the X: might be missing, otherwise assume the top of the file is "intertune"
    // There could be file-wide directives in this, if so, we need to insert it into each tune. We can probably get away with
    // just looking for file-wide directives here (before the first tune) and inserting them at the bottom of each tune, since
    // the tune is parsed all at once. The directives will be seen before the engraver begins processing.
    var dir = tunes.shift();
    var arrDir = dir.abc.split("\n");
    // @ts-expect-error TS(2339): Property 'each' does not exist on type '{}'.
    parseCommon.each(arrDir, function (line: any) {
      // @ts-expect-error TS(2339): Property 'startsWith' does not exist on type '{}'.
      if (parseCommon.startsWith(line, "%%")) directives += line + "\n";
    });
  }
  var header = directives;

  // Now, the tune ends at a blank line, so truncate it if needed. There may be "intertune" stuff.
  // @ts-expect-error TS(2339): Property 'each' does not exist on type '{}'.
  parseCommon.each(tunes, function (tune: any) {
    var end = tune.abc.indexOf("\n\n");
    if (end > 0) tune.abc = tune.abc.substring(0, end);
    tune.pure = tune.abc;
    tune.abc = directives + tune.abc;

    // for the user's convenience, parse and store the title separately. The title is between the first T: and the next \n
    tune.title = "";
    var title = tune.pure.split("T:");
    if (title.length > 1) {
      title = title[1].split("\n");
      // @ts-expect-error TS(2339): Property 'strip' does not exist on type '{}'.
      tune.title = parseCommon.strip(title[0]);
    }

    // for the user's convenience, parse and store the id separately. The id is between the first X: and the next \n
    var id = tune.pure.substring(2, tune.pure.indexOf("\n"));
    // @ts-expect-error TS(2339): Property 'strip' does not exist on type '{}'.
    tune.id = parseCommon.strip(id);
  });

  return {
    header: header,
    tunes: tunes
  };
};

export default bookParser;
