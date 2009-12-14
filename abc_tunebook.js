/**
 * @author paulrosen
 */

var AbcTuneBook = Class.create({
	initialize: function (book) {
		book = book.strip();
		this.tunes = book.split("\nX:");
		if (!this.tunes[0].startsWith("X:"))
			this.tunes[0] = "X:1\n" + this.tunes[0];	// X: is implied if it doesn't exist.
		this.tunes.each(function(tune) {
			tune = tune.strip();
		});
		for (var i = 1; i < this.tunes.length; i++)	// Put back the X: that we lost when splitting the tunes.
			this.tunes[i] = "X:" + this.tunes[i];
	}
});
