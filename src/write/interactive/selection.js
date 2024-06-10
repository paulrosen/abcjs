var spacing = require('../helpers/spacing');
var createAnalysis = require('./create-analysis');

function setupSelection(engraver, svgs) {
	engraver.rangeHighlight = rangeHighlight;
	if (engraver.dragging) {
		for (var h = 0; h < engraver.selectables.length; h++) {
			var hist = engraver.selectables[h];
			if (hist.svgEl.getAttribute("selectable") === "true") {
				hist.svgEl.setAttribute("tabindex", 0);
				hist.svgEl.setAttribute("data-index", h);
				hist.svgEl.addEventListener("keydown", keyboardDown.bind(engraver));
				hist.svgEl.addEventListener("keyup", keyboardSelection.bind(engraver));
				hist.svgEl.addEventListener("focus", elementFocused.bind(engraver));
			}
		}
	}
	for (var i = 0; i < svgs.length; i++) {
		svgs[i].addEventListener('touchstart', mouseDown.bind(engraver), { passive: true });
		svgs[i].addEventListener('touchmove', mouseMove.bind(engraver), { passive: true });
		svgs[i].addEventListener('touchend', mouseUp.bind(engraver), { passive: true });
		svgs[i].addEventListener('mousedown', mouseDown.bind(engraver));
		svgs[i].addEventListener('mousemove', mouseMove.bind(engraver));
		svgs[i].addEventListener('mouseup', mouseUp.bind(engraver));
	}
}

function getCoord(ev) {
	var scaleX = 1;
	var scaleY = 1;
	var svg = ev.target.closest('svg')
	var yOffset = 0

	// when renderer.options.responsive === 'resize' the click coords are in relation to the HTML
	// element, we need to convert to the SVG viewBox coords
	if (svg && svg.viewBox && svg.viewBox.baseVal) { // Firefox passes null to this when no viewBox is given
		// Chrome makes these values null when no viewBox is given.
		if (svg.viewBox.baseVal.width !== 0)
			scaleX = svg.viewBox.baseVal.width / svg.clientWidth
		if (svg.viewBox.baseVal.height !== 0)
			scaleY = svg.viewBox.baseVal.height / svg.clientHeight
		yOffset = svg.viewBox.baseVal.y
	}

	var svgClicked = ev.target && ev.target.tagName === "svg";
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

	return [x, y + yOffset];
}

function elementFocused(ev) {
	// If there had been another element focused and is being dragged, then report that before setting the new element up.
	if (this.dragMechanism === "keyboard" && this.dragYStep !== 0 && this.dragTarget)
		notifySelect.bind(this)(this.dragTarget, this.dragYStep, this.selectables.length, this.dragIndex, ev);

	this.dragYStep = 0;
}

function keyboardDown(ev) {
	// Swallow the up and down arrow events - they will be used for dragging with the keyboard
	switch (ev.keyCode) {
		case 38:
		case 40:
			ev.preventDefault();
	}
}

function keyboardSelection(ev) {
	// "this" is the EngraverController because of the bind(this) when setting the event listener.
	var handled = false;
	var index = ev.target.dataset.index;
	switch (ev.keyCode) {
		case 13:
		case 32:
			handled = true;
			this.dragTarget = this.selectables[index];
			this.dragIndex = index;
			this.dragMechanism = "keyboard";
			mouseUp.bind(this)(ev);
			break;
		case 38: // arrow up
			handled = true;
			this.dragTarget = this.selectables[index];
			this.dragIndex = index;
			if (this.dragTarget && this.dragTarget.isDraggable) {
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
			if (this.dragTarget && this.dragTarget.isDraggable) {
				if (this.dragging && this.dragTarget.isDraggable)
					this.dragTarget.absEl.highlight(undefined, this.dragColor);
				this.dragYStep++;
				this.dragTarget.svgEl.setAttribute("transform", "translate(0," + (this.dragYStep * spacing.STEP) + ")");
			}
			break;
		case 9: // tab
			// This is losing focus - if there had been dragging, then do the callback
			if (this.dragYStep !== 0) {
				mouseUp.bind(this)(ev);
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
	if (!el)
		return -1;
	for (var i = 0; i < selectables.length; i++) {
		if (el.dataset.index === selectables[i].svgEl.dataset.index)
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
			var hypotenuse = Math.sqrt(dx * dx + dy * dy);
			if (hypotenuse < minDistance) {
				minDistance = hypotenuse;
				closestIndex = i;
			}
		}
	}
	return (closestIndex >= 0 && minDistance <= 12) ? closestIndex : -1;
}

function getBestMatchCoordinates(dim, ev, scale) {
	// Different browsers have conflicting meanings for the coordinates that are returned.
	// If the item we want is clicked on directly, then we will just see what is the best match.
	// This seems like less of a hack than browser sniffing.
	if (dim.x <= ev.offsetX && dim.x + dim.width >= ev.offsetX &&
		dim.y <= ev.offsetY && dim.y + dim.height >= ev.offsetY)
		return [ev.offsetX, ev.offsetY];
	// Firefox returns a weird value for offset, but layer is correct.
	// Safari and Chrome return the correct value for offset, but layer is multiplied by the scale (that is, if it were rendered with { scale: 2 })
	// For instance (if scale is 2):
	// Firefox: { offsetY: 5, layerY: 335 }
	// Others: {offsetY: 335, layerY: 670} (there could be a little rounding, so the number might not be exactly 2x)
	// So, if layerY/scale is approx. offsetY, then use offsetY, otherwise use layerY
	var epsilon = Math.abs(ev.layerY / scale - ev.offsetY);
	if (epsilon < 3)
		return [ev.offsetX, ev.offsetY];
	else
		return [ev.layerX, ev.layerY];
}

function getTarget(target) {
	// This searches up the dom for the first item containing the attribute "selectable", or stopping at the SVG.
	if (!target)
		return null;
	if (target.tagName === "svg")
		return target;

	if (!target.getAttribute)
		return null;	
	var found = target.getAttribute("selectable");
	while (!found) {
		if (!target.parentElement)
			found = true;
		else {
			target = target.parentElement;
			if (target.tagName === "svg")
				found = true;
			else
				found = target.getAttribute("selectable");
		}
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
		box = getBestMatchCoordinates(self.selectables[clickedOn].svgEl.getBBox(), ev, self.scale);
		x = box[0];
		y = box[1];
		//console.log("clicked on", clickedOn, x, y, self.selectables[clickedOn].svgEl.getBBox(), ev.target.getBBox());
	} else {
		// See if they clicked close to an element.
		box = getCoord(ev);
		x = box[0];
		y = box[1];
		clickedOn = findElementByCoord(self, x, y);
		//console.log("clicked near", clickedOn, x, y, printEl(ev.target));
	}
	return { x: x, y: y, clickedOn: clickedOn };
}

function attachMissingTouchEventAttributes(touchEv) {
	if (!touchEv || !touchEv.target || !touchEv.touches || touchEv.touches.length < 1)
		return
	var rect = touchEv.target.getBoundingClientRect();
	var offsetX = touchEv.touches[0].pageX - rect.left;
	var offsetY = touchEv.touches[0].pageY - rect.top;

	touchEv.touches[0].offsetX = offsetX;
	touchEv.touches[0].offsetY = offsetY;

	touchEv.touches[0].layerX = touchEv.touches[0].pageX;
	touchEv.touches[0].layerY = touchEv.touches[0].pageY;
}

function mouseDown(ev) {
	// "this" is the EngraverController because of the bind(this) when setting the event listener.
	var _ev = ev;
	if (ev.type === 'touchstart') {
		attachMissingTouchEventAttributes(ev);
		if (ev.touches.length > 0)
			_ev = ev.touches[0];
	}

	var positioning = getMousePosition(this, _ev);

	// Only start dragging if the user clicked close enough to an element and clicked with the main mouse button.
	if (positioning.clickedOn >= 0 && (ev.type === 'touchstart' || ev.button === 0) && this.selectables[positioning.clickedOn]) {
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
	var _ev = ev;
	if (ev.type === 'touchmove') {
		attachMissingTouchEventAttributes(ev);
		if (ev.touches.length > 0)
			_ev = ev.touches[0];
	}
	this.lastTouchMove = ev;
	// "this" is the EngraverController because of the bind(this) when setting the event listener.

	if (!this.dragTarget || !this.dragging || !this.dragTarget.isDraggable || this.dragMechanism !== 'mouse' || !this.dragMouseStart)
		return;

	var positioning = getMousePosition(this, _ev);

	var yDist = Math.round((positioning.y - this.dragMouseStart.y) / spacing.STEP);
	if (yDist !== this.dragYStep) {
		this.dragYStep = yDist;
		this.dragTarget.svgEl.setAttribute("transform", "translate(0," + (yDist * spacing.STEP) + ")");
	}
}

function mouseUp(ev) {
	// "this" is the EngraverController because of the bind(this) when setting the event listener.
	var _ev = ev;
	if (ev.type === 'touchend' && this.lastTouchMove) {
		attachMissingTouchEventAttributes(this.lastTouchMove);
		if (this.lastTouchMove && this.lastTouchMove.touches && this.lastTouchMove.touches.length > 0)
			_ev = this.lastTouchMove.touches[0];
	}

	if (!this.dragTarget)
		return;

	clearSelection.bind(this)();
	if (this.dragTarget.absEl && this.dragTarget.absEl.highlight) {
		this.selected = [this.dragTarget.absEl];
		this.dragTarget.absEl.highlight(undefined, this.selectionColor);
	}

	notifySelect.bind(this)(this.dragTarget, this.dragYStep, this.selectables.length, this.dragIndex, _ev);
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
		mouseUp.bind(this)({ target: this.dragTarget.svgEl });
	}
}


function notifySelect(target, dragStep, dragMax, dragIndex, ev) {
	var ret = createAnalysis(target, ev)
	var classes = ret.classes
	var analysis = ret.analysis

	for (var i = 0; i < this.listeners.length; i++) {
		this.listeners[i](target.absEl.abcelem, target.absEl.tuneNumber, classes.join(' '), analysis, { step: dragStep, max: dragMax, index: dragIndex, setSelection: setSelection.bind(this) }, ev);
	}
}

function clearSelection() {
	for (var i = 0; i < this.selected.length; i++) {
		this.selected[i].unhighlight(undefined, this.renderer.foregroundColor);
	}
	this.selected = [];
}

function rangeHighlight(start, end) {
	clearSelection.bind(this)();
	for (var line = 0; line < this.staffgroups.length; line++) {
		var voices = this.staffgroups[line].voices;
		for (var voice = 0; voice < voices.length; voice++) {
			var elems = voices[voice].children;
			for (var elem = 0; elem < elems.length; elem++) {
				// Since the user can highlight more than an element, or part of an element, a hit is if any of the endpoints
				// is inside the other range.
				var elStart = elems[elem].abcelem.startChar;
				var elEnd = elems[elem].abcelem.endChar;
				if ((end > elStart && start < elEnd) || ((end === start) && end === elEnd)) {
					//		if (elems[elem].abcelem.startChar>=start && elems[elem].abcelem.endChar<=end) {
					this.selected[this.selected.length] = elems[elem];
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
