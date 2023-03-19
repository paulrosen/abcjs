//    abc_triplet_element.js: Definition of the TripletElem class.

var TripletElem = function TripletElem(number, anchor1, options) {
	this.type = "TripletElem";
	this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after key signature)
	this.number = number;
	this.durationClass = ('d' + (Math.round(anchor1.parent.durationClass * 1000) / 1000)).replace(/\./, '-');
	this.middleElems = []; // This is to calculate the highest interior pitch. It is used to make sure that the drawn bracket never crosses a really high middle note.
	this.flatBeams = options.flatBeams;
};

TripletElem.prototype.isClosed = function () {
	return !!this.anchor2;
};

TripletElem.prototype.middleNote = function (elem) {
	this.middleElems.push(elem);
};

TripletElem.prototype.setCloseAnchor = function (anchor2) {
	this.anchor2 = anchor2;
	// TODO-PER: This used to be just for beamed triplets but it looks like bracketed triplets need extra room, too. The only one that doesn't is stem down and beamed
	//if (this.anchor1.parent.beam)
	if (!this.anchor1.parent.beam || this.anchor1.stemDir === 'up')
		this.endingHeightAbove = 4;
};

module.exports = TripletElem;
