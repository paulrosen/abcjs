export class Classes {
	shouldAddClasses: boolean;
	lineNumber: number|null = null
	voiceNumber: number|null = null
	measureNumber: number|null = null
	measureTotalPerLine: Array<number> = [];
	noteNumber: number|null = null

	constructor(options: { shouldAddClasses: boolean }) {
		this.shouldAddClasses = options.shouldAddClasses;
		this.reset();
	}

	reset() {
		this.lineNumber = null;
		this.voiceNumber = null;
		this.measureNumber = null;
		this.measureTotalPerLine = [];
		this.noteNumber = null;
	}

	incrLine() {
		if (this.lineNumber === null)
			this.lineNumber = 0;
		else
			this.lineNumber++;
		this.voiceNumber = null;
		this.measureNumber = null;
		this.noteNumber = null;
	}

	incrVoice() {
		if (this.voiceNumber === null)
			this.voiceNumber = 0;
		else
			this.voiceNumber++;
		this.measureNumber = null;
		this.noteNumber = null;
	}

	isInMeasure() {
		return this.measureNumber !== null;
	}

	newMeasure() {
		if (this.measureNumber && this.lineNumber !== null)
			this.measureTotalPerLine[this.lineNumber] = this.measureNumber;
		this.measureNumber = null;
		this.noteNumber = null;
	}

	startMeasure() {
		this.measureNumber = 0;
		this.noteNumber = 0;
	}

	incrMeasure() {
		if (!this.measureNumber)
			this.measureNumber = 0;
		this.measureNumber++;
		this.noteNumber = 0;
	}

	incrNote() {
		if (!this.noteNumber)
			this.noteNumber = 0;
		this.noteNumber++;
	}

	measureTotal() {
		let total = 0;
		const numLines = this.lineNumber ? this.lineNumber : 0;
		for (let i = 0; i < numLines; i++)
			total += this.measureTotalPerLine[i] ? this.measureTotalPerLine[i] : 0; // This can be null when non-music things are present.
		if (this.measureNumber)
			total += this.measureNumber;
		return total;
	}

	getCurrent() {
		return {
			line: this.lineNumber,
			measure: this.measureNumber,
			measureTotal: this.measureTotal(),
			voice: this.voiceNumber,
			note: this.noteNumber
		}
	}

	generate(c?:string) {
		if (!this.shouldAddClasses)
			return "";
		let ret : Array<string> = [];
		if (c && c.length > 0) ret.push(c);
		if (c === "abcjs-tab-number") // TODO-PER-HACK! straighten out the tablature
			return ret.join(' ')
		if (c === "text instrument-name")
			return "abcjs-text abcjs-instrument-name"
		if (this.lineNumber !== null) ret.push("l" + this.lineNumber);
		if (this.measureNumber !== null) ret.push("m" + this.measureNumber);
		if (this.measureNumber !== null) ret.push("mm" + this.measureTotal()); // measureNumber is null between measures so this is still the test for measureTotal
		if (this.voiceNumber !== null) ret.push("v" + this.voiceNumber);
		if (c && (c.indexOf('note') >= 0 || c.indexOf('rest') >= 0 || c.indexOf('lyric') >= 0) && this.noteNumber !== null) ret.push("n" + this.noteNumber);
		// add a prefix to all classes that abcjs adds.
		if (ret.length > 0) {
			const str = ret.join(' '); // Some strings are compound classes - that is, specify more than one class in a string.
			ret = str.split(' ');
			ret.forEach(r => {
				if (r.indexOf('abcjs-') !== 0 && r.length > 0) // if the prefix doesn't already exist and the class is not blank.
					r = 'abcjs-' + r;
			})
		}
		return ret.join(' ');
	}

}
