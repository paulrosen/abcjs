var createAnalysis = require('./create-analysis');

function findSelectableElement(event) {
	var selectable = event
	while (selectable && selectable.attributes && selectable.tagName.toLowerCase() !== 'svg' && !selectable.attributes.selectable) {
		selectable = selectable.parentNode
	}
	if (selectable && selectable.attributes && selectable.attributes.selectable) {
		var index = selectable.attributes['data-index'].nodeValue
		if (index) {
			index = parseInt(index, 10)
			if (index >= 0 && index < this.selectables.length) {
				var element = this.selectables[index]
				var ret = createAnalysis(element, event)
				ret.index = index
				ret.element = element
				return ret
			}
		}
	}
	return null
}

module.exports = findSelectableElement;
