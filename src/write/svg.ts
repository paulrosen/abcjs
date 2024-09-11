const svgNS = "http://www.w3.org/2000/svg";

export class Svg {
	svg: SVGElement;
	dummySvg: SVGElement | undefined ;
	currentGroup : Array<SVGElement> = []
	sizeCache : {[key:string]:{ width: any; height: any; }} = {}

	constructor(wrapper: Element) {
		this.svg = createSvg();
		wrapper.appendChild(this.svg);
	}

	clear() {
		if (this.svg) {
			var wrapper = this.svg.parentNode;
			this.svg = createSvg();
			this.currentGroup = [];
			if (wrapper) {
				// TODO-PER: If the wrapper is not present, then the underlying div was pulled out from under this instance. It's possible that is still useful (for creating the music off page?)
				//@ts-ignore : how could innerHTML not be present on a node?
				wrapper.innerHTML = "";
				wrapper.appendChild(this.svg);
			}
		}
	}

	setTitle(title: string) {
		var titleEl = document.createElement("title");
		var titleNode = document.createTextNode(title);
		titleEl.appendChild(titleNode);
		this.svg.insertBefore(titleEl, this.svg.firstChild);
	}

	setResponsiveWidth(w:number, h:number) {
		// this technique is from: http://thenewcode.com/744/Make-SVG-Responsive, thx to https://github.com/iantresman
		this.svg.setAttribute("viewBox", "0 0 " + w + " " + h);
		this.svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
		this.svg.removeAttribute("height");
		this.svg.removeAttribute("width");
		this.svg.style['display'] = "inline-block";
		this.svg.style['position'] = "absolute";
		this.svg.style['top'] = "0";
		this.svg.style['left'] = "0";

		if (this.svg.parentElement) {
			var cls = this.svg.parentElement.getAttribute("class");
			if (!cls)
				this.svg.parentElement.setAttribute("class", "abcjs-container");
			else if (cls.indexOf("abcjs-container") < 0)
				this.svg.parentElement.setAttribute("class", cls + " abcjs-container");
			this.svg.parentElement.style['display'] = "inline-block";
			this.svg.parentElement.style['position'] = "relative";
			this.svg.parentElement.style['width'] = "100%";
			// PER: I changed the padding from 100% to this through trial and error.
			// The example was using a square image, but this music might be either wider or taller.
			var padding = h / w * 100;
			//@ts-ignore Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
			this.svg.parentElement.style['padding-bottom'] = padding + "%";
			//@ts-ignore Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
			this.svg.parentElement.style['vertical-align'] = "middle";
			this.svg.parentElement.style['overflow'] = "hidden";
		}
	}

	setSize(w:number, h:number) {
		this.svg.setAttribute('width', ''+w);
		this.svg.setAttribute('height', ''+h);
	}

	setAttribute(attr:string, value:string) {
		this.svg.setAttribute(attr, value);
	}

	setScale(scale:number) {
		if (scale !== 1) {
			this.svg.style.transform = "scale(" + scale + "," + scale + ")";
			//@ts-ignore Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
			this.svg.style['-ms-transform'] = "scale(" + scale + "," + scale + ")";
			//@ts-ignore Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
			this.svg.style['-webkit-transform'] = "scale(" + scale + "," + scale + ")";
			//@ts-ignore Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
			this.svg.style['transform-origin'] = "0 0";
			//@ts-ignore Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
			this.svg.style['-ms-transform-origin-x'] = "0";
			//@ts-ignore Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
			this.svg.style['-ms-transform-origin-y'] = "0";
			//@ts-ignore Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
			this.svg.style['-webkit-transform-origin-x'] = "0";
			//@ts-ignore Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
			this.svg.style['-webkit-transform-origin-y'] = "0";
		} else {
			this.svg.style.transform = "";
			//@ts-ignore Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
			this.svg.style['-ms-transform'] = "";
			//@ts-ignore Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
			this.svg.style['-webkit-transform'] = "";
		}
	}

	insertStyles(styles:string) {
		var el = document.createElementNS(svgNS, "style");
		el.textContent = styles;
		this.svg.insertBefore(el, this.svg.firstChild); // prepend is not available on older browsers.
		//	this.svg.prepend(el);
	}

	setParentStyles(attr:{[key:string]:string}) {
		// This is needed to get the size right when there is scaling involved.
		for (var key in attr) {
			if (attr.hasOwnProperty(key)) {
				if (this.svg.parentElement)
					//@ts-ignore : Element implicitly has an 'any' type because index expression is not of type 'number'.ts(7015)
					this.svg.parentElement.style[key] = attr[key];
			}
		}
		// This is the last thing that gets called, so delete the temporary SVG if one was created
		if (this.dummySvg) {
			var body = document.querySelector('body');
			//@ts-ignore : 'body' is possibly 'null'.ts(18047)
			body.removeChild(this.dummySvg);
			this.dummySvg = undefined;
		}
	}

	rect(attr:{[key:string]:string}) {
		// This uses path instead of rect so that it can be hollow and the color changes with "fill" instead of "stroke".
		var lines = [];
		var x1 = parseInt(attr.x);
		var y1 = parseInt(attr.y);
		var x2 = x1 + parseInt(attr.width);
		var y2 = y1 + parseInt(attr.height);
		lines.push(constructHLine(x1, y1, x2));
		lines.push(constructHLine(x1, y2, x2));
		lines.push(constructVLine(x2, y1, y2));
		lines.push(constructVLine(x1, y2, y1));

		return this.path({ path: lines.join(" "), stroke: "none", "data-name": attr["data-name"] });
	}

	dottedLine(attr:{x1:string, x2:string,y1:string, y2:string, stroke: string}) {
		var el = document.createElementNS(svgNS, 'line');
		el.setAttribute("x1", attr.x1);
		el.setAttribute("x2", attr.x2);
		el.setAttribute("y1", attr.y1);
		el.setAttribute("y2", attr.y2);
		el.setAttribute("stroke", attr.stroke);
		el.setAttribute("stroke-dasharray", "5,5");
		this.svg.insertBefore(el, this.svg.firstChild);
	}

	rectBeneath(attr:{x:number, y:number, width:number, height:number, stroke:string, fill:string, 'stroke-opacity':string, 'fill-opacity': string}) {
		var el = document.createElementNS(svgNS, 'rect');
		el.setAttribute("x", ''+attr.x);
		el.setAttribute("width", ''+attr.width);
		el.setAttribute("y", ''+attr.y);
		el.setAttribute("height", ''+attr.height);
		if (attr.stroke)
			el.setAttribute("stroke", attr.stroke);
		if (attr['stroke-opacity'])
			el.setAttribute("stroke-opacity", attr['stroke-opacity']);
		if (attr.fill)
			el.setAttribute("fill", attr.fill);
		if (attr['fill-opacity'])
			el.setAttribute("fill-opacity", attr['fill-opacity']);
		this.svg.insertBefore(el, this.svg.firstChild);
	}

	text(text:string, attr:{[key:string]:string}, target?:SVGElement) {
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
			line.setAttribute("x", attr.x ? attr.x : '0');
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
		console.log("text", target, this.currentGroup, text)
		if (target)
			target.appendChild(el);
		else
			this.svg.append(el);
		return el;
	}

	richTextLine(phrases:Array<{attrs:{[key:string]:string}, content:string}>, x:number, y:number, klass:string, anchor:'middle'|'start'|'end', target:SVGElement) {
		var el = document.createElementNS(svgNS, 'text');
		el.setAttribute("stroke", "none");
		el.setAttribute("class", klass);
		el.setAttribute("x", ''+x);
		el.setAttribute("y", ''+y);
		el.setAttribute("text-anchor", anchor);
		el.setAttribute("dominant-baseline", "middle");

		for (var i = 0; i < phrases.length; i++) {
			var phrase = phrases[i]
			var tspan = document.createElementNS(svgNS, 'tspan');
			var attrs = Object.keys(phrase.attrs)
			for (var j = 0; j < attrs.length; j++) {
				var value = phrase.attrs[attrs[j]]
				if (value !== '')
					tspan.setAttribute(attrs[j], value)
			}
			tspan.textContent = phrase.content;

			el.appendChild(tspan);
		}

		if (target)
			target.appendChild(el);
		else
			this.svg.append(el);
		return el;
	}

	guessWidth(text:string, attr:{[key:string]:string}) {
		var svg = this.createDummySvg();
		var el = this.text(text, attr, svg);
		var size;
		var fontSize = parseInt(attr['font-size'], 10)
		try {
			size = el.getBBox();
			if (isNaN(size.height) || !size.height) // TODO-PER: I don't think this can happen unless there isn't a browser at all.
				size = { width: fontSize / 2, height: fontSize + 2 }; // Just a wild guess.
			else
				size = { width: size.width, height: size.height };
		} catch (ex) {
			size = { width: fontSize / 2, height: fontSize + 2 }; // Just a wild guess.
		}
		svg.removeChild(el);
		return size;
	}

	createDummySvg() {
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
			//@ts-ignore : 'body' is possibly 'null'.ts(18047)
			body.appendChild(this.dummySvg);
		}

		return this.dummySvg;
	}

	getTextSize(text:number|string, attr:{[key:string]:string}, el: SVGElement|undefined) {
		if (typeof text === 'number')
			text = '' + text;
		if (!text || text.match(/^\s+$/))
			return { width: 0, height: 0 };
		var key;
		if (text.length < 20) {
			// The short text tends to be repetitive and getBBox is really slow, so lets cache.
			key = text + JSON.stringify(attr);
			if (this.sizeCache[key])
				return this.sizeCache[key];
		}
		var removeLater = !el;
		if (!el)
			el = this.text(text, attr);
		var size;
		try {
			//@ts-ignore : Property 'getBBox' does not exist on type 'SVGElement'.ts(2339)
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
			this.sizeCache[key] = size;
		return size;
	}

	openGroup(options:{klass?:string, fill?:string, stroke?:string, 'data-name'?:string, prepend?:boolean}) {
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
	}

	closeGroup() {
		console.log("close", this.currentGroup.map(g => g.children))
		var g = this.currentGroup.shift();
		if (g && g.children.length === 0) {
			// If nothing was added to the group it is because all the elements were invisible. We don't need the group, then.
			//@ts-ignore : 'g.parentElement' is possibly 'null'.ts(18047)
			g.parentElement.removeChild(g);
			return null;
		}
		return g;
	}

	path(attr:{[key:string]:string}) {
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
	}

	pathToBack(attr:{[key:string]:string}) {
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
	}

	lineToBack(attr:{[key:string]:string}) {
		var el = document.createElementNS(svgNS, 'line');
		var keys = Object.keys(attr)
		for (var i = 0; i < keys.length; i++)
			el.setAttribute(keys[i], attr[keys[i]]);
		this.prepend(el);
		return el;
	}

	append(el:SVGElement) {
		if (this.currentGroup.length > 0)
			this.currentGroup[0].appendChild(el);
		else
			this.svg.appendChild(el);
	}

	prepend(el:SVGElement) {
		// The entire group is prepended, so don't prepend the individual elements.
		if (this.currentGroup.length > 0)
			this.currentGroup[0].appendChild(el);
		else
			this.svg.insertBefore(el, this.svg.firstChild);
	}

	setAttributeOnElement(el:SVGElement, attr:{[key:string]:string}) {
		for (var key in attr) {
			if (attr.hasOwnProperty(key)) {
				el.setAttributeNS(null, key, attr[key]);
			}
		}
	}

	moveElementToChild(parent:SVGElement, child:SVGElement) {
		parent.appendChild(child);
	}
}

function createSvg() {
	var svg = document.createElementNS(svgNS, "svg");
	svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	svg.setAttribute('role', 'img');    // for accessibility
	svg.setAttribute('fill', 'currentColor');    // for automatically picking up dark mode and high contrast
	svg.setAttribute('stroke', 'currentColor');    // for automatically picking up dark mode and high contrast
	return svg;
}

function constructHLine(x1:number, y1:number, x2:number) {
	var len = x2 - x1;
	return "M " + x1 + " " + y1 +
		" l " + len + ' ' + 0 +
		" l " + 0 + " " + 1 + " " +
		" l " + (-len) + " " + 0 + " " + " z ";
}

function constructVLine(x1:number, y1:number, y2:number) {
	var len = y2 - y1;
	return "M " + x1 + " " + y1 +
		" l " + 0 + ' ' + len +
		" l " + 1 + " " + 0 + " " +
		" l " + 0 + " " + (-len) + " " + " z ";
}

module.exports = Svg;
