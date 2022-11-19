var spacing = {};

// @ts-expect-error TS(2339): Property 'FONTEM' does not exist on type '{}'.
spacing.FONTEM = 360;
// @ts-expect-error TS(2339): Property 'FONTSIZE' does not exist on type '{}'.
spacing.FONTSIZE = 30;
// @ts-expect-error TS(2339): Property 'STEP' does not exist on type '{}'.
spacing.STEP = (spacing.FONTSIZE * 93) / 720;
// @ts-expect-error TS(2339): Property 'SPACE' does not exist on type '{}'.
spacing.SPACE = 10;
// @ts-expect-error TS(2339): Property 'TOPNOTE' does not exist on type '{}'.
spacing.TOPNOTE = 15;
// @ts-expect-error TS(2339): Property 'STAVEHEIGHT' does not exist on type '{}'... Remove this comment to see the full error message
spacing.STAVEHEIGHT = 100;
// @ts-expect-error TS(2339): Property 'INDENT' does not exist on type '{}'.
spacing.INDENT = 50;

export default spacing;
