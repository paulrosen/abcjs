const parseCommon = require("../parse/abc_common");

function Repeats(voice) {
	this.sections = [{type: 'startRepeat', index: -1}]

	this.addBar = function(elem) {
		// Record the "interesting" parts for analysis at the end.
		var thisIndex = voice.length - 1
		var isStartRepeat = elem.type === "bar_left_repeat" || elem.type === "bar_dbl_repeat"
		var isEndRepeat = elem.type === "bar_right_repeat" || elem.type === "bar_dbl_repeat"
		var startEnding = elem.startEnding ? startEndingNumbers(elem.startEnding) : undefined
		if (isEndRepeat) {
			// If there are two endRepeats in a row, that is a notation error, but we'll recover by pretending there was a startRepeat right before it.
			if (this.sections.length > 0 && this.sections[this.sections.length-1].type === 'endRepeat')
				this.sections.push({type: "startRepeat", index: this.sections[this.sections.length-1].index})
			this.sections.push({type: "endRepeat", index: thisIndex})
		}
		if (isStartRepeat)
			this.sections.push({type:"startRepeat", index: thisIndex})
		if (startEnding)
			this.sections.push({type:"startEnding", index: thisIndex, endings: startEnding})
	}

	this.resolveRepeats = function() {
		// this.sections contain all the interesting bars - start and end repeats.
		var e

		// There may be one last set of events after the last interesting bar, so capture that now.
		var lastSection = this.sections[this.sections.length-1]
		var lastElement = voice.length-1
		if (lastSection.type === 'startRepeat')
			lastSection.end = lastElement
		else if (lastSection.index+1 < lastElement)
			this.sections.push({type: "startRepeat", index: lastSection.index+1})

		// console.log(voice.map((el,index) => {
		// 	return JSON.stringify({i: index, t: el.el_type, p: el.pitches ? el.pitches[0].name: undefined})
		// }).join("\n"))

		// console.log(this.sections.map(s => JSON.stringify(s)).join("\n"))
		if (this.sections.length < 2)
			return voice // If there are no repeats then don't bother copying anything

		// Go through all the markers and turn that into an array of sets of sections in order.
		// The output is repeatInstructions. If "endings" is not present, then the common section should just
		// be copied once. If "endings" is present but is empty, that means it is a plain repeat without
		// endings so the common section is copied twice. If "endings" contains items, then copy the
		// common section followed by each ending in turn. If the last item in "endings" is -1, then
		// the common section should be copied one more time but there isn't a corresponding ending for it.
		var repeatInstructions = [] // { common: { start: number, end: number }, endings: Array<{start:number, end:number> }
		var currentRepeat = null
		for (var i = 0; i < this.sections.length; i++) {
			var section = this.sections[i]
			//var end = i < this.sections.length-1 ? this.sections[i+1].index : lastElement
			switch (section.type) {
				case "startRepeat":
					if (currentRepeat) {
						if (!currentRepeat.common.end)
							currentRepeat.common.end = section.index
						if (currentRepeat.endings) {
							for (e = 0; e < currentRepeat.endings.length; e++) {
								if (currentRepeat.endings[e] && !currentRepeat.endings[e].end && currentRepeat.endings[e].start !== section.index)
									currentRepeat.endings[e].end = section.index
							}
						}
						// If the last event was an end repeat, then there is one more repeat of just the common area. (Only when there are ending markers - otherwise it is already taken care of.)
						if (this.sections[i-1].type === 'endRepeat' && currentRepeat.endings && currentRepeat.endings.length)
							currentRepeat.endings[currentRepeat.endings.length] = { start: -1, end: -1}

						repeatInstructions.push(currentRepeat)
					}

					// if there is a gap between the last event and this start, then
					// insert those items.
					if (currentRepeat) {
						var lastUsed = currentRepeat.common.end
						if (currentRepeat.endings) {
							for (e = 0; e < currentRepeat.endings.length; e++) {
								if (currentRepeat.endings[e])
									lastUsed = Math.max(lastUsed, currentRepeat.endings[e].end)
							}
						}

						if (lastUsed < section.index - 1) {
							//console.log("gap", voice.slice(lastUsed+1, section.index))
							repeatInstructions.push({common: {start: lastUsed+1, end: section.index}})
						}
					}
					currentRepeat = { common: { start: section.index} }
					break;
				case "startEnding": {
					if (currentRepeat) {
						if (!currentRepeat.common.end)
							currentRepeat.common.end = section.index
						if (!currentRepeat.endings)
							currentRepeat.endings = []
						for (e = 0; e < section.endings.length; e++)
							currentRepeat.endings[section.endings[e]] = {start: section.index+1}
					}
					break;
				}
				case "endRepeat":
					if (currentRepeat) {
						if (!currentRepeat.endings)
							currentRepeat.endings = []
						if (currentRepeat.endings.length > 0) {
							for (e = 0; e < currentRepeat.endings.length; e++) {
								if (currentRepeat.endings[e] && !currentRepeat.endings[e].end)
									currentRepeat.endings[e].end = section.index
							}
						}
						if (!currentRepeat.common.end)
							// This is a repeat that doesn't have first and second endings
							currentRepeat.common.end = section.index
					}
					break;
			}
		}
		if (currentRepeat) {
			if (!currentRepeat.common.end)
				currentRepeat.common.end = lastElement
			if (currentRepeat.endings) {
				for (e = 0; e < currentRepeat.endings.length; e++) {
					if (currentRepeat.endings[e] && !currentRepeat.endings[e].end)
						currentRepeat.endings[e].end = lastElement
				}
			}
			repeatInstructions.push(currentRepeat)
		}
		// for (var x = 0; x < repeatInstructions.length; x++) {
		// 	console.log(JSON.stringify(repeatInstructions[x]))
		// }

		var output = []
		var lastEnd = -1
		for (var r = 0; r < repeatInstructions.length; r++) {
			var instructions = repeatInstructions[r]
			if (!instructions.endings) {
				duplicateSpan(voice, output, instructions.common.start, instructions.common.end)
			} else if (instructions.endings.length === 0) {
				// this is when there is no endings specified - it is just a repeat
				duplicateSpan(voice, output, instructions.common.start, instructions.common.end)
				duplicateSpan(voice, output, instructions.common.start, instructions.common.end)
			} else {
				for (e = 0; e < instructions.endings.length; e++) {
					var ending = instructions.endings[e]
					if (ending) { // this is a sparse array so skip the empty ones
						duplicateSpan(voice, output, instructions.common.start, instructions.common.end)
						if (ending.start > 0) {
							duplicateSpan(voice, output, ending.start, ending.end)
						}
						lastEnd = Math.max(lastEnd, ending.end)
					}
				}
			}
		}
		return output
	}
}

function duplicateSpan(input, output, start, end) {
	//console.log("dup", {start, end})
	if (start < 0) start = 0
	// If there is a bar at the end of a line and a bar to start the next line, it would be duplicated.
	if (output.length > 0 && input[start].el_type === 'bar' && output[output.length-1].el_type === 'bar')
		start++

	for (var i = start; i <= end; i++) {
		// If there is a beginning element, it might be duplicated.
		var index;
		var skip = false
		if (input[i].el_type === 'key' || input[i].el_type === 'meter' || input[i].el_type === 'tempo' || input[i].el_type === 'instrument') {
			index = output.length-1
			while (index >= 0 && output[index].el_type !== input[i].el_type)
				index--
			if (index >= 0) {
				if (input[i].el_type === 'key' && areKeysEqual(input[i], output[index])) {
					skip = true
				} else if (input[i].el_type === 'meter' && input[i].num === output[index].num && input[i].den === output[index].den) {
					skip = true
				} else if (input[i].el_type === 'instrument' && input[i].program === output[index].program) {
					skip = true
				} else if (input[i].el_type === 'tempo' && input[i].qpm === output[index].qpm) {
					skip = true
				}
			}
		}
		if (!skip)
			output.push(duplicateItem(input[i]))
	}
}

function duplicateItem(src) {
	var item = Object.assign({},src);
	if (item.pitches)
		item.pitches = parseCommon.cloneArray(item.pitches);
	return item
}

function areKeysEqual(el1, el2) {
	if (!el1.accidentals || !el2.accidentals)
		return false // this shouldn't happen, but if so, we don't want to skip the element

	return JSON.stringify(el1.accidentals) === JSON.stringify(el2.accidentals)
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
