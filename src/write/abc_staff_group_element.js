//    abc_staff_group_element.js: Definition of the StaffGroupElement class.
//    Copyright (C) 2010-2020 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var spacing = require('./abc_spacing');

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

var StaffGroupElement = function(getTextSize) {
	this.getTextSize = getTextSize;
	this.voices = [];
	this.staffs = [];
	this.brace = undefined; //tony
	this.bracket = undefined;
};

StaffGroupElement.prototype.setLimit = function(member, voice) {
	if (!voice.specialY[member]) return;
	if (!voice.staff.specialY[member])
		voice.staff.specialY[member] = voice.specialY[member];
	else
		voice.staff.specialY[member] = Math.max(voice.staff.specialY[member], voice.specialY[member]);
};

StaffGroupElement.prototype.addVoice = function (voice, staffnumber, stafflines) {
	var voiceNum = this.voices.length;
	this.voices[voiceNum] = voice;
	if (this.staffs[staffnumber])
		this.staffs[staffnumber].voices.push(voiceNum);
	else {
		// TODO-PER: how does the min/max change when stafflines is not 5?
		this.staffs[this.staffs.length] = {
			top: 10,
			bottom: 2,
			lines: stafflines,
			voices: [voiceNum],
			specialY: {
				tempoHeightAbove: 0,
				partHeightAbove: 0,
				volumeHeightAbove: 0,
				dynamicHeightAbove: 0,
				endingHeightAbove: 0,
				chordHeightAbove: 0,
				lyricHeightAbove: 0,

				lyricHeightBelow: 0,
				chordHeightBelow: 0,
				volumeHeightBelow: 0,
				dynamicHeightBelow: 0
			}
		};
	}
	voice.staff = this.staffs[staffnumber];
};

StaffGroupElement.prototype.setStaffLimits = function (voice) {
	voice.staff.top = Math.max(voice.staff.top, voice.top);
	voice.staff.bottom = Math.min(voice.staff.bottom, voice.bottom);
	this.setLimit('tempoHeightAbove', voice);
	this.setLimit('partHeightAbove', voice);
	this.setLimit('volumeHeightAbove', voice);
	this.setLimit('dynamicHeightAbove', voice);
	this.setLimit('endingHeightAbove', voice);
	this.setLimit('chordHeightAbove', voice);
	this.setLimit('lyricHeightAbove', voice);
	this.setLimit('lyricHeightBelow', voice);
	this.setLimit('chordHeightBelow', voice);
	this.setLimit('volumeHeightBelow', voice);
	this.setLimit('dynamicHeightBelow', voice);
};

StaffGroupElement.prototype.finished = function() {
	for (var i=0;i<this.voices.length;i++) {
		if (!this.voices[i].layoutEnded()) return false;
	}
	return true;
};

function getLeftEdgeOfStaff(renderer, getTextSize, voices, brace, bracket) {
	var x = renderer.padding.left;

	// find out how much space will be taken up by voice headers
	var voiceheaderw = 0;
	var i;
	var size;
	for (i=0;i<voices.length;i++) {
		if(voices[i].header) {
			size = getTextSize.calc(voices[i].header, 'voicefont', '');
			voiceheaderw = Math.max(voiceheaderw,size.width);
		}
	}
	if (brace) {
		for (i = 0; i < brace.length; i++) {
			if (brace[i].header) {
				size = getTextSize.calc(brace[i].header, 'voicefont', '');
				voiceheaderw = Math.max(voiceheaderw,size.width);
			}
		}
	}
	if (bracket) {
		for (i = 0; i < bracket.length; i++) {
			if (bracket[i].header) {
				size = getTextSize.calc(bracket[i].header, 'voicefont', '');
				voiceheaderw = Math.max(voiceheaderw,size.width);
			}
		}
	}
	if (voiceheaderw) {
		// Give enough spacing to the right - we use the width of an A for the amount of spacing.
		var sizeW = getTextSize.calc("A", 'voicefont', '');
		voiceheaderw += sizeW.width;
	}
	x += voiceheaderw;

	var ofs = 0;
	ofs = setBraceLocation(brace, x, ofs);
	ofs = setBraceLocation(bracket, x, ofs);
	return x + ofs;
}

function setBraceLocation(brace, x, ofs) {
	if (brace) {
		for (var i = 0; i < brace.length; i++) {
			brace[i].setLocation(x);
			ofs = Math.max(ofs, brace[i].getWidth());
		}
	}
	return ofs;
}

StaffGroupElement.prototype.layout = function(spacing, renderer, debug) {
	var epsilon = 0.0000001; // Fudging for inexactness of floating point math.
	var spacingunits = 0; // number of times we will have ended up using the spacing distance (as opposed to fixed width distances)
	var minspace = 1000; // a big number to start off with - used to find out what the smallest space between two notes is -- GD 2014.1.7

	var x = getLeftEdgeOfStaff(renderer, this.getTextSize, this.voices, this.brace, this.bracket);
	this.startx=x;
	var i;

	var currentduration = 0;
	if (debug) console.log("init layout", spacing);
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


		// isolate voices at current duration level
		var currentvoices = [];
		var othervoices = [];
		for (i=0;i<this.voices.length;i++) {
			var durationIndex = this.voices[i].getDurationIndex();
			// PER: Because of the inexactness of JS floating point math, we just get close.
			if (durationIndex - currentduration > epsilon) {
				othervoices.push(this.voices[i]);
				//console.log("out: voice ",i);
			} else {
				currentvoices.push(this.voices[i]);
				//if (debug) console.log("in: voice ",i);
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
		spacingunits+=spacingunit;
		minspace = Math.min(minspace,spacingunit);
		if (debug) console.log("currentduration: ",currentduration, spacingunits, minspace);

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
	spacingunits+=spacingunit;
	this.w = x;

	for (i=0;i<this.voices.length;i++) {
		this.voices[i].w=this.w;
	}
	return { spacingUnits: spacingunits, minSpace: minspace };
};

StaffGroupElement.prototype.calcHeight = function () {
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

module.exports = StaffGroupElement;
