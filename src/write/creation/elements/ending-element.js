//    abc_ending_element.js: Definition of the EndingElement class.

var EndingElem = function EndingElem(text, anchor1, anchor2) {
	this.type = "EndingElem";
	this.text = text; // text to be displayed top left
	this.anchor1 = anchor1; // must have a .x property or be null (means starts at the "beginning" of the line - after keysig)
	this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
	this.endingHeightAbove = 5;
	this.pitch = undefined; // This will be set later
};

module.exports = EndingElem;
