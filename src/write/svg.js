//    abc_voice_element.js: Definition of the VoiceElement class.
//    Copyright (C) 2010-2018 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
//    documentation files (the "Software"), to deal in the Software without restriction, including without limitation
//    the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
//    to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
//    BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//    NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/*global module */

var svgNS = "http://www.w3.org/2000/svg";

function Svg(wrapper) {
	this.svg = createSvg();
	wrapper.appendChild(this.svg);
}

Svg.prototype.clear = function() {
	if (this.svg) {
		var wrapper = this.svg.parentNode;
		this.svg = createSvg();
		if (wrapper) {
			// TODO-PER: If the wrapper is not present, then the underlying div was pulled out from under this instance. It's possible that is still useful (for creating the music off page?)
			wrapper.innerHTML = "";
			wrapper.appendChild(this.svg);
		}
	}
};

Svg.prototype.setTitle = function(title) {
	var titleEl = document.createElement("title");
	var titleNode = document.createTextNode(title);
	titleEl.appendChild(titleNode);
	this.svg.insertBefore(titleEl, this.svg.firstChild);
};

Svg.prototype.setResponsiveWidth = function(w, h) {
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

Svg.prototype.setSize = function(w, h) {
	this.svg.setAttribute('width', w);
	this.svg.setAttribute('height', h);
	// TODO-PER: Is this hack still needed?
	// Correct for IE problem in calculating height
	// var isIE = /*@cc_on!@*/false;//IE detector
	// if (isIE) {
	// 	this.paper.canvas.parentNode.style.width = w + "px";
	// 	this.paper.canvas.parentNode.style.height = "" + h + "px";
	// } else
	// 	this.paper.canvas.parentNode.setAttribute("style", "width:" + w + "px");
};

Svg.prototype.setScale = function(scale) {
	if (scale !== 1) {
		this.svg.style.transform = "scale("+scale+","+scale+")";
		this.svg.style['-ms-transform'] = "scale("+scale+","+scale+")";
		this.svg.style['-webkit-transform'] = "scale("+scale+","+scale+")";
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

Svg.prototype.setParentStyles = function(attr) {
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

Svg.prototype.rect = function(attr) {
	var el = document.createElementNS(svgNS, "rect");
	for (var key in attr) {
		if (attr.hasOwnProperty(key)) {
			var tmp = "" + attr[key];
			if (tmp.indexOf("NaN") >= 0)
				debugger;
			el.setAttributeNS(null, key, attr[key]);
		}
	}
	this.append(el);
	return el;
};

Svg.prototype.text = function(text, attr, target) {
	var el = document.createElementNS(svgNS, 'text');
	for (var key in attr) {
		if (attr.hasOwnProperty(key)) {
			el.setAttribute(key, attr[key]);
		}
	}
	var lines = (""+text).split("\n");
	for (var i = 0; i < lines.length; i++) {
		var line = document.createElementNS(svgNS, 'tspan');
		line.textContent = lines[i];
		line.setAttribute("x", attr.x ? attr.x : 0);
		if (i !== 0)
			line.setAttribute("dy", "1.2em");
		el.appendChild(line);
	}
	if (target)
		target.appendChild(el);
	else
		this.append(el);
	return el;
};

Svg.prototype.guessWidth = function(text, attr) {
	var svg = this.createDummySvg();
	var el = this.text(text, attr, svg);
	var size;
	try {
		size  = el.getBBox();
		if (isNaN(size.height) || !size.height) // TODO-PER: I don't think this can happen unless there isn't a browser at all.
			size = { width: attr['font-size']/2, height: attr['font-size'] + 2 }; // Just a wild guess.
		else
			size = {width: size.width, height: size.height};
	} catch (ex) {
		size = { width: attr['font-size']/2, height: attr['font-size'] + 2 }; // Just a wild guess.
	}
	svg.removeChild(el);
	return size;
};

Svg.prototype.createDummySvg = function() {
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

Svg.prototype.getTextSize = function(text, attr, el) {
	if (typeof text === 'number')
		text = ''+text;
	if (!text || text.match(/^\s+$/))
		return { width: 0, height: 0 };
	var removeLater = !el;
	if (!el)
		el = this.text(text, attr);
	var size;
	try {
		size  = el.getBBox();
		if (isNaN(size.height) || !size.height)
			size = this.guessWidth(text, attr);
		else
			size = {width: size.width, height: size.height};
	} catch (ex) {
		size = this.guessWidth(text, attr);
	}
	if (removeLater) {
		if (this.currentGroup)
			this.currentGroup.removeChild(el);
		else
			this.svg.removeChild(el);
	}
	return size;
};

Svg.prototype.openGroup = function(options) {
	options = options ? options : {};
	var el = document.createElementNS(svgNS, "g");
	if (options.prepend)
		this.svg.insertBefore(el, this.svg.firstChild);
	else
		this.svg.appendChild(el);
	this.currentGroup = el;
	return el;
};

Svg.prototype.closeGroup = function() {
	var g = this.currentGroup;
	this.currentGroup = null;
	return g;
};

Svg.prototype.path = function(attr) {
	var el = document.createElementNS(svgNS, "path");
	for (var key in attr) {
		if (attr.hasOwnProperty(key)) {
			if (key === 'path')
				el.setAttributeNS(null, 'd', attr.path);
			else
				el.setAttributeNS(null, key, attr[key]);
		}
	}
	this.append(el);
	return el;
};

Svg.prototype.pathToBack = function(attr) {
	var el = document.createElementNS(svgNS, "path");
	for (var key in attr) {
		if (attr.hasOwnProperty(key)) {
			if (key === 'path')
				el.setAttributeNS(null, 'd', attr.path);
			else
				el.setAttributeNS(null, key, attr[key]);
		}
	}
	this.prepend(el);
	return el;
};

Svg.prototype.append = function(el) {
	if (this.currentGroup)
		this.currentGroup.appendChild(el);
	else
		this.svg.appendChild(el);
};

Svg.prototype.prepend = function(el) {
	// The entire group is prepended, so don't prepend the individual elements.
	if (this.currentGroup)
		this.currentGroup.appendChild(el);
	else
		this.svg.insertBefore(el, this.svg.firstChild);
};

Svg.prototype.setAttributeOnElement = function(el, attr) {
	for (var key in attr) {
		if (attr.hasOwnProperty(key)) {
			el.setAttributeNS(null, key, attr[key]);
		}
	}
};

function createSvg() {
	var svg = document.createElementNS(svgNS, "svg");
	svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	svg.setAttribute('role', 'img');    // for accessibility
	return svg;
}


module.exports = Svg;
