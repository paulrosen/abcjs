var { noteToMidi, midiToNote } = require('../../synth/note-to-midi');

/**
 * 
 * Note structure for Tabs
 * 
 */


function TabNote(note, clefTranspose) {
	//console.log("INIT/RENDER TabNote constructor")
	var pitch = noteToMidi(note)
	if (clefTranspose)
		pitch += clefTranspose
	var newNote = midiToNote(pitch);
	var isFlat = false;
	var isSharp = false;
	var isAltered = false;
	var natural = null;
	var quarter = null;
	var isDouble = false;
	var acc = 0;

	if (note.startsWith('_')) {
		isFlat = true;
		acc = -1;
		// check quarter flat
		if (note[1] == '/') {
			isFlat = false;
			quarter = "v";
			acc = 0;
		} else if (note[1] == '_') {
			// double flat
			isDouble = true;
			acc -= 1;
		}
	} else if (note.startsWith('^')) {
		isSharp = true;
		acc = +1;
		// check quarter sharp
		if (note[1] == '/') {
			isSharp = false;
			quarter = "^";
			acc = 0;
		} else if (note[1] == '^') {
			// double sharp
			isDouble = true;
			acc += 1;
		}
	} else if (note.startsWith('=')) {
		natural = true;
		acc = 0;
	}
	isAltered = isFlat || isSharp || (quarter != null);
	if (isAltered || natural) {
		if ((quarter != null) || (isDouble)) {
			newNote = note.slice(2);
		} else {
			newNote = note.slice(1);
		}
	}
	var hasComma = (newNote.match(/,/g) || []).length;
	var hasQuote = (newNote.match(/'/g) || []).length;

	this.pitch = pitch
	this.pitchAltered = 0
	this.name = newNote;
	this.acc = acc;
	this.isSharp = isSharp;
	this.isKeySharp = false;
	this.isDouble = isDouble;
	this.isAltered = isAltered;
	this.isFlat = isFlat;
	this.isKeyFlat = false;
	this.natural = natural;
	this.quarter = quarter;
	this.isLower = (this.name == this.name.toLowerCase());
	this.name = this.name[0].toUpperCase();
	this.hasComma = hasComma;
	this.isQuoted = hasQuote;
}

function cloneNote(self) {
	var newNote = self.name;
	var newTabNote = new TabNote(newNote);
	newTabNote.pitch = self.pitch;
	newTabNote.hasComma = self.hasComma;
	newTabNote.isLower = self.isLower;
	newTabNote.isQuoted = self.isQuoted;
	newTabNote.isSharp = self.isSharp;
	newTabNote.isKeySharp = self.isKeySharp;
	newTabNote.isFlat = self.isFlat;
	newTabNote.isKeyFlat = self.isKeyFlat;
	return newTabNote;
}
TabNote.prototype.sameNoteAs = function (note) {
	//console.log("INIT TabNote sameNoteAs")
	return note.pitch === this.pitch
};

TabNote.prototype.isLowerThan = function (note) {
	//console.log("INIT TabNote isLowerThan")
	return note.pitch > this.pitch
};

TabNote.prototype.checkKeyAccidentals = function (accidentals, measureAccidentals) {
	//console.log("RENDER TabNote checkKeyAccidentals")
	if (this.isAltered || this.natural)
		return
	if (measureAccidentals[this.name.toUpperCase()]) {
		switch (measureAccidentals[this.name.toUpperCase()]) {
			case "__": this.acc = -2; this.pitchAltered = -2; return;
			case "_": this.acc = -1; this.pitchAltered = -1; return;
			case "=": this.acc = 0; this.pitchAltered = 0; return;
			case "^": this.acc = 1; this.pitchAltered = 1; return;
			case "^^": this.acc = 2; this.pitchAltered = 2; return;
		}
	} else if (accidentals) {
		var curNote = this.name;
		for (var iii = 0; iii < accidentals.length; iii++) {
			var curAccidentals = accidentals[iii];
			if (curNote == curAccidentals.note.toUpperCase()) {
				if (curAccidentals.acc == 'flat') {
					this.acc = -1;
					this.isKeyFlat = true;
					this.pitchAltered = -1
				}
				if (curAccidentals.acc == 'sharp') {
					this.acc = +1;
					this.isKeySharp = true;
					this.pitchAltered = 1
				}
			}
		}
	}
};

TabNote.prototype.getAccidentalEquiv = function () {
	//console.log("TabNote getAccidentalEquiv")
	var cloned = cloneNote(this);
	if (cloned.isSharp || cloned.isKeySharp) {
		cloned = cloned.nextNote();
		cloned.isFlat = true;
		cloned.isSharp = false;
		cloned.isKeySharp = false;
	} else if (cloned.isFlat || cloned.isKeyFlat) {
		cloned = cloned.prevNote();
		cloned.isSharp = true;
		cloned.isFlat = false;
		cloned.isKeyFlat = false;
	}
	return cloned;
};


TabNote.prototype.nextNote = function () {
	//console.log("INIT TabNote nextNote")
	var note = midiToNote(this.pitch + 1 + this.pitchAltered)
	return new TabNote(note)
};

TabNote.prototype.prevNote = function () {
	//console.log("TabNote prevNote")
	var note = midiToNote(this.pitch - 1 + this.pitchAltered)
	return new TabNote(note)
};

TabNote.prototype.emitNoAccidentals = function () {
	//console.log("TabNote emitNoAccidentals")
	var returned = this.name;
	if (this.isLower) {
		returned = returned.toLowerCase();
	}
	for (var ii = 0; ii < this.isQuoted; ii++) {
		returned += "'";
	}
	for (var jj = 0; jj < this.hasComma; jj++) {
		returned += ",";
	}
	return returned;
};

TabNote.prototype.emit = function () {
	//console.log("INIT/RENDER TabNote emit")
	var returned = this.name;
	if (this.isSharp || this.isKeySharp) {
		returned = '^' + returned;
		if (this.isDouble) {
			returned = '^' + returned;
		}
	}
	if (this.isFlat || this.isKeyFlat) {
		returned = '_' + returned;
		if (this.isDouble) {
			returned = '_' + returned;
		}
	}
	if (this.quarter) {
		if (this.quarter == "^") {
			returned = "^/" + returned;
		} else {
			returned = "_/" + returned;
		}
	}
	if (this.natural) {
		returned = '=' + returned;
	}
	for (var ii = 1; ii <= this.hasComma; ii++) {
		returned += ',';
	}

	if (this.isLower) {
		returned = returned.toLowerCase();
		for (var jj = 1; jj <= this.isQuoted; jj++) {
			returned += "'";
		}
	}
	return returned;
};

module.exports = TabNote
