import highlight from '../highlight';
import unhighlight from '../unhighlight';

function Selectables(this: any, paper: any, selectTypes: any, tuneNumber: any) {
  this.elements = [];
  this.paper = paper;
  this.tuneNumber = tuneNumber;
  this.selectTypes = selectTypes;
}

Selectables.prototype.getElements = function () {
  return this.elements;
};

Selectables.prototype.add = function (
  absEl: any,
  svgEl: any,
  isNoteOrTabNumber: any,
  staffPos: any
) {
  if (!this.canSelect(absEl)) return;
  var params;
  if (this.selectTypes === undefined)
    params = {
      selectable: false,
      "data-index": this.elements.length
    }; // This is the old behavior.
  else
    params = {
      selectable: true,
      tabindex: 0,
      "data-index": this.elements.length
    };
  this.paper.setAttributeOnElement(svgEl, params);
  var sel = { absEl: absEl, svgEl: svgEl, isDraggable: isNoteOrTabNumber };
  // @ts-expect-error TS(2339): Property 'staffPos' does not exist on type '{ absE... Remove this comment to see the full error message
  if (staffPos !== undefined) sel.staffPos = staffPos;
  this.elements.push(sel);
};

Selectables.prototype.canSelect = function (absEl: any) {
  if (this.selectTypes === false) return false;
  if (!absEl || !absEl.abcelem) return false;
  if (this.selectTypes === true) return true;
  if (this.selectTypes === undefined) {
    // by default, only notes and tab numbers can be clicked.
    if (
      absEl.abcelem.el_type === "note" ||
      absEl.abcelem.el_type === "tabNumber"
    ) {
      return true;
    }
    return false;
  }
  return this.selectTypes.indexOf(absEl.abcelem.el_type) >= 0;
};

Selectables.prototype.wrapSvgEl = function (abcelem: any, el: any) {
  var absEl = {
    tuneNumber: this.tuneNumber,
    abcelem: abcelem,
    elemset: [el],
    highlight: highlight,
    unhighlight: unhighlight
  };
  this.add(absEl, el, false);
};

export default Selectables;
