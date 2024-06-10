function findNumber(klass, match, target, name) {
	if (klass.indexOf(match) === 0) {
		var value = klass.replace(match, '');
		var num = parseInt(value, 10);
		if ('' + num === value)
			target[name] = num;
	}
}

function createAnalysis(target, ev) {
	var classes = [];
	if (target.absEl.elemset) {
		var classObj = {};
		for (var j = 0; j < target.absEl.elemset.length; j++) {
			var es = target.absEl.elemset[j];
			if (es) {
				var klass = es.getAttribute("class").split(' ');
				for (var k = 0; k < klass.length; k++)
					classObj[klass[k]] = true;
			}
		}
		for (var kk = 0; kk < Object.keys(classObj).length; kk++)
			classes.push(Object.keys(classObj)[kk]);
	}
	var analysis = {};
	for (var ii = 0; ii < classes.length; ii++) {
		findNumber(classes[ii], "abcjs-v", analysis, "voice");
		findNumber(classes[ii], "abcjs-l", analysis, "line");
		findNumber(classes[ii], "abcjs-m", analysis, "measure");
	}
	if (target.staffPos)
		analysis.staffPos = target.staffPos;
	var closest = ev.target;
	while (closest && closest.dataset && !closest.dataset.name && closest.tagName.toLowerCase() !== 'svg')
		closest = closest.parentNode;
	var parent = ev.target;
	while (parent && parent.dataset && !parent.dataset.index && parent.tagName.toLowerCase() !== 'svg')
		parent = parent.parentNode;
	if (parent && parent.dataset) {
		analysis.name = parent.dataset.name;
		analysis.clickedName = closest.dataset.name;
		analysis.parentClasses = parent.classList;
	}
	if (closest && closest.classList)
		analysis.clickedClasses = closest.classList;
	analysis.selectableElement = target.svgEl;
	return {classes: classes, analysis: analysis}
}

module.exports = createAnalysis;
