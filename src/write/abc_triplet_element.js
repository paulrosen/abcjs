//    abc_triplet_element.js: Definition of the TripletElem class.
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

var TripletElem;

(function() {
	"use strict";

	TripletElem = function TripletElem(number, anchor1, options) {
		this.type = "TripletElem";
		this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after key signature)
		this.number = number;
		this.durationClass = ('d'+(Math.round(anchor1.parent.durationClass*1000)/1000)).replace(/\./, '-');
		this.middleElems = []; // This is to calculate the highest interior pitch. It is used to make sure that the drawn bracket never crosses a really high middle note.
		this.flatBeams = options.flatBeams;
	};

	TripletElem.prototype.isClosed = function() {
		return !!this.anchor2;
	};

	TripletElem.prototype.middleNote = function(elem) {
		this.middleElems.push(elem);
	};

	TripletElem.prototype.setCloseAnchor = function(anchor2) {
		this.anchor2 = anchor2;
		// TODO-PER: Unfortunately, I don't know if there is a beam above until after the vertical positioning is done,
		// so I don't know whether to leave room for the number above. Therefore, If there is a beam on the first note, I'll leave room just in case.
		if (this.anchor1.parent.beam)
			this.endingHeightAbove = 4;
	};

})();

module.exports = TripletElem;
