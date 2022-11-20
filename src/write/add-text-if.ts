function addTextIf(rows: any, params: any, getTextSize: any) {
  if (!params.text) return;
  if (!params.marginLeft) params.marginLeft = 0;
  if (!params.klass) params.klass = "";
  if (!params.anchor) params.anchor = "start";
  if (!params.info) params.info = { startChar: -2, endChar: -2 };

  if (params.marginTop) rows.push({ move: params.marginTop });
  var attr = {
    left: params.marginLeft,
    text: params.text,
    font: params.font,
    anchor: params.anchor,
    startChar: params.info.startChar,
    endChar: params.info.endChar
  };
  // @ts-expect-error TS(2339): Property 'absElemType' does not exist on type '{ l... Remove this comment to see the full error message
  if (params.absElemType) attr.absElemType = params.absElemType;
  // @ts-expect-error TS(2339): Property 'klass' does not exist on type '{ left: a... Remove this comment to see the full error message
  if (!params.inGroup) attr.klass = params.klass;
  // @ts-expect-error TS(2339): Property 'name' does not exist on type '{ left: an... Remove this comment to see the full error message
  if (params.name) attr.name = params.name;

  rows.push(attr);
  // If there are blank lines they won't be counted by getTextSize, so just get the height of one line and multiply
  var size = getTextSize.calc("A", params.font, params.klass);
  var numLines = params.text.split("\n").length;
  if (params.text[params.text.length - 1] === "\n") numLines--; // If there is a new line at the end of the string, then an extra line will be counted.
  if (!params.noMove) {
    var h = size.height * 1.1 * numLines;
    rows.push({ move: Math.round(h) });
    if (params.marginBottom) rows.push({ move: params.marginBottom });
  }
}

export default addTextIf;
