//    abc_tie_element.js: Definition of the TieElement class.
//    Copyright (C) 2010,2014 Gregory Dyke (gregdyke at gmail dot com) and Paul Rosen
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

ABCJS.write.TieElem = function(anchor1, anchor2, above, forceandshift) {
	this.anchor1 = anchor1; // must have a .x and a .pitch, and a .parent property or be null (means starts at the "beginning" of the line - after keysig)
	this.anchor2 = anchor2; // must have a .x and a .pitch property or be null (means ends at the end of the line)
	this.above = above; // true if the arc curves above
	this.force = forceandshift; // force the arc curve, regardless of beaming if true
	// move by +7 "up" by -7 if "down"
};

ABCJS.write.TieElem.prototype.draw = function (renderer, linestartx, lineendx) {
	var startpitch;
	var endpitch;

	if (this.startlimitelem) {
		linestartx = this.startlimitelem.x+this.startlimitelem.w;
	}

	if (this.endlimitelem) {
		lineendx = this.endlimitelem.x;
	}
	// PER: We might have to override the natural slur direction if the first and last notes are not in the
	// save direction. We always put the slur up in this case. The one case that works out wrong is that we always
	// want the slur to be up when the last note is stem down. We can tell the stem direction if the top is
	// equal to the pitch: if so, there is no stem above it.
	if (!this.force && this.anchor2 && this.anchor2.pitch === this.anchor2.top)
		this.above = true;

	if (this.anchor1) {
		linestartx = this.anchor1.x;
		startpitch = this.above ? this.anchor1.highestVert : this.anchor1.pitch;
		if (!this.anchor2) {
			endpitch = this.above ? this.anchor1.highestVert : this.anchor1.pitch;
		}
	}

	if (this.anchor2) {
		lineendx = this.anchor2.x;
		endpitch = this.above ? this.anchor2.highestVert : this.anchor2.pitch;
		if (!this.anchor1) {
			startpitch = this.above ? this.anchor2.highestVert : this.anchor2.pitch;
		}
	}

	//  if (this.anchor1 && this.anchor2) {
	//    if ((!this.force && this.anchor1.parent.beam && this.anchor2.parent.beam &&
	//	 this.anchor1.parent.beam.asc===this.anchor2.parent.beam.asc) ||
	//	((this.force==="up") || this.force==="down") && this.anchor1.parent.beam && this.anchor2.parent.beam && this.anchor1.parent.beam===this.anchor2.parent.beam) {
	//      this.above = !this.anchor1.parent.beam.asc;
	//      preservebeamdir = true;
	//    }
	//  }

	//  var pitchshift = 0;
	//  if (this.force==="up" && !preservebeamdir) pitchshift = 7;
	//  if (this.force==="down" && !preservebeamdir) pitchshift = -7;

	//	renderer.debugMsgLow(linestartx, debugMsg);
	renderer.drawArc(linestartx, lineendx, startpitch, endpitch,  this.above);

};
