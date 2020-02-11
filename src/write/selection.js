var spacing = require('./abc_spacing');

function setupSelection(engraver) {
	engraver.rangeHighlight = rangeHighlight;
	if (engraver.dragging) {
		for (var h = 0; h < engraver.history.length; h++) {
			var hist = engraver.history[h];
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

function getCoord(ev) {
	var x = ev.offsetX;
	var y = ev.offsetY;
	// The target might be the SVG that we want, or it could be an item in the SVG (usually a path). If it is not the SVG then
	// add an offset to the coordinates.
	// if (ev.target.tagName.toLowerCase() !== 'svg') {
	// 	var box = ev.target.getBBox();
	// 	var absRect = ev.target.getBoundingClientRect();
	// 	var offsetX = ev.clientX - absRect.left;
	// 	var offsetY = ev.clientY - absRect.top;
	// 	x = offsetX + box.x;
	// 	y = offsetY + box.y;
	// }
	return [x,y];
}

function elementFocused(ev) {
	// If there had been another element focused and is being dragged, then report that before setting the new element up.
	if (this.dragMechanism === "keyboard" && this.dragYStep !== 0 && this.dragTarget)
		this.notifySelect(this.dragTarget, this.dragYStep);

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
			this.dragTarget = this.history[index];
			this.dragMechanism = "keyboard";
			mouseUp.bind(this)();
			break;
		case 38: // arrow up
			handled = true;
			this.dragTarget = this.history[index];
			this.dragMechanism = "keyboard";
			if (this.dragTarget.isDraggable) {
				if (this.dragging && this.dragTarget.isDraggable)
					this.dragTarget.absEl.highlight(undefined, this.dragColor);
				this.dragYStep--;
				this.dragTarget.svgEl.setAttribute("transform", "translate(0," + (this.dragYStep * spacing.STEP) + ")");
			}
			break;
		case 40: // arrow down
			handled = true;
			this.dragTarget = this.history[index];
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

function mouseDown(ev) {
	// "this" is the EngraverController because of the bind(this) when setting the event listener.

	var box = getCoord(ev);
	var x = box[0];
	var y = box[1];

	var minDistance = 9999999;
	var closestIndex = -1;
	for (var i = 0; i < this.history.length && minDistance > 0; i++) {
		var el = this.history[i];
		if (!el.selectable)
			continue;

		// See if it is a direct hit on an element - if so, definitely take it (there are no overlapping elements)
		this.getDim(el);
		if (el.dim.left < x && el.dim.right > x && el.dim.top < y && el.dim.bottom > y) {
			closestIndex = i;
			minDistance = 0;
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
	if (closestIndex >= 0) {
		this.dragTarget = this.history[closestIndex];
		this.dragMechanism = "mouse";
		this.dragMouseStart = { x: x, y: y };
		if (this.dragging && this.dragTarget.isDraggable) {
			this.renderer.addGlobalClass("abcjs-dragging-in-progress");
			this.dragTarget.absEl.highlight(undefined, this.dragColor);
		}
	}
}

function mouseMove(ev) {
	// "this" is the EngraverController because of the bind(this) when setting the event listener.

	if (!this.dragTarget || !this.dragging || !this.dragTarget.isDraggable || this.dragMechanism !== 'mouse')
		return;

	var box = getCoord(ev);
	var x = box[0];
	var y = box[1];

	var yDist = Math.round((y - this.dragMouseStart.y)/spacing.STEP);
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

	notifySelect.bind(this)(this.dragTarget, this.dragYStep);
	this.dragTarget.svgEl.focus();
	this.dragTarget = null;
	this.renderer.removeGlobalClass("abcjs-dragging-in-progress");
}

function notifySelect(target, dragStep) {
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
		this.listeners[i](target.absEl.abcelem, target.absEl.tuneNumber, classes.join(' '), analysis, dragStep);
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

module.exports = setupSelection;
