//    abc_staff_group_element.js: Definition of the StaffGroupElement class.
//    Copyright (C) 2010-2018 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

/*globals console */

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

var StaffGroupElement = function() {
	this.voices = [];
	this.staffs = [];
	this.brace = undefined; //tony
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

StaffGroupElement.prototype.setUpperAndLowerElements = function(renderer) {
	// Each staff already has the top and bottom set, now we see if there are elements that are always on top and bottom, and resolve their pitch.
	// Also, get the overall height of all the staves in this group.
	var lastStaffBottom;
	for (var i = 0; i < this.staffs.length; i++) {
		var staff = this.staffs[i];
		// the vertical order of elements that are above is: tempo, part, volume/dynamic, ending/chord, lyric
		// the vertical order of elements that are below is: lyric, chord, volume/dynamic
		var positionY = {
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
		};

		if (/*ABCJS.write.debugPlacement*/false) {
			staff.originalTop = staff.top; // This is just being stored for debugging purposes.
			staff.originalBottom = staff.bottom; // This is just being stored for debugging purposes.
		}

		if (staff.specialY.lyricHeightAbove) { staff.top += staff.specialY.lyricHeightAbove; positionY.lyricHeightAbove = staff.top; }
		if (staff.specialY.chordHeightAbove) { staff.top += staff.specialY.chordHeightAbove; positionY.chordHeightAbove = staff.top; }
		if (staff.specialY.endingHeightAbove) {
			if (staff.specialY.chordHeightAbove)
				staff.top += 2;
			else
				staff.top += staff.specialY.endingHeightAbove;
			positionY.endingHeightAbove = staff.top;
		}
		if (staff.specialY.dynamicHeightAbove && staff.specialY.volumeHeightAbove) {
			staff.top += Math.max(staff.specialY.dynamicHeightAbove, staff.specialY.volumeHeightAbove);
			positionY.dynamicHeightAbove = staff.top;
			positionY.volumeHeightAbove = staff.top;
		} else if (staff.specialY.dynamicHeightAbove) {
			staff.top += staff.specialY.dynamicHeightAbove; positionY.dynamicHeightAbove = staff.top;
		} else if (staff.specialY.volumeHeightAbove) { staff.top += staff.specialY.volumeHeightAbove; positionY.volumeHeightAbove = staff.top; }
		if (staff.specialY.partHeightAbove) { staff.top += staff.specialY.partHeightAbove; positionY.partHeightAbove = staff.top; }
		if (staff.specialY.tempoHeightAbove) { staff.top += staff.specialY.tempoHeightAbove; positionY.tempoHeightAbove = staff.top; }

		if (staff.specialY.lyricHeightBelow) { positionY.lyricHeightBelow = staff.bottom; staff.bottom -= staff.specialY.lyricHeightBelow; }
		if (staff.specialY.chordHeightBelow) { positionY.chordHeightBelow = staff.bottom; staff.bottom -= staff.specialY.chordHeightBelow; }
		if (staff.specialY.volumeHeightBelow && staff.specialY.dynamicHeightBelow) {
			positionY.volumeHeightBelow = staff.bottom;
			positionY.dynamicHeightBelow = staff.bottom;
			staff.bottom -= Math.max(staff.specialY.volumeHeightBelow, staff.specialY.dynamicHeightBelow);
		} else if (staff.specialY.volumeHeightBelow) {
			positionY.volumeHeightBelow = staff.bottom; staff.bottom -= staff.specialY.volumeHeightBelow;
		} else if (staff.specialY.dynamicHeightBelow) {
			positionY.dynamicHeightBelow = staff.bottom; staff.bottom -= staff.specialY.dynamicHeightBelow;
		}

		if (/*ABCJS.write.debugPlacement*/false)
			staff.positionY = positionY; // This is just being stored for debugging purposes.

		for (var j = 0; j < staff.voices.length; j++) {
			var voice = this.voices[staff.voices[j]];
			voice.setUpperAndLowerElements(positionY);
		}
		// We might need a little space in between staves if the staves haven't been pushed far enough apart by notes or extra vertical stuff.
		// Only try to put in extra space if this isn't the top staff.
		if (lastStaffBottom !== undefined) {
			var thisStaffTop = staff.top - 10;
			var forcedSpacingBetween = lastStaffBottom + thisStaffTop;
			var minSpacingInPitches = renderer.spacing.systemStaffSeparation/spacing.STEP;
			var addedSpace = minSpacingInPitches - forcedSpacingBetween;
			if (addedSpace > 0)
				staff.top += addedSpace;
		}
		lastStaffBottom = 2 - staff.bottom; // the staff starts at position 2 and the bottom variable is negative. Therefore to find out how large the bottom is, we reverse the sign of the bottom, and add the 2 in.

		// Now we need a little margin on the top, so we'll just throw that in.
		//staff.top += 4;
		//console.log("Staff Y: ",i,heightInPitches,staff.top,staff.bottom);
	}
	//console.log("Staff Height: ",heightInPitches,this.height);
};

StaffGroupElement.prototype.finished = function() {
	for (var i=0;i<this.voices.length;i++) {
		if (!this.voices[i].layoutEnded()) return false;
	}
	return true;
};

function getLeftEdgeOfStaff(renderer, voices, brace) {
	var x = renderer.padding.left;

	// find out how much space will be taken up by voice headers
	var voiceheaderw = 0;
	for (var i=0;i<voices.length;i++) {
		if(voices[i].header) {
			var size = renderer.getTextSize(voices[i].header, 'voicefont', '');
			voiceheaderw = Math.max(voiceheaderw,size.width);
		}
	}
	if (voiceheaderw) {
		// Give enough spacing to the right - we use the width of an A for the amount of spacing.
		var sizeW = renderer.getTextSize("A", 'voicefont', '');
		voiceheaderw += sizeW.width;
	}
	x += voiceheaderw;

	if (brace) {
		brace.setLocation(x);
		x += brace.getWidth();
	}
	return x;
}

StaffGroupElement.prototype.layout = function(spacing, renderer, debug) {
	var epsilon = 0.0000001; // Fudging for inexactness of floating point math.
	var spacingunits = 0; // number of times we will have ended up using the spacing distance (as opposed to fixed width distances)
	var minspace = 1000; // a big number to start off with - used to find out what the smallest space between two notes is -- GD 2014.1.7

	var x = getLeftEdgeOfStaff(renderer, this.voices, this.brace);
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

StaffGroupElement.prototype.draw = function (renderer) {
	// We enter this method with renderer.y pointing to the topmost coordinate that we're allowed to draw.
	// All of the children that will be drawn have a relative "pitch" set, where zero is the first ledger line below the staff.
	// renderer.y will be offset at the beginning of each staff by the amount required to make the relative pitch work.
	// If there are multiple staves, then renderer.y will be incremented for each new staff.

	var debugPrint;
	var colorIndex;
	if (/*ABCJS.write.debugPlacement*/false) {
		var colors = [ "rgb(207,27,36)", "rgb(168,214,80)", "rgb(110,161,224)", "rgb(191,119,218)", "rgb(195,30,151)",
			"rgb(31,170,177)", "rgb(220,166,142)" ];
		debugPrint = function(staff, key) {
			if (staff.positionY[key]) {
				//renderer.printHorizontalLine(50, renderer.calcY(staff.positionY[key]), key.substr(0, 4) + " " + Math.round(staff.positionY[key]));
				var height = staff.specialY[key] * spacing.STEP;
				renderer.printShadedBox(renderer.padding.left, renderer.calcY(staff.positionY[key]), renderer.controller.width, height,colors[colorIndex], 0.4, key.substr(0, 4));
				colorIndex += 1; if (colorIndex > 6) colorIndex = 0;
			}
		};
	}

	// An invisible marker is useful to be able to find where each system starts.
	renderer.addInvisibleMarker("abcjs-top-of-system");

	var startY = renderer.y; // So that it can be restored after we're done.
	// Set the absolute Y position for each staff here, so the voice drawing below can just use if.
	for (var j = 0; j < this.staffs.length; j++) {
		var staff1 = this.staffs[j];
		//renderer.printHorizontalLine(50, renderer.y, "start");
		renderer.moveY(spacing.STEP, staff1.top);
		staff1.absoluteY = renderer.y;
		if (/*ABCJS.write.debugPlacement*/false) {
			colorIndex = 0;
			renderer.printShadedBox(renderer.padding.left, renderer.calcY(staff1.originalTop), renderer.controller.width, renderer.calcY(staff1.originalBottom)-renderer.calcY(staff1.originalTop), "#000000", 0.1);
			debugPrint(staff1, 'chordHeightAbove');
			debugPrint(staff1, 'chordHeightBelow');
			debugPrint(staff1, 'dynamicHeightAbove');
			debugPrint(staff1, 'dynamicHeightBelow');
			debugPrint(staff1, 'endingHeightAbove');
			debugPrint(staff1, 'lyricHeightAbove');
			debugPrint(staff1, 'lyricHeightBelow');
			debugPrint(staff1, 'partHeightAbove');
			debugPrint(staff1, 'tempoHeightAbove');
			debugPrint(staff1, 'volumeHeightAbove');
			debugPrint(staff1, 'volumeHeightBelow');
		}
		if (staff1.bottom < 0)
			renderer.moveY(spacing.STEP, -staff1.bottom);
	}
	var topLine; // these are to connect multiple staves. We need to remember where they are.
	var bottomLine;

	var bartop = 0;
	renderer.measureNumber = null;
	renderer.noteNumber = null;
	for (var i=0;i<this.voices.length;i++) {
		var staff = this.voices[i].staff;
		renderer.y = staff.absoluteY;
		renderer.voiceNumber = i;
		//renderer.y = staff.y;
		// offset for starting the counting at middle C
		if (!this.voices[i].duplicate) {
//			renderer.moveY(spacing.STEP, staff.top);
			if (!topLine) topLine  = renderer.calcY(10);
			bottomLine  = renderer.calcY(2);
			if (staff.lines !== 0) {
				renderer.measureNumber = null;
				renderer.noteNumber = null;
				renderer.printStave(this.startx, this.w, staff.lines);
			}
		}
		this.voices[i].draw(renderer, bartop);
		renderer.measureNumber = null;
		renderer.noteNumber = null;
		if (!this.voices[i].duplicate) {
			bartop = renderer.calcY(2); // This connects the bar lines between two different staves.
//			if (staff.bottom < 0)
//				renderer.moveY(spacing.STEP, -staff.bottom);
		}
		if(this.brace) {//Tony
			if (i === this.brace.length - 1) {
				if (this.brace) {
					this.brace.draw(renderer, topLine, bottomLine); //tony
				}
			}
		}
	}
	renderer.measureNumber = null;
	renderer.noteNumber = null;

	// connect all the staves together with a vertical line
	if (this.staffs.length>1) {
		renderer.printStem(this.startx, 0.6, topLine, bottomLine);
	}
	renderer.y = startY;
};

module.exports = StaffGroupElement;
