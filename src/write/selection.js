//    Copyright (C) 2020 Paul Rosen (paul at paulrosen dot net)
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
//    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//    DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var spacing = require('./abc_spacing');

function setupSelection(engraver) {
	engraver.rangeHighlight = rangeHighlight;
	if (engraver.dragging) {
		for (var h = 0; h < engraver.selectables.length; h++) {
			var hist = engraver.selectables[h];
			if (hist.selectable) {
				hist.svgEl.setAttribute("tabindex", 0);
				hist.svgEl.setAttribute("data-index", h);
				hist.svgEl.addEventListener("keydown", keyboardDown.bind(engraver));
				hist.svgEl.addEventListener("keyup", keyboardSelection.bind(engraver));
				hist.svgEl.addEventListener("focus", elementFocused.bind(engraver));
			}
		}
	}
	engraver.renderer.paper.svg.addEventListener('mousedown', mouseDown.bind(engraver));
	engraver.renderer.paper.svg.addEventListener('mousemove', mouseMove.bind(engraver));
	engraver.renderer.paper.svg.addEventListener('mouseup', mouseUp.bind(engraver));
}

function getCoord(ev, svg) {
	var scaleX = 1;
	var scaleY = 1;

	// when renderer.options.responsive === 'resize' the click coords are in relation to the HTML
	// element, we need to convert to the SVG viewBox coords
	if (svg.viewBox.baseVal) { // Firefox passes null to this when no viewBox is given
		// Chrome makes these values null when no viewBox is given.
		if (svg.viewBox.baseVal.width !== 0)
			scaleX = svg.viewBox.baseVal.width / svg.clientWidth
		if (svg.viewBox.baseVal.height !== 0)
			scaleY = svg.viewBox.baseVal.height / svg.clientHeight
	}

	var svgClicked = ev.target.tagName === "svg";
	var x;
	var y;
	if (svgClicked) {
		x = ev.offsetX;
		y = ev.offsetY;
	} else {
		x = ev.layerX;
		y = ev.layerY;
	}

	x = x * scaleX;
	y = y * scaleY;
	//console.log(x, y)

	return [x, y];
}

function elementFocused(ev) {
	// If there had been another element focused and is being dragged, then report that before setting the new element up.
	if (this.dragMechanism === "keyboard" && this.dragYStep !== 0 && this.dragTarget)
		notifySelect.bind(this)(this.dragTarget, this.dragYStep, this.selectables.length, this.dragIndex, ev);

	this.dragYStep = 0;
}

function keyboardDown(ev) {
	// Swallow the up and down arrow events - they will be used for dragging with the keyboard
	switch(ev.keyCode) {
		case 38:
		case 40:
			ev.preventDefault();
	}
}

function keyboardSelection(ev) {
	// "this" is the EngraverController because of the bind(this) when setting the event listener.
	var handled = false;
	var index = ev.target.dataset.index;
	switch(ev.keyCode) {
		case 13:
		case 32:
			handled = true;
			this.dragTarget = this.selectables[index];
			this.dragIndex = index;
			this.dragMechanism = "keyboard";
			mouseUp.bind(this)();
			break;
		case 38: // arrow up
			handled = true;
			this.dragTarget = this.selectables[index];
			this.dragIndex = index;
			if (this.dragTarget.isDraggable) {
				if (this.dragging && this.dragTarget.isDraggable)
					this.dragTarget.absEl.highlight(undefined, this.dragColor);
				this.dragYStep--;
				this.dragTarget.svgEl.setAttribute("transform", "translate(0," + (this.dragYStep * spacing.STEP) + ")");
			}
			break;
		case 40: // arrow down
			handled = true;
			this.dragTarget = this.selectables[index];
			this.dragIndex = index;
			this.dragMechanism = "keyboard";
			if (this.dragTarget.isDraggable) {
				if (this.dragging && this.dragTarget.isDraggable)
					this.dragTarget.absEl.highlight(undefined, this.dragColor);
				this.dragYStep++;
				this.dragTarget.svgEl.setAttribute("transform", "translate(0," + (this.dragYStep * spacing.STEP) + ")");
			}
			break;
		case 9: // tab
			// This is losing focus - if there had been dragging, then do the callback
			if (this.dragYStep !== 0) {
				mouseUp.bind(this)();
			}
			break;
		default:
			//console.log(ev);
			break;
	}
	if (handled)
		ev.preventDefault();
}

function findElementInHistory(selectables, el) {
	for (var i = 0; i < selectables.length; i++) {
		if (el === selectables[i].svgEl)
			return i;
	}
	return -1;
}

function findElementByCoord(self, x, y) {
	var minDistance = 9999999;
	var closestIndex = -1;
	for (var i = 0; i < self.selectables.length && minDistance > 0; i++) {
		var el = self.selectables[i];

		self.getDim(el);
		if (el.dim.left < x && el.dim.right > x && el.dim.top < y && el.dim.bottom > y) {
			// See if it is a direct hit on an element - if so, definitely take it (there are no overlapping elements)
			closestIndex = i;
			minDistance = 0;
		} else if (el.dim.top < y && el.dim.bottom > y) {
			// See if it is the same vertical as the element. Then the distance is the x difference
			var horiz = Math.min(Math.abs(el.dim.left - x), Math.abs(el.dim.right - x));
			if (horiz < minDistance) {
				minDistance = horiz;
				closestIndex = i;
			}
		} else if (el.dim.left < x && el.dim.right > x) {
			// See if it is the same horizontal as the element. Then the distance is the y difference
			var vert = Math.min(Math.abs(el.dim.top - y), Math.abs(el.dim.bottom - y));
			if (vert < minDistance) {
				minDistance = vert;
				closestIndex = i;
			}
		} else {
			// figure out the distance to this element.
			var dx = Math.abs(x - el.dim.left) > Math.abs(x - el.dim.right) ? Math.abs(x - el.dim.right) : Math.abs(x - el.dim.left);
			var dy = Math.abs(y - el.dim.top) > Math.abs(y - el.dim.bottom) ? Math.abs(y - el.dim.bottom) : Math.abs(y - el.dim.top);
			var hypotenuse = Math.sqrt(dx*dx + dy*dy);
			if (hypotenuse < minDistance) {
				minDistance = hypotenuse;
				closestIndex = i;
			}
		}
	}
	return (closestIndex >= 0 && minDistance <= 12) ? closestIndex : -1;
}

function getBestMatchCoordinates(dim, ev) {
	// Different browsers have conflicting meanings for the coordinates that are returned.
	// If the item we want is clicked on directly, then we will just see what is the best match.
	// This seems like less of a hack than browser sniffing.
	if (dim.x <= ev.offsetX && dim.x+dim.width >= ev.offsetX &&
		dim.y <= ev.offsetY && dim.y+dim.height >= ev.offsetY)
		return [ ev.offsetX, ev.offsetY];
	return  [ ev.layerX, ev.layerY];
}

function getTarget(target) {
	// This searches up the dom for the first item containig the attribute "selectable", or stopping at the SVG.
	if (target.tagName === "svg")
		return target;

	var found = target.getAttribute("selectable");
	while (!found) {
		target = target.parentElement;
		if (target.tagName === "svg")
			found = true;
		else
			found = target.getAttribute("selectable");
	}
	return target;
}

function getMousePosition(self, ev) {
	// if the user clicked exactly on an element that we're interested in, then we already have the answer.
	// This is more reliable than the calculations because firefox returns different coords for offsetX, offsetY
	var x;
	var y;
	var box;
	var clickedOn = findElementInHistory(self.selectables, getTarget(ev.target));
	if (clickedOn >= 0) {
		// There was a direct hit on an element.
		box = getBestMatchCoordinates(self.selectables[clickedOn].svgEl.getBBox(), ev);
		x = box[0];
		y = box[1];
		//console.log("clicked on", clickedOn, x, y, self.selectables[clickedOn].svgEl.getBBox(), ev.target.getBBox());
	} else {
		// See if they clicked close to an element.
		box = getCoord(ev, self.renderer.paper.svg);
		x = box[0];
		y = box[1];
		clickedOn = findElementByCoord(self, x, y);
		//console.log("clicked near", clickedOn, x, y, printEl(ev.target));
	}
	return { x: x, y: y, clickedOn: clickedOn };
}

function mouseDown(ev) {
	// "this" is the EngraverController because of the bind(this) when setting the event listener.

	var positioning = getMousePosition(this, ev);

	// Only start dragging if the user clicked close enough to an element and clicked with the main mouse button.
	if (positioning.clickedOn >= 0 && ev.button === 0) {
		this.dragTarget = this.selectables[positioning.clickedOn];
		this.dragIndex = positioning.clickedOn;
		this.dragMechanism = "mouse";
		this.dragMouseStart = { x: positioning.x, y: positioning.y };
		if (this.dragging && this.dragTarget.isDraggable) {
			addGlobalClass(this.renderer.paper, "abcjs-dragging-in-progress");
			this.dragTarget.absEl.highlight(undefined, this.dragColor);
		}
	}
}

function mouseMove(ev) {
	// "this" is the EngraverController because of the bind(this) when setting the event listener.

	if (!this.dragTarget || !this.dragging || !this.dragTarget.isDraggable || this.dragMechanism !== 'mouse')
		return;

	var positioning = getMousePosition(this, ev);

	var yDist = Math.round((positioning.y - this.dragMouseStart.y)/spacing.STEP);
	if (yDist !== this.dragYStep) {
		this.dragYStep = yDist;
		this.dragTarget.svgEl.setAttribute("transform", "translate(0," + (yDist * spacing.STEP) + ")");
	}
}

function mouseUp(ev) {
	// "this" is the EngraverController because of the bind(this) when setting the event listener.

	if (!this.dragTarget)
		return;

	clearSelection.bind(this)();
	if (this.dragTarget.absEl && this.dragTarget.absEl.highlight) {
		this.selected = [this.dragTarget.absEl];
		this.dragTarget.absEl.highlight(undefined, this.selectionColor);
	}

	notifySelect.bind(this)(this.dragTarget, this.dragYStep, this.selectables.length, this.dragIndex, ev);
	if (this.dragTarget.svgEl && this.dragTarget.svgEl.focus) {
		this.dragTarget.svgEl.focus();
		this.dragTarget = null;
		this.dragIndex = -1;
	}
	removeGlobalClass(this.renderer.svg, "abcjs-dragging-in-progress");
}

function setSelection(dragIndex) {
	if (dragIndex >= 0 && dragIndex < this.selectables.length) {
		this.dragTarget = this.selectables[dragIndex];
		this.dragIndex = dragIndex;
		this.dragMechanism = "keyboard";
		mouseUp.bind(this)();
	}
}

function notifySelect(target, dragStep, dragMax, dragIndex, ev) {
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

	for (var i=0; i<this.listeners.length;i++) {
		this.listeners[i](target.absEl.abcelem, target.absEl.tuneNumber, classes.join(' '), analysis, { step: dragStep, max: dragMax, index: dragIndex, setSelection: setSelection.bind(this)}, ev);
	}
}

function findNumber(klass, match, target, name) {
	if (klass.indexOf(match) === 0) {
		var value = klass.replace(match, '');
		var num = parseInt(value, 10);
		if (''+num === value)
			target[name] = num;
	}
}

function clearSelection() {
	for (var i=0;i<this.selected.length;i++) {
		this.selected[i].unhighlight();
	}
	this.selected = [];
}

function rangeHighlight(start,end) {
	clearSelection.bind(this)();
	for (var line=0;line<this.staffgroups.length; line++) {
		var voices = this.staffgroups[line].voices;
		for (var voice=0;voice<voices.length;voice++) {
			var elems = voices[voice].children;
			for (var elem=0; elem<elems.length; elem++) {
				// Since the user can highlight more than an element, or part of an element, a hit is if any of the endpoints
				// is inside the other range.
				var elStart = elems[elem].abcelem.startChar;
				var elEnd = elems[elem].abcelem.endChar;
				if ((end>elStart && start<elEnd) || ((end===start) && end===elEnd)) {
					//		if (elems[elem].abcelem.startChar>=start && elems[elem].abcelem.endChar<=end) {
					this.selected[this.selected.length]=elems[elem];
					elems[elem].highlight(undefined, this.selectionColor);
				}
			}
		}
	}
}

function getClassSet(el) {
	var oldClass = el.getAttribute('class');
	if (!oldClass)
		oldClass = "";
	var klasses = oldClass.split(" ");
	var obj = {};
	for (var i = 0; i < klasses.length; i++)
		obj[klasses[i]] = true;
	return obj;
}

function setClassSet(el, klassSet) {
	var klasses = [];
	for (var key in klassSet) {
		if (klassSet.hasOwnProperty(key))
			klasses.push(key);
	}
	el.setAttribute('class', klasses.join(' '));
}

function addGlobalClass(svg, klass) {
	if (svg) {
		var obj = getClassSet(svg.svg);
		obj[klass] = true;
		setClassSet(svg.svg, obj);
	}
}

function removeGlobalClass(svg, klass) {
	if (svg) {
		var obj = getClassSet(svg.svg);
		delete obj[klass];
		setClassSet(svg.svg, obj);
	}
}

module.exports = setupSelection;
