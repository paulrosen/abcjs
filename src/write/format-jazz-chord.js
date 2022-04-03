function formatJazzChord(chordString) {
	// This puts markers in the pieces of the chord that are read by the svg creator.
	// After the main part of the chord (the letter, a sharp or flat, and "m") a marker is added. Before a slash a marker is added.
	var lines = chordString.split("\n");
	for (var i = 0; i < lines.length; i++) {
		var chord = lines[i];
		// If the chord isn't in a recognizable format then just skip the formatting.
		var reg = chord.match(/^([ABCDEFG][♯♭]?)?([^\/]+)?(\/[ABCDEFG][#b♯♭]?)?/);
		if (reg)
			lines[i] = (reg[1]?reg[1]:'') + "\x03" + (reg[2]?reg[2]:'')  + "\x03" + (reg[3]?reg[3]:'');
	}
	return lines.join("\n");
}

module.exports = formatJazzChord;
