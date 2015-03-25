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
	ABCJS.write.TempoElement = function(tempo) {
		this.tempo = tempo;
		this.tempoHeightAbove = 5;
		this.pitch = undefined; // This will be set later
	};

	ABCJS.write.TempoElement.prototype.setUpperAndLowerElements = function(positionY) {
		this.pitch = positionY.tempoHeightAbove;
	};

	ABCJS.write.TempoElement.prototype.draw = function(renderer, x) {
		if (this.pitch === undefined)
			window.console.error("Tempo Element y-coordinate not set.");

		var y = renderer.calcY(this.pitch);
		var text;
		var noteHeight = -12; // the note height was just determined empirically.
		//var totalHeight = noteHeight;
		if (this.tempo.preString) {
			text = renderer.renderText(x, y + noteHeight, this.tempo.preString, 'tempofont', 'tempo', "start");
			var preWidth = text.getBBox().width;
			var charWidth = preWidth / this.tempo.preString.length; // Just get some average number to increase the spacing.
			x += preWidth + charWidth;
			//totalHeight = Math.max(totalHeight, text.getBBox().height);
		}
		if (this.tempo.duration) {
			var temposcale = 0.75;
			var tempopitch = this.pitch; // note: placement determined empirically
			var duration = this.tempo.duration[0]; // TODO when multiple durations
			var abselem = new ABCJS.write.AbsoluteElement(this.tempo, duration, 1, 'tempo');
			var durlog = Math.floor(Math.log(duration) / Math.log(2));
			var dot = 0;
			for (var tot = Math.pow(2, durlog), inc = tot / 2; tot < duration; dot++, tot += inc, inc /= 2);
			var c = renderer.engraver.chartable.note[-durlog];
			var flag = renderer.engraver.chartable.uflags[-durlog];
			var temponote = renderer.engraver.createNoteHead(abselem,
				c,
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
			if (duration < 1) {
				var p1 = tempopitch + 1 / 3 * temposcale;
				var p2 = tempopitch + 7 * temposcale;
				var dx = temponote.dx + temponote.w;
				var width = -0.6;
				stem = new ABCJS.write.RelativeElement(null, dx, 0, p1, {"type": "stem", "pitch2": p2, linewidth: width});
				abselem.addExtra(stem);
			}
			abselem.x = x;
			//abselem.draw(renderer, null);
			temponote.draw(renderer, x);
			if (stem)
				stem.draw(renderer, x);
			x += (abselem.w + 5);
			var str = "= " + this.tempo.bpm;
			text = renderer.renderText(x, y + noteHeight, str, 'tempofont', 'tempo', "start");
			var postWidth = text.getBBox().width;
			var charWidth2 = postWidth / str.length; // Just get some average number to increase the spacing.
			x += postWidth + charWidth2;
			//totalHeight = Math.max(totalHeight, text.getBBox().height);
		}
		if (this.tempo.postString) {
			renderer.renderText(x, y + noteHeight, this.tempo.postString, 'tempofont', 'tempo', "start");
			//totalHeight = Math.max(totalHeight, text.getBBox().height);
		}
	};
})();
