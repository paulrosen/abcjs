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
	items.push("selectable: " + history.selectable);
	items.push("isDraggable: " + history.isDraggable);
	var size = svgEl.getBBox();
	items.push("size: " + Math.round(size.x) + "," + Math.round(size.y) + " - " + Math.round(size.width) + "," + Math.round(size.height));

	items.push(listSvgElement(svgEl, 1));
	items.push("element classes: " + listClasses(svgEl, 1));
	items.push("attributes:" + listAttributes(svgEl, 1));
	items.push("abc:" + listAbcElement(absEl.abcelem, 1));
	items.push(listAbsElement(absEl, 1));

	return items.join("\n");
}

function createIndent(indent) {
	var str = "";
	for (var i = 0; i < indent; i++)
		str += "\t";
	return str;
}

function listSvgElement(svgEl, indent) {
	var tab = createIndent(indent);
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
	return "\n"+tab + output.join("\n"+tab);
}

function listGroupChildren(g) {
	var output = [];
	for (var i = 0; i < g.children.length; i++) {
		var el = g.children[i];
		output.push(el.tagName);
	}
	return output.join(" ");
}

function listAttributes(el, indent) {
	var tab = createIndent(indent);
	if (el.hasAttributes()) {
		var attrs = el.attributes;
		var output = [];
		for(var i = attrs.length - 1; i >= 0; i--) {
			if (attrs[i].name !== "class" && attrs[i].name !== "d")
				output.push(attrs[i].name + ": " + attrs[i].value);
		}
		output = output.sort();
		return "\n"+tab + output.join("\n"+tab);
	} else {
		return "";
	}
}

function listClasses(el, indent) {
	var tab = createIndent(indent);
	var classes = el.classList;
	var klasses = [];
	for (var i = 0; i < classes.length; i++)
		klasses.push(classes[i]);
	klasses = klasses.sort();
	if (klasses.length === 0)
		return "[none]";
	return tab + klasses.join(", ");
}

function listAbsElement(absEl, indent) {
	var tab = createIndent(indent);
	var output = ["abs:"];
	var keys = Object.keys(absEl).sort();
	for (var i = 0; i < keys.length; i++) {
		var item = absEl[keys[i]];
		switch(keys[i]) {
			case "abcelem":
				break;
			case "elemset":
				output.push(keys[i] + ": (" + item.length + ")");
				for (var j = 0; j < item.length; j++) {
					output.push(listSvgElement(item[j], indent+1));
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
						output.push(listRelativeElement(item[k], indent+1));
				}
				break;
			default:
				if (item !== undefined)
					output.push(keys[i] + ": " + item);
		}
	}
	return output.join("\n"+tab);
}

function listRelativeElement(relativeElement, indent) {
	var tab = createIndent(indent);
	var output = [];
	output.push("relative element: " + relativeElement.type);
	var keys = Object.keys(relativeElement).sort();
	for (var i = 0; i < keys.length; i++) {
		var item = relativeElement[keys[i]];
		switch (keys[i]) {
			case "parent":
			case "part":
				break;
			case "graphelem":
				if (item) {
					output.push(keys[i] +": ");
					output.push(listSvgElement(item, indent+1))
				}
				break;
			default:
				if (item !== undefined)
					output.push(keys[i] + ": " + item);
				break;
		}
	}
	return output.join("\n"+tab);
}

function listAbcElement(abcelem, indent) {
	var tab = createIndent(indent);
	var output = [];
	var ignored = [];
	var keys = Object.keys(abcelem).sort();
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
				output.push(listArrayOfObjects(keys[i], item, indent+1));
				break;
			case "abselem":
				break;
			default:
				ignored.push(keys[i]);
				console.log(keys[i] + ' ' + item)
		}
	}
	if (ignored.length > 0)
		output.push("ignored: " + ignored.join(" "));
	return "\n"+tab + output.join("\n"+tab);
}

function listArrayOfObjects(key, arr, indent) {
	var tab = createIndent(indent);
	var output = [];
	output.push(key + ":");
	for (var i = 0; i < arr.length; i++) {
		var item = arr[i];
		var keys = Object.keys(item).sort();
		for (var j = 0; j < keys.length; j++) {
			switch(keys[j]) {
				case "startSlur":
				case "startTie":
					output.push(listArrayOfObjects(keys[j], item[keys[j]], indent+1));
					break;
				default:
					output.push(keys[j] + ': ' + item[keys[j]]);
			}
		}
	}
	return output.join("\n"+tab);
}

module.exports = renderingLint;
