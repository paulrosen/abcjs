var getLeftEdgeOfStaff = require('./get-left-edge-of-staff');

function layoutInGrid(renderer, staffGroup, timeBasedLayout) {
	var leftEdge = getLeftEdgeOfStaff(renderer, staffGroup.getTextSize, staffGroup.voices, staffGroup.brace, staffGroup.bracket);
	var ret = getTotalDuration(staffGroup, timeBasedLayout.minPadding)
	var totalDuration = ret.totalDuration
	var minSpacing = ret.minSpacing
	var totalWidth = minSpacing * totalDuration
	if (timeBasedLayout.minWidth)
		totalWidth = Math.max(totalWidth, timeBasedLayout.minWidth)
	var leftAlignPadding = timeBasedLayout.minPadding ? timeBasedLayout.minPadding/2 : 2 // If the padding isn't specified still give it some

	staffGroup.startx = leftEdge
	staffGroup.w = totalWidth + leftEdge
	for (var i = 0; i < staffGroup.voices.length; i++) {
		var voice = staffGroup.voices[i]
		voice.startx = leftEdge
		voice.w = totalWidth + leftEdge

		var x = leftEdge
		var afterFixedLeft = false
		var durationUnit = 0
		for (var j = 0; j < voice.children.length; j++) {
			var child = voice.children[j]
			if (!afterFixedLeft) {
				if (child.duration !== 0) {
					// We got to the first music element on the line
					afterFixedLeft = true
					durationUnit = (totalWidth + leftEdge - x) / totalDuration
					staffGroup.gridStart = x
				} else {
					// We are still doing the preliminary stuff - clef, time sig, etc.
					child.x = x
					x += child.w + child.minspacing
				}
			}
			if (afterFixedLeft) {
				if (timeBasedLayout.align === 'center')
					child.x = x + (child.duration * durationUnit) / 2 - child.w / 2
				else {
					// left align with padding - but no padding for barlines, they should be right aligned.
					// TODO-PER: it looks better to move bar lines one pixel to right. Not sure why.
					if (child.duration === 0) {
						child.x = x + 1 - child.w
					} else {
						// child.extraw has the width of the accidentals - push the note to the right to take that into consideration. It will be 0 if there is nothing to the left.
						child.x = x + leftAlignPadding - child.extraw
					}
				}
				x += child.duration * durationUnit
			}
			for (var k = 0; k < child.children.length; k++) {
				var grandchild = child.children[k]
				// some elements don't have a dx - Tempo, for instance
				var dx = grandchild.dx ? grandchild.dx : 0
				grandchild.x = child.x + dx
			}
		}
		staffGroup.gridEnd = x
	}
	return totalWidth
}

function getTotalDuration(staffGroup, timeBasedLayout) {
	var maxSpacing = 0
	var maxCount = 0
	for (var i = 0; i < staffGroup.voices.length; i++) {
		var count = 0
		var voice = staffGroup.voices[i]
		for (var j = 0; j < voice.children.length; j++) {
			var element = voice.children[j]
			count += element.duration
			if (element.duration) {
				var width = (element.w+timeBasedLayout) / element.duration
				maxSpacing = Math.max(maxSpacing, width)
			}
		}
		maxCount = Math.max(maxCount, count)
	}
	return { totalDuration: maxCount, minSpacing: maxSpacing}
}

module.exports = layoutInGrid;
