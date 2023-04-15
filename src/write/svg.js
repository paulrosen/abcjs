//    abc_voice_element.js: Definition of the VoiceElement class.

/*global module */

var svgNS = "http://www.w3.org/2000/svg";

function Svg(wrapper) {
	this.svg = createSvg();
	this.currentGroup = [];
	wrapper.appendChild(this.svg);
}

Svg.prototype.clear = function () {
	if (this.svg) {
		var wrapper = this.svg.parentNode;
		this.svg = createSvg();
		this.currentGroup = [];
		if (wrapper) {
			// TODO-PER: If the wrapper is not present, then the underlying div was pulled out from under this instance. It's possible that is still useful (for creating the music off page?)
			wrapper.innerHTML = "";
			wrapper.appendChild(this.svg);
		}
	}
};

Svg.prototype.setTitle = function (title) {
	var titleEl = document.createElement("title");
	var titleNode = document.createTextNode(title);
	titleEl.appendChild(titleNode);
	this.svg.insertBefore(titleEl, this.svg.firstChild);
};

Svg.prototype.setResponsiveWidth = function (w, h) {
	// this technique is from: http://thenewcode.com/744/Make-SVG-Responsive, thx to https://github.com/iantresman
	this.svg.setAttribute("viewBox", "0 0 " + w + " " + h);
	this.svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
	this.svg.removeAttribute("height");
	this.svg.removeAttribute("width");
	this.svg.style['display'] = "inline-block";
	this.svg.style['position'] = "absolute";
	this.svg.style['top'] = "0";
	this.svg.style['left'] = "0";

	if (this.svg.parentNode) {
		var cls = this.svg.parentNode.getAttribute("class");
		if (!cls)
			this.svg.parentNode.setAttribute("class", "abcjs-container");
		else if (cls.indexOf("abcjs-container") < 0)
			this.svg.parentNode.setAttribute("class", cls + " abcjs-container");
		this.svg.parentNode.style['display'] = "inline-block";
		this.svg.parentNode.style['position'] = "relative";
		this.svg.parentNode.style['width'] = "100%";
		// PER: I changed the padding from 100% to this through trial and error.
		// The example was using a square image, but this music might be either wider or taller.
		var padding = h / w * 100;
		this.svg.parentNode.style['padding-bottom'] = padding + "%";
		this.svg.parentNode.style['vertical-align'] = "middle";
		this.svg.parentNode.style['overflow'] = "hidden";
	}
};

Svg.prototype.setSize = function (w, h) {
	this.svg.setAttribute('width', w);
	this.svg.setAttribute('height', h);
};

Svg.prototype.setAttribute = function (attr, value) {
	this.svg.setAttribute(attr, value);
};

Svg.prototype.setScale = function (scale) {
	if (scale !== 1) {
		this.svg.style.transform = "scale(" + scale + "," + scale + ")";
		this.svg.style['-ms-transform'] = "scale(" + scale + "," + scale + ")";
		this.svg.style['-webkit-transform'] = "scale(" + scale + "," + scale + ")";
		this.svg.style['transform-origin'] = "0 0";
		this.svg.style['-ms-transform-origin-x'] = "0";
		this.svg.style['-ms-transform-origin-y'] = "0";
		this.svg.style['-webkit-transform-origin-x'] = "0";
		this.svg.style['-webkit-transform-origin-y'] = "0";
	} else {
		this.svg.style.transform = "";
		this.svg.style['-ms-transform'] = "";
		this.svg.style['-webkit-transform'] = "";
	}
};

Svg.prototype.insertStyles = function (styles) {
	var el = document.createElementNS(svgNS, "style");
	el.textContent = styles;
	this.svg.insertBefore(el, this.svg.firstChild); // prepend is not available on older browsers.
	//	this.svg.prepend(el);
};

Svg.prototype.setParentStyles = function (attr) {
	// This is needed to get the size right when there is scaling involved.
	for (var key in attr) {
		if (attr.hasOwnProperty(key)) {
			if (this.svg.parentNode)
				this.svg.parentNode.style[key] = attr[key];
		}
	}
	// This is the last thing that gets called, so delete the temporary SVG if one was created
	if (this.dummySvg) {
		var body = document.querySelector('body');
		body.removeChild(this.dummySvg);
		this.dummySvg = null;
	}

};

function constructHLine(x1, y1, x2) {
	var len = x2 - x1;
	return "M " + x1 + " " + y1 +
		" l " + len + ' ' + 0 +
		" l " + 0 + " " + 1 + " " +
		" l " + (-len) + " " + 0 + " " + " z ";
}

function constructVLine(x1, y1, y2) {
	var len = y2 - y1;
	return "M " + x1 + " " + y1 +
		" l " + 0 + ' ' + len +
		" l " + 1 + " " + 0 + " " +
		" l " + 0 + " " + (-len) + " " + " z ";
}

Svg.prototype.rect = function (attr) {
	// This uses path instead of rect so that it can be hollow and the color changes with "fill" instead of "stroke".
	var lines = [];
	var x1 = attr.x;
	var y1 = attr.y;
	var x2 = attr.x + attr.width;
	var y2 = attr.y + attr.height;
	lines.push(constructHLine(x1, y1, x2));
	lines.push(constructHLine(x1, y2, x2));
	lines.push(constructVLine(x2, y1, y2));
	lines.push(constructVLine(x1, y2, y1));

	return this.path({ path: lines.join(" "), stroke: "none", "data-name": attr["data-name"] });
};

Svg.prototype.dottedLine = function (attr) {
	var el = document.createElementNS(svgNS, 'line');
	el.setAttribute("x1", attr.x1);
	el.setAttribute("x2", attr.x2);
	el.setAttribute("y1", attr.y1);
	el.setAttribute("y2", attr.y2);
	el.setAttribute("stroke", attr.stroke);
	el.setAttribute("stroke-dasharray", "5,5");
	this.svg.insertBefore(el, this.svg.firstChild);
};

Svg.prototype.rectBeneath = function (attr) {
	var el = document.createElementNS(svgNS, 'rect');
	el.setAttribute("x", attr.x);
	el.setAttribute("width", attr.width);
	el.setAttribute("y", attr.y);
	el.setAttribute("height", attr.height);
	if (attr.stroke)
		el.setAttribute("stroke", attr.stroke);
	if (attr['stroke-opacity'])
		el.setAttribute("stroke-opacity", attr['stroke-opacity']);
	if (attr.fill)
		el.setAttribute("fill", attr.fill);
	if (attr['fill-opacity'])
		el.setAttribute("fill-opacity", attr['fill-opacity']);
	this.svg.insertBefore(el, this.svg.firstChild);
};

Svg.prototype.text = function (text, attr, target) {
	var el = document.createElementNS(svgNS, 'text');
	el.setAttribute("stroke", "none");
	for (var key in attr) {
		if (attr.hasOwnProperty(key)) {
			el.setAttribute(key, attr[key]);
		}
	}
	var lines = ("" + text).split("\n");
	for (var i = 0; i < lines.length; i++) {
		var line = document.createElementNS(svgNS, 'tspan');
		line.setAttribute("x", attr.x ? attr.x : 0);
		if (i !== 0)
			line.setAttribute("dy", "1.2em");
		if (lines[i].indexOf("\x03") !== -1) {
			var parts = lines[i].split('\x03')
			line.textContent = parts[0];
			if (parts[1]) {
				var ts2 = document.createElementNS(svgNS, 'tspan');
				ts2.setAttribute("dy", "-0.3em");
				ts2.setAttribute("style", "font-size:0.7em");
				ts2.textContent = parts[1];
				line.appendChild(ts2);
			}
			if (parts[2]) {
				var dist = parts[1] ? "0.4em" : "0.1em";
				var ts3 = document.createElementNS(svgNS, 'tspan');
				ts3.setAttribute("dy", dist);
				ts3.setAttribute("style", "font-size:0.7em");
				ts3.textContent = parts[2];
				line.appendChild(ts3);
			}
		} else
			line.textContent = lines[i];
		el.appendChild(line);
	}
	if (target)
		target.appendChild(el);
	else
		this.append(el);
	return el;
};

Svg.prototype.guessWidth = function (text, attr) {
	var svg = this.createDummySvg();
	var el = this.text(text, attr, svg);
	var size;
	try {
		size = el.getBBox();
		if (isNaN(size.height) || !size.height) // TODO-PER: I don't think this can happen unless there isn't a browser at all.
			size = { width: attr['font-size'] / 2, height: attr['font-size'] + 2 }; // Just a wild guess.
		else
			size = { width: size.width, height: size.height };
	} catch (ex) {
		size = { width: attr['font-size'] / 2, height: attr['font-size'] + 2 }; // Just a wild guess.
	}
	svg.removeChild(el);
	return size;
};

Svg.prototype.createDummySvg = function () {
	if (!this.dummySvg) {
		this.dummySvg = createSvg();
		var styles = [
			"display: block !important;",
			"height: 1px;",
			"width: 1px;",
			"position: absolute;"
		];
		this.dummySvg.setAttribute('style', styles.join(""));
		var body = document.querySelector('body');
		body.appendChild(this.dummySvg);
	}

	return this.dummySvg;
};

var sizeCache = {};

Svg.prototype.getTextSize = function (text, attr, el) {
	if (typeof text === 'number')
		text = '' + text;
	if (!text || text.match(/^\s+$/))
		return { width: 0, height: 0 };
	var key;
	if (text.length < 20) {
		// The short text tends to be repetitive and getBBox is really slow, so lets cache.
		key = text + JSON.stringify(attr);
		if (sizeCache[key])
			return sizeCache[key];
	}
	var removeLater = !el;
	if (!el)
		el = this.text(text, attr);
	var size;
	try {
		size = el.getBBox();
		if (isNaN(size.height) || !size.height)
			size = this.guessWidth(text, attr);
		else
			size = { width: size.width, height: size.height };
	} catch (ex) {
		size = this.guessWidth(text, attr);
	}
	if (removeLater) {
		if (this.currentGroup.length > 0)
			this.currentGroup[0].removeChild(el);
		else
			this.svg.removeChild(el);
	}
	if (key)
		sizeCache[key] = size;
	return size;
};

Svg.prototype.openGroup = function (options) {
	options = options ? options : {};
	var el = document.createElementNS(svgNS, "g");
	if (options.klass)
		el.setAttribute("class", options.klass);
	if (options.fill)
		el.setAttribute("fill", options.fill);
	if (options.stroke)
		el.setAttribute("stroke", options.stroke);
	if (options['data-name'])
		el.setAttribute("data-name", options['data-name']);

	if (options.prepend)
		this.prepend(el);
	else
		this.append(el);
	this.currentGroup.unshift(el);
	return el;
};

Svg.prototype.closeGroup = function () {
	var g = this.currentGroup.shift();
	if (g && g.children.length === 0) {
		// If nothing was added to the group it is because all the elements were invisible. We don't need the group, then.
		g.parentElement.removeChild(g);
		return null;
	}
	return g;
};

Svg.prototype.path = function (attr) {
	var el = document.createElementNS(svgNS, "path");
	for (var key in attr) {
		if (attr.hasOwnProperty(key)) {
			if (key === 'path')
				el.setAttributeNS(null, 'd', attr.path);
			else if (key === 'klass')
				el.setAttributeNS(null, "class", attr[key]);
			else if (attr[key] !== undefined)
				el.setAttributeNS(null, key, attr[key]);
		}
	}
	this.append(el);
	return el;
};

Svg.prototype.pathToBack = function (attr) {
	var el = document.createElementNS(svgNS, "path");
	for (var key in attr) {
		if (attr.hasOwnProperty(key)) {
			if (key === 'path')
				el.setAttributeNS(null, 'd', attr.path);
			else if (key === 'klass')
				el.setAttributeNS(null, "class", attr[key]);
			else
				el.setAttributeNS(null, key, attr[key]);
		}
	}
	this.prepend(el);
	return el;
};

Svg.prototype.lineToBack = function (attr) {
	var el = document.createElementNS(svgNS, 'line');
	var keys = Object.keys(attr)
	for (var i = 0; i < keys.length; i++)
		el.setAttribute(keys[i], attr[keys[i]]);
	this.prepend(el);
	return el;
};


Svg.prototype.append = function (el) {
	if (this.currentGroup.length > 0)
		this.currentGroup[0].appendChild(el);
	else
		this.svg.appendChild(el);
};

Svg.prototype.prepend = function (el) {
	// The entire group is prepended, so don't prepend the individual elements.
	if (this.currentGroup.length > 0)
		this.currentGroup[0].appendChild(el);
	else
		this.svg.insertBefore(el, this.svg.firstChild);
};

Svg.prototype.setAttributeOnElement = function (el, attr) {
	for (var key in attr) {
		if (attr.hasOwnProperty(key)) {
			el.setAttributeNS(null, key, attr[key]);
		}
	}
};

Svg.prototype.moveElementToChild = function (parent, child) {
	parent.appendChild(child);
};

function createSvg() {
	var svg = document.createElementNS(svgNS, "svg");
	svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	svg.setAttribute('role', 'img');    // for accessibility
	svg.setAttribute('fill', 'currentColor');    // for automatically picking up dark mode and high contrast
	svg.setAttribute('stroke', 'currentColor');    // for automatically picking up dark mode and high contrast
	return svg;
}


module.exports = Svg;
