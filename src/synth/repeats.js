const parseCommon = require("../parse/abc_common");

function Repeats(voice) {
	this.repeatCommon = { start: 0} // Where to go back to - this is an index into the voices array that is passed in. If there is no end element then we are still looking for it.
	this.endings = [] // Where endings start - there is one of these for each ending specified. So endingStart[1] is the first ending, etc.
	this.activeEndings = []
	this.repeatInstructions = []
	this.repeatFound = false

	this.sections = [{type: 'startRepeat', index: 0}]

	this.addBar = function(elem) {
		var i,ending, endings;
		var thisIndex = voice.length - 1
		var isStartRepeat = elem.type === "bar_left_repeat" || elem.type === "bar_dbl_repeat"
		var isEndRepeat = elem.type === "bar_right_repeat" || elem.type === "bar_dbl_repeat"
		var startEnding = elem.startEnding ? startEndingNumbers(elem.startEnding) : undefined
		console.log({thisIndex,isStartRepeat,isEndRepeat,startEnding})
		if (isEndRepeat)
			this.sections.push({type:"endRepeat", index: thisIndex})
		if (isStartRepeat)
			this.sections.push({type:"startRepeat", index: thisIndex})
		if (startEnding)
			this.sections.push({type:"startEnding", index: thisIndex, endings: startEnding})


		// if (isStartRepeat) {
		// 	// If there is unused section, then add it first
		// 	if (this.sectionStart < thisIndex)
		// 		this.sections.push({start: this.sectionStart, end: thisIndex})
		// 	// Reset the repeat variables and set the starting place to the current element
		// 	this.sectionStart = thisIndex
		// 	this.repeatCommonEnd = -1
		// 	this.endings = []
		// 	this.currentRepeatNumber = 1
		// }
		//
		// if (isEndRepeat) {
		// 	if (this.repeatCommonEnd === -1)
		// 		this.repeatCommonEnd = thisIndex
		// 	// A section is repeating now
		// 	this.sections.push({start: this.sectionStart, end: this.repeatCommonEnd})
		// }
		//
		// if (startEnding) {
		// 	if (this.repeatCommonEnd === -1)
		// 		this.repeatCommonEnd = thisIndex
		// 	const nums = startEndingNumbers(startEnding)
		// 	for (var i = 0; i < nums.length; i++)
		// 		this.endings[nums[i]] = {start:thisIndex}
		// }

		/////////////////
		if (isEndRepeat) {
			if (this.activeEndings.length) {
				for (i = 0; i < this.activeEndings.length; i++) {
					this.endings[this.activeEndings[i]].end = thisIndex
				}
			} else {
				if (this.repeatCommon.end === undefined)
					this.repeatCommon.end = thisIndex
				this.repeatInstructions.push({common: this.repeatCommon, endings: []})
			}
			this.activeEndings = []
			this.repeatFound = true
		}
		if (elem.startEnding) {
			if (this.repeatCommon.end === undefined)
				this.repeatCommon.end = thisIndex

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
			if (this.repeatCommon.end === undefined)
				this.repeatCommon.end = voice.length-1
			this.repeatInstructions.push({common: this.repeatCommon, endings: this.endings})
			this.repeatCommon = {start: voice.length};
			this.endings = []
			this.activeEndings = []
		}

	}
	// flatten-six-huit
	// [{"type":"startRepeat","index":0,"end":17}]
	// 0-17

	// flatten-repeat
	//[{"type":"startRepeat","index":0},
	// {"type":"startRepeat","index":7},
	// {"type":"startEnding","index":12,"endings":[1]},
	// {"type":"endRepeat","index":18},
	// {"type":"startRepeat","index":19,"end":21}]
	// 0-6, 7-11, 12-17, 7-11, 19-21

	// flatten-midmeasure
	// [{"type":"startRepeat","index":0},
	// {"type":"startRepeat","index":2,"end":16}]
	// 0-1, 2-16

	// flatten-grace
	// [{"type":"startRepeat","index":0},
	// {"type":"startRepeat","index":4},
	// {"type":"endRepeat","index":14},
	// {"type":"startRepeat","index":15,"end":23}]
	// 0-3, 4-13, 4-13, 15-23

	// flatted-overlay
	// [{"type":"startRepeat","index":0,"end":29}]
	// [{"type":"startRepeat","index":0,"end":26}]
	// [{"type":"startRepeat","index":0,"end":9}]

	// flatten-regular-tie
	// [{"type":"startRepeat","index":0},
	// {"type":"endRepeat","index":16},
	// 0-16, 0-16

	// flatten-twelve-eight
	//[{"type":"startRepeat","index":0},
	// {"type":"startRepeat","index":3,"end":23}]
	// 0-2, 3-23

	// flatten-tempo-3-voices
	// [{"type":"startRepeat","index":0},
	// {"type":"endRepeat","index":34},
	//
	// [{"type":"startRepeat","index":0},
	// {"type":"endRepeat","index":16},
	//
	// [{"type":"startRepeat","index":0},
	// {"type":"endRepeat","index":23},

	// volume-in-chords
	// [{"type":"startRepeat","index":0},
	// {"type":"startRepeat","index":3},
	// {"type":"endRepeat","index":10},
	// 0-2,3-10,3-10

	// repeat-3
	// [{"type":"startRepeat","index":0},
	// {"type":"startEnding","index":5,"endings":[1]},
	// {"type":"endRepeat","index":7},
	// {"type":"startEnding","index":7,"endings":[2]},
	// {"type":"endRepeat","index":9},
	// {"type":"startEnding","index":9,"endings":[3]},
	// {"type":"startRepeat","index":11},
	// {"type":"startEnding","index":13,"endings":[1,3]},
	// {"type":"endRepeat","index":15},
	// {"type":"startEnding","index":15,"endings":[2,4]},
	// {"type":"endRepeat","index":17},
	// {"type":"startRepeat","index":21},
	// {"type":"startEnding","index":23,"endings":[1,2,3]},
	// {"type":"endRepeat","index":25},
	// {"type":"startEnding","index":25,"endings":[4]},
	// {"type":"endRepeat","index":29},
	// {"type":"startRepeat","index":30,"end":31}]
	// 0-4,5-7, 0-4, etc..

	// of repeated sections
	// [{"type":"startRepeat","index":0},
	// {"type":"startRepeat","index":7},
	// {"type":"startEnding","index":11,"endings":[1]},
	// {"type":"endRepeat","index":15},
	// {"type":"startEnding","index":15,"endings":[2]},
	// {"type":"startRepeat","index":16,"end":19}]
	// 0-6, 7-11, 12-15, 7-11, 16-19

	// repeat at start crash
	// [{"type":"startRepeat","index":0},
	// {"type":"startEnding","index":4,"endings":[1]},
	// {"type":"endRepeat","index":6},
	// {"type":"startEnding","index":6,"endings":[2]},
	// {"type":"startRepeat","index":7,"end":7}]
	// ** there's not close measure - is that messing up the end?
	// 0-3, 4-6, 0-3, 7-7

	// volume-crash
	// [{"type":"startRepeat","index":0,"end":5}]
	// 0-5

	this.resolveRepeats = function() {
		// Sections contain all the interesting bars - start and end repeats.
		// There may be one last set of events after the last interesting bar, so capture that now.
		var lastSection = this.sections[this.sections.length-1]
		var lastElement = voice.length-1
		if (lastSection.type === 'startRepeat')
			lastSection.end = lastElement
		else if (lastSection.index+1 < lastElement)
			this.sections.push({type: "startRepeat", index: lastSection.index+1, end: lastElement})

		console.log(JSON.stringify(this.sections))

		// Go through all the markers and turn that into an array of sets of sections in order
		var repeatInstructions = []
		var nextEndingNumber = 1
		var startEndingIndex = 0
		for (var i = 0; i < this.sections.length; i++) {
			var section = this.sections[i]
			var end = section.end ? section.end : (i < this.sections.length-1 ? this.sections[i+1].index : lastElement)
			switch (section.type) {
				case "startRepeat":
					nextEndingNumber = 1
					startEndingIndex = i
					repeatInstructions.push({start: section.index, end: end})
					break;
				case "startEnding":
					break;
				case "endRepeat":
					break;
			}
		}
		/////////////////////////////////
		if (this.endings && this.endings.length > 0) {
			this.repeatInstructions.push({common: this.repeatCommon, endings: this.endings})
		}
		if (this.repeatCommon.end === undefined) {
			// If there was an unresolved left repeat
			this.repeatCommon.end = voice.length - 1
			this.repeatInstructions.push({common: this.repeatCommon, endings: []})
		}
		if (this.repeatInstructions.length === 0)
			return voice // If there are no repeats then don't bother copying anything

		//console.log("resolve", {endings: this.endings, repeatCommon: this.repeatCommon, repeatInstructions: this.repeatInstructions})
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
			if (instructions.endings.length === 0) {
				// this is probably a case where there was a left repeat after the beginning, like `cde |: fga`
				duplicateSpan(voice, output, instructions.common.start, instructions.common.end)
			} else {
				for (var e = 0; e < instructions.endings.length; e++) {
					var end = instructions.endings[e]
					if (end) { // this is a sparse array so skip the empty ones
						duplicateSpan(voice, output, instructions.common.start, instructions.common.end)
						duplicateSpan(voice, output, end.start, end.end)
						lastEnd = Math.max(lastEnd, end.end)
					}
				}
			}
		}
		//console.log({lastEnd, totalLen: voice.length-1})
		if (lastEnd >= 0 && lastEnd < voice.length-1) {
			// There might be measures after the repeated section, so copy to the end of the voice.
			duplicateSpan(voice, output, instructions.common.start, instructions.common.end)
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

function startEndingNumbers(startEnding) {
	// The ending can be in four different types: "random-string", "number", "number-number", "number,number"
	// If we don't get a number out of it then we will just skip the ending - we don't know what to do with it.
	var nums = []
	var ending, endings, i;
	if (startEnding.indexOf(',') > 0) {
		endings = startEnding.split(',')
		for (i = 0; i < endings.length; i++) {
			ending = parseInt(endings[i],10)
			if (ending > 0) {
				nums.push(ending)
			}
		}
	} else if (startEnding.indexOf('-') > 0) {
		endings = startEnding.split('-')
		var se = parseInt(endings[0],10)
		var ee = parseInt(endings[1],10)
		for (i = se; i <= ee; i++) {
			nums.push(i)
		}
	} else {
		ending = parseInt(startEnding,10)
		if (ending > 0) {
			nums.push(ending)
		}
	}
	return nums
}

module.exports = Repeats;
