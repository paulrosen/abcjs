//    abc_voice_element.js: Definition of the VoiceElement class.
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

var VoiceElement = function VoiceElement(voicenumber, voicetotal) {
	this.children = [];
	this.beams = [];
	this.otherchildren = []; // ties, slurs, triplets
	this.w = 0;
	this.duplicate = false;
	this.voicenumber = voicenumber; //number of the voice on a given stave (not staffgroup)
	this.voicetotal = voicetotal;
	this.bottom = 7;
	this.top = 7;
	this.specialY = {
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
};

VoiceElement.prototype.addChild = function (child) {
	if (child.type === 'bar') {
		var firstItem = true;
		for (var i = 0; firstItem && i < this.children.length; i++) {
			if (this.children[i].type.indexOf("staff-extra") < 0 && this.children[i].type !== "tempo")
				firstItem = false;
		}
		if (!firstItem) {
			this.beams.push("bar");
			this.otherchildren.push("bar");
		}
	}
	this.children[this.children.length] = child;
	this.setRange(child);
};

VoiceElement.prototype.setLimit = function(member, child) {
	// Sometimes we get an absolute element in here and sometimes we get some type of relative element.
	// If there is a "specialY" element, then assume it is an absolute element. If that doesn't exist, look for the
	// same members at the top level, because that's where they are in relative elements.
	var specialY = child.specialY;
	if (!specialY) specialY = child;
	if (!specialY[member]) return;
	if (!this.specialY[member])
		this.specialY[member] = specialY[member];
	else
		this.specialY[member] = Math.max(this.specialY[member], specialY[member]);
};

VoiceElement.prototype.adjustRange = function(child) {
	if (child.bottom !== undefined)
		this.bottom = Math.min(this.bottom, child.bottom);
	if (child.top !== undefined)
		this.top = Math.max(this.top, child.top);
};

VoiceElement.prototype.setRange = function(child) {
	this.adjustRange(child);
	this.setLimit('tempoHeightAbove', child);
	this.setLimit('partHeightAbove', child);
	this.setLimit('volumeHeightAbove', child);
	this.setLimit('dynamicHeightAbove', child);
	this.setLimit('endingHeightAbove', child);
	this.setLimit('chordHeightAbove', child);
	this.setLimit('lyricHeightAbove', child);
	this.setLimit('lyricHeightBelow', child);
	this.setLimit('chordHeightBelow', child);
	this.setLimit('volumeHeightBelow', child);
	this.setLimit('dynamicHeightBelow', child);
};

VoiceElement.prototype.addOther = function (child) {
	this.otherchildren.push(child);
	this.setRange(child);
};

VoiceElement.prototype.addBeam = function (child) {
	this.beams.push(child);
};

export default VoiceElement;
