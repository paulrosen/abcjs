//    abc_tempo_element.js: Definition of the TempoElement class.
//    Copyright (C) 2014-2020 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

var AbsoluteElement = require('./abc_absolute_element');
var RelativeElement = require('./abc_relative_element');

var TempoElement;
(function() {
	"use strict";
	var totalHeightInPitches = 5;

	TempoElement = function TempoElement(tempo, tuneNumber, createNoteHead) {
		this.tempo = tempo;
		this.tempo.type = "tempo"; /// TODO-PER: this should be set earlier, in the parser, probably.
		this.tuneNumber = tuneNumber;
		this.tempoHeightAbove = totalHeightInPitches;
		this.pitch = undefined; // This will be set later
		if (this.tempo.duration && !this.tempo.suppressBpm) {
			this.note = this.createNote(createNoteHead, tempo, tuneNumber);
		}
	};

	TempoElement.prototype.setUpperAndLowerElements = function(positionY) { // TODO-PER: This might not be called.
		this.pitch = positionY.tempoHeightAbove;
		this.top = positionY.tempoHeightAbove;
		this.bottom = positionY.tempoHeightAbove;
		if (this.note) {
			var tempoPitch = this.pitch - totalHeightInPitches + 1; // The pitch we receive is the top of the allotted area: change that to practically the bottom.
			this.note.top = tempoPitch;
			this.note.bottom = tempoPitch;
			for (var i = 0; i < this.note.children.length; i++) {
				var child = this.note.children[i];
				child.top += tempoPitch;
				child.bottom += tempoPitch;
				child.pitch += tempoPitch;
				if (child.pitch2 !== undefined)
					child.pitch2 += tempoPitch;
			}
		}
	};

	TempoElement.prototype.setX = function (x) {
		this.x = x;
	};

	TempoElement.prototype.createNote = function(createNoteHead, tempo, tuneNumber) {
		var temposcale = 0.75;
		var duration = tempo.duration[0]; // TODO when multiple durations
		var absElem = new AbsoluteElement(tempo, duration, 1, 'tempo', tuneNumber);
		// There aren't an infinite number of note values, but we are passed a float, so just in case something is off upstream,
		// merge all of the in between points.
		var dot;
		var flag;
		var note;
		if (duration <= 1/32) { note = "noteheads.quarter"; flag = "flags.u32nd"; dot = 0; }
		else if (duration <= 1/16) { note = "noteheads.quarter"; flag = "flags.u16th"; dot = 0; }
		else if (duration <= 3/32) { note = "noteheads.quarter"; flag = "flags.u16nd"; dot = 1; }
		else if (duration <= 1/8) { note = "noteheads.quarter"; flag = "flags.u8th"; dot = 0; }
		else if (duration <= 3/16) { note = "noteheads.quarter"; flag = "flags.u8th"; dot = 1; }
		else if (duration <= 1/4) { note = "noteheads.quarter"; dot = 0; }
		else if (duration <= 3/8) { note = "noteheads.quarter"; dot = 1; }
		else if (duration <= 1/2) { note = "noteheads.half"; dot = 0; }
		else if (duration <= 3/4) { note = "noteheads.half"; dot = 1; }
		else if (duration <= 1) { note = "noteheads.whole"; dot = 0; }
		else if (duration <= 1.5) { note = "noteheads.whole"; dot = 1; }
		else if (duration <= 2) { note = "noteheads.dbl"; dot = 0; }
		else { note = "noteheads.dbl"; dot = 1; }

		var ret = createNoteHead(absElem,
			note,
			{ verticalPos: 0}, // This is just temporary: we'll offset the vertical positioning when we get the actual vertical spot.
			"up",
			0,
			0,
			flag,
			dot,
			0,
			temposcale,
			[],
			false
		);
		var tempoNote = ret.notehead;
		absElem.addHead(tempoNote);
		var stem;
		if (note !== "noteheads.whole" && note !== "noteheads.dbl") {
			var p1 = 1 / 3 * temposcale;
			var p2 = 7 * temposcale;
			var dx = tempoNote.dx + tempoNote.w;
			var width = -0.6;
			stem = new RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2": p2, linewidth: width});
			absElem.addExtra(stem);
		}
		return absElem;
	};

	TempoElement.prototype.draw = function(renderer) {
		var x = this.x;
		if (this.pitch === undefined)
			window.console.error("Tempo Element y-coordinate not set.");

		var self = this;
		var tempoGroup;
		renderer.wrapInAbsElem(this.tempo, "abcjs-tempo", function () {
			renderer.createElemSet({klass: renderer.addClasses("tempo")});
			var y = renderer.calcY(self.pitch);
			var text;
			if (self.tempo.preString) {
				text = renderer.renderText({x:x, y: y, text: self.tempo.preString, type: 'tempofont', klass: 'abcjs-tempo', anchor: "start", noClass: true});
				var size = renderer.getTextSize(self.tempo.preString, 'tempofont', 'tempo', text);
				var preWidth = size.width;
				var charWidth = preWidth / self.tempo.preString.length; // Just get some average number to increase the spacing.
				x += preWidth + charWidth;
			}
			if (self.note) {
				self.note.setX(x);
				for (var i = 0; i < self.note.children.length; i++)
					self.note.children[i].draw(renderer, x);
				x += (self.note.w + 5);
				var str = "= " + self.tempo.bpm;
				text = renderer.renderText({x:x, y: y, text: str, type: 'tempofont', klass: 'abcjs-tempo', anchor: "start", noClass: true});
				size = renderer.getTextSize(str, 'tempofont', 'tempo', text);
				var postWidth = size.width;
				var charWidth2 = postWidth / str.length; // Just get some average number to increase the spacing.
				x += postWidth + charWidth2;
			}
			if (self.tempo.postString) {
				renderer.renderText({x:x, y: y, text: self.tempo.postString, type: 'tempofont', klass: 'abcjs-tempo', anchor: "start", noClass: true});
			}
			tempoGroup = renderer.closeElemSet();
		});
		return tempoGroup;
	};

	TempoElement.prototype.adjustElements = function(renderer) {
		// TODO-PER: This straightens out the tempo elements because they are written in the wrong order.
		for (var i = renderer.controller.history.length - 1; i >= 0; i--) {
			if (renderer.controller.history[i].absEl.abcelem.type !== "tempo")
				break;
		}
		var group;
		for (var ii = i+1; ii < renderer.controller.history.length; ii++) {
			var hist = renderer.controller.history[ii];
			var inGroup = hist.svgEl.parentNode.tagName.toLowerCase() === 'g';
			if (inGroup)
				group = hist.svgEl.parentNode;
			else if (group) {
				group.appendChild(hist.svgEl);
			}
			hist.svgEl.setAttribute("class", '');
		}
		var len = renderer.controller.history.length-i-1;
		if (group && len > 1) {
			renderer.controller.combineHistory(len, group);
		}
	};
})();

module.exports = TempoElement;
