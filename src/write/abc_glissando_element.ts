var GlissandoElem = function GlissandoElem(this: any, anchor1: any, anchor2: any) {
  this.type = "GlissandoElem";
  this.anchor1 = anchor1; // must have a .x and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
  this.anchor2 = anchor2; // must have a .x property or be null (means ends at the end of the line)
};

export default GlissandoElem;
