/**
 * @author paulrosen
 */

/*global Class */
/*extern AbcTuneBook */

var AbcTuneBook = Class.create({
	initialize: function (book) {
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
});
