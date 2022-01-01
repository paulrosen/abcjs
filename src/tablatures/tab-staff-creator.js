
function makeTabClef(sourceClef, label, stafflines) {
	var clef = {
		type: "TAB",
		verticalPos: 0,
		clefPos: stafflines+1, // this is centered because each line is two pitches, when counting the entire size it is stafflines lines but stafflines-1 spaces, and 0 is two pitches below the first line.
		// height = stafflines*2-1, bottom = 2, top = height + 2
		// center = (top - bottom) / 2 + bottom
		// if stafflines = 4 then (9 - 2) / 2 + 2
		el_type: "clef",
		stafflines: stafflines,
	}
	if (label)
		clef.label = label
	return clef;
}

function addTab(staff, tabDef, spacing, callback) {
	var tabStaff = {
		clef: makeTabClef(staff.clef, tabDef.params.label, tabDef.params.tuning.length),
		key: {},
		voices: [],
		stepSize: spacing/2
	}
	for (var i = 0; i < staff.voices.length; i++) {
		var sourceVoice = staff.voices[i];
		var thisVoice = []
		var tripletMultiplier = 1;
		for (var j = 0; j < sourceVoice.length; j++) {
			var sourceElem = sourceVoice[j]
			switch (sourceElem.el_type) {
				case "note":
					if (sourceElem.pitches) {
						if (sourceElem.startTriplet) {
							tripletMultiplier = sourceElem.tripletMultiplier;
						}
						var durationForSpacing = sourceElem.duration * tripletMultiplier;
						if (sourceElem.rest && sourceElem.rest.type === 'multimeasure')
							durationForSpacing = 1;
						if (sourceElem.endTriplet) {
							tripletMultiplier = 1;
						}

						var ev = {
							el_type: "tab",
							pitches: [],
							duration: durationForSpacing,
							startChar: sourceElem.startChar,
							endChar: sourceElem.endChar,
							averagepitch: 4,
							minpitch: 4,
							maxpitch: 4
						}
						for (var k = 0; k < sourceElem.pitches.length; k++) {
							var thisPitch = sourceElem.pitches[0]
							if (thisPitch.endTie) {
								ev.pitches.push({
									pitch: 6,
									number: '',
								})
							} else {
								var ret = callback(null, thisPitch, sourceElem, sourceVoice)
								ev.pitches.push({
									number: ret.number,
									pitch: ret.string * 2 + 3,
									name: thisPitch.name,
								})
							}
						}
						if (sourceElem.gracenotes) {
							ev.gracenotes = [];
							for (var g = 0; g < sourceElem.gracenotes.length; g++) {
								var gn = sourceElem.gracenotes[g]
								var ret2 = callback(gn, thisPitch, sourceElem, sourceVoice)
								ev.gracenotes.push({
									duration: gn.duration,
									name: gn.name,
									number: ret2.number,
									pitch: ret2.string * 2 + 3,
								})
							}
						}
						thisVoice.push(ev)
					} else if (sourceElem.rest) {
						thisVoice.push({
							rest: {
								type: "invisible",
							},
							duration: sourceElem.duration,
							el_type: "note",
							startChar: sourceElem.startChar,
							endChar: sourceElem.endChar,
							averagepitch: 7,
							minpitch: 7,
							maxpitch: 7
						})
					}
					break;
				case "bar":
					thisVoice.push({
						el_type: "bar",
						type: sourceElem.type,
						startChar: sourceElem.startChar,
						endChar: sourceElem.endChar,
					})
					break;
			}
		}
		tabStaff.voices.push(thisVoice)
	}
	return tabStaff;
}

module.exports = addTab
