function Separator(this: any, spaceAbove: any, lineLength: any, spaceBelow: any) {
  this.rows = [];
  if (spaceAbove) this.rows.push({ move: spaceAbove });
  this.rows.push({ separator: lineLength, absElemType: "separator" });
  if (spaceBelow) this.rows.push({ move: spaceBelow });
}

export default Separator;
