// Run with: tsc --noEmit --strict --typeRoots ./types tests/types/line-breaks.ts
/// <reference path="../../types/index.d.ts" />
import * as abcjs from "abcjs";

const options: abcjs.AbcVisualParams = { lineBreaks: [[0], [0]] };
// @ts-expect-error Breaks are grouped by section.
const invalidOptions: abcjs.AbcVisualParams = { lineBreaks: [0, 1] };
const tune = abcjs.parseOnly("X:1\nK:C\nC D|E F|\n%%text interlude\nG A|B c|", options)[0];
if (tune.lineBreaks) {
	const originalLine: number = tune.lineBreaks[0].ogLine;
	const targetLine: number = tune.lineBreaks[0].line;
	const staff: number | undefined = tune.lineBreaks[0].staff;
	const voice: number | undefined = tune.lineBreaks[0].voice;
	const start: number | undefined = tune.lineBreaks[0].start;
	const end: number | undefined = tune.lineBreaks[0].end;
	// @ts-expect-error Text lines do not have a staff.
	const requiredStaff: number = tune.lineBreaks[0].staff;
}

const music: NonNullable<abcjs.TuneObject["lineBreaks"]>[number] =
	{ ogLine: 0, line: 0, staff: 0, voice: 0, start: 0, end: 2 };
const text: NonNullable<abcjs.TuneObject["lineBreaks"]>[number] = { ogLine: 1, line: 2 };
