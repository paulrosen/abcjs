var highlight = require('../highlight');
var unhighlight = require('../unhighlight');

function Selectables(paper, selectTypes, tuneNumber) {
	this.elements = [];
	this.paper = paper;
	this.tuneNumber = tuneNumber;
	this.selectTypes = selectTypes;
}

Selectables.prototype.getElements = function () {
	return this.elements;
}

Selectables.prototype.add = function (absEl, svgEl, isNote) {
	if (!this.canSelect(absEl))
		return;
	var params;
	if (this.selectTypes === undefined)
		params = { selectable: false, "data-index": this.elements.length}; // This is the old behavior.
	else
		params = { selectable: true, tabindex: 0, "data-index": this.elements.length};
	this.paper.setAttributeOnElement(svgEl, params);
	this.elements.push({ absEl: absEl, svgEl: svgEl, isDraggable: isNote });

};

Selectables.prototype.canSelect = function (absEl) {
	if (this.selectTypes === false)
		return false;
	if (!absEl || !absEl.abcelem)
		return false;
	if (this.selectTypes === true)
		return true;
	if (this.selectTypes === undefined) {
		// by default, only notes can be clicked.
		return absEl.abcelem.el_type === 'note';
	}
	return this.selectTypes.indexOf(absEl.abcelem.el_type) >= 0;
};

Selectables.prototype.wrapSvgEl = function(abcelem, el) {
	var absEl = {
		tuneNumber: this.tuneNumber,
		abcelem: abcelem,
		elemset: [el],
		highlight: highlight,
		unhighlight: unhighlight
	}
	this.add(absEl, el, false);
};

module.exports = Selectables;
