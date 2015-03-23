//    abc_staff_group_element.js: Definition of the StaffGroupElement class.
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

/*globals ABCJS, console */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

// StaffGroupElement contains all the elements that go together to make one line of music.
// That might be multiple staves that are tied together, and it might be multiple voices on one staff.
//
// Methods:
// constructor: some basic initialization
// addVoice(): Called once for each voice. May add a new staff if needed.
// finished(): Called only internally by layout()
// layout(): This does all the layout. It sets the following: spacingunits, startx, minspace, w, and the x-coordinate of each element in each voice.
// draw(): Calls the underlying methods on the voice objects to do the drawing. Sets y and height.
//
// Members:
// staffs: an array of all the staves in this group. Each staff contains the following elements:
//    { top, bottom, highest, lowest, y }
// voices: array of VoiceElement objects. This is mostly passed in, but the VoiceElement objects are modified here.
//
// spacingunits: number of relative x-units in the line. Used by the calling function to pass back in as the "spacing" input parameter.
// TODO-PER: This should actually be passed back as a return value.
// minspace: smallest space between two notes. Used by the calling function to pass back in as the "spacing" input parameter.
// TODO-PER: This should actually be passed back as a return value.
// startx: The left edge, taking the margin and the optional voice name. Used by the draw() method.
// w: The width of the line. Used by calling function to pass back in as the "spacing" input parameter, and the draw() method.
// TODO-PER: This should actually be passed back as a return value.  (TODO-PER: in pixels or spacing units?)
// y: The top of the staff group, in pixels. This is set in the draw method.
// TODO-PER: Where is that used? It looks like it might not be needed.
// height: Set in the draw() method to the height actually used. Used by the calling function to know where to start the next staff group.
// TODO-PER: This should actually be set in the layout method and passed back as a return value.

ABCJS.write.StaffGroupElement = function() {
	this.voices = [];
	this.staffs = [];
};

ABCJS.write.StaffGroupElement.prototype.setLimit = function(member, voice) {
	if (!voice[member]) return;
	if (!voice.staff[member])
		voice.staff[member] = voice[member];
	else
		voice.staff[member] = Math.max(voice.staff[member], voice[member]);
};

ABCJS.write.StaffGroupElement.prototype.addVoice = function (voice, staffnumber, stafflines) {
	var voiceNum = this.voices.length;
	this.voices[voiceNum] = voice;
	if (this.staffs[staffnumber])
		this.staffs[staffnumber].voices.push(voiceNum);
	else {
		// TODO-PER: how does the min/max change when stafflines is not 5?
		this.staffs[this.staffs.length] = {top: 10, bottom: 2, hasHighest1: false, hasHighest2: false, hasLowest1: false, hasLowest2: false, lines: stafflines, voices: [voiceNum] };
	}
	voice.staff = this.staffs[staffnumber];
	voice.staff.top = Math.max(voice.staff.top, voice.top);
	voice.staff.bottom = Math.min(voice.staff.bottom, voice.bottom);
};

ABCJS.write.StaffGroupElement.prototype.setStaffLimits = function (voice) {
	this.setLimit('hasHighest1', voice);
	this.setLimit('hasHighest2', voice);
	this.setLimit('hasLowest1', voice);
	this.setLimit('hasLowest2', voice);
};

ABCJS.write.StaffGroupElement.prototype.finished = function() {
	for (var i=0;i<this.voices.length;i++) {
		if (!this.voices[i].layoutEnded()) return false;
	}
	return true;
};

ABCJS.write.StaffGroupElement.prototype.layout = function(spacing, renderer, debug) {
	this.spacingunits = 0; // number of times we will have ended up using the spacing distance (as opposed to fixed width distances)
	this.minspace = 1000; // a big number to start off with - used to find out what the smallest space between two notes is -- GD 2014.1.7
	var x = renderer.padding.left;

	// find out how much space will be taken up by voice headers
	var voiceheaderw = 0;
	for (var i=0;i<this.voices.length;i++) {
		if(this.voices[i].header) {
			var size = renderer.getTextSize(this.voices[i].header, 'voicefont', '');
			voiceheaderw = Math.max(voiceheaderw,size.width);
		}
	}
	x=x+voiceheaderw*1.1; // When there is no voice header, 110% of 0 is 0
	this.startx=x;

	var currentduration = 0;
	if (debug) console.log("init layout");
	for (i=0;i<this.voices.length;i++) {
		this.voices[i].beginLayout(x);
	}

	var spacingunit = 0; // number of spacingunits coming from the previously laid out element to this one
	while (!this.finished()) {
		// find first duration level to be laid out among candidates across voices
		currentduration= null; // candidate smallest duration level
		for (i=0;i<this.voices.length;i++) {
			if (!this.voices[i].layoutEnded() && (!currentduration || this.voices[i].getDurationIndex()<currentduration))
				currentduration=this.voices[i].getDurationIndex();
		}
		if (debug) console.log("currentduration: ",currentduration);


		// isolate voices at current duration level
		var currentvoices = [];
		var othervoices = [];
		for (i=0;i<this.voices.length;i++) {
			if (this.voices[i].getDurationIndex() !== currentduration) {
				othervoices.push(this.voices[i]);
				//console.log("out: voice ",i);
			} else {
				currentvoices.push(this.voices[i]);
				if (debug) console.log("in: voice ",i);
			}
		}

		// among the current duration level find the one which needs starting furthest right
		spacingunit = 0; // number of spacingunits coming from the previously laid out element to this one
		var spacingduration = 0;
		for (i=0;i<currentvoices.length;i++) {
			//console.log("greatest spacing unit", x, currentvoices[i].getNextX(), currentvoices[i].getSpacingUnits(), currentvoices[i].spacingduration);
			if (currentvoices[i].getNextX()>x) {
				x=currentvoices[i].getNextX();
				spacingunit=currentvoices[i].getSpacingUnits();
				spacingduration = currentvoices[i].spacingduration;
			}
		}
		//console.log("new spacingunit", spacingunit, this.spacingunits, "="+(spacingunit+ this.spacingunits));
		this.spacingunits+=spacingunit;
		this.minspace = Math.min(this.minspace,spacingunit);

		for (i=0;i<currentvoices.length;i++) {
			var voicechildx = currentvoices[i].layoutOneItem(x,spacing);
			var dx = voicechildx-x;
			if (dx>0) {
				x = voicechildx; //update x
				for (var j=0;j<i;j++) { // shift over all previously laid out elements
					currentvoices[j].shiftRight(dx);
				}
			}
		}

		// remove the value of already counted spacing units in other voices (e.g. if a voice had planned to use up 5 spacing units but is not in line to be laid out at this duration level - where we've used 2 spacing units - then we must use up 3 spacing units, not 5)
		for (i=0;i<othervoices.length;i++) {
			othervoices[i].spacingduration-=spacingduration;
			othervoices[i].updateNextX(x,spacing); // adjust other voices expectations
		}

		// update indexes of currently laid out elems
		for (i=0;i<currentvoices.length;i++) {
			var voice = currentvoices[i];
			voice.updateIndices();
		}
	} // finished laying out


	// find the greatest remaining x as a base for the width
	for (i=0;i<this.voices.length;i++) {
		if (this.voices[i].getNextX()>x) {
			x=this.voices[i].getNextX();
			spacingunit=this.voices[i].getSpacingUnits();
		}
	}
	//console.log("greatest remaining",spacingunit,x);
	this.spacingunits+=spacingunit;
	this.w = x;

	for (i=0;i<this.voices.length;i++) {
		this.voices[i].w=this.w;
	}
};

ABCJS.write.StaffGroupElement.prototype.calcHeight = function () {
	// the height is calculated here in a parallel way to the drawing below in hopes that both of these functions will be modified together.
	// TODO-PER: also add the space between staves. (That's systemStaffSeparation, which is the minimum distance between the staff LINES.)
	var height = 0;
	for (var i=0;i<this.voices.length;i++) {
		var staff = this.voices[i].staff;
		if (!this.voices[i].duplicate) {
			height += staff.top;
			if (staff.bottom < 0)
				height += -staff.bottom;
		}
	}
	return height;
};

ABCJS.write.StaffGroupElement.prototype.draw = function (renderer) {
	// We enter this method with renderer.y pointing to the topmost coordinate that we're allowed to draw.
	// All of the children that will be drawn have a relative "pitch" set, where zero is the first ledger line below the staff.
	// renderer.y will be offset at the beginning of each staff by the amount required to make the relative pitch work.
	// If there are multiple staves, then renderer.y will be incremented for each new staff.

	var startY = renderer.y; // So that it can be restored after we're done.
	var topLine; // these are to connect multiple staves. We need to remember where they are.
	var bottomLine;

	var bartop = 0;
	renderer.measureNumber = null;
	for (var i=0;i<this.voices.length;i++) {
		var staff = this.voices[i].staff;
		//renderer.y = staff.y;
		// offset for starting the counting at middle C
		if (!this.voices[i].duplicate) {
			renderer.moveY(ABCJS.write.spacing.STEP, staff.top);
			if (!topLine) topLine  = renderer.calcY(10);
			bottomLine  = renderer.calcY(2);
			if (staff.lines !== 0)
				renderer.printStave(this.startx, this.w, staff.lines);
		}
		this.voices[i].draw(renderer, bartop);
		if (!this.voices[i].duplicate) {
			bartop = renderer.calcY(2); // This connects the bar lines between two different staves.
			if (staff.bottom < 0)
				renderer.moveY(ABCJS.write.spacing.STEP, -staff.bottom);
		}
	}
	renderer.measureNumber = null;

	// connect all the staves together with a vertical line
	if (this.staffs.length>1) {
		renderer.printStem(this.startx, 0.6, topLine, bottomLine);
	}
	renderer.y = startY;
};

