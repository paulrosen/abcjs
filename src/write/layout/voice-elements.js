var VoiceElement = function VoiceElements() { }

VoiceElement.beginLayout = function (startx, voice) {
	voice.i = 0;
	voice.durationindex = 0;
	//this.ii=this.children.length;
	voice.startx = startx;
	voice.minx = startx; // furthest left to where negatively positioned elements are allowed to go
	voice.nextx = startx; // x position where the next element of this voice should be placed assuming no other voices and no fixed width constraints
	voice.spacingduration = 0; // duration left to be laid out in current iteration (omitting additional spacing due to other aspects, such as bars, dots, sharps and flats)
};

VoiceElement.layoutEnded = function (voice) {
	return (voice.i >= voice.children.length);
};

VoiceElement.getNextX = function (voice) {
	return Math.max(voice.minx, voice.nextx);
};

// number of spacing units expected for next positioning
VoiceElement.getSpacingUnits = function (voice) {
	return Math.sqrt(voice.spacingduration * 8);
};

// Try to layout the element at index this.i
// x - position to try to layout the element at
// spacing - base spacing
// can't call this function more than once per iteration
VoiceElement.layoutOneItem = function (x, spacing, voice, minPadding, firstVoice) {
	var child = voice.children[voice.i];
	if (!child) return 0;
	var er = x - voice.minx; // available extrawidth to the left
	var pad = voice.durationindex + child.duration > 0 ? minPadding : 0; // only add padding to the items that aren't fixed to the left edge.
	// See if this item overlaps the item in the first voice. If firstVoice is undefined then there's nothing to compare.
	if (child.abcelem.el_type === "note" && !child.abcelem.rest && voice.voicenumber !== 0 && firstVoice) {
		var firstChild = firstVoice.children[firstVoice.i];
		// It overlaps if the either the child's top or bottom is inside the firstChild's or at least within 1
		// A special case is if the element is on the same line then it can share a note head, if the notehead is the same
		var overlaps = firstChild &&
			((child.abcelem.maxpitch <= firstChild.abcelem.maxpitch + 1 && child.abcelem.maxpitch >= firstChild.abcelem.minpitch - 1) ||
				(child.abcelem.minpitch <= firstChild.abcelem.maxpitch + 1 && child.abcelem.minpitch >= firstChild.abcelem.minpitch - 1))
		// See if they can share a note head
		if (overlaps && child.abcelem.minpitch === firstChild.abcelem.minpitch && child.abcelem.maxpitch === firstChild.abcelem.maxpitch &&
			firstChild.heads && firstChild.heads.length > 0 && child.heads && child.heads.length > 0 &&
			firstChild.heads[0].c === child.heads[0].c)
			overlaps = false;
		// If this note overlaps the note in the first voice and we haven't moved the note yet (this can be called multiple times)
		if (overlaps) {
			// I think that firstChild should always have at least one note head, but defensively make sure.
			// There was a problem with this being called more than once so if a value is adjusted then it is saved so it is only adjusted once.
			var firstChildNoteWidth = firstChild.heads && firstChild.heads.length > 0 ? firstChild.heads[0].realWidth : firstChild.fixed.w;
			if (!child.adjustedWidth)
				child.adjustedWidth = firstChildNoteWidth + child.w;
			child.w = child.adjustedWidth
			for (var j = 0; j < child.children.length; j++) {
				var relativeChild = child.children[j];
				if (relativeChild.name.indexOf("accidental") < 0) {
					if (!relativeChild.adjustedWidth)
						relativeChild.adjustedWidth = relativeChild.dx + firstChildNoteWidth;
					relativeChild.dx = relativeChild.adjustedWidth
				}
			}

		}
	}
	var extraWidth = getExtraWidth(child, pad);
	if (er < extraWidth) { // shift right by needed amount
		// There's an exception if a bar element is after a Part element, there is no shift.
		if (voice.i === 0 || child.type !== 'bar' || (voice.children[voice.i - 1].type !== 'part' && voice.children[voice.i - 1].type !== 'tempo'))
			x += extraWidth - er;
	}
	child.setX(x);

	voice.spacingduration = child.duration;
	//update minx
	voice.minx = x + getMinWidth(child); // add necessary layout space
	if (voice.i !== voice.children.length - 1) voice.minx += child.minspacing; // add minimumspacing except on last elem

	this.updateNextX(x, spacing, voice);

	// contribute to staff y position
	//this.staff.top = Math.max(child.top,this.staff.top);
	//this.staff.bottom = Math.min(child.bottom,this.staff.bottom);

	return x; // where we end up having placed the child
};

VoiceElement.shiftRight = function (dx, voice) {
	var child = voice.children[voice.i];
	if (!child) return;
	child.setX(child.x + dx);
	voice.minx += dx;
	voice.nextx += dx;
};

// call when spacingduration has been updated
VoiceElement.updateNextX = function (x, spacing, voice) {
	voice.nextx = x + (spacing * this.getSpacingUnits(voice));
};

VoiceElement.updateIndices = function (voice) {
	if (!this.layoutEnded(voice)) {
		voice.durationindex += voice.children[voice.i].duration;
		if (voice.children[voice.i].type === 'bar') voice.durationindex = Math.round(voice.durationindex * 64) / 64; // everytime we meet a barline, do rounding to nearest 64th
		voice.i++;
	}
};

function getExtraWidth(child, minPadding) { // space needed to the left of the note
	var padding = 0;
	if (child.type === 'note' || child.type === 'bar')
		padding = minPadding;
	return -child.extraw + padding;
}

function getMinWidth(child) { // absolute space taken to the right of the note
	return child.w;
}

module.exports = VoiceElement;
