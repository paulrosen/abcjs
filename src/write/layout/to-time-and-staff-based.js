function toTimeAndStaffBased(abcLines) {
	var results = []
	for (var lin = 0; lin < abcLines.length; lin++) {
		var line = abcLines[lin]
		var staffGroup = line.staffGroup

		var group = []
		if (staffGroup && staffGroup && staffGroup.staffs) {
			for (var s = 0; s < staffGroup.staffs.length; s++) {
				var staff = staffGroup.staffs[s]
				var timeSlot = {}
				for (var i = 0; i < staff.voices.length; i++) {
					var voice = staffGroup.voices[staff.voices[i]]
					var time = 0
					for (var k = 0; k < voice.children.length; k++) {
						var index = 'T' + Math.round(time*1000) // There can be inexactness when calculating triplets, so we'll round, but we'll make sure that no make sure that we don't lose necessary precision by making it a shorter time than would ever happen
						if (!timeSlot[index])
							timeSlot[index] = []
						if (voice.children[k].abcelem.el_type === 'note') {
							timeSlot[index].push(voice.children[k])
							time += voice.children[k].duration
						}
					}
				}
				// Now timeSlot is an object with all the voices on a particular staff that
				// happen at the same time as an array.
				group.push(timeSlot)
			}
		}
		results.push(group)
	}
	return results
}

module.exports = toTimeAndStaffBased;
