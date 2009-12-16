/**
 * @author paulrosen
 */

var AbcTuneBook = Class.create({
	initialize: function (book) {
		var This = this;
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
		if (This.tunes.length > 1 && !This.tunes[0].abc.startsWith('X:'))	// If there is only one tune, the X: might be missing, otherwise assume the top of the file is "intertune"
			This.tunes.shift();
		// Now, the tune ends at a blank line, so truncate it if needed. There may be "intertune" stuff.
		This.tunes.each(function(tune) {
			var end = tune.abc.indexOf('\n\n');
			if (end > 0)
				tune.abc = tune.abc.substring(0, end);
		});
	}
});
