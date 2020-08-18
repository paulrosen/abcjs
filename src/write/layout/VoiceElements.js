var VoiceElement = function VoiceElements() {}

VoiceElement.beginLayout = function (startx, voice) {
	voice.i=0;
	voice.durationindex=0;
	//this.ii=this.children.length;
	voice.startx=startx;
	voice.minx=startx; // furthest left to where negatively positioned elements are allowed to go
	voice.nextx=startx; // x position where the next element of this voice should be placed assuming no other voices and no fixed width constraints
	voice.spacingduration=0; // duration left to be laid out in current iteration (omitting additional spacing due to other aspects, such as bars, dots, sharps and flats)
};

VoiceElement.layoutEnded = function (voice) {
	return (voice.i>=voice.children.length);
};

VoiceElement.getNextX = function (voice) {
	return Math.max(voice.minx, voice.nextx);
};

// number of spacing units expected for next positioning
VoiceElement.getSpacingUnits = function (voice) {
	return Math.sqrt(voice.spacingduration*8);
	// TODO-PER: On short lines, this would never trigger, so the spacing was wrong. I just changed this line empirically, though, so I don't know if there are other ramifications.
	//return (this.minx<this.nextx) ? Math.sqrt(this.spacingduration*8) : 0; // we haven't used any spacing units if we end up using minx
};

// Try to layout the element at index this.i
// x - position to try to layout the element at
// spacing - base spacing
// can't call this function more than once per iteration
VoiceElement.layoutOneItem = function (x, spacing, voice) {
	var child = voice.children[voice.i];
	if (!child) return 0;
	var er = x - voice.minx; // available extrawidth to the left
	var extraWidth = getExtraWidth(child);
	if (er<extraWidth) { // shift right by needed amount
		// There's an exception if a bar element is after a Part element, there is no shift.
		if (voice.i === 0 || child.type !== 'bar' || (voice.children[voice.i-1].type !== 'part' && voice.children[voice.i-1].type !== 'tempo') )
			x+=extraWidth-er;
	}
	child.setX(x);

	voice.spacingduration = child.duration;
	//update minx
	voice.minx = x+getMinWidth(child); // add necessary layout space
	if (voice.i!==voice.children.length-1) voice.minx+=child.minspacing; // add minimumspacing except on last elem

	this.updateNextX(x, spacing, voice);

	// contribute to staff y position
	//this.staff.top = Math.max(child.top,this.staff.top);
	//this.staff.bottom = Math.min(child.bottom,this.staff.bottom);

	return x; // where we end up having placed the child
};

VoiceElement.shiftRight = function (dx, voice) {
	var child = voice.children[voice.i];
	if (!child) return;
	child.setX(child.x+dx);
	voice.minx+=dx;
	voice.nextx+=dx;
};

// call when spacingduration has been updated
VoiceElement.updateNextX = function (x, spacing, voice) {
	voice.nextx= x + (spacing*Math.sqrt(voice.spacingduration*8));
};

VoiceElement.updateIndices = function (voice) {
	if (!this.layoutEnded(voice)) {
		voice.durationindex += voice.children[voice.i].duration;
		if (voice.children[voice.i].type === 'bar') voice.durationindex = Math.round(voice.durationindex*64)/64; // everytime we meet a barline, do rounding to nearest 64th
		voice.i++;
	}
};

function getExtraWidth(child) { // space needed to the left of the note
	return -child.extraw;
};

function getMinWidth(child) { // absolute space taken to the right of the note
	return child.w;
};

export default VoiceElement;
