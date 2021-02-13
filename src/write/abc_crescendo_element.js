//    abc_crescendo_element.js: Definition of the CrescendoElem class.

var CrescendoElem = function CrescendoElem(anchor1, anchor2, dir, positioning) {
	this.type = "CrescendoElem";
	this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
	this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
	this.dir = dir; // either "<" or ">"
	if (positioning === 'above')
		this.dynamicHeightAbove = 6;
	else
		this.dynamicHeightBelow = 6;
	this.pitch = undefined; // This will be set later
};

module.exports = CrescendoElem;
