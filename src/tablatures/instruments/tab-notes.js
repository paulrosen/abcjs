
var TabNote = require('./tab-note');

var notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function tabNotes(fromNote, toNote) {
	//console.log("INIT TabNotes")
	var fromN = new TabNote(fromNote);
	var toN = new TabNote(toNote);
	// check that toN is not lower than fromN
	if (toN.isLowerThan(fromN)) {
		var from = fromN.emit();
		var tn = toN.emit();
		return {
			error: 'Invalid string Instrument tuning : ' +
				tn + ' string lower than ' + from + ' string'
		};
	}
	var buildReturned = [];
	var startIndex = notes.indexOf(fromN.name);
	var toIndex = notes.indexOf(toN.name);
	if ((startIndex == -1) || (toIndex == -1)) {
		return buildReturned;
	}
	var finished = false;
	while (!finished) {
		buildReturned.push(fromN.emit());
		fromN = fromN.nextNote();
		if (fromN.sameNoteAs(toN)) {
			finished = true;
		}
	}
	return buildReturned;
}

module.exports = tabNotes;
