//    abc_tempo_element.js: Definition of the TempoElement class.
//    Copyright (C) 2014-2018 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

	TempoElement = function TempoElement(tempo, tuneNumber) {
		this.tempo = tempo;
		this.tuneNumber = tuneNumber;
		this.tempoHeightAbove = totalHeightInPitches;
		this.pitch = undefined; // This will be set later
	};

	TempoElement.prototype.setUpperAndLowerElements = function(positionY) { // TODO-PER: This might not be called.
		this.pitch = positionY.tempoHeightAbove;
		this.top = positionY.tempoHeightAbove;
		this.bottom = positionY.tempoHeightAbove;
	};

	TempoElement.prototype.setX = function (x) {
		this.x = x;
	};

	TempoElement.prototype.draw = function(renderer) {
		var x = this.x;
		if (this.pitch === undefined)
			window.console.error("Tempo Element y-coordinate not set.");

		var y = renderer.calcY(this.pitch);
		var text;
		if (this.tempo.preString) {
			text = renderer.renderText(x, y, this.tempo.preString, 'tempofont', 'tempo', "start");
			var preWidth = text.getBBox().width;
			var charWidth = preWidth / this.tempo.preString.length; // Just get some average number to increase the spacing.
			x += preWidth + charWidth;
		}
		if (this.tempo.duration && !this.tempo.suppressBpm) {
			var temposcale = 0.75;
			var tempopitch = this.pitch - totalHeightInPitches + 1; // The pitch we receive is the top of the allotted area: change that to practically the bottom.
			var duration = this.tempo.duration[0]; // TODO when multiple durations
			var abselem = new AbsoluteElement(this.tempo, duration, 1, 'tempo', this.tuneNumber);
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

			// TODO-PER: the following had a bug in it when there are dotted notes - so the above code brute forces it.
			// var durlog = Math.floor(Math.log(duration) / Math.log(2));
			// var dot = 0;
			// for (var tot = Math.pow(2, durlog), inc = tot / 2; tot < duration; dot++, tot += inc, inc /= 2);
			// var note = renderer.engraver.chartable.note[-durlog];
			// var flag = renderer.engraver.chartable.uflags[-durlog];
			var temponote = renderer.engraver.createNoteHead(abselem, // TODO-PER: This seems late to be creating this element. Shouldn't it happen before draw?
				note,
				{verticalPos: tempopitch},
				"up",
				0,
				0,
				flag,
				dot,
				0,
				temposcale
			);
			abselem.addHead(temponote);
			var stem;
			if (note !== "noteheads.whole" && note !== "noteheads.dbl") {
				var p1 = tempopitch + 1 / 3 * temposcale;
				var p2 = tempopitch + 7 * temposcale;
				var dx = temponote.dx + temponote.w;
				var width = -0.6;
				stem = new RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2": p2, linewidth: width});
				stem.setX(x);
				abselem.addExtra(stem);
			}
			abselem.setX(x);
			for (var i = 0; i < abselem.children.length; i++)
				abselem.children[i].draw(renderer, x);
			x += (abselem.w + 5);
			var str = "= " + this.tempo.bpm;
			text = renderer.renderText(x, y, str, 'tempofont', 'tempo', "start");
			var postWidth = text.getBBox().width;
			var charWidth2 = postWidth / str.length; // Just get some average number to increase the spacing.
			x += postWidth + charWidth2;
		}
		if (this.tempo.postString) {
			renderer.renderText(x, y, this.tempo.postString, 'tempofont', 'tempo', "start");
		}
	};
})();

module.exports = TempoElement;
