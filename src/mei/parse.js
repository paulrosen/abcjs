var Tune = require('../data/abc_tune');
var parseDirective = require('../parse/abc_parse_directive');
var multiLineVars = require('../parse/multiline_vars');

function parse(mei) {
	var tune = new Tune();
	parseDirective.initialize(null, null, {}, tune);

	var meiBody;
	for (var i = 0; i < mei.elements.length; i++) {
		var topLevel = mei.elements[i];
		if (topLevel.type === 'element') {
			for (var j = 0; j < topLevel.elements.length; j++) {
				var secondLevel = topLevel.elements[j];
				if (secondLevel.type === "element" && secondLevel.name === "music")
					meiBody = secondLevel.elements;
			}
		}
	}
	if (meiBody)
		parse2(tune, meiBody);

	var ph = 11*72;
	var pl = 8.5*72;
	tune.cleanUp(pl, ph, multiLineVars.barsperstaff, multiLineVars.staffnonote, multiLineVars.openSlurs);

	return tune;
}

function collectAttributes(elements) {
	var attributes = [];
	for (var i = 0; i < elements.length; i++) {
		var element = elements[i];
		switch (element.type) {
			case "element":
				attributes.push({ name: element.name, attributes: element.attributes });
				break;
			default:
				attributes.push(element);
		}

		if (element.elements) {
			attributes = attributes.concat(collectAttributes(element.elements));
		}
	}
	return attributes;
}

function parse2(tune, meiBody) {
	var attributes = collectAttributes(meiBody);
	for (var i = 0; i < attributes.length; i++){
		var attribute = attributes[i];
		if (attribute.type === "text")
			tune.addMetaText('title', attribute.text);
	}
}

module.exports = parse;
