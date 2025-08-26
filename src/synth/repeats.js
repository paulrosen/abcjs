const parseCommon = require("../parse/abc_common");

function Repeats(voice) {
	this.repeatCommon = { start: 0} // Where to go back to - this is an index into the voices array that is passed in. If there is no end element then we are still looking for it.
	this.endings = [] // Where endings start - there is one of these for each ending specified. So endingStart[1] is the first ending, etc.
	this.activeEndings = []
	this.repeatInstructions = []

	this.addBar = function(elem) {
		var i,ending, endings;
		if (elem.type === "bar_right_repeat" || elem.type === "bar_dbl_repeat") {
			for (i = 0; i < this.activeEndings.length; i++) {
				this.endings[this.activeEndings[i]].end = voice.length-1
			}
			this.activeEndings = []
		}
		if (elem.startEnding) {
			if (this.repeatCommon.end === undefined)
				this.repeatCommon.end = voice.length-1

			// The ending can be in four different types: "random-string", "number", "number-number", "number,number"
			// If we don't get a number out of it then we will just skip the ending - we don't know what to do with it.
			if (elem.startEnding.indexOf(',') > 0) {
				endings = elem.startEnding.split(',')
				for (i = 0; i < endings.length; i++) {
					ending = parseInt(endings[i],10)
					if (ending > 0) {
						this.endings[ending] = {start: voice.length}
						this.activeEndings.push(ending)
					}
				}
			} else if (elem.startEnding.indexOf('-') > 0) {
				endings = elem.startEnding.split('-')
				var se = parseInt(endings[0],10)
				var ee = parseInt(endings[1],10)
				for (i = se; i <= ee; i++) {
					this.endings[i] = {start: voice.length}
					this.activeEndings.push(i)
				}
			} else {
				ending = parseInt(elem.startEnding,10)
				if (ending > 0) {
					this.endings[ending] = {start: voice.length}
					this.activeEndings.push(ending)
				}
			}
		}
		if (elem.type === "bar_left_repeat" || elem.type === "bar_dbl_repeat") {
			for (i = 0; i < this.activeEndings.length; i++)
				this.endings[this.activeEndings[i]].end = voice.length-1
			this.repeatInstructions.push({common: this.repeatCommon, endings: this.endings})
			this.repeatCommon = {start: voice.length};
			this.endings = []
			this.activeEndings = []
		}

	}
	this.resolveRepeats = function() {
		if (this.endings) {
			this.repeatInstructions.push({common: this.repeatCommon, endings: this.endings})
		}
		if (this.repeatInstructions.length === 0)
			return voice // If there are no repeats then don't bother copying anything

		var output = []
		if (this.repeatInstructions[0].start > 0) {
			// There are some things that aren't repeated - just copy them
			for (var i = 0; i < this.repeatInstructions[0].start; i++)
				output.push(voice[i])
		}
		var lastEnd = -1
		for (var r = 0; r < this.repeatInstructions.length; r++) {
			var instructions = this.repeatInstructions[r]
			if (lastEnd >= 0 && lastEnd+1 !== instructions.common.start) {
				// This is for interstitial stuff - anything that is not in either the common area or one of the endings.
				// Typically, this would be for measures after a :| but before
				// the next |:
				duplicateSpan(voice, output, lastEnd+1, instructions.common.start-1)
			}
			for (var e = 0; e < instructions.endings.length; e++) {
				var end = instructions.endings[e]
				if (end) { // this is a sparse array so skip the empty ones
					duplicateSpan(voice, output, instructions.common.start, instructions.common.end)
					duplicateSpan(voice, output, end.start, end.end)
					lastEnd = Math.max(lastEnd, end.end)
				}
			}
		}
		if (lastEnd >= 0 && lastEnd < voice.length-1) {
			// There might be measures after the repeated section, so copy to the end of the voice.
			duplicateSpan(voice, output, lastEnd+1, voice.length-1)
		}
		return output
	}
}

function duplicateSpan(input, output, start, end) {
	for (var i = start; i <= end; i++) {
		output.push(duplicateItem(input[i]))
	}
}

function duplicateItem(src) {
	var item = Object.assign({},src);
	if (item.pitches)
		item.pitches = parseCommon.cloneArray(item.pitches);
	return item
}

module.exports = Repeats;
