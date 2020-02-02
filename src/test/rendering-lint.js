var renderingLint = function(history) {
	var output = [];
	for (var i = 0; i < history.length; i++) {
		output.push(lintOne(history[i]));
	}
	return output.join("\n\n");
};

function lintOne(history) {
	var items = [];
	var svgEl = history.svgEl;
	var absEl = history.absEl;
	items.push(listSvgElement(svgEl));
	items.push("selectable: " + history.selectable);
	items.push("isDraggable: " + history.isDraggable);
	items.push("element classes: " + listClasses(svgEl));
	var size = svgEl.getBBox();
	items.push("size: " + Math.round(size.x) + "," + Math.round(size.y) + " - " + Math.round(size.width) + "," + Math.round(size.height));
	items.push("attributes: " + listAttributes(svgEl));
	items.push("abc: " + listAbcElement(absEl.abcelem));
	items.push("abs: " + listAbsElement(absEl));

	return items.join("\n");
}

function listSvgElement(svgEl) {
	var output = [];
	output.push("element type: " + svgEl.tagName );
	switch (svgEl.tagName) {
		case "text":
			output.push("Text: " + svgEl.textContent);
			break;
		case "path":
			break;
		case "g":
			output.push("children: " + listGroupChildren(svgEl));
			break;
		default:
			console.log(svgEl.outerHTML)
	}
	return output.join("\n\t");
}

function listGroupChildren(g) {
	var output = [];
	for (var i = 0; i < g.children.length; i++) {
		var el = g.children[i];
		output.push(el.tagName);
	}
	return output.join(" ");
}

function listAttributes(el) {
	if (el.hasAttributes()) {
		var attrs = el.attributes;
		var output = [];
		for(var i = attrs.length - 1; i >= 0; i--) {
			if (attrs[i].name !== "class" && attrs[i].name !== "d")
				output.push(attrs[i].name + ": " + attrs[i].value);
		}
		output = output.sort();
		return "\n\t" + output.join("\n\t");
	} else {
		return "";
	}
}

function listClasses(el) {
	var classes = el.classList;
	var klasses = [];
	for (var i = 0; i < classes.length; i++)
		klasses.push(classes[i]);
	klasses = klasses.sort();
	if (klasses.length === 0)
		return "[none]";
	return klasses.join(", ");
}

function listAbsElement(absEl) {
	var output = [];
	var keys = Object.keys(absEl);
	for (var i = 0; i < keys.length; i++) {
		var item = absEl[keys[i]];
		switch(keys[i]) {
			case "abcelem":
				break;
			case "elemset":
				output.push(keys[i] + ": (" + item.length + ")");
				for (var j = 0; j < item.length; j++) {
					output.push(listSvgElement(item[j]));
				}
				break;
			case "specialY":
				output.push(keys[i] + ": " + JSON.stringify(item));
				break;
			case "beam":
				if (item.length > 0)
					console.log(keys[i], item)
				break;
			case "heads":
			case "extra":
			case "children":
			case "right":
				if (item.length > 0) {
					output.push(keys[i] + ":");
					for (var k = 0; k < item.length; k++)
						output.push(listRelativeElement(item[k]));
				}
				break;
			default:
				if (item !== undefined)
					output.push(keys[i] + ": " + item);
		}
	}
	output = output.sort();
	return "\n\t" + output.join("\n\t");
}

function listRelativeElement(relativeElement) {
	var output = [];
	output.push("relative element: " + relativeElement.type);
	var keys = Object.keys(relativeElement);
	for (var i = 0; i < keys.length; i++) {
		var item = relativeElement[keys[i]];
		switch (keys[i]) {
			case "parent":
			case "part":
				break;
			case "graphelem":
				if (item) {
					output.push(keys[i] +": ");
					output.push(listSvgElement(item))
				}
				break;
			default:
				if (item !== undefined)
					output.push(keys[i] + ": " + item);
				break;
		}
	}
	output = output.sort();
	return "\n\t" + output.join("\n\t");
}

function listAbcElement(abcelem) {
	var output = [];
	var ignored = [];
	var keys = Object.keys(abcelem);
	for (var i = 0; i < keys.length; i++) {
		var item = abcelem[keys[i]];
		switch(keys[i]) {
			case "el_type":
			case "startChar":
			case "endChar":
			case "text":
			case "type":
			case "verticalPos":
			case "clefPos":
			case "root":
			case "acc":
			case "mode":
			case "preString":
			case "postString":
			case "duration":
			case "bpm":
			case "title":
			case "decoration":
			case "averagepitch":
			case "minpitch":
			case "maxpitch":
			case "startBeam":
			case "endBeam":
			case "barNumber":
			case "endTriplet":
			case "startTriplet":
			case "tripletMultiplier":
			case "startEnding":
			case "endEnding":
				output.push(keys[i] + ": " + item);
				break;
			case "gracenotes":
			case "chord":
			case "rest":
			case "value":
			case "lyric":
			case "pitches":
			case "accidentals":
				output.push(listArrayOfObjects(keys[i], item));
				break;
			case "abselem":
				break;
			default:
				ignored.push(keys[i]);
				console.log(keys[i] + ' ' + item)
		}
	}
	output = output.sort();
	if (ignored.length > 0)
		output.push("ignored: " + ignored.join(" "));
	return "\n\t" + output.join("\n\t");
}

function listArrayOfObjects(key, arr) {
	var output = [];
	output.push(key + ":");
	for (var i = 0; i < arr.length; i++) {
		var item = arr[i];
		var keys = Object.keys(item);
		for (var j = 0; j < keys.length; j++) {
			switch(keys[j]) {
				case "startSlur":
				case "startTie":
					output.push(listArrayOfObjects(keys[j], item[keys[j]]));
					break;
				default:
					output.push(keys[j] + ': ' + item[keys[j]]);
			}
		}
	}
	output = output.sort();
	return "\n\t" + output.join("\n\t");
}

module.exports = renderingLint;
