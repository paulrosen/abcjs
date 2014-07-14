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
// stafflines: an array of the same length as staffs. It contains an integer with the number of lines.
//   TODO-PER: stafflines should actually be an element of staffs, I think.
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
	this.stafflines = [];
};

ABCJS.write.StaffGroupElement.prototype.addVoice = function (voice, staffnumber, stafflines) {
	this.voices[this.voices.length] = voice;
	if (!this.staffs[staffnumber]) {
		this.staffs[this.staffs.length] = {top:0, highest: 7, lowest: 7};
		this.stafflines[this.stafflines.length] = stafflines;
	}
	voice.staff = this.staffs[staffnumber];
};

ABCJS.write.StaffGroupElement.prototype.finished = function() {
	for (var i=0;i<this.voices.length;i++) {
		if (!this.voices[i].layoutEnded()) return false;
	}
	return true;
};

ABCJS.write.StaffGroupElement.prototype.layout = function(spacing, controller, debug) {
	this.spacingunits = 0; // number of times we will have ended up using the spacing distance (as opposed to fixed width distances)
	this.minspace = 1000; // a big number to start off with - used to find out what the smallest space between two notes is -- GD 2014.1.7
	var x = controller.paddingleft*controller.scale;

	// find out how much space will be taken up by voice headers
	var voiceheaderw = 0;
	for (var i=0;i<this.voices.length;i++) {
		if(this.voices[i].header) {
			var t = controller.paper.text(100*controller.scale, -10*controller.scale, this.voices[i].header).attr({"font-size":12*controller.scale, "font-family":"serif", 'font-weight':'bold'}); // code duplicated below  // don't scale this as we ask for the bbox
			voiceheaderw = Math.max(voiceheaderw,t.getBBox().width);
			t.remove();
		}
	}
	x=x+voiceheaderw*(1/controller.scale)*1.1; // 10% of 0 is 0
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
			if (currentvoices[i].getNextX()>x) {
				x=currentvoices[i].getNextX();
				spacingunit=currentvoices[i].getSpacingUnits();
				spacingduration = currentvoices[i].spacingduration;
			}
		}
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
	this.spacingunits+=spacingunit;
	this.w = x;

	for (i=0;i<this.voices.length;i++) {
		this.voices[i].w=this.w;
	}
};

ABCJS.write.StaffGroupElement.prototype.draw = function (renderer, y) {

	this.y = y;
	for (var i=0;i<this.staffs.length;i++) {
		var shiftabove = this.staffs[i].highest - ((i===0)? 20 : 15);
		var shiftbelow = this.staffs[i].lowest - ((i===this.staffs.length-1)? 0 : 0);
		this.staffs[i].top = y;
		if (shiftabove > 0) y+= shiftabove*ABCJS.write.spacing.STEP;
		this.staffs[i].y = y;
		y+= ABCJS.write.spacing.STAVEHEIGHT*0.9; // position of the words
		if (shiftbelow < 0) y-= shiftbelow*ABCJS.write.spacing.STEP;
		this.staffs[i].bottom = y;

		if (this.stafflines[i] !== 0) {
			renderer.y = this.staffs[i].y;
			// TODO-PER: stafflines should always have been set somewhere, so this shouldn't be necessary.
			if (this.stafflines[i] === undefined)
				this.stafflines[i] = 5;
			renderer.printStave(this.startx, this.w, this.stafflines[i]);
		}
	}
	this.height = y-this.y;

	var bartop = 0;
	renderer.measureNumber = null;
	for (i=0;i<this.voices.length;i++) {
		this.voices[i].draw(renderer, bartop);
		bartop = this.voices[i].barbottom;
	}
	renderer.measureNumber = null;

	if (this.staffs.length>1) {
		renderer.y = this.staffs[0].y;
		var top = renderer.calcY(10);
		renderer.y = this.staffs[this.staffs.length-1].y;
		var bottom = renderer.calcY(2);
		renderer.printStem(this.startx, 0.6, top, bottom);
	}

//	for (i=0;i<this.staffs.length;i++) {
//		if (this.stafflines[i] === 0) continue;
//		renderer.y = this.staffs[i].y;
//		// TODO-PER: stafflines should always have been set somewhere, so this shouldn't be necessary.
//		if (this.stafflines[i] === undefined)
//			this.stafflines[i] = 5;
//		renderer.printStave(this.startx,this.w, this.stafflines[i]);
//	}

};

