var Classes = function Classes(options) {
	this.shouldAddClasses = options.shouldAddClasses;
	this.reset();
}

Classes.prototype.reset = function () {
	this.lineNumber = null;
	this.voiceNumber = null;
	this.measureNumber = null;
	this.noteNumber = null;
}

Classes.prototype.incrLine = function () {
	if (this.lineNumber === null)
		this.lineNumber = 0;
	else
		this.lineNumber++;
	this.voiceNumber = null;
	this.measureNumber = null;
	this.noteNumber = null;
};

Classes.prototype.incrVoice = function () {
	if (this.voiceNumber === null)
		this.voiceNumber = 0;
	else
		this.voiceNumber++;
	this.measureNumber = null;
	this.noteNumber = null;
};

Classes.prototype.isInMeasure = function () {
	return this.measureNumber !== null;
};

Classes.prototype.newMeasure = function () {
	this.measureNumber = null;
	this.noteNumber = null;
};

Classes.prototype.startMeasure = function () {
	this.measureNumber = 0;
	this.noteNumber = 0;
};

Classes.prototype.incrMeasure = function () {
	this.measureNumber++;
	this.noteNumber = 0;
};

Classes.prototype.incrNote = function () {
	this.noteNumber++;
};

Classes.prototype.generate = function (c) {
	if (!this.shouldAddClasses)
		return "";
	var ret = [];
	if (c && c.length > 0) ret.push(c);
	if (this.lineNumber !== null) ret.push("l"+this.lineNumber);
	if (this.measureNumber !== null) ret.push("m"+this.measureNumber);
	if (this.voiceNumber !== null)  ret.push("v"+this.voiceNumber);
	if (c && (c.indexOf('note') >= 0 || c.indexOf('rest') >= 0 || c.indexOf('lyric') >= 0 ) && this.noteNumber !== null) ret.push("n"+this.noteNumber);
	// add a prefix to all classes that abcjs adds.
	if (ret.length > 0) {
		ret = ret.join(' '); // Some strings are compound classes - that is, specify more than one class in a string.
		ret = ret.split(' ');
		for (var i = 0; i < ret.length; i++) {
			if (ret[i].indexOf('abcjs-') !== 0 && ret[i].length > 0) // if the prefix doesn't already exist and the class is not blank.
				ret[i] = 'abcjs-' + ret[i];
		}
	}
	return ret.join(' ');
};


export default Classes;
