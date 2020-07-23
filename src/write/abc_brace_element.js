//    abc_brace_element.js: Definition of the BraceElement class.
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

var BraceElem = function BraceElem(voice, type) {
    this.startVoice = voice;
    this.type = type;
};

BraceElem.prototype.setBottomStaff = function(voice) {
	this.endVoice = voice;
	// If only the start brace has a name then the name belongs to the brace instead of the staff.
	if (this.startVoice.header && !this.endVoice.header) {
		this.header = this.startVoice.header;
		delete this.startVoice.header;
	}
};

BraceElem.prototype.continuing = function(voice) {
	// If the final staff isn't present, then use the last one we saw.
	this.lastContinuedVoice = voice;
};

BraceElem.prototype.getWidth = function() {
	return 10; // TODO-PER: right now the drawing function doesn't vary the width at all. If it does in the future then this will change.
};

BraceElem.prototype.isStartVoice = function (voice) {
	if (this.startVoice && this.startVoice.staff && this.startVoice.staff.voices.length > 0 && this.startVoice.staff.voices[0] === voice)
		return true;
	return false;
};

module.exports = BraceElem;
