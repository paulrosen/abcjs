//    abc_tempo_element.js: Definition of the TempoElement class.
//    Copyright (C) 2014 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, either version 3 of the License, or
//    (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*globals ABCJS */

if (!window.ABCJS)
	window.ABCJS = {};

if (!window.ABCJS.write)
	window.ABCJS.write = {};

(function() {
	"use strict";
	var totalHeightInPitches = 5;

	ABCJS.write.TempoElement = function(tempo, tuneNumber) {
		this.tempo = tempo;
		this.tuneNumber = tuneNumber;
		this.tempoHeightAbove = totalHeightInPitches;
		this.pitch = undefined; // This will be set later
	};

	ABCJS.write.TempoElement.prototype.setUpperAndLowerElements = function(positionY) { // TODO-PER: This might not be called.
		this.pitch = positionY.tempoHeightAbove;
	};

	ABCJS.write.TempoElement.prototype.setX = function (x) {
		this.x = x;
	};

	ABCJS.write.TempoElement.prototype.draw = function(renderer) {
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
		if (this.tempo.duration) {
			var temposcale = 0.75;
			var tempopitch = this.pitch - totalHeightInPitches + 1; // The pitch we receive is the top of the allotted area: change that to practically the bottom.
			var duration = this.tempo.duration[0]; // TODO when multiple durations
			var abselem = new ABCJS.write.AbsoluteElement(this.tempo, duration, 1, 'tempo', this.tuneNumber);
			// There aren't an infinite number of note values, but we are passed a float, so just in case something is off upstream,
			// merge all of the in between points.
			var dot;
			var flag;
			var note;
			if (duration <= 1/32) { note = "noteheads.quarter"; flag = "flags.u32nd"; dot = 0; }
			else if (duration <= 1/16) { note = "noteheads.quarter"; flag = "flags.u16th"; dot = 0; }
			else if (duration <= 3/32) { note = "noteheads.quarter"; flag = "flags.u32nd"; dot = 1; }
			else if (duration <= 1/8) { note = "noteheads.quarter"; flag = "flags.u8th"; dot = 0; }
			else if (duration <= 3/16) { note = "noteheads.quarter"; flag = "flags.u16th"; dot = 1; }
			else if (duration <= 1/4) { note = "noteheads.quarter"; dot = 0; }
			else if (duration <= 3/8) { note = "noteheads.quarter"; flag = "flags.u8th"; dot = 1; }
			else if (duration <= 1/2) { note = "noteheads.half"; dot = 0; }
			else if (duration <= 3/4) { note = "noteheads.quarter"; dot = 1; }
			else if (duration <= 1) { note = "noteheads.whole"; dot = 0; }
			else if (duration <= 1.5) { note = "noteheads.half"; dot = 1; }
			else if (duration <= 2) { note = "noteheads.dbl"; dot = 0; }
			else if (duration <= 3) { note = "noteheads.whole"; dot = 1; }
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
				stem = new ABCJS.write.RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2": p2, linewidth: width});
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
