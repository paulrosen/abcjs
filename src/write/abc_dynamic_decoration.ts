//    abc_dynamic_decoration.js: Definition of the DynamicDecoration class.

var DynamicDecoration = function DynamicDecoration(this: any, anchor: any, dec: any, position: any) {
  this.type = "DynamicDecoration";
  this.anchor = anchor;
  this.dec = dec;
  if (position === "below") this.volumeHeightBelow = 6;
  else this.volumeHeightAbove = 6;
  this.pitch = undefined; // This will be set later
};

export default DynamicDecoration;
