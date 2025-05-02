function flattenResults(abc) {
	var visualObj = abcjs.renderAbc("paper", abc);
	var results = []
	for (var lineNum = 0; lineNum < visualObj[0].lines.length; lineNum++) {
		var line = visualObj[0].lines[lineNum]
		for (var staffNum = 0; line.staff && staffNum < line.staff.length; staffNum++) {
			var staff = line.staff[staffNum]
			if (staff.clef)
				results.push({ line: lineNum, staff: staffNum, type: 'initial-clef', style: staff.clef.type })
			if (staff.key) {
				var acc = []
				for (var a = 0; a < staff.key.accidentals.length; a++)
					acc.push(staff.key.accidentals[a].note+' '+staff.key.accidentals[a].acc)
				results.push({line: lineNum, staff: staffNum, type: 'initial-key', name: staff.key.root + staff.key.mode, accidentals: acc.join(',')})
			}
			var z;
			var acc = ''
			for (var voiceNum = 0; voiceNum < staff.voices.length; voiceNum++) {
				var line1 = staff.voices[voiceNum]
				for (var v = 0; v < line1.length; v++) {
					var el = line1[v]
					switch(el.el_type) {
						case 'note':
							acc = []
							for (z = 0; z < line1[v].pitches.length; z++)
								acc.push(line1[v].pitches[z].name)
							// TODO-PER: probably want to add some more info, like decorations?
							results.push({line: lineNum, staff: staffNum, type: 'note', duration: line1[v].duration, pitches: acc.join(', ')})
							break;
						case 'bar':
							results.push({line: lineNum, staff: staffNum, type: 'bar', style: line1[v].type})
							break;
						case 'keySignature':
							acc = []
							for (z = 0; z < el.accidentals.length; z++)
								acc.push(el.accidentals[z].note+' '+el.accidentals[z].acc)
							results.push({line: lineNum, staff: staffNum, type: 'key', name: el.root + el.mode, accidentals: acc.join(',')})
							break;
						// TODO-PER: support other types
						default:
							console.log(line1[v])
					}
				}
			}
		}
	}
	return results
}
