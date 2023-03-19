var highlight = require('../interactive/highlight');
var unhighlight = require('../interactive/unhighlight');

function Selectables(paper, selectTypes, tuneNumber) {
	this.elements = [];
	this.paper = paper;
	this.tuneNumber = tuneNumber;
	this.selectTypes = selectTypes;
}

Selectables.prototype.getElements = function () {
	return this.elements;
};

Selectables.prototype.add = function (absEl, svgEl, isNoteOrTabNumber, staffPos) {
	if (!this.canSelect(absEl))
		return;
	var params;
	if (this.selectTypes === undefined)
		params = { selectable: false, "data-index": this.elements.length }; // This is the old behavior.
	else
		params = { selectable: true, tabindex: 0, "data-index": this.elements.length };
	this.paper.setAttributeOnElement(svgEl, params);
	var sel = { absEl: absEl, svgEl: svgEl, isDraggable: isNoteOrTabNumber };
	if (staffPos !== undefined)
		sel.staffPos = staffPos;
	this.elements.push(sel);

};

Selectables.prototype.canSelect = function (absEl) {
	if (this.selectTypes === false)
		return false;
	if (!absEl || !absEl.abcelem)
		return false;
	if (this.selectTypes === true)
		return true;
	if (this.selectTypes === undefined) {
		// by default, only notes and tab numbers can be clicked.
		if (absEl.abcelem.el_type === 'note' || absEl.abcelem.el_type === 'tabNumber') {
			return true;
		}
		return false;
	}
	return this.selectTypes.indexOf(absEl.abcelem.el_type) >= 0;
};

Selectables.prototype.wrapSvgEl = function (abcelem, el) {
	var absEl = {
		tuneNumber: this.tuneNumber,
		abcelem: abcelem,
		elemset: [el],
		highlight: highlight,
		unhighlight: unhighlight
	};
	this.add(absEl, el, false);
};

module.exports = Selectables;
