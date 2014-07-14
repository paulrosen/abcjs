//    abc_voice_element.js: Definition of the VoiceElement class.
//    Copyright (C) 2010,2014 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*globals ABCJS */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

ABCJS.write.VoiceElement = function(voicenumber, voicetotal) {
	this.children = [];
	this.beams = [];
	this.otherchildren = []; // ties, slurs, triplets
	this.w = 0;
	this.duplicate = false;
	this.voicenumber = voicenumber; //number of the voice on a given stave (not staffgroup)
	this.voicetotal = voicetotal;
};

ABCJS.write.VoiceElement.prototype.addChild = function (child) {
	if (child.type === 'bar') {
		var firstItem = true;
		for (var i = 0; firstItem && i < this.children.length; i++) {
			if (this.children[i].type !== "staff-extra")
				firstItem = false;
		}
		if (!firstItem) {
			this.beams.push("bar");
			this.otherchildren.push("bar");
		}
	}
	this.children[this.children.length] = child;
};

ABCJS.write.VoiceElement.prototype.addOther = function (child) {
	if (child instanceof ABCJS.write.BeamElem) {
		this.beams.push(child);
	} else {
		this.otherchildren.push(child);
	}
};

ABCJS.write.VoiceElement.prototype.updateIndices = function () {
	if (!this.layoutEnded()) {
		this.durationindex += this.children[this.i].duration;
		if (this.children[this.i].duration===0) this.durationindex = Math.round(this.durationindex*64)/64; // everytime we meet a barline, do rounding to nearest 64th
		this.i++;
	}
};

ABCJS.write.VoiceElement.prototype.layoutEnded = function () {
	return (this.i>=this.children.length);
};

ABCJS.write.VoiceElement.prototype.getDurationIndex = function () {
	return this.durationindex - (this.children[this.i] && (this.children[this.i].duration>0)?0:0.0000005); // if the ith element doesn't have a duration (is not a note), its duration index is fractionally before. This enables CLEF KEYSIG TIMESIG PART, etc. to be laid out before we get to the first note of other voices
};

// number of spacing units expected for next positioning
ABCJS.write.VoiceElement.prototype.getSpacingUnits = function () {
	return (this.minx<this.nextx) ? Math.sqrt(this.spacingduration*8) : 0; // we haven't used any spacing units if we end up using minx
};

//
ABCJS.write.VoiceElement.prototype.getNextX = function () {
	return Math.max(this.minx, this.nextx);
};

ABCJS.write.VoiceElement.prototype.beginLayout = function (startx) {
	this.i=0;
	this.durationindex=0;
	this.ii=this.children.length;
	this.startx=startx;
	this.minx=startx; // furthest left to where negatively positioned elements are allowed to go
	this.nextx=startx; // x position where the next element of this voice should be placed assuming no other voices and no fixed width constraints
	this.spacingduration=0; // duration left to be laid out in current iteration (omitting additional spacing due to other aspects, such as bars, dots, sharps and flats)
};

// Try to layout the element at index this.i
// x - position to try to layout the element at
// spacing - base spacing
// can't call this function more than once per iteration
ABCJS.write.VoiceElement.prototype.layoutOneItem = function (x, spacing) {
	var child = this.children[this.i];
	if (!child) return 0;
	var er = x - this.minx; // available extrawidth to the left
	if (er<child.getExtraWidth()) { // shift right by needed amount
		x+=child.getExtraWidth()-er;
	}
	child.x=x; // place child at x

	this.spacingduration = child.duration;
	//update minx
	this.minx = x+child.getMinWidth(); // add necessary layout space
	if (this.i!==this.ii-1) this.minx+=child.minspacing; // add minimumspacing except on last elem

	this.updateNextX(x, spacing);

	// contribute to staff y position
	this.staff.highest = Math.max(child.top,this.staff.highest);
	this.staff.lowest = Math.min(child.bottom,this.staff.lowest);

	return x; // where we end up having placed the child
};

// call when spacingduration has been updated
ABCJS.write.VoiceElement.prototype.updateNextX = function (x, spacing) {
	this.nextx= x + (spacing*Math.sqrt(this.spacingduration*8));
};

ABCJS.write.VoiceElement.prototype.shiftRight = function (dx) {
	var child = this.children[this.i];
	if (!child) return;
	child.x+=dx;
	this.minx+=dx;
	this.nextx+=dx;
};

ABCJS.write.VoiceElement.prototype.draw = function (renderer, bartop) {
	var width = this.w-1;
	renderer.y = this.staff.y;
	renderer.staffbottom = this.staff.bottom;
	this.barbottom = renderer.calcY(2);

	renderer.measureNumber = null;
	if (this.header) { // print voice name
		var textpitch = 12 - (this.voicenumber+1)*(12/(this.voicetotal+1));
		var headerX = (this.startx-renderer.paddingleft)/2+renderer.paddingleft;
		headerX = headerX*renderer.scale;
		renderer.paper.text(headerX, renderer.calcY(textpitch)*renderer.scale, this.header).attr({"font-size":12*renderer.scale, "font-family":"serif", 'font-weight':'bold', 'class': renderer.addClasses('staff-extra voice-name')}); // code duplicated above
	}

	for (var i=0, ii=this.children.length; i<ii; i++) {
		var child = this.children[i];
		var justInitializedMeasureNumber = false;
		if (child.type !== 'staff-extra' && renderer.measureNumber === null) {
			renderer.measureNumber = 0;
			justInitializedMeasureNumber = true;
		}
		child.draw(renderer, (this.barto || i===ii-1)?bartop:0);
		if (child.type === 'bar' && !justInitializedMeasureNumber)
			renderer.measureNumber++;
	}

	renderer.measureNumber = 0;
	window.ABCJS.parse.each(this.beams, function(beam) {
		if (beam === 'bar')
			renderer.measureNumber++;
		else
			beam.draw(renderer); // beams must be drawn first for proper printing of triplets, slurs and ties.
	});

	renderer.measureNumber = 0;
	var self = this;
	window.ABCJS.parse.each(this.otherchildren, function(child) {
		if (child === 'bar')
			renderer.measureNumber++;
		else
			child.draw(renderer,self.startx+10,width);
	});

};
