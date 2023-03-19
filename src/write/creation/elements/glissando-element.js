var GlissandoElem = function GlissandoElem(anchor1, anchor2) {
	this.type = "GlissandoElem";
	this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
	this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
};

module.exports = GlissandoElem;
