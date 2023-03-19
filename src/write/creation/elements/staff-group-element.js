//    abc_staff_group_element.js: Definition of the StaffGroupElement class.

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
var calcHeight = require('../calc-height');

var StaffGroupElement = function (getTextSize) {
	this.getTextSize = getTextSize;
	this.voices = [];
	this.staffs = [];
	this.brace = undefined; //tony
	this.bracket = undefined;
};

StaffGroupElement.prototype.setLimit = function (member, voice) {
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

StaffGroupElement.prototype.setHeight = function () {
	this.height = calcHeight(this);
};

StaffGroupElement.prototype.setWidth = function (width) {
	this.w = width;
	for (var i = 0; i < this.voices.length; i++) {
		this.voices[i].setWidth(width);
	}
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

module.exports = StaffGroupElement;
